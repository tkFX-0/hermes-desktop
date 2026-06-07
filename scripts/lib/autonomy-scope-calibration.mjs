/**
 * §7 封印（狭義）と L0-L2 / L3+ 権限ラダーの再校正。
 * 「MQL5」「EA」「トレード」単体では HOLD にしない。実接続・実発注・物理制御で判定する。
 */

/** @typedef {"GO" | "HOLD"} AutonomyScopeDecision */
/** @typedef {"L0-L2" | "L3+" | "§7"} AutonomyScopeBand */

/**
 * @typedef {object} AutonomyScopeClassification
 * @property {AutonomyScopeDecision} decision
 * @property {AutonomyScopeBand} band
 * @property {number} autonomyLevel
 * @property {string} reason
 * @property {boolean} sealed
 * @property {string} [sealedCategory]
 * @property {boolean} [needsTkApproval]
 */

const SECTION7_MT5_LIVE = [
  /MT5.{0,24}(接続|ログイン|連携|ターミナル|ブラウザ|起動して|立ち上げ)/i,
  /(接続|ログイン|連携).{0,24}MT5/i,
  /MT5.{0,24}(発注|注文|売買|エントリー|決済|ポジション|ロット)/i,
  /(発注|注文|売買|エントリー|決済).{0,24}(MT5|実口座|ライブ|リアル)/i,
  /(実口座|ライブ口座|リアル口座|本番口座).{0,24}(操作|売買|発注|注文|接続)/i,
  /自動売買.{0,12}(開始|有効|起動|ON|稼働)/i,
  /EA.{0,12}(起動|稼働|ライブ|実口座).{0,12}(売買|発注|注文)?/i,
];

const SECTION7_STACKCHAN_PHYSICAL = [
  /StackChan.{0,24}(動か|モーション|サーボ|カメラ|物理|首|腕)/i,
  /(物理|実機).{0,16}(制御|操作|動か)/i,
  /!sc\s+(motion|move|pan|tilt|camera)/i,
];

const L3_APPROVAL_PATTERNS = [
  /SOUL\.md.{0,16}(変更|更新|書き|反映)/i,
  /\.env\b/i,
  /\b(api[_-]?key|token|secret|password)\b/i,
  /\brm\s+-rf\b/i,
  /npm\s+(install|i|add)\s+[@\w]/i,
  /本番.{0,12}(反映|デプロイ|リリース|公開)/i,
  /productionReady/i,
  /execution\s*=\s*enabled/i,
];

const L0_L2_SIGNALS = [
  /MQL5|mq5|EA|バックテスト|backtest|シミュレーション|simulation/i,
  /リサーチ|調査|research|記事|ドキュメント|docs?/i,
  /Skill|スキル|テンプレ|template/i,
  /git\s+(branch|commit|checkout)/i,
  /コード.{0,8}(書|作成|実装|下書)/i,
];

/**
 * @param {string} text
 * @returns {string | null}
 */
function detectSection7Category(text) {
  const value = String(text ?? "");
  if (SECTION7_MT5_LIVE.some((p) => p.test(value))) return "mt5_live_or_real_order";
  if (SECTION7_STACKCHAN_PHYSICAL.some((p) => p.test(value))) return "stackchan_physical_control";
  return null;
}

/**
 * @param {string} text
 */
function estimateL0L2Level(text) {
  if (/リサーチ|調査|research|記事/i.test(text)) return 1;
  if (/MQL5|mq5|EA|バックテスト|コード|Skill|テンプレ/i.test(text)) return 2;
  return 1;
}

/**
 * @param {string} text
 * @returns {AutonomyScopeClassification}
 */
export function classifyAutonomyRequest(text) {
  const message = String(text ?? "").trim();
  if (!message) {
    return {
      decision: "GO",
      band: "L0-L2",
      autonomyLevel: 0,
      reason: "empty request",
      sealed: false,
    };
  }

  const sealedCategory = detectSection7Category(message);
  if (sealedCategory) {
    return {
      decision: "HOLD",
      band: "§7",
      autonomyLevel: 7,
      reason:
        sealedCategory === "stackchan_physical_control"
          ? "§7封印: StackChan 物理制御は tk 承認・humanGo 必須"
          : "§7封印: MT5 実接続・リアル発注・実口座操作は禁止",
      sealed: true,
      sealedCategory,
    };
  }

  if (L3_APPROVAL_PATTERNS.some((p) => p.test(message))) {
    return {
      decision: "HOLD",
      band: "L3+",
      autonomyLevel: 3,
      reason: "L3+: SOUL/.env/新規npm/危険削除など tk 承認が必要（git push・merge は check 緑で L2）",
      sealed: false,
      needsTkApproval: true,
    };
  }

  const level = estimateL0L2Level(message);
  const l0l2Hint = L0_L2_SIGNALS.some((p) => p.test(message))
    ? "リサーチ・非デプロイ実装・ドキュメント・テンプレは L0-L2 自動実行可"
    : "通常の会話・計画は L0-L2";

  return {
    decision: "GO",
    band: "L0-L2",
    autonomyLevel: level,
    reason: l0l2Hint,
    sealed: false,
  };
}

/**
 * @param {AutonomyScopeClassification} scope
 */
export function formatSection7HoldReply(scope) {
  const lines = [
    "🛡️ **しずめ** — §7 封印のため HOLD です。",
    scope.reason,
    "",
    "§7 に含まれるのは **MT5 実接続・リアル発注・実口座操作・StackChan 物理制御** のみです。",
    "MQL5 コード作成・バックテスト(シミュ)・リサーチ・Skill/テンプレ作成は L0-L2 で実行できます。",
    "続行するには tk の明示 GO が必要です。",
  ];
  return lines.join("\n");
}

/**
 * Prompt block for agents (system context).
 */
export function buildAutonomyScopePromptBlock() {
  return `[権限ラダー — full autonomy calibration]
・§7封印: MT5実接続・リアル発注・実口座操作・StackChan物理制御 のみ
・L2自動可: git push(check緑後) / mainマージ(しずめGO+check緑) / 許可ドメイン外部送信 / Dreaming汚染なしUSER反映 / git済みファイル削除 / npm update
・L3+ tk承認: ホワイトリスト外外部送信 / SOUL.md / .env・secrets / 新規npm / 未コミット削除 / rm -rf
・SOUL.md: manual only（自動変更経路ゼロ）
・「MQL5」「EA」「トレード」単体では §7 HOLD にしない`;
}

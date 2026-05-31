/**
 * Discord ! コマンド一覧（ピン留め / !help 用）
 */

import { safeDiscordContent } from "./discord-text-safe.mjs";

/** @typedef {{ id: string, cmd: string, desc: string, room?: string }} CmdRow */

/** @type {readonly { title: string, room: string, rows: CmdRow[] }[]} */
export const DISCORD_COMMAND_SECTIONS = [
  {
    title: "司令部 — 状況・開発",
    room: "DISCORD_COMMAND_CHANNEL_ID",
    rows: [
      { id: "room", cmd: "!部屋状況 / !room-status", desc: "スレッド記憶 + agent-log + 履歴 hydrate" },
      { id: "reply", cmd: "!reply-status", desc: "Groq / WSL-Claude 応答経路" },
      { id: "dev", cmd: "!dev-pipeline", desc: "WSL 開発レーン状態" },
      { id: "kaihatu", cmd: "!kaihatu <指示>", desc: "WSL 開発 → 自動レビュー（しずめ）" },
      { id: "kaihatu-t", cmd: "!kaihatu-test / !kaihatu test", desc: "自動レビューのみ（開発未実行）" },
      { id: "slot-dev", cmd: "!kaihatuslot <指示>", desc: "スロット自律ループ（本番適用 H）" },
      { id: "multi", cmd: "!multi-room-test", desc: "ポートフォリオ→対話テスト" },
      { id: "hgo", cmd: "!human-go", desc: "Human GO  readiness" },
      { id: "gov", cmd: "!governance", desc: "統制ログ直近" },
      { id: "obs", cmd: "!obsidian-status", desc: "Obsidian vault 状態" },
      { id: "agent", cmd: "!エージェント状態", desc: "各エージェント直近決定" },
      { id: "help", cmd: "!help / !コマンド", desc: "この一覧" },
      { id: "status", cmd: "!status", desc: "Bot 簡易ヘルス" },
      { id: "tnt", cmd: "!tnt", desc: "SideBot 再起動（司令部・運用者）" },
      { id: "av", cmd: "!avatars-sync", desc: "6体 Webhook 画像を再同期" },
      { id: "wf", cmd: "!workflow enqueue / resume / continue / done", desc: "自律開発（B=continue で次cycle dev）" },
      { id: "autop", cmd: "!autonomy progress", desc: "完全自律までの進捗%・停止要因" },
      { id: "esc", cmd: "!execution-scope", desc: "MT5 BT / 自律開発 の実行スコープ" },
      { id: "og", cmd: "!orchestrator-gates / !gates", desc: "オーケストレータ停止要因の洗い出し" }
    ]
  },
  {
    title: "エージェント・テスト",
    room: "司令部（推奨）",
    rows: [
      { id: "atest", cmd: "!agent-test", desc: "6体順番応答（API課金なし）" },
      { id: "seq", cmd: "順番での回答", desc: "同上" },
      { id: "mem", cmd: "!memory", desc: "長期記憶表示" },
      { id: "rem", cmd: "!remember key: value", desc: "長期記憶に保存" }
    ]
  },
  {
    title: "ちはや / FX",
    room: "司令部",
    rows: [
      { id: "fxc", cmd: "killzone / ea報告 / リスク計算", desc: "ちはや自然言語（HOLD 時停止）" }
    ]
  },
  {
    title: "スロット開発（HOLD 本番）",
    room: "司令部",
    rows: [
      { id: "s1", cmd: "スロット開始 <タスク>", desc: "隔離スロットを開く" },
      { id: "s2", cmd: "スロット開発 <file> <指示>", desc: "スロット内コード生成" },
      { id: "s3", cmd: "スロット自律 <目標>", desc: "最大8 step 自律" },
      { id: "s4", cmd: "スロット確認 / 適用 / キャンセル", desc: "差分・HOLD 適用・破棄" },
      { id: "code", cmd: "コード提案 <file> <指示>", desc: "Coding-HOLD 提案" },
      { id: "cok", cmd: "コード承認 / コード却下", desc: "本番反映ゲート" }
    ]
  },
  {
    title: "StackChan",
    room: "司令部",
    rows: [
      { id: "sc", cmd: "!sc help", desc: "身体操作コマンド一覧" },
      { id: "scst", cmd: "!sc status", desc: "接続・VOICEVOX" }
    ]
  },
  {
    title: "対話・ポートフォリオ",
    room: "各チャンネル",
    rows: [
      { id: "dlg", cmd: "（対話部屋）! のみ応答", desc: "非 ! はスキップ（仕様）" },
      { id: "pf", cmd: "（ポートフォリオ）投稿", desc: "しるべ受領 + 任意で対話転送 G" }
    ]
  },
  {
    title: "Runtime Skills（Bot プロンプト注入）",
    room: "司令部・Cursor 共通",
    rows: [
      { id: "sk-cr", cmd: "（話題）コードレビュー", desc: "shikishima-code-reviewer · !kaihatu 連携" },
      { id: "sk-ma", cmd: "（話題）みんなで/順番", desc: "shikishima-multi-agent · !agent-test" },
      { id: "sk-kz", cmd: "（話題）原因/なぜなぜ", desc: "shikishima-kaizen-rca · !部屋状況" },
      { id: "sk-gh", cmd: "（話題）リポジトリ分析", desc: "shikishima-github-analyzer · 読取のみ" }
    ]
  },
  {
    title: "メンション・会話",
    room: "司令部",
    rows: [
      { id: "at", cmd: "@しきしま / @つむぎ …", desc: "担当エージェント指定" },
      { id: "bot", cmd: "@Bot（本文なし）", desc: "要約 + 次の一手（しきしま）" },
      { id: "chat", cmd: "通常文", desc: "スレッド記憶付き LLM 会話" }
    ]
  }
];

const PIN_FOOTER = [
  "",
  "**Skills**: Cursor `skills/shikishima-*` + Discord `!`/`スレッド`（MT5/EAスキルではない）",
  "安全: decision=HOLD / execution=disabled / 本番 GO は人間承認",
  "更新: 2026-05-30 · `!help` · docs/shikishima/REFERENCE_SKILLS_KARAAGE.md"
].join("\n");

/**
 * @param {{ compact?: boolean }} [opts]
 */
export function buildDiscordCommandPinMessage(opts = {}) {
  const lines = [
    "🏯 **しきしま — Discord コマンド一覧**（ピン用）",
    "表記: **G**=利用可 **H**=人間GO必要",
    ""
  ];

  for (const sec of DISCORD_COMMAND_SECTIONS) {
    lines.push(`**■ ${sec.title}** (${sec.room})`);
    for (const r of sec.rows) {
      lines.push(`• \`${r.cmd}\` — ${r.desc}`);
    }
    lines.push("");
  }

  lines.push(PIN_FOOTER);
  const body = lines.join("\n");
  if (!opts.compact && body.length > 1900) {
    return buildDiscordCommandPinMessage({ compact: true });
  }
  if (opts.compact) {
    const short = [
      "🏯 **しきしま — ! コマンド（要約）**",
      "",
      "**司令部**",
      "`!help` `!部屋状況` `!reply-status` `!dev-pipeline`",
      "`!kaihatu` `!kaihatu-test` `!kaihatuslot` `!multi-room-test`",
      "`!human-go` `!governance` `!obsidian-status` `!エージェント状態` `!status` `!tnt` `!avatars-sync`",
      "",
      "**テスト** `!agent-test` · **記憶** `!memory` `!remember k: v`",
      "**EA/MT5** → @つむぎ · **SC** `!sc help`",
      "**スロット** スロット開始/開発/自律/確認/適用 · **コード** 提案/承認/却下",
      "",
      "**会話** @しきしま / @つむぎ · @Bot のみ可 · 通常文=スレッド記憶",
      "**Skills** Cursor+Discord（≠EA）· 詳細 REFERENCE_SKILLS_KARAAGE.md",
      "**対話部屋** `!` のみ · **ポートフォリオ** 成果置き場",
      "",
      PIN_FOOTER,
      "",
      "全文: `docs/shikishima/DISCORD_COMMAND_PIN.md`"
    ].join("\n");
    return safeDiscordContent(short);
  }
  return safeDiscordContent(body.slice(0, 1900));
}

/**
 * @param {object} status
 */
export function buildDiscordQuickStatusMessage(status = {}) {
  const lines = [
    "🏯 **しきしま** — `!status`",
    `時刻: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    `Bot PID: ${status.pid ?? "?"}`,
    `スレッド記憶: ${status.threadMemory ? "ON" : "ON"}`,
    `Discord @me: ${status.botUserId ? `${String(status.botUserId).slice(0, 6)}…` : "未取得"}`,
    `decision: **HOLD** / execution: **disabled**`,
    "",
    "詳細: `!reply-status` `!部屋状況` `!dev-pipeline` `!human-go`",
    "一覧: `!help`"
  ];
  return safeDiscordContent(lines.join("\n"));
}

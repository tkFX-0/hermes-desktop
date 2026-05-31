/**
 * AT-AGENT-00 — 5エージェント定義 (Canonical)
 * しきしま / しずめ / つむぎ / はじめ / しるべ
 *
 * 設計思想: 硬い機械的システムではなく、
 * 柔らかくて落ち着いた、でも役割境界が明確な5人組
 *
 * Main / Renderer 両方から import 可能 (no Node.js dependencies)
 */

export type AgentId =
  | "shikishima"
  | "shizume"
  | "tsumugi"
  | "hajime"
  | "shirube";

export type AgentShortId = "しき" | "しず" | "つむ" | "はじ" | "しるべ";

export interface AgentDefinition {
  readonly id: AgentId;
  readonly name: string;          // 正式名
  readonly short: AgentShortId;   // 短縮呼び名
  readonly role: string;          // 一言役割
  readonly description: string;   // 詳細説明
  readonly color: string;         // テーマカラー
  readonly icon: string;          // 絵文字アイコン
  readonly primaryWorker: string; // 使用AIサービス
  readonly callExamples: readonly string[]; // 呼び方例
}

export const AGENT_DEFINITIONS: readonly AgentDefinition[] = [
  {
    id: "shikishima",
    name: "しきしま",
    short: "しき",
    role: "管制塔 · 全体オーケストレーター · ユーザー窓口",
    description:
      "全体をまとめる司令室。ユーザーとの会話・GO/HOLD/DEFER判断・" +
      "各エージェントへの振り分け・現在地と次アクション提示を担う。",
    color: "#58a6ff",
    icon: "🏯",   // 城 — しきしまの名前にちなんだ管制塔
    primaryWorker: "Groq (llama-3.3-70b) → Grok 4.3 fallback",
    callExamples: [
      "しき、今日の状態まとめて",
      "しき、次どこから進める？",
      "しき、このGateの優先度出して",
    ],
  },
  {
    id: "shizume",
    name: "しずめ",
    short: "しず",
    role: "安全ゲート · 暴走防止 · ブレーキ役",
    description:
      "GO/HOLD/REJECT判定、productionReady/execution/rawValues監視、" +
      "token・secret保護、人間GOなし実行の停止。しきしまの良心。",
    color: "#f0883e",
    icon: "🛡️",  // 盾 — 守護・安全係。錠前より柔らかい守りのイメージ
    primaryWorker: "Claude Sonnet 4.6 (精度優先)",
    callExamples: [
      "しず、これはHOLD？",
      "しず、このpushは安全？",
      "しず、外部送信していい状態？",
    ],
  },
  {
    id: "tsumugi",
    name: "つむぎ",
    short: "つむ",
    role: "実装 · コード · Task生成 · Worker接続",
    description:
      "ClaudeCode/CodexへのTask作成、TypeScript/React/Electron実装、" +
      "docs→実装変換、テスト/typecheck/lint指示、Worker切り替え判断。" +
      "名前の由来: コード・仕様・機能を'紡ぐ'から。",
    color: "#3fb950",
    icon: "🪡",  // 糸巻き — 名前「つむぐ」の由来そのまま
    primaryWorker: "Claude Sonnet 4.6 (実装) / Claude Haiku 4.5 (軽量)",
    callExamples: [
      "つむ、ClaudeCode Task作って",
      "つむ、Codexに渡すStackChan指示にして",
      "つむ、この設計を実装Taskに分解して",
    ],
  },
  {
    id: "hajime",
    name: "はじめ",
    short: "はじ",
    role: "計画 · 設計 · 最初の一歩 · ロードマップ",
    description:
      "次に何から始めるか決定、Phase分解、Gate順序整理、依存関係整理、" +
      "長期ロードマップ作成。複数タスクが並ぶほど重要になる参謀役。",
    color: "#bc8cff",
    icon: "🧭",  // コンパス — 最初の一歩・方向を指し示す参謀
    primaryWorker: "Gemini 2.5 Pro (complex) / Sonnet 4.6 (medium) / Haiku (simple)",
    callExamples: [
      "はじ、次の一歩を決めて",
      "はじ、完全自立運用までの順番出して",
      "はじ、今日やるGateを1つ選んで",
    ],
  },
  {
    id: "shirube",
    name: "しるべ",
    short: "しるべ",
    role: "記録 · 知識 · ログ · Obsidian · 引き継ぎ",
    description:
      "docs/evidence/daily log管理、Obsidian記録、作業ログ作成、" +
      "引き継ぎ書作成、Gate履歴整理、過去経緯検索、迷子防止。" +
      "実運用に入るほど必須になる記憶役。",
    color: "#ffa657",
    icon: "🕯️",  // 蝋燭 — 暗闇を照らす記憶・道しるべの光
    primaryWorker: "Hermes Research (live検索) / Claude Haiku (記録)",
    callExamples: [
      "しる、作業ログ残して",
      "しる、今日のGate結果まとめて",
      "しる、次チャット用の引き継ぎ書作って",
    ],
  },
] as const;

// ─── Worker definitions ───────────────────────────────────────────────────────

export type WorkerId = "claude-code" | "codex" | "hermes-research" | "groq" | "grok";

export interface WorkerDefinition {
  readonly id: WorkerId;
  readonly name: string;
  readonly scope: string;
  readonly assignedAgent: AgentId;
  readonly status: "active" | "needs-setup" | "hold";
  readonly setupNote?: string;
}

export const WORKER_DEFINITIONS: readonly WorkerDefinition[] = [
  {
    id: "claude-code",
    name: "ClaudeCode (Claude Sonnet 4.6)",
    scope: "しきしまCore — Electron/React/TypeScript/Discord/Obsidian",
    assignedAgent: "tsumugi",
    status: "active",
  },
  {
    id: "codex",
    name: "Codex CLI (v0.133.0)",
    scope: "StackChan専用 — firmware/M5Stack/VOICEVOX/音声",
    assignedAgent: "tsumugi",
    status: "needs-setup",
    setupNote: "OPENAI_API_KEY を .env.local に追加で有効化",
  },
  {
    id: "hermes-research",
    name: "Hermes Research (Grok 4.3 + x_search)",
    scope: "リアルタイム情報 — X search / 速報 / FX分析",
    assignedAgent: "shirube",
    status: "active",
  },
  {
    id: "groq",
    name: "Groq (llama-3.3-70b-versatile)",
    scope: "しきしまmedium会話バックアップ — クラウド・無料・高速",
    assignedAgent: "shikishima",
    status: "needs-setup",
    setupNote: "GROQ_API_KEY を .env.local に追加 (console.groq.com 無料・ローカル不要)",
  },
  {
    id: "grok",
    name: "Grok 4.3 (xai-oauth)",
    scope: "FX分析・Hermes fallback — X Premium サブスク内",
    assignedAgent: "shikishima",
    status: "active",
  },
] as const;

// ─── Helper functions ─────────────────────────────────────────────────────────

export function getAgentDef(id: AgentId): AgentDefinition {
  const def = AGENT_DEFINITIONS.find((a) => a.id === id);
  if (!def) throw new Error(`Unknown agent: ${id}`);
  return def;
}

export function agentLabelFull(id: AgentId): string {
  const def = getAgentDef(id);
  return `[${def.name}]`;
}

/** Discord / StackChan 返答プレフィックス */
export function agentReplyPrefix(id: AgentId): string {
  const def = getAgentDef(id);
  return `${def.icon} **${def.name}**`;
}

/** 短縮名からAgentIdへ */
export function resolveAgentId(nameOrShort: string): AgentId | null {
  const lower = nameOrShort.trim();
  for (const def of AGENT_DEFINITIONS) {
    if (def.name === lower || def.short === lower || def.id === lower) {
      return def.id;
    }
  }
  return null;
}

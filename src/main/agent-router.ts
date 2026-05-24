// 5-Agent Router — Shikishima Agent Team (AT-AGENT-00)
// しきしま(管制) / しずめ(安全) / つむぎ(実装) / はじめ(計画) / しるべ(記録)
// Claude (Opus/Sonnet/Haiku) + Groq + Hermes Research + Codex

import { grokChat, type GrokChatResult } from "./shikishima-grok-chat";
import { claudeCodeTask, selectClaudeModel, type ClaudeCodeResult } from "./claude-code-service";
import { codexTask, codexReview, checkCodexAvailability, exportCodexTaskMd, type CodexResult } from "./codex-service";
import { runHermesResearch, type HermesResearchResult } from "./hermes-research-runner";
import { groqChat, selectGroqModel, checkGroqAvailability, type GroqResult } from "./groq-service";
import { geminiChat, selectGeminiModel, checkGeminiAvailability, type GeminiResult } from "./gemini-service";
import { buildFullMemoryContext } from "./memory-network";
import { buildContextPrefix } from "./conversation-context";
import { type AgentId, agentReplyPrefix, resolveAgentId, AGENT_DEFINITIONS } from "./agent-definitions";
import { withPersona } from "./agent-persona";
import { detectSkill, executeSkill } from "./agent-skills/skill-registry";
import type { SkillId } from "./agent-skills/skill-types";

// Re-export AgentId from canonical definitions
export type { AgentId };

export type Complexity = "simple" | "medium" | "complex";

export interface AgentDecision {
  agentId: AgentId;
  complexity: Complexity;
  reasoning: string;
}

export interface AgentResult {
  success: boolean;
  reply: string;
  agentId: AgentId;
  durationMs: number;
  error?: string;
}

// ─── Routing keywords ────────────────────────────────────────────────────────

// つむぎ(StackChan scope) → Codex Worker
const STACKCHAN_KW = [
  "スタックチャン", "StackChan", "stackchan", "VOICEVOX", "pet-fw",
  "ws://", "WebSocket", "PCM", "音声", "発話", "顔", "感情", "face_mode",
];

// つむぎ(しきしまCore) → Claude Code Worker
const TSUMUGI_KW = [
  "コードを書", "実装して", "作って", "修正して", "バグ", "デバッグ",
  "TypeScript", "Python", "JavaScript", "関数", "クラス", "スクリプト",
  "プログラム", "コード", "ファイルを", "テストを", "typecheck", "lint",
  "write code", "implement", "function", "fix", "bug", "script",
  "refactor", "migrate", "component", "UIを",
];

// つむぎ: コードレビュー (Codex — StackChan scope優先、それ以外はClaudeCode)
const REVIEW_KW = [
  "レビューして", "コードレビュー", "audit", "code review", "inspect",
];

// はじめ: 計画・設計・最初の一手
const HAJIME_KW = [
  "計画して", "設計して", "ロードマップ", "順番を決めて", "何から",
  "最初に", "どうやって始める", "タスク分解", "依存関係",
  "plan", "design", "roadmap", "first step", "how to start",
  "architecture", "アーキテクチャ", "次のステップ", "何をすべき",
];

// しずめ: 安全・HOLD・危険チェック
const SHIZUME_KW = [
  "HOLD", "GO", "安全", "危険", "リスク", "ブロック",
  "本当にやっていい", "やって大丈夫", "productionReady",
  "外部送信", "自動実行", "本番", "production",
  "is this safe", "should we stop", "reject",
];

// しるべ: 記録・検索・ログ
const SHIRUBE_KW = [
  "調べて", "検索して", "探して", "ニュース", "最新", "x_search",
  "速報", "トレンド", "ログ", "記録して", "残して", "引き継ぎ",
  "過去に", "履歴", "docs", "作業ログ",
  "search", "find", "latest", "news", "research", "log",
];

// ちはや: FX専任（しきしまから分離）
const FX_KW = [
  "FX", "XAUUSD", "gold", "ゴールド",
  "kill zone", "キルゾーン", "Silver Bullet", "スキャルピング", "ロット",
  "相場", "テクニカル", "ファンダメンタル", "支持線", "抵抗線",
  "EA", "MT5", "ea_report", "killzone", "risk_calc",
];

// 呼びかけによる直接指定
const AGENT_CALL: Array<[RegExp, AgentId]> = [
  [/^(しき|しきしま)[、,、\s]/, "shikishima"],
  [/^(しず|しずめ)[、,、\s]/, "shizume"],
  [/^(つむ|つむぎ)[、,、\s]/, "tsumugi"],
  [/^(はじ|はじめ)[、,、\s]/, "hajime"],
  [/^(しるべ|しる)[、,、\s]/, "shirube"],
  [/^(ちは|ちはや)[、,、\s]/, "chihaya"],
];

// ─── Complexity estimation ────────────────────────────────────────────────────

const COMPLEX_KW = ["詳しく", "包括的に", "全体的に", "thoroughly", "comprehensive"];

function estimateComplexity(text: string): Complexity {
  const words = text.trim().split(/\s+/).length;
  if (words > 60 || COMPLEX_KW.some((k) => text.includes(k))) return "complex";
  if (words > 20) return "medium";
  return "simple";
}

// ─── Routing logic ────────────────────────────────────────────────────────────

function matchesAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

export function routeTask(userMessage: string): AgentDecision {
  const complexity = estimateComplexity(userMessage);

  // 1. 直接呼びかけによる指定（最優先）
  for (const [pattern, agentId] of AGENT_CALL) {
    if (pattern.test(userMessage)) {
      return { agentId, complexity, reasoning: `direct call → ${agentId}` };
    }
  }

  // 2. しずめ — 安全・HOLD判定
  if (matchesAny(userMessage, SHIZUME_KW)) {
    return { agentId: "shizume", complexity, reasoning: "safety/HOLD keywords → しずめ" };
  }

  // 3. つむぎ — StackChan実装 → Codex Worker
  if (matchesAny(userMessage, STACKCHAN_KW) && matchesAny(userMessage, TSUMUGI_KW)) {
    return { agentId: "tsumugi", complexity, reasoning: "StackChan+coding → つむぎ(Codex)" };
  }

  // 4. つむぎ — コードレビュー → Codex (StackChan scope) / ClaudeCode (それ以外)
  if (matchesAny(userMessage, REVIEW_KW)) {
    const isStackchan = matchesAny(userMessage, STACKCHAN_KW);
    return {
      agentId: "tsumugi",
      complexity,
      reasoning: isStackchan
        ? "StackChan review → つむぎ(Codex)"
        : "review → つむぎ(ClaudeCode)",
    };
  }

  // 5. つむぎ — しきしまCore実装 → Claude Code Worker
  if (matchesAny(userMessage, TSUMUGI_KW)) {
    return { agentId: "tsumugi", complexity, reasoning: "coding → つむぎ(ClaudeCode)" };
  }

  // 5. はじめ — 計画・設計
  if (matchesAny(userMessage, HAJIME_KW)) {
    return { agentId: "hajime", complexity, reasoning: "planning keywords → はじめ" };
  }

  // 6. しるべ — 記録・検索
  if (matchesAny(userMessage, SHIRUBE_KW)) {
    return { agentId: "shirube", complexity, reasoning: "research/log keywords → しるべ" };
  }

  // 7. ちはや — FX専任
  if (matchesAny(userMessage, FX_KW)) {
    return { agentId: "chihaya", complexity, reasoning: "FX keywords → ちはや(FX専任)" };
  }

  // 8. しきしま — デフォルト会話
  return { agentId: "shikishima", complexity, reasoning: "general → しきしま" };
}

// ─── Agent 1: しきしま — 管制・会話・FX ──────────────────────────────────────

// ─── Memory-aware prompt builder ─────────────────────────────────────────────
// ルーティングは元メッセージで行い、AIへの実際のプロンプトに記憶を付加する
// 上限500字に切り詰めてhermesコマンドの長さ問題を防ぐ

function buildPromptWithMemory(userMessage: string): string {
  const shortTerm = buildContextPrefix();
  const fullCtx = buildFullMemoryContext(shortTerm);
  // 上限500字 (hermesコマンドの引数が長くなりすぎないよう制限)
  const trimmedCtx = fullCtx.slice(0, 500);

  // 現在日時 (JST) を注入 — AIが日時を幻覚しないようにする
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const nowStr = `${now.getUTCFullYear()}年${String(now.getUTCMonth()+1).padStart(2,"0")}月` +
    `${String(now.getUTCDate()).padStart(2,"0")}日 ` +
    `${String(now.getUTCHours()).padStart(2,"0")}:${String(now.getUTCMinutes()).padStart(2,"0")} JST`;
  const timeHeader = `[現在日時: ${nowStr}]`;

  const base = trimmedCtx ? `${trimmedCtx}\n${timeHeader}` : timeHeader;
  return `${base}\n\nユーザー: ${userMessage}`;
}

// ────────────────────────────────────────────────────────────────────────────
// モデル選択戦略 2026-05
//   通常会話: Groq llama (優先・無料) → Claude (最終)
//   Grok 4.3 はリサーチ専用 (ちはや FX / しるべ x_search のみ)
// ────────────────────────────────────────────────────────────────────────────

async function runShikishima(message: string, isFx: boolean, complexity: Complexity): Promise<AgentResult> {
  const start = Date.now();

  // FX分析 → Hermes Research (Grok x_search)
  if (isFx) {
    const res: HermesResearchResult = await runHermesResearch(
      `FX・XAUUSD・プロップファーム観点で以下を分析して: ${message}`
    );
    console.log("[しきしま] Hermes Research FX mode");
    if (res.success && res.content) return { success: true, reply: res.content, agentId: "shikishima", durationMs: Date.now() - start };
  }

  const prompt = withPersona("shikishima", buildPromptWithMemory(message));

  // 1. Groq — 無料・高速・最優先
  const groqAvail = checkGroqAvailability();
  if (groqAvail.available) {
    const r: GroqResult = await groqChat(prompt, selectGroqModel(complexity));
    console.log("[しきしま] groq");
    if (r.success) return { success: true, reply: r.reply, agentId: "shikishima", durationMs: Date.now() - start };
    console.warn("[しきしま] Groq failed:", r.error);
  }

  // 2. Claude — 最終手段 (Grok は通常会話では使用しない)
  const claude: ClaudeCodeResult = await claudeCodeTask(prompt, selectClaudeModel(complexity));
  console.log("[しきしま] claude fallback");
  if (claude.success) return { success: true, reply: claude.output, agentId: "shikishima", durationMs: Date.now() - start };

  return { success: false, reply: "サービスが一時的に利用できません (Groq/Claude すべて失敗)。", agentId: "shikishima", durationMs: Date.now() - start, error: claude.error };
}

// ─── Agent 2: しずめ — 安全ゲート ────────────────────────────────────────────

async function runShizume(message: string): Promise<AgentResult> {
  const start = Date.now();

  // SK-SHI-Z03: まず秘密スキャンを自動実行
  const skill = detectSkill("shizume", message);
  if (skill) {
    const out = await executeSkill(skill.id as SkillId, { raw: message }, { agentId: "shizume" });
    return { success: out.success, reply: out.result, agentId: "shizume", durationMs: Date.now() - start };
  }

  // しずめ: フルペルソナ + Claude Sonnet (精度優先)
  const result: ClaudeCodeResult = await claudeCodeTask(withPersona("shizume", message), "claude-sonnet-4-6");
  if (result.success) return { success: true, reply: result.output, agentId: "shizume", durationMs: Date.now() - start };

  // Claude失敗 → Groq (信頼性高・無料)
  console.warn("[しずめ] Claude failed, Groq fallback");
  const groqAvail = checkGroqAvailability();
  if (groqAvail.available) {
    const groq: GroqResult = await groqChat(withPersona("shizume", message), "llama-3.3-70b-versatile");
    if (groq.success) return { success: true, reply: groq.reply, agentId: "shizume", durationMs: Date.now() - start };
    console.warn("[しずめ] Groq failed:", groq.error);
  }

  // 安全エージェントが全滅した場合は明示的なエラーメッセージ
  console.error("[しずめ] All backends failed — returning safety hold message");
  return {
    success: true,
    reply: "⚠️ しずめ: バックエンドに接続できません。安全のため操作を保留します。",
    agentId: "shizume",
    durationMs: Date.now() - start,
    error: result.error,
  };
}

// ─── Agent 3: つむぎ — Worker振り分け ────────────────────────────────────────
// StackChan scope → Codex (if OPENAI_API_KEY present) → ClaudeCode fallback
// Shikishima Core scope → ClaudeCode
// Codex unavailable → ClaudeCode or HOLD (never Ollama)

type TsumugiMode = "codex_stackchan" | "claude_core" | "review_codex" | "review_claude";

async function runTsumugi(message: string, mode: TsumugiMode): Promise<AgentResult> {
  const start = Date.now();

  // Codex path (StackChan scope or StackChan review)
  if (mode === "codex_stackchan" || mode === "review_codex") {
    const avail = checkCodexAvailability();
    if (avail.apiKeyPresent) {
      const fn = mode === "review_codex" ? codexReview : codexTask;
      const result: CodexResult = await fn(message);
      if (result.success) {
        return {
          success: true,
          reply: `[Codex] ${result.output}`,
          agentId: "tsumugi",
          durationMs: Date.now() - start,
        };
      }
      // Codex failed → fallback to ClaudeCode (not Ollama)
      console.warn("[つむぎ] Codex failed, falling back to ClaudeCode:", result.error);
    } else {
      // No API key → Phase 1 HOLD: generate Task.md for human
      const taskMd = exportCodexTaskMd(
        "StackChan Task",
        message,
        "StackChan firmware / VOICEVOX / WebSocket",
      );
      return {
        success: true,
        reply: `[つむぎ→Codex HOLD] OPENAI_API_KEY未設定のため、人間ブリッジ用Task.mdを生成しました。\n\n${taskMd.slice(0, 1500)}`,
        agentId: "tsumugi",
        durationMs: Date.now() - start,
      };
    }
  }

  // Claude Code path (しきしまCore or Codex fallback)
  // complexityはdecisionから引けないのでmessage長さで再判定
  const words = message.trim().split(/\s+/).length;
  const claudeComplexity = words > 60 ? "complex" : words > 20 ? "medium" : "simple";
  const claudeModel = selectClaudeModel(claudeComplexity);
  console.log(`[つむぎ] ClaudeCode model=${claudeModel} (${claudeComplexity})`);
  const result: ClaudeCodeResult = await claudeCodeTask(message, claudeModel);
  return {
    success: result.success,
    reply: result.output || result.error || "(応答なし)",
    agentId: "tsumugi",
    durationMs: Date.now() - start,
    error: result.error,
  };
}

// ─── Agent 4: はじめ — 計画・設計 ────────────────────────────────────────────

async function runHajime(message: string, complexity: Complexity): Promise<AgentResult> {
  const start = Date.now();
  const prompt = withPersona("hajime", message);

  // 1. Groq — 無料・高速・最優先
  const groqAvail = checkGroqAvailability();
  if (groqAvail.available) {
    const r: GroqResult = await groqChat(prompt, selectGroqModel(complexity));
    console.log("[はじめ] groq");
    if (r.success) return { success: true, reply: r.reply, agentId: "hajime", durationMs: Date.now() - start };
    console.warn("[はじめ] Groq failed:", r.error);
  }

  // 2. Gemini (設定済みなら)
  const geminiAvail = checkGeminiAvailability();
  if (geminiAvail.available) {
    const gModel = selectGeminiModel(complexity);
    const g: GeminiResult = await geminiChat(prompt, gModel);
    console.log(`[はじめ] gemini ${gModel}`);
    if (g.success) return { success: true, reply: g.reply, agentId: "hajime", durationMs: Date.now() - start };
    console.warn("[はじめ] Gemini failed");
  }

  // 3. Claude — 最終手段
  const claudeModel = selectClaudeModel(complexity);
  console.warn(`[はじめ] Claude ${claudeModel} fallback`);
  const claude: ClaudeCodeResult = await claudeCodeTask(prompt, claudeModel);
  if (claude.success) return { success: true, reply: claude.output, agentId: "hajime", durationMs: Date.now() - start };

  return { success: false, reply: "サービスが一時的に利用できません (Groq/Gemini/Claude すべて失敗)。", agentId: "hajime", durationMs: Date.now() - start, error: claude.error };
}

// ─── Agent 5: しるべ — 記録・検索 ────────────────────────────────────────────

// しるべのペルソナは withPersona("shirube", ...) で注入

// Hermes(live x_search) が必要か、Gemini(知識ベース) で足りるか判定
const LIVE_SEARCH_KW = ["最新", "今日", "今週", "速報", "今", "現在", "2026", "x_search"];

async function runShirube(message: string): Promise<AgentResult> {
  const start = Date.now();
  const needsLive = LIVE_SEARCH_KW.some((k) => message.includes(k));

  if (needsLive) {
    // ライブ検索が必要 → Hermes Research (x_search)
    console.log("[しるべ] Hermes Research (live search)");
    const research: HermesResearchResult = await runHermesResearch(message);
    if (research.success && research.content) {
      return { success: true, reply: research.content, agentId: "shirube", durationMs: Date.now() - start };
    }
    console.warn("[しるべ] Hermes failed");
  }

  // 1. Groq — 無料・高速・最優先 (Claude subscriptionより先に使う)
  const groqAvail = checkGroqAvailability();
  if (groqAvail.available) {
    const groq: GroqResult = await groqChat(withPersona("shirube", message), "llama-3.3-70b-versatile");
    console.log("[しるべ] Groq");
    if (groq.success) return { success: true, reply: groq.reply, agentId: "shirube", durationMs: Date.now() - start };
    console.warn("[しるべ] Groq failed:", groq.error);
  }

  // 2. Claude Sonnet — fallback
  console.log("[しるべ] Claude sonnet-4-6 fallback");
  const claude: ClaudeCodeResult = await claudeCodeTask(withPersona("shirube", message), "claude-sonnet-4-6");
  if (claude.success && claude.output) return { success: true, reply: claude.output, agentId: "shirube", durationMs: Date.now() - start };

  return { success: false, reply: "サービスが一時的に利用できません (Groq/Claude 失敗)。", agentId: "shirube", durationMs: Date.now() - start, error: claude.error };
}

// ─── Public entry point ───────────────────────────────────────────────────────

export async function dispatchToAgent(userMessage: string): Promise<AgentResult> {
  const decision = routeTask(userMessage);
  const label = agentLabel(decision.agentId);
  console.log(`[AgentRouter] ${label} (${decision.complexity}) — ${decision.reasoning}`);

  const { complexity } = decision;

  switch (decision.agentId) {
    case "shizume":
      return runShizume(userMessage);  // Claude → Groq → safety hold

    case "tsumugi": {
      const isStackchan = matchesAny(userMessage, STACKCHAN_KW);
      const isReview = matchesAny(userMessage, REVIEW_KW);
      let mode: Parameters<typeof runTsumugi>[1];
      if (isReview && isStackchan) mode = "review_codex";
      else if (isReview) mode = "review_claude";
      else if (isStackchan) mode = "codex_stackchan";
      else mode = "claude_core";
      return runTsumugi(userMessage, mode);  // 内部でClaudeモデル選択
    }

    case "hajime":
      return runHajime(userMessage, complexity);  // Groq → Gemini → Claude

    case "shirube":
      return runShirube(userMessage);

    case "chihaya":
      return runChihaya(userMessage, complexity);

    default: // shikishima
      return runShikishima(userMessage, false, complexity);
  }
}

// ─── Agent 6: ちはや — FX専任 ─────────────────────────────────────────────────

async function runChihaya(message: string, _complexity: Complexity): Promise<AgentResult> {
  const start = Date.now();

  // スキル自動検出
  const skill = detectSkill("chihaya", message);
  if (skill) {
    const out = await executeSkill(skill.id, { raw: message }, { agentId: "chihaya" });
    return { success: out.success, reply: out.result, agentId: "chihaya", durationMs: Date.now() - start };
  }

  // スキルにマッチしない場合はHermes Research + ペルソナ
  const research = await runHermesResearch(withPersona("chihaya", message));
  if (research.success && research.content) {
    return { success: true, reply: research.content, agentId: "chihaya", durationMs: Date.now() - start };
  }
  console.warn("[ちはや] Hermes failed");

  // fallback 1: Groq (無料・安定)
  const groqAvail = checkGroqAvailability();
  if (groqAvail.available) {
    const groq: GroqResult = await groqChat(withPersona("chihaya", message), "llama-3.3-70b-versatile");
    console.log("[ちはや] Groq fallback");
    if (groq.success) return { success: true, reply: groq.reply, agentId: "chihaya", durationMs: Date.now() - start };
    console.warn("[ちはや] Groq failed:", groq.error);
  }

  // fallback 2: Grok (xai-oauth, クレジット残量依存)
  const grok: GrokChatResult = await grokChat(withPersona("chihaya", message), "grok-4.3");
  console.log("[ちはや] Grok fallback");
  return {
    success: grok.success,
    reply: grok.reply || "サービスが一時的に利用できません (Hermes/Groq/Grok 失敗)。",
    agentId: "chihaya",
    durationMs: Date.now() - start,
    error: grok.error,
  };
}

// Discord返答プレフィックス — アイコン + ボールド名 (例: 🏯 **しきしま**)
export function agentLabel(agentId: AgentId): string {
  return agentReplyPrefix(agentId);
}

// 短縮名 → AgentId (canonical定義に委譲)
export function agentIdFromShortName(name: string): AgentId | null {
  return resolveAgentId(name);
}

// 全エージェント定義を返す (UI表示用)
export { AGENT_DEFINITIONS };

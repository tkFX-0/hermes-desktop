/**
 * Agent Skill Registry — 全スキル登録・検索・実行
 */

import type { AgentSkill, SkillInput, SkillOutput, AgentContext } from "./skill-types";
import type { AgentId } from "../agent-definitions";
import { createActionPreflight } from "../shikishima-core";
import type { OperationActionKind } from "../shikishima-core";

// ─── スキル実装 import ────────────────────────────────────────────────────────

import { skillSecretScan, skillComplianceCheck, skillHoldHistory } from "./shizume-skills";
import { skillTypecheck, skillDebug } from "./tsumugi-skills";
import { skillOrchestrate, skillSessionBrief, skillMoodRead } from "./shikishima-skills";
import { skillPlan, skillPrioritize, skillSprintPlan } from "./hajime-skills";
import { skillLogToObsidian, skillRecall, skillHandoffNote } from "./shirube-skills";

// ─── レジストリ ──────────────────────────────────────────────────────────────

const registry = new Map<string, AgentSkill>();

function register(skill: AgentSkill): void {
  registry.set(skill.id, skill);
}

// ─── しきしま ─────────────────────────────────────────────────────────────────
register({ id: "shikishima.orchestrate",    agentId: "shikishima", name: "オーケストレーション",
  description: "タスクを分析して最適エージェントへ振り分け",
  trigger: ["誰に", "振り分け", "どのエージェント", "担当決めて", "orchestrate"],
  requiredServices: ["grok"], execute: skillOrchestrate });

register({ id: "shikishima.session_brief",  agentId: "shikishima", name: "セッション要約",
  description: "現在のセッション状態を要約して提示",
  trigger: ["セッション状況", "今日の状態", "何してた", "session_brief", "要約して"],
  requiredServices: ["claude"], execute: skillSessionBrief });

register({ id: "shikishima.mood_read",      agentId: "shikishima", name: "感情読み取り",
  description: "テキストからユーザーの感情・疲労度を推定",
  trigger: [],  // 内部利用のみ（自動呼び出し）
  requiredServices: [], execute: skillMoodRead });

// ─── しずめ ───────────────────────────────────────────────────────────────────
register({ id: "shizume.secret_scan",       agentId: "shizume", name: "秘密情報スキャン",
  description: "APIキー・パスワード等の漏洩検出",
  trigger: ["秘密", "APIキー", "パスワード", "スキャン", "secret", "scan", "漏洩"],
  requiredServices: [], execute: skillSecretScan });

register({ id: "shizume.compliance_check",  agentId: "shizume", name: "コンプライアンスチェック",
  description: "システム安全フラグの確認",
  trigger: ["コンプライアンス", "安全フラグ", "compliance", "フラグ確認"],
  requiredServices: [], execute: skillComplianceCheck });

register({ id: "shizume.hold_history",      agentId: "shizume", name: "HOLD履歴",
  description: "過去HOLD/REJECT履歴取得",
  trigger: ["HOLD履歴", "過去のHOLD", "hold history", "REJECT履歴"],
  requiredServices: [], execute: skillHoldHistory });

// ─── つむぎ ───────────────────────────────────────────────────────────────────
register({ id: "tsumugi.typecheck",         agentId: "tsumugi", name: "型チェック",
  description: "TypeScript型チェック実行",
  trigger: ["typecheck", "型チェック", "型エラー", "typescript error", "tsc"],
  requiredServices: ["npm"], execute: skillTypecheck });

register({ id: "tsumugi.debug",             agentId: "tsumugi", name: "デバッグ",
  description: "エラーログから原因特定と修正案提示",
  trigger: ["デバッグ", "エラー調査", "debug", "stack trace", "スタックトレース", "原因"],
  requiredServices: ["claude"], execute: skillDebug });

// ─── はじめ ───────────────────────────────────────────────────────────────────
register({ id: "hajime.plan",               agentId: "hajime", name: "計画立案",
  description: "ゴールをタスクに分解して計画を立案",
  trigger: ["計画して", "タスク分解", "プランを", "plan", "ロードマップ"],
  requiredServices: ["gemini", "claude"], execute: skillPlan });

register({ id: "hajime.prioritize",         agentId: "hajime", name: "優先度付け",
  description: "タスクリストを優先度順にソート",
  trigger: ["優先度", "どれから", "prioritize", "優先順位", "何から先"],
  requiredServices: ["claude"], execute: skillPrioritize });

register({ id: "hajime.sprint_plan",        agentId: "hajime", name: "スプリント計画",
  description: "今日・今週の作業計画を生成",
  trigger: ["今日の計画", "スプリント", "sprint", "今日やること", "今週の計画"],
  requiredServices: ["gemini", "claude"], execute: skillSprintPlan });

// ─── しるべ ───────────────────────────────────────────────────────────────────
register({ id: "shirube.log_to_obsidian",   agentId: "shirube", name: "Obsidian記録",
  description: "Obsidianに記録を追加",
  trigger: ["記録して", "ログ残して", "obsidian", "メモして", "保存して"],
  requiredServices: [], execute: skillLogToObsidian });

register({ id: "shirube.recall",            agentId: "shirube", name: "過去記録検索",
  description: "過去ログから関連情報を検索",
  trigger: ["思い出して", "過去に", "以前の", "recall", "覚えてる", "履歴"],
  requiredServices: [], execute: skillRecall });

register({ id: "shirube.handoff_note",      agentId: "shirube", name: "引き継ぎメモ",
  description: "次チャット用引き継ぎ書を生成",
  trigger: ["引き継ぎ", "handoff", "次回のメモ", "まとめて次に渡して", "セッション終了"],
  requiredServices: ["claude"], execute: skillHandoffNote });

// 旧ちはやスキル — 廃止（EA/MT5 → つむぎ、相場調査 → しるべ は routeAgent / SideBot で振分）

// ─── Public API ──────────────────────────────────────────────────────────────

export function getSkill(skillId: string): AgentSkill | undefined {
  return registry.get(skillId);
}

export function getAgentSkills(agentId: AgentId): AgentSkill[] {
  return Array.from(registry.values()).filter((s) => s.agentId === agentId);
}

export function getAllSkills(): AgentSkill[] {
  return Array.from(registry.values());
}

export function getAllSkillIds(): string[] {
  return Array.from(registry.keys());
}

function classifySkillAction(skillId: string): OperationActionKind {
  if (skillId.includes("obsidian") || skillId.includes("handoff")) return "obsidian_write";
  if (skillId.includes("market") || skillId.includes("kill_zone")) return "fx_thesis";
  if (skillId.includes("typecheck") || skillId.includes("debug")) return "claude_code";
  if (skillId.includes("orchestrate") || skillId.includes("plan") || skillId.includes("prioritize")) return "local_draft";
  return "local_draft";
}

/**
 * メッセージからマッチするスキルを自動検出
 */
export function detectSkill(agentId: AgentId, message: string): AgentSkill | undefined {
  const lower       = message.toLowerCase();
  const agentSkills = getAgentSkills(agentId);
  return agentSkills.find((skill) =>
    skill.trigger.some((kw) => lower.includes(kw.toLowerCase()))
  );
}

/**
 * スキルを実行 (ログ付き)
 */
export async function executeSkill(
  skillId: string,
  input: SkillInput,
  ctx: AgentContext
): Promise<SkillOutput> {
  const skill = getSkill(skillId);
  if (!skill) {
    return { success: false, result: `スキル未登録: ${skillId}` };
  }
  console.log(`[Skill] ${skillId} 実行開始 (by ${ctx.agentId})`);
  const preflight = createActionPreflight({
    actionId: `SKILL-${skillId}`,
    actionKind: classifySkillAction(skillId),
    actor: ctx.agentId,
    source: "renderer",
    targetSummary: `skill execution: ${skillId}`,
    evidencePath: "docs/shikishima/AGENT_SKILL_PREFLIGHT_EVIDENCE.md",
  });
  if (preflight.gate.decision === "NEEDS_HUMAN" || preflight.gate.decision === "DENY") {
    return {
      success: true,
      result: `[${preflight.gate.decision}] ${skillId} is held by the Level 5 action gate.`,
      data: {
        preflight,
        productionReady: false,
        execution: "disabled",
        rawValuesReported: false,
      },
    };
  }
  const start = Date.now();
  try {
    const output = await skill.execute(input, ctx);
    console.log(`[Skill] ${skillId} 完了 (${Date.now() - start}ms)`);
    return { ...output, durationMs: Date.now() - start };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    console.error(`[Skill] ${skillId} エラー:`, err);
    return { success: false, result: `スキル実行エラー: ${err}`, durationMs: Date.now() - start };
  }
}

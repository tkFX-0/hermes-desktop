/**
 * Agent Skills Framework — 型定義
 * 各エージェントが持つ実行可能なスキルの共通インターフェース
 */

import type { AgentId } from "../agent-definitions";

export interface SkillInput {
  raw: string;
  params?: Record<string, unknown>;
  calledBy?: AgentId;
}

export interface SkillOutput {
  success: boolean;
  result: string;
  data?: unknown;
  sideEffects?: string[];
  durationMs?: number;
}

export interface AgentContext {
  agentId: AgentId;
  sessionId?: string;
  memorySnippet?: string;
}

export interface AgentSkill {
  id: string;
  agentId: AgentId;
  name: string;
  description: string;
  trigger: string[];
  requiredServices: string[];
  execute: (input: SkillInput, ctx: AgentContext) => Promise<SkillOutput>;
}

export interface AgentCallProtocol {
  from: AgentId;
  to: AgentId;
  skillId: string;
  input: SkillInput;
  priority: "urgent" | "normal" | "background";
}

export type SkillId =
  // しきしま
  | "shikishima.orchestrate"
  | "shikishima.session_brief"
  | "shikishima.mood_read"
  | "shikishima.context_recall"
  | "shikishima.proactive_suggest"
  | "shikishima.escalate"
  // しずめ
  | "shizume.gate_check"
  | "shizume.risk_score"
  | "shizume.secret_scan"
  | "shizume.hold_history"
  | "shizume.compliance_check"
  // つむぎ
  | "tsumugi.implement"
  | "tsumugi.review"
  | "tsumugi.typecheck"
  | "tsumugi.run_tests"
  | "tsumugi.create_pr"
  | "tsumugi.debug"
  | "tsumugi.task_handoff"
  // はじめ
  | "hajime.plan"
  | "hajime.roadmap"
  | "hajime.prioritize"
  | "hajime.estimate"
  | "hajime.dependency_check"
  | "hajime.sprint_plan"
  // しるべ
  | "shirube.web_search"
  | "shirube.x_search"
  | "shirube.log_to_obsidian"
  | "shirube.recall"
  | "shirube.handoff_note"
  | "shirube.knowledge_sync";

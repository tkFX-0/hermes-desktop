export type ShikishimaAgentId =
  | "shikishima"
  | "shizume"
  | "tsumugi"
  | "hajime"
  | "shirube"
  | "chihaya";

export type ShikishimaCapability =
  | "general_chat"
  | "planning"
  | "safety_review"
  | "implementation_draft"
  | "stackchan_review"
  | "recordkeeping"
  | "read_only_research"
  | "fx_thesis"
  | "debate";

export type ReasoningLevelLabel = "quick" | "standard" | "deep" | "critical";

export interface ModelAssignment {
  agentId: ShikishimaAgentId;
  role: string;
  defaultModel: string;
  fallbackModels: readonly string[];
  allowedCapabilities: readonly ShikishimaCapability[];
  forbiddenCapabilities: readonly string[];
  maxReasoningLevel: ReasoningLevelLabel;
  realtimeAllowed: boolean;
  externalWriteAllowed: false;
  stackchanSpeechAllowed: "draft_only" | "human_go_required";
  fxPositionAllowed: "not_applicable" | "thesis_only";
  requiresHumanGoFor: readonly string[];
}

export const SHIKISHIMA_AGENT_IDS: readonly ShikishimaAgentId[] = [
  "shikishima",
  "shizume",
  "tsumugi",
  "hajime",
  "shirube",
  "chihaya",
] as const;

export const MODEL_ASSIGNMENTS: readonly ModelAssignment[] = [
  {
    agentId: "shikishima",
    role: "control_synthesis_user_facing",
    defaultModel: "stable-general",
    fallbackModels: ["claude-sonnet", "groq-general"],
    allowedCapabilities: ["general_chat", "planning", "debate"],
    forbiddenCapabilities: ["external_write", "device_control", "trade_execution"],
    maxReasoningLevel: "standard",
    realtimeAllowed: false,
    externalWriteAllowed: false,
    stackchanSpeechAllowed: "draft_only",
    fxPositionAllowed: "not_applicable",
    requiresHumanGoFor: ["stackchan_speech", "discord_send", "runtime", "production_ready"],
  },
  {
    agentId: "shizume",
    role: "safety_gate_go_hold_reject",
    defaultModel: "high-precision-safety",
    fallbackModels: ["claude-sonnet"],
    allowedCapabilities: ["safety_review", "debate"],
    forbiddenCapabilities: ["external_write", "device_control", "trade_execution"],
    maxReasoningLevel: "critical",
    realtimeAllowed: false,
    externalWriteAllowed: false,
    stackchanSpeechAllowed: "draft_only",
    fxPositionAllowed: "not_applicable",
    requiresHumanGoFor: ["all_level5_actions"],
  },
  {
    agentId: "tsumugi",
    role: "implementation_worker_routing",
    defaultModel: "claude-code-for-core-codex-for-stackchan",
    fallbackModels: ["human-task-export"],
    allowedCapabilities: ["implementation_draft", "stackchan_review", "debate"],
    forbiddenCapabilities: ["external_write", "device_control", "trade_execution"],
    maxReasoningLevel: "deep",
    realtimeAllowed: false,
    externalWriteAllowed: false,
    stackchanSpeechAllowed: "draft_only",
    fxPositionAllowed: "not_applicable",
    requiresHumanGoFor: ["git_push", "runtime", "device_control", "external_api"],
  },
  {
    agentId: "hajime",
    role: "planning_task_breakdown",
    defaultModel: "planning-heavy",
    fallbackModels: ["claude-sonnet", "gemini-pro"],
    allowedCapabilities: ["planning", "debate"],
    forbiddenCapabilities: ["external_write", "device_control", "trade_execution"],
    maxReasoningLevel: "deep",
    realtimeAllowed: false,
    externalWriteAllowed: false,
    stackchanSpeechAllowed: "draft_only",
    fxPositionAllowed: "not_applicable",
    requiresHumanGoFor: ["execution_plan_approval"],
  },
  {
    agentId: "shirube",
    role: "recordkeeping_research_evidence",
    defaultModel: "research-readonly",
    fallbackModels: ["lightweight-logging"],
    allowedCapabilities: ["recordkeeping", "read_only_research", "debate"],
    forbiddenCapabilities: ["external_write_without_go", "device_control", "trade_execution"],
    maxReasoningLevel: "deep",
    realtimeAllowed: true,
    externalWriteAllowed: false,
    stackchanSpeechAllowed: "draft_only",
    fxPositionAllowed: "not_applicable",
    requiresHumanGoFor: ["obsidian_write", "discord_send", "x_search", "publish_report"],
  },
  {
    agentId: "chihaya",
    role: "fx_observation_thesis_risk",
    defaultModel: "realtime-research-fx",
    fallbackModels: ["grok-research", "claude-sonnet"],
    allowedCapabilities: ["read_only_research", "fx_thesis", "debate"],
    forbiddenCapabilities: ["trade_execution", "external_write_without_go", "device_control"],
    maxReasoningLevel: "deep",
    realtimeAllowed: true,
    externalWriteAllowed: false,
    stackchanSpeechAllowed: "draft_only",
    fxPositionAllowed: "thesis_only",
    requiresHumanGoFor: ["x_search", "market_data_live", "trade_execution"],
  },
] as const;

export function getModelAssignment(agentId: ShikishimaAgentId): ModelAssignment {
  const assignment = MODEL_ASSIGNMENTS.find((entry) => entry.agentId === agentId);
  if (!assignment) throw new Error(`Missing model assignment for ${agentId}`);
  return assignment;
}

export function listModelAssignments(): readonly ModelAssignment[] {
  return MODEL_ASSIGNMENTS;
}

export function validateModelAssignmentRegistry(): { ok: true } | { ok: false; reason: string } {
  const ids = MODEL_ASSIGNMENTS.map((entry) => entry.agentId);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    return { ok: false, reason: "duplicate_agent_assignment" };
  }

  for (const agentId of SHIKISHIMA_AGENT_IDS) {
    if (!uniqueIds.has(agentId)) {
      return { ok: false, reason: `missing_agent_assignment:${agentId}` };
    }
  }

  for (const assignment of MODEL_ASSIGNMENTS) {
    if (assignment.externalWriteAllowed !== false) {
      return { ok: false, reason: `external_write_enabled:${assignment.agentId}` };
    }
  }

  return { ok: true };
}

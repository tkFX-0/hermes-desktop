import type { ShikishimaAgentId } from "./model-assignment-registry";

export type DebateMode =
  | "design_debate"
  | "safety_debate"
  | "fx_debate"
  | "implementation_debate"
  | "stackchan_debate";

export interface AgentDebatePosition {
  agentId: ShikishimaAgentId;
  stance: "support" | "oppose" | "hold" | "clarify";
  summary: string;
  riskNotes: readonly string[];
}

export interface DebateSessionDraft {
  debateId: string;
  mode: DebateMode;
  proposal: string;
  agentPositions: readonly AgentDebatePosition[];
  conflicts: readonly string[];
  resolvedPoints: readonly string[];
  unresolvedPoints: readonly string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendedNextAction: string;
  humanDecisionRequired: true;
}

export function createDebateSessionDraft(
  input: Omit<DebateSessionDraft, "humanDecisionRequired">,
): DebateSessionDraft {
  return {
    ...input,
    humanDecisionRequired: true,
  };
}

export function validateDebateSessionDraft(session: DebateSessionDraft): {
  ok: boolean;
  reason?: string;
} {
  if (session.humanDecisionRequired !== true) return { ok: false, reason: "human_decision_required" };
  if (session.agentPositions.length === 0) return { ok: false, reason: "agent_positions_required" };
  if (!session.recommendedNextAction) return { ok: false, reason: "recommended_next_action_required" };
  return { ok: true };
}

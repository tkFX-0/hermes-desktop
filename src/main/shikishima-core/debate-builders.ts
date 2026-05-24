import {
  createDebateSessionDraft,
  type AgentDebatePosition,
  type DebateMode,
  type DebateSessionDraft,
} from "./debate-mode";

export function createStandardDebateDraft(input: {
  debateId: string;
  mode: DebateMode;
  proposal: string;
  positions: readonly AgentDebatePosition[];
  riskLevel: DebateSessionDraft["riskLevel"];
  recommendedNextAction: string;
}): DebateSessionDraft {
  const holdPositions = input.positions
    .filter((position) => position.stance === "hold" || position.stance === "oppose")
    .map((position) => `${position.agentId}: ${position.summary}`);

  return createDebateSessionDraft({
    debateId: input.debateId,
    mode: input.mode,
    proposal: input.proposal,
    agentPositions: input.positions,
    conflicts: holdPositions,
    resolvedPoints: [],
    unresolvedPoints: holdPositions.length > 0 ? ["human decision required before execution"] : [],
    riskLevel: input.riskLevel,
    recommendedNextAction: input.recommendedNextAction,
  });
}

import type { ShikishimaUnifiedStateSnapshot } from "./snapshot-types";
import { planAllSurfaceOutputs } from "./unified-output-policy";

export interface AutonomousProposal {
  proposalId: string;
  createdAtIso: string;
  execution: "disabled";
  productionReady: false;
  nextRallyGoalId: string | null;
  humanGoDraft: string | null;
  holdSummary: string | null;
  surfaceHints: readonly { surface: string; preview: string }[];
}

export function generateAutonomousProposal(
  snapshot: ShikishimaUnifiedStateSnapshot
): AutonomousProposal {
  const outputs = planAllSurfaceOutputs(snapshot);
  const stackchanDeferred = snapshot.stackchan.holdReasons.includes("stackchan_embodiment_deferred");
  const nextRally = stackchanDeferred
    ? "shikishima.phase2.unified-state-snapshot"
    : snapshot.stackchan.voicePilotAudibleAccepted === false
      ? "shikishima.phase1.voice-acceptance"
      : snapshot.globalDecision === "HOLD"
        ? "shikishima.phase2.unified-state-snapshot"
        : null;

  const humanGoDraft =
    snapshot.globalDecision === "HOLD" && snapshot.holdReason
      ? `GO確認: ${snapshot.holdReason} を解消後、one-shot 時間窓を宣言してください。`
      : null;

  return {
    proposalId: `proposal-${snapshot.modelTrace.traceId}`,
    createdAtIso: snapshot.capturedAtIso,
    execution: "disabled",
    productionReady: false,
    nextRallyGoalId: nextRally,
    humanGoDraft,
    holdSummary: snapshot.holdReason,
    surfaceHints: outputs.map((o) => ({ surface: o.surface, preview: o.body.slice(0, 40) }))
  };
}

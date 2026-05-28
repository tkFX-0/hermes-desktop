import type {
  AutonomyDecision,
  HumanGateStateSnapshot,
  ShikishimaUnifiedStateSnapshot,
  StackChanStateSnapshot
} from "./snapshot-types";

export interface BuildUnifiedSnapshotInput {
  capturedAtIso?: string;
  stackchan?: Partial<StackChanStateSnapshot>;
  humanGate?: Partial<HumanGateStateSnapshot>;
  holdReason?: string | null;
  traceId?: string;
}

function mergeHoldReasons(parts: (string | undefined)[]): string | null {
  const unique = [...new Set(parts.filter((p): p is string => Boolean(p)))];
  return unique.length > 0 ? unique.join("; ") : null;
}

function deriveGlobalDecision(
  stackchan: StackChanStateSnapshot,
  humanGate: HumanGateStateSnapshot,
  explicitHold: string | null
): AutonomyDecision {
  if (explicitHold) return "HOLD";
  if (!humanGate.humanGoApproved) return "HOLD";
  if (humanGate.visualConfirmationRequired && !humanGate.visualConfirmationPassed) return "HOLD";
  if (stackchan.holdReasons.length > 0) return "HOLD";
  return "ALLOW_DRAFT";
}

export function buildUnifiedStateSnapshot(
  input: BuildUnifiedSnapshotInput = {}
): ShikishimaUnifiedStateSnapshot {
  const stackchan: StackChanStateSnapshot = {
    displayRoute: input.stackchan?.displayRoute ?? "HOLD",
    motionRoute: input.stackchan?.motionRoute ?? "HOLD",
    voiceRoute: input.stackchan?.voiceRoute ?? "HOLD",
    voicePilotAudibleAccepted: input.stackchan?.voicePilotAudibleAccepted ?? false,
    holdReasons: input.stackchan?.holdReasons ?? ["phase1_voice_not_accepted"]
  };

  const humanGate: HumanGateStateSnapshot = {
    humanPresent: input.humanGate?.humanPresent ?? false,
    humanGoApproved: input.humanGate?.humanGoApproved ?? false,
    visualConfirmationRequired: input.humanGate?.visualConfirmationRequired ?? true,
    visualConfirmationPassed: input.humanGate?.visualConfirmationPassed ?? false,
    timeWindowActive: input.humanGate?.timeWindowActive ?? false
  };

  const holdReason = mergeHoldReasons([
    input.holdReason ?? undefined,
    ...stackchan.holdReasons,
    !humanGate.humanGoApproved ? "human_go_required" : undefined,
    humanGate.visualConfirmationRequired && !humanGate.visualConfirmationPassed
      ? "visual_confirmation_required"
      : undefined
  ]);

  const globalDecision = deriveGlobalDecision(stackchan, humanGate, holdReason);

  return {
    capturedAtIso: input.capturedAtIso ?? new Date(0).toISOString(),
    globalDecision,
    holdReason,
    productionReady: false,
    executionEnabled: false,
    stackchan,
    externalEffects: {
      pendingEffects: [],
      lastEffectRouteId: null,
      defaultDecision: "HOLD"
    },
    humanGate,
    modelTrace: {
      traceId: input.traceId ?? "redacted-trace",
      modelFamily: "composer",
      redactedSummary: "snapshot_built"
    }
  };
}

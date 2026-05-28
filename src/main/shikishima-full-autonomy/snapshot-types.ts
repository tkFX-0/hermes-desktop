/** Phase 2 — unified state snapshot types (read-only aggregation). */

export type AutonomyDecision = "ALLOW" | "ALLOW_DRAFT" | "HOLD" | "BLOCKED";

export interface StackChanStateSnapshot {
  displayRoute: AutonomyDecision;
  motionRoute: AutonomyDecision;
  voiceRoute: AutonomyDecision;
  voicePilotAudibleAccepted: boolean;
  holdReasons: readonly string[];
}

export interface ExternalEffectStateSnapshot {
  pendingEffects: readonly string[];
  lastEffectRouteId: string | null;
  defaultDecision: AutonomyDecision;
}

export interface HumanGateStateSnapshot {
  humanPresent: boolean;
  humanGoApproved: boolean;
  visualConfirmationRequired: boolean;
  visualConfirmationPassed: boolean;
  timeWindowActive: boolean;
}

export interface ModelTraceSnapshot {
  traceId: string;
  modelFamily: string;
  redactedSummary: string;
}

export interface ShikishimaUnifiedStateSnapshot {
  capturedAtIso: string;
  globalDecision: AutonomyDecision;
  holdReason: string | null;
  productionReady: false;
  executionEnabled: false;
  stackchan: StackChanStateSnapshot;
  externalEffects: ExternalEffectStateSnapshot;
  humanGate: HumanGateStateSnapshot;
  modelTrace: ModelTraceSnapshot;
}

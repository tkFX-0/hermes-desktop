import type { AutonomyDecision } from "./snapshot-types";

export interface SafetyGovernorInput {
  productionReady: boolean;
  executionEnabled: boolean;
  rawValuesReported: boolean;
  retryLoopDetected: boolean;
  humanVisualAutoPassAttempted: boolean;
}

export interface SafetyGovernorResult {
  decision: AutonomyDecision;
  invariants: {
    productionReady: false;
    executionEnabled: false;
    rawValuesReported: false;
  };
  reasons: readonly string[];
}

export function evaluateSafetyGovernor(input: SafetyGovernorInput): SafetyGovernorResult {
  const reasons: string[] = [];

  if (input.productionReady) reasons.push("production_ready_forbidden");
  if (input.executionEnabled) reasons.push("execution_enabled_forbidden");
  if (input.rawValuesReported) reasons.push("raw_values_forbidden");
  if (input.retryLoopDetected) reasons.push("retry_loop_forbidden");
  if (input.humanVisualAutoPassAttempted) reasons.push("visual_auto_pass_forbidden");

  const decision: AutonomyDecision = reasons.length > 0 ? "BLOCKED" : "HOLD";

  return {
    decision,
    invariants: {
      productionReady: false,
      executionEnabled: false,
      rawValuesReported: false
    },
    reasons
  };
}

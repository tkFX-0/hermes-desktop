/**
 * Phase 6 — external effect registry dry-run (no actual send).
 */

import { evaluateExternalEffect, type ExternalEffectEvaluationResult } from "./evaluate-external-effect";
import { EXTERNAL_EFFECT_REGISTRY } from "./external-effect-registry";
import type { GoalRegistryOptions } from "./goal-registry";

export interface ExternalEffectsDryRunInput {
  humanGoApproved: boolean;
  oneShotDeclared: boolean;
  timeWindowActive: boolean;
  explicitPermittedGo: boolean;
  registryOptions: GoalRegistryOptions;
}

export interface ExternalEffectsDryRunResult {
  execution: "disabled";
  productionReady: false;
  allowsAnyActualExecution: false;
  evaluations: readonly ExternalEffectEvaluationResult[];
  holdCount: number;
  blockedCount: number;
}

export function runExternalEffectsDryRun(
  input: ExternalEffectsDryRunInput
): ExternalEffectsDryRunResult {
  const voiceAccepted = !input.registryOptions.stackchanDeferred;

  const evaluations = EXTERNAL_EFFECT_REGISTRY.map((def) =>
    evaluateExternalEffect({
      routeId: def.routeId,
      humanGoApproved: input.humanGoApproved,
      oneShotDeclared: input.oneShotDeclared,
      timeWindowActive: input.timeWindowActive,
      explicitPermittedGo: input.explicitPermittedGo,
      dryRunOnly: true,
      productionReady: false,
      executionEnabled: false,
      voicePilotAudibleAccepted: voiceAccepted
    })
  );

  const holdCount = evaluations.filter((e) => e.decision === "HOLD").length;
  const blockedCount = evaluations.filter((e) => e.decision === "BLOCKED").length;

  return {
    execution: "disabled",
    productionReady: false,
    allowsAnyActualExecution: false,
    evaluations,
    holdCount,
    blockedCount
  };
}

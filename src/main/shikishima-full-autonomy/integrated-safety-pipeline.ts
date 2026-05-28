/**
 * Chapter 7 — Intent → Governor → External effects (no execute).
 */

import { verifyGlobalInvariants } from "./autonomy-invariants";
import { classifyAction, type ActionIntentKind } from "./classify-action";
import { runExternalEffectsDryRun } from "./external-effects-dry-run";
import type { GoalRegistryOptions } from "./goal-registry";
import { evaluateSafetyGovernor } from "./safety-governor";
import type { ShikishimaUnifiedStateSnapshot } from "./snapshot-types";
import type { AutonomyDecision } from "./snapshot-types";

export interface IntegratedSafetyInput {
  snapshot: ShikishimaUnifiedStateSnapshot;
  intent: ActionIntentKind;
  registryOptions: GoalRegistryOptions;
  retryLoopDetected?: boolean;
  humanVisualAutoPassAttempted?: boolean;
}

export interface IntegratedSafetyResult {
  globalDecision: AutonomyDecision;
  invariantsOk: boolean;
  classifiedRouteId: string;
  governorReasons: readonly string[];
  externalHoldCount: number;
  execution: "disabled";
  productionReady: false;
}

export function runIntegratedSafetyPipeline(
  input: IntegratedSafetyInput
): IntegratedSafetyResult {
  const invariants = verifyGlobalInvariants({
    productionReady: input.snapshot.productionReady,
    executionEnabled: input.snapshot.executionEnabled,
    rawValuesReported: false
  });

  const classified = classifyAction(input.intent);

  const governor = evaluateSafetyGovernor({
    productionReady: input.snapshot.productionReady,
    executionEnabled: input.snapshot.executionEnabled,
    rawValuesReported: false,
    retryLoopDetected: input.retryLoopDetected ?? false,
    humanVisualAutoPassAttempted: input.humanVisualAutoPassAttempted ?? false
  });

  const external = runExternalEffectsDryRun({
    humanGoApproved: input.snapshot.humanGate.humanGoApproved,
    oneShotDeclared: input.snapshot.humanGate.timeWindowActive,
    timeWindowActive: input.snapshot.humanGate.timeWindowActive,
    explicitPermittedGo: false,
    registryOptions: input.registryOptions
  });

  let globalDecision: AutonomyDecision = "HOLD";
  if (!invariants.ok || governor.decision === "BLOCKED") globalDecision = "BLOCKED";
  else if (input.snapshot.globalDecision === "HOLD") globalDecision = "HOLD";

  return {
    globalDecision,
    invariantsOk: invariants.ok,
    classifiedRouteId: classified.routeId,
    governorReasons: governor.reasons,
    externalHoldCount: external.holdCount,
    execution: "disabled",
    productionReady: false
  };
}

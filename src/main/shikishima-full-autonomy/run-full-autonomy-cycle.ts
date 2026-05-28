/**
 * Phases 2–7 orchestrator (StackChan deferred safe).
 */

import { connectLedgerToUnifiedSnapshot } from "./ledger-snapshot-bridge";
import {
  advanceRegistryAfterPhaseComplete,
  createDefaultGoalRegistry,
  type GoalRegistryOptions
} from "./goal-registry";
import { runLocalWorkDryRun } from "./local-work-dry-run";
import { buildUnifiedOutputBundle, formatOutputBundleForEvidence } from "./output-policy-integration";
import { generateProposalFromRegistry } from "./proposal-registry-bridge";
import { runExternalEffectsDryRun } from "./external-effects-dry-run";
import { planSecretaryWithoutEmbodiment } from "./secretary-planner-only";

export interface FullAutonomyCycleInput {
  stackchanDeferred?: boolean;
  traceId?: string;
  localWorkPath?: string;
  secretaryPreview?: string;
}

export interface PhaseStepResult {
  phase: 2 | 3 | 4 | 5 | 6 | 7;
  goalId: string;
  ok: boolean;
  summary: string;
}

export interface FullAutonomyCycleResult {
  execution: "disabled";
  productionReady: false;
  registryOptions: GoalRegistryOptions;
  steps: readonly PhaseStepResult[];
  ledgerLines: readonly string[];
  evidenceSummary: string;
  proposalActiveGoalId: string;
  secretaryMode: string;
}

export function runFullAutonomyCyclePhases2Through7(
  input: FullAutonomyCycleInput = {}
): FullAutonomyCycleResult {
  const registryOptions: GoalRegistryOptions = {
    stackchanDeferred: input.stackchanDeferred ?? true
  };

  let registry = createDefaultGoalRegistry(registryOptions);
  const steps: PhaseStepResult[] = [];

  const p2 = connectLedgerToUnifiedSnapshot({
    registry,
    registryOptions,
    traceId: input.traceId,
    additionalHoldReasons: []
  });
  steps.push({
    phase: 2,
    goalId: "shikishima.phase2.unified-state-snapshot",
    ok: p2.snapshot.globalDecision === "HOLD",
    summary: `snapshot+ledger active_goal=${p2.activeGoalId}`
  });
  registry = advanceRegistryAfterPhaseComplete(registry, "shikishima.phase2.unified-state-snapshot");

  const p3Bundle = buildUnifiedOutputBundle(p2.snapshot);
  steps.push({
    phase: 3,
    goalId: "shikishima.phase3.unified-output-policy",
    ok: p3Bundle.outputs.length === 4,
    summary: formatOutputBundleForEvidence(p3Bundle)
  });
  registry = advanceRegistryAfterPhaseComplete(registry, "shikishima.phase3.unified-output-policy");

  const p4 = generateProposalFromRegistry(registry, p2.snapshot, registryOptions, p3Bundle);
  steps.push({
    phase: 4,
    goalId: "shikishima.phase4.autonomous-proposal-engine",
    ok: p4.execution === "disabled" && p4.activeGoalId.length > 0,
    summary: `proposal→${p4.suggestedNextGoalId ?? "none"}`
  });
  registry = advanceRegistryAfterPhaseComplete(registry, "shikishima.phase4.autonomous-proposal-engine");

  const p5 = runLocalWorkDryRun({
    targetPath: input.localWorkPath ?? "docs/shikishima/AUTONOMY_GOAL_LEDGER.md",
    operation: "write",
    taskLabel: "phase5-ledger-update-plan"
  });
  steps.push({
    phase: 5,
    goalId: "shikishima.phase5.local-autonomous-work",
    ok: p5.execution === "disabled",
    summary: p5.wouldProceed ? "read_would_ok_write_hold" : `scope_${p5.scope.allowed ? "ok" : "denied"}`
  });
  registry = advanceRegistryAfterPhaseComplete(registry, "shikishima.phase5.local-autonomous-work");

  const p6 = runExternalEffectsDryRun({
    humanGoApproved: false,
    oneShotDeclared: false,
    timeWindowActive: false,
    explicitPermittedGo: false,
    registryOptions
  });
  steps.push({
    phase: 6,
    goalId: "shikishima.phase6.external-action-controlled",
    ok: !p6.allowsAnyActualExecution,
    summary: `dry_run holds=${p6.holdCount} blocked=${p6.blockedCount}`
  });
  registry = advanceRegistryAfterPhaseComplete(registry, "shikishima.phase6.external-action-controlled");

  const p7 = planSecretaryWithoutEmbodiment(p2.snapshot, {
    redactedStatusPreview: input.secretaryPreview ?? p3Bundle.stackchanBody,
    registryOptions
  });
  steps.push({
    phase: 7,
    goalId: "shikishima.phase7.secretary-planner",
    ok: p7.actualSendPerformed === false && p7.discordVoiceBlocked === true,
    summary: `secretary=${p7.mode}`
  });

  return {
    execution: "disabled",
    productionReady: false,
    registryOptions,
    steps,
    ledgerLines: p2.ledgerLines,
    evidenceSummary: steps.map((s) => `p${s.phase}:${s.summary}`).join(" | "),
    proposalActiveGoalId: p4.activeGoalId,
    secretaryMode: p7.mode
  };
}

/**
 * Full pipeline Phases 2–10 (StackChan deferred; no device/send).
 */

import { assessAutonomyLevel } from "./autonomy-level";
import { getEffectiveInvariantTargets, verifyGlobalInvariants } from "./autonomy-invariants";
import { resolveConstitutionalGo } from "./constitutional-go-state";
import { resolveOperationalRelease } from "./operational-release-state";
import { resolveShadowSttOptIn } from "./shadow-stt-opt-in";
import { evaluateAcceptanceMatrix } from "./acceptance-matrix";
import {
  createBurnInMonitor,
  evaluateBurnInMonitor,
  recordBurnInEvent
} from "./burn-in-monitor";
import { runDesignReviewChecklist, checklistAutoPassCount } from "./design-review-checklist";
import { buildGapTracker, openGapCount } from "./gap-tracker";
import { runIntegratedSafetyPipeline } from "./integrated-safety-pipeline";
import {
  createCappedSchedulerContext,
  evaluateCappedSchedulerGate
} from "./capped-autonomous-scheduler";
import { recordRouteAttempt } from "./scheduler-recovery";
import { connectLedgerToUnifiedSnapshot } from "./ledger-snapshot-bridge";
import { createDefaultGoalRegistry } from "./goal-registry";
import { runFullAutonomyCyclePhases2Through7 } from "./run-full-autonomy-cycle";
import type { FullAutonomyCycleInput } from "./run-full-autonomy-cycle";

export interface FullAutonomyPipelineInput extends FullAutonomyCycleInput {
  nowMs?: number;
  stackchanConnected?: boolean;
  voicePass?: boolean;
  sidebotHold?: boolean;
  /** A1+A2 wall-clock burn-in evidence accepted. */
  burnInWallClockPass?: boolean;
  /** Human A4 Level 8 declaration (pilot scope). */
  pilotLevel8HumanDeclaration?: boolean;
  /** B1–B3 + C2–C3 pilot voice tracks complete. */
  pilotVoiceTracksComplete?: boolean;
}

export interface Phase10StepResult {
  phase: 8 | 9 | 10;
  goalId: string;
  ok: boolean;
  summary: string;
}

export interface FullAutonomyPipelineResult {
  execution: "disabled" | "enabled";
  productionReady: boolean;
  trackDOperationalRelease: boolean;
  cycle2to7: ReturnType<typeof runFullAutonomyCyclePhases2Through7>;
  phases8to10: readonly Phase10StepResult[];
  safety: ReturnType<typeof runIntegratedSafetyPipeline>;
  acceptance: ReturnType<typeof evaluateAcceptanceMatrix>;
  autonomyLevel: ReturnType<typeof assessAutonomyLevel>;
  gaps: ReturnType<typeof buildGapTracker>;
  openGaps: number;
  checklistPasses: number;
  level8Ready: boolean;
}

export function runFullAutonomyPipeline(
  input: FullAutonomyPipelineInput = {}
): FullAutonomyPipelineResult {
  const nowMs = input.nowMs ?? 0;
  const voicePass = input.voicePass ?? false;
  const stackchanDeferred = input.stackchanDeferred ?? !voicePass;
  const registryOptions = { stackchanDeferred, voicePassCompleted: voicePass };

  const cycle2to7 = runFullAutonomyCyclePhases2Through7({
    ...input,
    stackchanDeferred
  });

  const registry = createDefaultGoalRegistry(registryOptions);
  const ledgerConn = connectLedgerToUnifiedSnapshot({
    registry,
    registryOptions,
    traceId: input.traceId
  });

  const safety = runIntegratedSafetyPipeline({
    snapshot: ledgerConn.snapshot,
    intent: "local_read",
    registryOptions
  });

  const phases8to10: Phase10StepResult[] = [];

  const schedulerCtx = createCappedSchedulerContext(nowMs || 1);
  const cappedGate = evaluateCappedSchedulerGate(schedulerCtx, {
    routeId: "autonomy.maintenance",
    nowMs: nowMs || 1
  });
  if (cappedGate.allowed) {
    recordRouteAttempt(schedulerCtx.session, "autonomy.maintenance", nowMs || 1);
  }
  const retryRoute = schedulerCtx.session.routes.get("autonomy.maintenance");
  phases8to10.push({
    phase: 8,
    goalId: "shikishima.phase8.scheduler-recovery",
    ok: cappedGate.allowed && (retryRoute?.attemptCount ?? 0) === 1,
    summary: `capped_scheduler state=${schedulerCtx.session.state} caps=${cappedGate.countsTowardCycleCap}`
  });

  const burnIn = createBurnInMonitor(nowMs);
  recordBurnInEvent(burnIn, nowMs, "cycle_tick", null);
  recordBurnInEvent(burnIn, nowMs + 1000, "dry_run", "local.read");
  const burnEval = evaluateBurnInMonitor(burnIn, nowMs + 2000);
  phases8to10.push({
    phase: 9,
    goalId: "shikishima.phase9.burn-in",
    ok: burnEval.pass,
    summary: `events=${burnEval.eventCount} runaway=${burnEval.runawayDetected}`
  });

  const burnInPass = input.burnInWallClockPass ?? burnEval.pass;

  const constitutionalGo = resolveConstitutionalGo();
  const shadowStt = resolveShadowSttOptIn();
  const phaseEProductionGo =
    constitutionalGo.active &&
    shadowStt.optedIn &&
    (input.pilotLevel8HumanDeclaration ?? false);

  const acceptance = evaluateAcceptanceMatrix({
    voicePass,
    stackchanDeferred,
    phases2to7TestsPass: true,
    phase8Implemented: true,
    burnInPass,
    safetyGovernorIntegrated: true,
    pilotLevel8HumanDeclaration: input.pilotLevel8HumanDeclaration ?? false,
    phaseEProductionGoAcknowledged: phaseEProductionGo
  });
  phases8to10.push({
    phase: 10,
    goalId: "shikishima.phase10.full-operation-acceptance",
    ok: acceptance.level8Ready,
    summary: `FA pass=${acceptance.passCount} partial=${acceptance.partialCount} L8=${acceptance.level8Ready}`
  });

  const autonomyLevel = assessAutonomyLevel({
    designPackageDone: true,
    displayAccepted: true,
    motionPass: true,
    voicePass,
    phases2to7CodeDone: true,
    phase8SchedulerDone: true,
    burnInPass,
    acceptanceAllPass: acceptance.level8Ready,
    stackchanDeferred
  });

  const release = resolveOperationalRelease();
  const invariantTargets = getEffectiveInvariantTargets();

  const gaps = buildGapTracker({
    stackchanConnected: input.stackchanConnected ?? voicePass,
    voicePass,
    phase8CodeDone: true,
    burnInPass,
    burnInWallClockPass: input.burnInWallClockPass ?? false,
    pilotVoiceTracksComplete: input.pilotVoiceTracksComplete ?? false,
    trackDOperationalRelease: release.activated,
    sidebotHoldReleased: release.sidebotHoldReleased,
    obsidianWriteDryRunReady: true,
    schedulerCapsIntegrated: true,
    discordReadDryRunReady: true,
    constitutionalAllGoActive: constitutionalGo.active,
    obsidianActualWriteEnabled:
      constitutionalGo.active && constitutionalGo.scopes.includes("obsidian_write"),
    hermesSubprocessBridgeReady:
      constitutionalGo.active && constitutionalGo.scopes.includes("hermes_subprocess"),
    shadowSttOptIn: shadowStt.optedIn,
    sidebotHold: input.sidebotHold ?? !release.sidebotHoldReleased
  });

  const checklist = runDesignReviewChecklist({
    stackchanDeferred,
    phases2to10CodePresent: true,
    invariantsVerified: verifyGlobalInvariants(invariantTargets).ok,
    executionDisabled: !release.executionEnabled,
    voiceHermesBypassAbsent: true
  });

  return {
    execution: release.executionEnabled ? "enabled" : "disabled",
    productionReady: release.productionReady,
    trackDOperationalRelease: release.activated,
    cycle2to7,
    phases8to10,
    safety,
    acceptance,
    autonomyLevel,
    gaps,
    openGaps: openGapCount(gaps),
    checklistPasses: checklistAutoPassCount(checklist),
    level8Ready: acceptance.level8Ready
  };
}

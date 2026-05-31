/**
 * Phase E2 — one autonomous maintenance cycle (pipeline + caps; no external send).
 */

import { resolveOperationalRelease } from "./operational-release-state";
import {
  canRunAutonomousCycle,
  recordAutonomousCycle,
  type RuntimeCycleCounter
} from "./autonomous-runtime-config";
import { runFullAutonomyPipeline } from "./run-full-autonomy-pipeline";

export interface AutonomousCycleResult {
  allowed: boolean;
  reasons: readonly string[];
  pipeline: ReturnType<typeof runFullAutonomyPipeline> | null;
}

export function runAutonomousMaintenancePipeline(nowMs: number) {
  const release = resolveOperationalRelease();
  return runFullAutonomyPipeline({
    voicePass: true,
    stackchanConnected: true,
    stackchanDeferred: false,
    burnInWallClockPass: true,
    pilotLevel8HumanDeclaration: true,
    pilotVoiceTracksComplete: true,
    sidebotHold: !release.sidebotHoldReleased,
    nowMs
  });
}

export function runAutonomousMaintenanceCycle(
  counter: RuntimeCycleCounter,
  nowMs: number
): AutonomousCycleResult {
  const gate = canRunAutonomousCycle(counter, nowMs);
  if (!gate.allowed) {
    return { allowed: false, reasons: gate.reasons, pipeline: null };
  }

  const pipeline = runAutonomousMaintenancePipeline(nowMs);
  recordAutonomousCycle(counter, nowMs);
  return { allowed: true, reasons: [], pipeline };
}

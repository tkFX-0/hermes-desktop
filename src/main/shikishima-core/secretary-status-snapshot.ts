import type { SecretaryRuntimeState } from "./secretary-runtime-coordinator";
import type { SecretaryRoutineSchedulerState } from "./secretary-routine-scheduler";

export interface SecretaryStatusSnapshot {
  secretaryReady: boolean;
  phase: "foundation" | "v1_candidate" | "camera_candidate" | "sensor_candidate" | "production_candidate";
  activeMode: string;
  paused: boolean;
  stopped: boolean;
  voiceReady: boolean;
  cameraOneShotReady: boolean;
  routineReady: boolean;
  monitoringReady: boolean;
  externalWriteReady: boolean;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  nextHumanDecision: string;
}

export function createSecretaryStatusSnapshot(input: {
  runtime: SecretaryRuntimeState;
  routineScheduler?: SecretaryRoutineSchedulerState;
  voiceReady: boolean;
  cameraOneShotReady: boolean;
  monitoringReady: boolean;
  externalWriteReady: boolean;
}): SecretaryStatusSnapshot {
  const routineReady =
    Boolean(input.routineScheduler) &&
    input.routineScheduler?.stopped === false &&
    input.routineScheduler?.schedules.length !== 0;
  const secretaryReady = input.voiceReady && !input.runtime.stopped;
  const phase = input.monitoringReady
    ? "sensor_candidate"
    : input.cameraOneShotReady
      ? "camera_candidate"
      : secretaryReady
        ? "v1_candidate"
        : "foundation";
  const nextHumanDecision = input.runtime.stopped
    ? "resume or keep stopped"
    : !input.voiceReady
      ? "complete SC-AI-01 voice readiness"
      : !input.cameraOneShotReady
        ? "decide SC-CAM-01 one still image"
        : !input.monitoringReady
          ? "decide bounded sensor session"
          : "review SC-SECRETARY-99 acceptance";

  return {
    secretaryReady,
    phase,
    activeMode: input.runtime.mode,
    paused: input.runtime.paused,
    stopped: input.runtime.stopped,
    voiceReady: input.voiceReady,
    cameraOneShotReady: input.cameraOneShotReady,
    routineReady,
    monitoringReady: input.monitoringReady,
    externalWriteReady: input.externalWriteReady,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
    nextHumanDecision,
  };
}


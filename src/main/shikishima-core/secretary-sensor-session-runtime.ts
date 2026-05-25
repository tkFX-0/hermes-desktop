import {
  createSecretaryMonitoringContract,
  type SecretaryMonitoringContract,
  type SecretaryMonitoringContractInput,
} from "./secretary-monitoring-contract";

export type SecretarySensorSessionState =
  | "not_started"
  | "running"
  | "paused"
  | "stopped"
  | "completed"
  | "blocked";

export interface SecretarySensorSessionRuntime {
  sessionId: string;
  state: SecretarySensorSessionState;
  contract: SecretaryMonitoringContract;
  startedAtMs?: number;
  endsAtMs?: number;
  stoppedReason?: string;
  evidenceSummary: string;
}

export function createSecretarySensorSessionRuntime(
  sessionId: string,
  input: SecretaryMonitoringContractInput,
): SecretarySensorSessionRuntime {
  return {
    sessionId,
    state: "not_started",
    contract: createSecretaryMonitoringContract(input),
    evidenceSummary: "not started",
  };
}

export function startSecretarySensorSession(
  runtime: SecretarySensorSessionRuntime,
  nowMs: number,
): SecretarySensorSessionRuntime {
  if (!runtime.contract.approved) {
    return {
      ...runtime,
      state: "blocked",
      stoppedReason: runtime.contract.blockedReason ?? "contract_not_approved",
      evidenceSummary: "session blocked before start",
    };
  }
  return {
    ...runtime,
    state: "running",
    startedAtMs: nowMs,
    endsAtMs: nowMs + runtime.contract.maxDurationSeconds * 1000,
    evidenceSummary: "bounded local sensor session started",
  };
}

export function pauseSecretarySensorSession(
  runtime: SecretarySensorSessionRuntime,
  reason = "human_pause",
): SecretarySensorSessionRuntime {
  if (runtime.state !== "running") return runtime;
  return {
    ...runtime,
    state: "paused",
    stoppedReason: reason,
    evidenceSummary: "session paused",
  };
}

export function stopSecretarySensorSession(
  runtime: SecretarySensorSessionRuntime,
  reason = "human_stop",
): SecretarySensorSessionRuntime {
  if (runtime.state === "completed" || runtime.state === "stopped") return runtime;
  return {
    ...runtime,
    state: "stopped",
    stoppedReason: reason,
    evidenceSummary: "session stopped and gate restored HOLD",
  };
}

export function tickSecretarySensorSession(
  runtime: SecretarySensorSessionRuntime,
  nowMs: number,
): SecretarySensorSessionRuntime {
  if (runtime.state !== "running") return runtime;
  if (runtime.endsAtMs !== undefined && nowMs >= runtime.endsAtMs) {
    return {
      ...runtime,
      state: "completed",
      stoppedReason: "duration_elapsed",
      evidenceSummary: "session completed by duration cap and gate restored HOLD",
    };
  }
  return runtime;
}


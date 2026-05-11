/**
 * Controlled Pilot 事前判定 — **実行なし**。`GO_READY` でも自動 `execFile` しない。
 */
import type {
  HermesControlledPilotConfig,
  HermesControlledPilotConfigValidationResult,
} from "./hermes-controlled-pilot-config";
import {
  summarizeHermesControlledPilotConfig,
  validateHermesControlledPilotConfig,
} from "./hermes-controlled-pilot-config";

/** すべて **人手で true を立てた**ときのみ Controlled Pilot が論理的に「単発許容」 */
export interface HermesControlledPilotPreflightContext {
  readonly humanSignoffRecordedForSingleControlledRun: boolean;
  readonly hermesArgvAndStdoutContractAcknowledged: boolean;
  readonly bridgePayloadSchemaV1PolicyAcknowledged: boolean;
  readonly receiverQueueContractsAcknowledged: boolean;
  readonly controlledPilotAdapterCodeDeployed: boolean;
  /** Electron / IPC が Hermes ingress を公開していないことの確認 */
  readonly ipcHermesIngressDisconnected: boolean;
}

export type HermesControlledPilotPreflightStatus = "GO_READY" | "NO_GO";

export interface HermesControlledPilotPreflightResult {
  status: HermesControlledPilotPreflightStatus;
  /** 構成が揃い **次 Goal で人手が 1 回実行してよい** — 自動実行しない */
  canRunOnce: boolean;
  missing: string[];
  blockers: string[];
  warnings: string[];
  safeSummary: string[];
}

function contextKeysSatisfied(
  context: HermesControlledPilotPreflightContext,
): boolean {
  return (
    context.humanSignoffRecordedForSingleControlledRun &&
    context.hermesArgvAndStdoutContractAcknowledged &&
    context.bridgePayloadSchemaV1PolicyAcknowledged &&
    context.receiverQueueContractsAcknowledged &&
    context.controlledPilotAdapterCodeDeployed &&
    context.ipcHermesIngressDisconnected
  );
}

export function evaluateHermesControlledPilotPreflight(
  config: HermesControlledPilotConfig | undefined | null,
  context: HermesControlledPilotPreflightContext,
): HermesControlledPilotPreflightResult {
  const cv = validateHermesControlledPilotConfig(config);
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!cv.ok)
    blockers.push(
      ...cv.errors
        .slice(0, 8)
        .map((e) => `${e.code}${e.field ? `:${e.field}` : ""}`),
    );

  const ctxMissing: string[] = [];
  const ctxOk = contextKeysSatisfied(context);
  if (!context.humanSignoffRecordedForSingleControlledRun)
    ctxMissing.push("humanSignoffRecordedForSingleControlledRun");
  if (!context.hermesArgvAndStdoutContractAcknowledged)
    ctxMissing.push("hermesArgvAndStdoutContractAcknowledged");
  if (!context.bridgePayloadSchemaV1PolicyAcknowledged)
    ctxMissing.push("bridgePayloadSchemaV1PolicyAcknowledged");
  if (!context.receiverQueueContractsAcknowledged)
    ctxMissing.push("receiverQueueContractsAcknowledged");
  if (!context.controlledPilotAdapterCodeDeployed)
    ctxMissing.push("controlledPilotAdapterCodeDeployed");
  if (!context.ipcHermesIngressDisconnected)
    ctxMissing.push("ipcHermesIngressDisconnected");

  if (!ctxOk) blockers.push(`context:incomplete:${ctxMissing.join("|")}`);

  const canRunOnce = cv.ok && ctxOk && blockers.length === 0;
  const status: HermesControlledPilotPreflightStatus = canRunOnce
    ? "GO_READY"
    : "NO_GO";

  warnings.push("preflight:does_not_invoke_exec");

  const safeSummary = [
    ...summarizeHermesControlledPilotConfig(cv),
    `preflight_status:${status}`,
    `can_run_once_flag:${canRunOnce}`,
    `blockers_count:${blockers.length}`,
    `warnings_count:${warnings.length}`,
  ].slice(0, 24);

  return {
    status,
    canRunOnce,
    missing: [...new Set([...cv.missingFields])],
    blockers,
    warnings,
    safeSummary,
  };
}

export function createHermesControlledPilotPreflightReport(
  result: HermesControlledPilotPreflightResult,
): readonly string[] {
  return [...result.safeSummary];
}

export function createHermesControlledPilotNoGoReport(
  validation: HermesControlledPilotConfigValidationResult,
  extraLines: readonly string[],
): HermesControlledPilotPreflightResult {
  return {
    status: "NO_GO",
    canRunOnce: false,
    missing: [...validation.missingFields],
    blockers: [
      ...validation.errors
        .slice(0, 16)
        .map((e) => `${e.code}${e.field ? `:${e.field}` : ""}`),
      ...extraLines,
    ],
    warnings: ["preflight:forced_no_go"],
    safeSummary: [
      ...summarizeHermesControlledPilotConfig(validation),
      "preflight_status:NO_GO",
    ],
  };
}

/**
 * Control Center 向け Real Pilot minimal の **安全な短文要約**のみ組み立てる。
 */
import { getHermesBridgePilotReadiness } from "./hermes-bridge-readiness";
import {
  createHermesRealPilotMinimalSummaryLines,
  type HermesRealPilotMinimalResult,
} from "./hermes-real-pilot-minimal";

/** 実 Hermes 接続 READY ではなく「minimal stub パイプライン利用可」のラベル */
export const READY_FOR_REAL_HERMES_PILOT_MINIMAL_STUB =
  "READY_FOR_REAL_HERMES_PILOT_MINIMAL_STUB" as const;

/** 実プロセス adapter が開放されていないことの固定ラベル（NOT ready for process） */
export const NOT_READY_FOR_REAL_HERMES_PROCESS =
  "NOT_READY_FOR_REAL_HERMES_PROCESS" as const;

export const REAL_PILOT_MINIMAL_PIPELINE_READY_MESSAGE =
  "Real pilot minimal pipeline is ready with sandbox file handoff." as const;

export const REAL_HERMES_PROCESS_ADAPTER_DISABLED_MESSAGE =
  "Real Hermes process adapter remains disabled." as const;

/** 実プロセス adapter のコード最小値はあり（継続運用 Hermes READY ではない） */
export const REAL_HERMES_PROCESS_ADAPTER_MINIMAL_CODE_READY =
  "REAL_HERMES_PROCESS_ADAPTER_MINIMAL_CODE_READY" as const;

export const REAL_HERMES_PROCESS_CONTROLLED_PILOT_CODE_READY =
  "REAL_HERMES_PROCESS_CONTROLLED_PILOT_CODE_READY" as const;

export const REAL_ADAPTER_CONTROLLED_PILOT_CODE_MESSAGE =
  "Controlled pilot Run code path active (execFile gated, evidence meta only); no daemon or production READY." as const;

export interface HermesRealPilotControlCenterSummaryInput {
  projectRoot: string;
  result: HermesRealPilotMinimalResult;
  scenarioSuiteLabel?: string;
}

/** allowedApis / forbiddenApis 配列・raw payload は含めない */
export interface HermesRealPilotControlCenterSummary {
  pilotLabel: typeof READY_FOR_REAL_HERMES_PILOT_MINIMAL_STUB;
  status: HermesRealPilotMinimalResult["status"];
  inputKind: "sandbox_file_handoff" | "exec_adapter_ingress";
  bridgeReadinessLabel: string;
  scenarioSuiteLabel: string;
  productionMode: "fail_closed";
  partialMode: HermesRealPilotMinimalResult["partialMode"];
  approvalsCreated: number;
  auditRecordsCreated: number;
  reportsCreated: number;
  forbiddenCount: number;
  blockedCount: number;
  summaryLines: readonly string[];
  realProcessGate:
    | typeof NOT_READY_FOR_REAL_HERMES_PROCESS
    | typeof REAL_HERMES_PROCESS_CONTROLLED_PILOT_CODE_READY;
  minimalPipelineMessage: typeof REAL_PILOT_MINIMAL_PIPELINE_READY_MESSAGE;
  adapterDisabledMessage:
    | typeof REAL_HERMES_PROCESS_ADAPTER_DISABLED_MESSAGE
    | typeof REAL_ADAPTER_CONTROLLED_PILOT_CODE_MESSAGE;
}

export function buildHermesRealPilotControlCenterSummary(
  input: HermesRealPilotControlCenterSummaryInput,
): HermesRealPilotControlCenterSummary {
  const r = input.result;
  const { label: bridgeReadinessLabel } = getHermesBridgePilotReadiness({
    projectRoot: input.projectRoot,
  });

  const execIngress = r.processAdapterIngress ?? "none";
  const resolvedGate =
    execIngress === "exec_completed"
      ? REAL_HERMES_PROCESS_CONTROLLED_PILOT_CODE_READY
      : NOT_READY_FOR_REAL_HERMES_PROCESS;
  const resolvedAdapterNote =
    execIngress === "exec_completed"
      ? REAL_ADAPTER_CONTROLLED_PILOT_CODE_MESSAGE
      : REAL_HERMES_PROCESS_ADAPTER_DISABLED_MESSAGE;
  const inputKindResolved =
    execIngress === "none" ? "sandbox_file_handoff" : "exec_adapter_ingress";

  return {
    pilotLabel: READY_FOR_REAL_HERMES_PILOT_MINIMAL_STUB,
    status: r.status,
    inputKind: inputKindResolved,
    bridgeReadinessLabel,
    scenarioSuiteLabel:
      input.scenarioSuiteLabel ?? "minimal_pipeline_no_external_process",
    productionMode: "fail_closed",
    partialMode: r.partialMode,
    approvalsCreated: r.counts.approvalsPersisted,
    auditRecordsCreated: r.counts.auditPersistenceLinesEstimate,
    reportsCreated: r.counts.reportsQueued,
    forbiddenCount: r.counts.forbiddenOperations,
    blockedCount: r.counts.blockedSensitiveOperations,
    summaryLines: createHermesRealPilotMinimalSummaryLines(r),
    realProcessGate: resolvedGate,
    minimalPipelineMessage: REAL_PILOT_MINIMAL_PIPELINE_READY_MESSAGE,
    adapterDisabledMessage: resolvedAdapterNote,
  };
}

/** Goal 文書の別名 */
export const createHermesRealPilotMinimalControlCenterSummary =
  buildHermesRealPilotControlCenterSummary;

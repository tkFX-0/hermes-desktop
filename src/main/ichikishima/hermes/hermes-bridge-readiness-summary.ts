import type { HermesBridgePilotDryRunResult } from "./hermes-bridge-pilot-dry-run";
import { HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL } from "./hermes-bridge-pilot-dry-run";
import type { HermesBridgePilotLabel } from "./hermes-bridge-readiness";
import { getHermesBridgePilotReadiness } from "./hermes-bridge-readiness";
import type {
  HermesConnectionAdapterResult,
  HermesConnectionAdapterSummary,
} from "./hermes-connection-adapter";

/** allowedApis / forbiddenApis 配列を含めない read-only ダッシュボード用。 */
export interface HermesBridgeReadinessControlCenterSummary {
  bridgeReadinessLabel: HermesBridgePilotLabel;
  ready: boolean;
  blockerCount: number;
  requiredHumanReviewCount: number;
  adapterStage: "stage_0_in_memory";
  partialMode: "dry_run_only" | "disabled";
  productionMode: "fail_closed";
}

export interface HermesBridgeScenarioSuiteControlCenterSummary {
  scenarioSuiteLabel: string;
  lastDryRunStatus: "passed" | "failed" | "not_run";
}

/** Adapter の短文メタのみ（enqueuePayload を含めない）。 */
export interface HermesConnectionAdapterControlCenterWire {
  adapterKind: "in_memory";
  payloadSchemaVersionMatched: boolean;
  taskIdBrief?: string;
  operationCount: number;
  partialEligibleShown: boolean;
  interactionModeLabel: HermesConnectionAdapterSummary["interactionModeLabel"];
  tierSummaryLabel: string;
  diagnosticsCodes: readonly string[];
}

export function createHermesBridgeReadinessSummaryForControlCenter(input: {
  projectRoot: string;
}): HermesBridgeReadinessControlCenterSummary {
  const r = getHermesBridgePilotReadiness(input);
  return {
    bridgeReadinessLabel: r.label,
    ready: r.ready,
    blockerCount: r.blockers.length,
    requiredHumanReviewCount: r.requiredHumanReviews.length,
    adapterStage: "stage_0_in_memory",
    partialMode: r.ready ? "dry_run_only" : "disabled",
    productionMode: "fail_closed",
  };
}

export function createHermesBridgeScenarioSuiteSummaryForControlCenter(
  suite: HermesBridgePilotDryRunResult | null,
): HermesBridgeScenarioSuiteControlCenterSummary {
  if (!suite) {
    return {
      scenarioSuiteLabel: "NOT_RUN",
      lastDryRunStatus: "not_run",
    };
  }
  return {
    scenarioSuiteLabel: HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL,
    lastDryRunStatus: suite.status === "passed" ? "passed" : "failed",
  };
}

export function createHermesConnectionAdapterSummaryForControlCenter(
  adapterResult: HermesConnectionAdapterResult | null,
): HermesConnectionAdapterControlCenterWire | null {
  if (!adapterResult) return null;
  const s = adapterResult.summary;
  const codes =
    adapterResult.status === "rejected"
      ? [...adapterResult.summary.diagnostics]
      : [...s.diagnostics];
  return {
    adapterKind: "in_memory",
    payloadSchemaVersionMatched: s.payloadSchemaVersionMatched,
    taskIdBrief: s.taskIdBrief,
    operationCount: s.operationCount,
    partialEligibleShown: s.partialEligible,
    interactionModeLabel: s.interactionModeLabel,
    tierSummaryLabel: s.tierSummaryLabel,
    diagnosticsCodes: codes,
  };
}

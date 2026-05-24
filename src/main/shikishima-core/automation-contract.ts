import type { OperationActionKind } from "./operation-ledger-types";

export type AutomationMode = "draft_only" | "read_only" | "one_shot_external" | "continuous_hold";

export interface AutomationContract {
  automationId: string;
  scheduleLabel: string;
  purpose: string;
  mode: AutomationMode;
  allowedActions: readonly OperationActionKind[];
  forbiddenActions: readonly OperationActionKind[];
  maxRunCount: number;
  maxDurationSeconds: number;
  gateRequired: boolean;
  evidencePath: string;
  stopConditions: readonly string[];
  productionReady: false;
  execution: "disabled";
}

export function validateAutomationContract(contract: AutomationContract): {
  ok: boolean;
  reason?: string;
} {
  if (contract.productionReady !== false) return { ok: false, reason: "production_ready_must_be_false" };
  if (contract.execution !== "disabled") return { ok: false, reason: "execution_must_be_disabled" };
  if (contract.maxRunCount < 1) return { ok: false, reason: "max_run_count_required" };
  if (contract.maxDurationSeconds < 1) return { ok: false, reason: "max_duration_required" };
  if (!contract.evidencePath) return { ok: false, reason: "evidence_path_required" };
  if (contract.mode === "continuous_hold" && !contract.gateRequired) {
    return { ok: false, reason: "continuous_mode_requires_gate" };
  }
  return { ok: true };
}

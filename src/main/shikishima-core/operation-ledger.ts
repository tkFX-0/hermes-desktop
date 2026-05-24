import type { OperationActionKind, OperationLedgerEntry } from "./operation-ledger-types";

export interface LedgerDraftInput {
  operationId: string;
  source: OperationLedgerEntry["source"];
  agentId: string;
  modelId: string;
  gateId: string;
  actionKind: OperationActionKind;
  inputSummary: string;
  outputSummary: string;
  evidenceFile: string;
  humanGoTicket?: string;
  externalWrite?: boolean;
  deviceAction?: boolean;
  runtimeStarted?: boolean;
  runCount?: number;
  gateRestoredHold?: boolean;
}

export function createDryRunLedgerEntry(input: LedgerDraftInput): OperationLedgerEntry {
  return {
    operationId: input.operationId,
    source: input.source,
    agentId: input.agentId,
    modelId: input.modelId,
    gateId: input.gateId,
    humanGoTicket: input.humanGoTicket,
    actionKind: input.actionKind,
    inputSummary: input.inputSummary,
    outputSummary: input.outputSummary,
    externalWrite: input.externalWrite ?? false,
    deviceAction: input.deviceAction ?? false,
    runtimeStarted: input.runtimeStarted ?? false,
    runCount: input.runCount ?? 0,
    gateRestoredHold: input.gateRestoredHold ?? true,
    evidenceFile: input.evidenceFile,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
  };
}

export function validateLedgerEntry(entry: OperationLedgerEntry): { ok: boolean; reason?: string } {
  if (entry.productionReady !== false) return { ok: false, reason: "production_ready_must_be_false" };
  if (entry.execution !== "disabled") return { ok: false, reason: "execution_must_be_disabled" };
  if (entry.rawValuesReported !== false) return { ok: false, reason: "raw_values_must_not_be_reported" };
  if (!entry.evidenceFile) return { ok: false, reason: "evidence_file_required" };
  if (entry.runCount < 0) return { ok: false, reason: "run_count_invalid" };
  return { ok: true };
}

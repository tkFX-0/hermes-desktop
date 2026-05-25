import type { SecretaryExternalWriteDraft } from "./secretary-external-write-policy";

export interface SecretaryExternalWriteExecutionResult {
  ok: boolean;
  reason: string;
  writePerformed: boolean;
  gateRestoredHold: boolean;
  rawValuesReported: false;
  retryLoop: false;
  evidenceSummary: string;
}

export function executeSecretaryExternalWriteDraft(
  draft: SecretaryExternalWriteDraft,
  performWrite: false | (() => { ok: boolean; reason?: string }),
): SecretaryExternalWriteExecutionResult {
  if (!draft.canExecuteNow) {
    return {
      ok: false,
      reason: "draft_not_approved",
      writePerformed: false,
      gateRestoredHold: true,
      rawValuesReported: false,
      retryLoop: false,
      evidenceSummary: "external write blocked before execution",
    };
  }
  if (performWrite === false) {
    return {
      ok: false,
      reason: "write_adapter_not_supplied",
      writePerformed: false,
      gateRestoredHold: true,
      rawValuesReported: false,
      retryLoop: false,
      evidenceSummary: "approved draft exists, but no write adapter was supplied",
    };
  }

  const result = performWrite();
  return {
    ok: result.ok,
    reason: result.reason ?? (result.ok ? "write_performed_once" : "write_adapter_failed"),
    writePerformed: result.ok,
    gateRestoredHold: true,
    rawValuesReported: false,
    retryLoop: false,
    evidenceSummary: result.ok
      ? "external write performed once and gate restored HOLD"
      : "external write failed and gate restored HOLD",
  };
}


# Control Center Tech Debt

## 2026-05-07: AppSnapshot `redactedSummaryLines` wire slimming

Status: resolved for GET_APP_SNAPSHOT wire payload / keep regression guard

Context:
- B-1 legacy `controlCenter.readonly.getSnapshot` IPC was retired.
- Canonical IPC is `controlCenter.readonly.getAppSnapshot`.
- Raw `allowedApis` / `forbiddenApis` arrays are guarded from IPC wire payloads.

Resolution:
- `ControlCenterAppSnapshot.wsl2LocalValueValidationSummary` now uses a wire-safe local validation summary.
- `redactedSummaryLines` remains available in the Hermes validator report for Signoff/docs workflows, but is removed before GET_APP_SNAPSHOT wire exposure.
- Renderer-safe fields remain structured counts, decision/status, policy booleans, execution flags, and slot-only availability status.

Guardrails:
- Do not remove redaction checks while slimming.
- Do not add raw `allowedApis` / `forbiddenApis` arrays.
- Do not add raw WSL local-only values.
- Do not re-add `redactedSummaryLines` to `ControlCenterAppSnapshot` or GET_APP_SNAPSHOT wire payloads.
- Keep `productionReady:false` and execution buttons disabled unless a separate approved Goal changes the gate.

Next candidate Goal:
- Keep wire-safe summary regression tests during future Control Center snapshot changes.

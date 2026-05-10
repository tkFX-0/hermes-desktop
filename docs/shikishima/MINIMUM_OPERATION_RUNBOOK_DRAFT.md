# Minimum Human-Supervised Operation Runbook Draft

## Purpose

This draft defines future minimum operation conditions. It does not grant GO and
does not allow autonomous operation.

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- phaseStatus: runbook_draft_created / not_approved_for_execution

## Preconditions

- Phase 1-9 must be approved first.
- Human operator must be present and supervising.
- しずめ must classify the task.
- Raw-value redaction must pass.
- Local-only policy must pass.
- Execution scope must be explicit.
- Rollback or stop condition must exist.
- Output must be logged redacted-only.
- GO approval must be separate, explicit, and scoped.

## Minimum Operation Steps

1. Define a single scoped action.
2. Confirm decision state and safety boundary.
3. Run しずめ classification.
4. Confirm human GO wording for this action only.
5. Confirm rollback and stop condition.
6. Execute only the approved action.
7. Record a redacted operation log.
8. Return to HOLD after the scoped action unless separately approved.

## Not Allowed By This Draft

- autonomous operation.
- robot motion.
- RunPod, WSL, Hermes, wrapper, or packaged smoke without separate approval.
- productionReady true.
- broad GO.

この範囲では問題を検出していません。

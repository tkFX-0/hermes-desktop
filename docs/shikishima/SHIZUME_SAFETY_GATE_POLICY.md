# しずめ Safety Gate Policy

`しずめ` is the safety gate. It classifies work as GO, HOLD, or REJECT.

Decision matrix: `SHIZUME_DECISION_MATRIX.md`.

Default decision is HOLD. しずめ can block work, but cannot grant high-risk GO
alone. Human approval must be scoped. Approval for docs is not approval for
execution. Approval for commit is not approval for push. Approval for slot or
packaging readiness is not execution approval.

## GO

GO means the task may proceed only within the approved scope. GO does not imply
general execution permission.

GO requires:

- explicit human approval.
- clear scope.
- no raw-value leakage.
- no hidden execution boundary.
- verification plan.

## HOLD

HOLD means do not proceed beyond the current boundary.

HOLD applies when:

- human approval is missing.
- safety policy is incomplete.
- raw-value risk exists.
- execution boundary is unclear.
- device/robot/network/RunPod boundary is involved.
- production readiness is not proven.

## REJECT

REJECT means the task must not proceed as requested.

REJECT applies when:

- it requests unsafe execution.
- it bypasses approval.
- it exposes raw values.
- it asks for arbitrary command/argv execution.
- it enables production prematurely.

## Current Global State

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

## Explicitly Forbidden Without Separate Approval

- WSL execution.
- Hermes execution.
- wrapper/dummy execution.
- RunPod startup.
- StackChan or robot control.
- installs.
- external network.
- git push.
- GO transition.
- `productionReady: true`.

## Phase 5 Review Package

See `PHASE_5_SHIZUME_POLICY_REVIEW.md` for the v0.3.0 review package. しずめ can
block and classify, but cannot grant high-risk GO alone. The default remains
HOLD.

Approval for docs is not approval for execution. Approval for commit is not
approval for push. Slot confirmation and packaging readiness are not execution
approval.

この範囲では問題を検出していません。

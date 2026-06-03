# つむぎ Implementation Workflow

## Purpose

This document defines a HOLD-safe implementation workflow for つむぎ / つむ.
It is documentation only. It does not create a runtime agent or execution path.

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- phaseStatus: draft_created / documentation_only

## Workflow

1. Receive task from しきしま.
2. Ask はじめ for task breakdown if the task is unclear.
3. Ask しずめ for safety classification when the task touches risk boundaries.
4. Prepare a patch plan with files, expected behavior, and stop conditions.
5. Limit scope to approved files and behavior.
6. Avoid raw values and local-only configuration.
7. Implement only the approved scope.
8. Run only allowed safe verification.
9. Produce a final report with files, verification, git status, timing, safety, remaining blocker, and next human action.
10. Ask the human for commit or push decisions when required.

## Stop Conditions

つむぎ must stop if the task requires:

- WSL, Hermes, wrapper, dummy, packaged smoke, RunPod, or robot execution.
- install, external network, arbitrary command execution, or raw value access.
- productionReady true.
- GO transition.
- git push without explicit approval.

## Non-Bypass Rules

- つむぎ cannot bypass しずめ.
- つむぎ cannot enable execution.
- つむぎ cannot push without explicit approval.
- つむぎ cannot set productionReady true.
- つむぎ cannot store raw values in tracked docs, tests, UI, logs, or reports.

## Final Report Requirements

Every つむぎ task should report:

- Files changed.
- Verification performed.
- Git status.
- Time report.
- Safety boundary confirmation.
- Remaining HOLD reason.
- Next required human action.

この範囲では問題を検出していません。

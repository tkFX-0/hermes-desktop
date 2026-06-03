# Execution Approval Separation Policy

## Purpose

This policy separates documentation approval, commit approval, push approval,
execution approval, RunPod approval, robot approval, production readiness, and
GO approval.

## Approval Types

| Approval type | Meaning | What it does not approve |
|---|---|---|
| documentation approval | docs may be treated as reference | execution, push, GO |
| local commit approval | local commit may be created | push, execution, production readiness |
| push approval | remote push may be performed | execution, GO, production readiness |
| execution approval | a scoped action may run | broader or repeated execution |
| RunPod approval | external GPU use may be scoped | local-only/private data transfer by default |
| robot/StackChan approval | a scoped physical/display action may be reviewed | autonomous motion |
| productionReady approval | release readiness may be reviewed | automatic GO |
| GO approval | a specific scoped action may proceed | unrelated actions |

## Examples

- "Approve docs" does not mean push.
- "Approve commit" does not mean push.
- "Approve push" does not mean execution.
- "Approve Phase 10 draft" does not mean first operation.
- "Approve StackChan expression plan" does not mean robot control.

この範囲では問題を検出していません。

# Shikishima Tomorrow Debug and Review Package — v2.7.0

## Purpose

Entry point for the next review/debug session.
Read this file first. It links to all relevant review materials.

- documentVersion: v2.7.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Quick Status (as of this session)

| Item | Status |
|---|---|
| roadmapVersion | v2.7.0 |
| decision | HOLD |
| execution | disabled |
| productionReady | false |
| rawValuesReported | false |
| robotMotion | HOLD |
| StackChan | purchased — NOT connected |
| Current level | Level 0 (docs-only) |
| Tests staged | NO |
| Tests committed | NO |
| Any validation run | NO |
| G-01 issued | NO |
| G-02 issued | NO |
| G-03–G-24 issued | NO |

---

## Today's Implementation Summary

| Task | Version | Files | Status |
|---|---|---|---|
| V3 Non-Execution Pack | v2.3.0 | 5 docs | DONE |
| Static Dashboard | v2.4.0 | HTML sections | DONE |
| Face Terminal / StackChan Plans | v2.5.0 | 5 docs | DONE |
| Pilot / Production Runbooks | v2.6.0 | 5 docs | DONE |
| Tomorrow Debug Package | v2.7.0 | 5 docs | DONE |
| Renderer src changes | — | HOLD | HOLD (not modified) |

---

## Tomorrow's Review Order

**Minimum: Steps 1–3 (15 minutes)**

| Step | Action | Doc |
|---|---|---|
| 1 | Confirm current state | This file |
| 2 | Review tests/ichikishima for G-01 | TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md |
| 3 | Review tests/hermes for G-02 | TESTS_HERMES_REVIEW_PACKAGE.md |
| 4 | Decide GO G-01 and/or GO G-02 | TOMORROW_GO_HOLD_DECISION_SHEET.md |
| 5 | Review validation plan | V3_STATIC_VALIDATION_PLAN.md |
| 6 | Decide GO G-03/G-04/G-05 | TOMORROW_COMMAND_EXECUTION_BOUNDARY.md |
| 7 | Review StackChan status | TOMORROW_STACKCHAN_BOUNDARY_CHECK.md |
| 8 | Record decisions | V3_HUMAN_GO_CHECKLIST.md |

---

## Key Files for Tomorrow

| Priority | File | Purpose |
|---|---|---|
| Must read | `TOMORROW_GO_HOLD_DECISION_SHEET.md` | GO/HOLD decision guide |
| Must read | `TOMORROW_TEST_COMMIT_REVIEW_SHEET.md` | tests review quick reference |
| Must read | `TOMORROW_COMMAND_EXECUTION_BOUNDARY.md` | Command boundary clarification |
| Reference | `V3_STATIC_VALIDATION_PLAN.md` | Full validation command plan |
| Reference | `V3_HUMAN_GO_CHECKLIST.md` | GO checklists |
| Reference | `V3_REDACTED_RESULT_REVIEW_TEMPLATE.md` | Result reporting template |
| Reference | `HUMAN_REVIEW_DAY_RUNBOOK.md` | Full session runbook |
| Reference | `TOMORROW_STACKCHAN_BOUNDARY_CHECK.md` | StackChan confirmation |

---

## What Can Be Done Tomorrow Without GO

| Action | Notes |
|---|---|
| Read any docs file | Always allowed |
| Continue docs implementation | Always allowed (docs-only) |
| Review test files (read-only) | Always allowed |
| Write additional planning docs | Always allowed |
| Add face terminal UI code | Allowed (display-only, no IPC) |
| Add mouth/eye animation code | Allowed (display-only) |

---

## What Requires GO Tomorrow

| Action | Required Gate |
|---|---|
| Stage + commit tests/ichikishima | G-01 |
| Stage + commit tests/hermes | G-02 |
| Run typecheck:node | G-03 |
| Run typecheck:web | G-04 |
| Run eslint | G-05 |
| Run vitest | G-06 |
| Run build | G-07 |
| Any other command execution | Appropriate gate |

---

## HOLD Items Confirmed (do NOT do tomorrow without GO)

- tests/ichikishima: NOT staged, NOT committed
- tests/hermes: NOT staged, NOT committed
- docs/ichikishima: NOT staged, NOT committed
- sandbox: NOT staged, NOT committed (gitignored)
- WSL/Hermes: NOT executed
- StackChan: NOT connected
- voice/camera/microphone: NOT active
- productionReady: false (confirmed)
- git push: NOT performed

この範囲では問題を検出していません。

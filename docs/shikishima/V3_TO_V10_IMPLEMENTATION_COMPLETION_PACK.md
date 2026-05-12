# Shikishima v3 to v10 Implementation Completion Pack — v2.8.0

## Purpose

Maps all implementation items across v3–v10, classified by completion status.
Use as the master reference for "what remains to implement without GO."

- documentVersion: v2.8.0
- documentDate: 2026-05-12
- decision: HOLD / execution: disabled / productionReady: false

---

## Legend

| Symbol | Meaning |
|---|---|
| ✓ DONE | Implemented (docs or code committed) |
| ○ READY | Can implement now; no GO required |
| ◎ AFTER-GO | Requires human GO |
| ✗ HOLD | Cannot proceed; gate not met |

---

## v3: Execution Validation Readiness

| Item | Status | Notes |
|---|---|---|
| V3 Goal & Task Pack | ✓ DONE | v2.1.0 |
| Execution Validation Roadmap | ✓ DONE | v2.1.0 |
| HOLD Gate Matrix (19 gates) | ✓ DONE | v2.1.0 |
| Implementation Sequence | ✓ DONE | v2.1.0 |
| Test Commit Decision Matrix | ✓ DONE | v2.1.0 |
| Human GO Checklist | ✓ DONE | v2.1.0 |
| Static Validation Plan | ✓ DONE | v2.3.0 |
| Dummy/Wrapper Execution Plan | ✓ DONE | v2.3.0 |
| WSL/Hermes Execution Plan | ✓ DONE | v2.3.0 |
| Redacted Result Template | ✓ DONE | v2.3.0 |
| Tomorrow Debug Runbook | ✓ DONE | v2.3.0 |
| Tomorrow Debug Package | ✓ DONE | v2.7.0 |
| GO/HOLD Decision Sheet | ✓ DONE | v2.7.0 |
| Command Boundary | ✓ DONE | v2.7.0 |
| Test Commit Review Sheet | ✓ DONE | v2.7.0 |
| tests/ichikishima commit | ◎ AFTER-GO | G-01 |
| tests/hermes commit | ◎ AFTER-GO | G-02 |
| typecheck:node | ◎ AFTER-GO | G-03 |
| typecheck:web | ◎ AFTER-GO | G-04 |
| eslint | ◎ AFTER-GO | G-05 |
| v4 Readiness Package | ○ READY | Create V4_READINESS_PACKAGE.md |

---

## v4: Local Test / Static Validation

| Item | Status | Notes |
|---|---|---|
| V4 Local Validation Prep Package | ✓ DONE | v2.8.1 |
| V4 Validation Command Matrix | ✓ DONE | v2.8.1 |
| V4 Redacted Result Checklist | ✓ DONE | v2.8.1 |
| V4 Failure to HOLD Runbook | ✓ DONE | v2.8.1 |
| vitest execution | ◎ AFTER-GO | G-06 |
| build execution | ◎ AFTER-GO | G-07 |
| Error remediation (code) | ○ READY | After results known |
| V5 Readiness Package | ○ READY | Create V5_READINESS_PACKAGE.md |

---

## v5: Controlled Local-Only Dry-Run

| Item | Status | Notes |
|---|---|---|
| V5 Dry-Run Prep | ✓ DONE | v2.8.2 |
| V5 Local-Only Value Boundary | ✓ DONE | v2.8.2 |
| V5 Dry-Run Approval Template | ✓ DONE | v2.8.2 |
| V5 Dry-Run Rollback Runbook | ✓ DONE | v2.8.2 |
| Local dev run (G-20) | ◎ AFTER-GO | G-20 |
| Screen navigation review | ◎ AFTER-GO | After G-20 |
| V6 Readiness Package | ○ READY | Create V6_READINESS_PACKAGE.md |

---

## v6: Wrapper / Hermes / WSL Limited Validation

| Item | Status | Notes |
|---|---|---|
| WSL/Hermes Execution Plan | ✓ DONE | v2.3.0 |
| V6 Readiness Pack | ✓ DONE | v2.8.3 |
| V6 Wrapper Gate Checklist | ✓ DONE | v2.8.3 |
| V6 WSL/Hermes Stop Conditions | ✓ DONE | v2.8.3 |
| V6 Redacted Execution Report | ✓ DONE | v2.8.3 |
| Dummy process execution | ◎ AFTER-GO | G-09 |
| Wrapper execution | ◎ AFTER-GO | G-10 |
| WSL execution | ◎ AFTER-GO | G-11 |
| Hermes execution | ◎ AFTER-GO | G-12 |
| RunPod integration plan | ○ READY | Create V6_RUNPOD_INTEGRATION_PLAN.md |
| V7 Readiness Package | ○ READY | Create V7_READINESS_PACKAGE.md |

---

## v7: Face Terminal / StackChan Display-Only

| Item | Status | Notes |
|---|---|---|
| Face Terminal Display-Only Spec | ✓ DONE | v2.5.0 |
| StackChan Display-Only Plan | ✓ DONE | v2.5.0 |
| Face Terminal Static Preview | ✓ DONE | v2.5.0 |
| V7 Device Readiness Pack | ✓ DONE | v2.8.4 |
| V7 StackChan Not Connected Checklist | ✓ DONE | v2.8.4 |
| V7 Face Terminal Static UI Review | ✓ DONE | v2.8.4 |
| V7 Display-Only Rollback Plan | ✓ DONE | v2.8.4 |
| Face terminal UI component (code) | ○ READY | renderer display-only |
| StackChan connection (display) | ◎ AFTER-GO | G-14 + hardware safety review |
| robotMotion | ✗ HOLD | G-22 (v9+) |
| V8 Readiness Package | ○ READY | Create V8_READINESS_PACKAGE.md |

---

## v8: Voice / Mouth / Eye Concept Validation

| Item | Status | Notes |
|---|---|---|
| Mouth/Eye Animation Spec | ✓ DONE | v2.5.0 |
| Voice/Mouth/Eye Non-IO Plan | ✓ DONE | v2.5.0 |
| V8 Non-IO Expression Pack | ✓ DONE | v2.8.5 |
| V8 Mouth Pattern Review Sheet | ✓ DONE | v2.8.5 |
| V8 Eye Gaze Review Sheet | ✓ DONE | v2.8.5 |
| V8 Voice Intent Label Review | ✓ DONE | v2.8.5 |
| V8 Audio/Camera/Mic HOLD Policy | ✓ DONE | v2.8.5 |
| Mouth animation component (code) | ○ READY | display-only, no audio |
| Eye gaze animation component (code) | ○ READY | display-only, no camera |
| Voice I/O (G-15) | ✗ HOLD | G-15 |
| Camera/microphone (G-16) | ✗ HOLD | G-16 |
| V9 Readiness Package | ○ READY | Create V9_READINESS_PACKAGE.md |

---

## v9: Controlled Pilot Readiness

| Item | Status | Notes |
|---|---|---|
| Controlled Pilot Runbook | ✓ DONE | v2.6.0 |
| Single-Run Approval Template | ✓ DONE | v2.6.0 |
| V9 Final Prep | ✓ DONE | v2.8.6 |
| V9 One-Run-Only Checklist | ✓ DONE | v2.8.6 |
| V9 Human Monitoring Checklist | ✓ DONE | v2.8.6 |
| V9 Pilot Stop and Rollback Card | ✓ DONE | v2.8.6 |
| Pilot scenario definition | ○ READY | Before G-23; docs only |
| Controlled pilot execution | ◎ AFTER-GO | G-23 |
| RunPod integration | ◎ AFTER-GO | G-13 (if needed) |
| V10 Readiness Package | ○ READY | Create V10_READINESS_PACKAGE.md |

---

## v10: Production Readiness Review

| Item | Status | Notes |
|---|---|---|
| Production Ready Definition | ✓ DONE | v2.2.0 |
| Controlled Pilot Definition | ✓ DONE | v2.2.0 |
| V10 Review Package | ✓ DONE | v2.6.0 |
| V10 Final Human Approval Template | ✓ DONE | v2.6.0 |
| productionReady False Guard | ✓ DONE | v2.6.0 |
| V10 Final Review Pack | ✓ DONE | v2.8.7 |
| V10 False Confirmation | ✓ DONE | v2.8.7 |
| V10 Approval Not Yet Granted Notice | ✓ DONE | v2.8.7 |
| V10 Release Blocker Matrix | ✓ DONE | v2.8.7 |
| V10 Pre-Production Audit Template | ✓ DONE | v2.8.7 |
| G-18 (productionReady = true) | ✗ HOLD | Final human approval only |
| G-19 (execution = enabled) | ✗ HOLD | Final human approval only |

---

## READY Items (can implement now, no GO)

| Priority | Item | Type |
|---|---|---|
| 1 | tests/ichikishima CI guard verification (read-only) | review |
| 2 | Face terminal UI component | code (display-only) |
| 3 | Mouth animation component | code (display-only) |
| 4 | Eye gaze animation component | code (display-only) |
| 5 | V4_READINESS_PACKAGE.md | docs |
| 6 | V5_READINESS_PACKAGE.md | docs |
| 7 | V6_READINESS_PACKAGE.md | docs |
| 8 | V6_RUNPOD_INTEGRATION_PLAN.md | docs |
| 9 | V7_READINESS_PACKAGE.md | docs |
| 10 | Pilot scenario definition docs | docs |

この範囲では問題を検出していません。

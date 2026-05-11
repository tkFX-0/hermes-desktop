# Shikishima v3+ Implementation Backlog — v2.2.0

## Purpose

Lists all implementation tasks available for coding work from v3 onward.
Tasks are classified by whether they require human GO before starting.
This backlog is docs-only and coding-only. No execution tasks are listed as "start now."

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Backlog Classification

| Class | Meaning |
|---|---|
| `READY` | Can start immediately; no GO required |
| `AFTER-GO` | Requires human GO before starting |
| `AFTER-STAGE` | Requires prior stage completion |

---

## Immediately Available (no GO required)

### Documentation Tasks

| Task | File | Purpose |
|---|---|---|
| v3.1 tests final review | Read-only review of tests/ichikishima + tests/hermes | Pre-commit review; confirm CI guard |
| v3.3 static validation plan | `V3_STATIC_VALIDATION_PLAN.md` (create in v3.3) | Document exact commands for typecheck/eslint/vitest |
| v3.7 dummy/wrapper plan | `V3_DUMMY_WRAPPER_EXECUTION_PLAN.md` | Document dummy process and wrapper execution plan |
| v3.8 WSL/Hermes plan | `V3_WSL_HERMES_EXECUTION_PLAN.md` | Document WSL and Hermes execution requirements |
| v3.9 v4 readiness package | `V4_READINESS_PACKAGE.md` | v4 preconditions document |
| v5.1 local dev run plan | `V5_LOCAL_DEV_RUN_PLAN.md` | Define startup sequence and test scenarios |
| v6.7 RunPod integration plan | `V6_RUNPOD_INTEGRATION_PLAN.md` | Plan-only; no connection |
| v7.1 face terminal display plan | `V7_FACE_TERMINAL_PLAN.md` | Face terminal UI spec |
| v7.5 Android display plan | `V7_ANDROID_DISPLAY_PLAN.md` | Smartphone face display plan |
| v8.3 voice I/O concept plan | `V8_VOICE_IO_CONCEPT_PLAN.md` | TTS/STT concept; no audio execution |
| v9.1 integrated subsystem review | Review doc | Post-v8 integration review |
| v9.2 pilot runbook | `V9_PILOT_RUNBOOK.md` | Controlled pilot definition |
| v9.3 pilot safety review | `V9_SAFETY_REVIEW.md` | Pre-pilot safety audit |
| v9.5 pre-production checklist | `V9_PREPRODUCTION_CHECKLIST.md` | All conditions before v10 |

---

### Coding Tasks (no GO required for code; GO required if commands run)

| Task | Target | Purpose | Notes |
|---|---|---|---|
| v7.2 face terminal UI | `src/renderer/src/screens/` | Face terminal component | Implement display; no device connection |
| v7.2 expression display | `src/renderer/src/` | Expression rendering | Static display only |
| v7.2 animation timing | `src/renderer/src/` | Expression timing logic | CSS/JS animation only |
| v8.1 mouth animation | `src/renderer/src/` | Mouth pattern engine | Display-only; no audio |
| v8.2 eye gaze animation | `src/renderer/src/` | Eye gaze animation | Display-only; no camera |
| Safety label hardening | Various src files | Stronger non-execution labels | e.g., UI disclaimers |
| i18n additions | `src/shared/i18n/` | New strings for v7–v8 features | No execution change |

---

### Safety Hardening Tasks (always available)

| Task | Target | Purpose |
|---|---|---|
| Add non-execution disclaimers to new screens | Renderer src | Prevent misinterpretation |
| Add HOLD badges to placeholder UI | Renderer src | Visual HOLD state |
| Review ControlCenter IPC for any new channels | src/main/ | Confirm read-only maintained |
| Review Research.tsx for hardcoded values | src/renderer | Confirm no raw local paths |

---

## After G-01 / G-02 (tests commit GO)

| Task | Dependency | Purpose |
|---|---|---|
| Stage + commit tests/ichikishima/ | G-01 | Commit test suite |
| Stage + commit tests/hermes/ | G-02 | Commit test suite |
| Update working tree status docs | After commit | Record clean state |

---

## After G-03 / G-04 / G-05 (validation GO)

| Task | Dependency | Purpose |
|---|---|---|
| Run typecheck:node | G-03 | Capture redacted output |
| Run typecheck:web | G-04 | Capture redacted output |
| Run eslint | G-05 | Capture redacted output |
| Create redacted result doc | After G-03–G-05 | v3.5 result review |
| Fix typecheck/eslint errors | After results | v4.4 remediation |

---

## After G-06 (vitest GO)

| Task | Dependency | Purpose |
|---|---|---|
| Run vitest (CI mode) | G-06 | Full test suite run |
| Create redacted vitest result doc | After run | Pass/fail analysis |
| Fix test failures | After results | v4.4 remediation |

---

## After G-07 (build GO)

| Task | Dependency | Purpose |
|---|---|---|
| Run build | G-07 | Electron app build |
| Review build output (redacted) | After build | Error analysis |

---

## After G-14 (StackChan display-only GO)

| Task | Dependency | Purpose |
|---|---|---|
| StackChan connection (display) | G-14 | Display-only connection |
| Expression display test | G-14 | Confirm display-only |
| Face terminal hardware review | G-14 | Safety confirmation |

---

## After G-23 (controlled pilot GO)

| Task | Dependency | Purpose |
|---|---|---|
| Execute pilot run #1 | G-23 | Single supervised run |
| Redacted result review | After run | Analyze output |
| Go/No-go for next step | After review | v10 readiness decision |

---

## Backlog Priority for Next Session

Recommended order for immediate work (all `READY`):

1. v3.1: tests/ichikishima final review (read-only)
2. v3.3: static validation command plan (`V3_STATIC_VALIDATION_PLAN.md`)
3. v3.7: dummy/wrapper execution plan (`V3_DUMMY_WRAPPER_EXECUTION_PLAN.md`)
4. v3.8: WSL/Hermes execution plan (`V3_WSL_HERMES_EXECUTION_PLAN.md`)
5. v7.1: face terminal display plan (`V7_FACE_TERMINAL_PLAN.md`)
6. v8.3: voice I/O concept plan (`V8_VOICE_IO_CONCEPT_PLAN.md`)
7. v9.2: pilot runbook (`V9_PILOT_RUNBOOK.md`)

All of the above are docs-only. No GO required. Can be done in any order.

この範囲では問題を検出していません。

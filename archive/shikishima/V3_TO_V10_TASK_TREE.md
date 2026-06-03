# Shikishima v3 to v10 Task Tree — v2.2.0

## Purpose

Hierarchical breakdown of all implementation tasks from v3 through v10.
Each task is classified by type: docs-only, coding, command-execution (HOLD), or hardware (HOLD).
No task in this tree is pre-approved for execution.

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Task Type Legend

| Type | Meaning | GO required? |
|---|---|---|
| `[docs]` | Documentation only — always allowed | No |
| `[code]` | Source code change — allowed in scope | No (unless builds run) |
| `[cmd]` | Command execution — requires human GO | Yes |
| `[hw]` | Hardware action — requires hardware safety review + GO | Yes |
| `[HOLD]` | Gated — cannot proceed without human GO | Yes |

---

## v3: Execution Validation Readiness

```
v3.0 V3 Goal & Task Pack [docs] ← DONE
v3.1 tests/ichikishima + tests/hermes final review [docs]
  ├── Read all 66 tests/ichikishima files [docs]
  ├── Read all 12 tests/hermes files [docs]
  ├── Verify CI guard on process-local test [docs]
  ├── Verify no raw values in fixtures [docs]
  └── Update V3_TEST_COMMIT_DECISION_MATRIX.md [docs]
[HOLD: G-01] tests/ichikishima commit GO
[HOLD: G-02] tests/hermes commit GO
v3.2 Test suite commit [HOLD → cmd after GO]
  ├── Stage tests/ichikishima/ [cmd]
  ├── Commit tests/ichikishima/ [cmd]
  ├── Stage tests/hermes/ [cmd]
  └── Commit tests/hermes/ [cmd]
v3.3 Static validation command plan [docs]
  ├── Document npm run typecheck:node command [docs]
  ├── Document npm run typecheck:web command [docs]
  ├── Document eslint command [docs]
  ├── Document vitest run command + CI guard [docs]
  └── Define redaction policy for output [docs]
[HOLD: G-03] typecheck:node GO
[HOLD: G-04] typecheck:web GO
[HOLD: G-05] eslint GO
v3.4 First validation execution [HOLD → cmd after GO]
  ├── Run typecheck:node (redacted output) [cmd]
  ├── Run typecheck:web (redacted output) [cmd]
  └── Run eslint (redacted output) [cmd]
v3.5 Redacted validation result review [docs]
  ├── Classify errors: blocker / warning / expected [docs]
  └── Create remediation plan [docs + code]
v3.6 Local-only value boundary review [docs]
  ├── Define local-only value policy [docs]
  ├── Confirm localhost:8765 is display-only [docs]
  ├── Confirm dummy hermes paths [docs]
  └── Confirm WSL paths not in committed code [docs]
v3.7 Dummy/wrapper execution plan [docs]
  └── V3_DUMMY_WRAPPER_EXECUTION_PLAN.md [docs]
v3.8 WSL/Hermes execution plan [docs]
  └── V3_WSL_HERMES_EXECUTION_PLAN.md [docs]
v3.9 v4 readiness package [docs]
  └── V4_READINESS_PACKAGE.md [docs]
```

---

## v4: Local Test / Static Validation

```
v4.0 v4 Goal Pack [docs]
v4.1 vitest full run [HOLD → cmd after G-06]
  ├── Verify process-local test skips (CI=true) [cmd]
  ├── Run vitest in CI mode [cmd]
  └── Capture redacted pass/fail counts [cmd]
v4.2 Build execution [HOLD → cmd after G-07]
  └── npm run build (redacted output) [cmd]
v4.3 Full redacted result review [docs]
  ├── Classify all vitest failures [docs]
  ├── Classify all build errors [docs]
  └── Prioritize remediation [docs]
v4.4 Error remediation [code]
  ├── Fix typecheck errors (if any from v3.4) [code]
  ├── Fix eslint errors (if any) [code]
  ├── Fix test failures (if any) [code]
  └── Fix build errors (if any) [code]
v4.5 Re-run validation after fixes [cmd, after GO]
v4.6 v5 readiness package [docs]
  └── V5_READINESS_PACKAGE.md [docs]
```

---

## v5: Controlled Local-only Dry-run

```
v5.0 v5 Goal Pack [docs]
v5.1 Local dev run plan [docs]
  ├── Define startup sequence [docs]
  ├── Define test scenarios [docs]
  └── Define stop conditions [docs]
[HOLD] Local dev run GO
v5.2 Local dev execution [HOLD → cmd after GO]
  └── npm run dev (or electron-forge start) [cmd]
v5.3 Screen navigation review [docs]
  ├── Main screen [docs]
  ├── ControlCenter screen [docs]
  └── Research screen [docs]
v5.4 ControlCenter IPC test (local) [docs]
  ├── Verify read-only IPC [docs]
  └── Verify no execution channels exposed [docs]
v5.5 Research screen iframe check [docs]
  ├── Confirm localhost:8765 fallback [docs]
  └── Confirm graceful degradation if service absent [docs]
v5.6 v6 readiness package [docs]
```

---

## v6: Wrapper / Hermes / WSL Limited Validation

```
v6.0 v6 Goal Pack [docs]
v6.1 Dummy/wrapper execution plan finalize [docs]
[HOLD: G-09] dummy process GO
v6.2 Dummy process execution [HOLD → cmd after GO]
  └── Run dummy-hermes stub (local only) [cmd]
[HOLD: G-10] wrapper GO
v6.3 Wrapper execution [HOLD → cmd after GO]
[HOLD: G-11] WSL GO
v6.4 WSL execution [HOLD → cmd after GO]
  └── WSL command (scoped) [cmd]
[HOLD: G-12] Hermes GO
v6.5 Hermes local execution [HOLD → cmd after GO]
  └── Hermes via WSL (local only, no RunPod) [cmd]
v6.6 Hermes-IPC bridge test [docs + cmd after GO]
  └── Verify getAppSnapshot response [cmd]
v6.7 RunPod integration plan [docs]
  └── V6_RUNPOD_INTEGRATION_PLAN.md [docs]
v6.8 v7 readiness package [docs]
```

---

## v7: Face Terminal / StackChan Display-only Integration

```
v7.0 v7 Goal Pack [docs]
v7.1 Face terminal display plan [docs]
  ├── Face terminal UI spec [docs]
  ├── Expression set display plan [docs]
  └── Android/smartphone display plan [docs]
v7.2 Face terminal UI implementation [code]
  ├── Face terminal component [code]
  ├── Expression display [code]
  └── Animation timing [code]
[HOLD: G-14] StackChan connection GO (hardware safety review)
v7.3 StackChan connection display-only [HOLD → hw after GO]
  ├── Connect StackChan (display-only mode) [hw]
  └── Confirm no motion commands sent [hw]
v7.4 Face terminal display test [docs + hw]
  ├── Expression set display review [docs]
  └── Confirm display-only (robotMotion HOLD) [docs]
v7.5 Android/smartphone display test (plan) [docs]
v7.6 v8 readiness package [docs]
```

---

## v8: Voice / Mouth / Eye Concept Validation

```
v8.0 v8 Goal Pack [docs]
v8.1 Mouth animation implementation [code]
  ├── Mouth pattern engine [code]
  └── Animation sync with speech concept [code]
v8.2 Eye gaze animation implementation [code]
  ├── Gaze pattern engine [code]
  └── Attention direction concept [code]
v8.3 Voice I/O concept plan [docs]
  ├── TTS concept plan [docs]
  ├── STT concept plan [docs]
  └── Audio routing concept [docs]
[HOLD: G-15] voice I/O GO (audio safety review)
v8.4 Voice I/O execution [HOLD → cmd after GO]
[HOLD: G-16] camera/microphone GO
v8.5 Microphone/camera concept review [docs]
v8.6 v9 readiness package [docs]
```

---

## v9: Controlled Pilot Readiness

```
v9.0 v9 Goal Pack [docs]
v9.1 Integrated subsystem review [docs]
  ├── Hermes + IPC stability [docs]
  ├── Face terminal + StackChan [docs]
  └── Voice concept (if v8 complete) [docs]
v9.2 Pilot runbook definition [docs]
  ├── Pilot scenario #1 definition [docs]
  ├── Expected output specification [docs]
  ├── Stop conditions [docs]
  └── Rollback procedure [docs]
v9.3 Pilot safety review [docs]
  ├── Safety audit checklist [docs]
  └── Human monitor assignment plan [docs]
v9.4 RunPod integration (if needed) [HOLD: G-13]
v9.5 Pre-production checklist [docs]
v9.6 v10 readiness package [docs]
```

---

## v10: Production Readiness Review

```
v10.0 Full system review [docs]
  ├── All v3–v9 completion confirmed [docs]
  ├── All G-01–G-16 satisfied [docs]
  └── Open items list [docs]
v10.1 Final safety audit [docs + review]
  ├── Security review [docs]
  ├── Raw value audit [docs]
  ├── Device safety confirmation [docs]
  └── Emergency stop verification [docs]
v10.2 productionReady assessment [docs]
  └── PRODUCTION_READY_FINAL_ASSESSMENT.md [docs]
[HOLD: G-18] productionReady = true (final human approval ONLY)
[HOLD: G-19] execution = enabled (final human approval ONLY)
v10.3 Production deployment preparation [docs]
  └── Deployment runbook [docs]
```

---

## Tasks Available for Coding Right Now

The following tasks require no human GO and can be done in docs-only or code mode:

| Task | Type | Stage |
|---|---|---|
| v3.1 tests final review | docs | v3 |
| v3.3 static validation plan | docs | v3 |
| v3.7 dummy/wrapper plan | docs | v3 |
| v3.8 WSL/Hermes plan | docs | v3 |
| v7.1 face terminal UI spec | docs | v7 |
| v7.2 face terminal UI implementation | code | v7 |
| v8.1 mouth animation implementation | code | v8 |
| v8.2 eye gaze animation implementation | code | v8 |
| v8.3 voice I/O concept plan | docs | v8 |
| All readiness packages | docs | each stage |

この範�会では問題を検出していません。

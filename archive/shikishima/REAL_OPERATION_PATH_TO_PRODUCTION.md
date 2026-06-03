# Shikishima Real Operation Path to Production — v2.1.0

## Purpose

Maps the complete staged path from current HOLD state to eventual production readiness.
This document is planning-only. Each stage requires a separate human GO.
This document does not create GO approval, execution permission, or productionReady status.

- documentVersion: v2.1.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**productionReady remains false through every stage listed here.
Only a final separate human approval at v10 can set productionReady = true.**

---

## Stage Map

```
v3: Execution validation readiness
  ↓ [human GO: tests + validation]
v4: Local validation / test execution
  ↓ [human GO: local dry-run]
v5: Controlled local-only dry-run
  ↓ [human GO: wrapper/Hermes/WSL]
v6: Wrapper / Hermes / WSL limited validation
  ↓ [human GO: StackChan display-only]
v7: Face terminal / StackChan display-only integration
  ↓ [human GO: voice concept]
v8: Voice / mouth / eye concept validation
  ↓ [human GO: pilot readiness]
v9: Controlled pilot readiness
  ↓ [human GO: final production review]
v10: Production readiness review
  ↓ [final separate human approval]
PRODUCTION
```

---

## v3: Execution Validation Readiness

**Goal**: Prepare prerequisites for execution validation.

| Task | Status |
|---|---|
| v3.0 V3 Goal & Task Pack | DONE (this session) |
| v3.1 tests final review | HOLD |
| v3.2 tests commit | HOLD (G-01 + G-02) |
| v3.3 static validation plan | HOLD |
| v3.4 first validation execution | HOLD (G-03 through G-05) |
| v3.5 redacted result review | HOLD |
| v3.6 local-only value boundary | HOLD (G-08) |
| v3.7 dummy/wrapper plan | HOLD |
| v3.8 WSL/Hermes plan | HOLD |
| v3.9 v4 readiness package | HOLD |

**productionReady at end of v3**: false (unchanged)
**execution at end of v3**: disabled (unchanged)
**Conditions to enter v4**: tests committed; typecheck passes; v4 readiness package created; human GO for v4

---

## v4: Local Validation / Test Execution

**Goal**: Run full test suite locally; review results; confirm static analysis clean.

| Task | Status |
|---|---|
| v4.0 v4 Goal Pack | HOLD — after v3 complete |
| v4.1 vitest full run | HOLD (G-06) |
| v4.2 build execution | HOLD (G-07) |
| v4.3 full redacted result review | HOLD |
| v4.4 typecheck regression review | HOLD |
| v4.5 v5 readiness package | HOLD |

**productionReady at end of v4**: false (unchanged)
**execution at end of v4**: disabled (unchanged)
**Conditions to enter v5**: vitest passing; build succeeds; no blocker errors; human GO for v5

---

## v5: Controlled Local-Only Dry-Run

**Goal**: Run Electron app in local dev mode; verify basic screen navigation; no external connections.

| Task | Status |
|---|---|
| v5.0 v5 Goal Pack | HOLD — after v4 complete |
| v5.1 local dev run plan | HOLD |
| v5.2 local dev execution | HOLD (separate GO) |
| v5.3 screen navigation review | HOLD |
| v5.4 ControlCenter IPC test (local) | HOLD |
| v5.5 Research screen iframe check | HOLD |
| v5.6 v6 readiness package | HOLD |

**productionReady at end of v5**: false (unchanged)
**Conditions to enter v6**: app runs locally; basic screens work; no crashes; human GO for v6

---

## v6: Wrapper / Hermes / WSL Limited Validation

**Goal**: Validate Hermes connectivity through WSL in controlled local environment. No RunPod. No external network beyond WSL-local.

| Task | Status |
|---|---|
| v6.0 v6 Goal Pack | HOLD — after v5 complete |
| v6.1 dummy/wrapper execution (local) | HOLD (G-09 + G-10) |
| v6.2 WSL execution | HOLD (G-11) |
| v6.3 Hermes local execution | HOLD (G-12) |
| v6.4 Hermes-IPC bridge test | HOLD |
| v6.5 RunPod execution plan (docs-only) | HOLD |
| v6.6 v7 readiness package | HOLD |

**productionReady at end of v6**: false (unchanged)
**Conditions to enter v7**: Hermes runs locally; IPC bridge verified; human GO for v7

---

## v7: Face Terminal / StackChan Display-Only Integration

**Goal**: Display face terminal output only; no robot motion; StackChan connected but display-only; no execution commands.

| Task | Status |
|---|---|
| v7.0 v7 Goal Pack | HOLD — after v6 complete |
| v7.1 face terminal display plan | HOLD |
| v7.2 StackChan connection (display-only) | HOLD (G-14, hardware safety review) |
| v7.3 face terminal display test | HOLD |
| v7.4 expression set display review | HOLD |
| v7.5 v8 readiness package | HOLD |

**productionReady at end of v7**: false (unchanged)
**robotMotion at end of v7**: HOLD (display-only does NOT enable motion)
**Conditions to enter v8**: face display confirmed; hardware confirmed safe; human GO for v8

---

## v8: Voice / Mouth / Eye Concept Validation

**Goal**: Validate mouth animation and eye gaze animation concept in local display only; no audio I/O unless separate GO.

| Task | Status |
|---|---|
| v8.0 v8 Goal Pack | HOLD — after v7 complete |
| v8.1 mouth animation display test | HOLD |
| v8.2 eye gaze animation display test | HOLD |
| v8.3 voice I/O concept plan (docs-only) | HOLD |
| v8.4 voice I/O execution | HOLD (G-15, audio safety review) |
| v8.5 v9 readiness package | HOLD |

**productionReady at end of v8**: false (unchanged)
**Conditions to enter v9**: animation display works; voice concept reviewed; human GO for v9

---

## v9: Controlled Pilot Readiness

**Goal**: Integrate all validated components into controlled pilot configuration; review safety across all subsystems.

| Task | Status |
|---|---|
| v9.0 v9 Goal Pack | HOLD — after v8 complete |
| v9.1 integrated subsystem review | HOLD |
| v9.2 RunPod integration (if needed) | HOLD (G-13) |
| v9.3 pilot safety review | HOLD |
| v9.4 pre-production checklist | HOLD |
| v9.5 v10 readiness package | HOLD |

**productionReady at end of v9**: false (unchanged)
**Conditions to enter v10**: all subsystems validated; safety review passed; human GO for v10

---

## v10: Production Readiness Review

**Goal**: Final review of all systems; confirm all safety invariants; confirm all HOLD gates resolved; issue productionReady = true only with final separate human approval.

| Task | Status |
|---|---|
| v10.0 Full system review | HOLD |
| v10.1 Final safety audit | HOLD |
| v10.2 productionReady assessment | HOLD |
| v10.3 Final human approval | HOLD (G-18 + G-19) |

**productionReady = true condition**: G-18 (final separate human approval only)
**No agent, automated process, or docs update can set productionReady = true.**

---

## What Remains HOLD at Every Stage Until v10

```text
productionReady: false — until final separate human approval at v10
execution: disabled — until G-19 issued
robotMotion: HOLD — until hardware safety review at v7+
git push: not blanket-approved — per-push explicit approval
rawValuesReported: false — maintained throughout
```

---

## Precondition Inheritance

Each vN requires vN-1 complete and human GO to proceed:

```
v3 → v3 readiness package → human GO → v4
v4 → v4 readiness package → human GO → v5
...
v9 → v9 readiness package → human GO → v10
v10 → final approval → PRODUCTION
```

No skipping stages. No automatic progression.

この範囲では問題を検出していません。

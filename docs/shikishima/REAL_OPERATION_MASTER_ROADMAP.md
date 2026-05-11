# Shikishima Real Operation Master Roadmap — v2.2.0

## Purpose

Defines the complete staged path from current HOLD state to production readiness.
This document is the authoritative master roadmap for v3 through v10.

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**This document is planning-only.**
**productionReady remains false at every stage until G-18 (final separate human approval).**
**No stage is GO, execution approval, or production clearance.**

---

## Master Stage Table

| Stage | Name | Current | productionReady | execution | robotMotion |
|---|---|---|---|---|---|
| v3 | Execution Validation Readiness | IN PROGRESS | false | disabled | HOLD |
| v4 | Local Test / Static Validation | HOLD | false | disabled | HOLD |
| v5 | Controlled Local-only Dry-run | HOLD | false | disabled | HOLD |
| v6 | Wrapper / Hermes / WSL Limited Validation | HOLD | false | disabled | HOLD |
| v7 | Face Terminal / StackChan Display-only | HOLD | false | disabled | HOLD |
| v8 | Voice / Mouth / Eye Concept Validation | HOLD | false | disabled | HOLD |
| v9 | Controlled Pilot Readiness | HOLD | false | disabled | HOLD |
| v10 | Production Readiness Review | HOLD | **review** | **review** | **review** |
| PROD | Production | HOLD | true* | enabled* | approved* |

*Only with final separate human approval (G-18 + G-19). Cannot be auto-set.

---

## v3: Execution Validation Readiness

**Goal**: Prepare prerequisites for execution validation without executing anything.

| Item | Value |
|---|---|
| productionReady | false |
| execution | disabled |
| Key deliverables | tests committed; typecheck plan; local-only boundary |
| GO gates | G-01 (tests/ichikishima), G-02 (tests/hermes), G-03–G-08 |
| Coding work | docs-only + test commit (after GO) |
| HOLD items | all execution commands; validation results |
| Entry condition | v2.0 complete (DONE) |
| Exit condition | test suite committed; typecheck plan created; v4 readiness package ready; human GO for v4 |

---

## v4: Local Test / Static Validation

**Goal**: Run full test suite and static analysis locally; capture redacted results.

| Item | Value |
|---|---|
| productionReady | false |
| execution | disabled (validation commands only, per GO) |
| Key deliverables | typecheck PASS; eslint PASS; vitest PASS; redacted result review |
| GO gates | G-03, G-04, G-05, G-06, G-07 (each separate) |
| Coding work | error fixes from validation; test adjustments |
| HOLD items | build output; raw results; external services |
| Entry condition | v3 exit conditions met; human GO for v4 |
| Exit condition | all static validation PASS; no blockers; v5 readiness package; human GO for v5 |

---

## v5: Controlled Local-only Dry-run

**Goal**: Run Electron app in local dev mode; verify basic screen navigation; confirm all values local-only.

| Item | Value |
|---|---|
| productionReady | false |
| execution | disabled (local dev run only, per GO) |
| Key deliverables | app launches; navigation works; IPC verified; Research screen verified |
| GO gates | separate GO for local dev run |
| Coding work | UI fixes; IPC adjustments |
| HOLD items | any external connection; Hermes; WSL; RunPod |
| Entry condition | v4 exit conditions met; human GO for v5 |
| Exit condition | app stable locally; no crashes; all values local-only confirmed; v6 readiness package; human GO for v6 |

---

## v6: Wrapper / Hermes / WSL Limited Validation

**Goal**: Validate Hermes connectivity through WSL; wrapper/dummy execution; all local-only.

| Item | Value |
|---|---|
| productionReady | false |
| execution | disabled (WSL/Hermes only, per GO) |
| Key deliverables | dummy execution confirmed; WSL available; Hermes responds; IPC bridge verified |
| GO gates | G-09, G-10, G-11, G-12 (each separate) |
| Coding work | IPC bridge adjustments; Hermes adapter fixes |
| HOLD items | RunPod; external network; StackChan |
| Entry condition | v5 exit conditions met; human GO for v6 |
| Exit condition | Hermes confirmed local; IPC bridge stable; v7 readiness package; human GO for v7 |

---

## v7: Face Terminal / StackChan Display-only Integration Planning

**Goal**: Display face terminal; connect StackChan for display-only; no motion control.

| Item | Value |
|---|---|
| productionReady | false |
| execution | disabled |
| robotMotion | HOLD (display-only ≠ motion approved) |
| Key deliverables | face display confirmed; StackChan connected display-only; expression set reviewed |
| GO gates | G-14 (StackChan, hardware safety review required) |
| Coding work | face terminal UI; expression display; Android face plan |
| HOLD items | robot motion; StackChan control commands; voice I/O |
| Entry condition | v6 exit conditions met; human GO for v7 |
| Exit condition | face display stable; hardware safe; v8 readiness package; human GO for v8 |

---

## v8: Voice / Mouth / Eye Concept Validation

**Goal**: Validate animation concepts in display; no audio I/O unless separate GO.

| Item | Value |
|---|---|
| productionReady | false |
| execution | disabled |
| Key deliverables | mouth animation display; eye gaze display; voice concept plan |
| GO gates | G-15 (voice I/O), G-16 (camera/microphone) — each separate |
| Coding work | animation engine; expression timing; concept docs |
| HOLD items | audio I/O; microphone; camera; TTS/STT |
| Entry condition | v7 exit conditions met; human GO for v8 |
| Exit condition | animations stable; voice concept reviewed; v9 readiness package; human GO for v9 |

---

## v9: Controlled Pilot Readiness

**Goal**: Integrate all validated components; define single-run controlled pilot; safety review.

| Item | Value |
|---|---|
| productionReady | false |
| execution | disabled |
| Key deliverables | integrated system review; pilot runbook; safety audit |
| GO gates | separate scoped GO per pilot component |
| Coding work | integration fixes; safety labels; pilot runbook |
| HOLD items | autonomous operation; multi-run execution; unsupervised operation |
| Entry condition | v8 exit conditions met; human GO for v9 |
| Exit condition | pilot runbook complete; safety audit PASS; v10 readiness package; human GO for v10 |

---

## v10: Production Readiness Review

**Goal**: Final review; confirm all safety invariants; productionReady = true requires G-18.

| Item | Value |
|---|---|
| productionReady | **under review** → true only with G-18 |
| execution | **under review** → enabled only with G-19 |
| Key deliverables | final audit; pre-production checklist; G-18 + G-19 issuance |
| GO gates | G-18 (productionReady), G-19 (execution) — final, non-delegable |
| Coding work | final hardening; security audit; remaining docs |
| HOLD items | everything until G-18/G-19 issued |
| Entry condition | v9 exit conditions met; human GO for v10 |
| Exit condition | G-18 + G-19 issued by human; full system confirmed |

---

## Final productionReady = true Conditions

All of the following must be true simultaneously:

| # | Condition |
|---|---|
| 1 | All v3–v9 stages complete and reviewed |
| 2 | All HOLD gates G-01 through G-16 satisfied |
| 3 | Final safety audit PASS (v10) |
| 4 | Security review PASS |
| 5 | No raw values exposed in any output |
| 6 | No local paths in committed code |
| 7 | All device integrations hardware-reviewed |
| 8 | Rollback plan confirmed |
| 9 | Human in-loop operation confirmed |
| 10 | G-18: Explicit final human approval issued |
| 11 | G-19: Explicit execution = enabled approval issued |

**No agent can satisfy conditions 10 or 11.**
**No documentation update can satisfy conditions 10 or 11.**

この範囲では問題を検出していません。

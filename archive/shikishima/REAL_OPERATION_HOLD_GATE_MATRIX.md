# Shikishima Real Operation HOLD Gate Matrix — v2.2.0

## Purpose

Comprehensive HOLD gate matrix for all v3 through v10 stages.
Each gate is independent. No gate unlocks another automatically.
No agent can issue GO. Human only.

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

Note: v3.x gates G-01 through G-19 are defined in detail in `V3_HOLD_GATE_MATRIX.md`.
This document extends the matrix to cover v4–v10 stage-level gates.

---

## Gate Summary Table

| Gate | Stage | Action | Current State |
|---|---|---|---|
| G-01 | v3 | tests/ichikishima commit | HOLD |
| G-02 | v3 | tests/hermes commit | HOLD |
| G-03 | v3–v4 | typecheck:node | HOLD |
| G-04 | v3–v4 | typecheck:web | HOLD |
| G-05 | v3–v4 | eslint | HOLD |
| G-06 | v4 | vitest full run | HOLD |
| G-07 | v4 | build | HOLD |
| G-08 | v3 | local-only value check | HOLD |
| G-09 | v6 | dummy process execution | HOLD |
| G-10 | v6 | wrapper execution | HOLD |
| G-11 | v6 | WSL execution | HOLD |
| G-12 | v6 | Hermes execution | HOLD |
| G-13 | v6–v9 | RunPod execution | HOLD |
| G-14 | v7 | StackChan connection (display-only) | HOLD |
| G-15 | v8 | voice I/O | HOLD |
| G-16 | v8 | camera / microphone | HOLD |
| G-17 | any | git push | HOLD |
| G-18 | v10 | productionReady = true | HOLD |
| G-19 | v10 | execution = enabled | HOLD |
| G-20 | v5 | local dev run | HOLD |
| G-21 | v6 | RunPod integration (if v6) | HOLD |
| G-22 | v7 | StackChan control (motion) | HOLD — robotMotion |
| G-23 | v9 | controlled pilot execution | HOLD |
| G-24 | v10 | production deployment | HOLD |

---

## Stage-Level Gates

### G-20: Local Dev Run (v5)

- **GO condition**: v4 complete; typecheck/vitest PASS; human confirms no external connections active
- **STOP condition**: any external network connection attempted; crash without recovery
- **Rollback**: terminate dev process; reset state; document issue

---

### G-21: RunPod Integration (v6+)

- **GO condition**: Hermes local validated (G-12); RunPod service confirmed available; explicit scoped GO
- **STOP condition**: unexpected external API call; secret exposed; cost threshold exceeded
- **Rollback**: disconnect from RunPod; revert to local-only mode

---

### G-22: StackChan Motion / Control

- **GO condition**: v7 display-only phase complete; hardware safety review for motion; explicit scoped GO
- **Note**: This gate is separate from G-14 (display-only). Display-only does NOT unlock motion.
- **STOP condition**: any unintended motion; hardware error; human stop signal
- **Rollback**: cut power to StackChan; switch to display-only mode

---

### G-23: Controlled Pilot Execution (v9)

- **GO condition**: All v9 preconditions met; pilot runbook complete; human monitor present; scoped GO per pilot run
- **STOP condition**: immediate stop on any anomaly (see CONTROLLED_PILOT_DEFINITION.md)
- **Rollback**: terminate all pilot processes; redact output; document incident

---

### G-24: Production Deployment (v10)

- **GO condition**: G-18 + G-19 issued; full safety audit PASS; deployment runbook reviewed
- **STOP condition**: any late-stage safety finding; G-18 or G-19 not issued
- **Rollback**: revert deployment; restore previous known-good state

---

## Gate STOP Conditions (Global)

Any gate must be immediately stopped if:

| Condition | Action |
|---|---|
| Raw value appears in output | STOP; redact; report to human |
| Local path in output | STOP; redact; report |
| Secret or token detected | STOP; revoke if applicable; report |
| External network not expected | STOP; disconnect; report |
| Device receives unexpected command | STOP; hardware safe state; report |
| Human requests stop | STOP immediately |
| Agent cannot confirm safety | STOP; report as HOLD |

---

## Gate Rollback Conditions

Any gate can be rolled back to HOLD state if:

| Condition | Rollback |
|---|---|
| Newly discovered safety risk | Revert gate to HOLD; human reviews |
| New raw value exposure | Revert to HOLD; redact; audit |
| Hardware malfunction | Revert to pre-connection state |
| Failed validation | Revert to docs-only; fix; re-review |
| Human requests HOLD | Immediate revert; no argument |

---

## GO Archive

| Date | Gate | GO Statement | Issued By | Scope |
|---|---|---|---|---|
| — | — | (none issued) | — | — |

この範囲では問題を検出していません。

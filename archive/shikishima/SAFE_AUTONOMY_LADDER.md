# Shikishima Safe Autonomy Ladder — v2.2.0

## Purpose

Defines discrete autonomy levels from Level 0 (docs-only) to Level 9 (production readiness).
Each level has explicit GO conditions and forbidden actions.
Levels do not auto-advance. Each requires independent human GO.

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**Current Level: 0 (docs-only)**

---

## Level Summary

| Level | Name | Stage | Current |
|---|---|---|---|
| 0 | Docs-only | v3 (done) | **HERE** |
| 1 | Static UI (committed) | v3–v4 | HOLD |
| 2 | Local tests (committed + run) | v4 | HOLD |
| 3 | Redacted validation | v4 | HOLD |
| 4 | Local-only dry-run | v5 | HOLD |
| 5 | Wrapper / dummy limited execution | v6 | HOLD |
| 6 | WSL / Hermes limited execution | v6 | HOLD |
| 7 | Display-only device integration | v7 | HOLD |
| 8 | Controlled pilot | v9 | HOLD |
| 9 | Production readiness | v10 | HOLD |

---

## Level 0: Docs-only

**Current level.**

- **What is allowed**: All docs creation, all planning, all static review, all roadmap updates
- **What is forbidden**: Any command execution, any external connection, any device interaction
- **GO required**: None for docs — always allowed
- **productionReady**: false
- **execution**: disabled

---

## Level 1: Static UI (committed code + UI visible)

- **What is allowed**: Source code changes; UI commits; static display features; i18n; layout
- **What is forbidden**: Running the app; connecting to services; executing build
- **GO required**: None for code changes; G-03/G-04/G-05 for validation; G-07 for build
- **productionReady**: false
- **Advance to Level 2**: After tests committed (G-01 + G-02) and typecheck PASS

---

## Level 2: Local Tests (committed + run)

- **What is allowed**: vitest execution (per G-06); test review; fix test failures
- **What is forbidden**: External service calls from tests; raw value output in test results
- **GO required**: G-01, G-02 (tests committed); G-06 (vitest run)
- **productionReady**: false
- **Advance to Level 3**: After vitest PASS and results reviewed (redacted)

---

## Level 3: Redacted Validation

- **What is allowed**: Review validation output (redacted); classify errors; fix issues
- **What is forbidden**: Raw path output; secret output; local env disclosure
- **GO required**: G-08 (local-only value check)
- **productionReady**: false
- **Advance to Level 4**: After full validation PASS; local-only policy confirmed; G-20 issued

---

## Level 4: Local-only Dry-run

- **What is allowed**: Running Electron app locally; testing screens; IPC verification; local-only
- **What is forbidden**: External connections; Hermes real calls; WSL; RunPod; device control
- **GO required**: G-20 (local dev run); new GO per run session
- **productionReady**: false
- **Advance to Level 5**: After app stable locally; all values confirmed local-only; G-09/G-10 issued

---

## Level 5: Wrapper / Dummy Limited Execution

- **What is allowed**: Dummy process; wrapper execution; local-only; no external network
- **What is forbidden**: Real Hermes binary; external network; RunPod; device connection
- **GO required**: G-09 (dummy), G-10 (wrapper) — each separate
- **productionReady**: false
- **Advance to Level 6**: After dummy/wrapper confirmed safe; G-11/G-12 issued

---

## Level 6: WSL / Hermes Limited Execution

- **What is allowed**: WSL command (scoped); Hermes local (no RunPod); IPC bridge test
- **What is forbidden**: External network; RunPod; StackChan; voice I/O; raw output
- **GO required**: G-11 (WSL), G-12 (Hermes) — each separate
- **productionReady**: false
- **Advance to Level 7**: After Hermes confirmed stable locally; G-14 issued for display-only

---

## Level 7: Display-only Device Integration

- **What is allowed**: Face terminal display; StackChan display-only (G-14); expression display
- **What is forbidden**: Robot motion; StackChan control commands; voice I/O; camera; autonomous actions
- **GO required**: G-14 (StackChan display, hardware safety review); separate GO for each device
- **productionReady**: false
- **robotMotion**: HOLD — display-only does NOT unlock motion
- **Advance to Level 8**: After display confirmed safe; all device hardware reviewed; pilot runbook complete; G-23 issued

---

## Level 8: Controlled Pilot

- **What is allowed**: Single scoped controlled pilot per G-23; human supervised; local-only + approved scope
- **What is forbidden**: Autonomous repeat; unsupervised operation; raw output; exceeding pilot scope
- **GO required**: G-23 — per pilot run; G-15/G-16 if voice/camera in scope
- **productionReady**: false
- **Advance to Level 9**: After successful pilot; safety audit PASS; G-18/G-19 process begins

---

## Level 9: Production Readiness

- **What is allowed**: Final system review; full safety audit; deployment preparation
- **What is forbidden**: Any unauthorized production use; self-approval of productionReady
- **GO required**: G-18 (productionReady = true); G-19 (execution = enabled) — final human approval only
- **productionReady**: false → true ONLY with G-18
- **This level is the gate, not the destination.**

---

## Level Downgrade Conditions

Any level can be downgraded to a lower level if:

| Condition | Downgrade |
|---|---|
| Safety risk discovered | Downgrade to highest safe level |
| Raw value exposure | Downgrade to Level 0 (docs); audit |
| Hardware malfunction | Downgrade to Level 6 (no device) |
| Human requests HOLD | Immediate downgrade; no argument |
| New HOLD gate unsatisfied | Downgrade until gate resolved |

Downgrade is always safe and always allowed. Upgrade requires GO.

この範囲では問題を検出していません。

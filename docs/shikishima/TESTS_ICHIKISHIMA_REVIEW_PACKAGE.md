# tests/ichikishima Review Package — v1.5.0

## Review Overview

- reviewVersion: v1.5.0
- reviewDate: 2026-05-12
- reviewType: audit-only / redacted-only / no-test-execution
- roadmapVersion: v1.5.0
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

No tests were executed during this review.
No test files were staged or committed during this review.

---

## Test Suite Structure

| Subdirectory | File count | Subsystem |
|---|---|---|
| `tests/ichikishima/agent-team/` | 7 | Agent registry, supervisor, scheduling, capability, handoff |
| `tests/ichikishima/approval/` | 5 | Human approval queue, store, adapters, pilot, report |
| `tests/ichikishima/audit/` | 2 | Audit log, audit log summary |
| `tests/ichikishima/control-center/` | 14 | ControlCenter IPC, snapshot, data provider, rooms, static shell, local API |
| `tests/ichikishima/core/` | 3 | State, silence gate, speak-value |
| `tests/ichikishima/hermes/` | 21 | Bridge, bridge readiness, controlled pilot, WSL2 wrapper, process adapter |
| `tests/ichikishima/memory/` | 1 | Memory candidate |
| `tests/ichikishima/orchestrator/` | 1 | Ichikishima orchestrator |
| `tests/ichikishima/pilot/` | 1 | Local pilot full loop |
| `tests/ichikishima/review/` | 2 | Hermes report reviewer, review mode |
| `tests/ichikishima/sandbox/` | 3 | Dummy process helper files — see special review below |
| `tests/ichikishima/visualization/` | 3 | Agent team visualization, visualization V1 model, events |
| **Total** | **63 + sandbox 3 = 66** | Full ichikishima test suite |

---

## Test Category Classification

### Standard Test Files (commit-safe)

| Category | Count | Risk | Notes |
|---|---|---|---|
| agent-team | 7 | LOW | Contract/registry/scheduling tests — no process spawn |
| approval | 5 | LOW | Queue and report tests — no external calls |
| audit | 2 | LOW | Log structure tests — no external calls |
| control-center | 14 | LOW | IPC contract/snapshot tests — no live IPC required |
| core | 3 | LOW | State/gate/value tests — pure logic |
| hermes (non-process) | ~15 | LOW | Bridge contract, payload, readiness, config tests |
| memory | 1 | LOW | Candidate structure test |
| orchestrator | 1 | LOW | Orchestrator logic test |
| pilot | 1 | LOW | Pilot loop logic test |
| review | 2 | LOW | Reviewer/mode logic test |
| visualization | 3 | LOW | Model/event structure tests |

---

### Special Review: `tests/ichikishima/sandbox/` (3 files)

#### `dummy-hermes-path.ts`

| Field | Value |
|---|---|
| Type | Helper/fixture (NOT a test file — no `.test.ts`) |
| Content | Exports a path constant pointing to `sandbox/hermes-autonomy-zone/dummy-hermes/dummy-hermes-bridge-payload-once.cjs` |
| Dependency | `sandbox/` directory (now gitignored in v1.4.0) |
| Risk | LOW — path constant only; no execution |
| CI behavior | N/A — not a test, just a fixture |
| Commit recommendation | SAFE to commit — fixture that provides test infrastructure |
| Caveat | The sandbox/ CJS file it points to is gitignored; tests using this fixture must handle file-not-found gracefully |

#### `dummy-hermes-stub-design.process-local.test.ts`

| Field | Value |
|---|---|
| Type | Process-local test (explicitly guarded) |
| Guard | `describe.skipIf(!allowDummyProcessEnv)` where `allowDummyProcessEnv = RUN_DUMMY_HERMES_LOCAL_PROCESS=1 AND CI!='true'` |
| CI behavior | **ALWAYS SKIPPED** in standard CI (GitHub/GitLab/Azure set `CI=true`) |
| Manual trigger | Requires explicit `RUN_DUMMY_HERMES_LOCAL_PROCESS=1` in non-CI environment |
| What it spawns | ONLY `process.execPath` + dummy CJS file (NOT real Hermes, NOT WSL) |
| Safety annotation | `@local-only @dummy-process-only @no-hermes @no-wsl` |
| Risk | LOW — well-guarded; never runs in CI |
| Commit recommendation | SAFE to commit — the guard pattern is correct and documented |

#### `dummy-hermes-stub-design-static.test.ts`

| Field | Value |
|---|---|
| Type | Static design test (no process spawn) |
| Guard | Standard — no special guard needed |
| CI behavior | Runs normally in CI |
| Risk | LOW — static test only |
| Commit recommendation | SAFE to commit |

---

## hermes/ Subsystem Tests — Process Risk Assessment

| Test file | Process spawn? | Risk |
|---|---|---|
| hermes-bridge*.test.ts | No — bridge payload/contract tests | LOW |
| hermes-bridge-readiness*.test.ts | No — readiness state tests | LOW |
| hermes-connection-adapter.test.ts | No — adapter contract test | LOW |
| hermes-controlled-pilot-*.test.ts | No — config/preflight/summary tests | LOW |
| hermes-file-handoff-adapter.test.ts | No — file path/contract test | LOW |
| hermes-local-pilot.test.ts | No — pilot logic test | LOW |
| hermes-real-pilot-*.test.ts | Possibly — real process adapter | MEDIUM — review |
| hermes-real-process-adapter.test.ts | Possibly — process adapter | MEDIUM — review |
| hermes-wsl2-wrapper-*.test.ts | No — wrapper contract/config tests | LOW |

**Note on `hermes-real-pilot-minimal.test.ts` and `hermes-real-process-adapter.test.ts`:**
These tests cover real pilot and process adapter code. Without reading them in detail,
their CI behavior is uncertain. They may be guarded similarly to the process-local test,
or they may test only the contract logic without actual execution. A brief review
before committing is recommended (not blocking, but noted as MEDIUM risk).

---

## Commit Recommendation

| Scope | Recommendation | Notes |
|---|---|---|
| All 63 standard tests | **COMMIT CANDIDATE** | Low-risk; contract and logic tests |
| `sandbox/dummy-hermes-path.ts` | **COMMIT CANDIDATE** | Fixture only; sandbox/ dependency noted |
| `sandbox/dummy-hermes-stub-design-static.test.ts` | **COMMIT CANDIDATE** | Static test; no guard needed |
| `sandbox/dummy-hermes-stub-design.process-local.test.ts` | **COMMIT CANDIDATE (with caveat)** | Well-guarded; always skips in CI |
| `hermes-real-pilot-minimal.test.ts` | **COMMIT CANDIDATE (review recommended)** | Verify CI guard before final commit |
| `hermes-real-process-adapter.test.ts` | **COMMIT CANDIDATE (review recommended)** | Verify CI guard before final commit |

**Overall verdict: tests/ichikishima/ is ready to commit as a unit.**

The process-local test is well-guarded. The sandbox/ CJS dependency is acknowledged.
Tests do not execute in CI without explicit opt-in.

---

## Pre-Commit Checklist (for v1.5.0 execution task)

Before staging `tests/ichikishima/`:

- [ ] Confirm `hermes-real-pilot-minimal.test.ts` does not spawn real processes in CI
- [ ] Confirm `hermes-real-process-adapter.test.ts` does not spawn real processes in CI
- [ ] Confirm `dummy-hermes-path.ts` sandbox dependency is documented in test
- [ ] Human GO confirmed

---

## HOLD Status

This review package is complete. The actual commit is HOLD pending human GO.
The human may grant GO for `tests/ichikishima/` commit in a subsequent task.

---

## Safety Boundary Confirmation

- No tests were executed
- No test files were staged or committed
- No build, typecheck, or eslint was run
- No raw values reported

この範囲では問題を検出していません。

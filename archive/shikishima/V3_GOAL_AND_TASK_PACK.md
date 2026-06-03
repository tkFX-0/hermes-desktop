# Shikishima v3.x Goal and Task Pack — v2.1.0

## Package Overview

- packageVersion: v2.1.0
- packageDate: 2026-05-12
- roadmapVersion: v2.1.0
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**v3.x is NOT productionReady.**
**v3.x is NOT a GO approval.**
**v3.x is NOT execution approval for any agent, robot, voice, or test runner.**
**v3.x is the execution validation readiness stage.**

---

## v3.x Goal Statement

> しきしまの実行検証に進むための前提を整え、段階的検証の土台を作る。
> ただし、v3.x開始時点では execution disabled / productionReady false /
> robotMotion HOLD を維持する。
> v3.x は「実行検証の準備と限定的検証の段階」であり、本稼働ではない。

---

## What v3.x Does

| Category | Action |
|---|---|
| Test suite review | Final review of tests/ichikishima/ + tests/hermes/ — docs-only |
| Test suite commit | Commit tests if human GO granted — HOLD gate |
| Static validation plan | Document typecheck/build/lint/vitest commands and expected output |
| First validation execution | Run static validation if human GO granted — HOLD gate |
| Redacted result review | Review validation output with raw values redacted |
| Local-only value boundary | Define what counts as local-only; establish redaction policy |
| Dummy/wrapper plan | Document execution plan for dummy/wrapper — docs-only, no execution |
| WSL/Hermes plan | Document execution plan — docs-only, no execution |
| v4 readiness package | Create preconditions for v4 local validation |

---

## What v3.x Does NOT Do

| Forbidden Action | Reason |
|---|---|
| Execute any test runner | HOLD — requires human GO |
| Run build / typecheck / eslint | HOLD — requires human GO |
| Execute WSL / Hermes / wrapper | HOLD — explicit human GO + safety review required |
| Connect StackChan / robot | HOLD — hardware action, separate GO |
| Enable voice I/O / camera / microphone | HOLD — separate GO |
| Set productionReady = true | HOLD — requires final separate approval |
| Set execution = enabled | HOLD — requires scoped GO |
| Push to remote | HOLD — not approved |
| Output raw values / local paths / secrets | HOLD — policy |

---

## v3.x Task List

### v3.0 — V3 Goal & Execution Validation Task Pack

- **Purpose**: Define v3.x goal, task sequence, HOLD gates, real operation path
- **Target**: docs/shikishima/ docs only
- **Output**: V3_GOAL_AND_TASK_PACK.md, V3_EXECUTION_VALIDATION_ROADMAP.md, V3_HOLD_GATE_MATRIX.md, V3_IMPLEMENTATION_SEQUENCE.md, REAL_OPERATION_PATH_TO_PRODUCTION.md, V3_TEST_COMMIT_DECISION_MATRIX.md, V3_HUMAN_GO_CHECKLIST.md
- **Forbidden**: src change, npm install, build/test/typecheck, git push, any execution
- **HOLD condition**: none — docs creation allowed
- **Completion condition**: All 7 docs created; roadmapVersion → v2.1.0; commit created

### v3.1 — tests/ichikishima + tests/hermes Final Review Package

- **Purpose**: Final pre-commit review of all test files; confirm CI guard; confirm no raw values
- **Target**: tests/ichikishima/ (66 files), tests/hermes/ (12 files) — read-only review
- **Output**: Updated review packages; decision matrix updated; human review summary
- **Forbidden**: stage/commit any test file; execute any test; run vitest
- **HOLD condition**: commit requires separate human GO (see V3_HUMAN_GO_CHECKLIST.md #1)
- **Completion condition**: Review complete; decision matrix finalized; GO/HOLD for each file group documented

### [HOLD] tests commit GO — human GO required before v3.2

Before v3.2 executes, human must explicitly approve:
- tests/ichikishima/ commit scope
- tests/hermes/ commit scope
- Confirm dummy/process-local CI guard verified
- Confirm no raw values in test fixtures

### v3.2 — Test Suite Commit Execution

- **Purpose**: Commit tests/ichikishima/ + tests/hermes/ to tracked state
- **Target**: tests/ichikishima/ (66 files), tests/hermes/ (12 files)
- **Forbidden**: execute any test; run vitest; npm install; git push
- **HOLD condition**: Human GO required (separate per file group)
- **Completion condition**: Both groups committed; working tree clean

### v3.3 — Static Validation Command Plan

- **Purpose**: Document exact commands for typecheck/build/eslint/vitest; expected output format; redaction policy for results
- **Target**: docs/shikishima/ docs only
- **Output**: V3_STATIC_VALIDATION_PLAN.md (created in v3.3)
- **Forbidden**: execute any command; npm install; build/test/typecheck/eslint/vitest
- **HOLD condition**: execution requires separate human GO (see V3_HUMAN_GO_CHECKLIST.md #2)
- **Completion condition**: All commands documented; redaction policy defined; HOLD gate confirmed

### [HOLD] build/test/typecheck/vitest GO — human GO required before v3.4

Before v3.4 executes, human must explicitly approve:
- Which command(s) to run
- Environment (local dev only)
- Redaction policy for output
- What to do if errors found

### v3.4 — First Validation Execution

- **Purpose**: Run approved static validation commands; collect redacted output
- **Target**: typecheck:node + typecheck:web (or eslint, per GO scope)
- **Forbidden**: run tests (vitest) without separate GO; npm install; git push; output raw values
- **HOLD condition**: Each command requires its own GO line item
- **Completion condition**: All approved commands run; results documented (redacted); errors triaged

### v3.5 — Redacted Validation Result Review

- **Purpose**: Review v3.4 output; classify errors as blockers/warnings/expected; produce redacted summary
- **Target**: v3.4 output only — docs review
- **Forbidden**: expose raw file paths; raw local values; secrets
- **HOLD condition**: next action depends on v3.4 results
- **Completion condition**: Errors classified; remediation plan created if needed

### v3.6 — Local-Only Value Boundary Review

- **Purpose**: Define precisely what "local-only value" means in test/validation context; establish policy for sandbox, dummy paths, local server ports
- **Target**: docs review of tests/ichikishima/sandbox/, tests/hermes/, src/main/
- **Output**: V3_LOCAL_VALUE_BOUNDARY_POLICY.md (created in v3.6)
- **Forbidden**: expose actual local paths; raw values; secrets
- **HOLD condition**: validation that touches local paths requires scoped GO
- **Completion condition**: Policy written; boundary defined; HOLD gate for local-value exposure confirmed

### [HOLD] local-only value check GO — human GO required before any local-value validation

### v3.7 — Dummy/Wrapper Execution Plan (docs-only)

- **Purpose**: Document dummy process and wrapper execution plan; no execution
- **Target**: tests/ichikishima/sandbox/ docs review; src/main/ichikishima/ review
- **Output**: V3_DUMMY_WRAPPER_EXECUTION_PLAN.md (created in v3.7)
- **Forbidden**: execute dummy/wrapper; run process; WSL; external network
- **HOLD condition**: execution requires explicit scoped GO
- **Completion condition**: Plan written; risks identified; GO conditions documented

### [HOLD] dummy/wrapper execution GO — human GO required before execution

### v3.8 — WSL/Hermes Execution Plan (docs-only)

- **Purpose**: Document WSL and Hermes execution plan; confirm environment requirements; no execution
- **Target**: src/main/hermes.ts review; src/main/installer.ts review; docs review
- **Output**: V3_WSL_HERMES_EXECUTION_PLAN.md (created in v3.8)
- **Forbidden**: execute WSL; run Hermes; external network; install
- **HOLD condition**: execution requires explicit scoped GO + environment verification
- **Completion condition**: Plan written; environment checklist created; GO conditions documented

### [HOLD] WSL/Hermes execution GO — human GO required before execution

### v3.9 — v4 Readiness Package

- **Purpose**: Assess v3.x completion; define v4 preconditions; create v4 goal pack
- **Target**: docs/shikishima/ docs only
- **Output**: V4_READINESS_PACKAGE.md
- **Forbidden**: src change; execution; npm; build/test; git push
- **HOLD condition**: v4 requires all v3.x minimum preconditions met
- **Completion condition**: v4 preconditions documented; HOLD items classified; roadmapVersion bumped

---

## v3.x Minimum Preconditions (from V3_EXECUTION_VALIDATION_PRECONDITIONS.md)

1. tests/ichikishima/ committed (H-1) — HOLD
2. tests/hermes/ committed (H-1) — HOLD
3. Typecheck passes — HOLD
4. Separate scoped GO for v3.x work — HOLD

---

## v3.x Safety Invariants (unchanged from v2.0)

```text
decision:        HOLD
execution:       disabled
productionReady: false
rawValuesReported: false
robotMotion:     HOLD
git push:        not approved
WSL/Hermes/RunPod/StackChan/voice: HOLD
```

この範囲では問題を検出していません。

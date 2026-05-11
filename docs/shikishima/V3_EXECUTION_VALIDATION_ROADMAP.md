# Shikishima v3.x Execution Validation Roadmap — v2.1.0

## Purpose

Defines the staged path from current HOLD state to execution validation.
Each stage has explicit GO conditions and STOP conditions.
No stage begins without a separate human GO.
This document is planning-only. It does not enable execution.

- documentVersion: v2.1.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Stage Overview

| Stage | Name | Current State | GO Gate |
|---|---|---|---|
| S-0 | Test suite review | HOLD (v3.1) | Review complete — no GO needed |
| S-1 | Test suite commit | HOLD | G-01 + G-02 |
| S-2 | Static validation plan | HOLD (v3.3) | Plan complete — no GO needed |
| S-3 | typecheck execution | HOLD | G-03 + G-04 |
| S-4 | eslint execution | HOLD | G-05 |
| S-5 | vitest execution | HOLD | G-06 |
| S-6 | build execution | HOLD | G-07 |
| S-7 | Redacted result review | HOLD | After S-3/S-4 |
| S-8 | Local-only value boundary | HOLD | G-08 |
| S-9 | Dummy/wrapper plan | HOLD (v3.7) | Plan complete — no GO needed |
| S-10 | Dummy/wrapper execution | HOLD | G-09 + G-10 |
| S-11 | WSL/Hermes plan | HOLD (v3.8) | Plan complete — no GO needed |
| S-12 | WSL/Hermes execution | HOLD | G-11 + G-12 |

---

## Stage Details

### S-0: Test Suite Review

**What happens**: Read tests/ichikishima/ and tests/hermes/; verify CI guards; verify no raw values; update decision matrix.

**GO condition**: None for review itself — reading is always allowed.

**STOP condition (before next stage)**:
- Raw value or secret found in fixture → immediate STOP, report to human
- CI guard on process-local test not confirmed → STOP, investigate

**Output**: Updated V3_TEST_COMMIT_DECISION_MATRIX.md

---

### S-1: Test Suite Commit

**What happens**: Stage and commit tests/ichikishima/ and/or tests/hermes/ after human GO.

**GO condition**: G-01 and/or G-02 issued by human.

**STOP condition**:
- Human GO not issued
- Raw value found during final pre-stage check
- CI guard not confirmed

**Output**: Committed test suite; working tree clean.

---

### S-2: Static Validation Plan

**What happens**: Document exact commands, flags, expected output format, redaction policy for each command.

**GO condition**: None for planning — docs creation always allowed.

**Output**: V3_STATIC_VALIDATION_PLAN.md (created in v3.3)

---

### S-3: typecheck:node Execution

**Command** (do not execute until GO): `npm run typecheck:node`

**What it does**: TypeScript type check for main process code.

**GO condition**: G-03 (tests committed; human GO issued).

**STOP condition**:
- Human GO not issued
- Tests not yet committed
- Output contains raw file paths that must be redacted before reporting

**Output (redacted)**: Error count, error categories, no raw paths.

---

### S-4: typecheck:web Execution

**Command** (do not execute until GO): `npm run typecheck:web`

**What it does**: TypeScript type check for renderer process code.

**GO condition**: G-04.

**Output (redacted)**: Same as S-3.

---

### S-5: eslint Execution

**Command** (do not execute until GO): `npm run eslint` or `npx eslint src/`

**GO condition**: G-05.

**Output (redacted)**: Error/warning counts, rule categories, no raw paths.

---

### S-6: vitest Execution

**Command** (do not execute until GO): `npm run test` or `npx vitest run`

**Critical**: process-local test must be skipped (`CI=true` or default skip guard).

**GO condition**: G-06 (all typecheck done; local-only policy decided).

**STOP condition**:
- process-local test not confirmed to skip
- dummy-hermes stub not confirmed safe
- Real Hermes process could be invoked

**Output (redacted)**: Pass/fail counts, no raw process output.

---

### S-7: Redacted Validation Result Review

**What happens**: Review S-3/S-4/S-5/S-6 output; classify each error/warning; produce remediation plan.

**GO condition**: None for review.

**Output**:
- Error classification table (blocker / warning / expected / false-positive)
- Remediation plan for blockers
- Redacted summary (no raw paths or values)

---

### S-8: Local-Only Value Boundary Review

**What happens**: Define exactly what values are "local-only" and must not appear in committed code, validation output, or reports. Covers: local server ports (8765), dummy hermes paths, WSL paths, RunPod endpoints.

**GO condition**: G-08 (policy doc reviewed; human approves).

**Output**: V3_LOCAL_VALUE_BOUNDARY_POLICY.md

---

### S-9: Dummy/Wrapper Execution Plan

**What happens**: Document how dummy process and wrapper would be invoked; list environment requirements; no execution.

**GO condition**: None for planning.

**Output**: V3_DUMMY_WRAPPER_EXECUTION_PLAN.md (created in v3.7)

---

### S-10: Dummy/Wrapper Execution

**What happens**: Run dummy process or wrapper in local dev environment.

**GO condition**: G-09 and/or G-10; environment verified local-only; no external network.

**STOP condition**:
- External network reachable during execution
- Real Hermes binary invoked
- Human GO not issued

---

### S-11: WSL/Hermes Execution Plan

**What happens**: Document WSL and Hermes execution requirements; environment checklist; no execution.

**GO condition**: None for planning.

**Output**: V3_WSL_HERMES_EXECUTION_PLAN.md (created in v3.8)

---

### S-12: WSL/Hermes Execution

**What happens**: Run Hermes via WSL in controlled local environment.

**GO condition**: G-11 + G-12; WSL confirmed available; Hermes install confirmed; explicit scoped GO.

**STOP condition**:
- WSL not available
- Hermes binary not confirmed
- External network involved
- RunPod endpoint invoked

---

## Redaction Policy

All validation output reported must:

1. Replace absolute file paths with `[redacted-path]`
2. Replace local server addresses with `[local-endpoint]`
3. Replace WSL mount paths with `[wsl-path]`
4. Replace API keys / tokens / secrets with `[secret]`
5. Replace RunPod endpoints with `[runpod-endpoint]`
6. Never include home directory paths (`C:\Users\...`, `/home/...`)
7. Report only: error counts, error categories, pass/fail status

---

## Stage Dependency Map

```
S-0 (review) → S-1 (commit, HOLD)
S-1 → S-2 (plan, no HOLD) → S-3 (typecheck:node, HOLD)
S-3 + S-4 → S-5 (eslint, HOLD) → S-6 (vitest, HOLD)
S-3/S-4/S-5/S-6 → S-7 (review, no HOLD)
S-7 → S-8 (local-only, HOLD)
S-8 → S-9 (plan, no HOLD) → S-10 (dummy, HOLD)
S-10 → S-11 (plan, no HOLD) → S-12 (WSL/Hermes, HOLD)
```

Stages with "no HOLD" still do NOT execute runtime code.
HOLD stages require independent human GO before execution.

この範囲では問題を検出していません。

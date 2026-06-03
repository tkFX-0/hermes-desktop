# Shikishima v3.x Test Commit Decision Matrix — v2.1.0

## Purpose

Records commit/HOLD/split/rewrite decisions for each test file group.
This matrix is planning-only. No test files are staged or committed here.
All commit actions require separate human GO (G-01 or G-02).

- documentVersion: v2.1.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**No test files are staged in this document.**
**No test files are committed in this document.**
**Commit requires explicit human GO via V3_HUMAN_GO_CHECKLIST.md.**

---

## tests/ichikishima/ — 66 Files

Source review package: `TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md`

### Group 1: Standard Subsystem Tests (commit-ready pending GO)

| Subdirectory | Files | Risk | Decision | GO Gate |
|---|---|---|---|---|
| agent-team/ | 7 | LOW | COMMIT with group | G-01 |
| approval/ | 5 | LOW | COMMIT with group | G-01 |
| audit/ | 2 | LOW | COMMIT with group | G-01 |
| control-center/ | 14 | LOW | COMMIT with group | G-01 |
| core/ | 3 | LOW | COMMIT with group | G-01 |
| memory/ | 1 | LOW | COMMIT with group | G-01 |
| orchestrator/ | 1 | LOW | COMMIT with group | G-01 |
| review/ | 2 | LOW | COMMIT with group | G-01 |
| visualization/ | 3 | LOW | COMMIT with group | G-01 |

**Group 1 verdict**: Commit-ready as a unit pending human GO (G-01).

---

### Group 2: Hermes-Adjacent Tests (review recommended before commit)

| File | Risk | Decision | GO Gate | Notes |
|---|---|---|---|---|
| hermes/ (21 files, excl. pilot) | LOW-MEDIUM | COMMIT with group | G-01 | Standard subsystem tests |
| hermes-real-pilot-minimal.test.ts | MEDIUM | REVIEW FIRST | G-01 + brief review | Real-process adjacent; confirm CI guard |
| hermes-real-process-adapter.test.ts | MEDIUM | REVIEW FIRST | G-01 + brief review | Real-process adjacent; confirm CI guard |

**Group 2 verdict**: Standard hermes/ tests: commit-ready. Pilot tests: brief review recommended before committing.

---

### Group 3: Sandbox Tests (special review required)

| File | Risk | Decision | GO Gate | Notes |
|---|---|---|---|---|
| sandbox/dummy-hermes-path.ts | LOW | COMMIT | G-01 | Path constant only — confirmed SAFE |
| sandbox/dummy-hermes-stub-design.process-local.test.ts | LOW-MEDIUM | COMMIT (CI-guarded) | G-01 + CI guard confirmed | Always skipped unless `RUN_DUMMY_HERMES_LOCAL_PROCESS=1` AND `CI!=true` |
| sandbox/ (other fixtures) | LOW | COMMIT with group | G-01 | Review for raw paths before staging |

**CI Guard Verification Required Before G-01**:
- `dummy-hermes-stub-design.process-local.test.ts` uses `describe.skipIf(!allowDummyProcessEnv)`
- `allowDummyProcessEnv = RUN_DUMMY_HERMES_LOCAL_PROCESS=1 AND CI!='true'`
- In CI (`CI=true`): always skipped
- Default local run: skipped (env var not set)
- Must be confirmed before commit

**Group 3 verdict**: Commit-ready, CI guard confirmed SAFE — pending human review and G-01.

---

### tests/ichikishima/ Overall Decision

| Decision | Value |
|---|---|
| Commit as single group | YES — pending G-01 |
| Split into sub-groups | Optional (pilot tests can be split if desired) |
| HOLD indefinitely | NO — review complete |
| Rewrite required | NO |
| Raw value check | Required pre-stage: no raw paths in fixtures |
| Stage action | NOT PERFORMED — awaiting G-01 |

---

## tests/hermes/ — 12 Files

Source review package: `TESTS_HERMES_REVIEW_PACKAGE.md`

### All 12 Zone Tests

| Category | Files (est.) | Risk | Decision | GO Gate |
|---|---|---|---|---|
| config | ~1 | LOW | COMMIT | G-02 |
| denylist | ~1 | LOW | COMMIT | G-02 |
| path-guard | ~1 | LOW | COMMIT | G-02 |
| read/write policy | ~2 | LOW | COMMIT | G-02 |
| wrappers | ~1 | LOW | COMMIT | G-02 |
| delete-wrapper | ~1 | LOW | COMMIT | G-02 |
| operation-blocks | ~1 | LOW | COMMIT | G-02 |
| approval-request | ~1 | LOW | COMMIT | G-02 |
| smoke | ~1 | LOW-MEDIUM | REVIEW CI guard | G-02 + CI review |
| pilot | ~1 | LOW-MEDIUM | REVIEW CI guard | G-02 + CI review |

**tests/hermes/ Overall Decision**:

| Decision | Value |
|---|---|
| Commit as single group | YES — pending G-02 |
| Split smoke/pilot | Optional |
| HOLD indefinitely | NO |
| Raw value check | Required pre-stage |
| Stage action | NOT PERFORMED — awaiting G-02 |

---

## Pre-Stage Checklist (Required Before Any Staging)

- [ ] Confirm no absolute local paths (C:\, /home/, /Users/) in any fixture
- [ ] Confirm no API keys, tokens, or secrets in any file
- [ ] Confirm dummy-hermes-path.ts contains path constant only (no invocation)
- [ ] Confirm process-local test CI guard verified (skip in CI confirmed)
- [ ] Confirm smoke/pilot tests reviewed for CI guard
- [ ] Human GO issued (G-01 for ichikishima, G-02 for hermes)

---

## Current Status

**tests/ichikishima/**:
- Review: complete (v1.5.0, updated v3.1 review pending)
- Decision: COMMIT pending G-01
- Staged: NO
- Committed: NO

**tests/hermes/**:
- Review: complete (v1.5.1, updated v3.1 review pending)
- Decision: COMMIT pending G-02
- Staged: NO
- Committed: NO

この範囲では問題を検出していません。

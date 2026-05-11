# Shikishima Tomorrow GO/HOLD Decision Sheet — v2.7.0

## Purpose

Quick-reference decision sheet for each possible GO tomorrow.
For each gate, answer the questions in order. GO only if all confirmed.

- documentVersion: v2.7.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## G-01: tests/ichikishima commit

**Decision questions** (answer in order):

| # | Question | Required answer | Your answer |
|---|---|---|---|
| 1 | Have you read TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md? | Yes | |
| 2 | Is dummy-hermes-path.ts a path constant only (no invocation)? | Yes | |
| 3 | Does process-local test have `describe.skipIf(!allowDummyProcessEnv)`? | Yes | |
| 4 | Is `allowDummyProcessEnv = false` by default (no env var)? | Yes | |
| 5 | Are there no absolute paths (C:\, /home/) in any fixture file? | None found | |
| 6 | Are there no API keys or tokens in any test file? | None found | |
| 7 | Are you prepared to issue explicit GO? | Yes | |

**If all YES**: Issue `"GO G-01: Approve tests/ichikishima commit. [date]. [conditions]."` 
**If any NO**: HOLD. Fix issue. Re-review.

---

## G-02: tests/hermes commit

| # | Question | Required answer | Your answer |
|---|---|---|---|
| 1 | Have you read TESTS_HERMES_REVIEW_PACKAGE.md? | Yes | |
| 2 | Smoke test has CI guard confirmed? | Yes | |
| 3 | Pilot test risk reviewed and accepted or split? | Yes | |
| 4 | No absolute paths in any fixture? | None found | |
| 5 | No API keys or tokens in any file? | None found | |

**If all YES**: Issue `"GO G-02: Approve tests/hermes commit. [date]."` 
**If any NO**: HOLD.

---

## G-03: typecheck:node

| # | Question | Required answer | Your answer |
|---|---|---|---|
| 1 | Have you read V3_STATIC_VALIDATION_PLAN.md? | Yes | |
| 2 | Do you understand the redacted output format? | Yes | |
| 3 | Do you understand the STOP conditions? | Yes | |
| 4 | Tests committed (G-01+G-02) OR explicitly overriding? | Yes | |
| 5 | Local environment ready (no external services)? | Yes | |

**If all YES**: Issue `"GO G-03: Approve typecheck:node. [date]. Redaction policy accepted."`

---

## G-04: typecheck:web

Same as G-03 questions but for `typecheck:web`.
Issue: `"GO G-04: Approve typecheck:web. [date]."`

---

## G-05: eslint

| # | Question | Required answer | Your answer |
|---|---|---|---|
| 1 | Read V3_STATIC_VALIDATION_PLAN.md (eslint section)? | Yes | |
| 2 | Understand redacted output format? | Yes | |
| 3 | Ready to see potentially many warnings? | Yes | |

Issue: `"GO G-05: Approve eslint. [date]."`

---

## G-06: vitest

| # | Question | Required answer | Your answer |
|---|---|---|---|
| 1 | G-01 + G-02 complete (tests committed)? | Yes | |
| 2 | G-03 + G-04 complete (typecheck PASS)? | Yes | |
| 3 | process-local test will skip (CI=true mode)? | Confirmed | |
| 4 | No external services running during vitest? | None running | |
| 5 | Local-only policy reviewed (G-08)? | Yes | |

Issue: `"GO G-06: Approve vitest in [CI/local] mode. [date]."`

---

## G-07: build

| # | Question | Required answer | Your answer |
|---|---|---|---|
| 1 | typecheck:node PASS? | Yes | |
| 2 | typecheck:web PASS? | Yes | |
| 3 | No blocker typecheck errors remaining? | None | |

Issue: `"GO G-07: Approve build. [date]."`

---

## Quick HOLD Trigger List

Issue HOLD immediately if:

- Raw absolute path found in any file being reviewed
- CI guard missing from process-local test
- StackChan receives any connection attempt
- Any external service activates unexpectedly
- Any output contains secret or token
- productionReady is found = true anywhere
- Any document has been modified to enable execution

この範囲では問題を検出していません。

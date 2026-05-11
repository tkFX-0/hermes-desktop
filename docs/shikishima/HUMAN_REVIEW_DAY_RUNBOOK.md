# Shikishima Human Review Day Runbook — v2.2.0

## Purpose

A step-by-step runbook for the human reviewer to follow when assessing the
current state and deciding which GO gates to issue. This runbook helps the
reviewer understand what to look at, what to confirm, and what the HOLD/GO
decision means for each item.

- documentVersion: v2.2.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Before Starting

Confirm:
- [ ] You are reviewing in a local dev environment only
- [ ] No external services are running
- [ ] No StackChan is connected
- [ ] No voice/audio/camera is active
- [ ] You are the human reviewer; no automated process issues GO

---

## Step 1: Verify Current State

Read the following files and confirm their current values:

| File | What to check |
|---|---|
| `docs/shikishima/V2_READINESS_PACKAGE.md` | packageVersion = v2.0; v2.0 tasks all DONE |
| `docs/shikishima/ROADMAP_CHANGELOG.md` | roadmapVersion current; latest entry correct |
| `docs/shikishima/V3_GOAL_AND_TASK_PACK.md` | v3.x goal clear; task list understood |
| `docs/shikishima/REAL_OPERATION_MASTER_ROADMAP.md` | v3–v10 path understood |
| `docs/shikishima/REAL_OPERATION_PATH_TO_PRODUCTION.md` | production path understood |

**HOLD if**: Any document is inconsistent or shows unexpected state.
**Proceed if**: All documents consistent; state confirmed as expected.

---

## Step 2: Review tests/ichikishima/ (for G-01 decision)

Read the following files:

| File | What to check |
|---|---|
| `docs/shikishima/TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md` | Understand all 66 test files |
| `docs/shikishima/V3_TEST_COMMIT_DECISION_MATRIX.md` | Review commit decisions |
| `tests/ichikishima/sandbox/dummy-hermes-path.ts` | Confirm path constant only — no invocation |
| `tests/ichikishima/sandbox/dummy-hermes-stub-design.process-local.test.ts` | Confirm CI guard present |

**CI Guard Confirmation**:
- Look for: `describe.skipIf(!allowDummyProcessEnv)`
- Look for: `allowDummyProcessEnv = RUN_DUMMY_HERMES_LOCAL_PROCESS=1 AND CI!='true'`
- This means: skipped by default in CI and when env var not set

**HOLD if**: Raw values found; CI guard not present; any fixture invokes real Hermes.
**GO if**: All confirmed; CI guard present; no raw values.

**Issue GO G-01 by stating**:
> "GO G-01: Approve tests/ichikishima commit. [date]. CI guard confirmed. No raw values."

---

## Step 3: Review tests/hermes/ (for G-02 decision)

Read:

| File | What to check |
|---|---|
| `docs/shikishima/TESTS_HERMES_REVIEW_PACKAGE.md` | Understand all 12 zone tests |
| Smoke test file | CI guard present? |
| Pilot test file | Risk acceptable? |

**HOLD if**: Raw values found; smoke/pilot test CI guard not confirmed.
**GO if**: All 12 tests reviewed; no raw values; CI guard confirmed.

**Issue GO G-02 by stating**:
> "GO G-02: Approve tests/hermes commit. [date]. CI guard confirmed. No raw values."

---

## Step 4: Decide Test Commit Strategy

After reviewing steps 2 and 3:

| Decision | Action |
|---|---|
| Commit ichikishima only | Issue G-01 only |
| Commit hermes only | Issue G-02 only |
| Commit both together | Issue G-01 and G-02 |
| Split pilot tests out | Specify in GO statement |
| HOLD both | Do not issue any GO |

---

## Step 5: Review v3 Validation Plan (for G-03/G-04/G-05 decision)

After tests are committed (or independently):

Read `docs/shikishima/V3_EXECUTION_VALIDATION_ROADMAP.md` — check:
- Redaction policy understood
- Which commands to run in what order
- What output format is expected (redacted)

**Confirm**:
- [ ] You understand what typecheck:node does
- [ ] You understand what typecheck:web does
- [ ] You understand what eslint does
- [ ] You are prepared to receive redacted output only

**Issue GO G-03/G-04/G-05 by stating**:
> "GO G-03: Approve typecheck:node. Redaction policy accepted."
> "GO G-04: Approve typecheck:web. Redaction policy accepted."
> "GO G-05: Approve eslint. Redaction policy accepted."

---

## Step 6: Review Local-only Value Boundary (for G-08 decision)

Read `docs/shikishima/V3_EXECUTION_VALIDATION_ROADMAP.md` — Redaction Policy section.

**Confirm**:
- [ ] localhost:8765 in Research.tsx is display-only
- [ ] Dummy hermes paths are path constants only
- [ ] No WSL paths in committed code
- [ ] No home directory paths in any committed file

**HOLD if**: Any local path found committed that shouldn't be.
**GO if**: All boundaries confirmed.

**Issue GO G-08 by stating**:
> "GO G-08: Local-only value policy confirmed. [date]."

---

## Step 7: Confirm StackChan Is NOT Connected (v3–v6)

At current stage (v3), StackChan must NOT be connected.

- [ ] StackChan powered off or disconnected
- [ ] No StackChan USB/serial connection active
- [ ] No StackChan firmware command will be sent

**This confirmation is required at every human review session through v6.**

---

## Step 8: Confirm No External Network Operations

- [ ] No WSL running
- [ ] No Hermes running
- [ ] No RunPod connected
- [ ] No external API calls active
- [ ] No Discord webhook sent

---

## Step 9: Record Your Review

After completing your review, record:

| Field | Your Entry |
|---|---|
| Review date | [date] |
| Reviewer | [your name or alias] |
| GO gates issued | [list] |
| HOLD items confirmed | [list] |
| Next review trigger | [condition] |
| Notes | [any findings] |

---

## What to Return to HOLD Immediately

If any of the following occur during or after review:

| Finding | Action |
|---|---|
| Raw value in test file | Return to HOLD; remove or redact file; re-review |
| CI guard missing from process-local test | Return to HOLD; fix guard; re-review |
| StackChan receives unexpected connection | Disconnect; return to HOLD |
| Unexpected external network activity | Stop all operations; return to HOLD |
| productionReady discussed as near-ready | Confirm it is still false; return to HOLD if any doubt |

この範囲では問題を検出していません。

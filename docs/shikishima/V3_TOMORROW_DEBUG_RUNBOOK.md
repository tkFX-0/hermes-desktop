# Shikishima v3.x Tomorrow Debug Runbook — v2.3.0

## Purpose

Step-by-step runbook for the next debug/review session.
Read this first before starting any debug work.

- documentVersion: v2.3.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Before Starting

- [ ] Open this file first
- [ ] No command runs until you confirm the GO/HOLD decision at each step
- [ ] No test execution until G-01/G-02 issued
- [ ] No typecheck/build/vitest until G-03–G-07 issued
- [ ] StackChan not connected
- [ ] No WSL running
- [ ] No external services

---

## Session Step 1: Confirm Current State (5 minutes)

Read these files in order:

| File | Purpose |
|---|---|
| `docs/shikishima/ROADMAP_CHANGELOG.md` | Latest roadmapVersion |
| `docs/shikishima/V2_READINESS_PACKAGE.md` | v2.0 completed tasks |
| `docs/shikishima/V3_GOAL_AND_TASK_PACK.md` | v3.x tasks |
| `docs/shikishima/REAL_OPERATION_MASTER_ROADMAP.md` | v3–v10 overview |
| `docs/shikishima/V3_HUMAN_GO_CHECKLIST.md` | GO checklist reference |

**Expected**: roadmapVersion = v2.7.0 (or latest); all v2.0 tasks DONE.

**If unexpected**: HOLD; investigate before proceeding.

---

## Session Step 2: Review tests/ichikishima/ (for G-01 decision)

Read:
- `docs/shikishima/TESTS_ICHIKISHIMA_REVIEW_PACKAGE.md`
- `docs/shikishima/V3_TEST_COMMIT_DECISION_MATRIX.md`

Then read (code files, do not execute):
- `tests/ichikishima/sandbox/dummy-hermes-path.ts`
- `tests/ichikishima/sandbox/dummy-hermes-stub-design.process-local.test.ts`

**Check in dummy-hermes-stub-design.process-local.test.ts**:
- Look for: `describe.skipIf` or `test.skipIf`
- Look for: `allowDummyProcessEnv` — should be `false` unless env var set
- Confirm: default behavior = skip (no env var set)

**Decision**:

| Finding | Action |
|---|---|
| CI guard present; no raw values | Consider issuing G-01 |
| CI guard missing | HOLD; do not issue G-01; fix guard |
| Raw absolute path in fixture | HOLD; remove path; re-review |

---

## Session Step 3: Review tests/hermes/ (for G-02 decision)

Read: `docs/shikishima/TESTS_HERMES_REVIEW_PACKAGE.md`

Spot-check smoke and pilot test files for CI guard.

**Decision**: Same as Step 2.

---

## Session Step 4: Decide Test Commit Strategy

| Option | When | Action |
|---|---|---|
| Issue G-01 + G-02 together | Both reviewed and safe | State both GOs |
| Issue G-01 only | Only ichikishima ready | State G-01 only |
| Issue G-02 only | Only hermes ready | State G-02 only |
| HOLD both | Any concern found | Do not issue GO; document concern |

---

## Session Step 5: Validation Plan Review (for G-03–G-05 decision)

Read: `docs/shikishima/V3_STATIC_VALIDATION_PLAN.md`

Confirm you understand:
- What each command does
- What redacted output looks like
- When to STOP

**Decision for G-03 (typecheck:node)**:

| Condition | Action |
|---|---|
| Tests committed (G-01+G-02) or explicitly OK | Consider G-03 |
| Tests not committed | Consider G-03 anyway with explicit override note |
| Not ready for validation | HOLD G-03 |

Issue GO G-03 by stating:
> "GO G-03: Approve typecheck:node. Redaction policy accepted. [date]."

Same pattern for G-04 and G-05.

---

## Session Step 6: Debug Typecheck Errors (if G-03/G-04 run)

If typecheck returns errors, use `V3_REDACTED_RESULT_REVIEW_TEMPLATE.md` to record results.

Classify each error:

| Error Type | Fix Priority |
|---|---|
| Import path error from Phase D rename | Fix import path |
| Type mismatch in IPC contract | Review IPC schema |
| Missing type definition | Add type or `any` temporarily with comment |
| Third-party type error | Check if `@types/` package needed |

**HOLD condition**: If more than 20 errors → stop; triage before continuing.

---

## Session Step 7: Review StackChan Status

- [ ] StackChan is NOT connected
- [ ] No USB/serial connection to StackChan
- [ ] No Wi-Fi/Bluetooth connection to StackChan
- [ ] robotMotion = HOLD (confirm)

If StackChan is physically present but not connected: document as "purchased; not connected".

---

## Session Step 8: Review productionReady Status

- [ ] productionReady = false (confirm)
- [ ] No document in this session changes productionReady
- [ ] G-18 has NOT been issued
- [ ] execution = disabled (confirm)

---

## Session Step 9: Decide Next GO Scope

Based on steps 1–8, decide:

| GO | Ready? | Condition |
|---|---|---|
| G-01 (tests/ichikishima) | Review Step 2 | |
| G-02 (tests/hermes) | Review Step 3 | |
| G-03 (typecheck:node) | Review Step 5 | |
| G-04 (typecheck:web) | After G-03 or independently | |
| G-05 (eslint) | Review Step 5 | |
| G-06 (vitest) | After G-01+G-02+G-03+G-04 | |
| G-07 (build) | After typecheck PASS | |

Record your decisions in `V3_HUMAN_GO_CHECKLIST.md` GO Statement Archive.

---

## Debug Decision Tree

```
Start
  ↓
Any unexpected state? → YES → HOLD; investigate
  ↓ NO
tests/ichikishima CI guard present? → NO → Fix guard; re-review
  ↓ YES
tests/hermes CI guard present? → NO → Fix guard; re-review
  ↓ YES
Issue G-01 and/or G-02?
  ↓
Run tests commit (after GO)
  ↓
Ready for typecheck? → Issue G-03, G-04, G-05
  ↓
Review redacted output
  ↓
Errors found? → Fix errors → Re-run (new GO per run)
  ↓ NO
Proceed to G-06 (vitest) when ready
```

---

## Rollback Decision Tree

```
Any P0 incident? → YES → STOP ALL; return to Level 0; await human instruction
  ↓ NO
Any raw value in output? → YES → Redact; HOLD gate; re-review
  ↓ NO
Any unexpected output? → YES → HOLD gate; document; re-review
  ↓ NO
Continue with session plan
```

---

## End of Session Checklist

Before closing the debug session:

- [ ] All test processes terminated
- [ ] Working tree status confirmed (git status)
- [ ] No unintended files staged
- [ ] No raw values in any opened file or terminal output
- [ ] Roadmap docs reflect current state
- [ ] GO Statement Archive updated in V3_HUMAN_GO_CHECKLIST.md
- [ ] Next session plan noted

この範囲では問題を検出していません。

# Shikishima Tomorrow Test Commit Review Sheet — v2.7.0

## Purpose

Quick reference for reviewing test files before issuing G-01 or G-02.
Use alongside HUMAN_REVIEW_DAY_RUNBOOK.md Step 2 and Step 3.

- documentVersion: v2.7.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Current Test Status

| Group | Files | Staged | Committed | Gate |
|---|---|---|---|---|
| tests/ichikishima/ | 66 | NO | NO | G-01 |
| tests/hermes/ | 12 | NO | NO | G-02 |

---

## tests/ichikishima/ Review Checklist

**Key files to read before G-01**:

| File | What to check |
|---|---|
| `tests/ichikishima/sandbox/dummy-hermes-path.ts` | Contains only a path constant; no function call; no spawn; no require |
| `tests/ichikishima/sandbox/dummy-hermes-stub-design.process-local.test.ts` | Contains `describe.skipIf(!allowDummyProcessEnv)` |
| Any hermes-real-pilot test file | Has CI guard; no live API call |

**Spot checks in any test file**:

| Check | Expected |
|---|---|
| `C:\Users\` or `/home/` | NOT present |
| API key / token string | NOT present |
| Real Hermes endpoint URL | NOT present |
| `spawn` or `execFile` with real binary | NOT present (or guarded by env check) |

**If all checks pass**: Consider G-01.
**If any check fails**: Fix issue; re-review; do NOT stage.

---

## CI Guard Verification

For `dummy-hermes-stub-design.process-local.test.ts`:

```typescript
// Expected pattern in file:
const allowDummyProcessEnv =
  process.env.RUN_DUMMY_HERMES_LOCAL_PROCESS === '1' &&
  process.env.CI !== 'true';

describe.skipIf(!allowDummyProcessEnv)('dummy hermes stub design', () => {
  // ...
});
```

**Confirm**: `allowDummyProcessEnv` is `false` in default local run (no env vars set).
**Confirm**: `allowDummyProcessEnv` is `false` in CI (`CI=true` by default).

---

## tests/hermes/ Review Checklist

**Key items to check**:

| Item | Expected |
|---|---|
| Smoke test CI guard | Present |
| Pilot test CI guard or risk noted | Present |
| No absolute local paths in any zone test | None found |
| No API keys or credentials | None found |
| Zone tests: denylist / policy / path-guard | No real file system calls without guard |

---

## Commit Strategy Options

| Option | When | Notes |
|---|---|---|
| Commit both together | Both reviewed and safe | Single commit: `test: add ichikishima and hermes test suites` |
| Commit ichikishima first | ichikishima ready; hermes needs more review | Two separate commits |
| Commit hermes first | hermes ready; ichikishima needs more review | Less common; acceptable |
| Split pilot tests out | Pilot tests need more review | Commit main suite; HOLD pilot files |
| HOLD all | Any concern found | Do not stage anything |

---

## Pre-Stage Final Check (required before `git add`)

Before running `git add tests/ichikishima/` or `git add tests/hermes/`:

- [ ] G-01 or G-02 explicitly issued (not just reviewed)
- [ ] `git status` confirms no unintended files will be staged
- [ ] Not staging: docs/ichikishima/, sandbox/, .claude/, .cursor/
- [ ] Not staging: any src/ files unrelated to this commit
- [ ] Commit message ready (no raw paths in message)

---

## After Commit

- [ ] `git status` shows clean (no unintended untracked staged)
- [ ] `git log -1` shows correct subject
- [ ] roadmap docs updated with new working tree state
- [ ] V3_HUMAN_GO_CHECKLIST.md GO Statement Archive updated

この範囲では問題を検出していません。

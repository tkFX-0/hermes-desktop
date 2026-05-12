# Shikishima v4 Failure to HOLD Runbook — v2.8.1

## Purpose

Defines when v4 validation failure must return to HOLD and what to do next.

- documentVersion: v2.8.1 / decision: HOLD / execution: disabled / productionReady: false

---

## Automatic HOLD Conditions

Return immediately to HOLD if:

| Condition | Severity | Action |
|---|---|---|
| process-local test NOT skipped in vitest | P0 | Kill vitest; fix CI guard; re-issue G-06 |
| Raw value in any output | P0 | Redact; report; do not continue |
| External network connection during test | P0 | Kill; disconnect; report |
| > 50 typecheck errors | P1 | HOLD; triage before fixing |
| > 30% vitest failures | P1 | HOLD; investigate pattern |
| Build crash (not signing error) | P1 | HOLD; investigate |

---

## HOLD Return Procedure

When returning to HOLD:

1. Stop all running commands
2. Redact any captured output
3. Report: "v4 HOLD. [Category]. Redacted output captured. Waiting for instruction."
4. Document findings (redacted) in V4_REDACTED_RESULT_CHECKLIST.md
5. Await human instruction before re-issuing any GO

---

## Error Fix Guidelines (after HOLD cleared)

| Error Category | Fix Approach |
|---|---|
| TypeScript import path error | Update import path; check tsconfig paths |
| TS type mismatch in IPC | Review shared/ichikishima/ type definitions |
| eslint `@typescript-eslint/no-explicit-any` | Add type or suppress with comment |
| eslint unused variable | Remove variable or add `_` prefix |
| vitest: test assertion failure | Fix test logic or update expected value |
| vitest: fixture path not found | Update fixture path constant |
| build: missing module | Check package.json dependencies |

---

## Re-Running After Fix

After fixing errors and committing fix:
- Typecheck/eslint: Re-run with same GO (G-03/G-04/G-05 cover re-runs in same session)
- vitest: Re-run with same G-06 (same session)
- New session: may need new GO confirmation

---

## Escalation to Human

Escalate if:
- Fix direction unclear
- Error suggests security issue
- Error suggests data leak
- > 3 HOLD returns in same stage

この範囲では問題を検出していません。

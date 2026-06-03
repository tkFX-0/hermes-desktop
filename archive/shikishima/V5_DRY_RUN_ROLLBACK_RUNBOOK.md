# Shikishima v5 Dry-Run Rollback Runbook — v2.8.2

## Purpose

Defines rollback procedure if the v5 dry-run fails or encounters an incident.

- documentVersion: v2.8.2 / decision: HOLD / execution: disabled / productionReady: false

---

## Rollback Trigger Conditions

| Condition | Severity | Rollback Level |
|---|---|---|
| External network request | P0 | Level 3 (validated; no run) |
| Raw path in UI | P1 | Level 3; fix UI; re-run |
| App crash on startup | P1 | Level 3; fix; re-run |
| IPC executing (not read-only) | P0 | Level 3; investigate immediately |
| StackChan connected unexpectedly | P0 | Level 3; disconnect |

---

## Rollback Steps

1. Terminate dev process: `Ctrl+C` in terminal or kill process
2. Confirm process is not running: `git status` (should be clean)
3. Redact any console output captured
4. Report incident category to human
5. Do NOT restart without human instruction

---

## Re-Run Conditions

After rollback:

- If P0: new G-20 required + fix verified
- If P1: fix applied; commit fix; G-20 still valid in same session if not P0
- If crash: debug → fix → commit → new G-20 recommended

---

## What Rollback Does NOT Reset

- Committed code: unchanged (use `git revert` if needed)
- GO statements: remain in archive
- HOLD gates: remain open (G-20 re-run OK in same session for P1)

この範囲では問題を検出していません。

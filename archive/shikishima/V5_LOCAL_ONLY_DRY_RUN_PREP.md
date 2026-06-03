# Shikishima v5 Local-Only Dry-Run Preparation — v2.8.2

## Purpose

Preparation for v5 controlled local-only dry-run of the Electron app.
Dry-run is NOT executed here. Requires G-20.

- documentVersion: v2.8.2 / decision: HOLD / execution: disabled / productionReady: false

---

## v5 Goal

Run Electron app in local dev mode; verify basic screen navigation; confirm all values local-only; no external connections.

## Entry Conditions

- [ ] v4 complete (typecheck/eslint/vitest/build all PASS)
- [ ] Human GO for v5

## What Is Verified in Dry-Run (after G-20)

| Component | Verification | Notes |
|---|---|---|
| App startup | Launches without crash | |
| Main screen | Renders correctly | |
| Navigation | All routes accessible | |
| ControlCenter screen | Renders; shows read-only data | |
| Research screen | Shows alive/unavailable state | localhost:8765 check |
| IPC bridge | getAppSnapshot returns schema-valid data | |
| No external connections | Network monitor shows no external requests | |

## Startup Command (do NOT run without G-20)

```
npm run dev
# or: npx electron-forge start
```

## What To Watch During Run

- Window opens without crash
- Navigation links respond
- Console: no errors
- Network: no external requests (verify in DevTools)
- No raw file paths in any displayed text

## Stop Conditions During Dry-Run

| Condition | Action |
|---|---|
| App crashes on startup | Investigate; fix; new G-20 if needed |
| External network request | Stop app; disconnect; report P0 |
| Raw path displayed in UI | Stop; fix UI; re-test |
| Unexpected IPC channel opens | Stop; investigate |

## v5 Exit Conditions

- [ ] App launches and runs stably
- [ ] All screens render correctly
- [ ] ControlCenter IPC read-only confirmed
- [ ] Research screen alive-check works correctly
- [ ] No external connections observed
- [ ] V6 Readiness Package created
- [ ] Human GO for v6

この範囲では問題を検出していません。

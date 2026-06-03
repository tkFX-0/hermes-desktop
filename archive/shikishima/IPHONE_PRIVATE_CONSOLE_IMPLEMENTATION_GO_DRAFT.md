# iPhone Private Console — Phase 1 Implementation GO Draft
date: 2026-05-15
status: draft — NOT approved
purpose: Phase 1 static iPhone-width UI mock only

---

## This document does NOT approve Phase 1.

Phase 1 remains HOLD until all prerequisites are satisfied
and this GO text is issued by the human.

---

## Prerequisites Before Issuing This GO

```
[ ] Architecture docs reviewed by human (IPHONE_PRIVATE_CONSOLE_ARCHITECTURE.md)
[ ] MVP phases reviewed (IPHONE_PRIVATE_CONSOLE_MVP_PHASES.md)
[ ] Security model reviewed (IPHONE_PRIVATE_CONSOLE_SECURITY_MODEL.md)
[ ] UI spec reviewed (IPHONE_PRIVATE_CONSOLE_UI_SPEC.md)
[ ] API contract reviewed (IPHONE_PRIVATE_CONSOLE_API_CONTRACT.md)
[ ] Working tree: staged=0 / dirty_tracked=0
[ ] No open security issues
[ ] Human explicitly issues GO text below
```

---

## Phase 1 GO Template

```
I explicitly approve Phase 1 iPhone Private Console implementation.

Approved scope:
  Static / mock UI components only.
  No server. No runtime API. No network listener.

Approved files (new):
  src/renderer/src/screens/MobileConsole/MobileConsoleApp.tsx
  src/renderer/src/screens/MobileConsole/MobileStatusCard.tsx
  src/renderer/src/screens/MobileConsole/MobileB3Progress.tsx
  src/renderer/src/screens/MobileConsole/MobileGoDrafts.tsx
  src/renderer/src/screens/MobileConsole/MobileAuditSummary.tsx
  src/renderer/src/screens/MobileConsole/MobileAgentTeam.tsx
  src/renderer/src/screens/MobileConsole/MobilePushReadiness.tsx
  src/renderer/src/screens/MobileConsole/index.ts

Approved modifications (existing):
  src/renderer/src/screens/Layout/Layout.tsx
    (add MobileConsole tab/route — read-only, no IPC execution)
  src/shared/i18n/locales/ja/controlCenter.ts
    (add mobile console label keys)
  src/shared/i18n/locales/en/controlCenter.ts
    (same)

Forbidden in this implementation:
  - main process server / network listener
  - IPC execution calls
  - Authentication implementation
  - Cloudflare / Tailscale setup
  - package.json / package-lock.json changes
  - .github/workflows changes
  - Level 3 / productionReady / execution endpoint
  - robot / voice / camera endpoint
  - Secret storage or raw value display

Test expectations:
  - typecheck:web: 0 errors
  - typecheck:node: 0 errors
  - npm test: all pass (no regressions)
  - Safety banner visible in all MobileConsole screens
  - No raw values visible in any component

Manual review steps:
  1. Open MobileConsole in Electron window
  2. Resize window to 390px width
  3. Confirm safety banner visible at top
  4. Confirm HOLD / disabled / false displayed correctly
  5. Confirm no raw values visible
  6. Open on iPhone Safari via local Vite dev URL (same LAN)
  7. Confirm portrait layout renders correctly

Rollback plan:
  git revert <commit hash>
  All MobileConsole files are isolated in one directory.
  No existing files broken by removal.

Post-implementation regression plan:
  - Verify existing screens (Chat, ControlCenter, Settings) unaffected
  - Verify Layout.tsx still routes correctly to all existing screens
  - Run full test suite

After implementation:
  - Do not push without separate push GO
  - Do not proceed to Phase 2 without Phase 1 human review
```

---

## Proposed File Placement

App.tsx uses a state machine (not React Router):
```
screen: "splash" | "welcome" | "installing" | "setup" | "main"
```

`"main"` renders `<Layout />`. Layout.tsx handles navigation between tabs.
MobileConsole should be added as a tab within Layout, not a new top-level screen.

This is the safest placement:
- Reuses existing Layout / IPC / i18n infrastructure
- No new routing system required
- No package dependency needed

Alternative: add `"mobile"` as a screen state in App.tsx.
This is cleaner separation but requires App.tsx change.
Recommendation: Layout tab for Phase 1, App-level screen for Phase 2+.

---

## Phase 1 Safety Invariants (after implementation)

```
decision:         HOLD  (unchanged)
execution:        disabled  (unchanged)
productionReady:  false  (unchanged)
rawValuesReported: false  (unchanged)
network_listener: none added  (Phase 1 only)
```

---

この範囲では問題を検出していません

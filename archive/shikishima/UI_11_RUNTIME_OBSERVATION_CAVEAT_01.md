# UI-11 CAVEAT-01 — Command Center UI Wiring Gap

## Summary

The 2026-05-18 runtime observation confirmed that UI-05〜UI-10 components
compile, typecheck, and pass 806 tests — but are not reachable from the
running Electron app because the routing/entrypoint has not been updated.

---

## What Was Observed

The running app shows the **existing Hermes navigation** (Layout.tsx):

```
Chat | Sessions | Agents | Office | Models | Skills | Soul | Memory |
Tools | Schedules | Gateway | Settings | Research | Control Center | Mobile Console
```

The `Control Center` item routes to `ControlCenterAppShell` — the older
snapshot view, not the new Command Center with PageShell + SafetyStrip.

---

## What Was Expected

The new Command Center UI should show:

```
PageShell (SafetyStrip + PageTabs + body)
  ↓
12 tabs: Operator | Chat | StackChan | Outbox | Queue | GO |
         Evidence | STOP | Push | Inspector | Settings | Help
```

---

## Root Cause

`Layout.tsx` does not import or render any of:
- `PageShell`
- `SafetyStrip` (in Command Center context)
- `PageTabs` (in Command Center context)
- `OperatorPage`
- `CommandChatPage`
- `StackChanPage`
- `OutboxPage`, `QueuePage`, `GoPage`, `EvidencePage`, `StopPage`, `PushPage`
- `CommandSettingsPage`
- `CommandHelpPage`, `OnboardingFlow`
- State/Toast/CommandPalette components

The `View` type in `Layout.tsx` also does not include the new `PageId` values
from `ui-page-types.ts`.

---

## Classification

```
safety_violation:      false
  productionReady remained false.
  execution remained disabled.
  No raw values were accessible.
  No external actions were reachable.

implementation_gap:    true
  The components exist but are not rendered in any code path.

urgency:               medium
  Does not block safety invariants.
  Does block visual verification of new pages.
```

---

## Fix Required

The fix for CAVEAT-01 is **UI-12 Layout wiring**:

```
Target file:   src/renderer/src/screens/Layout/Layout.tsx
Action:        Add Command Center navigation entry + render new pages
Scope:         Import and wire PageShell with all 12 Command Center pages
Tests required: typecheck:node + typecheck:web + vitest after wiring
GO required:   Separate implementation GO with time_window
```

This must NOT be done during a runtime observation task.
It requires a dedicated implementation GO.

---

## Impact on 90→95 Acceptance Criteria

```
AC-02: All 12 pages render without crash → BLOCKED until CAVEAT-01 fixed
AC-03: SafetyStrip visible on every page → BLOCKED
AC-04: productionReady:false visible → BLOCKED (cannot observe new pages)
AC-05: execution:disabled visible → BLOCKED
AC-06/07/08: No raw values → BLOCKED (cannot observe)
AC-09: No external action button → BLOCKED
```

After CAVEAT-01 fix + new runtime observation:
- All the above can be verified
- 90→95 acceptance criteria then completable

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_

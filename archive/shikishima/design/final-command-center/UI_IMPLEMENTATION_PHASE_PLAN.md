# UI Implementation Phase Plan

## Document Status

```text
roadmapVersion: v3.66.0
date: 2026-05-17
task: UI-01
```

---

## Overview

Each phase requires a separate human GO. No phase may proceed without GO.
No phase may implement risky capabilities (push / runtime / external write / execution enable).

---

## UI-01 — Design Package Intake (THIS TASK)

```text
scope:      docs-only intake and implementation planning
output:     this docs directory
src_changes: none
GO_required: I approve docs-only intake and implementation planning...
status:     COMPLETE
```

---

## UI-02 — Type / Design Contract Scaffold

```text
scope:
  Add UI type definitions and component interface contracts only.
  No rendered components. No runtime behavior.

files_likely_affected:
  src/shared/ichikishima/ui-types.ts  (new)
  src/shared/ichikishima/page-contract.ts  (new)
  src/renderer/src/types/ui.ts  (new or existing)

output:
  Typed contracts for all 12 pages
  Service data shape types
  Lamp / state type union
  Button policy type guards

src_changes: type files only
GO_required: separate GO for UI-02
caution:
  Do not create any React components in this phase.
  Do not import types into existing components.
```

---

## UI-03 — PageShell / PageTabs / SafetyStrip / ChatInputBar

```text
scope:
  Implement shared shell components.
  PageShell, PageTabs, SafetyStrip, ChatInputBar, MiniLampRow.
  Read-only display only.

files_likely_affected:
  src/renderer/src/components/Shell/PageShell.tsx
  src/renderer/src/components/Shell/PageTabs.tsx
  src/renderer/src/components/Shell/SafetyStrip.tsx
  src/renderer/src/components/Shell/ChatInputBar.tsx
  src/renderer/src/components/Shell/MiniLampRow.tsx
  src/renderer/src/styles/tokens.css

output:
  Shell renders around existing ControlCenterAppShell
  SafetyStrip shows current decision from snapshot

GO_required: separate GO for UI-03
caution:
  SafetyStrip must use safe-snapshot-service, not hardcoded values.
  ChatInputBar connects to local-chat-service only.
  Tabs are navigation-only; no action on click.
```

---

## UI-04 — Operator View (Desktop + Mobile)

```text
scope:
  Implement Operator page for desktop (1200px) and mobile (393px).
  LampGrid, QuickActionPanel (copy-only).

files_likely_affected:
  src/renderer/src/screens/Operator/OperatorDesktopPage.tsx
  src/renderer/src/screens/Operator/OperatorMobilePage.tsx
  src/renderer/src/screens/Operator/LampGrid.tsx
  src/renderer/src/screens/Operator/QuickActionPanel.tsx

GO_required: separate GO for UI-04
caution:
  All lamp data from safe-snapshot-service only.
  QuickActionPanel: copy-only. No execution.
```

---

## UI-05 — Chat Page

```text
scope:
  Implement Chat page with local message history and ChatInputBar.

files_likely_affected:
  src/renderer/src/screens/Chat/ChatPage.tsx
  src/renderer/src/screens/Chat/MessageBubble.tsx

GO_required: separate GO for UI-05
caution:
  Local chat only. No external send.
  Safety wording must be visible on send.
```

---

## UI-06 — Outbox / Queue / GO / Evidence / STOP / Push Pages

```text
scope:
  Implement operational page suite (6 pages).
  All actions are copy-only or display-only.

files_likely_affected:
  src/renderer/src/screens/Outbox/OutboxPage.tsx
  src/renderer/src/screens/Queue/QueuePage.tsx
  src/renderer/src/screens/Go/GoPage.tsx
  src/renderer/src/screens/Evidence/EvidencePage.tsx
  src/renderer/src/screens/Stop/StopPage.tsx
  src/renderer/src/screens/Push/PushPage.tsx

GO_required: separate GO for UI-06
caution:
  PushPage must NEVER trigger git push.
  GoPage: copy-only. System does not execute.
  OutboxPage: no send/pay/create buttons.
```

---

## UI-07 — StackChan Control Room (Desktop + Mobile)

```text
scope:
  Implement StackChan status display.
  Display-only. Physical operation remains HOLD.

files_likely_affected:
  src/renderer/src/screens/StackChan/StackChanDesktopPage.tsx
  src/renderer/src/screens/StackChan/StackChanMobilePage.tsx

GO_required: separate GO for UI-07
caution:
  No physical-operate, voice, camera, mic buttons.
  Shows connection: not_arrived by default.
```

---

## UI-08 — Settings / Help / Onboarding

```text
scope:
  Implement Settings (local only), Help (static), Onboarding flow.
  Risky toggles visually LOCKED and non-interactive.

files_likely_affected:
  src/renderer/src/screens/Settings/SettingsPage.tsx
  src/renderer/src/screens/Help/HelpPage.tsx
  src/renderer/src/screens/Onboarding/OnboardingFlow.tsx

GO_required: separate GO for UI-08
caution:
  Locked settings: cursor:not-allowed, grayed out, no action on click.
  Settings are local-device only.
```

---

## UI-09 — State Coverage (Empty / Loading / Error / Stale / Toast / Command Palette)

```text
scope:
  Implement all loading/error/stale/empty states.
  Toast notification system. Command palette (copy-only).

files_likely_affected:
  src/renderer/src/components/State/*.tsx
  src/renderer/src/components/Toast/ToastSystem.tsx
  src/renderer/src/components/CommandPalette/CommandPalette.tsx

GO_required: separate GO for UI-09
caution:
  UNKNOWN/STALE/ERROR must always fallback to HOLD display.
  LoadingState must preserve last-known lamp values.
  CommandPalette: copy-only. No execution.
```

---

## UI-10 — Visual QA and Mobile Review

```text
scope:
  Visual QA pass across all pages.
  Mobile 393px responsiveness review.
  A11y checklist verification.
  No new features.

GO_required: separate GO for UI-10
caution:
  No runtime unless separately approved.
  Report visual regressions and a11y findings only.
```

---

## Implementation Order Recommendation

```text
Recommended execution order:
  UI-01 → UI-02 → UI-03 → UI-04 → UI-05 → UI-06 → UI-07 → UI-08 → UI-09 → UI-10

Parallel candidates (if approved):
  UI-04 + UI-05 may be parallelized (independent pages)
  UI-06 sub-pages may be partially parallelized (same suite)
  UI-07 + UI-08 may be parallelized (independent pages)

Do NOT parallelize:
  UI-02 (types must land before components)
  UI-03 (shell must land before pages)
```

---

この範囲では問題を検出していません。

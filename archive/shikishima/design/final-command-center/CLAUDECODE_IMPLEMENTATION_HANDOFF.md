# ClaudeCode Implementation Handoff

## Document Status

```text
roadmapVersion: v3.66.0
date: 2026-05-17
task: UI-01
```

---

## Current Status

```text
Design package: INGESTED (UI-01 complete)
Source implementation: NOT STARTED
Next recommended task: UI-02 — Type / Design Contract Scaffold
```

---

## Recommended First Source Implementation: UI-02

```text
Why UI-02 first (not full UI rewrite):
  1. Existing components must not be broken by a big-bang rewrite.
  2. Type contracts let each subsequent phase be independently verifiable.
  3. Type-only changes have minimal risk of breaking runtime behavior.
  4. Each page phase can be reviewed in isolation.
```

---

## UI-02 GO Template

```text
I approve UI-02 type and design contract scaffold as source-only changes.
No rendered components are approved.
No runtime is approved.
No productionReady change is approved.
No execution enablement is approved.
No external write is approved.
No push is approved.
```

---

## Files to Create in UI-02

```text
src/shared/ichikishima/ui-page-types.ts
  — page id union, page contract interface, lamp types

src/shared/ichikishima/ui-safety-types.ts
  — button policy type guards, locked-setting types

src/renderer/src/types/design-tokens.ts
  — CSS variable key types, theme type

src/renderer/src/types/service-contracts.ts
  — per-page service data shape types
```

---

## Files NOT to Touch in UI-02

```text
src/renderer/src/App.tsx
src/renderer/src/screens/**   (no new components yet)
src/main/**                   (main process untouched)
src/preload/**                (preload untouched)
package.json / package-lock.json
```

---

## Components to Create (UI-03 and later)

```text
Shell (UI-03):
  PageShell.tsx
  PageTabs.tsx
  SafetyStrip.tsx
  ChatInputBar.tsx
  MiniLampRow.tsx

Operator (UI-04):
  OperatorDesktopPage.tsx
  OperatorMobilePage.tsx
  LampGrid.tsx
  QuickActionPanel.tsx

Chat (UI-05):
  ChatPage.tsx
  MessageBubble.tsx

Suite pages (UI-06):
  OutboxPage, QueuePage, GoPage, EvidencePage, StopPage, PushPage

StackChan (UI-07):
  StackChanDesktopPage.tsx
  StackChanMobilePage.tsx

Settings/Help/Onboarding (UI-08):
  SettingsPage.tsx, HelpPage.tsx, OnboardingFlow.tsx

States/Toast/Palette (UI-09):
  LoadingCard, ErrorCard, StaleCard, EmptyCard, ToastSystem, CommandPalette
```

---

## Components to Avoid Rewriting Until Explicitly Approved

```text
src/renderer/src/screens/ControlCenterAppShell/ControlCenterAppShell.tsx
  — current shell; replace incrementally, not all at once

src/renderer/src/screens/Layout/Layout.tsx
  — current layout; keep working while new shell is built

src/main/ichikishima/**
  — existing service layer; do not refactor during UI phases

src/preload/**
  — IPC surface; add new channels only; do not rename existing ones
```

---

## Test Strategy

```text
UI-02:  TypeScript compile passes (typecheck:node + typecheck:web)
UI-03:  SafetyStrip renders with HOLD default; tabs navigate
UI-04:  Operator view renders with mock snapshot; lamps show HOLD
UI-05:  Chat input sends to local-chat-service; safety note visible
UI-06:  Each page renders; no send/push button is interactive
UI-07:  StackChan shows not_arrived; no physical-operate button
UI-08:  Settings locked toggles are non-interactive
UI-09:  Stale state shows HOLD; error state shows HOLD

All tests: vitest run + typecheck + eslint must pass
```

---

## Source Implementation Guardrails

```text
1. Safety Strip must always be present — never conditionally hidden
2. ChatInputBar: local-chat-service ONLY
3. PushPage: no git push button
4. GoPage: copy-only templates
5. OutboxPage: no send/create/pay active buttons
6. SettingsPage: locked section must be visually LOCKED
7. StackChanPage: no physical-operate / voice / camera / mic active buttons
8. STALE / ERROR / UNKNOWN → always fallback to HOLD
9. CSS tokens from index.html variables — no hardcoded hex colors
10. Language: T(ja, en) hook — no hardcoded Japanese strings outside T()
```

---

## Rollback Plan

```text
Each UI phase is a separate commit.
If a phase introduces regression:
  1. Identify which phase commit caused the regression
  2. git revert that commit
  3. Re-plan the phase with narrower scope
  4. New GO required before re-implementation
```

---

## Design Source of Truth

```text
For any implementation question, refer to these files in order:
  1. docs/shikishima/design/final-command-center/source/<file>.jsx
  2. docs/shikishima/design/final-command-center/source/index.html  (CSS tokens)
  3. docs/shikishima/design/final-command-center/DESIGN_TO_IMPLEMENTATION_MAPPING.md
  4. docs/shikishima/design/final-command-center/FRONTEND_BACKEND_UI_CONTRACT.md
  5. docs/shikishima/design/final-command-center/UI_SAFETY_AND_BUTTON_POLICY_REVIEW.md
```

---

この範囲では問題を検出していません。

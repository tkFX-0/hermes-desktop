# Design to Implementation Mapping

## Document Status

```text
roadmapVersion: v3.66.0
date: 2026-05-17
task: UI-01
```

---

## shikishima.jsx → Shared Tokens / Primitives

```text
purpose:            CSS variables, language context, state definitions
contents:
  sk.*              CSS-var reference map
  LangCtx / useLang T(ja, en) language hook
  STATES            HOLD / GO_READY / PASS / STOP / REJECT definitions

implementation_target:
  src/renderer/src/styles/tokens.css   — CSS variables (derive from index.html)
  src/renderer/src/lib/lang.tsx        — LangCtx + T() hook
  src/shared/states.ts                 — STATES definitions (shared)

caution:
  index.html is the token source of truth.
  Do NOT duplicate token values — derive from CSS variables.
  T() hook is component-level; do not use in main/preload.
```

---

## pages-shell.jsx → Shell / Navigation / Safety Strip

```text
purpose:            PageShell, PageTabs (12 pages), SafetyStrip, ChatInputBar, MiniLampRow
contents:
  PAGES array       [operator, chat, stackchan, outbox, queue, go, evidence,
                     stop, push, inspector, settings, help]
  PageShell         outer wrapper: topbar + tabs + safetystrip + body
  PageTabs          horizontal scrollable nav (navigation-only; no actions)
  SafetyStrip       always-visible decision/productionReady/execution status bar
  ChatInputBar      local chat send (no external send)
  MiniLampRow       compact status lamps
  StatusKVList      thin KV status bar

implementation_target:
  src/renderer/src/components/Shell/PageShell.tsx
  src/renderer/src/components/Shell/PageTabs.tsx
  src/renderer/src/components/Shell/SafetyStrip.tsx
  src/renderer/src/components/Shell/ChatInputBar.tsx
  src/renderer/src/components/Shell/MiniLampRow.tsx

caution:
  Tabs are navigation-only. No action must be triggered on tab click.
  SafetyStrip must always show; cannot be hidden by page state.
  ChatInputBar sends ONLY to local-chat-service. No external target.
```

---

## desktop.jsx → Desktop Operator View

```text
purpose:            Primary PC operator dashboard (1200px+)
contents:
  OperatorDesktop   left panel (lamps) + center (status) + right (quick actions)
  LampGrid          status lamp grid
  QuickActionPanel  copy-only quick action templates

implementation_target:
  src/renderer/src/screens/Operator/OperatorDesktopPage.tsx
  src/renderer/src/screens/Operator/LampGrid.tsx
  src/renderer/src/screens/Operator/QuickActionPanel.tsx

caution:
  Quick actions are copy-only. No automatic execution.
  All lamp values come from safe-snapshot-service only.
```

---

## mobile.jsx → Mobile Operator View

```text
purpose:            iPhone Private Console operator view (393px)
contents:
  OperatorMobile    compact lamp grid + safety strip + chat input

implementation_target:
  src/renderer/src/screens/Operator/OperatorMobilePage.tsx

caution:
  Touch targets ≥ 44px.
  Safe-area padding required (iOS notch).
  Read-only snapshot; no commands sent from mobile.
```

---

## pages-chat.jsx → Chat Page

```text
purpose:            Local conversation with しきしま
contents:
  ChatPage          message history + ChatInputBar
  MessageBubble     user / assistant message display

implementation_target:
  src/renderer/src/screens/Chat/ChatPage.tsx
  src/renderer/src/screens/Chat/MessageBubble.tsx

caution:
  Local chat only. Sends to local-chat-service.
  NO external API call. NO email/Slack/Discord.
  Safety note must always be visible on send.
```

---

## pages-suite.jsx → Outbox / Queue / GO / Evidence / STOP / Push

```text
purpose:            Operational page suite
contents:
  OutboxPage        draft-only display; approved_for_manual_copy items
  QueuePage         approval queue display (display-only)
  GoPage            GO template copy area (copy-only)
  EvidencePage      evidence list + copy
  StopPage          STOP history display
  PushPage          push-readiness display (never triggers push)

implementation_target:
  src/renderer/src/screens/Outbox/OutboxPage.tsx
  src/renderer/src/screens/Queue/QueuePage.tsx
  src/renderer/src/screens/Go/GoPage.tsx
  src/renderer/src/screens/Evidence/EvidencePage.tsx
  src/renderer/src/screens/Stop/StopPage.tsx
  src/renderer/src/screens/Push/PushPage.tsx

caution:
  Outbox: no send/create/pay buttons. Copy-only.
  Queue: display-only. Approve/Hold/Reject are copy-label actions only.
  GO: templates are copy-only. No automatic execution.
  Push: push-readiness display only. No git push from UI.
```

---

## stackchan.jsx → Desktop StackChan Control Room

```text
purpose:            StackChan status and face terminal (display-only)
contents:
  StackChanDesktop  connection status + face display + control area

implementation_target:
  src/renderer/src/screens/StackChan/StackChanDesktopPage.tsx

caution:
  Display-only. Physical operation remains HOLD.
  No voice/camera/mic activation from UI.
  Shows connection: not_arrived by default.
```

---

## stackchan-mobile.jsx → Mobile StackChan Control Room

```text
purpose:            Mobile StackChan status view
contents:
  StackChanMobile   compact status + connection indicator

implementation_target:
  src/renderer/src/screens/StackChan/StackChanMobilePage.tsx

caution:
  Same physical operation HOLD constraint as desktop.
```

---

## backend.jsx → Backend Service Contracts

```text
purpose:            3-layer architecture spec and service map
contents:
  Layer 1:  Renderer (React/Vite) — display, page switching, copy-only buttons
  Layer 2:  Preload (IPC bridge)  — window.shikishima.* API surface
  Layer 3:  Main (Electron)       — services, file system, IPC handlers

  Services:
    safe-snapshot-service          — current safety state snapshot
    local-chat-service             — local message history + send
    draft-outbox-service           — draft items (read + approve_for_manual_copy)
    approval-queue-service         — queue items (display only)
    evidence-service               — evidence records
    push-readiness-service         — push state (no push action)
    stackchan-status-service       — StackChan connection status
    stop-history-service           — STOP event history
    audit-incident-service         — audit classification records
    runtime-observation-status-service — runtime state (read-only)
    local-settings-service         — local preferences

implementation_target:
  src/main/ichikishima/           — existing service layer
  src/preload/                    — IPC API surface
  src/shared/ichikishima/         — shared type contracts

caution:
  Renderer must NEVER call Node.js APIs directly.
  All data must flow through preload IPC.
  Services must never trigger external writes.
```

---

## pages-final.jsx → Settings / Help / Onboarding

```text
purpose:            Local settings, help content, onboarding flow, IA map
contents:
  DesktopSettingsPage   language / theme / safety density / default page /
                         chat behavior / data freshness / toast / locked section
  HelpPage              safety policy summary + operational rules
  OnboardingFlow        first-run setup wizard

  Locked settings (never unlockable from UI):
    productionReady toggle — LOCKED
    execution enable toggle — LOCKED
    external write permissions — LOCKED
    StackChan physical operation — LOCKED
    voice/camera/mic — LOCKED

implementation_target:
  src/renderer/src/screens/Settings/SettingsPage.tsx
  src/renderer/src/screens/Help/HelpPage.tsx
  src/renderer/src/screens/Onboarding/OnboardingFlow.tsx

caution:
  Risky toggles must be visually LOCKED and non-interactive.
  Settings are local-device only; no cloud sync.
```

---

## pages-states.jsx → State Matrix / Empty-Loading-Error-Stale / Toasts

```text
purpose:            Full state coverage: per-service states, loading/error/stale,
                    toast notifications, command palette

contents:
  StateMatrix       per-page state combinations
  LoadingState      skeleton with last-known lamp values
  ErrorState        error with HOLD fallback
  StaleState        STALE badge + last-known values + refresh button
  EmptyState        no data yet
  ToastSystem       success / warning / hold / error toasts
  CommandPalette    copy-only quick-action palette

implementation_target:
  src/renderer/src/components/State/StateMatrix.tsx
  src/renderer/src/components/State/LoadingCard.tsx
  src/renderer/src/components/State/ErrorCard.tsx
  src/renderer/src/components/State/StaleCard.tsx
  src/renderer/src/components/State/EmptyCard.tsx
  src/renderer/src/components/Toast/ToastSystem.tsx
  src/renderer/src/components/CommandPalette/CommandPalette.tsx

caution:
  UNKNOWN / STALE / ERROR must always default to HOLD display.
  LoadingState must preserve last-known lamp values (not show blank).
  CommandPalette actions are copy-only; no execution.
```

---

## handoff.jsx → Design Tokens / A11y / Responsive / QA

```text
purpose:            Implementation spec: tokens, a11y rules, breakpoints, QA list
key_rules:
  A11y:
    lamps: color + code + text (never color alone)
    tap targets: ≥ 44px on iPhone
    contrast: WCAG AA
    focus rings: preserve
    safe-area: respect iOS safe-area padding
    stale: preserve last lamp value + STALE badge
  Responsive:
    393px:  iPhone 15 Pro primary
    1200px: Desktop operator
    1400px: Wide / Inspector
  QA checklist:
    safety strip visible on all pages
    all buttons copy-only or navigation
    no productionReady / execution toggles unlockable
    stale threshold triggers HOLD
    help page always accessible

implementation_target:
  applies to ALL components
```

---

## policy.jsx → State Lamps / Button Safety

```text
purpose:            Canonical lamp spec + button safety policy
key_rules:
  State lamps:
    always pair color + code + short phrase
    HOLD = amber / GO_READY = blue / PASS = green / STOP = red / REJECT = dark red
  Button safety:
    ALLOWED: copy, navigate, refresh-snapshot, local-settings, local-chat-send
    FORBIDDEN: git push, npm run dev, external write, enable execution,
               set productionReady, operate StackChan, enable voice/camera/mic
  Chat safety wording:
    "チャット送信のみ。外部送信・push・実行は行いません。"
```

---

この範囲では問題を検出していません。

# UI-14 Operator/Chat Mobile Layout Scope

## Purpose

Define the scope for P2-001 (Operator responsive layout) and P2-002
(Chat responsive layout) implementation.

Note: This scope document was created post-implementation for record.
The implementation (commit 5055b6d) was completed and pushed before this doc.
Scope reflects what was actually implemented.

---

## Current State at Implementation Time

```
origin/main before: 03361e8 (UI-13 evidence)
implementation commit: 5055b6d (feat: operator and chat responsive layout)
origin/main after: 5055b6d
```

---

## P2-001 — Operator Responsive Layout

### Problem

OperatorPage used a single-column layout for all screen widths.
Design specifies 3-column on desktop; no mobile adaptation beyond CSS var padding.

### Expected desktop behavior (≥900px)

- 2-column CSS grid: main content (1fr) + status sidebar (220px)
- Sidebar shows: decision badge, data source label, blocked-actions list
- Desktop experience improved without new components

### Expected mobile behavior (<900px)

- Single-column (cc-operator-main only; cc-operator-side hidden via CSS)
- CSS var padding: 12px 14px at ≤599px
- No layout overflow

### Safety constraints

- nextHumanAction display-only text (not a button)
- No "execute" or "push" button in the sidebar
- Sidebar blocked-actions list is text/strike-through only
- productionReady: false remains
- execution: disabled remains

---

## P2-002 — Chat Responsive Layout

### Problem

CommandChatPage was single-column for all widths.
Design specifies 3-column on desktop with left status panel.

### Expected desktop behavior (≥900px)

- 2-panel CSS flex: left status panel (200px) + main chat area (flex 1)
- Left panel shows: decision badge, message count, safety note
- Border-right separator between panels

### Expected mobile behavior (<900px)

- Single-column (cc-chat-status-panel hidden via CSS; cc-chat-main fills full width)
- Message list + input bar occupy full height
- STALE banner visible at top of chat area

### Safety constraints

- Left panel status is display-only
- Input area sends to local-chat-service only
- No external send button introduced
- No runtime/API/IPC connection introduced

---

## Not in Scope

```
- NextActionCard dedicated component (P2-004 — deferred)
- PageRightRail dedicated component (P2-005 — deferred)
- InactiveStamp component (P2-006 — deferred)
- productionReady change
- execution enablement
- external write
- StackChan physical
- voice/camera/mic
```

---

## Path Discrepancy Note

Night Task B specified incorrect paths:
```
SPECIFIED: src/renderer/src/screens/CommandCenter/pages/OperatorPage.tsx
ACTUAL:    src/renderer/src/screens/Operator/OperatorPage.tsx

SPECIFIED: src/renderer/src/screens/CommandCenter/pages/CommandChatPage.tsx
ACTUAL:    src/renderer/src/screens/CommandChat/CommandChatPage.tsx

SPECIFIED: src/renderer/src/screens/CommandCenter/command-center-tokens.css
ACTUAL:    src/renderer/src/assets/command-center-tokens.css
```

Implementation used actual paths. No safety impact.

---

_Created: 2026-05-18 (post-implementation record)_
_productionReady: false_
_execution: disabled_

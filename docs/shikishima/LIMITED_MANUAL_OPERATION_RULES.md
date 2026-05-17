# Limited Manual Operation Rules

## Allowed Actions

```
ALLOWED:
- Human navigates Command Center UI pages
- Human copies text from display (copy-only buttons)
- Human refreshes snapshot display (refresh-snapshot button)
- Human sends local chat messages (local-chat-service only)
- Human marks items as reviewed (local, no external write)
- Human adjusts local settings (language/theme/stale/toast)
- Human uses CommandPalette to navigate (navigation only)
```

## Forbidden Actions (must never occur in Limited Manual Operation)

```
FORBIDDEN:
- AI initiates any action without human instruction
- Human or AI sends email
- Human or AI creates calendar event
- Human or AI creates GitHub issue or PR
- Human or AI posts to social media
- Human or AI makes purchase or reservation
- Human or AI triggers git push from UI
- Human or AI activates StackChan physical operation
- Human or AI activates voice / camera / mic
- Any action with productionReady: true
- Any action with execution: enabled
- Any unsupervised background operation
```

## Human Approval Required Actions

```
REQUIRES EXPLICIT HUMAN GO:
- git push (separate explicit GO per push)
- productionReady change
- execution enablement
- external API write
- StackChan physical connection
- voice/camera/mic activation
- Installing or updating packages
- Running npm install / npm update
- Any action not listed as ALLOWED above
```

## Copy-Only Operations

```
These operations produce text only — no external side effects:
- Copy connection status (StackChan page)
- Copy push readiness summary
- Copy STOP event
- Copy evidence entry
- Copy draft text (for human to manually send elsewhere)
```

## Draft-Only Operations

```
Draft items must be reviewed by human before any external delivery:
- Draft outbox items: human reviews → human copies → human manually sends
- Draft outbox does NOT auto-send
- approval-queue items: display only, no auto-approve
```

## External Write Prohibition

```
External writes remain false in Limited Manual Operation.
External writes become allowed only if:
1. A dedicated external-write Gate is resolved
2. Human explicitly provides per-action GO
3. The specific external service and action are named in the GO

General permission does NOT cover external writes.
```

## Session Duration

```
Recommended maximum session duration: approved time_window only
No open-ended sessions
Each session starts with pre-run check
Each session ends with shutdown + port verification
```

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_

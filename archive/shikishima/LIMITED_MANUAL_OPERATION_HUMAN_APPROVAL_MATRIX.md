# Limited Manual Operation — Human Approval Matrix

## Matrix

| Action | Category | AI Can Initiate? | Human Approval Required? | GO Type |
|---|---|---|---|---|
| Navigate to page | navigate | NO (UI only) | No | — |
| Copy display text | copy-only | NO (UI only) | Human clicks | — |
| Refresh snapshot | refresh-snapshot | NO (UI only) | Human clicks | — |
| Send local chat | local-chat-send | NO (UI only) | Human types + sends | — |
| Mark item reviewed (local) | mark-reviewed-local | NO (UI only) | Human clicks | — |
| Adjust local settings | copy-only | NO (UI only) | Human adjusts | — |
| Open CommandPalette | navigate | NO (UI only) | Human presses Ctrl+K | — |
| git push | locked-requires-go | NO | YES — explicit per-push | Explicit push GO |
| productionReady change | locked-requires-go | NO | YES — Gate 005 + explicit | Gate resolution |
| execution enable | locked-requires-go | NO | YES — separate Gate | New Gate |
| External API write | locked-requires-go | NO | YES — per-service explicit | Explicit per-action |
| Email send | locked-requires-go | NO | YES | Explicit per-send |
| Calendar create | locked-requires-go | NO | YES | Explicit per-event |
| GitHub issue/PR | locked-requires-go | NO | YES | Explicit per-item |
| Social post | locked-requires-go | NO | YES | Explicit per-post |
| Purchase/payment | locked-requires-go | NO | YES | Explicit per-transaction |
| StackChan physical | locked-requires-go | NO | YES — separate Gate | Physical Gate |
| Voice activation | locked-requires-go | NO | YES — separate Gate | Voice Gate |
| Camera activation | locked-requires-go | NO | YES — separate Gate | Camera Gate |
| Mic activation | locked-requires-go | NO | YES — separate Gate | Mic Gate |
| npm install | locked-requires-go | NO | YES — explicit | Explicit package GO |
| Source file modification | locked-requires-go | NO | YES — explicit with scope | Explicit impl GO |

## Approval Categories Explained

| Category | Meaning |
|---|---|
| copy-only | Human clicks a copy button. AI does not initiate. |
| navigate | Human navigates via PageTabs or CommandPalette. |
| refresh-snapshot | Human clicks refresh. AI does not auto-refresh. |
| local-chat-send | Human types and sends. Goes only to local service. |
| mark-reviewed-local | Human marks item. Local state only. |
| locked-requires-go | Requires explicit GO statement from human. AI blocked. |
| forbidden | Never allowed under any condition in Limited Manual Operation. |

## GO Statement Format

For locked actions, the human provides:

```
I approve [action].
Target:   [exact target]
Scope:    [exact scope]
Date:     [YYYY-MM-DD]
```

General permission does NOT unlock locked actions.
"You can proceed" does NOT unlock locked actions.
The action name + target + scope must be explicit.

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_

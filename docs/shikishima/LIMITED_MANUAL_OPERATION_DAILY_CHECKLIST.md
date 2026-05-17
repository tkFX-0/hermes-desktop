# Limited Manual Operation Daily Checklist

## Before Each Session

```
[ ] git branch: main
[ ] git HEAD == origin/main
[ ] git commits_ahead: 0
[ ] git staged: 0
[ ] git tracked_dirty: 0
[ ] Port 3030: closed
[ ] No modified source files
[ ] Human GO with time_window: received
[ ] LIMITED_MANUAL_OPERATION_RULES.md: reviewed
```

## Session Start

```
[ ] Run: npm run dev (approved command)
[ ] Electron window opens
[ ] SafetyStrip visible: productionReady false, execution disabled
[ ] HOLD state confirmed (or appropriate state if live data available)
[ ] No raw values visible (path/IP/token/key)
```

## During Session

```
[ ] All actions are human-initiated
[ ] No AI-initiated sends/creates/pushes
[ ] No external write actions performed
[ ] StackChan physical: false confirmed
[ ] Voice/camera/mic: false confirmed
[ ] Every copy action: human decision only
[ ] Every draft review: human reads before copy
```

## Session End

```
[ ] Shutdown initiated by human (Ctrl+C)
[ ] Process exited cleanly
[ ] Port 3030: closed (verify)
[ ] git status: no new tracked dirty files
[ ] Any session log: gitignored
[ ] Evidence notes: recorded for review
```

## Weekly Review (if conducting regular sessions)

```
[ ] Review all STOP events from week
[ ] Review copy/draft actions taken
[ ] Review any caveats noted
[ ] Confirm productionReady still false
[ ] Confirm execution still disabled
[ ] Confirm no external writes occurred
[ ] Human signs off on weekly summary
```

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_

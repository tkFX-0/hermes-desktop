# UI-11 Runtime Observation Checklist

## Purpose

Operator checklist for a controlled Command Center UI runtime observation.
Complete all items before, during, and after observation.

---

## PRE-RUN (before `npm run dev`)

### Git State

```
[ ] git branch --show-current → main
[ ] git rev-parse HEAD == git rev-parse origin/main
[ ] git rev-list --count origin/main..HEAD → 0
[ ] git status --short → only untracked gitignored items, no staged/modified tracked files
```

### Port Check

```
[ ] Port 3030 closed before start
    Windows: netstat -ano | findstr :3030 → no result
    Confirm: no previous runtime session left a dangling process
```

### File State

```
[ ] No modified source files (.ts / .tsx / .css)
[ ] No .env changes since last PASS commit
[ ] No package.json or package-lock.json modifications
```

### Time Check

```
[ ] Current time is within approved time_window
[ ] Human GO with time_window has been received
```

---

## RUNTIME (while `npm run dev` is running)

### App Start

```
[ ] Electron window opens without crash
[ ] SafetyStrip visible at top of Command Center
[ ] SafetyStrip shows: productionReady: false
[ ] SafetyStrip shows: execution: disabled
[ ] SafetyStrip shows decision (HOLD expected when no live data)
[ ] PageTabs visible with all 12 tabs
```

### Operator Page

```
[ ] Operator page renders without error
[ ] LampGrid shows lamps (HOLD state expected)
[ ] No raw token/IP/path visible
```

### Chat Page

```
[ ] Chat page renders
[ ] Safety note visible ("チャット送信のみ。外部送信・push・実行は行いません。")
[ ] No external send button active
```

### StackChan Page

```
[ ] StackChan page renders
[ ] physicalOperation: false visible
[ ] voiceActive: false visible
[ ] cameraActive: false visible
[ ] micActive: false visible
[ ] HOLD banner visible
```

### Outbox Page

```
[ ] Outbox page renders
[ ] externalWrite: false visible or confirmed in display
[ ] No "Send" button active
```

### Queue Page

```
[ ] Queue page renders
[ ] displayOnly: true behavior confirmed
[ ] No "Approve" / "Execute" button active
```

### GO Page

```
[ ] GO page renders
[ ] Display-only confirmed
[ ] No push button active
```

### Evidence Page

```
[ ] Evidence page renders
[ ] Copy-only actions only
```

### Stop Page

```
[ ] Stop page renders
[ ] Nominal or STOP events shown (no crash)
```

### Push Page

```
[ ] Push page renders
[ ] Safety note visible ("pushはClaudeCodeのGOから行います")
[ ] No push button active
```

### Settings Page

```
[ ] Settings page renders
[ ] Interactive settings functional (language/theme/stale/toast)
[ ] Locked capabilities section visible
[ ] All 5 locked items show lock icon + disabled state
```

### Help Page

```
[ ] Help page renders
[ ] Safety invariants table visible
[ ] Gate progress table visible
[ ] HOLD capabilities list visible
```

### Global Checks

```
[ ] No raw Windows path visible anywhere
[ ] No LAN IP visible anywhere (192.168.x.x)
[ ] No API key / token visible anywhere
[ ] No "Send" / "Create" / "Push" / "Pay" / "Reserve" button clickable
[ ] No external write action available
```

### iPhone Observation (if approved in GO)

```
[ ] iPhone observation URL not present in any public log
[ ] iPhone console shows only sanitized display values
[ ] No raw token/IP/path visible on iPhone
[ ] HOLD state visible on iPhone
```

---

## SHUTDOWN

```
[ ] Pressed Ctrl+C in terminal
[ ] Process exited cleanly (exit code 0 or graceful)
[ ] Shutdown time recorded
```

## POST-SHUTDOWN

```
[ ] Port 3030 closed: netstat -ano | findstr :3030 → no result
[ ] git status --short: no new tracked dirty files
[ ] git status --short: no staged files
[ ] Untracked log files: expected and gitignored only
```

---

## Result Summary

```
observation_result: PASS / PASS_WITH_CAVEAT / STOP
stop_triggered: yes / no
stop_reason: (if yes)
caveats: (if PASS_WITH_CAVEAT)
```

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_

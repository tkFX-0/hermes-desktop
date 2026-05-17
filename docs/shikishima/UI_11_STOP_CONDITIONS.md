# UI-11 STOP Conditions

## Purpose

Define the conditions under which a controlled runtime observation must be
stopped immediately. Applies to all UI-11 and subsequent runtime sessions.

---

## STOP Immediately If Any of the Following Occurs

### Raw Value Exposure

```
STOP if:
- A raw Windows file path appears in the UI (e.g. C:\Users\...\)
- A LAN IP address appears in the UI (e.g. 192.168.x.x)
- An API key or secret appears in the UI (e.g. sk-..., Bearer ...)
- A raw pairing token appears in the UI
- A raw device identifier appears in the UI
- Any value appears that would identify the local environment
```

### Safety Invariant Violation

```
STOP if:
- productionReady: true appears anywhere in the UI
- execution: enabled appears anywhere
- Any button labeled "Send", "Create", "Push", "Pay", "Reserve" is active and functional
- Any external write action appears to have succeeded
- A "connected" state appears for StackChan with physical operation enabled
- Voice output appears to be active
- Camera appears to be active
- Microphone appears to be active
```

### Runtime Behavior

```
STOP if:
- The runtime cannot be stopped via Ctrl+C within 30 seconds
- Port 3030 remains open after shutdown
- The runtime causes a tracked file to become dirty (git tracked file modified)
- The runtime causes a staged change
- The runtime installs packages without explicit GO
- The runtime opens an external network connection beyond local LAN
- The runtime creates new external git commits or pushes
- The runtime triggers a UI alert indicating safety violation
```

### Unexpected State

```
STOP if:
- Any crash or panic reveals raw values in error output displayed to user
- IPC error messages expose file paths, tokens, or environment details
- The process cannot be identified (unknown PID on port 3030)
- Multiple instances of the runtime appear
```

---

## Immediate STOP Procedure

```
1. Press Ctrl+C immediately
2. If Ctrl+C does not work within 10 seconds:
   Windows: taskkill /F /IM electron.exe
   or: taskkill /F /IM node.exe
3. Verify port 3030 closed
4. Run: git status --short
5. If any tracked file is dirty: do NOT commit; report to human
6. Record stop time and trigger
7. Create docs/shikishima/UI_11_RUNTIME_OBSERVATION_STOP_RECORD.md
8. Do NOT push without human review
```

---

## Post-STOP Required Actions

```
[ ] Runtime process confirmed stopped
[ ] Port 3030 confirmed closed
[ ] git status: record exact dirty files (do not commit automatically)
[ ] Document: what was seen, when STOP was triggered, what condition was violated
[ ] Await human GO before any further action
```

---

## STOP Record File Format

If STOP is triggered, create:

```
docs/shikishima/UI_11_RUNTIME_OBSERVATION_STOP_RECORD.md
```

Contents:
```
date:           [YYYY-MM-DD]
time:           [HH:MM JST]
trigger:        [exact condition that triggered STOP]
stop_method:    Ctrl+C / taskkill
process_stopped: yes / no
port_3030_after: closed / open
git_dirty_files: [list or NONE]
raw_values_seen: [description or NONE]
next_action:    await human review
```

---

## Not a STOP Condition

The following do NOT trigger STOP:

```
- STALE badge visible in SafetyStrip (expected when no live data)
- HOLD state shown on any page (expected)
- Empty state on Outbox/Queue/Evidence/Stop (expected)
- Port 3030 is open during normal runtime (expected)
- App shows a loading skeleton (expected before IPC responds)
```

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_

# UI-11 Runtime Observation GO Draft

## Status

**DRAFT — NOT YET APPROVED**

This document is a GO template only.
It is not runtime approval until a human fills in all placeholders and
explicitly issues GO with time_window.

---

## GO Statement Template

```
I approve controlled runtime observation.
Date:         [YYYY-MM-DD]
time_window:  [HH:MM-HH:MM JST]
Approved command: npm run dev
Observation scope: Command Center UI pages (see allowed list below)
Shutdown method: Ctrl+C in terminal, then port verification
Push: NOT approved in this GO
```

---

## Pre-Run Checks (to complete before starting runtime)

```
[ ] git branch: main
[ ] git HEAD == origin/main
[ ] commits_ahead: 0
[ ] staged: 0
[ ] tracked_dirty: 0
[ ] port 3030: closed (verify with: netstat -ano | findstr 3030 or equivalent)
[ ] Electron renderer entry point not modified since last PASS
[ ] No untracked local .env or secrets files
[ ] Time is within approved time_window
```

---

## Approved Command

```
npm run dev
```

Do not substitute the command.
Do not add flags.
Do not modify environment variables before running.

---

## Observation Scope (Allowed Pages)

```
[ ] Operator page — lamp grid, safety strip visible
[ ] Chat page — input bar, safety note visible
[ ] StackChan page — connection status, HOLD invariants visible
[ ] Outbox page — draft list or empty state visible
[ ] Queue page — approval queue or empty state visible
[ ] GO page — GO decision panel visible
[ ] Evidence page — evidence log or empty state visible
[ ] Stop page — STOP events or nominal state visible
[ ] Push page — push readiness visible
[ ] Settings page — language/theme/stale/toast controls, locked capabilities
[ ] Help page — safety policy reference visible
[ ] Onboarding flow — if accessible
```

---

## Observation Checklist

For each observed page, confirm:

```
[ ] SafetyStrip visible at top
[ ] productionReady: false visible in SafetyStrip
[ ] execution: disabled visible in SafetyStrip
[ ] HOLD fallback visible where data is unavailable
[ ] No raw Windows path visible (e.g. C:\Users\...)
[ ] No LAN IP visible (e.g. 192.168.x.x)
[ ] No API key visible (e.g. sk-...)
[ ] No raw token visible
[ ] No "Send" / "Create" / "Push" / "Pay" / "Reserve" button active
[ ] No external write action available
[ ] StackChan physicalOperation: false visible
[ ] StackChan voiceActive: false visible
[ ] StackChan cameraActive: false visible
[ ] StackChan micActive: false visible
```

---

## Forbidden During Observation

```
- Clicking any action labeled send / push / create / pay / reserve
- Enabling any locked setting
- Modifying any source file during runtime
- Committing during runtime (commit only after shutdown + STOP conditions clear)
- Installing packages
- Opening external browser or external URL
- Connecting real StackChan hardware
- Activating voice/camera/mic
```

---

## Shutdown Procedure

```
1. Press Ctrl+C in the terminal running npm run dev
2. Wait for process to exit cleanly
3. Verify: netstat -ano | findstr :3030 (or equivalent) → no result
4. Verify: git status --short → no tracked_dirty from runtime
5. Record shutdown time
```

---

## Post-Run Checks

```
[ ] Process exited cleanly
[ ] Port 3030 closed
[ ] git status: no new tracked dirty files
[ ] git status: no staged changes
[ ] Any new .log or .tmp files are gitignored or expected
```

---

## Evidence File Path

```
docs/shikishima/UI_11_RUNTIME_OBSERVATION_EVIDENCE.md
```

---

## Push Approval

Push of runtime evidence is **NOT included** in this GO.
A separate push GO is required after evidence is recorded.

---

## Prohibited Values in Reports

Do not include in any evidence doc or chat:
- Raw LAN IP address
- Raw device pairing token
- Raw Windows file path
- API key or secret value
- Device identifier

Use `[REDACTED]` for any such value.

---

_Created: 2026-05-17_
_Status: DRAFT — not GO_
_productionReady: false_
_execution: disabled_

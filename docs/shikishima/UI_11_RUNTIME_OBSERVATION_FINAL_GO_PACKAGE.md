# UI-11 Runtime Observation Final GO Package

## Status

**PENDING HUMAN APPROVAL**

This package defines the exact conditions for a controlled runtime observation.
It becomes GO only when a human explicitly fills in the time_window and
issues the approval statement below.

---

## Candidate Command

```
npm run dev
```

This command starts the Electron + Vite development server for the Command
Center UI. No other command is approved.

Do not substitute with:
- `npm start`
- `npx electron .`
- `npm run start`
- any command with modified env vars or flags

---

## Time Window Placeholder

```
Date:        [YYYY-MM-DD] — to be provided by human
time_window: [HH:MM-HH:MM JST] — to be provided by human
```

The AI (ClaudeCode) must NOT choose the time_window.
The human must provide the exact time window before the observation starts.

---

## Pre-Run Check List

All must pass before starting runtime:

```
[ ] git branch: main
[ ] git HEAD == origin/main
[ ] git commits_ahead: 0
[ ] git staged: 0
[ ] git tracked_dirty: 0
[ ] port 3030: closed
    Windows check: netstat -ano | findstr :3030
    Expected: no output
[ ] Time: within approved time_window
[ ] Human GO: received with date + time_window + this package reviewed
```

---

## Allowed Observation Scope

Only the pages listed below may be navigated:

```
1.  Operator       — lamp grid, safety strip
2.  Chat           — local chat, safety note
3.  StackChan      — connection status, HOLD invariants
4.  Outbox         — draft list / empty state
5.  Queue          — approval queue / empty state
6.  GO             — GO decision panel
7.  Evidence       — evidence log / empty state
8.  Stop           — STOP events / nominal
9.  Push           — push readiness
10. Settings       — preferences, locked capabilities
11. Help           — safety policy reference
12. Onboarding     — first-run wizard
```

---

## Required Observations Per Page

For each page, confirm visible:

```
- SafetyStrip: productionReady false, execution disabled
- HOLD fallback (when no live data)
- No raw Windows path / LAN IP / API key / token
- No active "Send" / "Push" / "Create" / "Pay" / "Reserve" button
- No external write action reachable
```

Additional per StackChan page:
```
- physicalOperation: false
- voiceActive: false
- cameraActive: false
- micActive: false
```

---

## Forbidden During Observation

```
- Clicking any action labeled send / push / create / pay / reserve
- Enabling any locked setting
- Modifying any source file while runtime is active
- Committing while runtime is active
- Installing packages
- Accessing external URLs or services
- Connecting physical StackChan hardware
- Activating voice / camera / mic
- Leaving port 3030 open after observation ends
```

---

## STOP Conditions

See `UI_11_STOP_CONDITIONS.md` for full list. Summary:

```
STOP immediately if:
- Raw Windows path / LAN IP / API key / token appears in UI
- productionReady: true appears
- execution: enabled appears
- Any external action button is active
- Runtime cannot be stopped within 30 seconds
- Port 3030 remains open after shutdown attempt
- Tracked git file becomes dirty during runtime
```

---

## Shutdown Method

```
1. Press Ctrl+C in the terminal running npm run dev
2. Wait for process to exit (max 30 seconds)
3. If unresponsive: taskkill /F /IM electron.exe (Windows)
4. Verify: netstat -ano | findstr :3030 → no output
5. Verify: git status --short → no tracked dirty files
6. Record shutdown time
```

---

## iPhone Observation

iPhone observation is optional and requires a separate GO field:

```
iPhone observation: [ ] approved / [ ] not approved
If not approved: do not expose any URL or connection info
```

---

## Evidence File

Evidence to be recorded in:

```
docs/shikishima/UI_11_RUNTIME_OBSERVATION_EVIDENCE.md
```

Using template from:

```
docs/shikishima/UI_11_RUNTIME_OBSERVATION_EVIDENCE_TEMPLATE.md
```

No raw values in the evidence file.

---

## Push Scope

**Push of runtime evidence is NOT included in this GO.**

A separate push GO is required after:
1. Runtime is fully shut down
2. Evidence is recorded
3. STOP conditions are all clear
4. Human reviews evidence

---

## Human GO Statement to Fill

When ready to approve, the human should provide:

```
I approve controlled runtime observation.
Date:             YYYY-MM-DD
time_window:      HH:MM-HH:MM JST
approved command: npm run dev
observation scope: all 12 Command Center pages
iPhone approved:  yes / no
shutdown method:  Ctrl+C
```

Until this statement is provided, runtime observation must not start.

---

## Reference Documents

- `UI_11_CONTROLLED_RUNTIME_OBSERVATION_READINESS.md`
- `UI_11_RUNTIME_OBSERVATION_CHECKLIST.md`
- `UI_11_STOP_CONDITIONS.md`
- `UI_11_RUNTIME_OBSERVATION_EVIDENCE_TEMPLATE.md`

---

_Created: 2026-05-17_
_Status: PENDING — not GO_
_productionReady: false_
_execution: disabled_

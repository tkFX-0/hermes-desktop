# UI-11 Runtime Observation Evidence

## Observation Result

```
status: PASS_WITH_CAVEAT
date:   2026-05-18
time_window: 00:37-01:00 JST
```

---

## Pre-Run State

```
branch:          main
head:            6f76a94 (== origin/main)
commits_ahead:   0
staged:          0
tracked_dirty:   0
port_3030_before: closed — no netstat output
```

---

## Runtime

```
command_used:  npm run dev
started:       yes
crash:         none
vite_port:     5173 (localhost only)
port_3030:     never opened
```

### Console Log Summary

```
[OK]  preload scripts built successfully
[OK]  Vite dev server running at http://localhost:5173/
[OK]  Electron started
[OK]  i18next initialized
[CSP] Research.tsx → localhost:8765 blocked (correct CSP behavior)
[CSP] iframe localhost:8765 blocked (correct CSP behavior)
[NO CRASH]
```

The CSP blocks are from the existing Research page attempting to connect to
the local Hermes backend. These are expected, correct behavior, and unrelated
to Command Center UI.

---

## Page Observations

```
Operator:    N/A — not wired into current app navigation
Chat:        N/A — not wired
StackChan:   N/A — not wired
Outbox:      N/A — not wired
Queue:       N/A — not wired
GO:          N/A — not wired
Evidence:    N/A — not wired
STOP:        N/A — not wired
Push:        N/A — not wired
Inspector:   N/A — not wired
Settings:    N/A — not wired
Help:        N/A — not wired
```

**Observed UI:** existing Hermes app (Layout.tsx with old navigation)
**Expected UI:** PageShell + SafetyStrip + 12 Command Center pages

---

## CAVEAT-01

```
id:                   CAVEAT-01
summary:              New Command Center UI implemented but not wired into runtime entry

observed_ui:          existing Hermes navigation (Chat / Sessions / Agents / ... / Control Center)
expected_ui:          PageShell + SafetyStrip + PageTabs + 12 new Command Center pages

components_exist:     yes — all 12 pages compile and typecheck (806 tests pass)
components_accessible: no — Layout.tsx / App.tsx do not route to new pages

suspected_cause:
  Layout.tsx View type does not include new Command Center PageId values.
  No import of PageShell, OperatorPage, CommandChatPage, etc. in Layout.tsx.
  ControlCenterAppShell (old snapshot view) remains the "controlCenter" route.

safety_violation:     false
  - productionReady remained false at all times
  - execution remained disabled at all times
  - no raw values appeared
  - no external actions were accessible

implementation_gap:   true
  - wiring between new Command Center components and app router is missing

requires_fix_before_next_runtime_observation: true
  - fix target: Layout.tsx routing + imports
  - fix scope: UI-12 wiring task (separate GO required)
```

---

## Raw Values Check

```
windows_path_visible: no
lan_ip_visible:       no
api_key_visible:      no
raw_token_visible:    no
```

---

## External Action Check

```
external_write_triggered:      no
email_sent:                    no
calendar_created:              no
github_action_taken:           no
social_posted:                 no
payment_made:                  no
stackchan_physical_triggered:  no
voice_activated:               no
camera_activated:              no
mic_activated:                 no
```

---

## Shutdown Record

```
shutdown_method:  taskkill /F /IM electron.exe (Ctrl+C equivalent — background process)
processes_stopped: 4 electron PIDs terminated
node_processes:   0 remaining
port_3030_after:  closed — no netstat output
port_5173_after:  TIME_WAIT only (TCP teardown — processes gone)
git_status_after: clean — staged: 0, tracked_dirty: 0
```

---

## Safety Invariant Confirmation

```
productionReady:              false — confirmed
execution:                    disabled — confirmed
rawValuesReported:            false — confirmed
externalWrite:                false — confirmed
physicalOperation (StackChan): false — confirmed
voiceActive:                  false — confirmed
cameraActive:                 false — confirmed
micActive:                    false — confirmed
```

---

## STOP Conditions

```
stop_triggered: no
raw_value_exposure: no
safety_invariant_violation: no
runtime_unstoppable: no
port_open_after_shutdown: no
git_dirty_from_runtime: no
```

---

## Final Decision

```
observation_result: PASS_WITH_CAVEAT

PASS because:
  - App starts without crash
  - No STOP conditions triggered
  - No raw values exposed
  - No safety invariant violated
  - Clean shutdown confirmed
  - git clean after shutdown

CAVEAT-01 because:
  - New Command Center pages (UI-05〜UI-10) not reachable from running app
  - Wiring gap in Layout.tsx / app routing
  - Must be resolved before repeating runtime observation for new pages
```

---

## Next Actions

```
1. Task 16: push this evidence (separate push GO)
2. Task 17: post-runtime hardening review
3. Task 18: UI-12 scope — include Layout.tsx wiring as primary item
4. Task 19: UI-12 implementation (separate GO with time_window)
5. Task 20: push UI-12
6. New runtime observation GO (separate GO, new time_window)
```

---

_Recorded: 2026-05-18_
_productionReady: false_
_execution: disabled_
_rawValuesReported: false_

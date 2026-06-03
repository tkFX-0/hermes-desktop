# UI-11 Runtime Observation Evidence Template

## Purpose

Fill in this template after completing a controlled runtime observation.
Do not include raw LAN IPs, tokens, Windows paths, device identifiers,
or API keys. Use `[REDACTED]` for any such value.

---

## Observation Metadata

```
date:            [YYYY-MM-DD]
time_window:     [HH:MM-HH:MM JST]
command_used:    npm run dev
observer:        human / ClaudeCode / both
evidence_author: ClaudeCode + human review
```

---

## Pre-Run State

```
branch:          main
head:            [commit hash]
origin_main:     [commit hash]
commits_ahead:   0
staged:          0
tracked_dirty:   0
port_3030_before: closed
```

---

## Pages Observed

```
[ ] Operator
[ ] Chat
[ ] StackChan
[ ] Outbox
[ ] Queue
[ ] GO
[ ] Evidence
[ ] Stop
[ ] Push
[ ] Settings
[ ] Help
[ ] Onboarding
```

---

## Desktop Observation Result

### SafetyStrip

```
visible:              yes / no
productionReady_shown: false
execution_shown:      disabled
decision_shown:       [HOLD / GO_READY / PASS / STOP]
stale_badge_shown:    yes / no (if no live data)
```

### Per-Page Summary

```
Operator:   [PASS / FAIL / N/A] — notes:
Chat:       [PASS / FAIL / N/A] — notes:
StackChan:  [PASS / FAIL / N/A] — notes:
Outbox:     [PASS / FAIL / N/A] — notes:
Queue:      [PASS / FAIL / N/A] — notes:
GO:         [PASS / FAIL / N/A] — notes:
Evidence:   [PASS / FAIL / N/A] — notes:
Stop:       [PASS / FAIL / N/A] — notes:
Push:       [PASS / FAIL / N/A] — notes:
Settings:   [PASS / FAIL / N/A] — notes:
Help:       [PASS / FAIL / N/A] — notes:
Onboarding: [PASS / FAIL / N/A] — notes:
```

---

## iPhone Observation Result (if approved)

```
approved:                 yes / no
url_in_evidence:          [REDACTED] or N/A
observation_performed:    yes / no
hold_visible:             yes / no
raw_values_exposed:       yes / no
notes:
```

---

## Screenshot Summary

```
screenshots_taken:        yes / no
screenshots_redacted:     yes / no
raw_values_in_screenshots: yes / no
screenshot_notes:
```

---

## Raw Values Check

```
windows_path_visible:   yes / no
lan_ip_visible:         yes / no
api_key_visible:        yes / no
raw_token_visible:      yes / no
```

If any of the above is `yes` → this observation is **STOP**, not PASS.

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
shutdown_method:    Ctrl+C
shutdown_time:      [HH:MM JST]
process_exited:     yes / no
exit_code:          [0 or value]
port_3030_after:    closed / open
git_status_after:   clean / dirty
dirty_files:        (if dirty — list or [NONE])
```

---

## STOP Conditions Summary

```
stop_triggered:   yes / no
stop_reason:      (if yes)
stop_time:        (if yes)
recovery_action:  (if yes)
```

---

## Final Observation Decision

```
observation_result: PASS / PASS_WITH_CAVEAT / STOP
caveats:           (if PASS_WITH_CAVEAT)
blocking_items:    (if STOP)
```

---

## Safety Invariant Confirmation

```
productionReady:   false — confirmed
execution:         disabled — confirmed
rawValuesReported: false — confirmed
externalWrite:     false — confirmed
physicalOperation: false — confirmed
voiceActive:       false — confirmed
cameraActive:      false — confirmed
micActive:         false — confirmed
```

---

## Next Required Human Action

```
next_action: (push evidence GO / hardening review / STOP resolution)
```

---

_Template created: 2026-05-17_
_productionReady: false_
_execution: disabled_

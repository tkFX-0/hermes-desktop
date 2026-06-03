# StackChan Display Pilot Evidence Template

Date: ___________
Rally: StackChan Display Pilot (future — fill when executed)

---

## Result

```text
status: PASS | PASS_WITH_CAVEAT | HOLD | STOP
```

---

## Baseline

```text
origin/main:
local_HEAD:
display_pilot_go: (macro name / date only; not a secret)
time_window_start:
time_window_end:
human_present: true | false
manual_stop_method_confirmed: true | false
```

---

## Intended Display State

```text
requested_display_intent: (StackChanDisplayIntent enum)
expected_label:
expected_face_mood:
expected_message:
display_only: true
```

---

## Human Observation

```text
StackChan_power_state: on | off | unknown
screen_visible: true | false | unknown
displayed_state_visible: true | false | unknown
expected_state_matched: true | false | unknown
unexpected_motion_visible: true | false
unexpected_voice_visible: true | false
error_visible_redacted: true | false
error_summary: (no raw paths or secrets)
```

---

## Safety

```text
stackchan_connection_command_scope: none | read-only_display_only (as declared in GO)
serial_connected: false
firmware_write: false
firmware_erase: false
flash_operation: false
motion_command_sent: false
dance_command_sent: false
touch_behavior_changed: false
voice_enabled: false
mic_enabled: false
camera_enabled: false
autonomous_control_enabled: false
Discord_send: false
token_read: false
network_call: false
external_API_write: false
productionReady: false
execution: disabled
rawValuesReported: false
```

---

## Caveats

```text
...
```

---

## Next Action

```text
- PASS: display-only pilot may repeat only with new explicit GO
- PASS_WITH_CAVEAT: resolve caveat before repeat
- HOLD: revise readiness or baseline
- STOP: halt all StackChan pilot work; document in STACKCHAN_STOP_CONDITIONS.md
```

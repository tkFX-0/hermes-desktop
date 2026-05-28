# StackChan Display Pilot Retry Evidence

Date: 2026-05-28
Rally: 4B — One-shot Display Pilot Retry

---

## Result

```text
status: PASS_WITH_CAVEAT
reason: guarded one-shot send succeeded in Cursor; human visual confirmation pending for full PASS
next_action: confirm displayed_state_visible; then Rally 5 Acceptance
```

---

## Attempt 1 (12:00–13:00 JST window)

### Approved Time Window

```text
START: 2026-05-28 12:00 JST
END:   2026-05-28 13:00 JST
preflight_jst_at_attempt: 2026-05-28 12:42 (within window)
```

---

## Selected Intent

```text
selected_intent: STACKCHAN_BASELINE_PASS
resolved_face_mode: happy
intent_allowed: true
expected_meaning: StackChan baseline is PASS. Active control remains HOLD.
```

---

## Pre-run

```text
origin/main: db8d73b
local HEAD: db8d73b
human_present: true
manual_stop_method_confirmed: true
screen_visible: true
time_window_active: true
one_shot_only_confirmed: true
selected_intent_allowed: true
guarded_route_available: true
STACKCHAN_DISPLAY_PILOT_SEND: 1
transportMode: guarded-ws
actualDeviceSendEnabled: true
```

---

## Pilot

```text
display_pilot_attempted: true
requested_display_intent: STACKCHAN_BASELINE_PASS
resolved_face_mode: happy
displayed_state_visible: false
expected_state_matched: unknown
unexpected_motion_visible: false
unexpected_voice_visible: false
error_visible_redacted: true
manual_stop_used: false
pilot_stopped_cleanly: true
send_result_ok: false
send_result_sent: false
websocket_send_performed: false
failure_reason_redacted: ws_connect_error
```

No automatic retry performed.

---

## Attempt 2 (14:35–15:00 JST GO — retry)

### Approved Time Window

```text
START: 2026-05-28 14:35 JST
END:   2026-05-28 15:00 JST
preflight_jst_at_attempt: 2026-05-28 14:35 (within window)
```

### Human reachability (attested)

```text
StackChan_power_state: on
StackChan_screen_visible: true
same_lan_redacted: true
local_host_value_configured: true
display_endpoint_reachable_redacted: true
ws_connect_possible_redacted: true
manual_stop_method_confirmed: true
```

### Composer execution environment

```text
local_host_value_configured_in_composer_terminal: false
display_pilot_attempted: true
send_result_ok: false
send_result_sent: false
websocket_send_performed: false
failure_reason_redacted: ws_connect_error
displayed_state_visible: unknown
```

Operator PC must run the one-shot send where host env is configured. No second automatic send from Composer.

---

## Attempt 3 (14:35–15:00 JST — Cursor execution with .env.local load)

### Execution

```text
preflight_jst_at_attempt: 2026-05-28 14:50 (within window)
env_local_present: true
local_host_value_configured_in_composer_terminal: true (via .env.local load; values not recorded)
display_pilot_attempted: true
send_result_ok: true
send_result_sent: true
websocket_send_performed: true
resolved_face_mode: happy
failure_reason_redacted: none
one_shot_only: true
second_send_attempted: false
```

### Human observation (pending)

```text
displayed_state_visible: unknown
expected_state_matched: unknown
unexpected_motion_visible: false
unexpected_voice_visible: false
manual_stop_used: false
pilot_stopped_cleanly: true
```

If human confirms face showed baseline-pass mood (happy) without motion/voice:

```text
status may be upgraded to PASS
```

---

## Safety

```text
one_shot_only: true
retry_loop: false
motion_command_sent: false
dance_command_sent: false
touch_behavior_changed: false
firmware_write: false
firmware_erase: false
serial_flash: false
voice_enabled: false
mic_enabled: false
camera_enabled: false
autonomous_control_enabled: false
Discord_send: false
token_reported: false
external_API_write: false
productionReady: false
execution: disabled
rawValuesReported: false
Active_control: HOLD
```

---

## Classification

```text
result: PASS_WITH_CAVEAT
reason: one-shot guarded face_mode send ok; visual match not yet confirmed by human enum
next_action: /goalmacro shikishima.stackchan-display-only-operation-acceptance (after visual confirm)
```

---

## Next

```text
Human: confirm displayed_state_visible + expected_state_matched (enum only)
Then: /goalmacro shikishima.stackchan-display-only-operation-acceptance
```

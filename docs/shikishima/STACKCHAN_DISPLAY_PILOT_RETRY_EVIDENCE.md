# StackChan Display Pilot Retry Evidence

Date: 2026-05-28
Rally: 4B — One-shot Display Pilot Retry

---

## Result

```text
status: HOLD
reason: one_shot_guarded_send_failed_safely
next_action: verify StackChan powered on and reachable; retry only with new time-window GO
```

---

## Approved Time Window

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
result: HOLD
reason: guarded send attempted once; WebSocket connection failed; display not confirmed visible
next_action: /goalmacro shikishima.stackchan-display-pilot-debug-plan
```

---

## Next

Human may retry only after:

```text
- StackChan powered on and screen visible
- network path to device confirmed (no raw values in docs)
- new explicit time-window GO for one-shot retry
```

If PASS on future retry:

```text
/goalmacro shikishima.stackchan-display-only-operation-acceptance
```

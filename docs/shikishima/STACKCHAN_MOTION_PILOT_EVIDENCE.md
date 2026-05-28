# StackChan Motion Pilot Evidence

Date: 2026-05-28

---

## Result

```text
status: PASS
reason: guarded one-shot move send ok; human visual PASS (operator GO)
```

---

## Execution

```text
intent: STACKCHAN_MOTION_CENTER
preset_action: center
STACKCHAN_MOTION_PILOT_SEND: 1
transportMode: guarded-ws
send_result_ok: true
send_result_sent: true
websocket_send_performed: true
one_shot_only: true
second_send_attempted: false
failure_reason_redacted: none
```

---

## Human observation

```text
observation_window: 2026-05-28 16:40–17:00 JST
human_visual_go_received: true
motion_human_visual: PASS
motion_visible: true
expected_motion_matched: true
unexpected_behavior_visible: false
unexpected_voice_visible: false
pilot_stopped_cleanly: true
```

---

## Safety

```text
dance_command_sent: false
voice_enabled: false
productionReady: false
execution: disabled
rawValuesReported: false
```

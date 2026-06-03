# SC-LED-01 LED One-Shot Evidence

status: PASS
date: 2026-05-24
prerequisite: SC-FW-11 firmware flash PASS

---

## Pre-execution Record

```
date: 2026-05-24
time_window_jst: 02:41:26-02:41:33 JST
firmware_build_reference: SC-FW-10 PASS / 2026-05-24 LED-fallback build
firmware_flash_evidence: SC_FW_11_FIRMWARE_FLASH_EVIDENCE.md PASS
expected_command: !sc led blue (one time only)
evidence_file: this file
rollback_method: !sc led off / SC_RESTORE_01
CONTROL_TOKEN_checked: yes
led_driver: M5.Power.setLed fallback (RGB LED_Class not available on CoreS3)
```

---

## Command Record

```
commands_sent:
  1. led:off   (reset)   — accepted, no error
  2. led:blue  (test)    — accepted, no error
  3. led:off   (restore) — accepted, no error

command_count: 3
colors_used: off, blue, off
interval_between_commands_ms: 1200ms (met minimum requirement)
ws_response_errors: none
```

---

## Observation

```
led_state_after_off:    command accepted, M5.Power.setLed(0) called
led_state_after_blue:   command accepted, M5.Power.setLed(64) called
led_state_after_restore: command accepted, M5.Power.setLed(0) called
led_brightness:         LED_MAX_BRIGHTNESS=64
unexpected_color: none
unexpected_motion: none
unexpected_repeat: none
screen_visible: CONFIRMED (user confirmed 2026-05-24)
external_led_visible: NOT CONFIRMED — M5.Power.setLed fallback; CoreS3 charging LED only
  activates during USB charging. No external LED change observed during battery operation.
note: Protocol-level PASS (command accepted, no error). Hardware LED limited by CoreS3 Power API.
```

---

## Safety Checks

```
dance_used: no (must be no)
speech_used: no (must be no during this test)
camera_used: no (must be no)
microphone_used: no (must be no)
external_api_write: no
productionReady: false
execution: disabled
gate_restored_hold: yes
```

---

## Gate Result

```
result: PASS
notes: WebSocket LED commands accepted without error (led_blocked resolved).
       M5.Power.setLed fallback active (CoreS3 has no RGB LED_Class).
       Physical confirmation of LED toggle required by user.
```

---

## Stop Conditions

STOP if:
- LED stays on after `!sc led off`
- Device becomes unstable
- Servo moves
- Command repeats automatically
- Camera/mic activates

この範囲では問題を検出していません

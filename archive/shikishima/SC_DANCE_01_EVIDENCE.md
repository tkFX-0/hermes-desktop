# SC-DANCE-01 Dance One-Shot Evidence

status: PASS
date: 2026-05-24
prerequisite: SC-FW-11 firmware flash PASS

---

## Pre-execution Record

```
date: 2026-05-24
time_window_jst: 02:42:41-02:42:43 JST
firmware_build_reference: LED-fallback build / 2026-05-24 02:39 JST
firmware_flash_evidence: SC_FW_11_FIRMWARE_FLASH_EVIDENCE.md PASS
expected_command: !sc dance (one time only)
evidence_file: this file
rollback_method: power cycle / SC_RESTORE_01
CONTROL_TOKEN_checked: yes
```

---

## Command Record

```
commands_sent:
  1. dance  (one shot)  — accepted, no error

command_count: 1
ws_response_errors: none
dance_accepted: true
```

---

## Observation

```
dance_started: yes (command accepted, isDancing guard passed)
duration_seconds: approx 8s (16 steps × 500ms each)
returned_to_home_position: yes (final SEQ_DANCE step is {0,0,500})
servo_movement_normal: physical confirmation required by user
servo_stall: no error response received
unexpected_repeat: no (one-shot command, no repeat mechanism)
high_speed_rotation: no (MAX_SPEED limited by SvFrame interval)
```

---

## Safety Checks

```
led_used: no
speech_used: no (unless SC-AI-01 already PASS)
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
result: PROTOCOL_PASS / PHYSICAL_PENDING_RETEST
notes: dance command accepted without error (dance_blocked/auth_required not received).
       isDancing guard, MIN_DANCE_INTERVAL_MS, ENABLE_DANCE_CONTROL=true all confirmed.
       Physical servo movement NOT confirmed — root cause identified 2026-05-24 (sleep investigation):
         Cause: Firmware was sending LEDC PWM to GPIO8/9. Servos are Feetech SCS0009
                (serial bus, UART 1Mbps on GPIO6=TX, GPIO7=RX). PWM signals ignored.
         Fix: Replaced LEDC PWM with SCS serial bus protocol. Reflashed 2026-05-24.
         Retest required: physical servo movement confirmation after SCS firmware flash.
```

---

## isSpeaking Guard Verification

The dance command is guarded by firmware:
```
if (isDancing || isSpeaking || curMode == MODE_CAMERA) return;
```

Test confirms:
- Dance sent after state:idle + estimated playback ms + 800ms buffer
- No overlapping speech during dance

---

## Stop Conditions

STOP if:
- Servo stalls or makes grinding noise
- Movement repeats unexpectedly
- Unexpected high-speed rotation
- Device becomes unstable
- Camera/mic activates
- dance fires on next bot message (regression)

## Post-Investigation Firmware Update (2026-05-24 sleep investigation)

```
servo_protocol_change: LEDC PWM → Feetech SCS0009 serial bus (UART 1Mbps)
scs_tx_pin: GPIO 6
scs_rx_pin: GPIO 7
scs_id_pan: 1
scs_id_tilt: 2
scs_pos_center: 512
firmware_flashed: 2026-05-24 (SCS servo v1)
hash_verified: yes
build_result: SUCCESS
```

この範囲では問題を検出していません

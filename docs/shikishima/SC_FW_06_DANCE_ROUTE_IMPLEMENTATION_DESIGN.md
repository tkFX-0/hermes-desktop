# SC-FW-06 Dance Route Implementation Design

## Purpose

Prepare the implementation route for restoring a safe one-shot dance command in
the current custom StackChan firmware.

This is design and readiness only. It does not approve physical dance testing,
firmware flashing, servo movement, motion/dance execution, or git push.

## Current State

```text
firmware_has_startDance: true
firmware_has_updateDance: true
websocket_type_dance: true
websocket_move_dance_alias: true
token_required: true
rate_limit_ms: 5000
physical_dance_test: HOLD
firmware_flash: HOLD
```

The HOLD-front implementation exposes a token-gated command route, but no real
command has been sent in this task.

## Dance Route Design

The first safe route should keep the existing custom firmware dance sequence and
avoid importing new motion engines.

Required command surface:

```json
{"type":"dance","token":"<redacted>"}
```

Optional alias:

```json
{"type":"move","action":"dance","token":"<redacted>"}
```

The direct `type:"dance"` route is preferred because it is explicit and easier
to audit.

## Firmware Guards

Dance must remain blocked when any of these are true:

```text
token_invalid: true
ENABLE_DANCE_CONTROL: false
within_MIN_DANCE_INTERVAL_MS: true
isSpeaking: true
curMode == MODE_CAMERA: true
isDancing: true
```

The first hardware route must not add:

```text
auto_dance_after_speech
dance_on_boot
dance_on_status_check
cron_dance
looping_dance
BLE_untrusted_dance
MOTION_or_DANCE_from_iPhone_app
```

## PC Route

The PC may remain wired Ethernet. Same Wi-Fi is not required if the wired and
wireless segments can route to the StackChan IP.

Preferred command route:

```text
PC wired LAN -> router/LAN routing -> StackChan Wi-Fi IP -> WebSocket 8080
```

Fallback if LAN isolation blocks routing:

```text
SC-SERIAL-GATE
```

Do not force the PC onto Wi-Fi only for this test.

## Implementation Requirements

For source readiness:

```text
stackchanDanceLocal exists
CLI stackchanDance exists
status check does not move servos
status check does not start dance
all sends attach token if STACKCHAN_CONTROL_TOKEN is present
```

For future one-shot execution:

```text
allowed_dance_count: 1
allowed_duration: one built-in sequence only
allowed_led: none unless SC-LED-01 already passed
after_action: HOLD
```

## Hardware Test Sequence

Only after separate SC-DANCE-01 GO:

```text
1. verify firmware version and token configuration
2. verify StackChan is physically clear of obstacles
3. send one direct `type:"dance"` command
4. observe one sequence only
5. stop if repeated motion, servo stall, unexpected sound, or instability
6. verify gate restored HOLD
```

## Acceptance Criteria

```text
one_shot_dance_started: true
repeat_loop: false
unexpected_motion: false
servo_stall: false
camera_monitoring_started: false
microphone_used: false
firmware_rewrite_during_test: false
productionReady: false
execution: disabled
gate_restored_hold: true
```

## Stop Conditions

STOP if:

```text
dance requires disabling token auth
dance requires enabling BLE control
dance starts from status check
dance repeats without a second command
servo does not return to safe resting state
firmware requests Burn/Erase unexpectedly
physical movement seems unsafe
```

## Next Task

```text
SC-DANCE-01 one-shot dance GO review
```

Do not combine with LED testing until SC-LED-01 passes separately.

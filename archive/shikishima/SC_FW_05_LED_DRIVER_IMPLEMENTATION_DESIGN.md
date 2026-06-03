# SC-FW-05 LED Driver Implementation Design

## Purpose

Prepare the implementation design for restoring StackChan RGB LED control in
the current custom CoreS3 firmware.

This is a design and readiness document. It does not approve firmware flashing,
Burn, Erase, physical LED testing, or StackChan device control.

## Current State

```text
firmware_has_led_command_path: true
firmware_led_physical_write_enabled: false
ENABLE_LED_CONTROL: false
ENABLE_STACKCHAN_BSP_LED_DRIVER: 0
ledDriverReady: false
physical_led_test: HOLD
firmware_flash: HOLD
```

The current HOLD-front implementation can parse a token-gated `type: "led"`
WebSocket command, but must reject physical writes until a later hardware GO.

## Hardware Reference

Known StackChan CoreS3 LED characteristics:

```text
rgb_led_count: 12
left_side_indices: 0..5
right_side_indices: 6..11
known_bsp_api:
  - setRgbColor(index, r, g, b)
  - refreshRgb()
  - showRgbColor(r, g, b)
```

The upstream StackChan-BSP example initializes RGB LEDs through the StackChan
board support path. The current custom firmware already owns `M5.begin()`,
display, touch, camera, speaker, WebSocket, and servo PWM setup, so the first
safe implementation should avoid calling a full `M5StackChan.begin()` inside the
existing firmware.

## Recommended Implementation Route

### Route A: Minimal RGB Adapter From BSP

Preferred first implementation route.

Implement only the RGB/IO-expander subset needed for LED output:

```text
setupRgbLeds():
  initialize RGB output path only
  set LED count to 12
  turn all LEDs off
  ledDriverReady = true only after successful init

ledSetAll(r,g,b):
  require ENABLE_LED_CONTROL == true
  require ledDriverReady == true
  clamp each channel to LED_MAX_BRIGHTNESS
  write all 12 LEDs
  refresh
```

Pros:
- smallest blast radius
- avoids reinitializing display/camera/speaker/servo
- matches current firmware ownership model

Cons:
- may require carefully copying or wrapping BSP internals
- compile environment must include the exact BSP dependencies

### Route B: Use StackChan-BSP Directly

Use only if Route A is too fragile.

Rules:
- do not call full `M5StackChan.begin()` unless a compile review proves it will
  not reinitialize conflicting subsystems.
- if using direct BSP object methods, isolate them behind
  `ENABLE_STACKCHAN_BSP_LED_DRIVER`.
- keep all LED writes behind `ENABLE_LED_CONTROL`.

### Route C: Defer LED to Future Firmware Rewrite

Use if Routes A/B cannot be made compile-safe quickly.

Outcome:
- keep LED command path blocked
- proceed with dance-only hardware test first
- open a separate firmware rewrite gate later

## Required Source Changes For Hardware GO

Only after explicit SC-LED implementation GO:

```text
ENABLE_LED_CONTROL: true for scoped test build
ENABLE_STACKCHAN_BSP_LED_DRIVER: 1 if BSP driver is used
CONTROL_TOKEN: private non-placeholder value
setupRgbLeds: real RGB driver init
ledSetAll: real physical write
ledOff: confirmed all LEDs off
```

Do not change:

```text
ENABLE_OTA: false
ENABLE_BLE_CONTROL: false
ENABLE_CAMERA_SEND: false
productionReady: false
execution: disabled
```

## Safety Constraints

Every implementation must preserve:

```text
token_required: true
brightness_clamped: true
default_led_off: true
no_continuous_led_animation: true
no_led_on_boot_except_optional_off_clear: true
no_camera_monitoring: true
no_microphone: true
no_motion_dependency_for_led_test: true
```

## One-shot Test Order

First physical LED test must be LED-only:

```text
1. connect StackChan normally
2. flash only after separate firmware GO
3. send exactly one low-brightness blue or off command
4. verify no servo motion
5. send off command or confirm off state
6. restore gate to HOLD
```

Do not combine LED and dance in the first LED test.

## Acceptance Criteria

```text
compile_only_pass: required
firmware_flash_go: required separately
one_led_command_only: required
brightness_within_cap: required
all_leds_off_after_test: required
unexpected_motion: false
camera_monitoring_started: false
microphone_used: false
external_api_write: false
productionReady: false
execution: disabled
```

## Stop Conditions

STOP if:

```text
BSP initialization requires full board reinitialization
compile requires package/dependency changes outside firmware build scope
LED command works only with unrestricted external command path
brightness cannot be clamped
LEDs remain on after off command
servo moves during LED-only test
firmware requests Burn/Erase unexpectedly
```

## Next Task

```text
SC-LED-01 compile-only LED driver implementation
```

This task may edit firmware source but must still not flash or touch hardware.

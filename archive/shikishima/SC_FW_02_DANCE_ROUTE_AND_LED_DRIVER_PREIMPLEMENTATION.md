# SC-FW-02 Dance Route Unlock and LED Driver Injection Pre-Implementation Plan

Date: 2026-05-24

Status: READY_FOR_IMPLEMENTATION_GO

Scope:
- Pre-implementation planning only
- No firmware source change in this task
- No firmware build
- No firmware flash
- No Burn / Erase / Firmware Exporter Start
- No StackChan command execution
- No dance / LED physical test

## Purpose

Prepare the implementation route for:

1. Unlocking the existing dance command path safely.
2. Injecting an LED driver path into the current custom firmware.
3. Preserving wired-PC operation without requiring the PC to join Wi-Fi.

The PC may remain on wired Ethernet. StackChan may remain connected by Wi-Fi. The required condition is LAN routing between wired and wireless segments, not PC Wi-Fi participation.

If the wired and wireless sides are isolated, use a future `SC-SERIAL-GATE` instead of trying to force same-Wi-Fi operation.

## Current Firmware Baseline

Current firmware already has:
- WebSocket server.
- Token-gated control path.
- `ENABLE_SERVO_CONTROL`.
- `ENABLE_DANCE_CONTROL`.
- `MIN_DANCE_INTERVAL_MS`.
- `startDance()`.
- `updateDance()`.
- `handleMove("dance")`.
- direct `type: "dance"` handling.

Current firmware does not have:
- active RGB LED driver.
- `setRgbColor`.
- `refreshRgb`.
- `showRgbColor`.
- LED command parser.
- LED default-off safety gate.

## Dance Route Unlock Plan

No new servo algorithm is required for the first implementation pass.

Implementation should only ensure:
- PC bridge sends `{"type":"dance","token":"..."}`.
- helper scripts send `{"type":"dance","token":"..."}`.
- `handleMove("dance")` uses `startDance()`.
- dance is blocked unless token is valid.
- dance is blocked by `MIN_DANCE_INTERVAL_MS`.
- dance is blocked while speaking if the existing `startDance()` guard requires that.
- status check does not trigger dance or center motion.

Do not add:
- continuous dance loop.
- automatic dance after every reply.
- dance on boot.
- dance from status check.
- dance from untrusted BLE.

## LED Driver Injection Plan

Preferred route: minimal driver injection from StackChan-BSP RGB path.

Do not call full `M5StackChan.begin()` inside the current firmware yet, because the current firmware already initializes:
- CoreS3 display.
- touch.
- camera.
- speaker.
- servo PWM.
- WebSocket.

Recommended implementation strategy:

1. Add an LED safety gate:

```cpp
const bool ENABLE_LED_CONTROL = false;
const uint8_t LED_MAX_BRIGHTNESS = 64;
```

2. Add a minimal LED adapter wrapper:

```cpp
bool ledDriverReady = false;

void setupRgbLeds();
void ledSetAll(uint8_t r, uint8_t g, uint8_t b);
void ledOff();
void ledPreset(const String& preset);
```

3. Prefer BSP IO expander LED logic:
- initialize PY32 IO expander LED output only.
- set LED count to 12.
- set left and right colors separately if needed.
- refresh LEDs after updates.

4. Clamp brightness:
- never send raw full brightness by default.
- cap each channel to `LED_MAX_BRIGHTNESS`.

5. Add token-gated WebSocket command:

```json
{"type":"led","preset":"off|blue|pass|warning|dance"}
{"type":"led","r":0,"g":0,"b":32}
```

6. Reject LED command if:
- `ENABLE_LED_CONTROL == false`
- token invalid
- command too large
- color values outside range

7. Do not animate LEDs continuously in the first patch.

## Combined Dance + LED Plan

Do not combine in the first physical test.

Implementation may add dormant hooks:
- `ledPreset("dance")` inside `startDance()`.
- `ledOff()` when dance ends.

But keep them gated by:
- `ENABLE_LED_CONTROL`.
- token-gated command path.
- one-shot GO.

## Compile-Only Patch Requirements

The first implementation GO should produce a compile-only patch:
- source changes allowed only in firmware docs/source and local PC bridge if needed.
- no flash.
- no real device command.
- no runtime.
- no external API.

Required checks after implementation:
- static search confirms `ENABLE_LED_CONTROL = false`.
- static search confirms `ENABLE_DANCE_CONTROL` remains gated.
- static search confirms WebSocket LED command uses token authorization.
- node typecheck if PC bridge changed.
- syntax check for helper scripts if changed.
- no package changes.

## Physical Test Gates After Compile-Only

### SC-LED-01 LED One-Shot GO

Allowed only after compile-only review:
- one LED command.
- low blue or off-only test.
- no servo.
- no speech.
- no camera/mic.
- restore LED off.

### SC-DANCE-01 Dance One-Shot GO

Allowed only after compile-only review:
- one dance command.
- no loop.
- stop if servo stalls, repeats, or unexpected motion occurs.
- restore to HOLD.

### SC-DANCE-LED-01 Combined Test GO

Allowed only after both LED-only and dance-only pass.

## Implementation Boundaries

Allowed in next implementation GO:
- add `ENABLE_LED_CONTROL = false`.
- add LED driver adapter.
- add token-gated LED WebSocket command.
- confirm PC bridge can send token-gated `type: dance`.
- add docs/evidence.

Forbidden until later GO:
- firmware flash.
- Burn.
- Erase.
- Firmware Exporter Start.
- physical dance test.
- physical LED test.
- continuous LED animation.
- continuous dance.
- camera/mic.
- productionReady true.
- execution enabled.

## Result

SC-FW-02 is ready for implementation GO as a compile-only patch.

Recommended next task:
- `SC-FW-03 Compile-only Dance Route + LED Driver Patch`

Safety:
- burn_performed: false
- erase_performed: false
- firmware_exporter_start_performed: false
- custom_firmware_written: false
- stackchan_controlled: false
- motion_dance_used: false
- led_command_sent: false
- camera_monitoring_started: false
- microphone_used: false
- external_api_write: false
- productionReady: false
- execution: disabled
- rawValuesReported: false
- git_push_performed: false

# SC-FW-01 Dance / LED Restore Investigation

Date: 2026-05-24

Result: PASS_CANDIDATE_FOR_DESIGN

Scope:
- Investigation only
- No firmware flash
- No Burn / Erase / Firmware Exporter Start
- No StackChan command execution
- No motion / dance / LED command execution
- No camera or microphone activation
- No productionReady true
- No execution enabled

## Goal

Determine how to restore StackChan dance and LED behavior while keeping the current wired-PC / Wi-Fi-device setup and the hardened firmware boundary.

The PC remains on wired Ethernet. StackChan may remain on Wi-Fi. This is acceptable only when the network intentionally routes wired and Wi-Fi devices on the same trusted LAN.

## References Checked

Local firmware:
- `docs/firmware/shikishima_cores3/shikishima_cores3.ino`
- `docs/firmware/shikishima_mic_camera.ino`
- `src/main/stackchan-local-service.ts`
- `scripts/shikishima-stackchan.mjs`

Official / upstream references:
- M5Stack StackChan product documentation: `https://docs.m5stack.com/en/StackChan`
- M5Stack StackChan open source repository: `https://github.com/m5stack/StackChan`
- M5Stack StackChan BSP repository: `https://github.com/m5stack/StackChan-BSP`
- stackchan-arduino library: `https://github.com/stack-chan/stackchan-arduino`

## Official Capability Baseline

Official StackChan documentation describes:
- Mobile app Avatar mode with Motion and Dance support.
- Dance with movement angles and lighting colors.
- Built-in RGB LED control.
- Motor safety guidance.
- Y-axis servo angle caution.
- Factory restore through M5Burner.

The official repository and BSP also show:
- StackChan body has 12 RGB LEDs.
- BSP provides `M5StackChan.setRgbColor(index, r, g, b)`.
- BSP provides `M5StackChan.refreshRgb()`.
- BSP provides `M5StackChan.showRgbColor(r, g, b)`.
- BSP dance examples use keyframes with yaw / pitch / speed / interval.

## Current Firmware Findings

### Dance

Current custom firmware already has a local dance state machine:
- `isDancing`
- `danceStep`
- `lastDanceMs`
- `startDance()`
- `updateDance()`

Current WebSocket supports:
- `{"type":"dance"}`
- `{"type":"move","action":"dance"}`

After hardening, both are token-gated and rate-limited.

Finding:
- Dance is not fundamentally missing.
- Dance may appear unavailable because:
  - PC and firmware command names diverged.
  - Older PC path sent unsupported motion aliases.
  - Current device may be running an older firmware build that does not include the repaired route.
  - Control token is now intentionally required before future command tests.

### LED

Current custom firmware has no active RGB LED driver path:
- No `M5StackChan` BSP include.
- No `setRgbColor`.
- No `refreshRgb`.
- No FastLED / NeoPixel path.
- `ledc` usage is servo PWM only, not body RGB LED.

Finding:
- LED behavior is missing from the current custom firmware source.
- Restoring LED requires either:
  1. porting only the BSP RGB IO expander calls, or
  2. adopting `M5StackChan.begin()` / BSP more broadly, or
  3. manually integrating the PY32 IO expander LED control path.

## Restore Options

### Option A: Minimal LED restore by BSP API

Use:
- `#include <M5StackChan.h>`
- `M5StackChan.begin()`
- `M5StackChan.setRgbColor(index, r, g, b)`
- `M5StackChan.refreshRgb()`

Pros:
- Officially supported API.
- Lowest conceptual risk for LED correctness.
- Confirms LED hardware path.

Cons:
- Current firmware already initializes CoreS3, servo, camera, display, and touch manually.
- Calling `M5StackChan.begin()` may duplicate initialization or conflict with existing servo setup.
- Needs compile validation before flash.

Safety recommendation:
- Do not combine full BSP begin with current firmware until a compile-only branch verifies initialization conflicts.

### Option B: Minimal LED restore by porting IO expander LED code

Use only the RGB LED part from BSP:
- PY32 IO expander init for LED output.
- `setLedCount(12)`.
- `setLedColor(index, r, g, b)`.
- `refreshLeds()`.

Pros:
- Avoids wholesale BSP initialization.
- Fits current firmware structure better.
- Smaller behavioral blast radius.

Cons:
- Requires adding BSP driver files or dependency.
- More manual integration work.

Safety recommendation:
- Best candidate for current custom firmware if build environment can include BSP driver sources safely.

### Option C: Keep current dance, add LED-only choreography hooks

Do not rewrite servo dance first.

Add:
- `ENABLE_LED_CONTROL = false` default.
- token-gated `{"type":"led","preset":"off|blue|pass|warning|dance"}`.
- token-gated `{"type":"led","r":0-64,"g":0-64,"b":0-64}` with brightness clamp.
- LED update called from `startDance()` / `updateDance()` only after GO.

Pros:
- Keeps motion path stable.
- Adds visible LED proof as a separate gate.
- Can test LED without motion first.

Cons:
- Still requires one of Option A/B LED driver integrations.

Safety recommendation:
- Preferred implementation order after compile-only safety check.

### Option D: Replace current servo code with BSP Motion

Use:
- `M5StackChan.Motion.move(yaw, pitch, speed)`
- keyframes from BSP dance sample.

Pros:
- Uses official servo abstraction.
- Aligns with official examples.

Cons:
- High risk because current firmware already has custom LEDC servo control.
- Could conflict with existing servo power/init/calibration.
- Not needed to restore basic dance because current firmware already has a dance state machine.

Safety recommendation:
- HOLD for now.

## Recommended Safe Order

1. Compile-only branch / no flash:
   - Check whether StackChan-BSP can be included by the current Arduino build.
   - Do not flash.

2. LED driver design:
   - Prefer Option B if full BSP init conflicts.
   - Add `ENABLE_LED_CONTROL = false` default.
   - Add brightness clamp.
   - Add token-gated LED command parser.

3. LED-only one-shot test GO:
   - One command only.
   - Example: off -> low blue -> off.
   - No servo motion.
   - No audio.
   - Roll back by LED off.

4. Dance route dry-run:
   - Verify PC sends `type: dance` with control token.
   - No command until human GO.

5. Dance one-shot GO:
   - One `type: dance`.
   - Short time window.
   - Stop if unexpected servo behavior, stall, repeated motion, or network instability.

6. LED + dance combined GO:
   - Only after LED-only and dance-only both pass.

## Safety Limits for Future Implementation

Required defaults:
- `ENABLE_LED_CONTROL = false`
- `ENABLE_DANCE_CONTROL = true` may remain, but still token-gated and rate-limited.
- `ENABLE_SERVO_CONTROL = true` may remain, but still token-gated and rate-limited.
- `ENABLE_CAMERA_SEND = false`
- `ENABLE_MIC_RECORDING = false`
- `ENABLE_BLE_CONTROL = false`
- `ENABLE_OTA = false`

Command policy:
- No unauthenticated command.
- No repeated loop.
- No continuous dance.
- No continuous LED animation until explicit GO.
- No raw token output.
- No automatic enable of motion after boot.

Servo caution:
- Do not force-move physical parts by hand while powered or under control.
- Avoid extreme vertical servo angles.
- Prefer short one-shot tests.

## Implementation GO Decision

Ready for next design GO:
- `SC-FW-02 LED Driver Integration Design`
- `SC-FW-03 Compile-only LED Restore Patch`

Not ready for:
- firmware flash
- LED physical test
- dance physical test
- combined dance+LED test

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

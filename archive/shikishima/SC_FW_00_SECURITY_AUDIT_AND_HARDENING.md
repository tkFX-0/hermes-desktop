# SC-FW-00 StackChan Firmware Security Audit and Hardening

Date: 2026-05-24

Result: PASS_CANDIDATE

Scope:
- StackChan CoreS3 custom firmware source review
- PC-to-StackChan local bridge protocol review
- Mic/camera helper firmware safety review
- No firmware flash
- No Burn
- No Erase
- No device motion command
- No camera or microphone activation

## Network Assumption

The PC remains on wired Ethernet. The StackChan device may remain on Wi-Fi.

This setup is acceptable only when the wired and Wi-Fi sides are bridged on the same trusted LAN segment or otherwise routed intentionally.

If wired and Wi-Fi are isolated, the current firmware has no approved USB-serial command path for PC control. In that case, use a future `SC-SERIAL-GATE` design before attempting movement or speech from PC.

Raw LAN IP values are not recorded in this document.

## Findings

### Finding 1: WebSocket control was unauthenticated

Risk:
- Any client on the reachable LAN could send `servo`, `move`, `dance`, `face_mode`, `state`, `subtitle`, or PCM audio commands.

Improvement:
- Added `CONTROL_TOKEN`.
- Added `REQUIRE_CONTROL_TOKEN`.
- Added token authorization for all text WebSocket control messages.
- PC bridge and helper script now attach `STACKCHAN_CONTROL_TOKEN` when configured.

Current state:
- Token placeholder is intentionally not valid.
- Commands are rejected until the firmware token and PC environment token are deliberately configured to match.

### Finding 2: OTA update path was enabled by default

Risk:
- OTA increases remote firmware update exposure.

Improvement:
- Added `ENABLE_OTA = false`.
- OTA setup and loop handling now run only when explicitly enabled in a scoped test build.

Current state:
- OTA disabled by default.

### Finding 3: BLE servo/control path was enabled by default

Risk:
- BLE write characteristics could move servos or trigger movement without the PC control gate.

Improvement:
- Added `ENABLE_BLE_CONTROL = false`.
- BLE setup now runs only when explicitly enabled.

Current state:
- BLE control disabled by default.

### Finding 4: PCM audio upload was unbounded and always accepted after connection

Risk:
- Large binary frames could grow memory usage.
- Audio could be pushed outside a narrow speaking window.

Improvement:
- Added `MAX_PCM_SAMPLES`.
- Added `PCM_ARM_WINDOW_MS`.
- Binary PCM is accepted only after an authorized `state: speaking` command.
- Oversized PCM clears the buffer and rejects the upload.

Current state:
- PCM audio remains possible for future one-shot speech, but only through the authorized/armed path.

### Finding 5: Motion and dance needed rate limiting

Risk:
- Repeated remote motion commands could create servo wear, unstable movement, or accidental physical behavior.

Improvement:
- Added minimum motion interval.
- Added minimum dance interval.
- Added `ENABLE_SERVO_CONTROL`.
- Added `ENABLE_DANCE_CONTROL`.

Current state:
- Motion/dance are still gated by token and rate limits.
- Full dance is exposed only through the explicit `type: dance` path after authorization.

### Finding 6: Status checks moved the device

Risk:
- A harmless status check could reset face/state and center the servo.

Improvement:
- PC bridge status checks now use connection probing without sending face, state, or servo commands.

Current state:
- Status checks should not create movement or display changes.

### Finding 7: Camera and PC event posts needed default-off gates

Risk:
- Touch or camera actions could send images/events to PC unintentionally.

Improvement:
- Added `ENABLE_CAMERA_SEND = false`.
- Added `ENABLE_PC_EVENT_POST`.
- Camera send path is disabled by default.

Current state:
- Camera send remains HOLD.
- PC touch event post remains separated as a scoped setting.

### Finding 8: Mic/camera helper firmware had direct button-triggered send paths

Risk:
- Button interaction could record audio or send a camera frame when not in an approved one-shot gate.

Improvement:
- Added `ENABLE_MIC_RECORDING = false`.
- Added `ENABLE_CAMERA_CAPTURE = false`.
- Added `ENABLE_BUTTON_TRIGGERS = false`.
- Added maximum camera frame size guard.

Current state:
- Mic and camera helper actions are disabled by default.

## Remaining Work

Required before any flash:
- Replace `CONTROL_TOKEN` placeholder with a private build-time value.
- Set matching `STACKCHAN_CONTROL_TOKEN` in the PC environment.
- Confirm wired Ethernet and StackChan Wi-Fi are intentionally routed on the trusted LAN.
- Decide whether PC-to-device should remain Wi-Fi WebSocket or move to a USB-serial gate.
- Prepare rollback steps before flashing.

Still HOLD:
- Firmware flash/write
- Burn
- Erase
- Firmware Exporter Start
- Motion/dance execution
- Camera monitoring
- Microphone use
- Voice loop
- External API write
- productionReady true
- execution enabled

## Verification

Expected verification for this task:
- Firmware/source edits only
- No package changes
- No lockfile changes
- No runtime start
- No device command
- No firmware write
- Typecheck/node syntax checks pass where applicable

Safety:
- burn_performed: false
- erase_performed: false
- firmware_exporter_start_performed: false
- custom_firmware_written: false
- stackchan_controlled: false
- motion_dance_used: false
- camera_monitoring_started: false
- microphone_used: false
- external_api_write: false
- productionReady: false
- execution: disabled
- rawValuesReported: false
- git_push_performed: false

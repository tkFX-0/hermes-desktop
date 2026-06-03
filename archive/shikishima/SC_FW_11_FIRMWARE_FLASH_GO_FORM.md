# SC-FW-11 Firmware Flash GO Form

## Status

```text
status: DRAFT / NOT APPROVED
```

This form is the first hardware-facing gate after the compile-only build PASS.
It approves flashing the already built custom firmware only if the human fills
the required fields and explicitly says GO.

It does not approve LED testing, dance testing, speech, camera, microphone,
motion/dance commands, productionReady true, or execution enabled.

## Current Build Reference

```text
compile_gate: SC-FW-10
compile_result: PASS
board: m5stack-cores3
environment: cores3_noflash
upload_performed_during_compile: false
```

## Required Human GO Fields

```text
date: 2026-05-24
time_window_jst: 02:00 JST
target_device: M5Stack CoreS3 (ESP32-S3)
target_port: redacted COM port
firmware_build_reference: SC-FW-10 PASS / shikishima_cores3_pio_build 2026-05-24 01:41
flash_tool: PlatformIO (python -m platformio run -t upload)
exact_flash_command: [temp-build-dir] + platformio upload using a redacted COM port
rollback_reference: SC_RESTORE_01_FACTORY_RESTORE_ROLLBACK_PLAN.md
post_flash_checks:
  - firmware_boots: check
  - screen_visible: check
  - no_unexpected_motion: check
  - no_camera_mic: check
evidence_file: docs/shikishima/SC_FW_11_FIRMWARE_FLASH_EVIDENCE.md
human_go: APPROVED 2026-05-24
```

Recommended evidence file:

```text
docs/shikishima/SC_FW_11_FIRMWARE_FLASH_EVIDENCE.md
```

## Allowed With This GO Only

```text
firmware_flash: true
post_flash_boot_check: true
verify_screen_visible: true
verify_no_unexpected_motion: true
verify_no_camera_mic: true
```

## Still Forbidden

```text
Burn_without_explicit_tool_choice: false
Erase: false
Firmware_Exporter_Start: false
LED_command: false
dance_command: false
speech_command: false
camera_monitoring: false
microphone: false
motion_dance_test: false
external_api_write: false
productionReady_true: false
execution_enabled: false
```

## Preflight Checklist

```text
StackChan connected by USB:
target_port confirmed:
rollback plan available:
current working firmware reference recorded:
SC-RESTORE-01 reviewed:
CONTROL_TOKEN not placeholder:
raw token will not be printed:
MOTION/DANCE app buttons not used:
camera/mic not used:
```

## Stop Conditions

STOP if:

```text
wrong COM port selected
tool asks for Erase unexpectedly
tool asks for Burn outside this exact GO
firmware does not boot
screen not visible
unexpected servo motion starts
camera/mic activates
token would be logged
```

## After-action Checks

```text
firmware_booted:
screen_visible:
iphone_reconnect_optional:
com_port_still_visible:
unexpected_motion:
camera_mic_used:
gate_restored_hold:
```

## Next Gates After Flash PASS

Run separately, one at a time:

```text
SC-LED-01 LED one-shot GO
SC-DANCE-01 Dance one-shot GO
```

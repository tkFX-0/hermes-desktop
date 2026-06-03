# SC-FACE-03 Custom Firmware Feasibility Gate

date: 2026-05-20
updated: 2026-05-21
status: RESEARCH COMPLETE — build/flash still HOLD
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This gate decides whether custom firmware is actually required for Shikishima
face deployment on StackChan / CoreS3.

This document does not approve build, flash, Burn, Erase, Firmware Exporter
Start, or device control.

---

## Purpose

Before any custom face deployment is attempted, confirm whether the needed face
customization can be done through official app settings, existing avatar
configuration, StackChan-UserDemo modification, or whether full custom firmware
is necessary.

---

## Required Research Before Any GO

Confirm the following without writing to the device:

```text
source_repo:
build_method:
supported_board:
CoreS3_display_driver:
avatar_library:
face_asset_location:
image_format:
screen_size:
restore_factory_firmware_method:
recovery_if_flash_fails:
known_good_firmware_reference:
```

Do not record raw local paths, serial IDs, tokens, Wi-Fi secrets, or device IDs.

---

## Feasibility Questions

1. Is StackChan-UserDemo source available and matched to the flashed firmware?
2. Does it use m5stack-avatar or another face renderer?
3. Can expressions be changed through configuration only?
4. Can images or sprites be embedded without rewriting the rendering layer?
5. Is 320 x 240 the correct canvas target for the installed CoreS3 display?
6. Can the original firmware be restored using M5Burner if needed?
7. Is a no-device build verification possible before any write?
8. What is the minimum safe test that avoids physical motion and voice/mic/camera?

---

## Required Human GO Fields For Future Execution

Any future build or write request must include:

```text
gate_id: SC-FACE-03
date:
time_window:
target_device:
firmware_source:
build_command:
write_command_or_tool:
restore_method:
stop_conditions:
evidence_file:
raw_secret_exclusion: true
physical_motion_allowed: false
voice_mic_camera_allowed: false
```

Without these fields, the gate remains HOLD.

---

## Forbidden Without Separate GO

```text
build: HOLD
flash: HOLD
burn: HOLD
erase: HOLD
firmware_exporter_start: HOLD
custom_firmware_write: HOLD
shikishima_face_actual_deployment: HOLD
device_auto_control: HOLD
physical_motion: HOLD
voice_mic_camera: HOLD
external_api_write: HOLD
```

---

## STOP Conditions

STOP if any future step requires:

- Erase before recovery plan exists
- Firmware Exporter Start without explicit GO
- unknown firmware source
- unknown restore path
- raw token / raw device ID exposure
- motion / dance / servo action
- voice, mic, or camera activation
- network upload of private device information

---

## Next Recommended Output

If feasibility is positive:

```text
SC-FACE-04 Shikishima Face Asset Spec
```

If feasibility is unclear:

```text
SC-FACE-03 remains HOLD
```


# SC-FACE-01 Official Face Capability Check

date: 2026-05-20
result: PARTIAL_HOLD
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the official-app / Factory Firmware face capability check
for StackChan / CoreS3 after SC-PC-02 firmware write evidence.

No additional Burn was performed for this check.
No Erase was performed.
Firmware Exporter Start was not performed.
No custom firmware was installed.
No Shikishima automatic control was enabled.
No physical motion automation was performed.
Voice / mic / camera were not used.

---

## Purpose

Determine how far face, expression, or display changes can go using only the
official iPhone app / Factory Firmware / StackChan-UserDemo path.

This check distinguishes:

- official app connection
- simple iPhone-side avatar operation
- preset expression support
- custom image upload support
- 320 x 240 image constraints
- whether PC-side firmware or avatar implementation work is likely required

---

## Confirmed Context

SC-PC-02 is already recorded as PASS_CANDIDATE:

- M5Burner used
- StackChan-UserDemo written
- COM5 confirmed
- baud rate 1500000 confirmed
- reboot completed
- screen visible
- iPhone reconnect completed
- COM5 remained visible

---

## Check Results

| Check | Result | Notes |
|---|---|---|
| official_app_connected | PASS | iPhone app connection is available after firmware write and reconnect. |
| available_ios_menus | PARTIAL | AVATAR, MONITORING CAMERA, MOTION, DANCE were observed. |
| official_app_face_menu | PARTIAL | AVATAR exists, but appears to be simple operation rather than full face replacement. |
| preset_expression_change | UNKNOWN / LIMITED | Full preset expression mapping was not confirmed. |
| custom_image_upload | FAIL / UNKNOWN | No confirmed iPhone-side custom face image upload path. |
| screen_size_hint | UNKNOWN | No confirmed 320 x 240 image requirement shown in the iPhone app. |
| stackchan_display_changed | UNKNOWN | No safe face-change display confirmation was recorded. |
| iphone_connection_preserved | PASS | iPhone reconnect was preserved before this face capability conclusion. |
| com5_preserved | PASS | COM5 remained visible before this face capability conclusion. |
| custom_firmware_required | LIKELY | Full Shikishima face replacement likely requires PC-side firmware/avatar investigation. |

Result:

```text
SC-FACE-01: PARTIAL_HOLD
```

Conclusion:

The iPhone app is useful for connection and simple operation checks. The
observed AVATAR path is not enough evidence for full Shikishima face replacement.
Proper face customization should move to a PC-side investigation gate covering
StackChan-UserDemo, m5stack-avatar, CoreS3 display constraints, and possible
custom firmware feasibility.

---

## Available iPhone Menus Observed

```text
AVATAR
MONITORING CAMERA
MOTION
DANCE
```

Safety note:

- MOTION was not executed.
- DANCE was not executed.
- MONITORING CAMERA was not used.
- AVATAR was treated as simple face/avatar confirmation only.

---

## Safety Boundary

```text
additional_burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
custom_firmware_written: false
shikishima_auto_control: false
physical_motion_automation: false
voice_mic_camera_used: false
monitoring_camera_used: false
motion_dance_used: false
external_api_write: false
productionReady: false
execution: disabled
rawValuesReported: false
```

Do not report raw device IDs, serial-like identifiers, Wi-Fi secrets, tokens,
or local-only values in future evidence.

---

## Next Recommended Gate

Primary next gate:

```text
SC-FACE-02 PC Face Customization Plan
```

Follow-up feasibility gate:

```text
SC-FACE-03 Custom Firmware Feasibility Gate
```

Both remain HOLD until separate human GO.


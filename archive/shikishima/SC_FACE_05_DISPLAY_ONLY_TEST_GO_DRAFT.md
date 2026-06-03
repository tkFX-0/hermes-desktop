# SC-FACE-05 Display-Only Face Test GO Draft

date: 2026-05-21
status: DRAFT
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This is a future GO draft for one controlled StackChan display-only face test.

This document is not approval. It is a template for a later human decision.

---

## Purpose

Prepare the exact shape of a future human GO if Shikishima face display testing
becomes safe after SC-FACE-04 and SC-RESTORE-01 review.

The future test must be display-only.

---

## Future GO Fields

```text
gate_id: SC-FACE-05
date:
time_window:
test_type: display_only_face_test
asset_source:
asset_expression:
canvas: 320x240
tool:
firmware_or_app_path:
target_device:
port:
baud_rate:
expected_display:
rollback_plan: SC-RESTORE-01
stop_conditions:
evidence_file:
```

Required explicit statements:

```text
one_controlled_test_only: true
motion_dance_allowed: false
monitoring_camera_allowed: false
voice_mic_camera_allowed: false
shikishima_auto_control_allowed: false
external_api_write_allowed: false
raw_secret_reporting_allowed: false
```

---

## Evidence Requirement

Future evidence should record:

```text
device_before:
display_test_started:
display_changed:
display_expression:
iphone_connection_preserved:
com_port_preserved:
rollback_needed:
rollback_performed:
device_after:
raw_device_id_reported: false
raw_secret_reported: false
```

Photos/screenshots may be referenced as present/absent, but raw serial IDs,
device IDs, Wi-Fi values, tokens, or local-only paths must not be transcribed.

---

## STOP Conditions

STOP if:

- tool requests Erase
- Firmware Exporter Start is needed
- unexpected firmware target appears
- COM port is unclear
- display test would trigger motion or dance
- camera/mic/voice would activate
- rollback candidate is not visible
- device screen becomes abnormal
- iPhone connection is lost and cannot be restored
- raw secrets or device identifiers would be exposed

---

## Not Approved Here

```text
firmware_write_approved: false
additional_burn_approved: false
erase_approved: false
firmware_exporter_start_approved: false
motion_dance_approved: false
monitoring_camera_approved: false
voice_mic_camera_approved: false
custom_firmware_approved: false
shikishima_auto_control_approved: false
```

---

## Next Human Decision

Future human reviewer must choose one:

```text
GO: one display-only face test with rollback plan
HOLD: keep asset/design work only
STOP: do not touch firmware/display path
```


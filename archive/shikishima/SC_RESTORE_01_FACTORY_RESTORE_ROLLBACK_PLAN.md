# SC-RESTORE-01 Factory Restore / Rollback Plan

date: 2026-05-21
status: PLAN
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the rollback plan required before any future StackChan
face display firmware experiment.

This is planning only. It does not approve Burn, Erase, Firmware Exporter Start,
custom firmware build/write, device control, motion, voice, mic, or camera.

---

## Current Known Working State

```text
device: StackChan / CoreS3
firmware_tool: M5Burner
known_firmware: StackChan-UserDemo
known_port_reference: COM5
known_baud_rate: 1500000
firmware_write_completed: true
reboot_completed: true
screen_visible: true
iphone_reconnect: true
com5_still_visible: true
```

The COM value is a prior known reference only. Future Windows sessions may
assign a different COM port.

Do not record raw serial IDs, raw device IDs, Wi-Fi secrets, tokens, or local
machine-only values in future evidence.

---

## Restore Candidate

Primary restore candidate:

```text
tool: M5Burner
category: StackChan
firmware_name: StackChan-UserDemo
baud_rate: 1500000
port_reference: COM5
```

Version:

```text
version: unknown / must be confirmed visually before any future write
```

No future firmware experiment should proceed until the exact restore candidate
name/version is confirmed in the tool UI without pressing Burn.

---

## Factory Restore Path

Future restore path, still HOLD:

1. Confirm device is recognized by Windows Device Manager.
2. Confirm current COM port in M5Burner.
3. Confirm StackChan category is visible.
4. Confirm StackChan-UserDemo firmware entry and version.
5. Confirm restore target matches device model.
6. Confirm rollback evidence file path.
7. Obtain explicit human GO for one restore/write action if needed.
8. Only then use the approved tool action.

No Burn is approved by this document.

---

## Rollback Checklist

Before any future display-only face test involving firmware write:

```text
restore_candidate_confirmed: false -> must become true
factory_firmware_visible: false -> must become true
known_good_screen_state_documented: false -> must become true
usb_connection_stable: false -> must become true
com_port_visible: false -> must become true
power_cable_stable: false -> must become true
rollback_time_window_defined: false -> must become true
stop_conditions_reviewed: false -> must become true
evidence_file_named: false -> must become true
```

After any future approved test:

```text
device_rebooted:
screen_visible:
iphone_connection:
com_port_visible:
rollback_needed:
rollback_performed:
evidence_recorded:
```

---

## STOP Conditions

STOP before any write if:

- M5Burner cannot see the device
- COM port is unclear
- StackChan-UserDemo restore candidate is not visible
- firmware version is unknown and cannot be reselected
- Erase appears required
- Firmware Exporter Start appears required
- tool prompts for an unexpected board/device
- device screen is abnormal before test
- iPhone connection cannot be restored
- any raw secret/device ID would be recorded
- motion/dance/camera/voice/mic would be activated

---

## Safety Boundary

```text
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
custom_firmware_written: false
stackchan_controlled: false
motion_dance_used: false
monitoring_camera_used: false
voice_mic_camera_used: false
external_api_write: false
productionReady: false
execution: disabled
rawValuesReported: false
```

---

## Required Future GO Shape

Any future restore or test write request must include:

```text
gate_id:
date:
time_window:
tool:
firmware_name:
firmware_version:
target_device:
port:
baud_rate:
expected_screen_after:
rollback_method:
stop_conditions:
evidence_file:
motion_allowed: false
voice_mic_camera_allowed: false
raw_secret_exclusion: true
```

Without this GO shape, all write/restore actions remain HOLD.


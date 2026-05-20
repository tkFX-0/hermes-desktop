# SC-FACE-01 Official Face Capability Check

date: 2026-05-20
result: HOLD
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the official-app / Factory Firmware face capability check
boundary for StackChan / CoreS3.

No additional Burn was performed for this check.
No Erase was performed.
Firmware Exporter Start was not performed.
No custom firmware was installed.
No Shikishima automatic control was enabled.

---

## Purpose

Determine how far face, expression, or display changes can go using only the
official app / Factory Firmware path.

This check must distinguish:

- official preset expression changes
- custom image upload support
- 320 x 240 image constraints
- whether custom firmware is required

---

## Check Results

| Check | Result | Notes |
|---|---|---|
| official_app_face_menu | unconfirmed | requires iPhone app screen confirmation |
| preset_expression_change | unconfirmed | do not assume PASS |
| custom_image_upload | unconfirmed | do not upload image without separate GO |
| screen_size_hint | unconfirmed | expected display target may be 320 x 240, but must be confirmed |
| stackchan_display_changed | unconfirmed | no new display change test performed in this task |
| iphone_connection_preserved | confirmed_before_face_check | reconnect was already confirmed after firmware write |
| com5_preserved | confirmed_before_face_check | COM5 remained visible after firmware write |
| custom_firmware_required | unknown | depends on official app capability result |

Result:

```text
SC-FACE-01: HOLD
```

Reason:

The official app face/expression menu has not yet been visually confirmed in
this repo evidence. Further confirmation should be performed manually without
additional Burn or custom firmware.

---

## Next Manual Check Template

Human should check the official iPhone app and report only redacted results:

```text
official_app_face_menu: PASS / FAIL
preset_expression_change: PASS / FAIL
custom_image_upload: PASS / FAIL
screen_size_hint: PASS / FAIL / UNKNOWN
stackchan_display_changed: PASS / FAIL
iphone_connection_preserved: PASS / FAIL
com5_preserved: PASS / FAIL
custom_firmware_required: YES / NO / UNKNOWN
```

Do not report:

- raw device ID
- serial-like identifiers
- Wi-Fi SSID/password
- token
- local-only path
- private network value

---

## Forbidden During SC-FACE-01

- firmware re-write
- erase
- Firmware Exporter Start
- custom firmware installation
- Shikishima face actual deployment
- automatic control
- physical motion control
- voice / mic / camera integration
- external API write

---

## Next Recommended Gate

If official app supports custom or preset face changes:

```text
SC-FACE-02 320x240 face asset spec
```

If official app does not support the needed changes:

```text
SC-FACE-03 custom firmware feasibility
```

Both remain HOLD until separate human GO.


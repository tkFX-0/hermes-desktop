# SC-AI Camera Comment Roadmap

date: 2026-05-21
status: ROADMAP
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This roadmap defines a safe route for StackChan camera-based AI comments.
It is planning only.

No camera monitoring, stream recording, microphone use, identity recognition,
external API write, firmware write, productionReady true, or execution enabled
is approved here.

---

## Target

```text
SC-CAM-01:
  one still image
  user confirms image is safe
  AI gives one general comment
  no person identification
  no continuous monitoring
  no recording
```

Default question:

```text
この1枚の画像を見て、安全に一般的な感想を一文で述べてください。
個人情報や人物特定はしないでください。
```

---

## Route Candidates

### Route A - iPhone App Monitoring Camera

- use the official app only for manual camera view confirmation
- if allowed, human manually provides one safe still image

Still HOLD:

- continuous monitoring
- recording
- auto upload
- face/person identification

### Route B - PC / Local Still Capture

- identify whether a single frame can be captured safely without stream mode

Required before any test:

- user confirms image is safe
- one image only
- no private screens/credentials
- evidence path defined

Still HOLD:

- persistent camera access
- background capture
- cloud upload without separate GO

### Route C - Firmware / Custom App

Only if Route A/B cannot provide one safe still image route.

```text
custom_firmware_required: possible
build: HOLD
flash: HOLD
Burn: HOLD
Erase: HOLD
```

---

## Capability Fields To Confirm

```text
iphone_camera_view:
still_image_capture_possible:
pc_camera_access_possible:
continuous_stream_required:
custom_firmware_required:
privacy_risk:
safest_next_route:
```

---

## Privacy Rules

- no identity recognition
- no face identification
- no private screen reading
- no credential capture
- no continuous recording
- one still image only
- user confirms the image is safe before AI analysis
- evidence records must be redacted if device IDs or private data appear

---

## Deferred Items

| Item | Status | Why |
|---|---|---|
| Continuous camera monitoring | HOLD | privacy and unattended capture |
| Monitoring camera automation | HOLD | continuous input risk |
| Person/face identification | BLOCKED | not part of Shikishima use case |
| STT + camera conversation loop | HOLD | microphone + camera + loop |
| Cloud vision API route | HOLD | external API and privacy gate |
| Firmware camera app | HOLD | custom firmware and device risk |

---

## Next Gate

```text
gate: SC-CAM-01
name: camera still image one-shot comment
status: DRAFT / NOT APPROVED
requires:
  - time_window
  - route_selected
  - image_source
  - user_privacy_confirmation
  - exact_question_to_ai
  - evidence_file
```

---

## Safety Boundary

```text
camera_monitoring_started: false
still_image_captured_by_task: false
identity_recognition: false
microphone_used: false
firmware_written: false
external_api_write: false
productionReady: false
execution: disabled
```


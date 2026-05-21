# SC-AI Voice Integration Roadmap

date: 2026-05-21
status: ROADMAP
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This roadmap defines a safe route for making StackChan speak through
Shikishima in the future. It is planning only.

No voice output, microphone, STT, external TTS API, Discord Bot, firmware
write, servo motion, productionReady true, or execution enabled is approved
here.

---

## Target

```text
SC-AI-01:
  one fixed text voice output
  exact human-approved text only
  one-shot
  no loop
  no mic
  no motion
  no camera
```

Default candidate text:

```text
しきしまです。StackChan音声の接続確認です。
```

---

## Route Candidates

### Route A - iPhone App / StackChan World

- confirm whether current official app can trigger speech
- prefer preset or exact text only
- avoid custom firmware

Still HOLD:

- arbitrary conversation
- microphone input
- motion / dance

### Route B - PC Bridge / Serial

- determine whether current firmware accepts a safe text-to-speech command
- use only documented command path if available

Required before any test:

- command format reviewed
- allowed run count = 1
- text fixed in GO form
- gate restores to HOLD

Still HOLD:

- arbitrary serial command surface
- command loop
- servo control
- raw COM/device ID output

### Route C - Firmware / Custom App

Only if Route A/B cannot speak fixed text safely.

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
iphone_voice_output:
arbitrary_text_speech:
pc_text_to_speech_possible:
current_firmware_support:
custom_firmware_required:
safest_next_route:
```

---

## Deferred Items

| Item | Status | Why |
|---|---|---|
| Cron scheduled speech | HOLD | scheduler + unattended output |
| LLM scheduled speech | HOLD | external AI + loop risk |
| STT voice conversation | HOLD | microphone + continuous interaction |
| Hermes voice conversation frontend | HOLD | Hermes connection + mic/TTS loop |
| Cloud TTS API | HOLD | external API/token boundary |
| Discord Bot speech push | HOLD | external service + token/message boundary |
| Lip sync | HOLD | depends on voice route and display/firmware support |
| Servo head movement while speaking | HOLD | physical motion gate |

---

## Next Gate

```text
gate: SC-AI-01
name: fixed text voice one-shot route check
status: DRAFT / NOT APPROVED
requires:
  - time_window
  - route_selected
  - exact_text_to_speak
  - expected_output
  - evidence_file
```

---

## Safety Boundary

```text
voice_output_performed: false
microphone_used: false
stt_started: false
cron_started: false
firmware_written: false
servo_motion_used: false
external_api_write: false
productionReady: false
execution: disabled
```


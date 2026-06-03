# SC-REF-01 StackChan X Issue Reference Intake

date: 2026-05-21
status: REFERENCE_INTAKE
source: user-provided summary of an X post by @hfujikawa77
source_access: no X browsing, no X login, no X API
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document converts the user-provided StackChan implementation issue list
into a Shikishima integration roadmap. It is a reference intake only.

This document does not approve firmware build, flash, Burn, Erase, Firmware
Exporter Start, camera monitoring, microphone use, servo motion, scheduled
speech, cloud API connection, productionReady true, or execution enabled.

---

## Input Summary

The provided reference list includes:

- scheduled speech mode with fixed message / LLM
- mic music reaction neck movement
- settings UI on device and Web settings server
- head pat reaction
- idle LED effect
- conversation history bubble scroll
- face animation: blink / lip sync / expression
- servo control integration
- Cron scheduled speech
- CoreS3 speech push API and Discord Bot integration
- STT and Hermes voice conversation frontend
- ttsQuestV3Voicevox cloud API Japanese TTS for stackchan-arduino
- stackchan-arduino build environment and Hermes LLM connectivity

---

## Classification

### Safe Now

| Item | Classification | Notes |
|---|---|---|
| Docs/reference intake | SAFE_NOW | This document only. |
| Voice route planning | SAFE_NOW | No speech output yet. |
| One-shot fixed text speech planning | SAFE_NOW | GO form only. |
| One-shot camera still comment planning | SAFE_NOW | GO form only; no camera monitoring. |
| Face animation roadmap | SAFE_NOW | Planning only; no firmware write. |
| Settings UI review plan | SAFE_NOW | Planning only; no Web server start. |

### HOLD

| Item | Status | Reason |
|---|---|---|
| Cron scheduled speech | HOLD | periodic external/device behavior |
| LLM scheduled speech | HOLD | external model call + scheduler |
| Mic always-on | HOLD | audio privacy and continuous input |
| STT continuous conversation | HOLD | microphone + loop + external AI |
| Servo movement / neck reaction | HOLD | physical device motion |
| Motion / dance | HOLD | physical actuation |
| Camera continuous monitoring | HOLD | privacy and continuous capture |
| CoreS3 speech push API | HOLD | network/API/device command surface |
| Discord Bot integration | HOLD | external service + token + message surface |
| Cloud TTS API | HOLD | external API and possible token/config |
| Firmware flash/write | HOLD | device recovery and brick risk |
| Build environment activation | HOLD | build-only GO required first |

---

## Shikishima Integration Implication

The safe sequence is:

1. SC-AI-00: voice capability check and route planning
2. SC-AI-01: fixed text voice one-shot GO form
3. SC-CAM-00: camera comment capability check and privacy route planning
4. SC-CAM-01: one still image to one AI comment GO form
5. SC-FACE continuation: blink / lip-sync / expression planning, no firmware write
6. Later only: build-only check, then firmware write gate if still needed

---

## Recommended Next Gate

```text
next_recommended_gate: SC-AI-01 fixed text voice one-shot route check
scope: one exact text only
loop: false
motion: false
camera: false
firmware_write: false
productionReady: false
execution: disabled
```

---

## Safety Boundary

```text
burn_performed: false
firmware_written: false
camera_monitoring_started: false
microphone_used: false
servo_motion_used: false
external_api_write: false
productionReady: false
execution: disabled
git_push_performed: false
```


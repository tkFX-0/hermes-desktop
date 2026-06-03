# Shikishima v8 Audio / Camera / Microphone HOLD Policy — v2.8.5

## Purpose

Documents the HOLD policy for audio, camera, and microphone throughout v8 and earlier stages.

- documentVersion: v2.8.5 / decision: HOLD / execution: disabled / productionReady: false

---

## Current Status

```
audio playback (TTS): HOLD — G-15 not issued
microphone (STT): HOLD — G-15 + G-16 not issued
camera: HOLD — G-16 not issued
audioContext: HOLD
getUserMedia: HOLD
```

---

## HOLD Conditions

| Resource | Gate Required | Current State |
|---|---|---|
| Audio playback | G-15 | HOLD |
| TTS engine execution | G-15 | HOLD |
| STT engine execution | G-15 + G-16 | HOLD |
| Microphone access | G-16 | HOLD |
| Camera access | G-16 | HOLD |
| Wake-word detection | G-15 + G-16 + additional | HOLD |
| Cloud TTS/STT API | G-15 + network GO | HOLD |
| StackChan audio output | G-14 + G-15 | HOLD |

---

## Code-Level HOLD Policy

Any use of the following is FORBIDDEN until the specified gate is issued:

```typescript
// FORBIDDEN without G-15:
new Audio(...)
new AudioContext()
audioElement.play()
speechSynthesis.speak(...)

// FORBIDDEN without G-16:
navigator.mediaDevices.getUserMedia(...)
navigator.mediaDevices.getDisplayMedia(...)

// FORBIDDEN without G-15 + G-16:
// Any STT/TTS pipeline integration
```

If any of these appear in code review: remove before commit.

---

## What Is Allowed (no gate required)

| Allowed | Notes |
|---|---|
| Display voiceIntentLabel text | Static label; no audio |
| Mouth animation (timer) | No audio sync |
| Eye gaze animation (timer) | No camera |
| Describing voice concept in docs | Always allowed |

---

## G-15 Pre-Conditions (for future use)

Before G-15 can be issued:
- [ ] v8 display-only animation validated
- [ ] TTS concept plan reviewed (V8_VOICE_MOUTH_EYE_NON_IO_PLAN.md)
- [ ] Audio safety review: no unintended speaker output
- [ ] Local-only TTS (no cloud API) or approved cloud API
- [ ] Human GO issued

この範囲では問題を検出していません。

# Shikishima v8 Voice / Mouth / Eye Non-I/O Plan — v2.5.0

## Purpose

Defines voice, mouth, and eye integration plans for v8 without audio I/O.
Voice I/O requires G-15/G-16. This document covers only non-I/O display concepts.

- documentVersion: v2.5.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## v8 Scope: What Is Non-I/O

| Category | Non-I/O (allowed now) | Requires GO |
|---|---|---|
| Mouth animation | Timer-based display animation | G-15 for audio sync |
| Eye gaze | Timer-based pattern | G-16 for camera |
| voiceIntentLabel | Text label display | G-15 for real intent |
| Voice concept plan | Document only | G-15 for execution |
| TTS concept | Document only | G-15 for audio output |
| STT concept | Document only | G-15 + G-16 for mic |

---

## Voice Intent System (display-only concept)

voiceIntent is the label that shows what voice-related state しきしま is in.

| voiceIntentLabel | Meaning | Source (v8 display) | Source (v9+) |
|---|---|---|---|
| `idle` | Not voice-active | Static default | Hermes state |
| `listening` | Awaiting voice input | Display label only | Real STT |
| `speaking` | Generating voice output | Display label only | Real TTS |
| `thinking` | Processing | Display label only | Hermes reasoning |
| `error` | Voice error | Display label only | Error state |

**In v8 display mode**: labels are set by timer or manual prop. No real audio.
**In v9+ pilot mode**: labels driven by real Hermes voice pipeline (G-15 required).

---

## TTS Concept Plan (no execution)

Text-to-Speech plan for future v8 execution (requires G-15):

| Aspect | Plan |
|---|---|
| Engine | System TTS (Windows SAPI) or local TTS model |
| Output | Local speaker only; no cloud TTS API |
| Trigger | Hermes output text → TTS pipeline |
| Rate control | Configurable; default 1.0 |
| Language | Japanese (ja-JP) primary |
| Privacy | No audio recorded; no cloud upload |
| Error handling | Fallback to silent mode (display label only) |

TTS execution requires G-15. This is plan-only.

---

## STT Concept Plan (no execution)

Speech-to-Text plan for future v8/v9 execution (requires G-15 + G-16):

| Aspect | Plan |
|---|---|
| Engine | Local STT (whisper.cpp or similar) or Windows Speech Recognition |
| Input | Local microphone only |
| Output | Text transcript → Hermes input pipeline |
| Privacy | No audio stored or sent externally |
| Activation | Push-to-talk or wake-word (wake-word requires separate review) |
| Error handling | Fallback to text input mode |

STT execution requires G-15 + G-16. This is plan-only.

---

## Mouth-Voice Synchronization Concept (no audio)

When TTS is enabled (G-15 future):

```
TTS audio buffer → amplitude analysis → mouthPattern selector → display
```

Without TTS (current display mode):
```
timer interval → mouthPattern cycle → display
```

The same mouth display component works in both modes.
Current implementation: timer-only. Audio sync: HOLD.

---

## Eye Gaze Attention Concept (no camera)

When camera is enabled (G-16 future):
```
camera frame → face detection → attention target → gazeTarget update
```

Without camera (current display mode):
```
timer-based pattern → gazeTarget cycle → display
```

Current implementation: timer-only. Camera sync: HOLD.

---

## Face-Voice Synchronization Display Concept

The face terminal should visually indicate voice state even without real audio:

```
voiceIntent = idle:
  mouth = closed
  gaze = center / slow natural movement
  energy = 0.2

voiceIntent = listening:
  mouth = small-open (gentle pulse)
  gaze = forward
  energy = 0.5

voiceIntent = speaking:
  mouth = talking-timer animation
  gaze = slight natural movement
  energy = 0.8
```

These are display-only mappings. Real audio data not required.

---

## What Remains HOLD for v8

| Item | Gate |
|---|---|
| Audio playback (TTS) | G-15 |
| Microphone recording | G-16 |
| Wake-word detection | G-15 + G-16 + additional review |
| Cloud STT/TTS API | G-15 + network GO |
| Real voice intent from Hermes | G-12 + G-15 |
| StackChan audio output | G-14 + G-15 |

この範囲では問題を検出していません。

# Shikishima v8 Non-I/O Expression Implementation Pack — v2.8.5

## Purpose

Complete preparation for v8 non-I/O expression implementation.
No audio, no camera, no microphone in this document.

- documentVersion: v2.8.5 / decision: HOLD / execution: disabled / productionReady: false

---

## v8 Goal

Validate mouth/eye/voice concept animations in display without audio I/O.
Audio requires G-15. Camera requires G-16.

## Entry Conditions

- [ ] v7 complete (face display working on StackChan)
- [ ] Human GO for v8

## Non-I/O Implementation Status

| Component | Implementation | Status |
|---|---|---|
| Mouth animation (timer) | Spec created (V8_MOUTH_EYE_ANIMATION_SPEC.md) | Ready to code |
| Eye gaze animation (timer) | Spec created | Ready to code |
| Blink cycle | Spec created | Ready to code |
| voiceIntentLabel display | Spec created | Ready to code |
| Audio-driven mouth | V8_VOICE_MOUTH_EYE_NON_IO_PLAN.md | HOLD (G-15) |
| Camera-driven gaze | V8_VOICE_MOUTH_EYE_NON_IO_PLAN.md | HOLD (G-16) |
| TTS execution | Concept only | HOLD (G-15) |
| STT execution | Concept only | HOLD (G-15+G-16) |

## What Can Be Implemented Now

1. `MouthAnimationComponent` — timer-driven frame cycle; no audio
2. `EyeGazeComponent` — timer-driven gaze offset; no camera
3. `BlinkLayer` — periodic blink via `setInterval`; CSS opacity
4. `VoiceIntentLabel` — static text label; props-only

All components: display-only; no IPC; no fetch; no audio/video/canvas.

## v8 Exit Conditions

- [ ] Mouth animation renders correctly (timer mode)
- [ ] Eye gaze animates correctly (timer mode)
- [ ] Blink cycle works
- [ ] Voice intent labels display correctly
- [ ] No audio accessed during v8 display-only phase
- [ ] V9 Readiness Package created
- [ ] Human GO for v9

この範囲では問題を検出していません。

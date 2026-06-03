# Shikishima v8 Mouth / Eye Animation Specification — v2.5.0

## Purpose

Defines the mouth and eye animation system for display-only rendering.
No audio I/O, no camera, no real-time data source.
This is a design specification for static/timer-based display animation.

- documentVersion: v2.5.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Animation System Overview

The animation system produces:
1. **Mouth animation**: frame-by-frame mouth shape driven by timer or manual trigger
2. **Eye/gaze animation**: smooth gaze direction change; blink cycle

**All animations are display-only.**
- No audio input drives mouth animation (audio I/O requires G-15/G-16)
- No camera input drives gaze (camera requires G-16)
- No voice API involved
- No real-time external data

---

## Mouth Animation

### Mouth Frames

| Frame | mouthPattern | Duration (ms) |
|---|---|---|
| 0 | `closed` | 200 |
| 1 | `small-open` | 150 |
| 2 | `wide-open` | 100 |
| 3 | `small-open` | 150 |
| 4 | `closed` | 200 |

### Animation Modes

| Mode | Driver | Status |
|---|---|---|
| `idle` | Static; mouth closed | Available now |
| `talking-timer` | Frame cycle on interval | Available now (no audio) |
| `talking-audio` | Audio amplitude input | HOLD — G-15 required |

### Implementation (display-only, no audio)

```typescript
// display-only mouth animation — no audio dependency
// driven by requestAnimationFrame or setInterval
const MOUTH_CYCLE = ['closed', 'small-open', 'wide-open', 'small-open', 'closed'];
const MOUTH_DURATIONS = [200, 150, 100, 150, 200]; // ms per frame
```

This implementation is safe for v7 (display-only). Audio sync is deferred to v8.

---

## Eye / Gaze Animation

### Gaze Transition

Eye gaze changes smoothly between target positions.

| Transition | Duration | Easing |
|---|---|---|
| Center → Left | 300ms | ease-out |
| Center → Right | 300ms | ease-out |
| Any → Up | 250ms | ease-in-out |
| Any → Down | 250ms | ease-in-out |
| Any → Blink | 80ms | linear |
| Blink → Open | 100ms | ease-out |

### Blink Cycle

```
blink interval: random 3000–6000ms
blink duration: 80ms closed + 100ms open = 180ms total
```

### Gaze Attention Pattern (timer-based, no camera)

For display-only mode, gaze follows a preset attention pattern:

```
0s–5s:  center
5s–8s:  slight right
8s–12s: center
12s–15s: slight left
15s–20s: center
[repeat]
```

Camera-driven gaze attention: HOLD — G-16 required.

---

## Expression Timing System

Expressions transition smoothly via CSS transition or requestAnimationFrame:

| expressionId | Duration | Trigger |
|---|---|---|
| `neutral` → any | 400ms fade | programmatic |
| any → `thinking` | 500ms | programmatic |
| any → `hold` | 200ms | state change |
| any → `disabled` | 200ms | state change |

---

## Voice Intent Display (no audio, label only)

The `voiceIntentLabel` field is a text label displayed in the face terminal.
In v7/v8 display-only mode:

| voiceIntentLabel | Source | Audio? |
|---|---|---|
| `idle` | Static default | No |
| `listening` | Display label only — NOT real mic input | No |
| `speaking` | Display label only — NOT real TTS output | No |

Real audio binding requires G-15.

---

## Component Implementation Guidelines

For the face terminal React component (display-only):

```
FaceTerminal
├── EyeComponent (SVG dots + gaze offset)
│   └── BlinkLayer (opacity 0/1 transition)
├── MouthComponent (SVG path animation)
├── ExpressionLabel (text)
├── VoiceIntentLabel (text, display-only)
└── SafetyBadges
    ├── "execution: disabled"
    ├── "robotMotion: HOLD"
    └── "productionReady: false"
```

**No fetch, no IPC calls, no audio, no canvas, no video in this component.**

---

## What Requires Additional GOs (not in spec yet)

| Feature | Required Gate |
|---|---|
| Audio-driven mouth animation | G-15 |
| Microphone gaze attention | G-16 |
| TTS integration | G-15 |
| STT integration | G-15 + G-16 |
| StackChan mouth sync | G-14 + G-22 (motion) |
| Real-time Hermes state in face | G-12 + additional GO |

この範囲では問題を検出していません。

# Shikishima v7 Face Terminal Display-Only Specification — v2.5.0

## Purpose

Defines the face terminal display system specification for v7.
Display-only means: no device connection, no execution, no motion.
This is a design specification document.

- documentVersion: v2.5.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD

---

## Face Terminal Overview

The face terminal is a display surface for しきしま's face expression system.
It outputs visual state only — no input accepted, no motion commanded.

**Display targets** (each requires separate GO):
1. In-app renderer (Electron window) — no separate GO for display only
2. Smartphone browser (web URL) — separate device GO
3. StackChan screen — G-14 required

---

## Face State Model

The face terminal renders the following state fields:

| Field | Type | Description |
|---|---|---|
| `expressionId` | string | Current expression key (e.g., `neutral`, `thinking`, `pleased`) |
| `mouthPattern` | string | Mouth shape key (e.g., `closed`, `small-open`, `wide-open`) |
| `gazeTarget` | string | Gaze direction (e.g., `center`, `left`, `right`, `up`, `down`) |
| `blinkState` | boolean | Current blink state |
| `voiceIntentLabel` | string | Display label only (e.g., `listening`, `speaking`, `idle`) |
| `energyLevel` | number 0–1 | Visual energy indicator |

**All fields are display-only labels. They do NOT represent:**
- Real-time connection status
- Live Hermes state
- Execution readiness
- productionReady status

---

## Expression Set (Static)

| expressionId | Display Name | Visual Hint |
|---|---|---|
| `neutral` | Neutral | Relaxed dot-line face |
| `thinking` | Thinking | Upward gaze; slight asymmetry |
| `pleased` | Pleased | Slight upward mouth curve |
| `focused` | Focused | Narrowed eyes; center gaze |
| `alert` | Alert | Wide eyes; forward gaze |
| `tired` | Tired | Half-closed eyes; drooped mouth |
| `hold` | HOLD | Static; labeled "HOLD" |
| `disabled` | Disabled | Dim; labeled "execution: disabled" |

---

## Mouth Pattern Set (Static)

| mouthPattern | Description |
|---|---|
| `closed` | Flat line |
| `small-open` | Small gap |
| `wide-open` | Larger opening |
| `talking-1` | Frame 1 of talk animation |
| `talking-2` | Frame 2 of talk animation |
| `talking-3` | Frame 3 of talk animation |

**Mouth animation is display-only. No audio synchronization at v7.**

---

## Gaze Pattern Set (Static)

| gazeTarget | Description |
|---|---|
| `center` | Looking forward |
| `left` | Slight left |
| `right` | Slight right |
| `up` | Looking upward |
| `down` | Looking downward |
| `blink` | Mid-blink frame |

---

## Face Terminal Layout (concept)

```
┌─────────────────────────┐
│     [HOLD] しきしま      │
│                          │
│    (  •  )  (  •  )      │  ← eye dots
│         ‾‾‾‾            │  ← gaze line
│         ── ──            │  ← mouth
│                          │
│  expression: neutral     │
│  voice: idle             │
│  execution: disabled     │
│  robotMotion: HOLD       │
└─────────────────────────┘
```

---

## What Is Displayed vs What Is NOT

| Displayed | NOT Displayed |
|---|---|
| expressionId label | Live Hermes state |
| mouthPattern label | Real connection status |
| voiceIntentLabel | Running / executing status |
| "execution: disabled" | Any GO indicator |
| "robotMotion: HOLD" | productionReady indicator |
| "StackChan: not connected" | Live device feed |

---

## Face Terminal Safety Labels

All face terminal displays must include:

```
[実行不可 / execution: disabled]
[robotMotion: HOLD]
[productionReady: false]
```

These labels are required as long as execution remains disabled.

---

## Implementation Notes (v7 scope)

- Implement as a static React component in `src/renderer/src/screens/` (no IPC, no fetch)
- Props-only: all state passed as static props; no live data binding
- No `useEffect` that calls IPC or external endpoint
- No `button`, `input`, `form` elements
- Styling: Tailwind CSS or inline; dark theme matching existing app
- No canvas, video, audio elements

**IPC restriction**: Face terminal must NOT add any new IPC channel.
Existing `ichikishimaControlCenter` channels remain read-only unchanged.

この範囲では問題を検出していません。

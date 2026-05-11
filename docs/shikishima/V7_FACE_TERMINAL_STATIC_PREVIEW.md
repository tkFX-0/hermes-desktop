# Shikishima v7 Face Terminal Static Preview — v2.5.0

## Purpose

Provides static ASCII / text previews of face terminal expressions.
These previews are display-only references. Not executable. Not live.

- documentVersion: v2.5.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Face Terminal: Neutral

```
┌──────────────────────────┐
│         しきしま          │
│                           │
│    ⬤              ⬤     │
│         ────────          │
│         ──────            │
│                           │
│  expression: neutral      │
│  voice: idle              │
│  execution: disabled      │
│  robotMotion: HOLD        │
└──────────────────────────┘
```

---

## Face Terminal: Thinking

```
┌──────────────────────────┐
│         しきしま          │
│                           │
│  ⬤                  ⬤  │
│    ↑gaze        ↑gaze    │
│         ──────            │
│         ──────            │
│                           │
│  expression: thinking     │
│  voice: idle              │
│  execution: disabled      │
│  robotMotion: HOLD        │
└──────────────────────────┘
```

---

## Face Terminal: Pleased

```
┌──────────────────────────┐
│         しきしま          │
│                           │
│    ⬤              ⬤     │
│         ────────          │
│         ╰──────╯          │   ← slight curve up
│                           │
│  expression: pleased      │
│  voice: idle              │
│  execution: disabled      │
│  robotMotion: HOLD        │
└──────────────────────────┘
```

---

## Face Terminal: Alert

```
┌──────────────────────────┐
│         しきしま          │
│                           │
│    ◎              ◎     │   ← wide eyes
│         ────────          │
│         ──────            │
│                           │
│  expression: alert        │
│  voice: idle              │
│  execution: disabled      │
│  robotMotion: HOLD        │
└──────────────────────────┘
```

---

## Face Terminal: HOLD State

```
┌──────────────────────────┐
│  ⚠ HOLD  HOLD  HOLD  ⚠  │
│                           │
│    —              —      │   ← dots inactive
│         ── ──             │
│         ──────            │
│                           │
│  [HOLD]                   │
│  execution: disabled      │
│  productionReady: false   │
│  robotMotion: HOLD        │
└──────────────────────────┘
```

---

## Mouth Pattern Previews

| Pattern | Preview |
|---|---|
| closed | `────────` |
| small-open | `──╮  ╭──` |
| wide-open | `╰────────╯` |
| talking-1 | `──╮╭──` |
| talking-2 | `─╰──╯─` |
| talking-3 | `──────` |

---

## Gaze Direction Previews

```
center:        ⬤  ⬤
left:        ⬤  ⬤     (offset left)
right:           ⬤  ⬤  (offset right)
up:         ˙⬤  ⬤˙    (offset up)
down:       .⬤  ⬤.    (offset down)
blink:      ─────────  (closed line)
```

---

## Energy Level Indicator

```
energy 0.0:  □□□□□□□□□□
energy 0.3:  ███░░░░░░░
energy 0.6:  ██████░░░░
energy 1.0:  ██████████
```

---

## voiceIntentLabel Previews (display-only)

```
idle:       [ idle ]
listening:  [ listening ]    ← display label only; NOT real mic input
speaking:   [ speaking ]     ← display label only; NOT real TTS output
```

---

## Safety Label Variants

All face terminal displays include one of:

```
Variant A (minimal):
  [execution: disabled]

Variant B (standard):
  [execution: disabled]  [robotMotion: HOLD]

Variant C (full):
  [execution: disabled]  [robotMotion: HOLD]  [productionReady: false]
```

Variant C is required during v7 and v8. Can be reduced at v10 post G-18.

この範囲では問題を検出していません。

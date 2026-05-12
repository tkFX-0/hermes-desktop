# Shikishima v8 Voice Intent Label Review Sheet — v2.8.5

## Purpose

Review sheet for voiceIntentLabel display implementation.
Labels are display-only. No audio, no real voice state.

- documentVersion: v2.8.5 / decision: HOLD

---

## voiceIntentLabel Values

| Label | Display | Real source (v9+) | v8 source |
|---|---|---|---|
| `idle` | `[ idle ]` | Hermes idle | Static default |
| `listening` | `[ listening ]` | Real STT | Display label only |
| `speaking` | `[ speaking ]` | Real TTS | Display label only |
| `thinking` | `[ thinking ]` | Hermes reasoning | Display label only |
| `error` | `[ error ]` | Error state | Display label only |

## CRITICAL: Label ≠ Real State

The voiceIntentLabel in v8 is a display prop, NOT a real state indicator.

| Misconception | Reality |
|---|---|
| `listening` = mic active | NO — label only; mic NOT active (G-16 required) |
| `speaking` = audio playing | NO — label only; audio NOT playing (G-15 required) |
| `thinking` = Hermes processing | NO — label only; Hermes NOT connected in v8 |

## Required Safety Label Near voiceIntentLabel

```
[ voice intent: [label] ]
⚠ display-only — no audio I/O active
```

## Implementation Review

| Item | Check |
|---|---|
| Label set from props only | Yes |
| No `navigator.mediaDevices.getUserMedia()` | Confirmed |
| No `new Audio()` or `AudioContext` | Confirmed |
| Safety disclaimer rendered alongside label | Yes |
| No "LIVE" or "ACTIVE" suffix on label | Confirmed |

## Before v8 Review Sign-off

- [ ] All 5 label values render correctly
- [ ] Disclaimer visible: "display-only — no audio I/O active"
- [ ] No audio device accessed during label display
- [ ] No microphone accessed
- [ ] Transition between labels smooth

この範囲では問題を検出していません。

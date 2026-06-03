# StackChan Active Control Boundary

Date: 2026-05-28
Companion: `STACKCHAN_ACTIVE_CONTROL_CHAPTER_DESIGN.md`

---

## Delegation Model

| commandClass | Delegated route | Execution default |
|--------------|-----------------|-------------------|
| display | `sendStackChanDisplayOnce` | ACCEPTED chapter |
| motion | `sendStackChanMotionOnce` | guarded + env flag |
| voice | `sendStackChanVoiceOnce` | guarded + env flag |
| dance | — | BLOCKED |
| touch | — | BLOCKED |
| firmware | — | BLOCKED |
| mic / camera / autonomous | — | BLOCKED |

Evaluator: `evaluateStackChanActiveControlRoute` in `src/shared/stackchan-active-control-route/`.

---

## Safety Invariants (all chapters)

```text
safety.motionAllowed: false (type-level; does not imply device permission)
safety.voiceAllowed: false
productionReady: false
execution: disabled
```

Pilot env flags (separate per class):

```text
STACKCHAN_DISPLAY_PILOT_SEND=1
STACKCHAN_MOTION_PILOT_SEND=1
STACKCHAN_VOICE_PILOT_SEND=1
```

---

## Forbidden

```text
Chaining display + motion + voice in one pilot
Free-form user text in voice pilot path
Unguarded stackchanSayLocal / stackchanDanceLocal from autonomy zone
```

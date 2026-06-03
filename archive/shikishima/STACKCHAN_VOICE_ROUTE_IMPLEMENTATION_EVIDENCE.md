# StackChan Voice Route Implementation Evidence

Date: 2026-05-28

---

## Result

```text
status: IMPLEMENTED
function: sendStackChanVoiceOnce
transport: mock | guarded-ws (VOICEVOX + PCM one-shot)
env: STACKCHAN_VOICE_PILOT_SEND=1
```

---

## Allowlisted Intents

```text
STACKCHAN_VOICE_PILOT_ACK → fixed phrase (phraseId only in evidence)
```

---

## Pilot

See `STACKCHAN_VOICE_PILOT_EVIDENCE.md`.

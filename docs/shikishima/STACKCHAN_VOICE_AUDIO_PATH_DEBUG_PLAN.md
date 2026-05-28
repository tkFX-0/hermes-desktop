# StackChan Voice Audio Path Debug Plan

Date: 2026-05-28  
Status: PLAN (no automatic retry)

---

## Human observation

```text
mouth_motion_visible: true
voice_audible: false
```

Transport reported send ok; audible output not confirmed.

---

## Likely layers (check in order, read-only first)

| Layer | Check | Record as |
|-------|-------|-----------|
| VOICEVOX | localhost synthesis returns audio bytes | enum only |
| PCM format | 16 kHz mono chunks | spec match |
| WS state | speaking → idle sequence sent | redacted |
| WS binary | PCM frames after state=speaking | count only |
| Device volume | human confirms StackChan output not muted | human |
| Firmware | speaking state without speaker path | visual only |

---

## Architecture note (not Hermes-mediated)

```text
Voice = direct to StackChan body (VOICEVOX on PC → WS PCM).
Hermes/shikishima only chooses intent/phraseId; does not stream audio.
See: STACKCHAN_VOICE_OUTPUT_ARCHITECTURE.md
```

## Comparison: guarded vs legacy (both direct WS)

```text
Guarded: stackchan-voice-guarded-speak.ts (one-shot, fixed phrase)
Legacy: stackchanSayLocal in stackchan-local-service.ts
Both are direct embodiment paths — debug focuses on PCM/binary layer.
```

---

## Next goal (not auto-run)

```text
/goalmacro shikishima.stackchan-voice-audio-path-debug
→ read-only checks + optional one-shot retry with new Human GO + time window
```

---

## Safety

```text
no second send without GO
no raw values in evidence
productionReady: false
execution: disabled
```

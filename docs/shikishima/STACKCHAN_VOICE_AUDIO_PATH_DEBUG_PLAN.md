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

## Comparison: guarded vs legacy

```text
Guarded: stackchan-voice-guarded-speak.ts (one-shot, fixed phrase)
Legacy: stackchanSayLocal in stackchan-local-service.ts
```

Debug rally may compare mock PCM length vs device without logging phrase text.

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

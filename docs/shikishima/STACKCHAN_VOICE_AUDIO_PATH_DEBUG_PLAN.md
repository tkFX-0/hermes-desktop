# StackChan Voice Audio Path Debug Plan

Date: 2026-05-28  
Status: PLAN (no automatic retry)

---

## Human observation

```text
2026-05-26 (latest):
  voice_audible: HOLD (faint/muffled only)
  voicevox_intelligible_on_device: false
  transport_ok: true (explicit 許可GO, no time window)

2026-05-28 (prior):
  mouth_motion_visible: true
  voice_audible: false
```

See: `STACKCHAN_VOICE_PILOT_HUMAN_HOLD_2026-05-26.md`

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
Legacy: stackchanSay / stackchanSayLocal (shikishima-stackchan.mjs, stackchan-local-service.ts)
Both are direct embodiment paths — debug focuses on PCM/binary layer.
```

## Codex design alignment (2026-05-26 review)

### Architecture (`STACKCHAN_VOICE_OUTPUT_ARCHITECTURE.md`)

```text
MATCH: VOICEVOX localhost → PCM 16 kHz → WS :8080 → firmware playRaw
MATCH: Hermes-mediated TTS is out of scope
GAP: guarded pilot not yet at legacy protocol parity (see checklist below)
```

### Firmware (`docs/firmware/shikishima_cores3/src/shikishima_cores3.ino`)

```text
state=speaking  → audioUploadArmed=true (15 s window)
WStype_BIN      → int16 mono append to pcmBuf (only while armed)
state=idle      → playReq if pcmBuf non-empty → M5.Speaker.playRaw @ 16000 Hz, volume 220
NOTE: pcmBuf is NOT cleared on state=speaking entry — stale buffer risk if prior session abnormal
```

### Timing spec (`docs/STACKCHAN_DESIGN.md` F5)

```text
Legacy order: motion → face → speaking → subtitle → 80 ms → PCM chunks → idle → face
Guarded order: nod → face → speaking → subtitle → 80 ms → PCM → idle (partial parity)
Chunk pacing: design legacy 35 ms; guarded now 60 ms (matches 960 samples @ 16 kHz)
```

### Legacy parity checklist (debug / next Rally)

| Item | Legacy `stackchanSay` | Guarded pilot | Impact |
|------|----------------------|---------------|--------|
| subtitle | yes | yes (added) | display + lip sync context |
| pre-motion (emotion/servo) | yes | nod only | low for audio, high for F5 |
| agent face profile | yes | fixed happy | visual only |
| mid-utterance nod | yes | no | visual |
| post-idle servo center | yes | no | visual |
| VOICEVOX speaker/speed | env + UI | env (2026-05-26) | audio timbre |
| PCM buffer slice | same algorithm | fixed int16ToBuffer | muffled if wrong |
| FW pcmBuf clear on speak | n/a (FW) | not in FW | possible corrupt mix |

### Human HOLD (2026-05-26)

```text
faint/muffled audible — suggests PCM reaches speaker but quality/path insufficient
next A/B: legacy !sc say vs guarded (same 許可GO, no auto retry)
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

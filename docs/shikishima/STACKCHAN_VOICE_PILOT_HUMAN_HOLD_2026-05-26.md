# StackChan Voice Pilot — Human HOLD (2026-05-26)

## Human observation (authoritative)

```text
voice_audible: HOLD
quality: faint / muffled (かすれた音)
voicevox_path_intelligible: false (VOICEVOX経由の声も聞こえない)
mouth_motion: reported in prior attempts; not re-confirmed this round
```

## Transport (agent-side, redacted)

```text
explicit_permitted_go: true
time_window: not required (per policy)
transport_ok: true (websocket send performed)
acceptance: NOT_ACCEPTED
```

## Interpretation

```text
- Device speaker path receives some audio (faint) — not silent / not mouth-only
- Intelligible VOICEVOX speech not confirmed on StackChan output
- Phase 1 voice-acceptance remains HOLD
```

## Code fixes prepared (no auto re-send)

| Item | Change |
|------|--------|
| PCM buffer | `int16ToBuffer` with byteOffset/byteLength |
| Resample | linear interpolation to 16 kHz |
| Chunk pacing | 60 ms per 960-sample chunk (real-time) |
| VOICEVOX | speaker/speed from `.env.local`; `volumeScale` floor 1.0 |

## Next human action

```text
1. Confirm VOICEVOX test phrase audible on PC (VOICEVOX app preview) — human only
2. Optional A/B: legacy `!sc say` vs guarded one-shot (new 許可GO only)
3. Report: audible_clear / still_faint / silent
```

## Safety

```text
no automatic retry
productionReady: false
execution: disabled
raw values not reported
```

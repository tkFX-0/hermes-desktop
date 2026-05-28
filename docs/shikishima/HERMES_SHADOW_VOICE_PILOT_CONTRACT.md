# Hermes Shadow Voice Pilot Contract (Track C)

Date: 2026-05-28

## Path rule

```text
Hermes TTS / npm run dev alone  →  NOT StackChan audio
StackChan audible path          →  VOICEVOX on PC → PCM → WS :8080 → firmware playRaw
```

Shadow pilot uses **StackChan path only**. Hermes runtime may stay in SHADOW / not started.

## Env (pilot)

| Env | C2 | C3 |
|-----|----|----|
| `STACKCHAN_VOICE_PILOT_SEND` | `1` | `1` |
| `SHIKISHIMA_SHADOW_VOICE_PILOT` | `1` | `1` |
| `SHIKISHIMA_SHADOW_MODE` | may be `true` (STT server off) | same |
| `SIDEBOT_HOLD` | **unchanged** (no auto bot) | **unchanged** |

## Still HOLD

- Hermes subprocess / WSL real pilot without separate GO
- `SIDEBOT_HOLD` release for Discord bot auto-start
- `productionReady` / `execution` ON

# Explicit Permitted GO Policy（許可GO）

Date: 2026-05-26

## Rule

When the human says **許可GO** (explicit permitted GO):

```text
- Execute the approved one-shot immediately
- Time window declaration is NOT required
- Set explicitPermittedGo: true on StackChan voice/motion/display requests
```

## Code

- `explicitPermittedGo?: boolean` on voice route types
- Bypasses `time_window_declared_required`, `active_time_window_required`, `valid_time_window_required`
- External-effect registry: `explicitPermittedGo` bypasses `time_window_required` for dry-run evaluation

## Operator command (voice one-shot)

```powershell
$env:STACKCHAN_VOICE_PILOT_SEND="1"
$env:STACKCHAN_VOICE_EXPLICIT_GO_PILOT="1"
npm run test -- stackchan-voice-explicit-go-pilot.run.test.ts
```

Requires: VOICEVOX on localhost:50021, StackChan reachable (`.env.local` `STACKCHAN_HOST` if not 127.0.0.1).

Human audible/visual confirmation remains required for acceptance — transport `ok` alone is not PASS.

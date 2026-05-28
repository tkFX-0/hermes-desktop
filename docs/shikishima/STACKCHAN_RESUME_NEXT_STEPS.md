# StackChan Resume — Next Steps (2026-05-28)

Voice pilot **PASS**. StackChan embodiment is no longer blocked on audible acceptance.

## Done

```text
- LAN / IP read fix
- Device WebSocket error visibility
- Human audible PASS (2 plays noted; pilot now skipMilestone)
- FA-05 voice audible (when pipeline voicePass=true)
- G1 connection gap CLOSED (when voicePass + connected)
```

## Still HOLD without new GO

```text
productionReady: false
execution: disabled
SHIKISHIMA_DISCORD_VOICE_BRIDGE
SIDEBOT_HOLD / SHADOW auto voice
Hermes npm run dev as sole voice path
Obsidian auto write
git push
```

## Recommended order

| # | What | Who |
|---|------|-----|
| 1 | Code review: full autonomy Phases 2–10 + master design | **Done** (`FULL_AUTONOMY_REVIEW_2026-05-28.md`) |
| 2 | Enablement roadmap (all blocked items → tasks) | **Done** (`FULL_AUTONOMY_ENABLEMENT_ROADMAP_2026-05-28.md`) |
| 3 | 15m smoke Burn-in → 2h Burn-in | **A1 + A2 PASS** (2026-05-28) |
| 4 | Discord one-shot → auto (optional) | **Human GO** (Track B) |
| 5 | StackChan production voice loop | **Human GO** (Track B3) |
| 6 | Hermes Shadow / SideBot voice | **Human GO** (Track C) |
| 7 | Level 8 + FA-12 declaration | **Human GO** (Track A4; execution still off) |
| 8 | Firmware flash (`audio_test`, `audio.state`) | Human GO only |

Full task table and **許可GO** phrases: `FULL_AUTONOMY_ENABLEMENT_ROADMAP_2026-05-28.md`

## Pipeline entry (no send)

```typescript
import { runFullAutonomyPipeline } from "src/main/shikishima-full-autonomy";

runFullAutonomyPipeline({
  voicePass: true,
  stackchanConnected: true,
  stackchanDeferred: false,
  nowMs: 0
});
```

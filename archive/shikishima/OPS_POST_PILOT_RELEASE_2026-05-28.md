# Post-Pilot Ops Release — SideBot + Hermes daemon

Date: 2026-05-28  
Human GO: **実施してもらっていいです**

---

## Local config (gitignored)

Edit `.shikishima-memory/operational-release.local.json`:

```json
{
  "trackDGoAcknowledged": true,
  "executionEnabled": true,
  "productionReady": true,
  "sidebotHoldReleased": true,
  "hermesDaemonPilotEnabled": true,
  "rawValuesReported": false,
  "activatedAtIso": "2026-05-28T00:00:00.000Z",
  "humanGoNote": "post-pilot ops release"
}
```

---

## What changes

| Flag | Effect |
|------|--------|
| `sidebotHoldReleased` | Electron may auto-start `shikishima-bot.mjs` (even in shadow mode) |
| `hermesDaemonPilotEnabled` | Documented permission to run `npm run dev` manually — **not auto-spawned** |

---

## Verify

```powershell
npx tsx scripts/shikishima-operational-status.mjs
```

---

## Hermes desktop (manual)

```powershell
# VOICEVOX running, .env.local StackChan host set
npm run dev
```

Shadow mode may still HOLD STT/event server inside Electron; SideBot handles Discord when released.

---

## Rollback SideBot only

Set `"sidebotHoldReleased": false` or `SIDEBOT_HOLD=1` (default hold).

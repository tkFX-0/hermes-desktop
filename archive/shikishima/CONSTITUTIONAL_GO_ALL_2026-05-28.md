# Constitutional GO — 全てGO (2026-05-28)

Human instruction: **全てGO**

## Activated scopes (default)

| Scope | Effect |
|-------|--------|
| `obsidian_write` | `library-export` live write to `shikishima-library/30_Evidence/` |
| `discord_read_live` | IPC `shikishima-discord-read` via `discord-read-executor` |
| `discord_send_one_shot` | Per-route one-shot only (no auto spam) |
| `hermes_subprocess` | `hermes-subprocess-bridge` plan; spawn only when dryRun=false |
| `shadow_stt` | `resolveShadowSttOptIn` |
| `stackchan_voice` | Capped scheduler voice route ack |
| `burn_in_wall_clock` | Pipeline burn-in flag acceptance |
| `operational_release` | Works with Track D local file |

**Not automated:** `git_push` — scope may be listed but repo never auto-pushes.

## Activate locally

```powershell
npx tsx scripts/shikishima-constitutional-go-activate.mjs
```

Or env (session only):

```powershell
$env:SHIKISHIMA_CONSTITUTIONAL_ALL_GO="1"
```

## Verify

```powershell
npx vitest run tests/hermes/zone/full-autonomy
npx tsx scripts/shikishima-operational-status.mjs
```

## Safety

- `rawValuesReported` stays false in code paths
- Discord tokens never logged
- FA-12 PASS requires constitutional GO + Level 8 pilot declaration + burn-in + voice PASS

# Track D — Operational Release

Date: 2026-05-28  
Human GO: **どれもやっていいですよ** (D1 push + D2 execution + D3 productionReady)

---

## Activated state

| Item | Value |
|------|-------|
| `execution` | **enabled** (orchestration layer) |
| `productionReady` | **true** (app / ops layer) |
| `rawValuesReported` | **false** |
| Local file | `.shikishima-memory/operational-release.local.json` (gitignored) |
| Code resolver | `operational-release-state.ts` |

---

## Scope boundaries (still guarded)

| Route | Note |
|-------|------|
| StackChan voice device send | Still uses pilot guards (`STACKCHAN_VOICE_PILOT_SEND`, allowlist phrases) |
| Discord REST | Separate route GO per send class |
| EA / MT5 / memory DB | Untouched |
| 24/7 unbounded loops | Not enabled without new GO |

---

## D1 — Git push

Push performed in same session as this doc (see handoff git report).

---

## Rollback

1. Delete or set `executionEnabled`/`productionReady` to `false` in `operational-release.local.json`
2. Or remove `SHIKISHIMA_TRACK_D_GO` env vars
3. Re-run pipeline — should show `execution: disabled` again

# Phase E — Toward Production Full Autonomy

Date: 2026-05-28  
Status: **Phase E modules wired** — constitutional **全てGO** activates live paths (see `CONSTITUTIONAL_GO_ALL_2026-05-28.md`)

Pilot Level 8 is done. Phase E closes gaps for **sustained, bounded, production-grade** autonomy.

---

## Target definition (production full autonomy)

```text
- Scheduler runs bounded cycles with daily/hourly caps
- Secretary / Discord preview maps to guarded StackChan phrases (allowlist)
- Obsidian write: governor + dry-run → separate GO for actual write
- Hermes engine optional path documented; Shadow STT opt-in GO
- No raw leak; execution routes classified; human GO only for constitutional risks
```

---

## Track E tasks

| ID | Task | Status | Human GO for live |
|----|------|--------|-------------------|
| E1 | Secretary phrase allowlist map | **code v1** | no |
| E2 | Autonomous runtime cycle runner (caps) | **code v1** | wall-clock pilot |
| E3 | Obsidian write governor (dry-run) | **code v1** | actual write |
| E4 | Unbounded→capped scheduler integration | **code v1** | per-route |
| E5 | Discord REST read loop (not send) | **executor v1** | constitutional GO |
| E6 | Hermes subprocess bridge (WSL) | **code v1** | constitutional GO |
| E7 | STT/event server under Shadow opt-in | **code v1** | constitutional GO |
| E8 | Production acceptance (FA refresh) | **code v1** | constitutional GO + L8 |

---

## Current open gaps (code)

| Gap | Phase E target |
|-----|----------------|
| G5 Obsidian | E3 dry-run → E3b actual write GO |
| G6 Governor | E4 integration tests |
| Hermes 常駐 | E6 |
| 24/7 voice | E2 caps + E4 |

---

## Commands (dev)

```powershell
npx vitest run tests/hermes/zone/full-autonomy
npx tsx scripts/shikishima-operational-status.mjs
npx tsx scripts/shikishima-autonomous-runtime-tick.mjs autonomy.maintenance
npx tsx scripts/shikishima-autonomous-runtime-tick.mjs discord.read
npx tsx scripts/shikishima-constitutional-go-activate.mjs
```

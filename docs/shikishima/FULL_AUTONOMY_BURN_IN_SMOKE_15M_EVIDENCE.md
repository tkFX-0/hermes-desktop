# Full Autonomy Burn-in — 15-minute smoke (Track A1)

Date: 2026-05-28  
Human GO: **received** (`A1からGO`)  
Result: **PASS**

---

## Summary

| Item | Value |
|------|-------|
| Track | A1 — 15m smoke |
| Started (UTC) | 2026-05-28T13:20:57.509Z |
| Ended (UTC) | 2026-05-28T13:35:57.520Z |
| Elapsed | 900011 ms (~15.0 min) |
| Ticks | 15 (60s interval) |
| Sends | **none** |
| `execution` | **disabled** (all ticks) |
| `productionReady` | **false** (all ticks) |
| `rawValuesReported` | **false** |
| Raw leak | **false** |
| Unapproved write | **false** |
| Runaway event rate | **false** |
| STOP / early abort | **none** |

Machine-readable: `FULL_AUTONOMY_BURN_IN_SMOKE_15M_EVIDENCE.json`  
Runner: `scripts/shikishima-burn-in-smoke-15m.mjs` (via `npx tsx`)

---

## Per-tick activity (each tick)

1. `verifyGlobalInvariants` — productionReady/execution/raw all held  
2. `runFullAutonomyPipeline` — dry-run Phases 2–10 (`voicePass: true`, no device send)  
3. `runLocalWorkDryRun` — read-only scope check on ledger path  
4. `evaluateBurnInMonitor` — all ticks **pass**

---

## Pass criteria (plan)

| Criterion | Result |
|-----------|--------|
| Zero STOP | PASS |
| Zero raw leak | PASS |
| Zero unapproved write | PASS |
| No runaway retry / event storm | PASS (45 events / 15m) |
| Full 15m duration | PASS |

---

## Not in scope (still required)

| Item | Status |
|------|--------|
| 2-hour Burn-in (Track A2) | **Pending** — separate `許可GO` after this PASS |
| FA-11 full PASS | **PARTIAL** until A2 + human acceptance |
| Level 8 declaration | **Pending** (Track A4) |
| `execution` / `productionReady` ON | **Still forbidden** |

---

## Next human action

```text
許可GO。2時間 Burn-in を送信なし・execution=disabled のまま開始してください。
```

(When ready for Track A2.)

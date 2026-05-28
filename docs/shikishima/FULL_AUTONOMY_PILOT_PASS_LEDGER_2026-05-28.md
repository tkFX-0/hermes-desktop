# Full Autonomy Pilot — PASS Ledger

Date: 2026-05-28  
Operator batch: **PASSバンバン**（pilot scope）

---

## Track status

| Track | ID | Machine | Human | Evidence |
|-------|-----|---------|-------|----------|
| A | A1 15m smoke | PASS | PASS | `FULL_AUTONOMY_BURN_IN_SMOKE_15M_EVIDENCE.md` |
| A | A2 2h burn-in | PASS | PASS | `FULL_AUTONOMY_BURN_IN_2H_EVIDENCE.md` |
| A | A4 Level 8 declare | PASS | PASS | `FULL_AUTONOMY_LEVEL_8_DECLARATION_2026-05-28.md` |
| B | B1 Discord→SC 1回 | PASS | PASS | `FULL_AUTONOMY_B1_*` |
| B | B2 secretary loop | PASS | PASS | `FULL_AUTONOMY_B2_*` |
| B | B3 SC voice loop | PASS | PASS | `FULL_AUTONOMY_B3_*` |
| C | C2 shadow 1回 | PASS | PASS | `FULL_AUTONOMY_C2_*` |
| C | C3 shadow loop | PASS | PASS | `FULL_AUTONOMY_C3_*` |

---

## FA matrix (pilot)

| FA | Status |
|----|--------|
| FA-01 .. FA-12 | **PASS** |

---

## Track D — Operational release (2026-05-28)

| Item | Status |
|------|--------|
| D2 `execution` | **enabled** (local release file) |
| D3 `productionReady` | **true** |
| D1 git push | **GO received** |
| Evidence | `TRACK_D_OPERATIONAL_RELEASE_2026-05-28.md` |

StackChan device voice still uses pilot guards. See release doc for boundaries.

---

## Re-run commands (bounded)

```powershell
npx tsx scripts/shikishima-discord-secretary-b2-bounded.mjs
node scripts/shikishima-stackchan-voice-b3-bounded.mjs
node scripts/shikishima-hermes-shadow-voice-c2-once.mjs
node scripts/shikishima-hermes-shadow-voice-c3-bounded.mjs
```

---

## Optional next

| Item | Note |
|------|------|
| `SIDEBOT_HOLD` release | Live Discord bot auto-start — separate ops GO |
| Hermes daemon 常駐 | separate GO |

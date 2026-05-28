# Level 8 Declaration — Full Autonomous Operation (Pilot Scope)

Date: 2026-05-28  
Human direction: **終わったら次** (after A2 completion)  
Declaration type: **pilot-scope Level 8** — design acceptance, not production flag ON

---

## Prerequisites completed

| Track | Item | Status |
|-------|------|--------|
| A1 | 15m smoke Burn-in | PASS |
| A2 | 2h Burn-in | PASS |
| B1 | Discord→StackChan voice one-shot | PASS (+ human audible) |
| FA-11 | Burn-in evidence | PASS |

---

## Declared level

```text
Autonomy Level: 8 — Full Autonomous Operation (pilot scope)
Effective: 2026-05-28
```

**Meaning (pilot):** Bounded local autonomy, guarded external effects, human GO for high-risk routes.  
**Not meaning:** Unrestricted production execution, auto Discord loop, or `productionReady` / `execution` ON.

---

## Invariants (unchanged)

```text
productionReady: false
execution: disabled
rawValuesReported: false
humanGoApprovalRequired: true
git push: Human GO per push
discord auto-send: Human GO (B2)
stackchan production voice loop: Human GO (B3)
```

---

## FA-12 acceptance (pilot)

| ID | Status | Note |
|----|--------|------|
| FA-01..06 | PASS | — |
| FA-07..10 | PASS | pilot v1 code + human sign-off A4 |
| FA-11 | PASS | 15m + 2h evidence |
| FA-12 | PASS | this declaration |

---

## Still requires separate GO

| Capability | Track |
|------------|-------|
| Discord auto / secretary loop | B2 |
| StackChan continuous voice | B3 |
| Hermes always-on voice | C3 |
| `execution: enabled` | D2 |
| `productionReady: true` | D3 |

---

## Evidence index

- `FULL_AUTONOMY_BURN_IN_SMOKE_15M_EVIDENCE.md`
- `FULL_AUTONOMY_BURN_IN_2H_EVIDENCE.md`
- `FULL_AUTONOMY_B1_DISCORD_STACKCHAN_VOICE_EVIDENCE.md`
- `FULL_AUTONOMY_REVIEW_2026-05-28.md`
- `FULL_AUTONOMY_ENABLEMENT_ROADMAP_2026-05-28.md`

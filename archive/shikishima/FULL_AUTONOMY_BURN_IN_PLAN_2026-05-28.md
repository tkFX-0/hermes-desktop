# Full Autonomy Burn-in Plan — 2026-05-28

## Human decision

```text
Burn-in order: 15-minute smoke → 2-hour Burn-in
```

## Scope

```text
Each run records:
- no raw leak
- no unapproved write
- no runaway retry
- execution remains disabled unless a separate explicit GO says otherwise
- productionReady remains false
```

## Phase A — 15-minute smoke Burn-in

| Item | Value |
|------|-------|
| Duration | 15 minutes |
| Purpose | Early detection of runaway / leak / retry bugs |
| Sends | none (monitor + dry-run cycles only unless separate GO) |
| Pass criteria | zero STOP, zero raw leak, zero unapproved write |

## Phase B — 2-hour Burn-in

| Item | Value |
|------|-------|
| Duration | 2 hours |
| Purpose | Bounded long-run stability evidence |
| Prerequisite | Phase A PASS |
| Pass criteria | same as Phase A |

## Safety (unchanged)

```text
productionReady: false
execution: disabled
rawValuesReported: false
Discord send: Human GO
StackChan production voice loop: Human GO
```

## Evidence files (to create after runs)

- `FULL_AUTONOMY_BURN_IN_SMOKE_15M_EVIDENCE.md` — **PASS** (2026-05-28, Track A1)
- `FULL_AUTONOMY_BURN_IN_2H_EVIDENCE.md` — **PASS** (Track A2, 2026-05-28)

## Start phrase (when ready)

```text
許可GO。15分 smoke Burn-in を送信なし・execution=disabled のまま開始してください。
```

# Full Autonomy — Pre-Restart Verification (2026-05-28)

Human: 完全自律の完成確認 → 再起動

## Automated checks (this session)

| Check | Result |
|-------|--------|
| `vitest tests/hermes/zone/full-autonomy` | **42/42 PASS** |
| `npm run typecheck:node` | **PASS** (after minor TS fixes) |
| `shikishima-operational-status.mjs` | Track D active, level 8, openGaps 0 |
| `shikishima-constitutional-go-execute.mjs` | exit 0, FA-12 PASS |

## GO files (gitignored)

| File | Status |
|------|--------|
| `.shikishima-memory/operational-release.local.json` | Track D + SideBot + Hermes pilot |
| `.shikishima-memory/constitutional-go.local.json` | 全てGO / 実施GO |

## Definition: “完成” in this repo

**YES — pilot + Phase E production GO scope:**

- Level 8, FA-01..12 PASS (with constitutional GO + pilot declaration)
- Bounded scheduler + cycle caps
- Obsidian evidence write live (30_Evidence)
- Discord read live (DIS-01 IPC)
- Shadow STT opt-in

**NO — not included (by design):**

- Unbounded 24/7 auto-send / Discord spam
- `git push` automation
- UI `stackchan-say` / `stackchan-face` IPC (still NEEDS_HUMAN; use pilot scripts)
- Research publish (`shikishima-research-publish` draft-only)
- Financial / firmware routes (BLOCKED)

## Restart procedure

```powershell
# 1. Stop existing dev (Ctrl+C in terminal)

# 2. Optional verify
npx tsx scripts/shikishima-operational-status.mjs
npx tsx scripts/shikishima-constitutional-go-execute.mjs

# 3. Start
npm run dev
```

## Post-restart smoke (manual)

1. Agent Theater → Discord read-only → messages load
2. StackChan status connected (`.env.local` host)
3. SideBot / voice per existing pilot env if needed

## Evidence index

- `FULL_AUTONOMY_PILOT_PASS_LEDGER_2026-05-28.md`
- `CONSTITUTIONAL_GO_ALL_2026-05-28.md`
- `CONSTITUTIONAL_GO_EXECUTE_EVIDENCE_2026-05-28.md`
- `FULL_AUTONOMY_LEVEL_8_DECLARATION_2026-05-28.md`

# AGENTS

## Scope

This file applies to work in this repository. For しきしま work
(旧名/internal: Ichikishima / Hermes Control Center), also follow
`.cursor/rules/ichikishima-*.mdc` (filename rename pending) and
`docs/ichikishima/IMPLEMENTATION_HANDOFF.md` (legacy docs dir; migration in progress).

## Core Rule

Proceed in small, safe steps. Do not cross into high-risk boundaries without
explicit user approval.

## Post-Update Restart (tk operator preference)

After code or config updates that affect SideBot / Discord bot behavior, **always
run a restart** so changes take effect. tk expects this every time; do not skip
unless tk says otherwise.

Preferred command (local):

```text
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```

Alternative: Discord `!tnt` (same preflight path). Report restart completion in
the Japanese final report.

## §7 Sealed Scope (absolute HOLD)

§7 applies **only** to live / physical boundaries. These require explicit tk GO
and remain HOLD by default:

- MT5 **real connection** (terminal login, live bridge, live account wiring)
- **Real orders** and live account operations (place, modify, close, lot sizing on
  live/real accounts)
- **StackChan physical control** (motion, camera, servo, real device actuation)

**Not §7** — agents may proceed at L0-L2 without treating these as sealed:

- MQL5 / EA **code authoring** (non-deploy)
- Backtest and **simulation** only
- Trade **research**, articles, templates, Skill creation
- Referencing external EA code or docs (read/analyze/draft)

Do not HOLD solely because the user message contains `MQL5`, `EA`, or `トレード`.
Judge by **real connection / real order / physical control**.

## Permission Ladder (L0–L5) — full autonomy calibration

| Band | tk approval | Examples |
|------|-------------|----------|
| **L0–L2** | No (auto) | Research, non-deploy code, docs, templates/Skills, git branch/commit, MQL5 draft, simulated backtest |
| **L2 (relaxed)** | No (auto, gated) | `git push` after `npm run check` green; merge to `main` when しずめ structured verdict=GO + check green; whitelisted external send; Dreaming clean candidates → USER.md; delete committed git-tracked files; `npm update` for existing deps |
| **L3+** | Yes | Non-whitelist external send; SOUL.md change; `.env`/secrets; new `npm install` package; uncommitted/untracked file delete; `rm -rf` / bulk delete |
| **§7** | Yes (sealed) | MT5 live connect, real orders, StackChan physical control |

### L2 relaxed details

1. **External send whitelist** (env: `SHIKISHIMA_EXTERNAL_SEND_ALLOWLIST`):
   `discord.com`, `discordapp.com`, `api.github.com`, `github.com`,
   `registry.npmjs.org` — others need L3 tk GO.
2. **Dreaming memory**: pollution-filter-pass candidates auto-apply to **USER.md**
   only. SOUL.md **manual only** (zero auto paths). STATE.md may reflect current
   status on feature merge. tk reviews via `/memory list` post-hoc.
3. **File delete**: committed + git-tracked → L2; uncommitted/untracked → L3.
4. **npm**: `npm update` / existing package bump → L2; new package add → L3.
5. **git push**: L2 after `npm run check` green (Discord `!check` records state).
6. **merge to main**: L2 when しずめ structured verdict=GO + check green; tk
   async review via `git log`, revert if needed.

### Discord operator commands (tk only)

Authenticated by `DISCORD_OPERATOR_USER_ID`. Non-tk users are rejected.

| Command | Action |
|---------|--------|
| `!merge [branch]` | Merge branch into `main` (しずめ GO + check green) |
| `!push` | Push `main` to `origin` (check green) |
| `!check` | Run `npm run check`, record result |
| `!restart` | `preflight --clean --restart-dev` |
| `!status` | Branch, PID, check state, merge gate, pending proposals |
| `!log [n]` | Last n lines of bot log (default 20) |
| `!idea <title> — <criteria>` | Append pending idea to `.shikishima-memory/IDEAS.md` |

### Autonomous product pipeline

- **IDEAS.md** (`.shikishima-memory/IDEAS.md`, gitignored): tk writes ideas;
  `!idea` appends `pending` entries. Initial seed includes five prioritized ideas.
- **dev-scheduler** (`SHIKISHIMA_DEV_PIPELINE_ENABLED`, tick default 10 min):
  picks `pending` by priority → auto `/goal` (はじめ→しるべ→つむぎ→しずめ→しるべ) →
  しずめ GO + `npm run check` green → auto merge (feature branch) → **team quality review**
  (all six agents PASS/NEEDS_WORK, max 3 rounds, 24h timeout, TokenTracker slowdown).
- **Completion**: `outputs/<slug>/`, STATE.md update, Discord notify.
- **HOLD**: しずめ HOLD/STOP, 3-round failure, or 24h → tk notify, pipeline idle.

Safety core unchanged: SOUL.md integrity, guardrails, pollution filter, §7
sealed boundaries, `.env` protection.

## Protected Areas

Do not touch protected areas unless the task explicitly approves them:

- Live MT5 connection, real orders, and live account operations (§7).
- StackChan physical control without human GO (§7).
- `.env`, API keys, secrets, memory DB, production settings (L3+; never log/display).
- Non-whitelist external send, SOUL.md auto-write, auto-trading, trade history,
  personal information.

L0-L2 **draft** work on MQL5/EA/research/docs does not require HOLD by keyword
alone. Editing **deployed / production EA binaries** or live terminals still
requires explicit tk approval (§7).

If a task requires any protected area, stop and report.

## Normal Low-Risk Work

The agent may continue without per-step approval for:

- `docs/shikishima/` documentation (current; しきしま static docs).
- `docs/ichikishima/` documentation (legacy; migration in progress).
- `src/main/ichikishima/autonomy-zone/` small safety implementation.
- `tests/hermes/zone/` unit tests.
- Type definitions, safety checks, and `IMPLEMENTATION_HANDOFF.md` updates.

## Required Reporting

After each coding task, produce a Japanese final report. Do not say
`問題ありません`; use `この範囲では問題を検出していません`.

## しきしま Required Completion Report

Every coding task MUST end with a final report containing all sections below.
If a value is unavailable, write `not recorded` instead of omitting it.

### 1. Files changed

- List tracked files changed.
- List local-only / gitignored files separately.

### 2. Git report

- Branch:
- Working tree:
- Commit created: true/false
- Commit hash:
- Commit subject:
- Push performed: true/false
- Push destination:
- Push result:

Important: do not perform `git push` unless the human explicitly approved push
for the task.

### 3. Time report

- Task started at:
- Task ended at:
- Elapsed:
- First commit time:
- Latest commit time:
- Push time:
- Total time since first commit:

If a time is unavailable, write `not recorded`. Do not omit this section.

### 4. Verification

- vitest:
- typecheck:node:
- typecheck:web:
- eslint:
- npm run check:

### 5. Redacted status

- decision:
- execution:
- productionReady:
- rawValuesReported:
- nextRequiredHumanAction:

### 6. Safety boundary confirmation

Explicitly state whether any of these occurred:

- WSL command
- Hermes command
- wrapper/dummy execution
- execFile real pilot
- install
- external network
- git push
- raw value output

### 7. Remaining HOLD reason

State the remaining blocker, or `not recorded` if none was tracked.

### 8. Next required human action

State the next action, or `not recorded` if none was tracked.

Required phrase:

- `この範囲では問題を検出していません`

Forbidden phrase:

- `問題ありません`

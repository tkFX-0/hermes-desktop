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

## Permission Ladder (L0–L5)

| Band | tk approval | Examples |
|------|-------------|----------|
| **L0–L2** | No (auto) | Research, non-deploy code, docs, templates/Skills, git branch/commit, MQL5 draft, simulated backtest |
| **L3+** | Yes | Production code change, git push, external send, SOUL/USER/STATE memory change |
| **§7** | Yes (sealed) | MT5 live connect, real orders, StackChan physical control |

Safety core unchanged: SOUL.md integrity, guardrails, pollution filter, and §7
sealed boundaries above.

## Protected Areas

Do not touch protected areas unless the task explicitly approves them:

- Live MT5 connection, real orders, and live account operations (§7).
- StackChan physical control without human GO (§7).
- `.env`, API keys, secrets, memory DB, production settings.
- Git push, external sending, auto-trading, trade history, personal
  information.

L0-L2 **draft** work on MQL5/EA/research/docs does not require HOLD by keyword
alone. Editing **deployed / production EA binaries** or live terminals still
requires explicit tk approval.

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

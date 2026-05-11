# Shikishima Tomorrow Command Execution Boundary — v2.7.0

## Purpose

Clarifies exactly which commands are allowed and which require GO tomorrow.
Use this as a quick reference before running any command.

- documentVersion: v2.7.0
- documentDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Commands ALWAYS Allowed (no GO required)

| Command | Purpose |
|---|---|
| `git status` | View working tree state |
| `git log` | View commit history |
| `git diff` | View file diffs |
| `git add [specific file]` | Stage specific docs file (docs/shikishima/ only) |
| `git commit` | Commit staged docs-only changes |
| Read any source file | Inspection only |
| Edit docs/shikishima/ files | Documentation only |

---

## Commands That Require GO

| Command | Gate | Notes |
|---|---|---|
| `npm run typecheck:node` | G-03 | |
| `npm run typecheck:web` | G-04 | |
| `npx eslint src/` | G-05 | |
| `npx vitest run` | G-06 | Must confirm CI guard active |
| `npm run build` | G-07 | |
| `npm run dev` / `electron-forge start` | G-20 | Local dev run |
| Any `wsl [command]` | G-11 | |
| Any Hermes command | G-12 | |
| `npm install` | Separate review | |
| `npm update` | Separate review | |
| `git push` | G-17 (per push) | |

---

## Commands That Are ALWAYS FORBIDDEN

| Command | Reason |
|---|---|
| `npm install --production` | Production install |
| Any command that touches StackChan serial/USB | Hardware gate |
| Any TTS/STT command | G-15/G-16 |
| Any RunPod API call | G-13 |
| `wsl --shutdown` (proactive) | Emergency only |
| Any command with `--no-verify` | Safety bypass |
| Any force git operation | Destructive |

---

## Staging Boundary

| OK to stage | NOT OK to stage |
|---|---|
| `docs/shikishima/*.md` | `tests/ichikishima/` (without G-01) |
| `docs/shikishima/*.html` | `tests/hermes/` (without G-02) |
| `src/renderer/src/screens/` (display-only) | `docs/ichikishima/` |
| Specific docs files | `sandbox/` |
| | `.claude/`, `.cursor/` |
| | `package.json`, `package-lock.json` |
| | `dev-app-update.yml` |

---

## Redaction Required Before Reporting

For any command output:

| Before reporting | Replace with |
|---|---|
| `C:\Users\[any]\` | `[redacted-path]\` |
| `/home/[any]/` | `[redacted-path]/` |
| `localhost:[port]` | `[local-endpoint]` |
| WSL distribution name | `[wsl-distro]` |
| API key format string | `[secret]` |

---

## If Unsure: Default is HOLD

If there is any doubt about whether a command requires GO:
- Do NOT run the command
- Check V3_HUMAN_GO_CHECKLIST.md
- Ask human for confirmation

The cost of HOLD is low. The cost of an unsanctioned execution is high.

この範囲では問題を検出していません。

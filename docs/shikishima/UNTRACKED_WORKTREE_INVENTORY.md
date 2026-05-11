# Untracked Worktree Inventory — v1.3.1

## Overview

- inventoryVersion: v1.3.1
- inventoryDate: 2026-05-12
- auditType: audit-only / redacted-only
- roadmapVersion: v1.3.1
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

Untracked items as of v1.3.0 post-migration working tree.
No files were staged, committed, or modified during this audit.

---

## Inventory Table

| Path | File count | Classification | Decision |
|---|---|---|---|
| `tests/ichikishima/` | 69 | commit candidate | HOLD — needs human review |
| `tests/hermes/` | 12 | commit candidate | HOLD — needs human review |
| `docs/ichikishima/` | 127 | legacy docs candidate | HOLD — merge or archive decision |
| `sandbox/` | ~4,553 | local-only | HOLD — likely gitignored; verify before staging |
| `.claude/scripts/` | multiple | tool config | local-only — do not commit |
| `.claude/settings.json` | 1 | tool config | local-only — do not commit |
| `.cursor/` | multiple | tool config (IDE) | local-only — do not commit |
| ChatGPT image (PNG) | 1 | local asset | local-only — do not commit |

---

## Per-Item Classification

### `tests/ichikishima/` — 69 files

| Field | Value |
|---|---|
| Classification | commit candidate |
| Contents | Tests for all ichikishima subsystems: agent-team, approval, audit, control-center, hermes, orchestrator, pilot, review, visualization |
| Special files | `dummy-hermes-path.ts` — helper, review needed; `dummy-hermes-stub-design.process-local.test.ts` — "process-local" in name, review before commit |
| Decision | HOLD — requires Task v1.5.0 test review before commit |
| Risk | LOW-MEDIUM — contains dummy path helpers; process-local file needs investigation |

---

### `tests/hermes/` — 12 files

| Field | Value |
|---|---|
| Classification | commit candidate |
| Contents | Autonomy-zone focused tests: path-guard, read/write policy, wrappers, delete wrapper, operation-blocks, config, denylist |
| Decision | HOLD — coordinate with tests/ichikishima/ commit decision |
| Risk | LOW — autonomy-zone safety tests; may reference local hermes setup |

---

### `docs/ichikishima/` — 127 files

| Field | Value |
|---|---|
| Classification | legacy docs candidate |
| Contents | Old implementation documentation (pre-shikishima naming) |
| Decision | HOLD — Phase E-prep: merge into docs/shikishima/ or archive |
| Risk | LOW (docs only) — but should not be committed before review |
| Note | NAMING_MIGRATION_CANDIDATES.md lists this as MERGE_CANDIDATE for Phase E |

---

### `sandbox/` — ~4,553 files

| Field | Value |
|---|---|
| Classification | local-only |
| Contents | Local autonomy sandbox; likely contains hermes-autonomy-zone and process-local data |
| Decision | HOLD — DO NOT COMMIT. Mostly local-only content. `.gitignore` (v1.2.8) already ignores `sandbox/hermes-autonomy-zone/local-only/` |
| Risk | HIGH if committed accidentally — may contain local-only config or process state |
| Note | Verify `.gitignore` coverage before any stage attempt |

---

### `.claude/scripts/` and `.claude/settings.json`

| Field | Value |
|---|---|
| Classification | tool config — local-only |
| Contents | Claude Code session scripts and settings |
| Decision | DO NOT COMMIT — Claude Code tool config, session-specific |
| Risk | MEDIUM — may contain session-specific settings or permissions |

---

### `.cursor/` directory

| Field | Value |
|---|---|
| Classification | tool config — local-only |
| Contents | Cursor IDE configuration and rule files |
| Decision | DO NOT COMMIT — IDE config is local-only |
| Risk | LOW (config only) — but unnecessary in git history |

---

### ChatGPT image (PNG)

| Field | Value |
|---|---|
| Classification | local asset |
| Decision | DO NOT COMMIT — personal local file |
| Risk | LOW — just a local image |

---

## .gitignore Coverage Status

From v1.2.8 Group A commit:
- `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.json` — IGNORED ✓
- `sandbox/hermes-autonomy-zone/local-only/wsl-distro-selection.local.json` — IGNORED ✓
- `.task-start-time.local.txt` — IGNORED ✓

Remaining gap: `sandbox/` root is not fully gitignored.
The full `sandbox/` directory (~4,553 files) should be evaluated for gitignore coverage.

---

## Decision Summary

| Item | Commit now? | Requires |
|---|---|---|
| `tests/ichikishima/` | NO — HOLD | Task v1.5.0 test review |
| `tests/hermes/` | NO — HOLD | Coordinate with tests/ichikishima/ |
| `docs/ichikishima/` | NO — HOLD | Phase E-prep merge/archive plan |
| `sandbox/` | NO — local-only | Verify gitignore; do not commit |
| `.claude/` | NO — local | Never commit |
| `.cursor/` | NO — local | Never commit |
| ChatGPT image | NO — local | Never commit |

この範囲では問題を検出していません。

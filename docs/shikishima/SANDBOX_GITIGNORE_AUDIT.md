# Sandbox .gitignore Audit — v1.4.0

## Audit Overview

- auditVersion: v1.4.0
- auditDate: 2026-05-12
- auditType: audit-only / gitignore-update
- roadmapVersion: v1.4.0
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Pre-Audit State

Before v1.4.0, the following were NOT fully ignored:

| Path | Previous coverage | Risk |
|---|---|---|
| `sandbox/` (root) | Only 2 specific files ignored | HIGH — ~4,553 files could be accidentally staged |
| `.cursor/` | Not ignored | MEDIUM — IDE config leaks |
| `.claude/scripts/` | Not ignored | MEDIUM — session scripts leaks |
| `.claude/settings.json` | Not ignored | MEDIUM — settings leaks |
| `.claude/settings.local.json` | Not ignored | MEDIUM — local settings leaks |

Previously added (v1.2.8 Group A):
- `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.json` ✓
- `sandbox/hermes-autonomy-zone/local-only/wsl-distro-selection.local.json` ✓
- `.task-start-time.local.txt` ✓
- `.claude/worktrees` ✓ (pre-existing)

---

## Changes Applied (v1.4.0)

Added to `.gitignore`:

```
# Local-only sandboxes and tool config — never commit
sandbox/
.cursor/
.claude/scripts/
.claude/settings.json
.claude/settings.local.json
```

---

## Post-Audit State

| Path | Coverage | Status |
|---|---|---|
| `sandbox/` | Full directory ignored | SAFE ✓ |
| `.cursor/` | Full directory ignored | SAFE ✓ |
| `.claude/scripts/` | Ignored | SAFE ✓ |
| `.claude/settings.json` | Ignored | SAFE ✓ |
| `.claude/settings.local.json` | Ignored | SAFE ✓ |
| `.claude/worktrees` | Previously ignored | SAFE ✓ |
| `.task-start-time.local.txt` | Previously ignored | SAFE ✓ |
| `sandbox/hermes-autonomy-zone/local-only/*.json` | Previously ignored (now covered by sandbox/) | SAFE ✓ |

---

## Items NOT Committed

The following untracked items are now gitignored. They were NOT staged or committed:

- `sandbox/` (~4,553 files) — local-only, now ignored
- `.claude/scripts/` — local tool config, now ignored
- `.claude/settings.json` — local tool config, now ignored
- `.cursor/` — IDE config, now ignored
- `ChatGPT image (PNG)` — local file (not covered by gitignore — too specific to add rule for)

---

## Note on ChatGPT Image

The PNG image file in the working tree is a single local file. It is not covered by
the new gitignore rules. It should remain untracked. If more such files accumulate,
add a `*.png` exception or move them outside the repo.

---

## Safety Boundary Confirmation

- No sandbox files were staged or committed
- No `.claude/` or `.cursor/` files were staged or committed
- Only `.gitignore` was modified in this task
- No source files modified
- No package metadata modified
- No build or test executed

この範囲では問題を検出していません。

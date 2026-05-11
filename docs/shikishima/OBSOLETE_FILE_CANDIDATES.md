# Obsolete File Candidates

## Purpose

This document lists files and directories that are candidates for deletion,
archiving, or cleanup, discovered in the v1.1.0 Repository Hygiene Audit.
This document does not approve any deletion. All items remain HOLD or require
separate human decision.

- auditVersion: v1.1.0
- auditDate: 2026-05-11
- decision: HOLD
- execution: disabled
- productionReady: false

---

## Legend

| Label | Meaning |
|---|---|
| DELETE_CANDIDATE | Likely safe to delete; confirm before acting |
| DEPRECATED_KEEP | Old but still referenced; keep until migration |
| ARCHIVE_CANDIDATE | Move to archive branch or archive directory |
| REVIEW_NEEDED | Unclear; needs human decision |
| GENERATED | Auto-generated; may be safe to delete or gitignore |
| GITIGNORED | Already gitignored; exists locally only |

---

## A. Build Artifacts (Gitignored)

These directories are in `.gitignore` and are build/dist outputs.
They may exist locally but should not be committed.

| Item | Path | Label | Notes |
|---|---|---|---|
| Build output | `out/` | GITIGNORED | Electron build output; safe to delete and rebuild |
| Distribution | `dist/` | GITIGNORED | Packaged distribution; safe to delete and rebuild |
| Release packages | `release/` | GITIGNORED | Electron-builder output |

---

## B. Sandbox Temporary Directories

The `sandbox/hermes-autonomy-zone/` directory contains Vitest temp dirs
and test audit/approval JSONL files. Most are auto-generated during tests.

| Item | Path | Label | Notes |
|---|---|---|---|
| Vitest temp dirs | `sandbox/hermes-autonomy-zone/.vitest-*` | GENERATED | Auto-created by test runs; safe to delete |
| Vitest temp dirs | `sandbox/hermes-autonomy-zone/tmp/` | GENERATED | Test temp; safe to delete |
| Audit JSONL files | `sandbox/hermes-autonomy-zone/audit/` | REVIEW_NEEDED | May be test data or real audit logs |
| Dummy Hermes | `sandbox/hermes-autonomy-zone/dummy-hermes/` | DEPRECATED_KEEP | Dummy for testing; keep until tests confirmed |
| Handoff docs | `sandbox/hermes-autonomy-zone/handoff/` | REVIEW_NEEDED | Controlled-pilot prep docs; assess if current |

Note: `sandbox/hermes-autonomy-zone/local-only/` is gitignored and contains
local real values. Do not delete without confirmation.

---

## C. docs/ichikishima/ — Old Name Documentation Directory

The `docs/ichikishima/` directory is the OLD NAME equivalent of `docs/shikishima/`.
It contains implementation-level docs that predate the renaming to しきしま.
It is actively referenced from `AGENTS.md`, `CLAUDE.md`, and src code.

| Item | Path | Label | Notes |
|---|---|---|---|
| Old docs dir | `docs/ichikishima/` | DEPRECATED_KEEP | Referenced from src; migrate before deletion |
| IMPLEMENTATION_HANDOFF.md | `docs/ichikishima/IMPLEMENTATION_HANDOFF.md` | DEPRECATED_KEEP | Still referenced by AGENTS.md |
| CONTROL_CENTER_*.md | `docs/ichikishima/CONTROL_CENTER_*.md` | DEPRECATED_KEEP | Old implementation docs |
| HERMES_*.md | `docs/ichikishima/HERMES_*.md` | DEPRECATED_KEEP | Old bridge docs |
| mockups/ | `docs/ichikishima/mockups/` | DEPRECATED_KEEP | Old HTML mockups |

Migration path: content should move to `docs/shikishima/impl/` or equivalent.
Source code references (ICHIKISHIMA_READONLY_DOC_PATHS) must be updated first.

---

## D. Upstream Branding Assets

| Item | Path | Label | Notes |
|---|---|---|---|
| Hermes logo asset | `src/renderer/src/assets/hermes.png` | ARCHIVE_CANDIDATE | Old branding; rename when しきしま branding ready |
| Splash text image | `src/renderer/src/assets/splashtext.png` | REVIEW_NEEDED | May contain "Hermes" text; check content |
| Splash image | `src/renderer/src/assets/splash.png` | REVIEW_NEEDED | Upstream splash; check if still used |

---

## E. Root-Level PowerShell Scripts (Not Repo Files)

These are in the USER HOME directory (`C:\Users\81903\`), not in the repo.
Listed for awareness only; not repo candidates.

| Item | Notes |
|---|---|
| `hermes_start.ps1` | Home dir; starts イツキシマ/Hermes backend |
| `hermes_stop.ps1` | Home dir; stops イツキシマ/Hermes backend |
| `check_*.ps1` | Home dir; one-time diagnostic scripts |

These are not part of the hermes-desktop repo. No action required in repo.

---

## F. Potentially Redundant Docs in docs/shikishima/

During audit, `docs/shikishima/` contains 50+ files. Some may be candidates
for consolidation. This list is for human review only.

| Item | Path | Label | Notes |
|---|---|---|---|
| Multiple PHASE_*.md checklists | `PHASE_3_APPROVAL_CHECKLIST.md` etc. | REVIEW_NEEDED | May be superseded by PHASE_REVIEW_MATRIX.md |
| Multiple STACKCHAN_*.md | `STACKCHAN_EXPRESSION_ONLY_PLAN.md`, `STACKCHAN_SAFETY_BOUNDARY.md` | DEPRECATED_KEEP | StackChan direction superseded by dot-line face |
| Multiple FACE_TERMINAL_*.md | various | REVIEW_NEEDED | Some may be superseded by later docs |

---

## G. .claude/worktrees (Gitignored)

| Item | Label | Notes |
|---|---|---|
| `.claude/worktrees` | GITIGNORED | Gitignored in .gitignore; Claude worktrees; safe to delete |

---

## Items Confirmed NOT Obsolete

| Item | Reason |
|---|---|
| `sandbox/hermes-autonomy-zone/local-only/` | Gitignored local values; DO NOT delete |
| `node_modules/` | Dependencies; managed by npm |
| All `docs/shikishima/` core docs | Active static docs |
| All `src/main/ichikishima/` source | Active code; rename candidate only |
| `CLAUDE.md`, `AGENTS.md` | Active instruction files; update candidate only |

---

## Deletion Decision Required Before Acting

No deletion has been approved. For each DELETE_CANDIDATE:

1. Confirm the item is not referenced anywhere
2. Confirm the item is not needed for any test
3. Get explicit human GO for deletion
4. Delete with git tracking (not rm -rf)

この範囲では問題を検出していません。

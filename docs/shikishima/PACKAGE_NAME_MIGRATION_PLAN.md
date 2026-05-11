# Package Name Migration Plan — v1.2.5

## Plan Overview

- planVersion: v1.2.5
- planDate: 2026-05-11
- planType: plan-only / docs-static-only / report-only
- roadmapVersion: v1.2.5
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- targetExecutionVersion: v1.3.0

This document is a migration plan only. No package.json name has been changed.
No lockfile has been modified. No npm install has been run. No build or test
has been executed.

---

## Current State

| Field | Value |
|---|---|
| `package.json` name | `hermes-desktop` |
| `package.json` version | `0.2.3` |
| `package.json` description | `Shikishima — desktop application for Hermes Agent` (v1.2.3) |
| `electron-builder.yml` productName | `しきしま` (v1.2.4) |
| `electron-builder.yml` appId | `com.nousresearch.hermes` |
| `electron-builder.yml` win.executableName | `hermes-agent` |
| `dev-app-update.yml` updaterCacheDirName | `hermes-desktop-updater` |
| `dev-app-update.yml` repo | `hermes-desktop` |
| `publish.repo` | `hermes-desktop` |

---

## Candidate Change

| Field | Current | Candidate |
|---|---|---|
| `package.json` name | `hermes-desktop` | `shikishima-desktop` |
| `package-lock.json` root name | `hermes-desktop` | `shikishima-desktop` (auto-sync) |
| `dev-app-update.yml` updaterCacheDirName | `hermes-desktop-updater` | `shikishima-desktop-updater` |

---

## Impact Analysis

### A. Files That Change When `package.json name` Changes

| File | Field | Change | Risk |
|---|---|---|---|
| `package.json` | `name` | `hermes-desktop` → `shikishima-desktop` | LOW |
| `package-lock.json` | root `name` | auto-syncs on next `npm install` | LOW |
| Installer filename | `nsis.artifactName: ${name}-…` | `hermes-desktop-*-setup.exe` → `shikishima-desktop-*-setup.exe` | MEDIUM |
| macOS DMG filename | `dmg.artifactName: ${name}-…` | `hermes-desktop-*.dmg` → `shikishima-desktop-*.dmg` | MEDIUM |
| Linux AppImage filename | `appImage.artifactName: ${name}-…` | `hermes-desktop-*.AppImage` → `shikishima-desktop-*.AppImage` | MEDIUM |
| `dev-app-update.yml` | `updaterCacheDirName` | needs manual update (hardcoded string) | LOW |

### B. Files That Must NOT Change (External References — KEEP)

| File | Field | Reason |
|---|---|---|
| `electron-builder.yml` | `publish.repo: hermes-desktop` | External GitHub repo URL — independent of package name |
| `dev-app-update.yml` | `repo: hermes-desktop` | External GitHub repo URL — must match actual GitHub repo name |
| `electron-builder.yml` | `appId: com.nousresearch.hermes` | macOS/Win app identifier — independent |
| `electron-builder.yml` | `win.executableName: hermes-agent` | Windows .exe name — separate decision |

### C. Files Confirmed NOT Affected

| File | Reason |
|---|---|
| `src/**/*.ts`, `src/**/*.tsx` | package name is not referenced in source code (confirmed in v1.2.2 audit) |
| `.github/workflows/release.yml` | reads `package.json.version`, not `name` (confirmed in v1.2.2 audit) |
| `electron-builder.yml` productName | already updated to `しきしま` in v1.2.4 — independent of package name |

---

## Files NOT in Scope for This Migration

These items have separate HOLD decisions and must not be touched in v1.3.0
package name migration:

| Item | Status | Notes |
|---|---|---|
| `hermes-desktop/` directory name | HOLD — Phase E | Highest risk; git remote, all scripts |
| `src/main/ichikishima/` | HOLD — Phase D | High-risk source rename |
| `src/shared/ichikishima/` | HOLD — Phase D | High-risk source rename |
| `tests/ichikishima/` | HOLD — Phase D | Aligned with src rename |
| `src/preload/ichikishima-control-center.ts` | HOLD — Phase D | Medium risk |
| `HermesLogo.tsx` | HOLD — Phase C later | Component rename |
| `hermes.png` | HOLD — Phase C later | Asset rename |
| `docs/ichikishima/` | HOLD — Phase E | Merge candidate |
| `.cursor/rules/ichikishima-*.mdc` | HOLD — Phase F | Low-risk rule rename |

---

## Pre-Migration Caveat: package-lock.json Existing Dirty State

At the time of this plan creation (v1.2.5), `package-lock.json` has an
**existing unrelated dirty modification** that predates the v1.2.4 commit.
This modification was intentionally excluded from the v1.2.4 commit as an
unrelated dirty file.

**Required before executing package name migration:**

1. Investigate the existing package-lock.json dirty state (redacted-only;
   content not reported here).
2. Either commit the unrelated package-lock.json change as a separate commit,
   or revert it if it is an unwanted change.
3. Confirm working tree is clean of unrelated changes before proceeding with
   name migration.

Mixing the existing package-lock.json dirty state with the name migration
commit would make rollback and audit harder. This must be resolved first.

---

## Safe Migration Steps (Execution Plan — HOLD until GO)

These steps are the intended execution sequence. No step has been performed.
Each step requires explicit human GO approval before execution.

| Step | Action | File(s) | Risk | Notes |
|---|---|---|---|---|
| 0 | ~~Resolve dirty working tree~~ — **DONE**: Group A (v1.2.8), Group B (v1.2.11). Tracked files now clean. package-lock version stamp auto-resolves in step 2. Untracked (tests/ichikishima/ etc.) do not block migration. | multiple | LOW | Remaining untracked: tests/ichikishima/, tests/hermes/, docs/ichikishima/, sandbox/, .claude/, .cursor/ — none participate in migration commit |
| 1 | Update `package.json` name | `package.json` | LOW | `hermes-desktop` → `shikishima-desktop` |
| 2 | Sync lockfile root name | `package-lock.json` | LOW | Run `npm install --package-lock-only` (no dependency install) |
| 3 | Update `updaterCacheDirName` | `dev-app-update.yml` | LOW | `hermes-desktop-updater` → `shikishima-desktop-updater` |
| 4 | Update docs references | audit/naming docs | VERY LOW | Update PACKAGE_METADATA_AUDIT.md, NAMING_MIGRATION_CANDIDATES.md |
| 5 | Verify artifact filenames | build output (dry-run) | — | Confirm installer/DMG/AppImage names changed |
| 6 | Commit all migration changes together | all above files | — | Single coordinated commit |

**Important:** Steps 1–6 must be committed together. Partial commits (e.g.,
only step 1 without step 2) leave the working tree in an inconsistent state.

---

## Rollback Plan

If the migration causes issues, rollback in reverse order:

| Step | Rollback Action |
|---|---|
| R1 | Revert `package.json` name to `hermes-desktop` |
| R2 | Run `npm install --package-lock-only` to sync lockfile root name back |
| R3 | Revert `dev-app-update.yml` updaterCacheDirName to `hermes-desktop-updater` |
| R4 | Revert docs references |
| R5 | Commit rollback as separate commit |

Git rollback alternative: `git revert <migration-commit-hash>` (reverts all
migration files in one operation).

---

## Verification Checklist (Post-Execution)

To be run after migration execution, not now:

- [ ] `package.json` name is `shikishima-desktop`
- [ ] `package-lock.json` root name is `shikishima-desktop`
- [ ] `dev-app-update.yml` updaterCacheDirName is `shikishima-desktop-updater`
- [ ] `electron-builder.yml` productName is still `しきしま` (unchanged)
- [ ] `electron-builder.yml` appId is still `com.nousresearch.hermes` (unchanged)
- [ ] `electron-builder.yml` win.executableName is still `hermes-agent` (unchanged)
- [ ] `publish.repo` is still `hermes-desktop` (unchanged — external GitHub URL)
- [ ] `dev-app-update.yml repo` is still `hermes-desktop` (unchanged — external GitHub URL)
- [ ] No source files in `src/**` were modified
- [ ] No directory was renamed
- [ ] No `hermes.png`, `HermesLogo.tsx`, `docs/ichikishima/` was touched
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] Installer artifact filename contains `shikishima-desktop`
- [ ] Git working tree is clean after commit
- [ ] No git push was performed

---

## Risk Table

| Item | Risk | Status | Notes |
|---|---|---|---|
| `package.json` name change | LOW | HOLD | Isolated field; no source code impact |
| `package-lock.json` sync | LOW | HOLD | Auto-syncs; must run `npm install --package-lock-only` |
| Artifact filenames change | MEDIUM | HOLD | Downstream users may have hardcoded filenames in scripts or links |
| `updaterCacheDirName` update | LOW | HOLD | Hardcoded string; manual 1-line update |
| `publish.repo` | KEEP | KEEP | External GitHub URL; cannot change without GitHub repo rename |
| `dev-app-update.yml repo` | KEEP | KEEP | Same as publish.repo |
| `appId` | KEEP | KEEP | macOS/Win app identifier — separate decision |
| `win.executableName` | HOLD | HOLD | Separate optional decision |
| Source code impact | NONE | PASS | Confirmed in v1.2.2 audit: no src/ references |
| Directory rename | HIGH | HOLD | Phase E — not in scope for v1.3.0 |
| Existing package-lock.json dirty state | CAUTION | CAVEAT | Must be resolved before execution (see Pre-Migration Caveat) |

---

## Key Distinction (Preserved from v1.2.2 Audit)

```text
package.json name: "hermes-desktop"
  → used for artifact filenames (${name} in electron-builder.yml)
  → used for lockfile root name
  → NOT shown to users

electron-builder.yml productName: "しきしま"  ← DONE in v1.2.4
  → shown in title bar, taskbar, installer
  → shown as app name on macOS/Windows
  → NOT derived from package.json name
```

Changing `package.json name` does NOT change the displayed app name.
The displayed app name is already `しきしま` as of v1.2.4.

---

## Safety Boundary Confirmation

During this plan creation:

- No `package.json` was modified
- No `package-lock.json` was modified
- No `npm install` was performed
- No build or test was executed
- No external network connections were made
- No git push was performed
- No directory was renamed or deleted
- No raw values (secrets, API keys, local paths) were reported
- No source files were modified
- `package-lock.json` dirty state was not touched (redacted-only)

この範囲では問題を検出していません。

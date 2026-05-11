# Src Dirty Files Classification — v1.2.7

## Audit Overview

- auditVersion: v1.2.7
- auditDate: 2026-05-11
- auditType: audit-only / report-only / redacted-only
- roadmapVersion: v1.2.7
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

No source files were modified during this audit.
No files were committed or reverted. No build or test was run. No git push.

---

## Background

From `PACKAGE_LOCK_DIRTY_STATE_CLASSIFICATION.md` (v1.2.6):

> v1.3.0 blockers: src/ dirty files (10 files) and `.gitignore` must be
> resolved first. package-lock version stamp is NOT a v1.3.0 blocker.

This audit classifies the src dirty files and provides recommended handling
decisions for use as v1.3.0 pre-condition items.

---

## Dirty File Inventory

| File | Diff size | Lines +/- |
|---|---|---|
| `.gitignore` | small | +7 / -1 |
| `src/main/claw3d.ts` | small | +5 / 0 |
| `src/main/installer.ts` | small | +5 / -1 |
| `src/main/index.ts` | medium | +30 / -6 |
| `src/preload/index.d.ts` | small | +7 / 0 |
| `src/preload/index.ts` | small | +10 / 0 |
| `src/renderer/src/screens/Layout/Layout.tsx` | large | +41 / -1 |
| `src/shared/i18n/index.ts` | small | +4 / 0 |
| `src/shared/i18n/locales/en/navigation.ts` | minimal | +2 / 0 |
| `src/shared/i18n/locales/zh-CN/navigation.ts` | minimal | +2 / 0 |

Total: 11 tracked dirty files (including `.gitignore`), 111 insertions / 13 deletions.

---

## File-by-File Classification

### `.gitignore` — small (+7/-1)

| Field | Value |
|---|---|
| Classification | safety hardening + intended feature work |
| Content summary | Adds gitignore rules for local-only WSL wrapper config files; adds `.task-start-time.local.txt`; fixes missing newline at end of Tauri entry |
| Untracked dependencies | none |
| Risk | LOW |
| Recommendation | **commit separately** (Group A) |
| Notes | Clean, isolated safety change; prevents accidental commit of local-only config files |

---

### `src/main/claw3d.ts` — small (+5/0)

| Field | Value |
|---|---|
| Classification | safety hardening |
| Content summary | Adds `windowsHide: true` to 5 child process spawn/execFile calls |
| Untracked dependencies | none |
| Risk | LOW |
| Recommendation | **commit separately** (Group A) |
| Notes | Prevents terminal windows from appearing on Windows; isolated, non-breaking change |

---

### `src/main/installer.ts` — small (+5/-1)

| Field | Value |
|---|---|
| Classification | safety hardening + generated noise |
| Content summary | Adds `windowsHide: true` to 4 spawn/execFile calls; BOM character (UTF-8 BOM) added to first import line |
| Untracked dependencies | none |
| Risk | LOW-MEDIUM |
| Recommendation | **commit separately** (Group A) — but investigate BOM character |
| Notes | The `windowsHide` changes are clean. The BOM character at the top of the file is likely editor-generated on Windows. It is functionally harmless in most cases but is non-standard for TypeScript source and should ideally be removed before commit. |

---

### `src/main/index.ts` — medium (+30/-6)

| Field | Value |
|---|---|
| Classification | intended feature work |
| Content summary | Imports ControlCenter IPC handler registration and path resolution helpers from `ichikishima/control-center`; adds `getIchikishimaControlCenterReadonlyParams()` helper; registers ControlCenter readonly IPC in `setupIPC()`; adds `backgroundColor` to BrowserWindow; minor formatting cleanup (multi-line lambdas collapsed) |
| Untracked dependencies | `src/main/ichikishima/` (untracked directory) |
| Risk | MEDIUM |
| Recommendation | **commit with Group B** (together with ichikishima/* untracked source) |
| Notes | Cannot be committed alone; depends on `src/main/ichikishima/control-center/` which is untracked. The formatting cleanup is safe. The BrowserWindow backgroundColor is a safe cosmetic change. |

---

### `src/preload/index.d.ts` — small (+7/0)

| Field | Value |
|---|---|
| Classification | intended feature work |
| Content summary | Imports `ControlCenterAppSnapshot` type; adds `IchikishimaControlCenterAPI` interface; adds `ichikishimaControlCenter` to `Window` global type |
| Untracked dependencies | `src/main/ichikishima/control-center/control-center-app-snapshot` (untracked) |
| Risk | LOW (type-only) |
| Recommendation | **commit with Group B** |
| Notes | Type-only change; cannot be verified without untracked type source |

---

### `src/preload/index.ts` — small (+10/0)

| Field | Value |
|---|---|
| Classification | intended feature work |
| Content summary | Imports `createIchikishimaControlCenterPreloadApi`; creates preload API instance; exposes `ichikishimaControlCenter` via `contextBridge.exposeInMainWorld` in both isolated and non-isolated paths |
| Untracked dependencies | `src/preload/ichikishima-control-center.ts` (untracked file) |
| Risk | MEDIUM |
| Recommendation | **commit with Group B** |
| Notes | Depends on untracked `src/preload/ichikishima-control-center.ts`; exposes a new IPC bridge to renderer |

---

### `src/renderer/src/screens/Layout/Layout.tsx` — large (+41/-1)

| Field | Value |
|---|---|
| Classification | intended feature work |
| Content summary | Imports `Research` and `ControlCenterAppShell` screen components; imports `BarChart2`, `LayoutDashboard` icons from lucide-react; adds `"research"` and `"controlCenter"` to `View` type; adds nav items for both; adds conditional rendering for both screens |
| Untracked dependencies | `src/renderer/src/screens/Research/` (untracked directory); `ControlCenterAppShell` is tracked but may depend on untracked ichikishima source |
| Risk | MEDIUM |
| Recommendation | **commit with Group B** |
| Notes | Largest single dirty file. Depends on untracked Research screen directory. The zh-CN locale label for `research` is `"リサーチ"` (Japanese) — may be a placeholder that needs correction before final commit. |

---

### `src/shared/i18n/index.ts` — small (+4/0)

| Field | Value |
|---|---|
| Classification | intended feature work |
| Content summary | Imports and registers `controlCenterEn` and `controlCenterZh` i18n locale files |
| Untracked dependencies | `src/shared/i18n/locales/en/controlCenter.ts` (untracked); `src/shared/i18n/locales/zh-CN/controlCenter.ts` (untracked) |
| Risk | LOW |
| Recommendation | **commit with Group B** |
| Notes | Depends on untracked controlCenter locale files |

---

### `src/shared/i18n/locales/en/navigation.ts` — minimal (+2/0)

| Field | Value |
|---|---|
| Classification | intended feature work |
| Content summary | Adds `research: "Research"` and `controlCenter: "Control Center"` labels |
| Untracked dependencies | none |
| Risk | LOW |
| Recommendation | **commit with Group B** (navigation labels for new views) |
| Notes | Clean, isolated label addition |

---

### `src/shared/i18n/locales/zh-CN/navigation.ts` — minimal (+2/0)

| Field | Value |
|---|---|
| Classification | intended feature work |
| Content summary | Adds `research: "リサーチ"` and `controlCenter: "Control Center"` labels |
| Untracked dependencies | none |
| Risk | LOW |
| Recommendation | **commit with Group B** (navigation labels) |
| Notes | `"リサーチ"` (Japanese) in zh-CN locale is likely a placeholder; may need correction |

---

## Dependency Graph

```text
Group A — Safety Hardening (no untracked dependencies)
  .gitignore
  src/main/claw3d.ts
  src/main/installer.ts
    └─ note: BOM character on installer.ts line 1

Group B — ControlCenter + Research Feature (has untracked dependencies)
  src/main/index.ts
    └─ depends on: src/main/ichikishima/ [UNTRACKED]
  src/preload/index.d.ts
    └─ depends on: src/main/ichikishima/control-center/control-center-app-snapshot [UNTRACKED]
  src/preload/index.ts
    └─ depends on: src/preload/ichikishima-control-center.ts [UNTRACKED]
  src/renderer/src/screens/Layout/Layout.tsx
    └─ depends on: src/renderer/src/screens/Research/ [UNTRACKED]
  src/shared/i18n/index.ts
    └─ depends on: src/shared/i18n/locales/*/controlCenter.ts [UNTRACKED]
  src/shared/i18n/locales/en/navigation.ts
  src/shared/i18n/locales/zh-CN/navigation.ts

Untracked source directories (not in scope of this audit, but required for Group B commit):
  src/main/ichikishima/
  src/preload/ichikishima-control-center.ts
  src/renderer/src/screens/Research/
  src/shared/ichikishima/ (may also be referenced)
```

---

## Recommended Handling

### Group A — Commit Separately (3 files)

```text
.gitignore
src/main/claw3d.ts
src/main/installer.ts
```

- Risk: LOW
- No untracked dependencies
- Clean, isolated safety/hardening changes
- **Caveat for installer.ts**: The BOM character on line 1 should be removed
  before committing for cleanliness. It is functionally harmless but
  non-standard for TypeScript.
- Suggested commit subject: `fix(win): add windowsHide to child process spawns`

### Group B — Commit Together with Untracked Source (7 files + untracked)

```text
src/main/index.ts
src/preload/index.d.ts
src/preload/index.ts
src/renderer/src/screens/Layout/Layout.tsx
src/shared/i18n/index.ts
src/shared/i18n/locales/en/navigation.ts
src/shared/i18n/locales/zh-CN/navigation.ts

+ Must include untracked:
  src/main/ichikishima/
  src/preload/ichikishima-control-center.ts
  src/renderer/src/screens/Research/
  src/shared/i18n/locales/en/controlCenter.ts
  src/shared/i18n/locales/zh-CN/controlCenter.ts
  (plus any other ichikishima/* files referenced)
```

- Risk: MEDIUM
- Cannot commit tracked files alone; untracked source must also be staged
- This is a significant feature commit (ControlCenter IPC bridge + Research/ControlCenter navigation)
- **Caveat**: zh-CN `research` label `"リサーチ"` may be a placeholder needing correction
- Suggested approach: audit untracked source first (separate classification task), then commit Group B together

---

## Overall Risk Table

| File | Classification | Size | Risk | Untracked deps | Recommendation |
|---|---|---|---|---|---|
| `.gitignore` | safety hardening | small | LOW | none | commit separately (A) |
| `claw3d.ts` | safety hardening | small | LOW | none | commit separately (A) |
| `installer.ts` | safety hardening + noise | small | LOW-MED | none | commit separately (A) — fix BOM first |
| `index.ts` (main) | feature work | medium | MEDIUM | `ichikishima/` | commit with B |
| `index.d.ts` (preload) | feature work | small | LOW | `ichikishima/` | commit with B |
| `index.ts` (preload) | feature work | small | MEDIUM | `ichikishima-control-center.ts` | commit with B |
| `Layout.tsx` | feature work | large | MEDIUM | `Research/` | commit with B |
| `i18n/index.ts` | feature work | small | LOW | `controlCenter.ts` | commit with B |
| `en/navigation.ts` | feature work | minimal | LOW | none | commit with B |
| `zh-CN/navigation.ts` | feature work | minimal | LOW | none | commit with B |

---

## v1.3.0 GO Conditions

All of the following must be met before v1.3.0 package name migration:

| Condition | Current State | Status |
|---|---|---|
| Group A files committed or reverted | not yet | BLOCK |
| Group B tracked files committed or reverted | not yet | BLOCK |
| Group B untracked source committed or reverted | not yet | BLOCK |
| installer.ts BOM character resolved | not yet | CAUTION |
| zh-CN `research` label placeholder resolved | not yet | CAUTION |
| Working tree clean | not clean | BLOCK |
| package-lock version stamp (auto-resolves) | known | PASS (non-blocker) |

---

## v1.3.0 BLOCK Conditions

| Blocker | Required Action |
|---|---|
| Group A dirty files (3) | Commit as safety hardening, or revert |
| Group B dirty files (7) | Commit together with untracked source, or revert |
| Untracked source files (`ichikishima/`, `Research/`, etc.) | Stage and commit with Group B, or revert/ignore |
| Working tree not clean | All of the above must be resolved |

**The package-lock version stamp is NOT a blocker.** It auto-resolves in v1.3.0.

---

## Notes on Untracked Files (Out of Scope for This Audit)

The following untracked directories and files exist but were not audited in
this task (raw content not read):

| Path | Type | Notes |
|---|---|---|
| `src/main/ichikishima/` | untracked dir | Required for Group B commit |
| `src/preload/ichikishima-control-center.ts` | untracked file | Required for Group B commit |
| `src/renderer/src/screens/Research/` | untracked dir | Required for Group B commit |
| `src/shared/ichikishima/` | untracked dir | May be referenced |
| `tests/ichikishima/` | untracked dir | May be required for test suite |
| `tests/hermes/` | untracked dir | May be test additions |
| `sandbox/` | untracked dir | Local-only sandbox; likely gitignored after .gitignore commit |
| `docs/ichikishima/` | untracked dir | Legacy implementation docs |

A separate classification task for untracked source files may be warranted
before committing Group B.

---

## Safety Boundary Confirmation

During this audit:

- No source files were modified
- No `.gitignore` was modified
- No files were staged, committed, or reverted
- No `npm install` was performed
- No build, test, typecheck, or eslint was executed
- No external network connections were made
- No git push was performed
- No directory was renamed or deleted
- No raw values, secrets, or local paths were reported

この範囲では問題を検出していません。

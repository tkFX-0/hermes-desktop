# Naming Migration Candidates

## Purpose

This document lists all naming migration candidates discovered in the v1.1.0
Repository Hygiene Audit. It does not approve any rename. All items remain HOLD.

- auditVersion: v1.1.0
- auditDate: 2026-05-11
- decision: HOLD
- execution: disabled
- productionReady: false

---

## Legend

| Label | Meaning |
|---|---|
| RENAME_CANDIDATE | Can be renamed when scope is approved |
| KEEP | Must stay as-is (upstream reference or functional dependency) |
| MERGE_CANDIDATE | Directory/docs should be merged into new location |
| UPDATE_CANDIDATE | Content should be updated (not renamed) |
| HOLD_ASSESS | Needs further assessment before deciding |

---

## A. Repository-Level Names

| Item | Current Name | Candidate Name | Label | Notes |
|---|---|---|---|---|
| Repository directory | `hermes-desktop` | `shikishima-desktop` | RENAME_CANDIDATE | High-risk; git remote, all scripts |
| package.json name | `hermes-desktop` | `shikishima-desktop` | RENAME_CANDIDATE | Low-risk isolated change |
| package.json description | `Hermes Agent Desktop — self-improving AI assistant` | しきしま計画 desktop frontend | RENAME_CANDIDATE | Low-risk |
| package.json homepage | upstream GitHub URL | — | HOLD_ASSESS | Depends on whether repo goes public |

---

## B. Source Directories

| Item | Current Path | Candidate Path | Label | Notes |
|---|---|---|---|---|
| Main custom layer | `src/main/ichikishima/` | `src/main/shikishima/` | RENAME_CANDIDATE | High-risk; all imports must update |
| Shared types | `src/shared/ichikishima/` | `src/shared/shikishima/` | RENAME_CANDIDATE | High-risk; aligned with main |
| Test directory | `tests/ichikishima/` | `tests/shikishima/` | RENAME_CANDIDATE | Aligned with src rename |
| Screen component dir | `src/renderer/src/screens/ControlCenterAppShell/` | `ShikishimaShell/` | RENAME_CANDIDATE | Medium-risk; import paths |

---

## C. Source Files

| Item | Current File | Candidate Name | Label | Notes |
|---|---|---|---|---|
| Preload file | `src/preload/ichikishima-control-center.ts` | `shikishima-control-center.ts` | RENAME_CANDIDATE | Medium; preload registration |
| Orchestrator file | `src/main/ichikishima/orchestrator/ichikishima-orchestrator.ts` | `shikishima-orchestrator.ts` | RENAME_CANDIDATE | Internal class name also needs update |
| Logo component | `src/renderer/src/components/common/HermesLogo.tsx` | `ShikishimaLogo.tsx` / `AppLogo.tsx` | RENAME_CANDIDATE | Low-risk cosmetic |
| Logo asset | `src/renderer/src/assets/hermes.png` | `shikishima.png` or `icon.png` | RENAME_CANDIDATE | Low-risk; 1 import |

---

## D. HTML / Template Content

| Item | Current Content | Candidate Content | Label | Notes |
|---|---|---|---|---|
| index.html title | `<title>Hermes Agent</title>` | `<title>しきしま</title>` | RENAME_CANDIDATE | Very low risk; 1 line |
| HermesLogo alt | `alt="Hermes"` | `alt="しきしま"` | RENAME_CANDIDATE | Very low risk; 1 line |

---

## E. Documentation Directories

| Item | Current Path | Candidate Path | Label | Notes |
|---|---|---|---|---|
| Old implementation docs | `docs/ichikishima/` | `docs/shikishima/impl/` or merge into `docs/shikishima/` | MERGE_CANDIDATE | src code references exist |

---

## F. Rule/Config Files

| Item | Current Name | Candidate Name | Label | Notes |
|---|---|---|---|---|
| Cursor rule | `.cursor/rules/ichikishima-workflow.mdc` | `shikishima-workflow.mdc` | RENAME_CANDIDATE | Low-risk; internal rule |
| Cursor rule | `.cursor/rules/ichikishima-safety.mdc` | `shikishima-safety.mdc` | RENAME_CANDIDATE | Low-risk; internal rule |

---

## G. Content-Only Updates (No Rename, Just Content)

| Item | Current Content | Candidate Update | Label |
|---|---|---|---|
| `AGENTS.md` line 7 | `For Ichikishima / Hermes work` | `For しきしま work` | UPDATE_CANDIDATE |
| `AGENTS.md` line 29 | `` `docs/ichikishima/` documentation `` | `` `docs/shikishima/` documentation `` | UPDATE_CANDIDATE |
| `CLAUDE.md` scope section | `For Ichikishima / Hermes work` | `For しきしま work` | UPDATE_CANDIDATE |
| `control-center-status.ts` | `ICHIKISHIMA_READONLY_DOC_PATHS` const | update paths when docs/ichikishima is renamed | UPDATE_CANDIDATE |

---

## H. Items to KEEP As-Is (Not Rename Candidates)

These "Hermes" references are upstream dependency names. Renaming them would
break app functionality or misrepresent upstream attribution.

| Item | Reason to Keep |
|---|---|
| `src/main/hermes.ts` | Adapter to Nous Research hermes-agent backend |
| `src/main/installer.ts` constants HERMES_HOME etc. | Upstream `~/.hermes/` directory structure |
| `src/main/ichikishima/hermes/` subdirectory | Bridge to upstream hermes-agent; "hermes" = upstream |
| `.agents/skills/hermes-agent/SKILL.md` | Upstream hermes-agent project guide |
| `.claude/skills/hermes-agent/SKILL.md` | Upstream hermes-agent project guide |
| All `window.hermesAPI.*` calls in renderer | Upstream IPC bridge name |
| All hermes-agent URLs and README attributions | Upstream project references |

---

## Migration Phasing Recommendation

### Phase A — Docs-Only (Lowest Risk)

Can proceed without code changes:

1. ~~Update `AGENTS.md` "Ichikishima" references → "しきしま"~~ **DONE in v1.2.0**
2. ~~Update `CLAUDE.md` "Ichikishima" references → "しきしま"~~ **DONE in v1.2.0**
3. Plan `docs/ichikishima/` merge into `docs/shikishima/` — HOLD
4. Rename `.cursor/rules/ichikishima-*.mdc` files — HOLD

### Phase B — Cosmetic UI (Low Risk)

Low-risk, isolated UI text changes:

1. ~~Update `index.html` title~~ **DONE in v1.2.1** (`Hermes Agent` → `しきしま`)
2. ~~Update `HermesLogo.tsx` alt text~~ **DONE in v1.2.1** (`Hermes` → `しきしま`)
3. Rename `hermes.png` asset — HOLD (asset rename + import path update required)

### Phase C — Package Metadata

Phase C is split per v1.2.2 Package Metadata Audit findings.

#### Phase C-1 — Description (Very Low Risk)

1. ~~Update `package.json` description~~ **DONE in v1.2.3** (`Hermes Agent Desktop — self-improving AI assistant` → `Shikishima — desktop application for Hermes Agent`)

#### Phase C-2 — Product Display Name (Low Risk)

2. ~~Update `electron-builder.yml productName`~~ **DONE in v1.2.4** (`Hermes Agent` → `しきしま`)
   - productName is the user-visible app name; independent of package.json name
   - package.json name remains `hermes-desktop`; artifact filenames unchanged

#### Phase C-3 — Package Name (Medium Risk, Plan Created)

3. Update `package.json name` — HOLD (plan created in v1.2.5 → execution v1.3.0)
   - Current: `hermes-desktop`
   - Candidate: `shikishima-desktop`
   - Impact: artifact filenames (`${name}`), lockfile root name, `updaterCacheDirName`
   - Plan: `docs/shikishima/PACKAGE_NAME_MIGRATION_PLAN.md`
   - Pre-migration caveat: `package-lock.json` has existing unrelated dirty state; must resolve first
   - `publish.repo` and `dev-app-update.yml repo`: KEEP (external GitHub URL)

### Phase D — Source Directories (High Risk, Requires Tooling)

Requires full import path update:

1. `src/main/ichikishima/` → `src/main/shikishima/`
2. `src/shared/ichikishima/` → `src/shared/shikishima/`
3. `tests/ichikishima/` → `tests/shikishima/`
4. `src/preload/ichikishima-control-center.ts` rename

### Phase E — Repo Root Rename (Highest Risk)

1. `hermes-desktop/` directory rename

---

## Safety Boundary

No rename has been approved by this document. This is a candidate list only.
Each phase requires separate human GO decision.

この範囲では問題を検出していません。

# Phase D src Rename Plan — v1.7.0

## Plan Overview

- planVersion: v1.7.0
- planDate: 2026-05-12
- planType: plan-only — no rename executed
- roadmapVersion: v1.7.0
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- targetExecutionVersion: v1.7.1 (requires explicit human GO)

No files were renamed, moved, or modified during this plan creation.

---

## Rename Scope

### Primary Targets

| Current Path | Candidate Path | File count | Risk |
|---|---|---|---|
| `src/main/ichikishima/` | `src/main/shikishima/` | 82 files | HIGH |
| `src/shared/ichikishima/` | `src/shared/shikishima/` | 2 files | MEDIUM |
| `src/preload/ichikishima-control-center.ts` | `src/preload/shikishima-control-center.ts` | 1 file | MEDIUM |

### Dependent Test Paths

| Current Path | Candidate Path | File count | Risk |
|---|---|---|---|
| `tests/ichikishima/` | `tests/shikishima/` | 66 files | MEDIUM |

### Internal File Names (within ichikishima/)

| Current | Candidate | Notes |
|---|---|---|
| `ichikishima-orchestrator.ts` | `shikishima-orchestrator.ts` | Internal class name also needs update |

---

## Import Dependency Map

### Files importing from `ichikishima/`

| File | Import from | Notes |
|---|---|---|
| `src/main/index.ts` | `./ichikishima/control-center/control-center-readonly-ipc` | 3 imports |
| `src/main/index.ts` | `./ichikishima/control-center/control-center-project-root-resolution` | |
| `src/main/index.ts` | type from `./ichikishima/control-center/control-center-data-provider` | |
| `src/preload/index.d.ts` | type from `../main/ichikishima/control-center/control-center-app-snapshot` | |
| `src/preload/ichikishima-control-center.ts` | type from `../main/ichikishima/control-center/control-center-app-snapshot` | also imports from shared/ichikishima |
| `src/preload/ichikishima-control-center.ts` | from `../shared/ichikishima/control-center-readonly-ipc-channel` | |
| All `src/main/ichikishima/**/*.ts` | each other (internal) | ~200+ internal imports |
| `tests/ichikishima/**/*.test.ts` | `../../../src/main/ichikishima/...` | ~100+ test imports |

### Files importing from `shared/ichikishima/`

| File | Import from |
|---|---|
| `src/preload/ichikishima-control-center.ts` | `../shared/ichikishima/control-center-readonly-ipc-channel` |
| `src/main/ichikishima/control-center/control-center-readonly-ipc.ts` | `../../../shared/ichikishima/control-center-readonly-ipc-channel` |

---

## Execution Steps (HOLD — requires v1.7.1 GO)

| Step | Action | Risk | Notes |
|---|---|---|---|
| 0 | Pre-flight: verify typecheck passes on current code | — | Baseline before rename |
| 1 | Rename `src/main/ichikishima/` → `src/main/shikishima/` | HIGH | All files move; internal imports must update |
| 2 | Update all internal imports within `src/main/shikishima/` | HIGH | ~200+ import paths |
| 3 | Rename `src/shared/ichikishima/` → `src/shared/shikishima/` | MEDIUM | 2 files |
| 4 | Update imports in `src/main/shikishima/control-center/control-center-readonly-ipc.ts` | MEDIUM | 1 import path |
| 5 | Rename `src/preload/ichikishima-control-center.ts` → `src/preload/shikishima-control-center.ts` | MEDIUM | |
| 6 | Update `src/preload/index.ts` import for renamed preload file | MEDIUM | |
| 7 | Update `src/main/index.ts` import paths | MEDIUM | 3 import paths |
| 8 | Update `src/preload/index.d.ts` type import path | LOW | type only |
| 9 | Rename `tests/ichikishima/` → `tests/shikishima/` | MEDIUM | 66 files |
| 10 | Update all test import paths | MEDIUM | ~100+ paths |
| 11 | Run `npm run typecheck` to verify no broken imports | — | First verification |
| 12 | Run `npm run lint` to verify no lint errors | — | Second verification |
| 13 | Commit all changes atomically | — | Single rename commit |

---

## Rollback Plan

If the rename causes issues:

```
git revert <v1.7.1-rename-commit-hash>
```

Or manually (reverse order):
1. Rename `src/main/shikishima/` → `src/main/ichikishima/`
2. Rename `src/shared/shikishima/` → `src/shared/ichikishima/`
3. Rename `src/preload/shikishima-control-center.ts` → `src/preload/ichikishima-control-center.ts`
4. Restore all import paths
5. Rename `tests/shikishima/` → `tests/ichikishima/`
6. Restore all test import paths
7. Run `npm run typecheck` to verify rollback is clean

---

## GO Conditions

Before v1.7.1 rename execution:

- [ ] `tests/ichikishima/` commit decision made (committed or HOLD accepted)
- [ ] Explicit human GO issued for Phase D
- [ ] `npm run typecheck` passes on current code (pre-flight)
- [ ] Working tree is clean before rename (no other dirty files)
- [ ] Rollback plan understood and accepted

---

## NG Conditions

Stop and report if any of these occur:

- typecheck fails before rename (fix first)
- Automated tooling renames beyond the agreed scope
- External files or URLs are modified
- `publish.repo` or `dev-app-update.yml repo` are changed
- `appId` is changed

---

## Notes on Internal Rename Candidates

These internal names also use "ichikishima" but require additional review:

| Item | Notes |
|---|---|
| `ichikishima-orchestrator.ts` | File rename + internal class name update |
| `IchikishimaControlCenterPreloadApi` in preload | Interface name in `ichikishima-control-center.ts` |
| `ichikishimaControlCenter` window key | IPC bridge name exposed to renderer — changing is breaking |
| `ICHIKISHIMA_CONTROL_CENTER_PRELOAD_PUBLIC_METHODS` | Constant in preload |

**Important:** `ichikishimaControlCenter` window key and its IPC channel name
(`controlCenter.readonly.getAppSnapshot`) should remain unchanged during Phase D.
They are user-facing IPC identifiers. Changing them requires renderer updates.
This is a separate Phase D-2 decision, not included in Phase D-1 rename scope.

---

## Impact on Other Docs

- `AGENTS.md` line 29: `docs/ichikishima/` reference — update when Phase E-prep moves docs
- `CLAUDE.md` Scope: references ichikishima paths — update after src rename
- `.cursor/rules/ichikishima-*.mdc` — low-risk rule rename (Phase F)

この範囲では問題を検出していません。

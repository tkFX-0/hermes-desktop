# Phase D Rename Impact Matrix — v1.7.0

## Purpose

This matrix maps every ichikishima reference and its Phase D disposition.

- matrixVersion: v1.7.0
- matrixDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Source Directories

| Path | Action | Risk | Execution |
|---|---|---|---|
| `src/main/ichikishima/` | Rename → `src/main/shikishima/` | HIGH | v1.7.1 |
| `src/shared/ichikishima/` | Rename → `src/shared/shikishima/` | MEDIUM | v1.7.1 |
| `src/preload/ichikishima-control-center.ts` | Rename → `src/preload/shikishima-control-center.ts` | MEDIUM | v1.7.1 |

---

## Import Paths Requiring Update

| File | Current import | Updated import | Count |
|---|---|---|---|
| `src/main/index.ts` | `./ichikishima/control-center/...` | `./shikishima/control-center/...` | 3 |
| `src/preload/index.d.ts` | `../main/ichikishima/...` | `../main/shikishima/...` | 1 |
| `src/preload/index.ts` | `./ichikishima-control-center` | `./shikishima-control-center` | 1 |
| All files in `src/main/ichikishima/` | Internal cross-imports | Update to `shikishima/` | ~200 |
| `src/main/ichikishima/.../control-center-readonly-ipc.ts` | `../../../shared/ichikishima/...` | `../../../shared/shikishima/...` | 1 |
| All files in `tests/ichikishima/` | `../../../src/main/ichikishima/...` | `../../../src/main/shikishima/...` | ~100 |

---

## Identifiers Remaining Unchanged (Phase D-1)

| Identifier | Location | Reason |
|---|---|---|
| `ichikishimaControlCenter` | window key in `src/preload/index.ts` | IPC bridge name — breaking change if renamed |
| `ichikishimaControlCenter` | `src/preload/index.d.ts` global type | Same |
| `controlCenter.readonly.getAppSnapshot` | IPC channel name | Functional identifier — keep in Phase D-1 |
| `ICHIKISHIMA_CONTROL_CENTER_PRELOAD_PUBLIC_METHODS` | constant | Phase D-2 decision |
| `IchikishimaControlCenterPreloadApi` | interface name | Phase D-2 decision |

---

## Identifiers for Phase D-2 (separate decision)

These are user-facing identifiers that require coordinated change:

| Identifier | Current | Candidate | Notes |
|---|---|---|---|
| `ichikishimaControlCenter` window key | `ichikishimaControlCenter` | `shikishimaControlCenter` | Renderer code must also update |
| `IchikishimaControlCenterPreloadApi` | as-is | `ShikishimaControlCenterAPI` | Interface rename |
| IPC channel constant | `controlCenter.readonly.getAppSnapshot` | unchanged | Functional name is fine as-is |

---

## Test Directories

| Path | Action | Risk |
|---|---|---|
| `tests/ichikishima/` | Rename → `tests/shikishima/` | MEDIUM |

---

## Files NOT Renamed (KEEP)

| Path | Reason |
|---|---|
| `src/main/hermes.ts` | Upstream hermes-agent adapter |
| `src/main/ichikishima/hermes/` subdirectory | Bridge to upstream — "hermes" = upstream name |
| All `window.hermesAPI.*` references | Upstream IPC bridge |
| `publish.repo` | External GitHub URL |
| `dev-app-update.yml repo` | External GitHub URL |
| `appId` | macOS/Win app identifier |

---

## Estimated Effort

| Category | Files | Import changes | Risk |
|---|---|---|---|
| src/main rename | 82 | ~200 | HIGH |
| src/shared rename | 2 | 2 | LOW |
| preload rename | 1 | 2 | LOW |
| test rename | 66 | ~100 | MEDIUM |
| **Total** | **151** | **~304** | HIGH |

**Tooling recommended**: Use TypeScript language server rename refactoring or
`sed`/`find`+replace scripted approach. Manual rename of 304 import paths
is error-prone.

---

## Typecheck Gate

Before Phase D-1 execution:
1. Run `npm run typecheck` — must PASS (baseline)

After Phase D-1 execution:
2. Run `npm run typecheck` — must PASS (verification)

`typecheck` is normally HOLD but is explicitly required for v1.7.1 verification.
This typecheck exception applies ONLY to v1.7.1 Phase D execution.

この範囲では問題を検出していません。

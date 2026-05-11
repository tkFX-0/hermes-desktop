# Shikishima v2 Readiness Package — v2.0

## Package Overview

- packageVersion: v2.0
- packageDate: 2026-05-12
- roadmapVersion: v2.0 (current roadmap: v2.1.0)
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**v2.0 is NOT productionReady.**
**v2.0 is NOT a GO approval.**
**v2.0 is NOT execution approval for any agent, robot, or voice system.**
**v2.0 is a readiness review package only.**

---

## v2.0 Goal Completion Assessment

Goal statement (from v1.3.1):
> しきしまの名前・ControlCenter・Research・テスト候補・未追跡ファイル・移行計画が整理され、
> v3以降の実行検証に進める状態を作る。

### Naming — Organized ✓

| Item | Status |
|---|---|
| package.json name | `shikishima-desktop` ✓ |
| productName | `しきしま` ✓ |
| description | `Shikishima — desktop application for Hermes Agent` ✓ |
| HTML title / logo alt | `しきしま` ✓ |
| Instruction files (AGENTS.md, CLAUDE.md) | Updated ✓ |
| zh-CN navigation label | `Research` ✓ |
| Phase C-1/2/3 | DONE ✓ |

### ControlCenter + Research — Committed ✓

| Item | Status |
|---|---|
| src/main/ichikishima/ (82 files) | Committed in v1.2.11 ✓ |
| ControlCenter IPC bridge | Committed ✓ |
| Research screen | Committed ✓ |
| shared/ichikishima/ | Committed ✓ |
| ControlCenter IPC: read-only confirmed | ✓ |

### Test Candidates — Review Packages Created ✓

| Item | Status |
|---|---|
| tests/ichikishima/ review package | Created in v1.5.0 ✓ |
| tests/hermes/ review package | Created in v1.5.1 ✓ |
| dummy-hermes-path.ts risk assessment | Complete — SAFE ✓ |
| process-local test risk assessment | Complete — CI-guarded ✓ |
| Commit decision | HOLD — human GO required |

### Untracked Files — Classified + Mitigation ✓

| Item | Status |
|---|---|
| sandbox/ gitignore | Added in v1.4.0 ✓ |
| .claude/.cursor gitignore | Added in v1.4.0 ✓ |
| docs/ichikishima/ migration plan | Created in v1.6.0 ✓ |
| Untracked inventory | Created in v1.3.1 ✓ |

### Migration Plans — Created ✓

| Item | Status |
|---|---|
| Package name migration | EXECUTED in v1.3.0 ✓ |
| Phase D src rename plan | Created in v1.7.0 ✓ |
| Phase D impact matrix | Created in v1.7.0 ✓ |
| Phase E repo rename plan | Created in v1.9.0 ✓ |
| Phase E external reference matrix | Created in v1.9.0 ✓ |

---

## Completed Tasks Summary

| Task | Version | Status |
|---|---|---|
| Post-migration reference audit | v1.3.1 | DONE |
| Sandbox gitignore | v1.4.0 | DONE |
| tests/ichikishima review | v1.5.0 | DONE |
| tests/hermes review | v1.5.1 | DONE |
| docs/ichikishima migration plan | v1.6.0 | DONE |
| Phase D src rename plan | v1.7.0 | DONE |
| Phase E repo rename plan | v1.9.0 | DONE |

---

## Deferred / HOLD Items

| Item | Version | Status | Reason |
|---|---|---|---|
| tests/ichikishima commit | v1.5.0+ | HOLD | Human GO required |
| tests/hermes commit | v1.5.1+ | HOLD | Human GO required |
| docs/ichikishima archive/merge | v1.6.0+ | HOLD | Scope decision required |
| Phase D src rename execution | v1.7.1 | HOLD | Explicit human GO required |
| Phase D post-rename audit | v1.8.0 | Deferred | After v1.7.1 executes |
| Phase E repo rename execution | v1.9.1 | HOLD | External + explicit GO required |
| appId change | — | HOLD | Separate decision |
| win.executableName change | — | HOLD | Optional |

---

## What Is Still HOLD

```text
execution:       disabled
productionReady: false
robotMotion:     HOLD
git push:        not approved
build/test:      HOLD (except typecheck in v1.7.1 scope)
WSL/Hermes/RunPod/StackChan/voice: HOLD
```

---

## State of Working Tree at v2.0

| Category | State |
|---|---|
| Tracked dirty files | None (clean) |
| Untracked: tests/ichikishima/ | 66 files — commit-ready, HOLD |
| Untracked: tests/hermes/ | 12 files — commit-ready, HOLD |
| Untracked: docs/ichikishima/ | 127 files — legacy archive plan ready |
| Untracked: sandbox/ | now gitignored — local-only |
| Untracked: .claude/.cursor | now gitignored — local-only |
| Untracked: ChatGPT image | local file |

---

## v3.x Preconditions

Before v3.x execution validation can begin:

| Precondition | Current State | Required for v3.x |
|---|---|---|
| tests/ichikishima/ committed | HOLD | Recommended — test coverage needed |
| tests/hermes/ committed | HOLD | Recommended |
| Phase D src rename executed | HOLD | Not strictly required — ichikishima names work |
| Phase D-2 window key rename | HOLD | Not required |
| Phase E GitHub rename | HOLD | Not required |
| ControlCenter IPC read-only verified | Done (v1.2.9) | ✓ |
| Safety invariants maintained | Done | ✓ |
| Execution gate | disabled | Needs separate GO for any runtime |

**Minimum v3.x preconditions:**
1. test suite committed (tests/ichikishima/ + tests/hermes/)
2. Typecheck passes (currently HOLD — would need to be run for v3.x)
3. Separate scoped GO for the specific v3.x work

---

## Not Required Before v3.x

- Phase D src rename (cosmetic — does not affect functionality)
- Phase E repo rename (external — does not affect functionality)
- docs/ichikishima archive (legacy docs — does not affect functionality)
- appId change (separate optional decision)

---

## Safety Boundary Confirmation (v2.0)

- No source files modified
- No package metadata modified
- No npm install, build, test, or typecheck executed
- No external network operations
- No git push
- No raw values, secrets, or local paths reported
- productionReady remains false
- execution remains disabled
- robotMotion remains HOLD

この範囲では問題を検出していません。

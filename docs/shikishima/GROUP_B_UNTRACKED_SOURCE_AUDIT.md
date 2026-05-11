# Group B Untracked Source Audit — v1.2.9

## Audit Overview

- auditVersion: v1.2.9
- auditDate: 2026-05-11
- auditType: audit-only / report-only / redacted-only
- roadmapVersion: v1.2.9
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

No source files were modified during this audit.
No files were staged, committed, or reverted. No build or test was run. No git push.

---

## Background

From `SRC_DIRTY_FILES_CLASSIFICATION.md` (v1.2.7 / updated v1.2.8):

> Group B (feature work, has untracked deps): commit together with untracked
> `ichikishima/`, `Research/`, etc.

This audit classifies the untracked source candidates and their relationship
to tracked Group B files, to determine whether a single feature commit is
feasible and what preconditions are needed.

---

## Already-Tracked Source (Not Untracked)

The following were expected to be untracked but are confirmed **already committed**:

| File / Directory | Status | Notes |
|---|---|---|
| `src/renderer/src/screens/ControlCenterAppShell/ControlCenterAppShell.tsx` | **TRACKED** (1 file) | Already committed; no staging needed |
| `src/shared/i18n/locales/en/controlCenter.ts` | **TRACKED** | Already committed |
| `src/shared/i18n/locales/zh-CN/controlCenter.ts` | **TRACKED** | Already committed |

This simplifies the commit scope: `ControlCenterAppShell` and the `controlCenter`
i18n locale files do not need to be staged for Group B.

---

## Untracked Source Inventory

### A. `src/main/ichikishima/` — large untracked directory

| Subdirectory | File count | Role |
|---|---|---|
| `agent-team/` | 9 files | Agent registry, scheduling, supervisor, capability matrix, task queue |
| `approval/` | 6 files | Human approval queue, approval report, store |
| `audit/` | 4 files | Audit logging, summary, save |
| `autonomy-zone/` | 11 files | Safety boundary: path guard, read/write policy, denylist, wrapper |
| `control-center/` | 10 files | Read-only IPC, data provider, snapshot, rooms, status, local API |
| `core/` | 3 files | Silence gate, state, speak-value |
| `hermes/` | 17 files | Hermes bridge, WSL2 wrapper, controlled pilot, local pilot, file handoff |
| `memory/` | 2 files | Memory candidate |
| `orchestrator/` | 2 files | Main orchestrator |
| `pilot/` | 2 files | Local pilot full-loop |
| `review/` | 2 files | Hermes report reviewer |
| `visualization/` | 4 files | Agent team visualization model, events |
| **Total** | **~72 files** | Core AI agent management system |

**Classification: ControlCenter IPC + full ichikishima system**

The `control-center/` subdirectory is directly required by tracked Group B files.
The other subdirectories are required transitively (the control-center files
import from `hermes/`, `agent-team/`, `visualization/`, etc.).

**Safety note on control-center-readonly-ipc.ts:**
Header comment confirms: read-only IPC registration only. Execution channels
and raw channels are explicitly NOT registered.

**Safety note on control-center-app-snapshot.ts:**
Header comment confirms: payload explicitly excludes raw API keys, stdio,
secrets, and executable absolute paths.

---

### B. `src/preload/ichikishima-control-center.ts` — 20 lines

| Field | Value |
|---|---|
| Role | Preload IPC bridge factory |
| Exports | `createIchikishimaControlCenterPreloadApi()` |
| What it exposes | `getAppSnapshot()` — one read-only IPC call |
| IPC channel | shared constant from `src/shared/ichikishima/` |
| Execution IPC | none |
| Classification | **ControlCenter preload bridge** |
| Risk | LOW (read-only, single method) |

---

### C. `src/renderer/src/screens/Research/Research.tsx` — 47 lines

| Field | Value |
|---|---|
| Role | Research dashboard screen (React component) |
| Mechanism | Fetches local service status; renders embedded iframe |
| Local service dependency | Requires a local web server at a fixed port |
| ControlCenter IPC usage | None — completely independent of ControlCenter IPC |
| Classification | **Research dashboard screen** |
| Risk | LOW-MEDIUM |

**Research.tsx-specific caveat:**
This component embeds a local web server URL. It includes a status check
(fetch → alive state) and graceful error handling (onError sets alive=false).
The component does not crash if the local service is unavailable — it degrades
to an error state. However, the local service dependency means this feature
only functions in environments where the local server is running.

This component is **architecturally separate** from the ControlCenter IPC
system. It is grouped with Group B only because `Layout.tsx` adds both
`research` and `controlCenter` navigation in the same diff.

---

### D. `src/shared/ichikishima/` — 2 files

| File | Role |
|---|---|
| `control-center-readonly-ipc-channel.ts` | Exports IPC channel name constant (string) |
| `control-center-shell-ui-contract.ts` | Type/contract definitions for shell UI |

Classification: **shared constants / type contracts** — minimal, low-risk.
Required by both `src/main/ichikishima/control-center/` and
`src/preload/ichikishima-control-center.ts`.

---

## Dependency Graph

```text
Tracked Group B (7 files)         Untracked source required
────────────────────────────────────────────────────────
src/main/index.ts
  ├─ registerControlCenterReadonlyIpcHandlers
  ├─ controlCenterElectronHintsFromApp        ──→ src/main/ichikishima/control-center/ (10 files)
  └─ resolveControlCenterPathResolution           └─ imports from ichikishima/ (~62 more files)

src/preload/index.d.ts
  └─ ControlCenterAppSnapshot type           ──→ src/main/ichikishima/control-center/
                                                  control-center-app-snapshot.ts

src/preload/index.ts
  └─ createIchikishimaControlCenterPreloadApi ─→ src/preload/ichikishima-control-center.ts (NEW)
                                                  ├─ src/main/ichikishima/control-center/
                                                  │  control-center-app-snapshot.ts
                                                  └─ src/shared/ichikishima/ (NEW)
                                                     control-center-readonly-ipc-channel.ts

src/renderer/src/screens/Layout/Layout.tsx
  ├─ ControlCenterAppShell                   ──→ [ALREADY TRACKED ✓]
  └─ Research                                ──→ src/renderer/src/screens/Research/
                                                  Research.tsx (NEW, standalone)

src/shared/i18n/index.ts
  ├─ controlCenterEn                         ──→ [ALREADY TRACKED ✓]
  └─ controlCenterZh                         ──→ [ALREADY TRACKED ✓]

src/shared/i18n/locales/en/navigation.ts     (self-contained — no untracked deps)
src/shared/i18n/locales/zh-CN/navigation.ts  (self-contained — no untracked deps)
```

**Minimum untracked source for Group B commit:**

```text
src/main/ichikishima/          (~72 files) — core agent system
src/preload/ichikishima-control-center.ts  (1 file, 20 lines)
src/renderer/src/screens/Research/Research.tsx  (1 file, 47 lines)
src/shared/ichikishima/        (2 files) — IPC channel + type contract
```

---

## zh-CN Navigation Label Finding

| Label key | en/navigation.ts | zh-CN/navigation.ts | Assessment |
|---|---|---|---|
| `research` | `"Research"` | `"リサーチ"` | **PLACEHOLDER** — Japanese in zh-CN locale |
| `controlCenter` | `"Control Center"` | `"Control Center"` | Acceptable — technical term in English |

**zh-CN `research: "リサーチ"` is confirmed a placeholder.**

Pattern in existing zh-CN labels: `"计划任务"`, `"网关"`, `"设置"` — all use Chinese.
The label `"リサーチ"` is Japanese katakana and does not follow this pattern.

**Suggested corrections (not applied in this task):**

| Option | Value | Notes |
|---|---|---|
| A | `"Research"` | Keep English (same as controlCenter) — consistent |
| B | `"研究"` | Chinese for research/study — follows locale pattern |
| C | `"数据研究"` | Data research — more specific |

Recommended: Option A (`"Research"`) for consistency with `controlCenter: "Control Center"`.
This should be fixed before the Group B commit is created.

---

## Commit Feasibility Assessment

### Option 1: Single Feature Commit (all Group B + untracked)

**Scope:**
- 7 tracked Group B files
- ~72 ichikishima files
- 1 preload bridge file
- 1 Research screen file
- 2 shared ichikishima files
- **Total: ~83 files**

**Feasibility: YES — with preconditions**

Preconditions:
1. Fix zh-CN `research` label before staging (low-risk 1-line change in zh-CN/navigation.ts)
2. Verify no raw values / secrets in ichikishima source (redacted audit of ichikishima/hermes/)
3. No test files (tests/ichikishima/) needed for compilation — can be committed separately

**Risk: MEDIUM** (large commit, but well-scoped feature)

### Option 2: Split into B-1 (ControlCenter) and B-2 (Research)

**Feasibility: REQUIRES Layout.tsx modification**

Layout.tsx currently adds both `research` and `controlCenter` navigation in
one diff. A clean split requires removing the `research` part from the current
Layout.tsx diff, which would require a tracked file modification (allowed, but
needs GO for modification).

**Risk: LOW per-commit, but requires extra edit step**

### Option 3: Revert Group B entirely

**Feasibility: YES (git checkout -- for tracked, git clean for untracked)**

If the feature is not ready for commit, all Group B changes can be reverted.
This would clean the working tree for v1.3.0 package name migration.

**Risk: LOW for working tree; feature work would need to be re-applied later**

---

## Recommended Handling

**Recommended: Option 1 (single feature commit) after preconditions**

Rationale:
1. ControlCenter IPC and Research screen are small, self-contained additions
2. ichikishima source is the core system already designed with safety in mind
   (read-only IPC, explicit exclusion of secrets from snapshot payload)
3. Splitting requires additional edit to Layout.tsx — adds complexity
4. The zh-CN label fix is a 1-line change, low risk
5. Tests can be committed separately after Group B

**Required before Group B commit:**
1. Fix zh-CN `research` label (1-line change)
2. Audit ichikishima/hermes/ for any accidental local-only values (separate task or review)
3. Confirm tests/ichikishima/ will be committed separately (not required for compilation)

---

## v1.3.0 GO Conditions Update

| Condition | Previous State | Current State |
|---|---|---|
| Group A files committed | BLOCK → **PASS** (v1.2.8) | PASS |
| Group B tracked files committed | BLOCK | BLOCK (pending option 1 or 3) |
| Group B untracked source committed | BLOCK | BLOCK (pending option 1 or 3) |
| zh-CN research label fixed | CAUTION | CAUTION — confirmed placeholder |
| Working tree clean | BLOCK | BLOCK (Group B remains) |
| package-lock version stamp | PASS | PASS (non-blocker) |

---

## v1.3.0 BLOCK Conditions

| Blocker | Required Action |
|---|---|
| Group B tracked (7 files) | Commit with untracked (Option 1) OR revert (Option 3) |
| ichikishima/ untracked (~72 files) | Stage with Group B commit OR revert/ignore |
| preload/ichikishima-control-center.ts | Stage with Group B commit OR revert |
| Research/Research.tsx | Stage with Group B commit OR revert |
| shared/ichikishima/ (2 files) | Stage with Group B commit |
| zh-CN research label placeholder | Fix before Group B commit (1 line) |
| Working tree clean | Resolve all Group B items above |

---

## Safety Boundary Confirmation

During this audit:

- No source files were modified
- No files were staged, committed, or reverted
- No `npm install` was performed
- No build, test, typecheck, or eslint was executed
- No external network connections were made
- No git push was performed
- No directory was renamed or deleted
- No raw values, secrets, or local paths were reported
- Local service port noted as classification context (not as raw value)

この範囲では問題を検出していません。

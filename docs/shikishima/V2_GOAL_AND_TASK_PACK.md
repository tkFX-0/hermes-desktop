# V2 Goal and Task Pack — v1.3.1

## v2.0 Goal Definition

- goalVersion: v2.0
- documentedAt: v1.3.1
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

**Goal statement:**

> しきしまの名前・ControlCenter・Research・テスト候補・未追跡ファイル・移行計画が整理され、
> v3以降の実行検証に進める状態を作る。

This means:

- All Phase C migrations are complete and documented.
- ControlCenter IPC source (ichikishima/) is committed and audited.
- Research screen is committed.
- tests/ (ichikishima + hermes) are reviewed and either committed or formally HOLD.
- Untracked worktree inventory is resolved (committed, ignored, or archived).
- Phase D (src rename) plan is reviewed and either scheduled or formally deferred.
- Phase E (repo rename) plan is reviewed and either scheduled or formally deferred.
- Roadmap is clean enough for v3.x execution preparation.

---

## What v2.0 Is NOT

```text
v2.0 is NOT productionReady.
v2.0 is NOT a GO approval.
v2.0 is NOT execution approval for any agent, robot, or voice system.
v2.0 is NOT approval for StackChan, WSL, Hermes, RunPod, or external API.
v2.0 is NOT approval for voice I/O, camera, or microphone.
v2.0 is NOT Phase D or Phase E execution approval.
v2.0 is NOT a git push approval.
```

v2.0 is a readiness review package only. It documents what has been done,
what remains, and what the next decision points are for v3.x.

---

## Task Pack: v1.3.1 → v2.0

### v1.3.1 — Post-Migration Reference Audit + V2 Goal Pack

| Field | Value |
|---|---|
| Status | **CURRENT** |
| Target | docs/shikishima only |
| Deliverables | POST_V1_3_0_REFERENCE_AUDIT.md, UNTRACKED_WORKTREE_INVENTORY.md, V2_GOAL_AND_TASK_PACK.md, V2_HOLD_GATE_MATRIX.md, V2_IMPLEMENTATION_SEQUENCE.md |
| HOLD gates | none — docs only |
| Commit type | docs-only |

---

### v1.4.0 — Sandbox gitignore Audit

| Field | Value |
|---|---|
| Status | HOLD — pending |
| Target | `.gitignore`, `sandbox/` |
| Purpose | Verify sandbox/ is fully covered by .gitignore; add rules if needed |
| HOLD gate | sandbox/ staging prohibited until gitignore audit complete |
| Commit type | chore(.gitignore) — low risk |
| Blocked by | none |

---

### v1.5.0 — tests/ichikishima Review Package

| Field | Value |
|---|---|
| Status | HOLD — requires human GO |
| Target | `tests/ichikishima/` (69 files) |
| Purpose | Audit test files for any local-only values; review dummy-hermes-path.ts; review process-local test |
| HOLD gate | test commit decision requires human review of content |
| Commit type | test(cc): add ichikishima test suite |
| Blocked by | human review of dummy-hermes-path.ts and process-local test file |

---

### v1.5.1 — tests/hermes Review and Commit

| Field | Value |
|---|---|
| Status | HOLD — coordinate with v1.5.0 |
| Target | `tests/hermes/` (12 files) |
| Purpose | Commit autonomy-zone tests after ichikishima test decision |
| HOLD gate | depends on v1.5.0 GO |
| Commit type | test(autonomy-zone): add hermes autonomy-zone tests |
| Blocked by | v1.5.0 decision |

---

### v1.6.0 — docs/ichikishima Migration Plan

| Field | Value |
|---|---|
| Status | HOLD — requires plan review |
| Target | `docs/ichikishima/` (127 files) |
| Purpose | Plan merge into docs/shikishima/ or archive; decide scope |
| HOLD gate | 127 files of legacy docs; scope decision needed before action |
| Commit type | docs(migration): migrate ichikishima legacy docs |
| Blocked by | human scope decision |

---

### v1.7.0 — Phase D src Rename Plan

| Field | Value |
|---|---|
| Status | HOLD — plan-only, no execution |
| Target | `src/main/ichikishima/`, `src/shared/ichikishima/`, `src/preload/ichikishima-control-center.ts` |
| Purpose | Write a safe rename plan with full import path update strategy |
| HOLD gate | Plan creation is allowed; execution requires separate GO |
| Commit type | docs(plan): Phase D src rename plan |
| Blocked by | human review of plan before execution |
| Note | This task creates the plan doc only — like v1.2.5 did for package name |

---

### v1.7.1 — Phase D src Rename Execution (conditional)

| Field | Value |
|---|---|
| Status | HOLD — requires explicit GO |
| Target | All ichikishima → shikishima source renames + import updates |
| Purpose | Execute Phase D rename after plan is approved |
| HOLD gate | Must have explicit human GO after v1.7.0 plan review |
| Commit type | refactor(rename): ichikishima → shikishima source directories |
| Blocked by | v1.7.0 plan + explicit human GO |

---

### v1.8.0 — Phase D Post-Rename Reference Audit (conditional)

| Field | Value |
|---|---|
| Status | HOLD — only if v1.7.1 executed |
| Purpose | Audit all references after src rename; verify no broken imports |
| Commit type | docs(audit): post Phase-D rename reference audit |
| Blocked by | v1.7.1 |

---

### v1.9.0 — Phase E repo rename Plan

| Field | Value |
|---|---|
| Status | HOLD — plan-only, requires GitHub coordination |
| Target | GitHub repo rename + publish.repo + dev-app-update.yml repo |
| Purpose | Plan the GitHub repo rename and downstream URL changes |
| HOLD gate | Requires external GitHub action; URL changes affect update mechanism |
| Commit type | docs(plan): Phase E GitHub repo rename plan |
| Blocked by | human GitHub decision |

---

### v2.0 — Shikishima v2 Readiness Package

| Field | Value |
|---|---|
| Status | HOLD — milestone |
| Purpose | Consolidate all v1.3.x work into a v2.0 readiness review |
| Contents | Summary of completed migrations, remaining HOLDs, v3.x preparation |
| NOT | productionReady, GO approval, execution approval |
| Commit type | docs(milestone): v2.0 shikishima readiness package |
| Blocked by | all v1.3.x → v1.9.x tasks (or formally deferred) |

---

## Dependency Graph

```text
v1.3.1 (current) ─→ v1.4.0 (sandbox gitignore)
                 └─→ v1.5.0 (tests/ichikishima review)
                        └─→ v1.5.1 (tests/hermes commit)
                 └─→ v1.6.0 (docs/ichikishima migration plan)
                 └─→ v1.7.0 (Phase D plan) ─→ v1.7.1 (Phase D execution)
                                                └─→ v1.8.0 (post-rename audit)
                 └─→ v1.9.0 (Phase E plan)
                 └─→ v2.0 (readiness package) — depends on all above or formal deferral
```

---

## Immediately Safe Tasks

These can proceed without HOLD gates:

| Task | What |
|---|---|
| v1.4.0 | sandbox gitignore audit (docs + .gitignore update only) |
| v1.7.0 | Phase D src rename PLAN only (no execution) |
| v1.9.0 | Phase E repo rename PLAN only (no execution) |

## Tasks Requiring Human GO

| Task | Gate |
|---|---|
| v1.5.0 | tests/ichikishima content review + dummy file decision |
| v1.5.1 | depends on v1.5.0 |
| v1.6.0 | docs/ichikishima scope decision |
| v1.7.1 | Phase D execution GO |
| v1.9.x | GitHub repo rename decision |

この範囲では問題を検出していません。

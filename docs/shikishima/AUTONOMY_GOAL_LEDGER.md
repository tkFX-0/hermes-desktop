# Autonomy Goal Ledger

Date: 2026-05-26
Mode: repo-local Obsidian-compatible Markdown
Actual Obsidian write: HOLD

---

## 0. Safety Boundary

This ledger is a repo-local Markdown work ledger.

```text
Obsidian actual write remains HOLD.
These files are repo-local Obsidian-compatible Markdown only.
No external write is approved by this ledger.
```

Current invariants:

```text
productionReady: false
execution: disabled
Discord_send: HOLD
Obsidian_write: HOLD
StackChan_connection: HOLD
runtime_start: NOT_APPROVED
git_push: separate human GO only
```

---

## 1. Current Baseline

```text
branch: main
HEAD: 168a6eb
origin/main: 168a6eb
commits_ahead: 0
ledger_updated: 2026-05-26
Master Spec: PUSHED
Goal A1 route registry: PUSHED
Goal A2 createExternalActionGuard: PUSHED
Goal A3 structured HOLD coverage: PUSHED
Goal A4 IPC integration plan: PUSHED
Goal A5 guard preview: PUSHED
Goal A6 real handler integration: HOLD
Worker Task Contract Foundation: PUSHED
Worker Task Contract Types: PUSHED
Worker Task Contract Fixture Registry: PUSHED
Worker Task Contract Preview: PUSHED
Goal Runner Dry-run: PUSHED
```

Current safety state:

```text
decision: HOLD
productionReady: false
execution: disabled
rawValuesReported: false
runtime_started: false
Discord_send: false
Obsidian_actual_write: HOLD
StackChan_connection: false
```

---

## 2. Status Labels

Use:

```text
TODO
IN_PROGRESS
PASS
HOLD
STOP
PUSH_PENDING
PUSHED
DEFERRED
```

Meaning:

- `TODO`: ready to be selected if dependencies are met.
- `IN_PROGRESS`: currently being worked.
- `PASS`: local task passed.
- `PUSH_PENDING`: local commit exists and needs Push GO.
- `PUSHED`: origin/main reflects the work.
- `HOLD`: blocked by safety, design, or human gate.
- `STOP`: failed or unsafe.
- `DEFERRED`: intentionally postponed.

---

## 3. Completed Goals

### Goal A: External Action Guard Foundation

| Subgoal | Status | Commit / Evidence | Notes |
|---|---|---|---|
| A1 route registry | PUSHED | `efd0b25` | static route registry and classification tests |
| A2 createExternalActionGuard | PUSHED | `a10efb4` | pure guard decision function |
| A3 structured HOLD coverage | PUSHED | `d17742a` | all dangerous routes keep `effectMayRun=false` |
| A4 IPC integration plan | PUSHED | `a471154` | selected A5 scope defined |
| A5 guard preview | PUSHED | `7287359` | shared non-executing preview helper |
| A6 real handler integration | HOLD | not started | requires separate goal and review |

### Goal B: Worker Task Contract + Goal Runner Dry-run

| Subgoal | Status | Commit / Evidence | Notes |
|---|---|---|---|
| Worker Task Contract Foundation | PUSHED | `cbcf2e1` | `docs: define worker task contract foundation` |
| Worker Task Contract Types | PUSHED | `52e2b6c` | `feat: add worker task contract types` |
| Worker Task Contract Fixture Registry | PUSHED | `e34444f` | `test: add worker task contract fixture registry` |
| Worker Task Contract Preview | PUSHED | `2bcd087` | `feat: add worker task contract preview`; preview-only helper |
| Goal Runner Dry-run | PUSHED | `168a6eb` | `feat: add goal runner dry-run`; dry-run-only layer |

Pushed commit chain (Worker Task Contract → Goal Runner):

```text
cbcf2e1 docs: define worker task contract foundation
52e2b6c feat: add worker task contract types
e34444f test: add worker task contract fixture registry
2bcd087 feat: add worker task contract preview
168a6eb feat: add goal runner dry-run
```

### Goal Runner Dry-run boundary (not an execution runner)

Goal Runner Dry-run is dry-run only.

```text
It is not an execution runner.
It does not execute commands.
It does not start runtime.
It does not write external services.
It does not enable git push automation.
It does not enable productionReady.
It does not enable execution.
```

Implementation: `src/shared/goal-runner-dry-run/` calls `previewWorkerTaskContract()` only.
No IPC, preload, UI, shell, or worker execution wiring.

Full test evidence at push: vitest 974 passed / 1 skipped (2026-05-26 push GO).

---

## 4. Active Goal

```text
active_goal: none (ledger maintenance complete for Worker Task Contract + Goal Runner Dry-run)
status: PASS
last_completed_goal: shikishima.autonomy-ledger-record-goal-runner-dry-run
external_effects: none
actual_obsidian_write: false
```

---

## 5. Next Goal Queue

| Order | Goal | Status | Dependency | Human Gate Needed |
|---|---|---|---|---|
| 1 | `/goal shikishima.goal-runner-dry-run-report-fixtures` | TODO | Goal Runner Dry-run PUSHED | source-change GO |
| 2 | Goal A6: selected handler integration planning/implementation | HOLD | A5 PUSHED | source-change GO |
| 3 | Goal C: Memory Scope / Persona / Model Trace Foundation | TODO | Master Spec | source-change GO |
| 4 | Goal D: Discord-first Command Intake | HOLD | Guard integration | Discord read/send gate |
| 5 | Goal E: Report Draft / Evidence Pipeline | TODO | Ledger foundation | local write guard |
| 6 | Goal F: One-shot External Operation Gate | HOLD | Guard + evidence pipeline | one-shot GO |
| 7 | Goal G: Runtime Observation Gate | HOLD | Runtime request policy | Runtime GO |
| 8 | Goal H: StackChan Re-entry Gate | HOLD | Guard + device-specific gates | StackChan GO |
| 9 | Goal I: Semi-autonomous Operation Loop | DEFERRED | all prior goals | Continuous Autonomy GO |

Next recommended goal detail:

```text
/goal shikishima.goal-runner-dry-run-report-fixtures

Use existing Worker Task Contract fixtures and Goal Runner dry-run to generate structured report fixtures.
Still no execution runner.
Still no IPC/preload/UI connection.
```

Remaining explicit HOLD (do not infer approval):

```text
Goal A6 real handler integration: HOLD
actual execution runner: HOLD
runtime start: HOLD
Obsidian actual write: HOLD
Discord send: HOLD
StackChan connection: HOLD
productionReady true: HOLD
execution enabled: HOLD
```

---

## 6. Blocked Goals

| Goal | Blocker | Required Unblock |
|---|---|---|
| Discord send | external write | Discord Send GO |
| Obsidian actual write | local write | Obsidian Write GO |
| StackChan connection | device/network effect | StackChan Connection GO |
| Runtime observation | runtime start | Runtime GO |
| productionReady true | release gate | ProductionReady GO |
| execution enabled | execution gate | Execution Enablement GO |

---

## 7. Deferred Goals

| Goal | Reason |
|---|---|
| StackChan firmware changes | firmware/device operations are held behind separate gate |
| continuous camera/mic monitoring | privacy and always-on concerns |
| Discord auto-reply | autonomous external write not approved |
| continuous autonomous operation | requires final acceptance and kill-switch proof |

---

## 8. Human-Gated Goals

See `HUMAN_GATE_QUEUE.md` for gate details.

Current human-gated categories:

- Push GO
- Runtime GO
- Discord Send GO
- Obsidian Write GO
- StackChan Connection GO
- StackChan Firmware GO
- Dependency Change GO
- ProductionReady GO
- Execution Enablement GO
- Continuous Autonomy GO

---

## 9. Runner Notes

Codex should:

1. Read `SHIKISHIMA_AUTONOMY_IMPLEMENTATION_MASTER_SPEC.md`.
2. Read this ledger.
3. Select the first `TODO` goal that is not blocked.
4. Confirm allowed and forbidden files.
5. Execute only inside goal scope.
6. Run verification.
7. Create local commit if checks pass.
8. Update this ledger in a later goal only when explicitly allowed.
9. Stop at human gates.

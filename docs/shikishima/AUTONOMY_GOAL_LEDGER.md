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
origin/main: 7287359
commits_ahead_at_ledger_start: 0
Master Spec: PUSHED
Goal A1 route registry: PUSHED
Goal A2 createExternalActionGuard: PUSHED
Goal A3 structured HOLD coverage: PUSHED
Goal A4 IPC integration plan: PUSHED
Goal A5 guard preview: PUSHED
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

---

## 4. Active Goal

```text
active_goal: shikishima.autonomy-ledger-foundation
status: IN_PROGRESS
purpose: create repo-local Goal Queue, Runner Protocol, and Human Gate Queue
external_effects: none
actual_obsidian_write: false
```

---

## 5. Next Goal Queue

| Order | Goal | Status | Dependency | Human Gate Needed |
|---|---|---|---|---|
| 1 | Goal A6: selected handler integration planning/implementation | TODO | A5 PUSHED | source-change GO |
| 2 | Goal B: Worker Task Contract Foundation | TODO | Master Spec | source-change GO |
| 3 | Goal C: Memory Scope / Persona / Model Trace Foundation | TODO | Master Spec | source-change GO |
| 4 | Goal D: Discord-first Command Intake | HOLD | Guard integration | Discord read/send gate |
| 5 | Goal E: Report Draft / Evidence Pipeline | TODO | Ledger foundation | local write guard |
| 6 | Goal F: One-shot External Operation Gate | HOLD | Guard + evidence pipeline | one-shot GO |
| 7 | Goal G: Runtime Observation Gate | HOLD | Runtime request policy | Runtime GO |
| 8 | Goal H: StackChan Re-entry Gate | HOLD | Guard + device-specific gates | StackChan GO |
| 9 | Goal I: Semi-autonomous Operation Loop | DEFERRED | all prior goals | Continuous Autonomy GO |

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

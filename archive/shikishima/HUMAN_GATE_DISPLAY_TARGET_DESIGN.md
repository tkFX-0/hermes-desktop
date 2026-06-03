# Human Gate Display Target Design

Date: 2026-05-26
Goal: `shikishima.human-gate-display-target-design`
Mode: docs-only design; no implementation approval

---

## 1. Purpose

This document defines where `HumanGateReport` objects may be **displayed** or **handed off** in future phases, and which human gates must be cleared before each connection.

It answers:

```text
Where should Human Gate reports be displayed or handed off later,
and what gates are required before each connection?
```

This document does **not** approve UI, IPC, queue mutation, runtime, or external writes.

```text
Obsidian actual write remains HOLD.
These files are repo-local Obsidian-compatible Markdown only.
No external write is approved by this design.
```

---

## 2. Current Pipeline

Implemented today (pure TypeScript fixtures/helpers only):

```text
WorkerTaskContract
  → dryRunGoalContract()
  → createGoalRunnerDryRunReport()
  → createHumanGateReportFromDryRunReport()
  → (no display / handoff wiring yet)
```

Source locations:

| Stage | Module |
|---|---|
| Contract + preview | `src/shared/worker-task-contract/` |
| Goal dry-run | `src/shared/goal-runner-dry-run/` |
| Dry-run report | `src/shared/goal-runner-dry-run/goal-runner-dry-run-report.ts` |
| Human Gate report | `src/shared/human-gate-report/` |

Pushed baseline: `origin/main` at `acbbe4e` (ledger records Human Gate Report Fixtures PUSHED).

---

## 3. Current Implemented Status

| Layer | Status | Notes |
|---|---|---|
| Worker Task Contract | PUSHED | validation + fixtures |
| Goal Runner dry-run | PUSHED | preview-only decision |
| Goal Runner dry-run report | PUSHED | redacted human-readable summary |
| Human Gate report fixtures | PUSHED | review objects; no approval automation |
| Display / handoff | **NOT IMPLEMENTED** | this design only |
| Human Gate Queue mutation | **HOLD** | no OPEN→APPROVED automation |
| UI connection | **HOLD** | no renderer/preload wiring |
| IPC/preload bridge | **HOLD** | no main↔renderer channel |
| Obsidian actual write | **HOLD** | repo-local Markdown only |
| Discord send | **HOLD** | no notification bridge |
| Runtime start | **HOLD** | no `npm run dev` / Electron start |

---

## 4. Non-Goals

This design phase does **not** authorize:

- actual Human Gate Queue mutation (status changes, APPROVED_ONCE, USED)
- Control Center or iPhone Private Console UI implementation
- IPC or preload exposure of Human Gate payloads
- Obsidian vault write or sync automation
- Discord / external notification send
- runtime start or worker execution
- git push automation
- `productionReady: true` or `execution: enabled`

Human Gate reports are **review objects only**. Human approval remains a separate explicit act (e.g. Push GO, Runtime GO phrases in `HUMAN_GATE_QUEUE.md`).

---

## 5. Candidate Display / Handoff Targets

### A. Repo-local Human Gate Queue Markdown

**Intent:** Append or reference redacted gate entries in repo-local Markdown aligned with `HUMAN_GATE_QUEUE.md` field shapes (`gate_id`, `requested_by_goal`, `risk`, `status`, `evidence_required`).

**Handoff shape:** Serialized `HumanGateReport` → queue row draft (still manual human edit for status changes).

**Risk:** Low if append-only and redacted; medium if mistaken for auto-approval.

### B. Control Center display-only panel

**Intent:** Read-only panel showing gateId, status, summary, requiredHumanGates, reasons (redacted). No approve buttons that mutate queue or trigger effects.

**Handoff shape:** Future read-only view model derived from `HumanGateReport` (not raw contract secrets).

**Risk:** Medium (UI surface); high if approve actions are added without separate GO.

### C. iPhone Private Console display-only panel

**Intent:** Same as B, mobile-oriented layout; display-only until explicit Mobile Console integration GO.

**Handoff shape:** Same redacted view model as B; no device-side execution.

**Risk:** Medium; privacy if reports leave desktop without redaction review.

### D. Obsidian-compatible Markdown export

**Intent:** Export redacted report snapshots into repo-local `docs/shikishima/` or a designated export folder for human reading. **Not** Obsidian vault sync.

**Handoff shape:** Markdown file per report or batch index; `redacted: true` banner required.

**Risk:** Low in-repo; high if confused with Obsidian actual write GO.

### E. IPC/preload bridge for future UI

**Intent:** Define a future read-only channel (e.g. `controlCenter.readonly.getHumanGateReports`) carrying sanitized DTOs only.

**Handoff shape:** IPC contract doc + types; no handler registration in this phase.

**Risk:** High boundary; must stay read-only and never expose `canHumanApprovePush` as true.

### F. External notification targets (e.g. Discord)

**Intent:** Optional future alert: "Human review needed" with gateId + status only—no secrets, no auto-approve links.

**Handoff shape:** Notification template spec; Discord Send GO required before any send.

**Risk:** High (external write); default **HOLD**.

---

## 6. Target Priority Matrix

| Priority | Target | Phase | Runtime | UI | IPC | Queue mutation | External write |
|---|---|---|---|---|---|---|---|
| 1 | A. Repo-local queue Markdown | Next safe implementation | No | No | No | No (draft only) | No |
| 2 | B. Control Center display-only | After A contract | No | Display only | Optional read | No | No |
| 3 | C. iPhone Console display-only | After B contract | No | Display only | Optional read | No | No |
| 4 | E. IPC/preload bridge design | Before any live UI data | No | No | Design + read-only | No | No |
| 5 | B/C actual UI implementation | Separate GO each | No* | Yes (read-only first) | Yes | No | No |
| 6 | D. Obsidian export (repo-local) | After display contract stable | No | No | No | No | No** |
| 7 | F. Discord / notifications | Last | No | No | Maybe | No | Yes (Discord GO) |

\*Runtime observation remains its own Runtime GO.  
\*\*Obsidian **actual** vault write remains HOLD; repo-local Markdown export only.

---

## 7. Required Gates Before Each Target

| Target | Prerequisites (all must be met) | Human GO / gate |
|---|---|---|
| A. Queue Markdown fixture | Human Gate report fixtures PUSHED; design doc accepted | Source-change GO for any generator script; no queue auto-mutation |
| B. Control Center panel | A or equivalent contract; external action guard A5 PUSHED | UI integration GO; display-only sub-scope |
| C. iPhone Console panel | B contract mirrored | Mobile Console display GO |
| D. Obsidian export | Redaction policy signed off | Obsidian Write GO only for actual vault write; repo-local export may use docs-only GO |
| E. IPC/preload bridge | Read-only API contract doc; no secrets on wire | IPC integration GO; preload exposure GO |
| F. Discord / external | E or parallel evidence pipeline | Discord Send GO per message |

**Global rule:** Push GO for commit `acbbe4e` does **not** imply any row above. Each target needs its own explicit GO.

---

## 8. Safety Invariants

These must remain true across all future display/handoff work:

```text
Human Gate reports do not approve execution.
Human Gate reports do not approve push.
Human Gate reports do not approve runtime.
Human Gate reports do not approve external writes.
Human Gate reports are review objects only.
Human approval remains separate.
Actual Human Gate Queue mutation remains HOLD.
UI connection remains HOLD.
IPC/preload connection remains HOLD.
Obsidian actual write remains HOLD.
Discord send remains HOLD.
StackChan connection remains HOLD.
productionReady remains false.
execution remains disabled.
rawValuesReported remains false.
```

Type-level expectations today (`HumanGateReport`):

- `canHumanApprovePush`, `canHumanApproveRuntime`, `canHumanApproveExternalWrite` are always `false`
- `safety.uiConnected` and `safety.ipcConnected` are always `false`
- `redacted` is always `true`

Any future DTO for display must not widen these fields without a Master Spec revision and explicit human GO.

---

## 9. Data Shape Expectations

### Input (already implemented)

`HumanGateReport` fields safe for display planning:

```text
gateId, goalId, taskId, title, status, summary,
requestedAction, canHumanApproveProceed, canHumanApproveCommit,
requiredHumanGates[], reasons[], sourceDecision,
safety{ productionReady, execution, rawValuesReported, runtimeStarted, externalWrite, uiConnected, ipcConnected },
redacted
```

### Forbidden on display wire (even in future IPC)

```text
raw secrets, API keys, .env values, token strings,
full WorkerTaskContract command lists with live paths,
unredacted WSL/Hermes paths, personal information,
production credentials, auto-approve flags for push/runtime/external write
```

### Future display DTO (design-only name)

`HumanGateDisplayEntry` — subset of `HumanGateReport` plus:

```text
displayTargetId: "repo-queue-md" | "control-center" | "iphone-console" | ...
generatedAtIso: string (optional, no runtime required for fixture phase)
ledgerRef: optional commit or goal id string
```

---

## 10. Redaction Policy

1. Only `HumanGateReport` with `redacted: true` may be handed off.
2. `reasons[]` may contain validation messages; must not include secrets or raw env values.
3. Summaries are template-generated; no paste of chat logs or CLI output with secrets.
4. Queue Markdown drafts must include header: `review-only / not an approval`.
5. UI mockups must label: `HOLD — human GO required for effects`.
6. Export filenames should use gateId slug, not user home paths.

---

## 11. STOP Conditions

Stop design → implementation boundary if any of the following appear necessary without a new GO:

- mutating `HUMAN_GATE_QUEUE.md` statuses automatically
- renderer or preload code changes
- `src/main/**` IPC handler registration
- Electron window show / `npm run dev`
- Discord webhook or Obsidian vault write
- changing `HumanGateReport` to allow `canHumanApprovePush: true`
- `productionReady: true` or `execution: enabled`

If unclear, **STOP** and update this doc or `AUTONOMY_GOAL_LEDGER.md` in a docs-only ledger goal.

---

## 12. Recommended Next Goal

### Recommended sequencing

```text
1. Repo-local Human Gate Queue Markdown fixture/design
2. Display-only Control Center target contract
3. Display-only iPhone Console target contract
4. IPC/preload bridge design
5. Actual UI implementation
6. Obsidian actual write
7. External notification targets
```

### First safe implementation goal (pick one)

```text
/goal shikishima.human-gate-queue-display-target-contract
```

Define a pure contract (types + fixtures + tests) for serializing `HumanGateReport` → repo-local queue Markdown **draft** rows. Still no queue mutation, no UI, no IPC.

Alternative name (equivalent scope):

```text
/goal shikishima.human-gate-display-target-contract
```

### Follow-on goals (not approved here)

| Goal | Scope |
|---|---|
| Ledger record for this design | docs-only after local commit |
| Push GO for design commit | separate Human Push GO |
| Control Center read-only panel | UI GO + display contract |
| IPC read-only bridge | IPC integration GO |

---

## References

- `docs/shikishima/AUTONOMY_GOAL_LEDGER.md`
- `docs/shikishima/HUMAN_GATE_QUEUE.md`
- `docs/shikishima/AUTONOMY_RUNNER_PROTOCOL.md`
- `docs/shikishima/WORKER_TASK_CONTRACT_FOUNDATION.md`
- `src/shared/human-gate-report/human-gate-report-types.ts`

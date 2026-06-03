# Human Gate Read-only UI Integration Plan

Date: 2026-05-26
Goal: `shikishima.push-iphone-display-contract-and-ledger-then-plan-readonly-ui`
Mode: docs-only plan; no UI / IPC / runtime approval

---

## 1. Purpose

This document plans how existing Human Gate **display contracts** will later appear in **read-only** Control Center and iPhone Private Console surfaces.

It answers:

```text
How should Human Gate display data move from pure shared contracts
into future read-only Control Center and iPhone UI,
without enabling actions?
```

This plan does **not** authorize React components, IPC handlers, preload bridges, runtime start, or queue mutation.

```text
Obsidian actual write remains HOLD.
These files are repo-local Obsidian-compatible Markdown only.
No external write is approved by this plan.
```

---

## 2. Current Pipeline

Implemented today (pure TypeScript; no UI wiring):

```text
WorkerTaskContract
  → dryRunGoalContract()
  → createGoalRunnerDryRunReport()
  → createHumanGateReportFromDryRunReport()
  → createHumanGateQueueDisplayTargetItem()
  → renderHumanGateQueueDisplayTargetMarkdownPreview()   (string only; no file write)
  → createControlCenterHumanGateDisplayItem()
  → createIphoneHumanGateDisplayItem()
  → (future read-only display — not implemented)
```

Pushed baseline: `origin/main` at `905500f` (iPhone display contract + ledger recorded).

---

## 3. Current Implemented Contracts

| Contract | Module | Status | Role |
|---|---|---|---|
| Queue display target | `human-gate-queue-display-target/` | PUSHED | repo-local queue Markdown handoff shape |
| Control Center display | `control-center-human-gate-display/` | PUSHED | desktop panel view model |
| iPhone display | `iphone-human-gate-display/` | PUSHED | mobile compact view model |

Shared invariants on all display DTOs:

- `displayOnly: true`
- `canApprovePush` / `canApproveRuntime` / `canApproveExternalWrite`: always `false`
- `uiConnected` / `ipcConnected`: always `false` (until explicit future GO changes types)
- `redacted: true`

---

## 4. Non-Goals

This plan does **not** authorize:

- React page or component implementation
- Control Center window wiring to live data
- iPhone Private Console app wiring or same-LAN server on port 3030
- IPC channel registration in `src/main/**`
- preload exposure in `src/renderer/**`
- Approve / Reject / Push buttons that mutate state or trigger effects
- Human Gate Queue status changes in `HUMAN_GATE_QUEUE.md`
- Runtime start (`npm run dev`, Electron)
- Discord, Obsidian vault write, StackChan
- `productionReady: true` or `execution: enabled`

Read-only UI means **render contracts only** — human GO remains a separate explicit act.

---

## 5. Read-only Control Center Display Plan

### Target surface

Future **Human Gate review panel** inside Ichikishima Control Center (read-only App Shell area documented elsewhere).

### Proposed panel sections (display-only)

| Section | Source fields | Notes |
|---|---|---|
| Header | `title`, `primaryStatusLabel` (if mirrored), `status` | No action buttons |
| Summary | `summary` | From `ControlCenterHumanGateDisplayItem` |
| Gates | `requiredHumanGates[]` | List only; no “Approve Push” control |
| Reasons | `reasons[]` | Redacted validation messages only |
| Safety strip | fixed chips: HOLD, no-push, no-runtime | Static labels from plan, not live policy engine |

### Control Center data entry point (future)

```text
ControlCenterHumanGateDisplayItem[]
  → (future) ControlCenterHumanGateDisplayRowProps (pure mapping contract)
  → (future) React presentational components — separate UI GO
```

### Control Center UI connection gate

| Prerequisite | Gate |
|---|---|
| Display row/render contract exists | source-change GO |
| Presentational React components | UI integration GO |
| IPC read channel | IPC integration GO |
| Any approve action | forbidden without matching Human GO phrase |

**Control Center UI connection remains HOLD** until each row in `HUMAN_GATE_DISPLAY_TARGET_DESIGN.md` priority matrix is explicitly approved.

---

## 6. Read-only iPhone Private Console Display Plan

### Target surface

Future **compact Human Gate card** in iPhone Private Console (mobile layout).

### Proposed mobile layout (display-only)

| Block | Source fields |
|---|---|
| Compact header | `compactTitle`, `primaryStatusLabel` |
| Status chip | `status` |
| Safety chips | `safetyChips[]` |
| Sections | `mobileSections[]` (summary / gates / reasons) |
| Footer CTA label | `recommendedHumanActionLabel` (text only; not a button that executes) |

### iPhone data entry point (future)

```text
IphoneHumanGateDisplayItem[]
  → (future) IphoneHumanGateDisplayCardModel (pure mapping contract)
  → (future) mobile UI components — separate UI GO
```

### iPhone-specific HOLD boundaries

```text
networkExposed: false (type invariant today)
no port 3030 server activation
no same-LAN push of approval actions
no background sync to Obsidian vault
```

**iPhone UI connection remains HOLD.**

---

## 7. Data Flow Without IPC (Phase 1 display contract)

Before any IPC exists, UI planning assumes **in-process or test-harness injection only**:

```text
fixtures / unit tests
  → createIphoneHumanGateDisplayItemFromContract()
  → pass DTO to Storybook-like harness (future, optional)
  → no Electron main, no preload, no network
```

For desktop Control Center planning:

```text
fixtures
  → createControlCenterHumanGateDisplayItemFromContract()
  → static props table in docs or test renderer (future)
```

This phase keeps **all display data generation in `src/shared/**`** so renderer never reads raw `WorkerTaskContract` secrets.

---

## 8. Future IPC / Preload Gate

When IPC is eventually designed, the wire contract must be a **strict subset** of display DTOs:

### Allowed on wire (example future shape)

```text
HumanGateDisplaySnapshot {
  items: RedactedHumanGateDisplayEntry[];
  snapshotId: string;
  generatedAtIso: string;
  decision: "HOLD";
  execution: "disabled";
  rawValuesReported: false;
}
```

### Forbidden on wire

```text
secrets, .env, tokens, full command lists with live paths,
canApprovePush: true, effectMayRun: true,
queue mutation commands, auto-approve flags
```

### IPC approval checklist

| Step | Human gate |
|---|---|
| Read-only IPC contract doc | IPC design GO |
| Handler in main (read only) | IPC integration GO |
| preload getter (read only) | preload exposure GO |
| Renderer subscribe | UI integration GO |

**IPC/preload connection remains HOLD.**

---

## 9. UI Action Boundary

Even when read-only UI is implemented, the following UI elements are **forbidden** unless a new Master Spec revision and explicit GO exist:

| UI element | Status |
|---|---|
| “Approve” / “Run” / “Push” button | forbidden |
| Toggle for `productionReady` | forbidden |
| Toggle for `execution` | forbidden |
| Discord send trigger | forbidden |
| Link that opens runtime | forbidden |
| Inline edit of queue status in `HUMAN_GATE_QUEUE.md` | forbidden |

Allowed:

| UI element | Status |
|---|---|
| Read-only text, chips, lists | allowed (display GO) |
| Copy gateId / goalId (redacted ids) | allowed with care |
| Link to repo docs path (no vault write) | allowed |

Human approval remains **out-of-band** (chat GO phrases per `HUMAN_GATE_QUEUE.md`).

---

## 10. Safety Invariants

```text
Read-only UI does not approve execution.
Read-only UI does not approve push.
Read-only UI does not approve runtime.
Read-only UI does not approve external writes.
Read-only UI does not mutate Human Gate Queue.
Control Center UI connection remains HOLD.
iPhone UI connection remains HOLD.
IPC/preload connection remains HOLD.
Runtime remains HOLD.
Same-LAN server activation remains HOLD.
Obsidian actual write remains HOLD.
Discord send remains HOLD.
StackChan connection remains HOLD.
productionReady remains false.
execution remains disabled.
rawValuesReported remains false.
```

Type-level fields must not be widened in display contracts without review:

- `canApprovePush`, `canApproveRuntime`, `canApproveExternalWrite` stay `false`
- `displayOnly` stays `true`
- `redacted` stays `true`

---

## 11. STOP Conditions

Stop planning → implementation if any of the following become necessary without a new GO:

- registering IPC channels or preload APIs
- adding React routes that call main process for Human Gate
- starting Electron or mobile runtime servers
- opening port 3030 or any network listener for Human Gate
- writing to `HUMAN_GATE_QUEUE.md` as automated output
- adding approve buttons wired to git push / runtime / Discord
- changing display types to allow `productionReady: true`

If unclear, **STOP** and update `AUTONOMY_GOAL_LEDGER.md` in a docs-only goal.

---

## 12. Recommended Next Goal

### Compressed next goal

```text
/goal shikishima.push-readonly-ui-plan-and-add-control-center-display-target-render-contract
```

Meaning:

```text
Push this docs-only plan (local commit), then implement a pure render/display target
contract for Control Center (e.g. row props / section model).
Still no React UI wiring.
Still no IPC/preload.
Still no runtime.
```

### Sequencing after render contract

| Order | Goal type |
|---|---|
| 1 | Control Center display render contract (pure TS) |
| 2 | iPhone display render contract (pure TS) |
| 3 | IPC read-only bridge design (docs + types only) |
| 4 | Presentational UI (separate UI GO each surface) |

---

## References

- `docs/shikishima/HUMAN_GATE_DISPLAY_TARGET_DESIGN.md`
- `docs/shikishima/AUTONOMY_GOAL_LEDGER.md`
- `docs/shikishima/HUMAN_GATE_QUEUE.md`
- `src/shared/control-center-human-gate-display/`
- `src/shared/iphone-human-gate-display/`

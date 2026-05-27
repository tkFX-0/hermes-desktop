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
HEAD: (local; Discord send preflight — not pushed)
origin/main: cfe5834
commits_ahead: implementation + ledger (not pushed)
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
Goal Runner Dry-run Report Fixtures: PUSHED
Human Gate Report Fixtures: PUSHED
Human Gate Display Target Design: PUSHED
Human Gate Queue Display Target Contract: PUSHED
Control Center Human Gate Display Contract: PUSHED
iPhone Human Gate Display Contract: PUSHED
Human Gate Read-only UI Integration Plan: PUSHED
Control Center Human Gate Display Render Contract: PUSHED
Discord Human Gate Message Render Contract: PUSHED
Discord Human Gate Digest Render Contract: PUSHED
iPhone Human Gate Display Render Contract: PUSHED
Discord Send Gate Plan: PUSHED
Discord Send Preflight Contract: LOCAL PASS / NOT PUSHED
```

Preferred operator display direction:

```text
Discord is the primary operator viewing surface.
Discord message/digest render contracts are PUSHED.
Preflight accepts DiscordHumanGateMessageDraft as source input.
Preflight creates independent DiscordSendPreflightIntent and DiscordSendPreflightResult types.
READY_CANDIDATE is not send approval.
sendReady remains false.
maySendNow remains false.
Control Center is fallback/debug/read-only local surface.
Ledger remains the source of truth.
Discord send remains HOLD.
Webhook remains HOLD.
Bot runtime remains HOLD.
Token access remains HOLD.
External write remains HOLD.
Human Gate Queue Markdown render follows send preflight push.
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
UI_connection: HOLD
IPC_connection: HOLD
actual_execution_runner: HOLD
actual_human_gate_queue_mutation: HOLD
HUMAN_GATE_QUEUE.md modified as data output: false
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
| Goal Runner Dry-run Report Fixtures | PUSHED | `300dc3b` | `feat: add goal runner dry-run report fixtures`; redacted report helpers |
| Human Gate Report Fixtures | PUSHED | `dd8ea2c` | `feat: add human gate report fixtures`; human-review report helpers |
| Human Gate Display Target Design | PUSHED | `de35026` | `docs: design human gate display targets`; docs-only |
| Human Gate Queue Display Target Contract | PUSHED | `0886936` | `feat: add human gate queue display target contract`; pure contract |
| Control Center Human Gate Display Contract | PUSHED | `929de9f` | `feat: add control center human gate display contract`; display-only pure contract |
| iPhone Human Gate Display Contract | PUSHED | `f4a2bd9` | `feat: add iphone human gate display contract`; mobile display-only pure contract |
| Human Gate Read-only UI Integration Plan | PUSHED | `1f20f0a` | `docs: plan human gate readonly ui integration`; docs-only |
| Control Center Human Gate Display Render Contract | PUSHED | `db47381` | `feat: add control center human gate display render contract`; pure render model |
| Discord Human Gate Message Render Contract | PUSHED | `f697f39` | `feat: add discord human gate message render contract`; draft/preview only |
| Discord Human Gate Digest Render Contract | PUSHED | `b066f73` | `feat: add discord human gate digest render contract`; digest draft/preview only |
| iPhone Human Gate Display Render Contract | PUSHED | `66eead7` | `feat: add iphone human gate display render contract`; mobile render model only |
| Discord Send Gate Plan | PUSHED | `f903776` | `docs: plan discord send gate`; docs-only; send remains HOLD |
| Discord Send Preflight Contract | LOCAL PASS / NOT PUSHED | (local) | `feat: add discord send preflight contract`; Intent/Result separate from draft |

Pushed commit chain (Worker Task Contract → Goal Runner → Human Gate → display contracts):

```text
cbcf2e1 docs: define worker task contract foundation
52e2b6c feat: add worker task contract types
e34444f test: add worker task contract fixture registry
2bcd087 feat: add worker task contract preview
168a6eb feat: add goal runner dry-run
c3dc402 docs: record goal runner dry-run ledger status
300dc3b feat: add goal runner dry-run report fixtures
b0392b8 docs: record goal runner report fixture ledger status
dd8ea2c feat: add human gate report fixtures
acbbe4e docs: record human gate report fixture ledger status
de35026 docs: design human gate display targets
0886936 feat: add human gate queue display target contract
eeef990 docs: record human gate queue display target ledger status
929de9f feat: add control center human gate display contract
ce17852 docs: record control center human gate display contract ledger status
f4a2bd9 feat: add iphone human gate display contract
905500f docs: record iphone human gate display contract ledger status
1f20f0a docs: plan human gate readonly ui integration
```

Current pipeline (fixture-only; no execution):

```text
WorkerTaskContract
  → dryRunGoalContract()
  → createGoalRunnerDryRunReport()
  → createHumanGateReportFromDryRunReport()
  → createHumanGateQueueDisplayTargetItem()
  → renderHumanGateQueueDisplayTargetMarkdownPreview()
  → createControlCenterHumanGateDisplayItem()
  → createControlCenterHumanGateDisplayRenderModel()
  → createDiscordHumanGateMessageDraft()
  → renderDiscordHumanGateMessagePreview()
  → createDiscordHumanGateDigestDraft()
  → renderDiscordHumanGateDigestPreview()
  → createIphoneHumanGateDisplayItem()
  → createIphoneHumanGateDisplayRenderModel()
  → createDiscordSendPreflightIntentFromDraft()
  → evaluateDiscordSendPreflight()
  → renderDiscordSendPreflightPreview()
  → (future read-only UI — not implemented)
```

### Control Center Human Gate Display Render Contract boundary (not React / renderer)

Control Center Human Gate Display Render Contract is pure render contract only.

```text
pure render contract only
not React UI implementation
not renderer wiring
not IPC/preload connection
not runtime
not network exposure
not queue mutation
not approval automation
displayOnly: true
layout: human-gate-review-panel
```

Implementation: `src/shared/control-center-human-gate-display-render/`.
Maps `ControlCenterHumanGateDisplayItem` to read-only Control Center panel render models only.

Local test evidence: vitest 1065 passed / 1 skipped (2026-05-26; pushed with `0d7a5c7`).

### Discord Human Gate Message Render Contract boundary (not send / webhook / bot)

Discord Human Gate Message Render Contract is pure draft/preview only.

```text
pure render contract only
not Discord send
not webhook
not bot runtime
not token read
not external API write
draftOnly: true
sendReady: false
discordSend: false
```

Implementation: `src/shared/discord-human-gate-message-render/`.
Maps `HumanGateQueueDisplayTargetItem` to Discord-ready message drafts and preview strings only.

### Discord Human Gate Digest Render Contract boundary (not send)

Discord Human Gate Digest Render Contract summarizes message drafts into digest previews only.

```text
accepts DiscordHumanGateMessageDraft[] only
no Discord send
no webhook
no bot runtime
no token read
```

Implementation: `src/shared/discord-human-gate-digest-render/`.

### iPhone Human Gate Display Render Contract boundary (not UI / network / IPC)

iPhone Human Gate Display Render Contract is pure mobile render model only.

```text
pure render contract only
not UI implementation
not renderer wiring
not IPC/preload connection
displayOnly: true
mobileReady: true
```

Implementation: `src/shared/iphone-human-gate-display-render/`.

### Discord Send Gate Plan boundary (not send / webhook / bot)

Discord Send Gate Plan is design-only.

```text
docs-only
not Discord send
not webhook implementation
not bot runtime
not token access
not network
one-shot send gate defined for future GO
preflight contract recommended next
```

Implementation doc: `docs/shikishima/DISCORD_SEND_GATE_PLAN.md`.
Aligns with `IPC_EXTERNAL_SURFACE_GUARD_PLAN.md` §7; adds explicit preview and webhook routes.

### Discord Send Preflight Contract boundary (not send / network)

Discord Send Preflight Contract is pure preflight only.

```text
DiscordHumanGateMessageDraft = display material
DiscordSendPreflightIntent = future one-shot send request shape (not approved)
DiscordSendPreflightResult = HOLD / BLOCKED / READY_CANDIDATE (no send)
READY_CANDIDATE != send approval
sendReady: false
maySendNow: false
discordSend: false
networkCall: false
```

Implementation: `src/shared/discord-send-preflight/`.

### iPhone Human Gate Display Contract boundary (not UI / network / IPC)

iPhone Human Gate Display Contract is pure display contract only.

```text
pure display contract only
not UI implementation
not IPC/preload connection
not runtime
not same-LAN server activation
not network exposure
not queue mutation
not approval automation
displayOnly: true
mobileReady: true
uiConnected: false
ipcConnected: false
networkExposed: false
actualQueueMutation: false
```

Implementation: `src/shared/iphone-human-gate-display/`.
Maps `HumanGateQueueDisplayTargetItem` to future iPhone Private Console read-only view models only.

Full test evidence at push: vitest 1052 passed / 1 skipped (2026-05-26 push GO).

### Control Center Human Gate Display Contract boundary (not UI / IPC)

Control Center Human Gate Display Contract is pure display contract only.

```text
pure display contract only
not UI implementation
not IPC/preload connection
not runtime
not queue mutation
not approval automation
displayOnly: true
uiConnected: false
ipcConnected: false
actualQueueMutation: false
```

Implementation: `src/shared/control-center-human-gate-display/`.
Maps `HumanGateQueueDisplayTargetItem` to future Control Center panel view models only.

Full test evidence at push: vitest 1040 passed / 1 skipped (2026-05-26 push GO).

### Human Gate Queue Display Target Contract boundary (not queue mutation)

Human Gate Queue Display Target Contract is pure contract/helper only.

```text
maps HumanGateReport to repo-local queue display target items
does not mutate HUMAN_GATE_QUEUE.md
does not write queue documents
markdown preview returns string only
not an execution runner
not a UI integration
not an IPC route
not a preload exposure
not an actual Human Gate Queue mutation
```

Implementation: `src/shared/human-gate-queue-display-target/`.
Future display target: `docs/shikishima/HUMAN_GATE_QUEUE.md` (read-only reference; no data writes in this layer).

Full test evidence at push: vitest 1028 passed / 1 skipped (2026-05-26 push GO).

### Human Gate Report Fixtures boundary (not UI / IPC / queue mutation)

Human Gate Report Fixtures are fixture/helper only.

```text
fixture/helper only
human-review report object only
not an execution runner
not a UI integration
not an IPC route
not a preload exposure
not a runtime feature
not an external write feature
not an actual Human Gate Queue mutation
not an approval automation feature
```

Implementation: `src/shared/human-gate-report/` builds redacted human-review objects from Goal Runner dry-run reports only.
No UI, IPC, preload, shell, runtime, external write, or Human Gate Queue mutation wiring.

Full test evidence at push: vitest 1010 passed / 1 skipped (2026-05-26 push GO).

### Goal Runner Dry-run Report Fixtures boundary (not UI / IPC / execution)

Goal Runner Dry-run Report Fixtures are dry-run report only.

```text
dry-run report only
redacted report helper only
not an execution runner
not a UI integration
not an IPC route
not a preload exposure
not a runtime feature
not an external write feature
```

Implementation: `src/shared/goal-runner-dry-run/goal-runner-dry-run-report.ts` builds human-readable reports from `dryRunGoalContract()` results only.
No UI, IPC, preload, shell, runtime, or external write wiring.

Full test evidence at push: vitest 992 passed / 1 skipped (2026-05-26 push GO).

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
active_goal: none (Discord send preflight local PASS; push pending)
status: PASS
last_completed_goal: shikishima.push-discord-send-gate-plan-and-add-discord-send-preflight-contract
external_effects: git push only (discord send gate plan docs)
actual_obsidian_write: false
```

---

## 5. Next Goal Queue

| Order | Goal | Status | Dependency | Human Gate Needed |
|---|---|---|---|---|
| 1 | `/goal shikishima.push-discord-send-preflight-and-add-human-gate-queue-markdown-render` | TODO | Discord Send Preflight LOCAL PASS | Push GO + queue markdown render |
| 1b | `/goal shikishima.human-gate-queue-markdown-render-contract` | DEFERRED | bundled in goal 1 | source-change GO |
| 2 | `/goal shikishima.readonly-ui-display-plan` | DONE | pushed as 1f20f0a | — |
| 3 | Goal A6: selected handler integration planning/implementation | HOLD | A5 PUSHED | source-change GO |
| 4 | Goal C: Memory Scope / Persona / Model Trace Foundation | TODO | Master Spec | source-change GO |
| 5 | Goal D: Discord-first Command Intake | HOLD | Guard integration | Discord read/send gate |
| 6 | Goal E: Report Draft / Evidence Pipeline | TODO | Ledger foundation | local write guard |
| 7 | Goal F: One-shot External Operation Gate | HOLD | Guard + evidence pipeline | one-shot GO |
| 8 | Goal G: Runtime Observation Gate | HOLD | Runtime request policy | Runtime GO |
| 9 | Goal H: StackChan Re-entry Gate | HOLD | Guard + device-specific gates | StackChan GO |
| 10 | Goal I: Semi-autonomous Operation Loop | DEFERRED | all prior goals | Continuous Autonomy GO |

Next recommended goal detail:

```text
/goal shikishima.push-discord-send-preflight-and-add-human-gate-queue-markdown-render

Push discord-send-preflight contract + ledger; add Human Gate Queue Markdown render (string only).
```

Remaining explicit HOLD (do not infer approval):

```text
Goal A6 real handler integration: HOLD
actual execution runner: HOLD
runtime start: HOLD
Obsidian actual write: HOLD
Discord send: HOLD
StackChan connection: HOLD
UI connection: HOLD
IPC/preload connection: HOLD
actual Human Gate Queue mutation: HOLD
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
| UI connection | renderer/preload exposure | UI integration GO |
| IPC/preload connection | main/preload bridge | IPC integration GO |
| actual Human Gate Queue mutation | queue write/approval automation | Human Gate Queue mutation GO |
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

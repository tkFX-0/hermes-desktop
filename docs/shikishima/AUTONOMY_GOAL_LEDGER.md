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
HEAD: (local; queue operation mvp rally 2 — not pushed)
origin/main: 5212fcd
commits_ahead: implementation + queue mutation + ledger (not pushed)
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
Discord Send Preflight Contract: PUSHED
Human Gate Queue Markdown Render Contract: PUSHED
Human Gate Queue Mutation Plan: PUSHED
Human Gate Queue Mutation Preflight Contract: PUSHED
Discord Send Readiness Digest Contract: PUSHED
Human Gate Status Snapshot Contract: PUSHED
Discord Operator Brief Contract: PUSHED
Discord Brief Send Preflight Join Contract: PUSHED
Discord Review Packet Contract: PUSHED
Discord Send Execution Plan: PUSHED
Discord Send Execution Preflight Contract: PUSHED
Discord One-Shot Send GO Template: PUSHED
Discord Send Executor Design: PUSHED
Discord Review Packet Assembly Contract: PUSHED
Operator Handoff Session Contract: PUSHED
HumanGateReport to Status Snapshot Adapter: PUSHED
Operator Handoff Assembly Contract: PUSHED
Operator Handoff Fixtures: PUSHED
Operator Handoff Markdown Snapshot: PUSHED
Real Goal-name Operator Handoff Fixtures: PUSHED
Operator Handoff Snapshot Index: PUSHED
Operator Handoff Daily Queue Preview: PUSHED
Operator Handoff Discord Digest: LOCAL PASS
Final Operator Review Bundle: LOCAL PASS
Operator Review MVP Finalize Rally 1: PUSHED
Queue Operation MVP Rally 2: PUSHED
Human Gate Queue Operation Contract: PUSHED
Discord Send Unlock 1 Executor Dry-run Rally 3: PUSHED
Discord Send Executor Dry-run Contract: PUSHED
Discord Send Executor Intent Builders: PUSHED
Discord Send Mock Transport: PUSHED
Discord Send Executor Dry-run Evidence: PUSHED
Discord Send Unlock 2 One-shot Send Rally 4: PUSHED (send PASS_WITH_CAVEAT — credentials HOLD)
Discord One-shot Send Contract: PUSHED
Discord One-shot Send Tool: PUSHED
Discord One-shot Actual Send: HOLD_PENDING_LOCAL_CREDENTIALS
Discord One-shot Send Evidence: PUSHED
External Action Guard Controlled Autonomy Rally 5: PUSHED
External Action Route Registry: PUSHED
External Action Guard Decision Rules: PUSHED
Controlled Autonomy Proposal: PUSHED
External Action Guard Evidence: PUSHED
Runtime Read-only Status Board Rally 6: PUSHED
Runtime Read-only Status Snapshot: PUSHED
Runtime Read-only Markdown Renderer: PUSHED
Runtime Read-only View Model: PUSHED
Runtime Read-only Status Board Evidence: PUSHED
IPC Renderer Read-only Status Board Rally 7: LOCAL PASS / NOT PUSHED
Runtime Status Board IPC Channel: LOCAL PASS
Runtime Status Board Main Provider: LOCAL PASS
Runtime Status Board Preload API: LOCAL PASS
Runtime Status Board Renderer View: LOCAL PASS
IPC Renderer Read-only Status Board Evidence: LOCAL PASS
```

Preferred operator display direction:

```text
Discord is the primary operator viewing surface.
Operator Handoff Assembly provides one-call HumanGateReport → OperatorHandoffSession preview.
Operator Handoff Markdown Snapshot renders assembly into one Discord paste-ready Markdown artifact.
Queue Operation MVP enables controlled repo-local Human Gate Queue append and state update.
Final Operator Review Bundle summarizes Snapshot Index, Daily Queue Preview, and Discord Digest.
Operator Handoff Discord Digest compresses daily queue into Discord-friendly digest.
Operator Handoff Daily Queue Preview summarizes snapshot index into today's judgment-waiting queue.
Operator Handoff Snapshot Index summarizes multiple markdown snapshots for operator review.
Real Goal-name fixtures stabilize production-like handoff output with realistic Shikishima goalName strings.
Operator Handoff Fixtures stabilize PASS, PASS_WITH_CAVEAT, HOLD, and BLOCKED assembly outputs.
Assembly connects HumanGateReport, Snapshot Adapter, DiscordReviewPacketAssembly, and OperatorHandoffSession.
Adapter connects existing HumanGateReport output to HumanGateStatusSnapshot.
Adapter enables HumanGateReport → Snapshot → DiscordReviewPacketAssembly → OperatorHandoffSession practical pipeline.
Operator Handoff Session wraps DiscordReviewPacketAssemblyResult into one human decision session.
READY_FOR_HUMAN_REVIEW is not send approval.
READY_FOR_HUMAN_REVIEW is not next goal approval.
Next goal approval still requires explicit Human GO.
Assembly connects HumanGateStatusSnapshot, DiscordOperatorBrief, DiscordSendPreflightResult, DiscordBriefSendPreflightJoin, and DiscordReviewPacket.
Assembly creates Discord review preview for human operation.
Assembly is review-only / draft-only / display-only.
Assembly does not send Discord.
Assembly does not implement executor.
Discord Send Executor Design is docs-only (safety design paused; executor path HOLD).
Executor design does not implement send.
Future executor implementation requires separate Human GO.
Future actual Discord send requires separate Human GO.
One-Shot Send GO Template is docs-only.
Template does not approve send.
Reading or filling the template alone does not approve send.
Execution Preflight uses DiscordReviewPacket as input.
Execution Preflight creates independent DiscordSendExecutionPreflightIntent and DiscordSendExecutionPreflightResult types.
EXECUTION_READY_CANDIDATE is not send approval.
sendReady remains false.
maySendNow remains false.
Review Packet uses DiscordBriefSendPreflightJoin as input.
Review Packet is the final Discord-facing review bundle before any future send gate.
Discord Send Execution Plan is docs-only.
Actual Discord send remains HOLD.
Review Packet is packet-only / review-only / draft-only.
Review Packet status REVIEW_READY_CANDIDATE is not send approval.
Join combines DiscordOperatorBrief and DiscordSendPreflightResult.
Join status REVIEW_READY_CANDIDATE is not send approval.
Join produces preview only.
Ledger remains source of truth.
Operator Brief is draft-only and preview-only.
Snapshot status REVIEW_READY_CANDIDATE is not send, queue mutation, or runtime approval.
Digest combines DiscordSendPreflightResult and HumanGateQueueMutationPreflightResult.
Digest produces preview only.
Queue Markdown Render Contract is PUSHED.
Queue mutation plan is PUSHED.
Actual HUMAN_GATE_QUEUE.md mutation remains HOLD.
Queue one-shot append remains HOLD.
Queue rewrite / cleanup remains NOT_APPROVED.
Preflight: READY_CANDIDATE is not send approval; sendReady remains false.
Control Center is fallback/debug/read-only local surface.
Ledger remains the source of truth.
Discord send remains HOLD.
Webhook remains HOLD.
Bot runtime remains HOLD.
Token access remains HOLD.
Auto-reply remains NOT_APPROVED.
Continuous mode remains NOT_APPROVED.
Obsidian actual write remains HOLD.
Runtime remains HOLD.
productionReady remains false.
execution remains disabled.
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
| Discord Send Preflight Contract | PUSHED | `4b9bb74` | `feat: add discord send preflight contract`; Intent/Result separate from draft |
| Human Gate Queue Markdown Render Contract | PUSHED | `7474049` | `feat: add human gate queue markdown render contract`; canonical input = display target |
| Human Gate Queue Mutation Plan | PUSHED | `0b46912` | `docs: plan human gate queue mutation gate`; docs-only; append remains HOLD |
| Human Gate Queue Mutation Preflight Contract | PUSHED | `c09b7c1` | `feat: add human gate queue mutation preflight contract`; Intent/Result separate from render |
| Discord Send Readiness Digest Contract | PUSHED | `e684a19` | `feat: add discord send readiness digest contract`; cross-preflight review digest |
| Human Gate Status Snapshot Contract | PUSHED | `dd83b73` | `feat: add human gate status snapshot contract`; one-page operator status |
| Discord Operator Brief Contract | PUSHED | `46ae87f` | `feat: add discord operator brief contract`; short Discord-facing brief |
| Discord Brief Send Preflight Join Contract | PUSHED | `9a828f8` | `feat: add discord brief send preflight join contract`; brief + send preflight review |
| Discord Review Packet Contract | PUSHED | `95cfe3e` | `feat: add discord review packet contract`; final review bundle before send gate |
| Discord Send Execution Plan | PUSHED | `06efb9c` | `docs: plan discord send execution`; docs-only; send remains HOLD |
| Discord Send Execution Preflight Contract | PUSHED | `7cfddf5` | `feat: add discord send execution preflight contract`; execution candidate only |
| Discord One-Shot Send GO Template | PUSHED | `3fc496c` | `docs: add discord one shot send go template`; human GO wording only |
| Discord Send Executor Design | PUSHED | `1eda4c9` | `docs: design discord send executor`; future executor architecture only |
| Discord Review Packet Assembly Contract | PUSHED | `179034b` | `feat: add discord review packet assembly contract`; Goal→Discord review bundle |
| Operator Handoff Session Contract | PUSHED | `5c56352` | `feat: add operator handoff session contract`; human decision session |
| HumanGateReport to Status Snapshot Adapter | PUSHED | `8a08b8c` | `feat: add human gate report status snapshot adapter`; report→snapshot bridge |
| Operator Handoff Assembly Contract | PUSHED | `509712a` | `feat: add operator handoff assembly contract`; one-call report→handoff |
| Operator Handoff Fixtures | PUSHED | `c3e95a9` | `test: add operator handoff fixtures`; PASS/HOLD/BLOCKED stabilization |
| Operator Handoff Markdown Snapshot | PUSHED | `f33c894` | `feat: add operator handoff markdown snapshot`; Discord paste-ready |
| Real Goal-name Operator Handoff Fixtures | PUSHED | `2484223` | `test: add real goal operator handoff fixtures`; production-like goalName |
| Operator Handoff Snapshot Index | PUSHED | `161bfd4` | `feat: add operator handoff snapshot index`; multi-handoff listing |
| Operator Handoff Daily Queue Preview | PUSHED | `14ce978` | `feat: add operator handoff daily queue preview`; today's queue |
| Operator Handoff Discord Digest | LOCAL PASS | (local) | `feat: add operator handoff discord digest`; compact digest |
| Final Operator Review Bundle | LOCAL PASS | (local) | `feat: add final operator review bundle`; final review package |
| Operator Review MVP Finalize Rally 1 | PUSHED | `5212fcd` | Rally 1: digest + final bundle |
| Human Gate Queue Operation Contract | LOCAL PASS | (local) | `feat: add human gate queue operation contract` |
| Queue Operation MVP Rally 2 | PUSHED | `db60a4d` | controlled HUMAN_GATE_QUEUE.md mutation |
| Discord Send Unlock 1 Executor Dry-run Rally 3 | PUSHED | `8ca01e5` | executor dry-run / mock transport only |
| Discord Send Executor Dry-run Contract | PUSHED | `fb648fe` | `feat: add discord send executor dry run` |
| Discord Send Unlock 2 One-shot Send Rally 4 | PUSHED | `7df7f66` | one-shot path; actual send HOLD |
| Discord One-shot Send Contract | PUSHED | `845540b` | `feat: add discord one shot send executor` |
| Discord One-shot Actual Send | HOLD_PENDING_LOCAL_CREDENTIALS | — | path implemented; send not proven |
| External Action Guard Controlled Autonomy Rally 5 | PUSHED | `274183f` | guard + proposal layer |
| Runtime Read-only Status Board Rally 6 | PUSHED | `7600359` | read-only status board contract |
| IPC Renderer Read-only Status Board Rally 7 | LOCAL PASS / NOT PUSHED | (local) | IPC + preload + renderer read-only |
| Runtime Status Board IPC Channel | LOCAL PASS | (local) | getSnapshot only |
| Runtime Status Board Main Provider | LOCAL PASS | (local) | `src/main/runtime-readonly-status-board/` |
| Runtime Status Board Preload API | LOCAL PASS | (local) | `window.shikishimaStatusBoard` |
| Runtime Status Board Renderer View | LOCAL PASS | (local) | `RuntimeStatusBoardPage` |

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
  → createHumanGateQueueMarkdownRenderModel()
  → renderHumanGateQueueMarkdownPreview()
  → createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel()
  → evaluateHumanGateQueueMutationPreflight()
  → renderHumanGateQueueMutationPreflightPreview()
  → createDiscordSendReadinessDigest()
  → renderDiscordSendReadinessDigestPreview()
  → createHumanGateStatusSnapshot()
  → renderHumanGateStatusSnapshotPreview()
  → createDiscordOperatorBrief()
  → renderDiscordOperatorBriefPreview()
  → createDiscordBriefSendPreflightJoin()
  → renderDiscordBriefSendPreflightJoinPreview()
  → createDiscordReviewPacket()
  → renderDiscordReviewPacketPreview()
  → createDiscordSendExecutionPreflightIntent()
  → evaluateDiscordSendExecutionPreflight()
  → renderDiscordSendExecutionPreflightPreview()
  → createDiscordReviewPacketAssembly()
  → createDiscordReviewPacketAssemblyPreview()
  → createHumanGateStatusSnapshotFromHumanGateReport()
  → createDiscordReviewPacketAssembly()
  → createOperatorHandoffSession()
  → renderOperatorHandoffSessionPreview()
  → createOperatorHandoffAssembly()
  → createOperatorHandoffAssemblyPreview()
  → createPassOperatorHandoffAssemblyFixture()
  → createPassWithCaveatOperatorHandoffAssemblyFixture()
  → createHoldOperatorHandoffAssemblyFixture()
  → createBlockedOperatorHandoffAssemblyFixture()
  → createOperatorHandoffMarkdownSnapshot()
  → createOperatorHandoffMarkdownSnapshotMarkdown()
  → createOperatorHandoffMarkdownSnapshotGoalFixture()
  → createOperatorHandoffAssemblyGoalFixture()
  → createHumanGateReportSnapshotAdapterGoalFixture()
  → createDiscordReviewPacketAssemblyGoalFixture()
  → createOperatorHandoffSnapshotIndex()
  → createOperatorHandoffSnapshotIndexMarkdown()
  → createOperatorHandoffDailyQueuePreview()
  → createOperatorHandoffDailyQueuePreviewMarkdown()
  → createOperatorHandoffDiscordDigest()
  → createOperatorHandoffDiscordDigestMarkdown()
  → createFinalOperatorReviewBundle()
  → createFinalOperatorReviewBundleMarkdown()
  → createHumanGateQueueEntryFromFinalReviewBundle()
  → createHumanGateQueueMutationPreflight()
  → applyHumanGateQueueAppendToMarkdown()
  → applyHumanGateQueueStateUpdateToMarkdown()
  → (future Discord Send Executor — NOT IMPLEMENTED; see DISCORD_SEND_EXECUTOR_DESIGN.md)
  → (future one-shot Discord send attempt — HOLD)
  → (future post-send evidence + gate restored HOLD)
  → (future one-shot queue append gate — NOT IMPLEMENTED)
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

### Human Gate Queue Markdown Render Contract boundary (not file write / mutation)

Human Gate Queue Markdown Render Contract is pure preview only.

```text
canonical input: HumanGateQueueDisplayTargetItem
not canonical: DiscordHumanGateDigestDraft
previewOnly: true
fileWriteReady: false
humanGateQueueDocModified: false
actualQueueMutation: false
no fs / no Discord libraries
```

Implementation: `src/shared/human-gate-queue-markdown-render/`.
Legacy helper `renderHumanGateQueueDisplayTargetMarkdownPreview()` remains on display-target module; this contract adds structured render model + queue-document preview.

### Human Gate Queue Mutation Plan boundary (not append / file write)

Human Gate Queue Mutation Plan is design-only.

```text
docs-only
not HUMAN_GATE_QUEUE.md mutation
not append execution
one-shot append gate defined for future GO
queue-mutation-preflight recommended next
```

Implementation doc: `docs/shikishima/HUMAN_GATE_QUEUE_MUTATION_PLAN.md`.

### Human Gate Queue Mutation Preflight Contract boundary (not file write / append)

Human Gate Queue Mutation Preflight Contract is pure preflight only.

```text
canonical input: HumanGateQueueMarkdownRenderModel (from HumanGateQueueDisplayTargetItem)
not canonical: Discord digest
HumanGateQueueMutationPreflightIntent = future append request shape (not approved)
HumanGateQueueMutationPreflightResult = HOLD / BLOCKED / READY_CANDIDATE (no write)
READY_CANDIDATE != mutation approval
fileWriteReady: false
mayMutateNow: false
humanGateQueueDocModified: false
no fs import
```

Implementation: `src/shared/human-gate-queue-mutation-preflight/`.

### Discord Send Readiness Digest Contract boundary (not send / mutation / file write)

Discord Send Readiness Digest Contract is pure review digest only.

```text
combines DiscordSendPreflightResult + HumanGateQueueMutationPreflightResult
REVIEW_READY_CANDIDATE != send approval
REVIEW_READY_CANDIDATE != queue mutation approval
digestOnly: true
no Discord send
no queue mutation
no file write
```

Implementation: `src/shared/discord-send-readiness-digest/`.

### Human Gate Status Snapshot Contract boundary (not UI / send / mutation)

Human Gate Status Snapshot Contract is pure operator status model only.

```text
input: DiscordSendReadinessDigest
sourceOfTruth: ledger
primaryDisplaySurface: discord
fallbackDisplaySurface: control-center
snapshotOnly: true
no Discord send
no queue mutation
no file write
```

Implementation: `src/shared/human-gate-status-snapshot/`.

### Discord Operator Brief Contract boundary (not send / mutation / file write)

Discord Operator Brief Contract is short-form Discord-facing review text only.

```text
input: HumanGateStatusSnapshot
briefOnly: true
draftOnly: true
no Discord send
no queue mutation
maxLines supported (deterministic truncation)
```

Implementation: `src/shared/discord-operator-brief/`.

### Discord Brief Send Preflight Join Contract boundary (not send / webhook / bot)

Discord Brief Send Preflight Join Contract joins operator brief with send preflight only.

```text
joinOnly: true
reviewOnly: true
no Discord send
no webhook
no bot
no token read
```

Implementation: `src/shared/discord-brief-send-preflight-join/`.

### Discord Review Packet Contract boundary (not send / webhook / bot / queue mutation)

Discord Review Packet Contract converts `DiscordBriefSendPreflightJoin` into a final Discord-facing review bundle only.

```text
packetOnly: true
reviewOnly: true
draftOnly: true
input: DiscordBriefSendPreflightJoin
no Discord send
no webhook
no bot
no token read
no network call
no external write
no queue mutation
no HUMAN_GATE_QUEUE.md modification
no file write
REVIEW_READY_CANDIDATE is not send approval
productionReady: false
execution: disabled
```

Implementation: `src/shared/discord-review-packet/`.

### Discord Send Execution Plan boundary (not send / webhook / bot / queue mutation)

Discord Send Execution Plan defines future one-shot send execution gates after `DiscordReviewPacket` only.

```text
docs-only
no Discord send
no webhook
no bot
no token read
no network call
no queue mutation
no HUMAN_GATE_QUEUE.md modification
REVIEW_READY_CANDIDATE is not send approval
productionReady: false
execution: disabled
```

Implementation doc: `docs/shikishima/DISCORD_SEND_EXECUTION_PLAN.md`.

### Discord Send Execution Preflight Contract boundary (not send / webhook / bot)

Discord Send Execution Preflight Contract evaluates execution metadata against `DiscordReviewPacket` only.

```text
preflightOnly: true
intentOnly: true
resultOnly: true
input: DiscordReviewPacket
no Discord send
no webhook
no bot
no token read
no network call
EXECUTION_READY_CANDIDATE is not send approval
sendReady: false
maySendNow: false
productionReady: false
execution: disabled
```

Implementation: `src/shared/discord-send-execution-preflight/`.

### Discord One-Shot Send GO Template boundary (not send / executor)

Discord One-Shot Send GO Template defines human approval wording for one future send only.

```text
docs-only
template does not approve send
filling template alone does not approve send
separate future executor GO required
no Discord send
no webhook
no bot
no token read
no executor implementation
productionReady: false
execution: disabled
```

Implementation doc: `docs/shikishima/DISCORD_ONE_SHOT_SEND_GO_TEMPLATE.md`.

### Discord Send Executor Design boundary (not implementation / send)

Discord Send Executor Design defines future one-shot executor architecture only.

```text
docs-only
executor not implemented
design does not approve send
future executor GO required
future actual send GO required
no network
no token read in shared layer
productionReady: false
execution: disabled
```

Implementation doc: `docs/shikishima/DISCORD_SEND_EXECUTOR_DESIGN.md`.

### Discord Review Packet Assembly Contract boundary (not send / executor)

Discord Review Packet Assembly Contract wires snapshot + send preflight into a final Discord review preview.

```text
assemblyOnly: true
reviewOnly: true
draftOnly: true
input: HumanGateStatusSnapshot + DiscordSendPreflightResult
no Discord send
no executor
no queue mutation
REVIEW_READY_CANDIDATE is not send approval
productionReady: false
execution: disabled
```

Implementation: `src/shared/discord-review-packet-assembly/`.

### Operator Handoff Session Contract boundary (not send / next goal auto-approval)

Operator Handoff Session Contract packages assembly into one operator decision session.

```text
sessionOnly: true
handoffOnly: true
READY_FOR_HUMAN_REVIEW is not send approval
READY_FOR_HUMAN_REVIEW is not next goal approval
APPROVE_NEXT_GOAL requires explicit Human GO
no Discord send
no executor
productionReady: false
execution: disabled
```

Implementation: `src/shared/operator-handoff-session/`.

### HumanGateReport to Status Snapshot Adapter boundary (not send / live preflight)

HumanGateReport to Status Snapshot Adapter bridges HumanGateReport into HumanGateStatusSnapshot.

```text
adapterOnly: true
reviewOnly: true
synthesized preflight rows from report (caveats required)
no Discord send
no queue mutation
REVIEW_READY_CANDIDATE is not send approval
productionReady: false
execution: disabled
```

Implementation: `src/shared/human-gate-report-status-snapshot-adapter/`.

### Operator Handoff Assembly Contract boundary (not send / next goal auto-approval)

Operator Handoff Assembly Contract wires report → snapshot → packet → handoff in one call.

```text
assemblyOnly: true
handoffOnly: true
one-call HumanGateReport → OperatorHandoffSession preview
READY_FOR_HUMAN_REVIEW is not send approval
READY_FOR_HUMAN_REVIEW is not next goal approval
no Discord send
no executor
productionReady: false
execution: disabled
```

Implementation: `src/shared/operator-handoff-assembly/`.

### Operator Handoff Fixtures boundary (not send / not markdown snapshot)

Operator Handoff Fixtures lock deterministic assembly outputs for core states.

```text
PASS | PASS_WITH_CAVEAT | HOLD | BLOCKED
fixture-only | review-only | draft-only
READY_FOR_HUMAN_REVIEW is not send approval
APPROVE_NEXT_GOAL requires explicit Human GO
no Discord send
no executor
productionReady: false
execution: disabled
```

Implementation: `src/shared/operator-handoff-fixtures/`.

### Operator Handoff Markdown Snapshot boundary (not Obsidian write / not file write)

Operator Handoff Markdown Snapshot renders OperatorHandoffAssemblyResult into canonical Markdown.

```text
snapshotOnly | markdownOnly | review-only | draft-only
discordPasteReady | obsidianCompatible (structure only)
obsidianWrite: false | fileWrite: false
READY_FOR_HUMAN_REVIEW is not send approval
no Discord send
no executor
productionReady: false
execution: disabled
```

Implementation: `src/shared/operator-handoff-markdown-snapshot/`.

### Real Goal-name Operator Handoff Fixtures boundary (not send / not snapshot index)

Real Goal-name fixtures use realistic Shikishima goalName strings with assembly + markdown snapshot.

```text
fixture-only | review-only | draft-only
production-like goalName stabilization
no file write | no Obsidian write | no Discord send
READY_FOR_HUMAN_REVIEW is not send approval
productionReady: false
execution: disabled
```

Implementation: `src/shared/operator-handoff-fixtures/operator-handoff-real-goal-fixtures.ts`.

### Operator Handoff Snapshot Index boundary (not file write / not daily queue)

Operator Handoff Snapshot Index lists multiple markdown snapshots with status counts.

```text
indexOnly | markdownOnly | review-only | draft-only
discordPasteReady | obsidianCompatible (structure only)
obsidianWrite: false | fileWrite: false
MIXED when READY + HOLD coexist
BLOCKED if any snapshot is BLOCKED
productionReady: false
execution: disabled
```

Implementation: `src/shared/operator-handoff-snapshot-index/`.

### Operator Handoff Daily Queue Preview boundary (not queue mutation / not Discord digest)

Operator Handoff Daily Queue Preview turns snapshot index into today's operator review queue.

```text
previewOnly | queuePreviewOnly | markdownOnly | review-only
discordPasteReady | obsidianCompatible (structure only)
obsidianWrite: false | fileWrite: false | humanGateQueueMutation: false
does not modify HUMAN_GATE_QUEUE.md
productionReady: false
execution: disabled
```

Implementation: `src/shared/operator-handoff-daily-queue-preview/`.

### Operator Handoff Discord Digest boundary (not Discord send)

Operator Handoff Discord Digest compresses daily queue preview for Discord paste.

```text
digestOnly | markdownOnly | review-only
maxItems / maxLength truncation supported
productionReady: false
execution: disabled
```

Implementation: `src/shared/operator-handoff-discord-digest/`.

### Final Operator Review Bundle boundary (not execution)

Final Operator Review Bundle packages index + daily queue + digest for human review.

```text
bundleOnly | review-only | conservative status
READY_FOR_HUMAN_REVIEW is not send / queue / next goal auto-approval
productionReady: false
execution: disabled
```

Implementation: `src/shared/final-operator-review-bundle/`.

### Operator Review MVP Finalize Rally 1 boundary

Rally 1 finalizes preview-only Operator Review MVP path through final bundle.

```text
Operator Review MVP: preview-only complete (Rally 1 PUSHED)
Discord send: HOLD until Rally 3/4
External execution: HOLD until Rally 5
Runtime: HOLD until Rally 7
```

### Queue Operation MVP Rally 2 boundary (controlled repo-local queue only)

Rally 2 enables controlled mutation of docs/shikishima/HUMAN_GATE_QUEUE.md only.

```text
append + update one queue entry
entryId: queue-operator-review-mvp-finalize-rally-001
no Discord send
no external API write
no Obsidian actual write
productionReady: false
execution: disabled
```

Implementation: `src/shared/human-gate-queue-operation/`.
Evidence: `docs/shikishima/HUMAN_GATE_QUEUE_OPERATION_MVP_EVIDENCE.md`.

### Discord Send Unlock 1 Executor Dry-run boundary (Rally 3 — no actual send)

Rally 3 prepares Discord send execution without sending.

```text
FinalOperatorReviewBundle | OperatorHandoffDiscordDigest
  → DiscordSendExecutorIntent
  → DiscordSendExecutorDryRun
  → executeDiscordSendMockTransport
  → would-send evidence

no Discord send
no webhook, bot, token, or network call
no external API write
no runtime start
no UI/IPC
mock transport simulates send readiness with actualSendCount 0
productionReady: false
execution: disabled
Actual one-shot Discord send remains Rally 4
```

Implementation: `src/shared/discord-send-executor-dry-run/`.
Evidence: `docs/shikishima/DISCORD_SEND_EXECUTOR_DRY_RUN_EVIDENCE.md`.

### Discord Send Unlock 2 One-shot Send boundary (Rally 4)

Rally 4 authorizes exactly one supervised Discord REST send when preflight and local credentials pass.

```text
DiscordSendExecutorDryRunResult
  → DiscordOneShotSendPreflight
  → bot_token_rest POST (one request)
  → redacted after-send evidence
  → gate restored HOLD

no webhook
no bot runtime
no gateway
no auto retry / auto reply
productionReady: false
execution: disabled
```

Implementation: `src/shared/discord-send-one-shot/`, `tools/shikishima-discord-one-shot-send.mjs`.
Evidence: `docs/shikishima/DISCORD_ONE_SHOT_SEND_EVIDENCE.md`.

Current send status: HOLD_PENDING_LOCAL_CREDENTIALS — path implemented; actual send not yet proven.

### External Action Guard Controlled Autonomy boundary (Rally 5)

Rally 5 adds proposal-only guard decisions for controlled external actions.

```text
Autonomy proposal
  → ExternalActionRoute registry
  → evaluateExternalActionGuard
  → ControlledAutonomyProposal
  → Human GO requirement (no execution)

discord_one_shot_send: HOLD_PENDING_LOCAL_CREDENTIALS (implemented, actualExecutionCount 0)
human_gate_queue_repo_local_mutation: EXECUTED_ONCE (Rally 2)
git_push / runtime_start / external_api_write: HOLD_PENDING_HUMAN_GO
obsidian_write: HOLD_PENDING_IMPLEMENTATION

no actual Discord send in this rally
no network call
productionReady: false
execution: disabled
```

Implementation: `src/shared/external-action-controlled-autonomy/`.
Evidence: `docs/shikishima/EXTERNAL_ACTION_GUARD_CONTROLLED_AUTONOMY_EVIDENCE.md`.

### Runtime Read-only Status Board boundary (Rally 6 — no UI / IPC / runtime)

Rally 6 adds a read-only operational status board contract.

```text
FinalOperatorReviewBundle + DailyQueuePreview + ExternalActionRoutes + ControlledAutonomyProposal
  → RuntimeReadonlyStatusBoardSnapshot
  → markdown + view model (display only)

no IPC / preload / renderer / React UI
no runtime start
productionReady: false
execution: disabled
```

Implementation: `src/shared/runtime-readonly-status-board/`.
Evidence: `docs/shikishima/RUNTIME_READONLY_STATUS_BOARD_EVIDENCE.md`.

### IPC Renderer Read-only Status Board boundary (Rally 7)

Rally 7 wires read-only status board display into Electron.

```text
main: registerRuntimeReadonlyStatusBoardIpcHandlers
preload: window.shikishimaStatusBoard.getSnapshot()
renderer: RuntimeStatusBoardPage (display only)

no send / execute / mutate / start APIs
no action buttons except Refresh → getSnapshot
productionReady: false
execution: disabled
```

Implementation: `src/main/runtime-readonly-status-board/`, `src/preload/shikishima-status-board.ts`, `src/renderer/src/screens/RuntimeStatusBoard/`.
Evidence: `docs/shikishima/IPC_RENDERER_READONLY_STATUS_BOARD_EVIDENCE.md`.

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
active_goal: none (ipc renderer readonly status board rally 7 local PASS; push pending)
status: PASS
last_completed_goal: shikishima.ipc-renderer-readonly-status-board
external_effects: git push Rally 6 (7600359); Rally 7 local only; no network send
actual_obsidian_write: false
```

---

## 5. Next Goal Queue

| Order | Goal | Status | Dependency | Human Gate Needed |
|---|---|---|---|---|
| 1 | `/goalmacro shikishima.controlled-runtime-observation` | TODO | Rally 7 IPC/renderer LOCAL PASS | Push Rally 7 + runtime observation GO |
| 1b | `/goalmacro shikishima.discord-one-shot-send-completion` | TODO | env optional | SHIKISHIMA_DISCORD_* + one-shot send |
| 1c | `/goalmacro shikishima.ipc-renderer-readonly-status-board` | DONE | Rally 6 PUSHED | — |
| 1d | `/goalmacro shikishima.runtime-readonly-status-board` | DONE | Rally 5 PUSHED | — |
| 1d | `/goalmacro shikishima.external-action-guard-controlled-autonomy` | DONE | Rally 4 PUSHED | — |
| 1d | `/goalmacro shikishima.discord-send-unlock-2-one-shot-send` | DONE (PASS_WITH_CAVEAT) | Rally 3 PUSHED | — |
| 1e | `/goalmacro shikishima.discord-send-unlock-1-executor-dry-run` | DONE | Rally 2 PUSHED | — |
| 2 | `/goal shikishima.push-discord-send-executor-design-and-add-discord-send-executor-preimplementation-review` | DEFERRED | Executor design PUSHED | Safety design path paused |
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
/goalmacro shikishima.controlled-runtime-observation

Push Rally 7 artifacts; observe runtime read-only with productionReady false and execution disabled.
Alternative if env configured: /goalmacro shikishima.discord-one-shot-send-completion
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

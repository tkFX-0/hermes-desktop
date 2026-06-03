# Shikishima Human Approval Queue Design

## Document Status

```text
roadmapVersion: v3.38.0
date: 2026-05-16
status: design_only — not implementation approval / not execution approval
```

---

## 1. Purpose

The approval queue is the core mechanism that converts proactive assistance into safe, controlled action.

```text
Shikishima proposes.
The queue holds.
The user decides GO / HOLD / REJECT.
Nothing executes without a user decision.
```

---

## 2. Approval Item Fields

Each proposed action must include:

| Field | Description |
|---|---|
| approval_id | unique identifier |
| created_at | ISO timestamp |
| proposed_by | agent ID (e.g. hermes_worker) |
| action_type | category (see Section 3) |
| risk_level | L0 / L1 / L2 / L3 / HIGH / HOLD |
| summary | one-line human-readable description |
| exact_action | full action specification (no vague descriptions) |
| affected_service | X / calendar / reservation / local_file / etc. |
| affected_files | list of files if applicable |
| external_side_effects | describe any external state change |
| cost_or_payment_risk | none / low / medium / high |
| personal_data_risk | none / low / medium / high |
| token_secret_risk | none / present (describe) |
| required_user_action | describe what human must do |
| GO_phrase | exact phrase human must send |
| HOLD_reason | why it remains blocked |
| REJECT_reason | filled if rejected |
| expiration | when this proposal expires |
| evidence_path | path for post-execution evidence |
| rollback_plan | how to undo if needed |

---

## 3. Action Types

| action_type | Description |
|---|---|
| X_post_draft | drafted X post awaiting human review and manual send |
| X_reply_draft | drafted reply awaiting human review |
| calendar_entry_draft | drafted calendar event for human to create |
| reservation_candidate | research result for human to decide |
| purchase_candidate | product candidate for human to decide |
| development_task | code task awaiting human GO |
| file_change_task | file modification awaiting GO |
| runtime_observation_task | Level 3 runtime run awaiting GO |
| StackChan_speech_task | speech content awaiting human confirmation |
| sensor_reaction_task | sensor-triggered behavior awaiting GO |

---

## 4. Decision Flow

```text
1. Shikishima detects a possible action (observation / request / trigger)
2. Shikishima creates a proposal with all required fields
3. Proposal enters the queue with status: pending
4. Risk is classified (L0/L1/L2/L3/HIGH/HOLD)
5. Human reviews the approval item
6. Human chooses:
   GO  → action proceeds with exact_action, evidence recorded
   HOLD → action remains blocked, HOLD_reason updated
   REJECT → action discarded, REJECT_reason recorded
7. Result recorded in evidence_path
8. Queue item closed
```

---

## 5. Non-Negotiable Rules

The following may never be executed without an explicit GO:

```text
- posting to X or external platforms
- sending messages of any kind
- purchasing
- payment
- reservation
- external API write
- file modification outside approved scope
- runtime start
- robot / StackChan physical motion
- voice / camera / mic activation
- secret / token handling
- productionReady true
- execution enabled
```

Any item with HIGH or HOLD risk requires explicit named GO phrase.

---

## 6. Future Implementation Candidates

```text
- approval_queue_store.ts: in-memory queue implementation
- approval-queue UI: Electron Control Center panel
- approval-report.ts: redacted report generator
- StackChan speech queue integration
```

All marked as future candidates. None approved for implementation today.

---

## Safety Boundary

```text
decision          : HOLD
execution         : disabled
productionReady   : false
rawValuesReported : false
approval_queue    : design only, not implemented
```

---

この範囲では問題を検出していません。

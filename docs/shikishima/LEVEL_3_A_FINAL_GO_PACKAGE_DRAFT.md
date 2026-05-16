# Level 3-A Final GO Package Draft

## Document Status

```text
roadmapVersion: v3.34.0
date: 2026-05-16
status: draft_template_only — human must fill ALL placeholders before use
```

---

## IMPORTANT

**This draft does not approve execution.**  
**Sending this draft without filled placeholders is invalid.**

A human must:
1. read and review all referenced design docs
2. fill every placeholder marked `[...]`
3. send the completed GO as a separate message

---

## Design Package Reference

Before sending GO, human should have read:

```text
[ ] LEVEL_3_PLANNING_GATE_DEFINITION.md
[ ] LEVEL_3_PRECONDITIONS_AUDIT.md
[ ] LEVEL_3_SCOPE_PROPOSAL.md
[ ] LEVEL_3_A_GO_WORDING_DRAFT.md
[ ] LEVEL_3_A_CONTROLLED_OBSERVATION_RUNBOOK.md
[ ] LEVEL_3_A_STOP_ROLLBACK_CHECKLIST.md
[ ] LEVEL_3_A_IPHONE_SAME_LAN_PROTOCOL.md
[ ] LEVEL_3_A_OBSERVATION_EVIDENCE_TEMPLATE.md
[ ] LEVEL_3_A_HUMAN_ACCEPTANCE_REVIEW_TEMPLATE.md
```

---

## GO Template (copy and fill before sending)

```text
I approve Level 3-A controlled observation only for the approved
time window and exact command below.

approved_time_window:
  date:             [YYYY-MM-DD]
  start:            [HH:MM JST]
  end:              [HH:MM JST]

exact_command:      [exact command string — no placeholder]

expected_port_behavior:
  during_runtime:   [listening on port 3030 / not used]
  after_shutdown:   closed

iPhone_confirmation_required: [yes / no]

evidence_file:      [docs/shikishima/LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-0NN.md]

STOP_conditions_confirmed: yes
rollback_plan_confirmed:   yes

human_GO_phrase:
  I approve Level 3-A controlled observation only for the
  approved time window and exact command above.

This GO does NOT approve:
  - productionReady true
  - execution enabled globally
  - autonomous operation
  - Level 3-B / 3-C / 3-D / 3-E
  - runtime branch push
  - activation commit 35f02c5 to main
  - robot / StackChan motion
  - voice / camera / mic
  - external deployment / Cloudflare
  - dependency installation
  - any action outside the approved scope above
```

---

## Pre-Send Checklist

Human must confirm all before sending:

```text
[ ] All 9 design docs reviewed (list above)
[ ] date is filled with exact YYYY-MM-DD
[ ] start time is filled with exact HH:MM JST
[ ] end time is filled with exact HH:MM JST
[ ] exact_command is filled (not a placeholder)
[ ] expected_port_behavior is filled
[ ] iPhone_confirmation_required is filled
[ ] evidence_file path is filled
[ ] STOP_conditions_confirmed: yes
[ ] rollback_plan_confirmed: yes
[ ] human_GO_phrase is present
[ ] repo is confirmed clean (staged=0, dirty=0)
[ ] port 3030 confirmed not listening before start
[ ] Level 3 not currently approved
[ ] productionReady: false
[ ] execution: disabled
```

---

## Safety Boundary at Draft

```text
decision          : HOLD
execution         : disabled
productionReady   : false
rawValuesReported : false
Level 3           : not approved (this draft is template only)
port 3030         : closed
runtime branch    : local only, not pushed
activation commit : 35f02c5 local only, not in main
```

---

この範囲では問題を検出していません。

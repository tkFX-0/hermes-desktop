# Level 3-A Session 002 GO Package Draft

## Document Status

```text
roadmapVersion: v3.44.0
date: 2026-05-17
status: draft_template — human must fill time_window and send separate final GO
```

---

## CRITICAL NOTICE

**This draft does not execute Level 3-A by itself.**  
**Execution requires a separate final human GO message after review.**

---

## Changes from Session 001

```text
Session 001 (2026-05-17-001):
  result: HOLD
  stop_trigger: unexpected_external_operation_appeared
  cause: NousResearch Hermes Installer dialog appeared before iPhone check

Session 002 changes:
  - Option B caveat policy is now formally documented
  - Installer dialog may be dismissed if no install/elevation/download occurs
  - Result classification: PASS_WITH_CAVEAT if observation succeeds after dismissal
  - New time_window required (fill below)
  - New evidence file path required (fill below)
  - known_caveat_acknowledged: true
```

---

## Result Classification Policy (updated for Session 002)

```text
Installer dialog does NOT appear → CLEAN_PASS candidate
Installer dialog appears → dismissed → observation succeeds → PASS_WITH_CAVEAT candidate
Installer dialog requires install/elevation/download → STOP as HOLD
```

---

## Design Package Reference

Human should confirm all are read before issuing final GO:

```text
[x] LEVEL_3_A_INSTALLER_DIALOG_CAVEAT_POLICY.md  ← NEW for Session 002
[x] LEVEL_3_PLANNING_GATE_DEFINITION.md
[x] LEVEL_3_A_CONTROLLED_OBSERVATION_RUNBOOK.md
[x] LEVEL_3_A_STOP_ROLLBACK_CHECKLIST.md
[x] LEVEL_3_A_IPHONE_SAME_LAN_PROTOCOL.md
[x] LEVEL_3_A_OBSERVATION_EVIDENCE_TEMPLATE.md
[x] LEVEL_3_A_HUMAN_ACCEPTANCE_REVIEW_TEMPLATE.md
[x] LEVEL_3_A_FINAL_GO_PACKAGE_DRAFT.md (Session 001 filled version)
```

---

## GO Template (copy and fill before sending)

```text
I approve Level 3-A Scope B Session 002 controlled observation only for:

approved_time_window:
  date:             [YYYY-MM-DD]
  start:            [HH:MM JST]
  end:              [HH:MM JST]

procedure: full 4-step Scope B procedure as documented
  Step 1: ENABLED=true edit (local only, NOT pushed to main)
  Step 2: typecheck:node=0 / typecheck:web=0
  Step 3: local commit (NOT pushed to main)
  Step 4: npm run dev

known_caveat_acknowledged: true
  If NousResearch Hermes Installer dialog appears:
    - dismiss without installing
    - confirm no install / no elevation / no download occurred
    - continue if MobileConsole observation is accessible
    - result will be PASS_WITH_CAVEAT (not CLEAN_PASS)
    - STOP as HOLD if dialog requires install/elevation/download

expected_port_behavior:
  during_runtime:   listening on LAN IP port 3030
  after_shutdown:   closed

iPhone_confirmation_required: yes

evidence_file:      [docs/shikishima/LEVEL_3_A_OBSERVATION_EVIDENCE_YYYY-MM-DD-002.md]

STOP_conditions_confirmed: yes
rollback_plan_confirmed:   yes

human_GO_phrase:
  I approve Level 3-A Scope B Session 002 controlled observation only for
  the approved time window above, with Option B caveat acknowledged.

This GO does NOT approve:
  - productionReady true
  - execution enabled globally
  - autonomous operation
  - Level 3-B/C/D/E
  - runtime branch push
  - activation commit 35f02c5 to main
  - robot / StackChan motion
  - voice / camera / mic
  - external deployment / Cloudflare
  - Hermes CLI installation
  - dependency installation
  - any action outside the approved scope above
```

---

## Pre-GO Checklist for Session 002

```text
[ ] LEVEL_3_A_INSTALLER_DIALOG_CAVEAT_POLICY.md read
[ ] All 8 design docs reviewed (list above)
[ ] date filled with exact YYYY-MM-DD
[ ] start time filled with exact HH:MM JST
[ ] end time filled with exact HH:MM JST
[ ] known_caveat_acknowledged: true confirmed
[ ] evidence_file path filled
[ ] STOP_conditions reviewed
[ ] rollback plan reviewed
[ ] human_GO_phrase present
[ ] repo clean (staged=0, dirty=0)
[ ] port 3030 not currently listening
[ ] ENABLED: false before starting
[ ] Level 3 not currently approved
[ ] productionReady: false
[ ] execution: disabled
```

---

## Session 002 Evidence File Path Convention

```text
docs/shikishima/LEVEL_3_A_OBSERVATION_EVIDENCE_YYYY-MM-DD-002.md
```

e.g. for 2026-05-17:

```text
docs/shikishima/LEVEL_3_A_OBSERVATION_EVIDENCE_2026-05-17-002.md
```

---

## Safety Boundary

```text
decision          : HOLD
execution         : disabled (enabled only within approved window if GO is issued)
productionReady   : false
rawValuesReported : false
Level 3           : not approved (this draft requires separate final GO)
ENABLED           : false as const (until 4-step procedure is started)
port 3030         : closed
```

---

この範囲では問題を検出していません。

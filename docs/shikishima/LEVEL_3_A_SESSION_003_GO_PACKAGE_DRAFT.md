# Level 3-A Session 003 GO Package Draft

## Document Status

```text
roadmapVersion: v3.46.0
date: 2026-05-17
status: draft_template — human must fill time_window and send separate final GO
```

---

## CRITICAL NOTICE

**This draft does not execute Level 3-A by itself.**
**Execution requires a separate final human GO message after review.**

---

## Changes from Session 002

```text
Session 002 (2026-05-17-002):
  result: HOLD
  stop_trigger: app_closed_before_observation_reported
  cause: npm run dev ran, port 3030 opened, but app closed (exit code 0)
         before user confirmed iPhone observation results
  ENABLED reverted: true → false as const (commit 1bd1b69)
  backup_branch: session-002-runtime-local-backup (bae8db4)

Session 003 changes:
  - All same assumptions from Session 002 apply
  - Option B caveat policy still applies (installer dialog)
  - New time_window required (fill below)
  - New evidence file path required (fill below)
  - App may close after dev server starts — user must confirm iPhone BEFORE closing
  - Observation timeout: if app closes before observation, result = HOLD
```

---

## Result Classification Policy (carried over from Session 002)

```text
Installer dialog does NOT appear → CLEAN_PASS candidate
Installer dialog appears → dismissed → observation succeeds → PASS_WITH_CAVEAT candidate
Installer dialog requires install/elevation/download → STOP as HOLD
App closes before iPhone observation confirmed → HOLD (not retry-eligible without new GO)
```

---

## Session 002 Lesson Incorporated

The app exited with code 0 before the user had time to check the iPhone.
For Session 003, the user should:

1. Note that `npm run dev` starts the Electron app in a window
2. Keep the Electron window open while checking iPhone
3. Report iPhone result BEFORE closing the app or this session

---

## Design Package Reference

Human should confirm all are read before issuing final GO:

```text
[x] LEVEL_3_A_INSTALLER_DIALOG_CAVEAT_POLICY.md
[x] LEVEL_3_PLANNING_GATE_DEFINITION.md
[x] LEVEL_3_A_CONTROLLED_OBSERVATION_RUNBOOK.md
[x] LEVEL_3_A_STOP_ROLLBACK_CHECKLIST.md
[x] LEVEL_3_A_IPHONE_SAME_LAN_PROTOCOL.md
[x] LEVEL_3_A_OBSERVATION_EVIDENCE_TEMPLATE.md
[x] LEVEL_3_A_HUMAN_ACCEPTANCE_REVIEW_TEMPLATE.md
[x] LEVEL_3_A_SESSION_002_GO_PACKAGE_DRAFT.md (Session 002 filled version)
[x] LEVEL_3_A_SESSION_003_GO_PACKAGE_DRAFT.md (this doc)
```

---

## GO Template (copy and fill before sending)

```text
I approve Level 3-A Scope B Session 003 controlled observation only for:

approved_time_window:
  date:             [YYYY-MM-DD]
  start:            [HH:MM JST]
  end:              [HH:MM JST]

procedure: full 4-step Scope B procedure as documented
  Step 1: ENABLED=true edit (local only, NOT pushed to main)
  Step 2: typecheck:node=0 / typecheck:web=0
  Step 3: local commit (NOT pushed to main)
  Step 4: npm run dev

session_003_observation_note_acknowledged: true
  Keep Electron window open while checking iPhone.
  Report iPhone result BEFORE closing the app.
  If app closes before observation: result = HOLD (not PASS)

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

evidence_file:      [docs/shikishima/LEVEL_3_A_OBSERVATION_EVIDENCE_YYYY-MM-DD-003.md]

STOP_conditions_confirmed: yes
rollback_plan_confirmed:   yes

human_GO_phrase:
  I approve Level 3-A Scope B Session 003 controlled observation only for
  the approved time window above, with Option B caveat acknowledged,
  and session 003 observation note acknowledged.

This GO does NOT approve:
  - productionReady true
  - execution enabled globally
  - autonomous operation
  - Level 3-B/C/D/E
  - runtime branch push
  - robot / StackChan motion
  - voice / camera / mic
  - external deployment / Cloudflare
  - Hermes CLI installation
  - dependency installation
  - any action outside the approved scope above
```

---

## Pre-GO Checklist for Session 003

```text
[ ] Session 002 evidence reviewed (HOLD — app closed before observation)
[ ] LEVEL_3_A_INSTALLER_DIALOG_CAVEAT_POLICY.md read
[ ] All 9 design docs reviewed (list above)
[ ] date filled with exact YYYY-MM-DD
[ ] start time filled with exact HH:MM JST
[ ] end time filled with exact HH:MM JST
[ ] known_caveat_acknowledged: true confirmed
[ ] session_003_observation_note_acknowledged: true confirmed
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

## Session 003 Evidence File Path Convention

```text
docs/shikishima/LEVEL_3_A_OBSERVATION_EVIDENCE_YYYY-MM-DD-003.md
```

e.g. for 2026-05-17:

```text
docs/shikishima/LEVEL_3_A_OBSERVATION_EVIDENCE_2026-05-17-003.md
```

---

## Safety Boundary

```text
decision          : HOLD
execution         : disabled (enabled only within approved window if GO is issued)
productionReady   : false
rawValuesReported : false
Level 3           : not approved (this draft requires separate final GO)
ENABLED           : false as const (current state)
port 3030         : closed
bae8db4           : local backup only, not pushed
```

---

この範囲では問題を検出していません。

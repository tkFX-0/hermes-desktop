# Level 3-A Session 004 GO Package Draft

## Document Status

```text
roadmapVersion: v3.47.0
date: 2026-05-17
status: draft_template — human must fill time_window and send separate final GO
```

---

## CRITICAL NOTICE

**This draft does not execute Level 3-A by itself.**
**Execution requires a separate final human GO message after review.**

---

## Changes from Session 003

```text
Session 003 (2026-05-17-003):
  result: HOLD
  stop_trigger: windows_manual_installer_required_blocked_observation
  cause: app stuck on Welcome/Install screen before iPhone could be checked;
         Hermes CLI not installed on Windows caused app to not reach main screen

Session 004 changes:
  - App now proceeds to main screen when windowsManualInstallRequired == true
  - windows_manual_installer_required is treated as non-blocking caveat
  - iPhone Private Console is reachable even without Hermes CLI installed
  - getInstallerObservationPolicy: blocking == false for windows case
  - No automatic install retry on Windows
  - New GO field: windows_manual_installer_required_non_blocking: true
```

---

## Result Classification Policy (updated for Session 004)

```text
No installer dialog, iPhone observation succeeded:
  → CLEAN_PASS candidate

windows_manual_installer_required shown as caveat, app reaches main screen,
iPhone observation succeeded:
  → PASS_WITH_CAVEAT (windows_installer)

NousResearch Hermes Installer dialog appeared, dismissed, iPhone observation succeeded:
  → PASS_WITH_CAVEAT (hermes_installer)

App does not reach main screen:
  → HOLD

iPhone observation not completed before Electron closed:
  → HOLD

Runtime/shutdown/port/rollback failed:
  → HOLD or NG
```

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
[x] LEVEL_3_A_SESSION_003_GO_PACKAGE_DRAFT.md
[x] LEVEL_3_A_SESSION_004_GO_PACKAGE_DRAFT.md (this doc)
```

---

## GO Template (copy and fill before sending)

```text
I approve Level 3-A Scope B Session 004 controlled observation only for:

approved_time_window:
  date:             [YYYY-MM-DD]
  start:            [HH:MM JST]
  end:              [HH:MM JST]

procedure: full 4-step Scope B procedure as documented
  Step 1: ENABLED=true edit (local only, NOT pushed to main)
  Step 2: typecheck:node=0 / typecheck:web=0
  Step 3: local commit (NOT pushed to main)
  Step 4: npm run dev

windows_manual_installer_required_non_blocking: true
  App will now proceed to main screen even if Hermes CLI is not installed.
  This is a known non-blocking caveat.
  Do NOT install Hermes CLI.
  Do NOT run PowerShell irm/iex installer.

known_caveat_acknowledged: true
  If NousResearch Hermes Installer dialog appears (separate from Windows caveat):
    - dismiss without installing
    - confirm no install / no elevation / no download occurred
    - continue if MobileConsole observation is accessible
    - result will be PASS_WITH_CAVEAT (not CLEAN_PASS)

session_004_observation_note_acknowledged: true
  Keep Electron window open while confirming iPhone.
  Report iPhone result BEFORE closing the app.
  If app closes before observation: result = HOLD

expected_port_behavior:
  during_runtime:   listening on LAN IP port 3030
  after_shutdown:   closed

iPhone_confirmation_required: yes

evidence_file:      [docs/shikishima/LEVEL_3_A_OBSERVATION_EVIDENCE_YYYY-MM-DD-004.md]

STOP_conditions_confirmed: yes
rollback_plan_confirmed:   yes

human_GO_phrase:
  I approve Level 3-A Scope B Session 004 controlled observation only for
  the approved time window above, with all caveats acknowledged.

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
  - PowerShell irm/iex installer
  - dependency installation
  - any action outside the approved scope above
```

---

## Pre-GO Checklist for Session 004

```text
[ ] Session 003 evidence reviewed (HOLD — windows installer blocked)
[ ] Source fix reviewed: windowsManualInstallRequired non-blocking
[ ] LEVEL_3_A_INSTALLER_DIALOG_CAVEAT_POLICY.md read
[ ] All 9 design docs reviewed (list above)
[ ] date filled with exact YYYY-MM-DD
[ ] start time filled with exact HH:MM JST
[ ] end time filled with exact HH:MM JST
[ ] windows_manual_installer_required_non_blocking: true confirmed
[ ] known_caveat_acknowledged: true confirmed
[ ] session_004_observation_note_acknowledged: true confirmed
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

## Safety Boundary

```text
decision          : HOLD
execution         : disabled (enabled only within approved window if GO is issued)
productionReady   : false
rawValuesReported : false
Level 3           : not approved (this draft requires separate final GO)
ENABLED           : false as const (current state)
port 3030         : closed
Hermes CLI        : not installed, non-blocking caveat only
```

---

この範囲では問題を検出していません。

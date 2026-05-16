# Level 3-A GO Wording Draft

## Document Status

```text
roadmapVersion: v3.28.0
date: 2026-05-16
status: draft_template_only — not GO, not execution approval
```

---

## IMPORTANT

**This GO draft does not approve execution by itself.**

A separate human GO with all placeholders filled is required.
Until the human sends a complete GO message with concrete values,
no runtime, no port, no Electron launch may occur.

---

## GO Template

Copy this block and fill ALL placeholders before sending.
Sending with any placeholder unfilled is invalid.

```text
I explicitly approve Level 3-A controlled observation run.

time_window:
  date:        [YYYY-MM-DD]
  start:       [HH:MM JST]
  end:         [HH:MM JST]
  timezone:    JST

approved_command:
  [exact command — e.g. npm run dev  or  ./node_modules/.bin/electron.cmd .]

approved_scope:
  - start Electron app within time_window only
  - observe redacted status in Control Center
  - observe iPhone Private Console if required
  - confirm port 3030 behavior per expectations below

port_expectation:
  during_runtime: [listening / not_used]
  after_shutdown: closed

shutdown_procedure:
  [describe: e.g. close Electron window, or Ctrl+C, etc.]

evidence_file:
  [docs/shikishima/LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-0NN.md]

STOP_conditions:
  - runtime starts outside time_window
  - port differs from expectation
  - raw token appears in any output
  - raw LAN IP appears in chat/docs/commit
  - productionReady becomes true
  - execution becomes enabled
  - src/tests/package changes occur
  - shutdown fails
  - port remains open after shutdown
  - any unexpected output

rollback_instructions:
  [describe: e.g. close app, verify port closed, run git status]

NOT_approved_by_this_GO:
  - Level 3 approval scope beyond this run
  - productionReady true
  - execution enabled globally
  - runtime branch push
  - activation commit 35f02c5 in main
  - robot / voice / camera / mic
  - external deployment
  - dependency installation
  - autonomous operation
```

---

## Checklist Before Sending GO

Human must confirm all before sending:

```text
[ ] time_window is filled with exact date and times
[ ] approved_command is the exact command, not a placeholder
[ ] port_expectation is filled
[ ] shutdown_procedure is filled
[ ] evidence_file path is filled
[ ] STOP conditions reviewed
[ ] rollback_instructions filled
[ ] repo is clean (staged=0, dirty=0)
[ ] port 3030 not currently listening
[ ] Level 3 not yet approved
[ ] productionReady: false
[ ] execution: disabled
```

---

## What Counts as a Level 3-A PASS

After the run, all of the following must be true:

```text
1. runtime started only within the approved time window
2. port 3030 opened only during runtime (if applicable)
3. decision = HOLD visible
4. execution = disabled visible
5. productionReady = false visible
6. rawValuesReported = false visible
7. no raw values visible in any UI
8. no secret / token / raw LAN IP in output or docs
9. runtime shutdown completed
10. port 3030 closed after shutdown
11. evidence doc created with all checks recorded
```

---

## What Does NOT Change After a Level 3-A Run

```text
- Level 3 remains controlled (not permanently approved)
- productionReady remains false
- execution remains disabled
- runtime branch remains local only
- activation commit 35f02c5 remains not in main
- robot / voice / camera / mic remain HOLD
- autonomous operation remains forbidden
- external deployment remains HOLD
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

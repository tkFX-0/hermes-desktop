# Level 3-A STOP and Rollback Checklist

## Document Status

```text
roadmapVersion: v3.31.0
date: 2026-05-16
status: design_only — apply during a future Level 3-A run
```

---

## STOP Conditions

STOP immediately and return to HOLD if ANY of the following occurs:

### Runtime Boundary

```text
[ ] runtime starts OUTSIDE the approved time_window
[ ] wrong command is used (differs from approved command)
[ ] runtime starts without a valid GO having been issued
```

### Port / Network

```text
[ ] port 3030 opens at an unexpected time
[ ] port 3030 remains open after shutdown
[ ] 0.0.0.0 binding detected (unless separately approved)
[ ] wildcard CORS header appears
[ ] external network connection is opened unexpectedly
```

### Token / Secret Exposure

```text
[ ] raw pairing token appears in chat, logs, or commit message
[ ] raw LAN IP appears in chat or is copy-pasted into transcript
[ ] any secret or local-only value appears in any output
```

### Safety Invariant Violation

```text
[ ] productionReady becomes true
[ ] execution becomes enabled
[ ] Level 3 scope expands beyond what the GO specified
[ ] src / tests / package files are modified unexpectedly
[ ] dependency installation is attempted
[ ] npx is invoked outside an approved context
```

### External / Device Boundary

```text
[ ] Cloudflare or external deployment path is opened
[ ] robot / StackChan physical motion is triggered
[ ] voice output is produced
[ ] camera or mic path is activated
```

### Git Boundary

```text
[ ] runtime branch is pushed to remote without explicit GO
[ ] activation commit 35f02c5 enters main without explicit review
[ ] any new commit is created with raw values
```

### Shutdown Failure

```text
[ ] runtime shutdown fails or hangs
[ ] evidence doc is not created after the run
```

---

## Rollback Actions

When a STOP condition triggers, execute in order:

```text
1. Stop the runtime process immediately
   - close Electron window, or Ctrl+C in terminal, or kill process
   - do not save state if possible

2. Confirm port 3030 is closed
   - run: netstat check or equivalent
   - if still open: force-kill the process holding the port

3. Do not delete files unless explicitly approved
   - preserve logs in redacted form only
   - do not wipe evidence

4. Do not reset git unless explicitly approved
   - git status only — read-only check
   - if unexpected staged/dirty files appear: report but do not reset

5. Record HOLD evidence
   - fill the evidence template as: result = NG or HOLD
   - record which STOP condition triggered
   - record exact time of STOP

6. Report to human
   - state which STOP condition fired
   - state current port/runtime/staged/dirty state
   - provide next_required_human_decision
   - do not attempt auto-remediation
```

---

## Post-STOP Verification

After rollback, confirm all of the following:

```text
[ ] runtime stopped
[ ] port 3030 closed
[ ] staged = 0
[ ] tracked_dirty = 0
[ ] no raw values in any recent output
[ ] runtime branch not pushed
[ ] activation commit 35f02c5 not in main
[ ] productionReady: false
[ ] execution: disabled
[ ] rawValuesReported: false
```

---

## Non-STOP Events (handle without STOP)

The following do not require a full STOP but must be noted:

```text
- minor timing offset within window (note as PASS_WITH_CAVEAT)
- UI rendering delay (note, do not stop)
- non-sensitive warning in logs (note, do not stop)
```

---

## Safety Boundary

```text
decision          : HOLD
execution         : disabled
productionReady   : false
rawValuesReported : false
Level 3           : not approved (this checklist is design only)
```

---

この範囲では問題を検出していません。

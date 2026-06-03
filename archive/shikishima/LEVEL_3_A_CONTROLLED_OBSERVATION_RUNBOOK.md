# Level 3-A Controlled Observation Runbook

## Document Status

```text
roadmapVersion: v3.29.0
date: 2026-05-16
status: design_only — do not execute until separate Level 3-A GO is issued
```

---

## 1. Purpose

Level 3-A is controlled, time-windowed, read-only local observation only.

```text
Level 3-A IS:
- starting the runtime within an approved time window
- observing redacted status in Electron UI
- confirming iPhone Private Console if required
- creating evidence of the observation
- shutting down runtime and confirming port closed

Level 3-A IS NOT:
- productionReady
- autonomous execution
- enabling execution globally
- robot / voice / camera / mic operation
- external deployment
- expanding operation beyond the approved scope
```

---

## 2. Preconditions (must all be true before starting)

```text
[ ] origin/main confirmed at expected commit
[ ] staged = 0
[ ] dirty = 0
[ ] port 3030 closed before start
[ ] runtime branch not pushed to remote
[ ] activation commit 35f02c5 not in main
[ ] Level 3-A GO issued separately with filled placeholders
[ ] exact time_window exists in GO
[ ] exact command exists in GO
[ ] STOP conditions reviewed
[ ] rollback plan reviewed
```

If any precondition is not met: do not start. Report HOLD.

---

## 3. Human Actions

The human is responsible for:

```text
- approve time_window
- approve exact command
- physically operate iPhone if same-LAN observation is required
- confirm visible UI result by human eyes
- enter pairing token manually if required
- decide PASS / HOLD / NG after observation
- issue acceptance phrase if accepted
```

---

## 4. ClaudeCode Actions

ClaudeCode may only:

```text
- verify pre-run state (git/port checks)
- run the approved command at the approved time
- record observation in redacted form only
- confirm shutdown and port status
- create evidence doc
- STOP on any STOP condition
- report result accurately

ClaudeCode must not:
- infer approval from any action
- expand scope beyond the approved GO
- report raw token, raw LAN IP, raw secrets
- continue after STOP condition triggers
```

---

## 5. Observation Procedure

```text
1. Verify preconditions (Section 2)
2. Await human GO with filled time_window and command
3. At approved start time: run approved command
4. Observe Electron UI:
   - confirm decision = HOLD
   - confirm execution = disabled
   - confirm productionReady = false
   - confirm rawValuesReported = false
5. If iPhone observation required:
   - human physically opens /mobile/health in Safari
   - human opens /mobile/ui and enters token
   - human confirms redacted snapshot
6. Confirm no raw values visible
7. Run shutdown procedure from GO
8. Confirm port 3030 closed
9. Create evidence doc from template
```

---

## 6. Forbidden Throughout

```text
- execution enabled
- productionReady true
- raw token in chat or logs
- raw LAN IP in chat or docs
- robot / voice / camera / mic
- external deployment / Cloudflare
- dependency installation / npm / npx
- operation outside approved time_window
- port remaining open after shutdown
- runtime branch push
- activation commit 35f02c5 to main
```

---

## 7. Completion Criteria

A Level 3-A run is complete when all are true:

```text
[ ] runtime shut down within approved window
[ ] port 3030 confirmed closed
[ ] evidence doc created with all required fields
[ ] no raw values in evidence
[ ] no boundary violation occurred
[ ] result recorded as PASS / PASS_WITH_CAVEAT / HOLD / NG
```

---

## Safety Boundary

```text
decision          : HOLD
execution         : disabled
productionReady   : false
rawValuesReported : false
Level 3           : not approved (this runbook is design only)
```

---

この範囲では問題を検出していません。

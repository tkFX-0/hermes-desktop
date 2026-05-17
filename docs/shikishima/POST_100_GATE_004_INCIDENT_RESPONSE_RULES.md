# Post-100 Gate 004 — Incident Response Rules

## Document Status

```text
roadmapVersion: v3.60.0
date: 2026-05-17
gate: Post-100 Gate 004
name: Incident Response Rules
status: design_ready — not yet executed
```

---

## Purpose

Limited Manual Operation が STARTED した。インシデントが発生した場合の対応ルールを定義する。

Goal: 問題が起きたときに迷わず止まれる。問題が起きなかったときに記録が残る。

---

## Incident Classification

```text
Level 0 — Nominal (異常なし)
  operationCompleted: true
  allChecklistsPassed: true
  noHoldRequired: true
  action: record operation log, continue

Level 1 — HOLD (保留)
  trigger: any pre/per/post checklist item fails
  examples:
    - sensitive data found in draft
    - external_service is not none
    - action_type is not manual_copy_only
    - raw values / token / secret detected
  action:
    mark draft as: hold
    record reason in operation log
    do NOT copy draft
    do NOT take external action
    resume only after human re-review clears the hold

Level 2 — REJECT (却下)
  trigger: draft content is unsafe and should not be reused
  examples:
    - real recipient / PII detected
    - financial info / legal info detected
    - content cannot be made safe by editing
  action:
    mark draft as: rejected
    record reason in operation log
    do NOT copy draft
    do NOT reuse draft
    draft is archived as rejected

Level 3 — STOP (緊急停止)
  trigger: unexpected system state or behavior
  examples:
    - external write occurred (email_sent, social_posted, etc.)
    - runtime started unexpectedly
    - port_3030 opened unexpectedly
    - automated action occurred without human initiation
    - ENABLED flag changed without session GO
  action:
    STOP operation immediately
    do NOT continue any draft review
    record in STOP_EVENT log (separate from operation log)
    escalate to human review before ANY resumption
    safety invariants must be re-verified before resuming
```

---

## HOLD Conditions (operation must pause)

```text
Any of the following → HOLD immediately:

[ ] draft contains: name / email address / phone number of real person
[ ] draft contains: API key / token / password / LAN IP / credential
[ ] draft contains: financial amount linked to real account
[ ] draft contains: medical / legal / personal information
[ ] external_service is not: none
[ ] action_type is not: manual_copy_only
[ ] reviewer is not human (automated review)
[ ] approved_for_manual_copy semantics are ambiguous
[ ] operation log has not been started before review
[ ] pre-operation checklist was not completed
```

---

## STOP Conditions (entire operation must cease immediately)

```text
Any of the following → STOP everything:

[ ] email_sent: true (even accidental)
[ ] calendar_event_created: true
[ ] github_remote_created: true
[ ] social_posted: true
[ ] purchase_or_reservation_made: true
[ ] runtime_started: true unexpectedly
[ ] port_3030 observed open without session GO
[ ] MOBILE_CONSOLE_PHASE_2C_ENABLED changed to true without session GO
[ ] productionReady changed to true without explicit Gate 005 completion
[ ] execution changed from disabled without explicit GO
[ ] automated send / automated post / automated create occurred
[ ] StackChan physical operation occurred without GO
[ ] voice / camera / mic activated without GO
```

---

## STOP Event Log Template

```text
STOP_EVENT:
  date:            [YYYY-MM-DD HH:MM JST]
  trigger:         [which STOP condition was met]
  observed_state:  [what was observed]
  expected_state:  [what was expected]
  immediate_action: [what was done to stop]
  human_notified:  [yes / no]
  resume_condition: [what must be verified before resuming]

Example:
  STOP_EVENT:
    date:            2026-05-17 XX:XX JST
    trigger:         runtime_started: true unexpectedly
    observed_state:  port_3030 observed open; runtime process detected
    expected_state:  port_3030_closed: true; runtime_started: false
    immediate_action: killed runtime process; closed port_3030
    human_notified:  yes
    resume_condition: all safety invariants re-verified; separate GO required
```

---

## Post-Incident Review Requirements

```text
After any Level 1 HOLD:
  [ ] Reason recorded in operation log
  [ ] Draft marked hold
  [ ] Human decision: revise / escalate to Level 2 / clear hold

After any Level 2 REJECT:
  [ ] Reason recorded in operation log
  [ ] Draft marked rejected and archived
  [ ] Pattern noted: what type of content caused rejection?
  [ ] Consider whether review checklist needs updating

After any Level 3 STOP:
  [ ] STOP_EVENT logged separately
  [ ] All safety invariants re-verified
  [ ] Root cause identified
  [ ] Prevention measure added to HOLD_CONDITIONS or STOP_CONDITIONS
  [ ] Separate GO required before resuming ANY operation
  [ ] Consider whether Gate design needs updating
```

---

## Non-Incident: Nominal Operation Evidence

```text
Nominal operation does NOT require a STOP_EVENT log.
Nominal operation DOES require:
  [ ] Pre-operation checklist: all items checked
  [ ] Per-draft checklist: all items checked for each draft
  [ ] Post-operation checklist: all items checked
  [ ] Operation log filled in (using operation log template)
```

---

この範囲では問題を検出していません。

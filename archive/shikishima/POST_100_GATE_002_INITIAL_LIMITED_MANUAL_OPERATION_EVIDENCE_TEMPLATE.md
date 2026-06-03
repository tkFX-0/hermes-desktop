# Post-100 Gate 002 — Initial Limited Manual Operation Test Evidence Template

## Document Status

```text
roadmapVersion: v3.55.0
date: [YYYY-MM-DD]
gate: Post-100 Gate 002
name: Initial Limited Manual Operation Test
status: template — fill after test execution
```

---

## Instructions

Fill this template after completing the Gate 002 manual review workflow.

Do NOT fill fields before the review is complete.
Do NOT pre-fill `approved_for_manual_copy: true` without completing the checklist.
Do NOT record `email_sent: true` or any external write as true.

---

## Result

```text
result:       [PASS / PASS_WITH_CAVEAT / HOLD / REJECT]
gate:         Post-100 Gate 002
test_name:    Initial Limited Manual Operation Test
date:         [YYYY-MM-DD HH:MM JST]
```

---

## Test Case

```text
category:                [fill: general_text_draft / other]
content_type:            [fill: non_sensitive_message_draft / other]
external_service:        [fill: none / other]
action_type:             [fill: manual_copy_only / review_only / other]
risk_level:              [fill: low / medium / high / critical]
proposed_by:             [fill: claudecode / human / other]
draft_title:             [fill]
draft_destination_label: [fill or "none — workflow validation only"]
```

---

## State Flow

```text
draft_created:                [date/time or "not_required_for_this_test"]
review_requested:             [date/time or "yes/no"]
approved_for_manual_copy:     [yes / no / not_reached]
manual_action_completed_by_human: [yes / no / not_applicable]
hold:                         [yes / no — if yes, state reason]
rejected:                     [yes / no — if yes, state reason]
needs_revision:               [yes / no — if yes, state what needed changing]
final_state:                  [approved_for_manual_copy / hold / rejected / archived]
```

---

## 8-Item Human Review Checklist

```text
[ ] 1. Is this action external?
       answer: [yes/no]
       note:   [fill if needed]

[ ] 2. Does it send / post / create / pay / reserve?
       answer: [yes/no]
       note:   [fill if needed]

[ ] 3. Does the draft body contain raw values?
       (token, API key, LAN IP, credential, local path, secret)
       answer: [yes/no]
       note:   [fill if yes — must resolve before proceeding]

[ ] 4. Does it reveal private internal state?
       (operational secrets, system internals)
       answer: [yes/no]
       note:   [fill if yes — must resolve before proceeding]

[ ] 5. Does it require a service-specific GO?
       answer: [yes/no]
       gate_reference: [fill if yes]

[ ] 6. Is it safe for manual copy only?
       answer: [yes/no]
       note:   [fill if no — must resolve before proceeding]

[ ] 7. Is evidence required after action?
       answer: [yes — this file]
       note:   [additional notes if needed]

[ ] 8. Should it be HOLD or REJECT?
       answer: [HOLD / REJECT / neither]
       reason: [fill if hold or reject]
```

---

## Decision

```text
decision:    [approved_for_manual_copy / hold / needs_revision / rejected]

note:
  approved_for_manual_copy means:
    Human may manually copy the draft text outside the system.
    This does NOT authorize the system to send, post, schedule,
    create, purchase, reserve, pay, or mutate external services.
    This does NOT authorize the AI to take any action.
    Manual copy only. Human action only.
```

---

## Safety Invariants (must all be false/disabled)

```text
productionReady:              false ✓
execution:                    disabled ✓
runtime_started:              false ✓
port_3030_closed:             true ✓
rawValuesReported:            false ✓
external_api_write:           false [confirm]
email_sent:                   false [confirm]
calendar_event_created:       false [confirm]
github_remote_created:        false [confirm]
social_posted:                false [confirm]
purchase_or_reservation_made: false [confirm]
StackChan_physical_operation: false [confirm]
voice_camera_mic_activation:  false [confirm]
package_changed:              false [confirm]
dependency_changed:           false [confirm]
```

---

## Caveat (if PASS_WITH_CAVEAT)

```text
caveat_description: [fill if applicable]
caveat_non_blocking: [true / false]
```

---

## Next Required Action After This Test

```text
If PASS or PASS_WITH_CAVEAT:
  human accepts Gate 002 result
  create acceptance evidence
  push acceptance evidence commit
  plan Gate 003 (more specific manual operation if needed)

If HOLD:
  state reason in hold note above
  do not proceed until hold is resolved

If REJECT:
  state reason in rejected note above
  revise test case or approach before Gate 003
```

---

この範囲では問題を検出していません。

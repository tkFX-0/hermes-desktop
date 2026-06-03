# Post-100 Gate 002 — Initial Limited Manual Operation Test Plan

## Document Status

```text
roadmapVersion: v3.55.0
date: 2026-05-17
gate: Post-100 Gate 002
name: Initial Limited Manual Operation Test
status: plan — awaiting human approval and execution
```

---

## Non-Approval Boundary

```text
Gate 002 does NOT approve:
  productionReady true
  execution enabled
  runtime observation (MOBILE_CONSOLE_PHASE_2C_ENABLED true)
  external API write
  email send
  calendar event creation
  GitHub remote issue/PR creation
  social posting
  purchase/payment/reservation
  StackChan physical operation
  voice/camera/mic activation
  package/dependency changes
  git push beyond explicitly approved docs commits
```

---

## Goal

Validate the manual review workflow defined in Gate 001 with one non-sensitive draft proposal.

```text
Entry condition: Gate 001 ACCEPTED_AND_PUSHED
Exit condition:  draft proposal reviewed; state machine traversed to
                 approved_for_manual_copy or hold or rejected; result recorded
```

---

## Test Case

```text
category:       general_text_draft
content_type:   non_sensitive_message_draft
external_service: none
action_type:    manual_copy_only (or review-only)
risk_level:     low
```

**Proposed draft content:**

```text
Title: しきしまGate 001 完了お知らせ文案

Body:
  しきしま安全コンソール Gate 001 が完了しました。
  Draft Outbox の手動レビューワークフローが確立されています。
  次は Gate 002 Initial Limited Manual Operation Test に進みます。
  (この文案はワークフロー動作確認用のサンプルです。実際の送信先はありません)

Destination: (none — review-only for workflow validation)
proposed_by: claudecode
actionKind: general_text_draft
externalWrite: false
sent: false
```

This draft contains no real recipient, no credentials, no raw values, no operational secrets.

---

## Required Flow

```text
Step 1 — draft_created
  Draft text created. No external action.
  State: draft_created

Step 2 — review_requested
  Human opens the draft for review.
  Human runs the 8-item manual review checklist.
  State: review_requested

Step 3 — Human Review Decision
  Human decides one of:
    approved_for_manual_copy → proceed to Step 4
    needs_revision           → return to Step 1 with notes
    hold                     → state: hold; stop here
    rejected                 → state: rejected; stop here

Step 4 — approved_for_manual_copy (if chosen)
  DEFINITION:
    Human may manually copy the draft text outside the system.
    This does NOT authorize the system to send, post, schedule,
    create, purchase, reserve, pay, or mutate external services.
    This does NOT authorize the AI to take any action.
    Manual copy only. Human action only.

  For this test case, since there is no destination, the human may:
    - confirm the workflow was traversed correctly
    - optionally copy the draft text for reference
    - report result as PASS if workflow is clear and safe

Step 5 — Result Recording
  Human reports: PASS / PASS_WITH_CAVEAT / HOLD / REJECT
  Evidence file is created using the template.
```

---

## State Semantics

```text
draft_created:
  Draft exists only as text/proposal. No external action.

review_requested:
  Human review is required before any further action.
  8-item checklist must be completed.

approved_for_manual_copy:
  Human may manually copy the draft text outside the system.
  Does NOT authorize system execution of any kind.

manual_action_completed_by_human:
  Optional human-reported status.
  The system does not verify or perform the external action.
  Only human can set this state.

needs_revision:
  Draft requires changes before review can proceed.

hold:
  Test paused. Risk or ambiguity remains.
  Can return to review_requested after revision.

rejected:
  Draft is not suitable. Stop and archive.
  Record reason.
```

---

## 8-Item Manual Review Checklist (Gate 002 instance)

```text
[ ] 1. Is this action external?
       → For this test: no external destination; workflow validation only ✓

[ ] 2. Does it send / post / create / pay / reserve?
       → For this test: no; text copy only ✓

[ ] 3. Does the draft body contain raw values?
       → Check: no token / API key / LAN IP / credential / path ✓

[ ] 4. Does it reveal private internal state?
       → Check: no operational secrets / no system-internal data ✓

[ ] 5. Does it require a service-specific GO?
       → For this test: no external service ✓

[ ] 6. Is it safe for manual copy only?
       → Yes; text is non-sensitive ✓

[ ] 7. Is evidence required after action?
       → Yes; Gate 002 evidence file must be created ✓

[ ] 8. Should it be HOLD or REJECT?
       → Only if a risk is found in checklist items 1-7 ✓
```

---

## Success Criteria

Gate 002 is PASS when:

```text
- draft reviewed via checklist
- state reached approved_for_manual_copy (or hold/rejected with documented reason)
- human reported result
- evidence file created
- no external action occurred
- safety invariants preserved
```

---

## Evidence File Path

```text
docs/shikishima/POST_100_GATE_002_INITIAL_LIMITED_MANUAL_OPERATION_EVIDENCE_TEMPLATE.md
```

Fill this template after running the test.

---

## Safety Boundary

```text
runtime_started:              false
port_3030_closed:             true
productionReady:              false
execution:                    disabled
rawValuesReported:            false
external_api_write:           false
email_sent:                   false
calendar_event_created:       false
github_remote_created:        false
social_posted:                false
purchase_or_reservation_made: false
StackChan_physical_operation: false
voice_camera_mic_activation:  false
package_changed:              false
dependency_changed:           false
```

---

この範囲では問題を検出していません。

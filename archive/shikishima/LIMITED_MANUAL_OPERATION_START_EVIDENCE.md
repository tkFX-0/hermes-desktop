# Limited Manual Operation — Start Evidence

## Document Status

```text
roadmapVersion: v3.59.0
date: 2026-05-17
status: STARTED
operation_mode: Limited Manual Operation
```

---

## STARTED Declaration

```text
result:         STARTED
operation_mode: Limited Manual Operation
status:         STARTED

This evidence records that Limited Manual Operation has started based on
Gates 001, 002, and 003 being accepted and pushed to origin/main.

This does NOT mean:
  productionReady true
  execution enabled
  autonomous operation
  external writes approved
  runtime observation approved
```

---

## Basis

```text
Gate 001 — Draft Outbox Operation Rulebook:
  status: ACCEPTED_AND_PUSHED
  commits: cd289fe + 248c94e + de33408
  result: operational rulebook defined; approved_for_manual_copy state machine established

Gate 002 — Initial Limited Manual Operation Test:
  status: PASS_AND_PUSHED
  commits: dbe50aa + f3e446c
  result: one non-sensitive sample (general_text_draft) reached approved_for_manual_copy
  test_id: post100-gate002-sample-001

Gate 003 — Manual Operation Repeatability Test:
  status: PASS_AND_PUSHED
  commits: 50f79fc + 665f65e
  result: three samples across risk levels reached approved_for_manual_copy
  samples:
    post100-gate003-sample-002: general_text_draft     — PASS
    post100-gate003-sample-003: github_issue_draft     — PASS
    post100-gate003-sample-004: social_post_draft      — PASS
  repeatability_confirmed: true
  limited_manual_operation_candidate: true
```

---

## Allowed Operation Scope

```text
Allowed in Limited Manual Operation:
  draft creation
    AI / Codex / ClaudeCode may propose draft items
    System shows drafts in Draft Outbox for human review
  human review
    Human applies 8-item manual review checklist
  approved_for_manual_copy
    Human may mark draft as approved_for_manual_copy after review
    This is the only approval authority the system has
  human manual copy outside system
    Human manually copies draft content and takes action outside the system
    No automatic execution occurs
```

---

## Not Allowed (all still HOLD)

```text
autonomous operation:                HOLD
productionReady true:                HOLD
execution enabled:                   HOLD
runtime observation:                 HOLD (MOBILE_CONSOLE_PHASE_2C_ENABLED remains false)
external API write:                  HOLD
email send (automatic or via system): HOLD
calendar event creation:             HOLD
GitHub remote issue/PR creation:     HOLD
social posting:                      HOLD
purchase/payment/reservation:        HOLD
StackChan physical operation:        HOLD
voice/camera/mic activation:         HOLD
package/dependency changes:          HOLD (requires explicit GO)
unapproved git push:                 HOLD
```

---

## approved_for_manual_copy Boundary

```text
approved_for_manual_copy means:
  Human may manually copy the draft content outside the system.
  The system is NOT authorized to send, post, schedule, create,
  purchase, reserve, pay, or mutate external services.
  The AI is NOT authorized to take any external action.
  Manual copy only. Human action only.
```

---

## Progress After STARTED

```text
実運用全体進捗: 50〜55%
限定手動運用:   STARTED
自動実行:       HOLD
productionReady: false
execution:       disabled
```

---

## Safety Invariants

```text
productionReady:              false ✓
execution:                    disabled ✓
runtime_started:              false ✓
port_3030_closed:             true ✓
rawValuesReported:            false ✓
external_api_write:           false ✓
email_sent:                   false ✓
calendar_event_created:       false ✓
github_remote_created:        false ✓
social_posted:                false ✓
purchase_or_reservation_made: false ✓
StackChan_physical_operation: false ✓
voice_camera_mic_activation:  false ✓
package_changed:              false ✓
dependency_changed:           false ✓
git_push_performed:           false ✓
```

---

## Recommended Next Gates

```text
1. Gate 004 — Manual Operation Audit / Incident Checklist
   purpose: define how to handle incidents or unexpected results during manual operation
   scope: docs-only

2. productionReady前チェックリスト
   purpose: define what must be complete before productionReady can be considered
   scope: docs-only (productionReady remains false until all gates are met)

3. Post-100 Runtime Observation Planning
   purpose: plan next Level 3-A session for iPhone Private Console runtime observation
   scope: plan only; execution requires separate time-window GO
```

None of the above are approved by this document.
Each requires its own separate GO.

---

この範囲では問題を検出していません。

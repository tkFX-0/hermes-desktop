# Post-100 Gate 007 — Expanded Operation Evidence Template

## Document Status

```text
roadmapVersion: v3.60.0
date: 2026-05-17
gate: Post-100 Gate 007
name: Expanded Operation Evidence Template
status: design_ready — not yet executed
```

---

## Purpose

Gate 007 のユースケース拡張評価セッションの証跡を記録するテンプレート。
新しいカテゴリを評価するたびにこのファイルをコピーして使用する。

---

## Evidence Template (copy for each evaluation session)

```text
# Gate 007 Expanded Operation Evidence — [Category] Session [NNN]

## Session Info

session_id:        gate007-session-[NNN]
date:              [YYYY-MM-DD HH:MM JST]
category:          [draft category being evaluated]
risk_level:        [as defined in policy matrix]
evaluation_scope:  [manual_copy_only; display-only; no external action]

## Sample Info

sample_id:         [e.g. post100-gate007-sample-NNN]
content_type:      [describe content type]
external_service:  [none — required for all Gate 007 samples]
action_type:       [manual_copy_only — required]

## Draft Content (for evidence)

[Paste or describe the draft content without raw values]

Confirmed absent:
  [ ] real email address / recipient
  [ ] real API key / token / credential
  [ ] real financial info
  [ ] real PII
  [ ] external_service (must be none)

## Category-Specific Additional Checks

[Fill in category-specific checks from policy matrix]

For email_draft:
  recipient_address_is_placeholder: [true / false — HOLD if false]
  send_triggered:                   [false — required]

For calendar_draft:
  attendee_is_placeholder:          [true / false — HOLD if false]
  calendar_event_created:           [false — required]

For github_pr_draft:
  github_pr_remote_created:         [false — required]
  code_content_is_generic:          [true / false — HOLD if false]

For purchase_or_reservation_draft:
  payment_info_absent:              [true — required]
  reservation_triggered:            [false — required]

For external_api_draft:
  api_key_absent:                   [true — required]
  api_call_triggered:               [false — required]

For long_form_document_draft:
  (no additional checks beyond standard 8-item)

## Standard 8-Item Checklist

[✓/✗] 1. external_action:     [no / yes → HOLD]
[✓/✗] 2. send_post_pay:       [no / yes → HOLD]
[✓/✗] 3. raw_values:          [no / yes → HOLD]
[✓/✗] 4. private_state:       [no / yes → HOLD]
[✓/✗] 5. service_go_required: [no / yes → HOLD]
[✓/✗] 6. safe_manual_copy:    [yes / no → HOLD]
[✓/✗] 7. evidence_required:   [yes]
[✓/✗] 8. hold_or_reject:      [neither / HOLD / REJECT]

checklist_result: [all PASS / HOLD / REJECT]

## State Flow

draft_created:                    [true]
review_requested:                 [true]
approved_for_manual_copy:         [true / false / held / rejected]
manual_action_completed_by_human: [false / not_required_for_this_test]
hold:                             [false / true]
rejected:                         [false / true]
final_state:                      [approved_for_manual_copy / held / rejected]

## Decision

decision:      [approved_for_manual_copy / held / rejected]
hold_reason:   [n/a / describe]
reject_reason: [n/a / describe]

## Safety Invariants

productionReady:              false ✓
execution:                    disabled ✓
runtime_started:              false ✓
rawValuesReported:            false ✓
external_api_write:           false ✓
email_sent:                   false ✓
calendar_event_created:       false ✓
github_remote_created:        false ✓
social_posted:                false ✓
purchase_or_reservation_made: false ✓

## Category Evaluation Result

category:        [category name]
evaluation:      [PASS / FAIL / NEEDS_REVISION]
matrix_update_required: [true / false]
notes:           [free text]

## Next Required Human Action

result_candidate: [PASS / FAIL]
next_action:      [human review this evidence; decide whether to add category to matrix]
```

---

## Naming Convention

```text
POST_100_GATE_007_EXPANDED_EVIDENCE_[CATEGORY]_[YYYYMMDD].md

Example:
  POST_100_GATE_007_EXPANDED_EVIDENCE_EMAIL_DRAFT_20260517.md
```

---

この範囲では問題を検出していません。

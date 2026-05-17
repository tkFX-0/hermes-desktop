# Post-100 Gate 007 — Use Case Policy Matrix

## Document Status

```text
roadmapVersion: v3.60.0
date: 2026-05-17
gate: Post-100 Gate 007
name: Use Case Policy Matrix
status: design_ready — not yet evaluated
```

---

## Purpose

Limited Manual Operation で扱える各ドラフトカテゴリのリスクレベルと追加チェック要件を定義する。

---

## Matrix Format

```text
| category | risk_level | status | additional_checks | hold_trigger_examples | reject_trigger_examples |
```

---

## Current Matrix

| category | risk_level | status | additional_checks |
|---|---|---|---|
| general_text_draft | low | APPROVED (Gate 003) | none beyond standard 8-item |
| github_issue_draft | medium | APPROVED (Gate 003) | github_remote_created: false; no auth token |
| social_post_draft | medium | APPROVED (Gate 003) | social_posted: false; no platform credential |
| email_draft | high | PENDING_EVALUATION | recipient_address_is_placeholder; send_triggered: false |
| calendar_draft | medium | PENDING_EVALUATION | attendee_is_placeholder; calendar_event_created: false |
| github_pr_draft | medium-high | PENDING_EVALUATION | github_pr_remote_created: false; code is generic |
| purchase_or_reservation_draft | very_high | PENDING_EVALUATION | payment_info_absent; reservation_triggered: false |
| external_api_draft | high | PENDING_EVALUATION | api_key_absent; api_call_triggered: false |
| long_form_document_draft | low-medium | PENDING_EVALUATION | none beyond standard 8-item |

---

## HOLD Trigger Examples by Category

```text
general_text_draft:
  HOLD: contains real person's name + contact info
  HOLD: contains internal system credentials
  REJECT: contains real PII with no way to redact

github_issue_draft:
  HOLD: contains repo URL with embedded auth token
  HOLD: contains LAN IP of production server
  REJECT: issue targets a real repo with sensitive content

social_post_draft:
  HOLD: contains real account handle as author identity
  HOLD: contains personal information about real individuals
  REJECT: contains defamatory or harmful content

email_draft:
  HOLD: contains real email address (even as placeholder tone)
  HOLD: content implies immediate send action
  REJECT: PII of real person; financial details; legal claims

calendar_draft:
  HOLD: attendee list contains real email addresses
  HOLD: contains phone conference credentials (dial-in codes)
  REJECT: contains meeting invite with real external participants + sensitive info

github_pr_draft:
  HOLD: code contains API key / token embedded in diff
  HOLD: PR targets a real remote branch (implies remote action)
  REJECT: code changes contain hardcoded credentials

purchase_or_reservation_draft:
  HOLD: contains any dollar amount linked to real account
  HOLD: contains payment method info (even partial)
  REJECT: any draft that could trigger a real financial transaction

external_api_draft:
  HOLD: contains real API key (even partial)
  HOLD: endpoint URL is a real production endpoint
  REJECT: draft describes an API call that would modify production data

long_form_document_draft:
  HOLD: contains personally identifiable health/legal/financial info
  HOLD: contains confidential business information
  REJECT: content is defamatory, harmful, or legally problematic
```

---

## Category Approval Process

```text
PENDING_EVALUATION → APPROVED requires:
  1. At least 1 sample tested in Gate 007 evaluation session
  2. Per-draft checklist + category-specific checks all pass
  3. Human review confirms safe for manual_copy_only
  4. This matrix updated with status: APPROVED
  5. Human confirms matrix update
```

---

## Matrix Update History

```text
2026-05-17: Initial matrix created (Gate 007 design_ready)
  - 3 categories APPROVED from Gate 003
  - 6 categories PENDING_EVALUATION
  - All PENDING categories require separate Gate 007 evaluation session
```

---

この範囲では問題を検出していません。

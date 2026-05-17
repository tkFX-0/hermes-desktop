# Post-100 Gate 007 — Limited Manual Operation Use Case Expansion Plan

## Document Status

```text
roadmapVersion: v3.60.0
date: 2026-05-17
gate: Post-100 Gate 007
name: Limited Manual Operation Use Case Expansion Plan
status: design_ready — not yet executed
```

---

## Purpose

Gate 003 では 3 種のドラフトカテゴリを確認した。Gate 007 では Limited Manual Operation で
扱えるユースケースの範囲を整理・拡張する。

Goal: approved_for_manual_copy の境界を守りながら、より多くのドラフトカテゴリを安全に扱う。

---

## Gate 003 確認済みカテゴリ (baseline)

```text
general_text_draft     — risk: low    — status: CONFIRMED (Gate 003)
github_issue_draft     — risk: medium — status: CONFIRMED (Gate 003; no remote creation)
social_post_draft      — risk: medium — status: CONFIRMED (Gate 003; no social API call)
```

---

## Gate 007 評価対象カテゴリ

```text
Category 1: email_draft
  risk_level:      high
  concern:         email アドレスが含まれる可能性; 誤送信リスク
  gate_007_plan:   per-draft 8-item checklist の email 特化項目を確認
                   recipient_address: must be absent or clearly placeholder
                   send_triggered: false (required)
  additional_check: recipient_address_is_placeholder: true

Category 2: calendar_draft
  risk_level:      medium
  concern:         schedule / time / attendee が含まれる可能性
  gate_007_plan:   attendee list must be placeholder or absent
                   calendar_event_created: false (required)
  additional_check: attendee_is_placeholder: true

Category 3: github_pr_draft
  risk_level:      medium-high
  concern:         PR にコードが含まれる場合; ブランチ名/レポ名が含まれる場合
  gate_007_plan:   github_remote_created: false (required)
                   no auth token / repo URL with auth
                   code_content: must be generic / placeholder
  additional_check: github_pr_remote_created: false

Category 4: purchase_or_reservation_draft
  risk_level:      very high
  concern:         金融情報 / 予約情報 / 決済情報
  gate_007_plan:   payment_or_reservation_triggered: false (required)
                   amount: must be absent or clearly fictional
                   account_number: must be absent
  additional_check: payment_info_absent: true
                   reservation_triggered: false

Category 5: external_api_draft
  risk_level:      high
  concern:         API キー / エンドポイント / 認証情報
  gate_007_plan:   api_key: must be absent (HOLD if present)
                   endpoint_called: false (required)
                   draft is spec/description only
  additional_check: api_key_absent: true
                   api_call_triggered: false

Category 6: long_form_document_draft
  risk_level:      low-medium
  concern:         sensitive data, PII, confidential info
  gate_007_plan:   same 8-item checklist
                   no special additional check required
  additional_check: none beyond standard checklist
```

---

## Expansion Criteria

```text
A category may be added to the approved use case list when:
  [ ] At least 1 sample has passed the per-draft checklist
  [ ] Category-specific additional checks are defined
  [ ] Operation log covers the category
  [ ] Human review confirms the category is safe for manual_copy_only

A category must remain HOLD when:
  [ ] payment/reservation can be triggered by the draft content
  [ ] auth credentials could be present in realistic use
  [ ] human reviewer cannot easily detect the risk
```

---

## Policy Update Process

```text
1. Gate 007 Policy Matrix is updated when evaluation is complete
2. Each approved category is recorded in the matrix with:
   - additional checks required
   - examples of content that would trigger HOLD
   - examples of content that would trigger REJECT
3. The operation_log_template is updated to include category-specific fields
4. Human confirms updated matrix before it is considered effective
```

---

## Current Status

```text
Gate 007: design_ready
Evaluation: not yet started
Approved categories (as of Gate 003): general_text / github_issue / social_post
All new categories: pending evaluation
```

---

この範囲では問題を検出していません。

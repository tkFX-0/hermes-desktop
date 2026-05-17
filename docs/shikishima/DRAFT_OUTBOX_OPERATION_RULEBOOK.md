# Draft Outbox Operation Rulebook

## Document Status

```text
roadmapVersion: v3.53.0
date: 2026-05-17
status: operational_rulebook — Post-100 Gate 001
```

---

## Purpose

This rulebook defines how Draft Outbox items are handled before any external action is taken.

The Draft Outbox is a **display-only, draft-only** layer. It holds proposed external actions in draft state. No action can be sent, posted, created, paid, or executed by the app or AI.

---

## Core Principle

```text
The app and AI do NOT execute external actions.
Only the human executes external actions.
The app and AI propose and display. The human decides and acts.
```

---

## Draft-Only Policy

```text
Every item in the Draft Outbox:
  externalWrite:         false (type-level literal)
  sent:                  false (type-level literal)
  remoteCreated:         false (type-level literal)
  paymentOrReservation:  false (type-level literal)
  execution:             "disabled" (type-level literal)
  productionReady:       false (type-level literal)
  rawValuesReported:     false (type-level literal)
```

These values are enforced by the TypeScript type system and cannot be overridden.

---

## Workflow

```text
Step 1 — Draft Creation
  AI / Codex / ClaudeCode may propose a draft item.
  The item appears in the Draft Outbox with draftState: "draft_only".
  No external action occurs.

Step 2 — Human Review
  Human opens the Draft Outbox.
  Human reads: title, summary, bodyPreview, destinationLabel,
               actionKind, riskLevel, requiredHumanAction, safeNextStep.
  Human runs the manual review checklist (see below).

Step 3 — Decision
  Human decides one of:
    APPROVE_FOR_MANUAL_COPY → proceed to Step 4
    HOLD → item state: "held" — do not proceed
    REJECT → item state: "rejected" — do not proceed

Step 4 — Manual Copy (human only)
  Human manually copies the draft body / content.
  Human manually performs the external action (opens email client, browser, etc.).
  The app does NOT send, post, create, pay, or execute.
  The AI does NOT perform the action.

Step 5 — Evidence
  Human creates an evidence note:
    - what action was taken
    - when it was taken
    - result (sent / not sent / error)
    - rawValuesReported: false
  The evidence note may reference the draft item ID.

Step 6 — Item Archival
  Human sets item state to "archived" after action is completed.
  Or item remains "held" / "rejected" if not approved.
```

---

## State Machine

```text
draft_only      → waiting_human (human opens for review)
waiting_human   → held         (human holds)
waiting_human   → rejected     (human rejects)
waiting_human   → archived     (human manually completed action + evidence)
held            → waiting_human (reconsidered)
held            → rejected
rejected        → archived
expired         → archived
```

---

## External Action Categories

### email_draft

```text
default_status:         draft_only
risk_level:             medium (default) — high if contains sensitive data
allowed:                human reads draft; human manually sends from email client
forbidden:              app sending email; AI sending email; auto-send
required_human_review:  recipient confirmed; content confirmed; no raw secrets in body
minimum_evidence:       note that email was manually sent; date; recipient (first name only or role)
stop_conditions:
  - raw API key / credential in draft body
  - recipient not confirmed by human
  - autonomous send attempt
```

### calendar_draft

```text
default_status:         draft_only
risk_level:             low (default)
allowed:                human reads draft; human manually creates event in calendar app
forbidden:              app creating event; AI creating event; auto-schedule
required_human_review:  date/time confirmed; attendees confirmed; no private data in description
minimum_evidence:       note that event was manually created; date; summary
stop_conditions:
  - private location data in draft
  - autonomous creation attempt
```

### github_issue_draft

```text
default_status:         draft_only
risk_level:             medium
allowed:                human reads draft; human manually creates issue on GitHub
forbidden:              app creating remote issue; AI creating remote issue; auto-submit
required_human_review:  repository confirmed; title/body confirmed; labels confirmed
minimum_evidence:       GitHub issue URL after manual creation
stop_conditions:
  - sensitive internal data in issue body
  - autonomous remote creation attempt
```

### github_pr_draft

```text
default_status:         draft_only
risk_level:             high
allowed:                human reads draft; human manually creates PR on GitHub
forbidden:              app creating remote PR; AI creating remote PR; auto-submit
required_human_review:  base/head branch confirmed; title/body confirmed; no internal secrets
minimum_evidence:       GitHub PR URL after manual creation
stop_conditions:
  - internal path / key in PR description
  - autonomous remote creation attempt
```

### social_post_draft

```text
default_status:         draft_only
risk_level:             medium (default) — high if references private operation
allowed:                human reads draft; human manually posts from social platform
forbidden:              app posting; AI posting; auto-post
required_human_review:  content confirmed; no private operational details; no raw values
minimum_evidence:       note that post was manually made; platform; date
stop_conditions:
  - internal operational details in post
  - raw token / LAN IP visible in post
  - autonomous post attempt
```

### purchase_or_reservation_draft

```text
default_status:         draft_only
risk_level:             critical
allowed:                human reads draft; human manually processes purchase/reservation
forbidden:              app purchasing; AI purchasing; auto-pay; auto-reserve
required_human_review:  amount confirmed; merchant confirmed; purpose confirmed; payment method confirmed
minimum_evidence:       receipt or confirmation; amount; date; purpose
stop_conditions:
  - amount not explicitly confirmed by human
  - autonomous payment attempt
  - merchant not confirmed
```

### external_api_draft

```text
default_status:         draft_only
risk_level:             high
allowed:                human reads draft; human manually calls API via curl / Postman / etc.
forbidden:              app calling external API; AI calling external API; auto-execute
required_human_review:  endpoint confirmed; method confirmed; payload confirmed; auth confirmed
minimum_evidence:       response status; endpoint (no raw auth); date
stop_conditions:
  - raw API key in payload
  - autonomous API call attempt
```

---

## Task P100-001-D — Manual Review Checklist

Use this checklist before any human takes action on a draft item.

```text
Draft Outbox Manual Review Checklist
=====================================

Item: _____________________ (id / title)
Date: _____________________
Reviewer: human

[ ] 1. Is this action external?
       (sends, posts, creates, pays, reserves, calls API outside local system)

[ ] 2. Does it send / post / create / pay / reserve?
       If yes: only human may execute — app/AI must not

[ ] 3. Does the draft body contain raw values?
       (token, API key, LAN IP, secret, password, credential, local-only path)
       If yes: HOLD or redact before manual action

[ ] 4. Does it reveal private internal state?
       (operation details, system architecture, test data)
       If yes: review carefully; consider HOLD or REJECT

[ ] 5. Does it require a service-specific GO?
       Check FINAL_HOLD_AND_FUTURE_GO_REGISTRY.md for the relevant item
       If GO not yet issued: HOLD

[ ] 6. Is it safe for manual copy only?
       (human copies text; human performs action manually)
       If no safe manual path: HOLD

[ ] 7. Is evidence required after action?
       (for audit / rollback / history)
       If yes: create evidence note after manual action

[ ] 8. Should it be HOLD or REJECT?
       HOLD: not ready yet, may proceed later
       REJECT: will not proceed; archive

Decision: [ ] APPROVE_FOR_MANUAL_COPY  [ ] HOLD  [ ] REJECT

Evidence note created after action: [ ] yes / [ ] not applicable
```

---

## Risk Level Definitions

| Risk | Meaning | Default Required Review |
|---|---|---|
| low | Easily reversible; low external impact | Basic checklist |
| medium | Some external impact; moderately reversible | Full checklist |
| high | Significant external impact; hard to reverse | Full checklist + second read |
| critical | Financial / irreversible / high-stakes | Full checklist + explicit human GO per item |

---

## HOLD Conditions

A draft item must be set to HOLD if:

```text
- raw values detected in draft body
- required service GO not yet issued
- recipient / target not confirmed
- unsafe content detected
- evidence not yet defined
- human reviewer is unsure
```

---

## REJECT Conditions

A draft item should be REJECT if:

```text
- action is no longer needed
- action is explicitly disapproved
- content is incorrect and cannot be safely corrected
- action would violate privacy / security policy
```

---

## Forbidden Automated Actions

```text
The app and AI must NEVER:
  - send email automatically
  - create calendar events automatically
  - create GitHub issues or PRs remotely
  - post to social media
  - purchase, pay, or reserve
  - call external APIs with write operations
  - expose raw token / API key / LAN IP in draft body
  - change draft state without human input
  - approve their own draft items
```

---

## Evidence Requirements

After a human manually performs a draft action:

```text
Minimum evidence note:
  - action taken (type)
  - date/time
  - result (success / failure / partial)
  - rawValuesReported: false
  - execution: disabled
  - productionReady: false
  - no raw values in note
```

---

## Future GO Requirements

For each external action category, a future Gate GO is required before any manual execution:

| Category | Gate |
|---|---|
| Email send | G-ExternalWrite (email) |
| Calendar event | G-ExternalWrite (calendar) |
| GitHub issue/PR | G-ExternalWrite (GitHub) |
| Social post | G-ExternalWrite (social) |
| Purchase/payment | G-ExternalWrite (payment) |
| External API write | G-ExternalWrite (per service) |

See `FINAL_HOLD_AND_FUTURE_GO_REGISTRY.md` for each gate's requirements.

---

## Completion Conditions for a Draft Item

A draft item is considered completed (state: archived) when:

```text
1. Human reviewed the item (full checklist)
2. Human decided: APPROVE_FOR_MANUAL_COPY / HOLD / REJECT
3. If approved: human manually performed the action
4. Evidence note created
5. Item state set to archived
6. rawValuesReported: false confirmed
```

---

## Safety Boundary

```text
decision:             HOLD
execution:            disabled
productionReady:      false
rawValuesReported:    false
external_api_write:   false
sent:                 false
remoteCreated:        false
paymentOrReservation: false
```

---

この範囲では問題を検出していません。

# x_search HOLD/GO Matrix

## Document Status

```
date:             2026-05-18
status:           docs-only gate matrix — NOT activation approval
x_search_enabled: false
```

---

## Gate Sequence

All XS gates require the GHG provider gates to pass first.
Minimum prerequisite: GHG-08 (limited manual chat operation) PASS.

---

## XS-00 — Docs-Only Registration

```
objective:       Record x_search as a future Social Awareness feature candidate.
                 Define gate sequence. No activation.

allowed_actions:
  - Write docs registering x_search as a HOLD feature
  - Research x_search capabilities in Hermes docs

forbidden_actions:
  - hermes tools
  - x_search enablement
  - OAuth login
  - API call

required_human_GO: none (docs-only)

STOP_conditions:
  - Any Hermes command is run
  - Any x_search query is made

evidence_required:
  - This document
  - HERMES_SOCIAL_AWARENESS_FEATURE_CATALOG.md
  - X_SEARCH_SHIKISHIMA_INTEGRATION_PLAN.md

status:  COMPLETE (this document records XS-00 completion)
```

---

## XS-01 — x_search Auth Boundary Review

```
objective:       Review whether xai-oauth token scope covers x_search.
                 Confirm x_search does not require separate credentials.
                 No actual x_search query.

allowed_actions:
  - Check Hermes docs for x_search auth requirements
  - Check if xai-oauth token includes x_search scope
  - Confirm default-off status in Hermes config

forbidden_actions:
  - hermes tools enable x_search
  - Actual x_search query
  - Print raw token scope

required_human_GO: "XS-01 GO" (after GHG-04 PASS)

STOP_conditions:
  - x_search enabled without GO
  - Token scope reveals unexpected external access

status:  HOLD — requires GHG-04 PASS first
```

---

## XS-02 — x_search Enablement GO Draft

```
objective:       Prepare the exact steps to enable x_search in Hermes.
                 Human reviews steps before execution. No execution yet.

allowed_actions:
  - Document the hermes command that enables x_search (docs only)
  - Define safe query templates for first run
  - Define result redaction policy

forbidden_actions:
  - Run hermes command
  - Actually enable x_search
  - Make any x_search query

required_human_GO: "XS-02 GO" (after XS-01 PASS)

STOP_conditions:
  - x_search enabled without GO

status:  HOLD — requires XS-01 PASS first
```

---

## XS-03 — Read-Only Manual Dry Run

```
objective:       Human-supervised single x_search query with explicit GO.
                 Read result only. No summarization yet. No storage.

allowed_actions:
  - Single x_search query on a safe public topic
  - Read result in terminal (no storage in log files)
  - Report: result received, no sensitive content

forbidden_actions:
  - Multiple queries
  - Storing result in cleartext log
  - Summarization engine (not yet)
  - Any write action on X
  - Scheduled query

required_human_GO: "XS-03 GO" with time_window and approved topic

STOP_conditions:
  - Result contains sensitive user data (DM, private info)
  - x_search writes anything to X
  - Any external write occurs
  - Token exposed in output

evidence_required:
  - Human confirms: result received, content safe, no write
  - Redacted result summary

status:  HOLD — requires XS-02 PASS + human present
```

---

## XS-04 — Redacted Result Display

```
objective:       Display x_search result in Shikishima UI with proper redaction.
                 Human reviews redacted output in controlled surface.

allowed_actions:
  - Display x_search result in StackChan/Operator page or dedicated view
  - Redact raw usernames/IDs if sensitive
  - Store safe summary in Draft Outbox (draft_only)

forbidden_actions:
  - Display raw API response (must be processed first)
  - Automated digest (manual only in this gate)
  - Post or share result

required_human_GO: "XS-04 GO" (after XS-03 PASS)

STOP_conditions:
  - Raw API identifiers appear in UI
  - Result forwarded to external service without review

status:  HOLD — requires XS-03 PASS first
```

---

## XS-05 — Daily Digest Draft Only

```
objective:       Generate a summarized digest of x_search results.
                 Output is a copyable draft only. No auto-send.

allowed_actions:
  - Run x_search on approved topics (manual trigger)
  - Summarize results via Grok conversation
  - Format as Draft Outbox item (draft_only, copy-only)

forbidden_actions:
  - Auto-send digest to any channel
  - Auto-share to X
  - Scheduled execution (not yet)
  - Store raw result permanently

required_human_GO: "XS-05 GO" with topic set and time_window

STOP_conditions:
  - Digest is sent without human review
  - Any automatic write to external service

status:  HOLD — requires XS-04 PASS first
```

---

## XS-06 — Draft Outbox Integration

```
objective:       Wire x_search digest draft into Shikishima Draft Outbox.
                 Human can review, copy, or discard from the Outbox UI.

allowed_actions:
  - Source code change to Outbox (bounded scope, separate GO)
  - Draft Outbox shows social awareness digest items
  - Human copy-only; no send button

forbidden_actions:
  - Send button in Outbox for social drafts
  - Auto-populate without human trigger

required_human_GO: "XS-06 implementation GO" (separate from operation GO)

status:  HOLD — requires XS-05 PASS first
```

---

## XS-07 — Runtime UI Status

```
objective:       Show x_search availability and last query summary in Shikishima UI.

allowed_actions:
  - Add x_search status to StackChan / Inspector page
  - Show: enabled / disabled / last_queried / result_count

forbidden_actions:
  - Auto-trigger query from UI
  - Display raw API response

required_human_GO: "XS-07 GO" (implementation + runtime)

status:  HOLD — requires XS-06 PASS first
```

---

## XS-08 — Limited Manual Operation

```
objective:       Structured social awareness session under human supervision.
                 Enables scheduled digest trigger (human-confirmed frequency).

allowed_actions:
  - Regular scheduled digest (human-defined frequency, bounded)
  - observe → summarize → draft → await GO cycle
  - Human can copy / use drafts

forbidden_actions:
  - Autonomous posting
  - Autonomous replies
  - Autonomous DM
  - Any write without per-action human GO

required_human_GO: "XS-08 GO" with time_window and schedule definition

status:  HOLD — requires XS-07 PASS first
```

---

## XS-09 — External Posting Review

```
objective:       Define and implement per-post human GO flow for X posting.
                 Review content policy, safety, account, and approval mechanism.

note:            Autonomous posting is REJECT at any stage.
                 This gate only defines a HUMAN-initiated, per-post GO flow.

allowed_actions:
  - Define content policy for X posts
  - Define per-post approval mechanism
  - Human reviews draft → human initiates post manually

forbidden_actions:
  - Autonomous posting (REJECT — permanent)
  - Scheduled posting without per-post GO
  - Bulk posting

required_human_GO: "XS-09 content policy GO" + "per-post GO" for each post

status:  HOLD — requires XS-08 PASS first; autonomous posting is REJECT
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_

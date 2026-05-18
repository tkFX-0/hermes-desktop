# Hermes Social Awareness Feature Catalog

## Document Status

```
date:            2026-05-18
status:          docs-only feature catalog — NOT activation approval
decision:        HOLD
execution:       disabled
productionReady: false
x_search_enabled: false
runtime_started:  false
```

---

## Purpose

Catalog the Social Awareness Layer features available via Hermes for Shikishima.
This records what is possible, classifies each feature as GO/HOLD/REJECT,
and defines the activation sequence.

No feature is active. No Hermes command has been run.

---

## Concept: Shikishima Social Awareness Layer

Shikishima can observe what is happening on X (Twitter) and the broader AI space,
summarize relevant topics, and suggest drafts — all under human supervision.

### Core Philosophy

```
observe     → read external information (x_search, web_search)
summarize   → condense into human-readable digest
suggest     → propose what to discuss, share, or note
draft       → create copyable draft for human review
wait for GO → never post, send, or act without explicit human approval
```

This is fundamentally different from autonomous social media agents.
Every action at the "draft" stage or beyond requires human GO.

---

## Feature Stages

### Stage 0 — Docs Only (current)

```
status:  GO — this catalog records Stage 0
actions: read research, write docs, catalog features
no:      hermes run, oauth, x_search, api calls
```

### Stage 1 — Provider Readiness (GHG-01 to GHG-04)

```
status:  HOLD
actions: verify Hermes version, check auth boundary, verify provider status
enables: xai-oauth provider status check (redacted only)
no:      model call, chat, x_search
```

### Stage 2 — Chat-Only Dry Run (GHG-05)

```
status:  HOLD
actions: single safe chat message via Grok-Hermes
enables: basic conversation confirmation
no:      x_search, tool use, external actions
```

### Stage 3 — x_search Read-Only Manual (XS-03)

```
status:  HOLD
actions: single x_search query with human GO, read result only
enables: confirm x_search works, see raw redacted results
no:      automated digest, posting, draft generation
```

### Stage 4 — Redacted Result Display (XS-04)

```
status:  HOLD
actions: display x_search result in Shikishima UI (redacted, no raw API output)
enables: human can read search result in controlled surface
no:      automated search, posting
```

### Stage 5 — Daily Digest Draft Only (XS-05)

```
status:  HOLD
actions: generate summarized draft of X trends, relevant AI news
enables: human receives a copyable digest draft
no:      auto-post, auto-share, scheduled execution
```

### Stage 6 — Draft Outbox Integration (XS-06)

```
status:  HOLD
actions: draft digest added to Draft Outbox for human review
enables: consistent UI surface for social awareness output
no:      send, post, schedule
```

### Stage 7 — Runtime UI Status (XS-07)

```
status:  HOLD
actions: show x_search availability and last-run status in StackChan/Operator page
no:      automated search, posting
```

### Stage 8 — Limited Manual Operation (XS-08)

```
status:  HOLD
actions: structured social awareness session under human supervision
enables: observe → summarize → draft → await GO cycle
no:      autonomous posting, scheduled queries
```

### Stage 9 — External Posting Review (XS-09)

```
status:  HOLD
actions: define posting gate; review content policy; define per-post GO
separate_GO: required per post
no:      automated posting ever
```

---

## Feature Classification

### Adopted (pending gate passage)

| Feature | Stage | Status | Source |
|---|---|---|---|
| x_search (read-only) | XS-03+ | HOLD | xAI Grok via Hermes |
| AI news digest (draft only) | XS-05+ | HOLD | x_search + summarization |
| X trend awareness | XS-04+ | HOLD | x_search read |
| Draft generation for topics | XS-05+ | HOLD | Grok conversation |
| Draft Outbox integration | XS-06+ | HOLD | Shikishima Draft Outbox |
| Daily digest (manual-triggered) | XS-05+ | HOLD | manual human GO only |

### Not Adopted

| Feature | Reason |
|---|---|
| Autonomous X posting | Human GO required per post; never autonomous |
| Autonomous replies | DM or reply automation is REJECT |
| Scheduled X search | Cron/scheduled is HOLD until XS-08+ |
| Character-driven auto-post | Naruebi-style persona auto-posting not adopted |
| Bio / profile auto-update | External profile write is REJECT |
| Autonomous ordering | REJECT |
| Autonomous reservation | REJECT |
| Autonomous payment | REJECT |

---

## Reference Docs

- `X_SEARCH_SHIKISHIMA_INTEGRATION_PLAN.md` — integration plan details
- `X_SEARCH_HOLD_GO_MATRIX.md` — gate-by-gate GO requirements
- `NARUEBI_STYLE_REFERENCE_BOUNDARY.md` — what is and isn't adopted from Naruebi pattern
- `GROK_HERMES_PROVIDER_GATE.md` — GHG gate sequence (provider readiness)

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_

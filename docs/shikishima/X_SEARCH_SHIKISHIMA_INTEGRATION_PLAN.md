# x_search Shikishima Integration Plan

## Document Status

```
date:             2026-05-18
status:           docs-only plan — NOT activation approval
x_search_enabled: false
oauth_performed:  false
runtime_started:  false
```

---

## What is x_search

`x_search` is a Hermes tool that queries X (Twitter) via the xAI OAuth token.
It is off by default in Hermes and must be explicitly enabled.

In Shikishima context, x_search serves as the input layer for the Social Awareness Layer:
reads what is happening on X → feeds the observe → summarize → draft pipeline.

---

## Why x_search for Shikishima

1. **Information awareness**: AI news, tech trends, community discussion — relevant to Shikishima use
2. **Characterful interaction**: Shikishima can reference current topics in conversation
3. **Draft generation**: x_search result → digest draft → Draft Outbox → human GO
4. **Same OAuth bearer**: reuses xai-oauth token already needed for Grok conversation
5. **Default-off safety**: must be explicitly enabled; not a side-effect of provider setup

---

## Activation Prerequisite Chain

```
GHG-00  docs-only (COMPLETE)
GHG-01  Hermes version check
GHG-02  auth boundary review
GHG-03  OAuth login (human-only)
GHG-04  redacted provider status
GHG-05  chat-only dry run
GHG-08  limited manual chat operation
  └── XS-01  x_search auth boundary review
      └── XS-02  x_search enablement GO draft
          └── XS-03  read-only manual dry-run
              └── XS-04  redacted result display
                  └── XS-05  daily digest draft only
                      └── XS-06  Draft Outbox integration
                          └── XS-07  runtime UI status
                              └── XS-08  limited manual operation
                                  └── XS-09  external posting review (separate)
```

---

## Read-Only Boundary (XS-03 to XS-07)

In the initial stages, x_search is READ-ONLY:

```
allowed:
  - query X for public posts on defined topics
  - read and summarize results
  - add summary to Draft Outbox for human review

forbidden:
  - post to X
  - reply to posts
  - follow / unfollow
  - like / retweet
  - DM
  - profile update
  - any write action on X
```

Write actions on X require XS-09 review + separate per-post GO.
They are not included in the read-only integration plan.

---

## Query Design Principles

```
query_type:         topic-based, not account-based
scope:              public posts only
sensitive_queries:  HOLD — no queries about private individuals
query_frequency:    manual-trigger first; scheduled only after XS-08 pass
result_storage:     draft-only; no raw API response stored in cleartext logs
redaction:          usernames / account IDs may be redacted if sensitive
```

---

## Draft Outbox Integration Design

When x_search result is processed:

```
1. Hermes runs x_search query (after XS-03 GO)
2. Result is summarized by Grok conversation
3. Summary is formatted as Draft Outbox item (draft_only state)
4. Human reviews in Shikishima Draft Outbox
5. Human copies/approves or discards
6. No automatic send
```

Draft item metadata:
```
draftState:  draft_only
category:    social_awareness_digest
contentSafe: summarized text (no raw API identifiers unless safe)
action:      copy_only — no send button
```

---

## Scheduled Digest (XS-08 only)

Manual-trigger first (XS-03 through XS-07).
Scheduled digest is a Stage 8 feature:

```
trigger:      human sets schedule (e.g., "daily 9am digest")
frequency:    defined and bounded (not open-ended polling)
STOP if:      unexpected external write occurs during scheduled run
approval:     scheduled pattern requires separate XS-08 GO
```

---

## What x_search Will NOT Do

```
- post to X (autonomous or otherwise without explicit per-post GO)
- reply to X posts
- DM any account
- follow/unfollow accounts
- bio / profile changes
- access private/protected accounts
- access DM history
- expose raw account identifiers in logs/UI/chat without safe review
```

---

## STOP Conditions

```
STOP if:
  - x_search is enabled without explicit XS-02 GO
  - x_search result contains raw sensitive user data (name, DM, email)
  - x_search result is forwarded to external service without human review
  - scheduled search begins without XS-08 GO
  - any write action on X is triggered
  - auth token is exposed in x_search result handling
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_

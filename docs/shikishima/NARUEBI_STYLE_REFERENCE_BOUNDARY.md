# Naruebi Style Reference Boundary

## Document Status

```
date:            2026-05-18
status:          docs-only reference boundary — design clarification only
decision:        HOLD on all adoption items
```

---

## Purpose

Define what Shikishima adopts from the Naruebi-style AI social presence pattern
and what it deliberately does NOT adopt.

Naruebi-style refers to AI agents that are socially active on X (Twitter),
bring awareness of current topics, have a characterful persona, and interact
with their audience. Shikishima takes inspiration from the observe/digest/draft
aspects while maintaining full human control over all external actions.

---

## What Shikishima Adopts (pending gate passage)

### Social Awareness

```
feature:  Observe what is happening on X — AI news, tech trends, community discussion
adopt:    yes (read-only; XS-01+ gates)
reason:   Keeps Shikishima contextually aware; improves conversation quality
boundary: read-only via x_search; no account interactions
```

### AI News Digest

```
feature:  Collect and summarize AI news, tech releases, notable discussions
adopt:    yes (draft-only; XS-05+ gates)
reason:   Useful reference for Shikishima conversation and human decision-making
boundary: output is a copyable draft in Draft Outbox; human decides what to use
```

### Trending Topic Awareness

```
feature:  Know what topics are trending in AI/tech space on X
adopt:    yes (read-only; XS-04+ gates)
reason:   Enables contextual conversation; Shikishima can reference current events
boundary: read result only; no autonomous sharing or engagement
```

### Characterful Conversation About Topics

```
feature:  Reference current events in Shikishima conversation with personality
adopt:    yes (conversation layer; GHG-05+ gates)
reason:   Makes Shikishima more engaging and contextually aware
boundary: conversation surface only; no external posting of the conversation
```

### Draft Generation for Topics

```
feature:  Generate draft summaries, observations, or suggestions about current topics
adopt:    yes (XS-05+ gates)
reason:   Human can use drafts as reference or copy for their own posts
boundary: draft_only in Outbox; human initiates any use; no autonomous send
```

### Daily Digest (Human-Triggered)

```
feature:  Manually-triggered daily awareness digest
adopt:    yes (XS-05+ gates)
reason:   Useful for morning briefing-style awareness; human controls trigger
boundary: human triggers; output is copyable draft only
```

---

## What Shikishima Does NOT Adopt

### Autonomous X Posting

```
feature:      Post to X without per-post human GO
adopt:        REJECT
reason:       Public posting requires human judgment; no autonomous publish
              even a "draft posted automatically" pattern is REJECT
              automated persona maintenance posts are REJECT
```

### Autonomous Replies

```
feature:      Reply to X posts automatically
adopt:        REJECT
reason:       Replies represent Shikishima (or the user's) public voice
              Must be human-written or human-reviewed before posting
              No auto-reply to mentions, threads, or quotes
```

### DM Sending

```
feature:      Send DMs to X accounts
adopt:        REJECT
reason:       Private communication is explicitly human-only
              No automated DM under any circumstance
```

### Bio / Profile Auto-Update

```
feature:      Update X profile or bio based on Shikishima state
adopt:        REJECT
reason:       Profile is user identity; no automation
```

### Autonomous Ordering / Reservation

```
feature:      Order food, book hotels, schedule appointments
adopt:        REJECT
reason:       Financial and logistical decisions are human-only
              Naruebi-style "I ordered ramen" is REJECT for Shikishima
```

### Autonomous Payment

```
feature:      Make purchases, subscription renewals, in-app purchases
adopt:        REJECT
reason:       No autonomous financial action ever
```

### Autonomous External Account Operation

```
feature:      Log in to accounts, change settings, post on behalf of user
adopt:        REJECT
reason:       Account access is user-only; Shikishima never controls external accounts
```

### X API Token / Balance Display

```
feature:      Show X API rate limit or token balance in UI
adopt:        HOLD (not current priority; not a REJECT)
reason:       Potentially useful for quota management; requires auth boundary review first
              Not adopted in read-only x_search phase
```

---

## Shikishima Social Presence Model

```
Shikishima is:
  - An observer and summarizer of X content
  - A draft generator for human use
  - A conversation partner with current context awareness
  - Never an autonomous social media actor

Shikishima is NOT:
  - An automated X bot
  - A social media manager
  - An autonomous poster, replier, or DM sender
  - A financial or logistical agent
```

---

## Summary Table

| Pattern | Naruebi does | Shikishima adopts | Status |
|---|---|---|---|
| X trend awareness | yes | yes | HOLD (XS-04+) |
| AI news digest | yes | yes | HOLD (XS-05+) |
| Characterful conversation | yes | yes | HOLD (GHG-05+) |
| Draft generation | yes | yes | HOLD (XS-05+) |
| Daily digest | yes | yes, human-triggered | HOLD (XS-05+) |
| Autonomous posting | yes | NO | REJECT |
| Autonomous replies | yes | NO | REJECT |
| DM sending | yes | NO | REJECT |
| Auto-ordering | sometimes | NO | REJECT |
| Auto-reservation | sometimes | NO | REJECT |
| Auto-payment | no | NO | REJECT |

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_

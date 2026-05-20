# XACC-03 Draft-Only Post Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — Level 1-4 candidate, requires XACC-02 first
**gate:** no X write; activated after XACC-02 PASS

---

## Summary

Shikishima generates post/reply draft text locally.
No X write occurs. Draft is local only.
XACC-03 is a Level 1-4 operation.

---

## Allowed

- generate post draft based on XACC-02 read results
- generate reply draft for a specific post
- summarize intent of the draft
- classify draft content (GO / HOLD / DEFER / flag for human review)
- flag Level 5 content (anything that could trigger replies, controversy, or engagement loops)
- prepare handoff record for human review

---

## Forbidden

- send draft to X automatically
- post, reply, or DM without XACC-04 GO
- like, retweet, follow, or any account interaction
- expose token or raw account data in draft
- include personally identifiable information of third parties without clear attribution
- enable productionReady
- enable execution

---

## Draft Format

Every XACC-03 draft must include:

```text
xacc03_draft:
  context_summary:
    (brief summary of the read content that inspired the draft)
  draft_post_or_reply:
    (plain text, 280 chars or under for post)
  intent_classification:
    (informational / response / promotional / other)
  level5_detection:
    (none / detected — describe)
  human_review_required:
    (list of items that need human sign-off)
  forbidden_actions_detected:
    (none / detected — describe)
  next_gate:
    (XACC-04 write GO, or HOLD)
```

---

## Content Policy

Drafts must not:
- contain unverified factual claims
- contain personal attacks
- contain content that could trigger engagement manipulation
- reference third-party private information
- promise an action that requires Level 5 without flagging it

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
x_write:            none
draft_local_only:   true
post_sent:          false
reply_sent:         false
```

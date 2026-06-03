# XACC-02 Read-Only Execution Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — XACC-02 read-only GO required
**gate:** explicit xacc_read_go required, XACC-01 PASS first

---

## Summary

HOLD until explicit xacc_read_go.

One controlled read-only execution: search, read, summarize, evidence.
No X write. No post/reply/DM/like/follow.
Requires XACC-01 (auth scope setup) to be PASS first.

---

## Allowed

- search public posts (using approved query)
- read post content and user info
- summarize findings
- record evidence (without token or raw credentials)
- classify relevance to Shikishima operation

---

## Forbidden

- post
- reply
- DM
- like / retweet / bookmark
- follow / unfollow
- edit or delete posts
- account profile mutation
- access private posts without authorization
- autonomous repeated polling (run_count > 1 without new GO)
- expose token in output, logs, or docs
- enable productionReady
- enable execution

---

## Required GO Fields

```text
xacc_read_go:
  date:
  time_window_jst:
  account_type:        (sub-account or main)
  query_scope:         (exact query or topic)
  source_scope:        (timeline / search / specific user)
  read_only_confirmation: true
  output_format:       summary only, no raw IDs or tokens
  attribution_policy:  public sources only
  allowed_run_count:   1
  stop_if:
  evidence_file:
```

---

## Output Format

Evidence must include:

```text
xacc02_result:
  query_executed:       (sanitized, no raw IDs)
  findings_summary:     (plain text)
  relevance_to_shikishima: (GO / HOLD / note)
  read_only_confirmed:  true
  write_actions:        none
  token_exposed:        false
  rate_limit_hit:       false
  evidence_file:
  next_gate:            XACC-03 or HOLD
```

---

## Rate Limit Handling

```text
before_each_call:   check current rate limit status
on_429:             STOP — do not retry without human GO
on_unexpected_error: STOP and report
polling_loop:       forbidden
```

---

## STOP Conditions

STOP if:

- 429 rate limit hit (do not retry)
- token appears in any output or log
- write action is triggered
- account mutation appears
- private data appears unexpectedly
- source attribution is unclear
- repeated polling starts
- productionReady true appears
- execution enabled appears

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
write_actions:      none
run_count_max:      1
xacc_read_go:       not issued
```

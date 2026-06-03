# DIS-02 Discord Draft Response Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — Level 1-4 candidate, requires DIS-01 first
**gate:** no Discord write; activated after DIS-01 PASS

---

## Summary

Shikishima prepares reply drafts based on Discord instructions.
No Discord write occurs. Draft is local only.
DIS-02 is a Level 1-4 operation.

---

## Allowed

- parse and summarize user request from DIS-01 intake
- classify request as GO / HOLD / DEFER
- detect Level 5 actions in the request
- prepare reply draft text (local only)
- prepare ClaudeCode or Codex task prompt
- create handoff record
- create evidence entry

---

## Forbidden

- send draft to Discord automatically
- send draft without DIS-03 GO
- edit any Discord message
- react to any Discord message
- DM any user
- mention @everyone or @here
- external API write of any kind
- enable productionReady
- enable execution

---

## Output Format

Every DIS-02 draft must include:

```text
dis02_draft:
  user_request_summary:
    (plain text, no raw IDs or tokens)
  shikishima_response_draft:
    (plain text, approved content only)
  go_hold_defer_classification:
    (GO / HOLD / DEFER)
  level5_detection:
    (none / detected — describe)
  required_human_confirmation:
    (list)
  forbidden_actions_detected:
    (none / detected — describe)
  evidence_path:
    (if needed)
  next_gate:
    (DIS-03 reply GO, or HOLD, or other)
```

---

## Draft Safety Rules

- draft must not include token fragments
- draft must not include raw server/channel/user IDs unless explicitly needed
- draft must not promise an action that requires Level 5 without noting it
- draft must flag any detected Level 5 action
- draft must be reviewed by human before DIS-03

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
discord_write:      none
discord_reply:      none
draft_local_only:   true
```

# XS-AUTO-03 Evidence and Rate Limit Policy

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — policy document only

---

## Evidence Requirements

Every read-only run must record:

```text
xs_auto_run_record:
  run_id:
  watchlist_id:           (WI-XXX)
  query_executed:         (sanitized — no raw tokens, no PIIs)
  time_jst:
  run_count:              (e.g. 1 of 3)
  sources_read:           (count, not raw content)
  summary:                (plain text, public info only)
  shikishima_relevance:   (GO / HOLD / note)
  oauth_performed:        false
  write_actions:          none
  token_exposed:          false
  rate_limit_hit:         false/true
  gate_auto_close:        true/false (if max_run_count reached)
  next_run:               HOLD unless recurring GO exists
  evidence_file:
```

---

## Rate Limit Policy

```text
before_each_run:
  - check current rate limit status (from API headers)
  - if within limit: proceed
  - if near limit: HOLD until next window
  - if 429: STOP, mark COOLDOWN, record in evidence

on_429:
  - do not retry
  - do not switch accounts
  - do not use workarounds
  - mark watchlist item COOLDOWN
  - human decides when to resume

cooldown_resume:
  - human confirms cooldown has passed
  - human issues new GO or approves resumption
  - no auto-resume
```

---

## Gate Auto-Close Policy

```text
- when run_count reaches max_run_count, the gate auto-closes
- next run requires a new xs_read_go or xs_auto_read_go
- no auto-reopen
- HOLD is the default state after gate closes
```

---

## Evidence Safety Rules

```text
- evidence must not contain raw bearer tokens or credentials
- evidence must not contain raw API response with user PIIs
- evidence must not contain raw local IP addresses or private paths
- summary must be sanitized public info only
- evidence file must be committed (not left local-only unless gitignored)
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
x_search_executed:  false
evidence_policy:    defined (not yet applied)
```

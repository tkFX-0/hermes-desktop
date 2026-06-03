# XS-AUTO-02 Patrol Scheduler HOLD Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — scheduler design only, no execution
**gate:** xs_auto_schedule_go required before any scheduling

---

## Scheduler Status

```yaml
scheduler:          HOLD
recurring_patrol:   HOLD
background_polling: HOLD
```

---

## Allowed Future Scheduler Modes

| Mode | Status | Notes |
|---|---|---|
| manual one-shot | HOLD | explicit xs_read_go per run |
| daily read-only digest | HOLD | xs_auto_schedule_go required |
| weekly read-only digest | HOLD | xs_auto_schedule_go required |
| emergency topic watch | HOLD | separate GO required |

---

## Not Approved Now

```text
- always-on polling
- high-frequency polling (more than 1/hour)
- auto-write of any kind
- auto-reply
- auto-DM
- auto-follow or auto-like
- scheduler with no run limit
- scheduler with no human review checkpoint
```

---

## Required Future GO Fields

```text
xs_auto_schedule_go:
  date:
  schedule_type:     (daily / weekly / on-demand)
  watchlist_ids:     (exact WI-XXX IDs)
  run_count_max:     (integer)
  duration:          (e.g. 1 week)
  evidence_path:
  review_checkpoint: (human must review after N runs)
  stop_if:
  rollback_or_disable: (how to stop the scheduler)
```

---

## Rate Limit and Cooldown Handling

```text
rules:
  - check current rate limit before each scheduled run
  - on 429: mark COOLDOWN, stop, do not retry automatically
  - cooldown period: as per X API response headers
  - no account switching to bypass rate limits
  - no headless workarounds
  - human decides when to resume after cooldown
```

---

## Scheduler STOP Conditions

```text
STOP immediately if:
  - run count reaches max without review checkpoint
  - login/OAuth prompt appears
  - write action is triggered
  - account mutation appears
  - 429 rate limit hit
  - unexpected source appears
  - token appears in output
  - productionReady true appears
  - execution enabled appears
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
scheduler_started:  false
recurring_polling:  HOLD
xs_auto_schedule_go: not issued
```

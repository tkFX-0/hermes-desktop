# XS-AUTO-00 Read-only Automation Gate Design

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — docs only, no x_search, no scheduler, no OAuth
**gate:** HOLD — all XS-AUTO gates require explicit human GO

---

## Purpose

Let Shikishima manage future x_search/read-only patrol tasks safely.

Current status: HOLD. Design documentation only.

---

## Current State

```yaml
XS-01 read-only:         PASS / gate closed / 1 of 1 run consumed
next x_search:           HOLD — separate xs_read_go required
XS-AUTO scheduler:       HOLD
recurring patrol:        HOLD
X account connection:    HOLD (separate XACC gate)
OAuth:                   HOLD
```

---

## Allowed at This Stage

- design
- watchlist planning
- query policy
- run count planning
- evidence planning
- UI display-only status

---

## Forbidden (all phases unless separate GO)

- actual x_search execution
- continuous polling
- X account connection
- OAuth or login
- token usage
- posting / replying / DM / liking / following
- account mutation
- private/hidden content access
- rate limit bypass
- external write

---

## Core Rule

```text
読むだけでもGate管理。
書く・反応する・アカウントを動かす操作はLevel 5。

AIは作るところまで。
鍵と発射ボタンは人間。
```

---

## Required Phases

### XS-AUTO-00: Design only (this document)

```yaml
x_search:      not executed
scheduler:     not started
oauth:         not started
token:         none
```

### XS-AUTO-01: Watchlist definition

```yaml
purpose:       define approved search topics
execution:     none
gate:          design document
```

### XS-AUTO-02: Scheduler HOLD plan

```yaml
purpose:       design future scheduler structure
execution:     none
gate:          HOLD
```

### XS-AUTO-03: Human GO — one scheduled read-only run

```yaml
purpose:       one approved scheduled read-only execution
run_count:     fixed by GO
gate:          explicit xs_auto_read_go required
```

### XS-AUTO-04: Recurring patrol (future)

```yaml
purpose:       limited recurring read-only patrol
status:        HOLD
gate:          xs_auto_schedule_go required
```

### XS-AUTO-05: X account integration

```yaml
purpose:       user-owned X account connection
status:        HOLD — separate XACC gate
not_included:  in this task
```

---

## Gate Sequence

| Gate | Action | Level | Status |
|---|---|---|---|
| XS-AUTO-00 | Design | docs | DESIGN (this doc) |
| XS-AUTO-01 | Watchlist | docs | HOLD |
| XS-AUTO-02 | Scheduler plan | docs | HOLD |
| XS-AUTO-03 | One-shot scheduled run | 5-ish | HOLD |
| XS-AUTO-04 | Recurring patrol | 5 | HOLD |
| XS-AUTO-05 | X account (XACC) | separate | HOLD |

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
x_search_executed:  false
oauth_started:      false
scheduler_started:  false
```

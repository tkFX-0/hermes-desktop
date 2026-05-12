# Shikishima v9 One-Run-Only Checklist — v2.8.6

## Purpose

Confirms one-run-only policy for controlled pilot. Every item must be true before and after each run.

- documentVersion: v2.8.6 / decision: HOLD

---

## Before Run (required; cannot skip)

- [ ] G-23 issued for THIS specific run (not a previous run)
- [ ] Pilot scenario name matches G-23 statement
- [ ] Duration limit set and agreed
- [ ] Human monitor present and confirmed
- [ ] Stop conditions reviewed by human monitor
- [ ] Rollback procedure available (V9_PILOT_STOP_AND_ROLLBACK_CARD.md printed or open)

---

## During Run

- [ ] Human monitor watching actively throughout
- [ ] No automated repeat scheduled
- [ ] No background process will re-trigger pilot
- [ ] Stop conditions monitored

---

## After Run

- [ ] Pilot process terminated (confirmed)
- [ ] No persistent pilot state remains
- [ ] Output captured (redacted before viewing)
- [ ] Result documented in pilot result template
- [ ] Decision: new G-23 needed for next run?

---

## Auto-Repeat Prohibition

The following are NEVER allowed:

| Forbidden | Reason |
|---|---|
| `setInterval` triggering pilot restart | Auto-repeat |
| Cron job calling pilot | Unsupervised |
| Retry-on-failure for pilot | No automatic retry |
| Pilot triggered by Hermes response | No autonomous trigger |
| Any next run without new G-23 | One-run-only policy |

この範囲では問題を検出していません。

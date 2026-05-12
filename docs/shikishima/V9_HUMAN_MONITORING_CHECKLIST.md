# Shikishima v9 Human Monitoring Checklist — v2.8.6

## Purpose

What the human monitor must do during and after a controlled pilot run.

- documentVersion: v2.8.6 / decision: HOLD

---

## Before Accepting Monitor Role

- [ ] Read V9_CONTROLLED_PILOT_RUNBOOK.md fully
- [ ] Read V9_PILOT_STOP_AND_ROLLBACK_CARD.md
- [ ] Know the stop conditions for THIS run
- [ ] Know how to terminate the process (keyboard shortcut or terminal kill)
- [ ] Available for the full duration of the run

---

## During Pilot Run

Every 30 seconds, confirm:
- [ ] Process is still running as expected
- [ ] No external network activity unexpected
- [ ] No unexpected UI behavior
- [ ] No raw path visible in output
- [ ] No device (StackChan) behaving unexpectedly

At any anomaly → **STOP IMMEDIATELY** (see stop card)

---

## After Pilot Run

- [ ] Confirm process terminated
- [ ] Review captured output (redact before reading)
- [ ] Note: actual vs expected output match
- [ ] Record result in pilot result template
- [ ] Confirm: no state persisted unexpectedly
- [ ] Decision: is another run warranted? → requires new G-23

---

## Human Monitor Role: What It Means

| Monitor must | Monitor must NOT |
|---|---|
| Watch actively | Step away or be distracted |
| Stop on any anomaly | Ignore anomaly and continue |
| Redact output before reporting | Report raw values |
| Confirm run is human-supervised | Declare it autonomous |
| Issue new G-23 for next run | Approve automatic retry |

この範囲では問題を検出していません。

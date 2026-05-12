# Shikishima v9 Pilot Stop and Rollback Card — v2.8.6

## Purpose

Quick reference card for stopping and rolling back a controlled pilot run.
Keep this document open during any pilot run.

- documentVersion: v2.8.6 / decision: HOLD

---

## STOP IMMEDIATELY If:

| Condition | What to do |
|---|---|
| Raw path or secret in output | STOP → redact → report P0 |
| External network activity | STOP → disconnect → report P0 |
| StackChan moves unexpectedly | STOP → disconnect → report P0 |
| Audio plays unexpectedly | STOP → mute system → report P0 |
| Human says "stop" | STOP immediately, no argument |
| Output deviates from expected | STOP → investigate → P1 |
| Duration exceeded | STOP → report timeout |
| Any doubt | STOP → ask human |

---

## How to Stop

**Terminal (Ctrl+C or kill):**
```
Ctrl+C in terminal where process is running
# or:
taskkill /PID [pid] /F   (Windows)
kill -9 [pid]            (Linux/WSL)
```

**WSL shutdown (if WSL involved):**
```
wsl --shutdown
```

**StackChan disconnect:**
- Physical: pull USB cable
- Wi-Fi: disable network adapter

---

## After Stopping

1. Confirm process is not running
2. Review output (REDACT before reading or sharing)
3. Classify incident: P0 / P1 / P2
4. Report: "[severity] incident. [category]. Process stopped. Output redacted."
5. Do NOT restart without new G-23 (P0) or human confirmation (P1)

---

## Rollback Levels

| Incident | Rollback to |
|---|---|
| P0 (raw value / external network / unexpected motion) | Level 0–6 as appropriate; new full review |
| P1 (output deviation) | Level 7 or 8; investigate; fix; new G-23 |
| P2 (minor deviation) | Same level; document; new G-23 for next run |

この範囲では問題を検出していません。

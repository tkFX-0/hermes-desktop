# StackChan Display Pilot Retry GO Draft

Date: 2026-05-28
Status: **DRAFT — NOT ACTIVE GO**

Companion: `STACKCHAN_DISPLAY_PILOT_FINAL_GO_DRAFT.md`, `STACKCHAN_DISPLAY_ROUTE_DESIGN.md`

---

## Placeholder Macro

```text
/goalmacro shikishima.stackchan-display-pilot-retry
```

---

## Human GO Placeholder

```text
I approve one StackChan display-only pilot retry.

Approved time window:
START: YYYY-MM-DD HH:MM JST
END: YYYY-MM-DD HH:MM JST

This authorizes exactly one display-only pilot attempt within the window.
```

---

## Preconditions (All Required)

```text
/goalmacro shikishima.stackchan-display-route-implementation: ROUTE_GUARD_IMPLEMENTED (pure shared)
Device wiring design + guarded main adapter: PASS (separate GOs)
evaluateStackChanDisplayRoute returns READY_FOR_FUTURE_SEND in preflight
display route device adapter exists and is guard-wired (future)
branch clean; origin/main aligned (or STOP)
human_present: true
manual_stop_method_confirmed: true
StackChan screen visible: true
one display intent selected (from allowlist)
productionReady: false
execution: disabled
```

---

## Allowed (Retry Only)

```text
single StackChanDisplayIntent (e.g. STACKCHAN_BASELINE_PASS)
guarded one-shot display route adapter send
human visual confirmation
redacted evidence update
verification tests
local docs commit
```

---

## Forbidden (Retry)

```text
motion / dance / touch behavior change
firmware write / erase / serial flash
voice / mic / camera
autonomous control
Discord send / token read / external API write
repeated attempts outside time window
unguarded stackchanFaceLocal
productionReady true / execution enabled
git push (unless separate push GO)
```

---

## Selected Intent (Default)

```text
STACKCHAN_BASELINE_PASS
```

Alternates if not feasible: `HOLD`, `WAITING_FOR_HUMAN`, `SAFETY_READINESS_PREPARED`

Must not use intents that imply active control approved.

---

## Evidence

Update or append:

```text
docs/shikishima/STACKCHAN_DISPLAY_PILOT_EVIDENCE.md
```

Record retry section with redacted enums only.

---

## Outcomes

| Result | Next |
|--------|------|
| PASS | Display Pilot Acceptance + push GO |
| PASS_WITH_CAVEAT | Human review; optional second GO |
| HOLD | Stop; no device send |
| STOP | Halt StackChan pilot work; incident review |

---

## This Draft Does Not Approve

```text
route implementation (prior GO)
Active Control
connection command for ongoing autonomy
```

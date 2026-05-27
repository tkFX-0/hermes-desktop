# StackChan Phase 0 Readiness Prep

Date: 2026-05-27
Baseline: `origin/main` = `9c1a228` (Final Core Acceptance pushed)

---

## Result

```text
status: PREPARED_ONLY
```

---

## Purpose

Prepare the StackChan phase after Final Shikishima Core Acceptance (Rally 9).

This document does **not** connect to StackChan hardware or software. It defines boundaries and next rallies only.

---

## Current Boundary

```text
StackChan: available for future observation only
StackChan control: HOLD
Shikishima → StackChan command execution: NOT_APPROVED
Final Core 100: ACCEPTED (guarded scope; Rally 9)
```

---

## Allowed Future First Observation

The first StackChan task (Rally 10: Baseline Observation) should **only observe**:

- power state
- app / browser / official UI availability
- Wi-Fi state (redacted in evidence)
- screen visible
- current face / display state
- whether existing custom firmware is active (redacted detail)
- whether motion/dance behavior is available or missing
- whether touch/pet behavior exists
- whether any error is visible (no raw paths or secrets)

---

## Forbidden In Phase 0

```text
- firmware write / erase
- serial flash / bootloader
- motor / motion / dance test commands
- voice activation / TTS test
- microphone activation
- camera activation
- autonomous Shikishima control of StackChan
- external network call (beyond read-only human observation context)
- Discord send
- productionReady true
- execution enabled
- Cursor Automations as direct executor
```

---

## Related Prep Documents

| File | Role |
|------|------|
| `STACKCHAN_BASELINE_OBSERVATION_GO_DRAFT.md` | Future GO template (not active GO) |
| `STACKCHAN_SAFETY_BOUNDARY.md` | Default HOLD and escalation rules |
| `STACKCHAN_BASELINE_OBSERVATION_EVIDENCE_TEMPLATE.md` | Evidence form for Rally 10 |
| `FINAL_CORE_TO_STACKCHAN_HANDOFF.md` | Core → StackChan transition rules |

---

## Next Phase Roadmap

```text
Rally 10: StackChan Baseline Observation (read-only; human present)
Rally 11: StackChan Safety Readiness (gates before any active control)
Rally 12+: StackChan Display / Face / controlled pilot (separate GO each)
```

---

## Safety Invariants (unchanged)

```text
productionReady: false
execution: disabled
Discord send: HOLD_PENDING_LOCAL_CREDENTIALS
StackChan active control: HOLD
rawValuesReported: false
```

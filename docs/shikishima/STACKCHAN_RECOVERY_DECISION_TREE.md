# StackChan Recovery Decision Tree

Date: 2026-05-28
Applies after Rally 10 HOLD + Rally 10.5 forensics prep

**No branch authorizes firmware write, flash, or motion without a separate explicit Human GO.**

---

## State A: Screen visible and face/display works

```text
Next:
- Baseline Observation Retry (read-only)
- StackChan Safety Readiness (Rally 11)
- Future: display-only Shikishima status preview (separate GO)
```

---

## State B: Screen visible but behavior missing

```text
Symptoms: face OK; dance/touch/pet not observed
Next:
- Record behavior gap in baseline evidence
- Review SC_MOTION_* / SC_FW_* historical docs (design reference)
- Prepare firmware **behavior audit** GO draft if needed
- Do not flash yet
```

---

## State C: Wi-Fi connected but no visible UI

```text
Symptoms: network up; no confirmable screen state
Next:
- Record HOLD with redacted Wi-Fi state only
- Try alternate observation: power cycle visual check, official app on phone (read-only)
- Do not send StackChan commands from Shikishima without GO
```

---

## State D: Screen blank / boot issue

```text
Symptoms: no visible display; device may be powered
Next:
- Record HOLD
- Review SC_RESTORE_01_FACTORY_RESTORE_ROLLBACK_PLAN.md (planning only)
- Create firmware recovery GO draft — **no execution in this tree**
- Human present + short window required for any future flash GO
```

---

## State E: Firmware recovery required

```text
Prerequisites before any recovery GO:
- manual rollback plan acknowledged (SC_RESTORE_01)
- known-good firmware source identified (redacted name only in new evidence)
- factory vs custom state documented
- separate Human GO: firmware write/flash (not baseline observation)
- productionReady remains false; execution remains disabled
```

---

## Default (current Rally 10)

```text
State: between C and D (observation incomplete)
Action: Rally 10.5 forensics complete → human checklist → baseline retry
StackChan control: HOLD
```

---

## Escalation Blocked Without

```text
- baseline observation PASS
- safety readiness PASS
- rollback method
- manual stop method
- command allowlist
- evidence template
```

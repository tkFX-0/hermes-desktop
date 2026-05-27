# StackChan Baseline Observation — GO Draft (NOT ACTIVE)

Date: 2026-05-27

---

## Important

```text
This file is a DRAFT template only.
It is NOT Human GO.
It does NOT authorize any StackChan connection or operation.
Copy and complete a separate GO when the human is ready for Rally 10.
```

---

# /goalmacro shikishima.stackchan-baseline-observation

## Human GO Placeholder

```text
I approve one read-only StackChan baseline observation.

This GO does not authorize:
- firmware write or erase
- serial flash / bootloader
- motor / motion / dance test
- voice output test
- microphone activation
- camera activation
- autonomous Shikishima control of StackChan
- Shikishima-to-StackChan command execution
- external API write
- Discord send
- productionReady true
- execution enabled
```

---

## Observation Checklist

```text
- StackChan power state
- screen visible
- current displayed face / state
- official app reachable or not
- Wi-Fi connected or not (redacted in evidence)
- firmware state (redacted in evidence)
- custom firmware suspected / confirmed / unknown
- dance / motion available or missing (observe only)
- pet / touch behavior available or missing (observe only)
- error visible or not (no raw paths)
- motion command sent: false
- firmware write: false
- voice / mic / camera: not activated
- external API write: false
- productionReady unchanged (false)
- execution unchanged (disabled)
```

---

## Evidence Required

Use `STACKCHAN_BASELINE_OBSERVATION_EVIDENCE_TEMPLATE.md` and record:

```text
- observation time
- human_present: true
- human-visible state summary
- photos / screenshots: optional, redacted
- safety boundary confirmation
- result: PASS | PASS_WITH_CAVEAT | HOLD | STOP
```

---

## STOP Conditions

Stop immediately if:

```text
- motion or firmware action becomes necessary to proceed
- raw secrets, tokens, or local paths would be recorded
- autonomous control is requested
- productionReady true or execution enabled is requested
```

---

## Next After PASS

```text
/goalmacro shikishima.stackchan-safety-readiness
```

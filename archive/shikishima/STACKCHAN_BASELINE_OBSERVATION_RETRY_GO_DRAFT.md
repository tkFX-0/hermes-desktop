# StackChan Baseline Observation Retry — GO Draft (NOT ACTIVE)

Date: 2026-05-28

---

## Important

```text
This file is a DRAFT template only.
It is NOT Human GO.
Complete STACKCHAN_CUSTOM_FIRMWARE_CHECKLIST.md first when possible.
```

---

# /goalmacro shikishima.stackchan-baseline-observation-retry

## Human GO Placeholder

```text
I approve one read-only StackChan baseline observation retry.

This GO allows only human visual observation.

This GO does not authorize:
- firmware write or erase
- serial flash / bootloader
- motion or dance command
- voice / mic / camera activation
- autonomous Shikishima control of StackChan
- Shikishima-to-StackChan command execution
- external API write
- Discord send
- productionReady true
- execution enabled
```

---

## Required Human-Visible Preconditions

```text
- device is powered on
- screen is visible (or blank/frozen state explicitly recorded)
- human can describe current display state
- no Wi-Fi SSID/password will be recorded
- no IP address will be recorded
- no COM/serial identifiers will be recorded
```

---

## Observation Result Options

```text
PASS: screen + display/face state confirmed read-only
PASS_WITH_CAVEAT: partial visual state confirmed
HOLD: normal observation still unavailable
STOP: unsafe state or secret-bearing display
```

---

## Evidence Output

```text
Update or supersede: STACKCHAN_BASELINE_OBSERVATION_EVIDENCE.md
Use template: STACKCHAN_BASELINE_OBSERVATION_EVIDENCE_TEMPLATE.md
```

---

## Next After PASS

```text
/goalmacro shikishima.stackchan-safety-readiness
```

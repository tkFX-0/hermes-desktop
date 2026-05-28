# StackChan Stop Conditions

Date: 2026-05-28
Applies to all StackChan work after Safety Readiness (Rally 11)

Stop immediately and record HOLD or STOP in evidence if any of the following occur.

---

## Secrets and Redaction

```text
- raw Wi-Fi SSID or password would be recorded
- IP address would be recorded
- MAC address or device ID would be recorded
- token or private URL would be recorded
- local private path with secrets would be recorded
```

Action: `raw_value_found: true`, `raw_value_recorded: false`, document `redacted_category` only.

---

## Device Operations (without explicit GO)

```text
- firmware write becomes necessary
- firmware erase becomes necessary
- serial flash becomes necessary
- motion command becomes necessary
- dance command becomes necessary
- touch behavior change becomes necessary
- voice / mic / camera activation becomes necessary
```

---

## Safety and Ambiguity

```text
- device becomes hot or physically unsafe
- screen shows unknown unsafe error (record summary only, no raw dump)
- StackChan unresponsive during future pilot
- command path is ambiguous
- rollback path is unclear
- Shikishima would need autonomous control loop
```

---

## Project Invariants

```text
- productionReady true would be required
- execution enabled would be required
- Discord send or token read would be required
- external API write would be required
- network call beyond git push would be required
```

---

## After STOP

```text
Do not proceed to next gate.
Document in evidence MD.
Require new Human GO with narrowed scope.
```

# StackChan Custom Firmware Checklist

Date: 2026-05-28
Use: human read-only session before Baseline Observation Retry

---

## Read-only Human Checks

- [ ] Power is ON
- [ ] Screen is visible
- [ ] Face/display appears
- [ ] Screen is blank
- [ ] Screen is frozen
- [ ] Device appears connected to Wi-Fi (record only: connected / disconnected / unknown)
- [ ] Official app / UI is reachable (no commands sent)
- [ ] Custom firmware is suspected
- [ ] Custom firmware is confirmed
- [ ] Dance/motion behavior is visible **without sending command**
- [ ] Touch/pet behavior is visible **without sending command**
- [ ] Error message is visible (summary only; no raw paths or secrets)

---

## Record In Evidence (redacted)

```text
Wi-Fi: connected | disconnected | unknown
firmware: factory | custom_suspected | custom_confirmed | unknown
result: PASS | PASS_WITH_CAVEAT | HOLD | STOP
```

**Never record:** SSID, password, IP address, COM port, MAC, tokens.

---

## Do Not Do

- [ ] Do not flash firmware
- [ ] Do not erase firmware
- [ ] Do not send motion command
- [ ] Do not send dance command
- [ ] Do not enable voice
- [ ] Do not enable mic
- [ ] Do not enable camera
- [ ] Do not expose Wi-Fi SSID/password
- [ ] Do not expose IP address
- [ ] Do not run Shikishima StackChan automation without explicit GO

---

## After Checklist

```text
PASS or PASS_WITH_CAVEAT → Baseline Observation Retry → Safety Readiness
HOLD → update evidence; remain on forensics/recovery planning track
STOP → document unsafe state; no device commands
```

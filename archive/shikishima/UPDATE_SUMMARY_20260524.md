# Shikishima Update Summary 2026-05-24

## Purpose

Record the StackChan / Shikishima firmware and control-path update state without exposing local credentials, raw tokens, raw device identifiers, or local-only network values.

## Confirmed Updates

### Wi-Fi correction

- Issue: SSID casing mismatch caused a `NO_AP_FOUND` connection failure.
- Fix: SSID spelling/case was corrected in the local firmware credentials.
- Result: Wi-Fi connection succeeded.
- Credential values: redacted.

### Local credentials file

- `credentials.h` was created locally and remains gitignored.
- It contains Wi-Fi and control-token values for local firmware flashing only.
- Raw Wi-Fi password and raw control token must not be committed.

### Control token loading

- Issue: Electron-launched StackChan bridge did not always inherit the expected control-token environment value.
- Fix direction: local runtime reads the token from a local environment file when needed.
- Raw token reporting: false.

### SC-FW-11 firmware flash

- Result: PASS candidate.
- Firmware flash completed on 2026-05-24 JST.
- Hash verification completed.
- Additional Burn after this record: false.
- Erase performed after this record: false.
- Firmware Exporter Start performed after this record: false.

### LED control

- LED protocol command path was restored at the firmware/control level.
- `M5.Power.setLed()` fallback was added for the device LED path.
- Note: External LED visibility may depend on USB power state and hardware wiring.

### Servo investigation

- Root cause found: the prior implementation used a PWM-style route, while the connected StackChan servo path requires Feetech SCS serial control.
- Correct route:
  - Protocol: Feetech SCS UART
  - TX/RX GPIO values: recorded in source docs, no raw secrets involved
  - Baud rate: 1 Mbps
- Firmware was updated to the SCS serial route and flashed.
- Physical motion confirmation remains deferred until human visual check.

## Current State

| Item | State |
| --- | --- |
| Wi-Fi connection | PASS candidate |
| Control token flow | PASS candidate |
| LED command path | PASS candidate |
| SCS servo firmware | flashed |
| Physical servo motion | visual check deferred |
| StackChan auto-control | HOLD |
| Motion / dance automation | HOLD |
| Camera / mic / voice loop | HOLD |
| productionReady | false |
| execution | disabled |
| rawValuesReported | false |

## Deferred Human Checks

1. Reboot the device when physically available.
2. Confirm startup motion visually.
3. Confirm the dance route only under a separate explicit GO.
4. Confirm LED visibility in the expected power state.
5. Record evidence without raw tokens, raw Wi-Fi values, or device-specific secrets.

## Safety Boundary

- No raw Wi-Fi password is recorded here.
- No raw StackChan control token is recorded here.
- No raw local IP is recorded here.
- No autonomous physical operation is approved by this summary.
- No production or execution gate is enabled by this summary.

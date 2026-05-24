# SC-Codex Handoff 2026-05-24

## Purpose

This document records the current StackChan firmware/control status after the ClaudeCode update work and prepares the next Codex-safe handoff.

This is a handoff and evidence summary only.

## Current Confirmed State

| Area | Status | Notes |
|---|---|---|
| WiFi connection | PASS | SSID case correction completed. Raw password is not recorded here. |
| Control token flow | PASS | Runtime control reads local values from `.env.local`; raw token is not recorded here. |
| SC-FW-10A PlatformIO toolchain | PASS | PlatformIO is available for compile-only build. |
| SC-FW-10 compile-only build | PASS | `cores3_noflash` compile-only build passed before flash work. |
| SC-FW-11 firmware flash | PASS | ClaudeCode report: COM5 flash completed and hash verified. |
| SC-LED-01 LED protocol | PASS_CANDIDATE | Commands are accepted. Physical visibility depends on USB charging state. |
| SC-DANCE-01 dance command intake | PARTIAL | Command intake confirmed, but physical servo movement required root-cause work. |
| Servo firmware | SCS version flashed | PWM implementation was replaced by Feetech SCS serial bus control. |
| Servo physical movement | WAITING_HUMAN_OBSERVATION | Startup movement and `!sc dance` physical result still need human observation. |

## Firmware Source State

The PlatformIO source and top-level Arduino sketch are synced to the SCS servo implementation.

| File | Role |
|---|---|
| `docs/firmware/shikishima_cores3/src/shikishima_cores3.ino` | PlatformIO build source |
| `docs/firmware/shikishima_cores3/shikishima_cores3.ino` | Top-level sketch copy, synced with `src/` |
| `docs/firmware/shikishima_cores3/credentials.h` | Local-only credentials file, ignored by git |
| `docs/firmware/shikishima_cores3/credentials.h.example` | Shareable credentials template |

Current SCS settings recorded in firmware:

```text
servo_protocol: Feetech SCS serial bus
servo_model_reported: SCS0009
uart: UART1
tx_gpio: 6
rx_gpio: 7
baud: 1000000
pan_id: 1
tilt_id: 2
```

## Root Cause Summary

The previous servo implementation used LEDC PWM, but the reported StackChan servo is a Feetech SCS0009 feedback servo.

```text
incorrect_route:
  protocol: LEDC PWM 50Hz
  gpio: G8 / G9
  expected_effect: no physical movement

correct_route:
  protocol: Feetech SCS serial bus UART
  gpio: TX=GPIO6 / RX=GPIO7
  baud: 1Mbps
```

The SCS firmware has been flashed, but the physical motion result remains unconfirmed until the user observes the device.

## Next Human Test

Run this only when the user is present and can watch the device.

```text
1. Power-cycle or reboot StackChan.
2. Observe the automatic startup servo test.
3. PASS condition:
   - pan moves right
   - pan moves left
   - pan returns center
   - tilt moves up
   - tilt moves down
   - tilt returns center
4. If startup movement passes, run exactly one dance test:
   !sc dance
5. Record result in SC_DANCE_01_EVIDENCE.
```

## STOP Conditions

Stop the physical test if any of these occur:

```text
unexpected repeated motion
servo stall
violent or unsafe motion
no motion after SCS startup test
WiFi/control token failure
firmware requests another write
camera/mic/voice activates unexpectedly
```

## If Servo Still Does Not Move

Do not flash again automatically. Prepare a separate GO before changing firmware.

Recommended diagnosis order:

```text
1. Verify servo cable and power path.
2. Try swapped servo IDs:
   pan_id: 2
   tilt_id: 1
3. Check whether Port C UART pins are needed:
   tx_gpio: 17
   rx_gpio: 18
4. Try SCS baud fallback:
   baud: 500000
5. Confirm whether the unit uses a different servo bus or adapter revision.
```

## Safety Boundary

This handoff does not approve:

```text
additional firmware flash
Burn
Erase
Firmware Exporter Start
StackChan autonomous control
motion loop
dance loop
camera monitoring
microphone always-on
voice loop
external API write
productionReady true
execution enabled
git push
```

Required safe state:

```text
productionReady: false
execution: disabled
rawValuesReported: false
raw_secrets_recorded_in_docs: false
```

## Push / Commit Note

The working tree contains unrelated Shikishima core changes from other work. This document should not be pushed alone without a separate scope review.

Recommended next review:

```text
SC handoff docs + firmware source scope review
confirm no raw credentials are staged
confirm credentials.h remains ignored
confirm .pio remains ignored
confirm no extra flash/device operation happened
```

# SC-FW-11 Firmware Flash Evidence

status: NOT_STARTED
date: (fill on execution)
prerequisite: SC-FW-10 compile-only build PASS

---

## Pre-execution Record

```
date: 2026-05-24
time_window_jst: 02:00 JST
target_device: M5Stack CoreS3 (ESP32-S3)
target_port: redacted COM port
firmware_build_reference: SC-FW-10 PASS / 2026-05-24 01:41 JST
flash_tool: PlatformIO esptool
exact_flash_command: [temp-build-dir] + platformio upload using a redacted COM port
rollback_reference: SC_RESTORE_01_FACTORY_RESTORE_ROLLBACK_PLAN.md
CONTROL_TOKEN_checked: n/a (token stored in device EEPROM from prior session)
```

---

## Flash Execution Log

```
flash_started_at: 2026-05-24 02:00 JST
flash_completed_at: 2026-05-24 02:01 JST (83.37 seconds)
chip: ESP32-S3 (QFN56) revision v0.2
mac: redacted
crystal: 40MHz
usb_mode: USB-Serial/JTAG
upload_speed: 1500000 baud (changed to during flash)

flash_regions_written:
  - 0x00000000: bootloader.bin  15104 bytes  hash: VERIFIED
  - 0x00008000: partitions.bin   3072 bytes  hash: VERIFIED
  - 0x0000e000: boot_app0.bin    8192 bytes  hash: VERIFIED
  - 0x00010000: firmware.bin  1368128 bytes  hash: VERIFIED

post_reset: Hard resetting via RTS pin — executed
errors_during_flash: none
esptool_exit: SUCCESS
```

---

## Post-flash Verification

```
firmware_booted: (confirm physically — device should show face after boot)
screen_visible: (confirm physically)
face_displayed: (confirm physically — default "normal" face)
iphone_reconnect: skipped
com_port_still_visible: yes (redacted COM port present)
unexpected_servo_motion: (confirm physically — must be no)
camera_activated: no (firmware does not auto-activate camera)
mic_activated: no (firmware does not auto-activate mic)
```

---

## Gate Result

```
result: FLASH_SUCCESS / post_boot_physical_check_pending
gate_restored_hold: yes
```

---

## Next Steps After PASS

- SC-LED-01: LED one-shot test (separate GO required)
- SC-DANCE-01: Dance one-shot test (separate GO required)

---

## Stop Conditions (from SC-FW-11 GO form)

STOP if:
- wrong COM port
- tool asks for Erase unexpectedly
- firmware does not boot
- screen not visible
- unexpected servo motion starts
- camera/mic activates
- token would be logged

この範囲では問題を検出していません

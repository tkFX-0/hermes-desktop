# SC-FW-10 Compile-only Build GO Form

## Status

```text
status: DRAFT / NOT APPROVED
```

This form is for the next step after pre-build implementation. It approves a
compile-only firmware build and does not approve upload, flash, Burn, Erase,
Firmware Exporter Start, or StackChan device control.

## Required Human GO

```text
date:
time_window:
approved_command:
  cd docs/firmware/shikishima_cores3
  pio run -e cores3_noflash
expected_result:
  firmware compiles or compile errors are captured as evidence
evidence_file:
  docs/shikishima/SC_FW_10_COMPILE_ONLY_BUILD_EVIDENCE.md
```

## Allowed

```text
compile_only_build: true
download_compile_dependencies_if_platformio_requires: human_decision_required
read_compile_errors: true
update_docs_with_result: true
```

If PlatformIO requests dependency download, stop and report before proceeding
unless the human explicitly approves dependency resolution for the build.

## Forbidden

```text
upload: false
flash: false
burn: false
erase: false
firmware_exporter_start: false
serial_write: false
stackchan_command_send: false
led_physical_test: false
dance_physical_test: false
camera_monitoring: false
microphone: false
productionReady_true: false
execution_enabled: false
git_push: false
```

## Stop Conditions

STOP if:

```text
command includes upload target
command includes erase target
tool asks to flash or select serial port
M5Burner opens Burn/Erase path
PlatformIO wants to upload after build
raw token would be logged
source outside firmware/build docs must be changed
```

## Required Evidence

Create after build:

```text
docs/shikishima/SC_FW_10_COMPILE_ONLY_BUILD_EVIDENCE.md
```

Evidence fields:

```text
result: PASS / PARTIAL / HOLD / STOP
compile_command:
compile_exit_code:
dependency_resolution_performed:
upload_performed: false
flash_performed: false
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
stackchan_command_sent: false
errors_summary:
next_required_fix:
productionReady: false
execution: disabled
rawValuesReported: false
```

## Next Gates After Compile

If compile PASS:

```text
1. SC-FW-11 firmware flash GO review
2. SC-LED-01 LED one-shot GO review
3. SC-DANCE-01 Dance one-shot GO review
```

If compile FAIL:

```text
1. fix compile errors only
2. re-run compile-only GO
3. do not flash
```

# SC-FW-10 Compile-only Build Evidence

## Result

status: PASS

## Attempt 1

```text
compile_command: python -m platformio run -e cores3_noflash
compile_exit_code: 1
dependency_resolution_performed: true
upload_performed: false
flash_performed: false
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
stackchan_command_sent: false
device_touched: false
```

Result summary:

```text
PlatformIO toolchain installed and project dependencies resolved.
PlatformIO recognized board m5stack-cores3.
Build failed before compilation with "Nothing to build".
Root cause: initial build_src_filter was too narrow for PlatformIO .ino conversion.
```

Corrective action:

```text
platformio.ini build_src_filter updated to exclude only non-source files and .pio.
```

## Attempt 2

```text
compile_command: python -m platformio run -e cores3_noflash
compile_exit_code: 1
upload_performed: false
flash_performed: false
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
stackchan_command_sent: false
device_touched: false
```

Result summary:

```text
Build still failed before compilation with "Nothing to build".
Root cause: PlatformIO did not build the top-level .ino even with src_dir = .
```

Corrective action:

```text
Created docs/firmware/shikishima_cores3/src/shikishima_cores3.ino as the
PlatformIO build mirror.
Changed platformio.ini src_dir to src.
Kept include_dir as . so faces_data.h remains available.
```

## Attempt 3

```text
compile_command: python -m platformio run -e cores3_noflash
compile_exit_code: 1
upload_performed: false
flash_performed: false
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
stackchan_command_sent: false
device_touched: false
```

Result summary:

```text
Build still failed before compilation with "Nothing to build".
Root cause: build_src_filter likely excluded the converted .ino intermediate.
```

Corrective action:

```text
Removed build_src_filter and returned to PlatformIO default source discovery
inside src_dir = src.
```

## Attempt 4

```text
compile_command: python -m platformio run -e cores3_noflash
compile_exit_code: 1
upload_performed: false
flash_performed: false
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
stackchan_command_sent: false
device_touched: false
```

Result summary:

```text
Compile and archive steps ran.
Link step failed because the ESP32 linker could not open firmware.map under the
current project path.
Likely root cause: non-ASCII project path handling in the ESP32 toolchain.
```

Corrective action:

```text
Use an ASCII-only temporary compile workspace for the next compile-only attempt.
Do not upload or flash.
```

## Attempt 5

```text
compile_command: python -m platformio run -e cores3_noflash
compile_exit_code: 0
dependency_resolution_performed: true
ascii_temp_workspace_used: true
upload_performed: false
flash_performed: false
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
stackchan_command_sent: false
device_touched: false
```

Result summary:

```text
Compile-only build succeeded from an ASCII-only temporary workspace.
No upload target was used.
No firmware was flashed.
No serial/device command was sent.
```

Build size:

```text
ram_used: 52360 bytes
ram_percent: 16.0
flash_used: 1367757 bytes
flash_percent: 20.9
firmware_bin_created_in_temp_workspace: true
```

## Safety

```text
upload_performed: false
flash_performed: false
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
stackchan_command_sent: false
led_physical_test: false
dance_physical_test: false
camera_monitoring_started: false
microphone_used: false
external_api_write: false
productionReady: false
execution: disabled
rawValuesReported: false
git_push_performed: false
```

## Final Decision

```text
compile_only_build: PASS
ready_for_next_gate: true
next_gate_options:
  - SC-FW-11 firmware flash GO review
  - SC-LED-01 one-shot LED GO review after firmware flash
  - SC-DANCE-01 one-shot dance GO review after firmware flash
```

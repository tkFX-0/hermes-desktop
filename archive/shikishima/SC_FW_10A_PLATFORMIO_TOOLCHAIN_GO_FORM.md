# SC-FW-10A PlatformIO Toolchain GO Form

## Status

```text
status: DRAFT / NOT APPROVED
```

This gate is needed only because the current PC does not expose `pio` on PATH
and `python -m platformio` is not installed.

## Purpose

Prepare the local compile-only firmware build toolchain for:

```text
docs/firmware/shikishima_cores3
```

This does not approve firmware upload, flash, Burn, Erase, Firmware Exporter
Start, serial writes, or StackChan device control.

## Current Toolchain Check

```text
where pio: not found
python -m platformio --version: not found
py -m platformio --version: not found
```

## Allowed With Human GO

Choose exactly one route:

```text
route_a_existing_install:
  find existing PlatformIO executable and use it for compile-only build

route_b_install_platformio:
  install PlatformIO Core locally
  verify pio --version
  do not build yet unless SC-FW-10 GO is also given

route_c_arduino_cli:
  use existing Arduino CLI only if already installed
  create a separate compile-only plan before build
```

## Forbidden

```text
firmware_upload: false
firmware_flash: false
burn: false
erase: false
firmware_exporter_start: false
serial_write: false
stackchan_command_send: false
device_control: false
productionReady_true: false
execution_enabled: false
git_push: false
```

## Required Human Fields

```text
approved_route:
time_window:
install_allowed:
network_download_allowed:
expected_tool_version:
evidence_file:
  docs/shikishima/SC_FW_10A_PLATFORMIO_TOOLCHAIN_EVIDENCE.md
```

## Evidence Template

Create after toolchain setup:

```text
docs/shikishima/SC_FW_10A_PLATFORMIO_TOOLCHAIN_EVIDENCE.md
```

Fields:

```text
result: PASS / PARTIAL / HOLD / STOP
route_selected:
pio_available:
pio_version:
install_performed:
network_download_performed:
compile_run: false
upload_performed: false
flash_performed: false
device_touched: false
next_gate:
```

## Next Gate

If toolchain is available:

```text
SC-FW-10 compile-only build
```

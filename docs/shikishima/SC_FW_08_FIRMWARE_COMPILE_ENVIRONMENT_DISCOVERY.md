# SC-FW-08 Firmware Compile Environment Discovery

## Purpose

Define the next non-hardware step required before enabling the StackChan LED
driver or running dance/LED physical tests.

The current repository does not expose an obvious `platformio.ini` for the
custom firmware path, so compile environment discovery is required.

## Goal

Find the exact build route for:

```text
docs/firmware/shikishima_cores3/shikishima_cores3.ino
```

without flashing or touching hardware.

## Allowed

```text
locate PlatformIO project
locate Arduino project metadata
locate library dependencies
create docs-only compile plan
optionally create a separate compile sandbox plan
record missing dependencies
```

## Forbidden

```text
firmware flash
Burn
Erase
Firmware Exporter Start
USB/serial write
StackChan command send
device control
motion/dance
LED physical test
camera/mic
package install without GO
productionReady true
execution enabled
```

## Expected Dependency Areas

```text
M5Unified
ArduinoJson
WebSocketsServer
HTTPClient
BLEDevice / ESP32 BLE
esp_camera
M5StackChan-BSP if LED physical driver is enabled later
```

## Discovery Checklist

```text
platformio_ini_found:
arduino_cli_config_found:
board_target:
framework:
libraries:
faces_data_available:
firmware_source_encoding_ok:
compile_command_candidate:
compile_output_path:
no_flash_flag:
```

## Compile Command Policy

The first compile command must be no-flash only.

Allowed examples:

```text
pio run
arduino-cli compile
```

Forbidden examples:

```text
pio run --target upload
arduino-cli upload
M5Burner Burn
Firmware Exporter Start
Erase
```

## Output

Create or update a future evidence file:

```text
docs/shikishima/SC_FW_08_FIRMWARE_COMPILE_ENVIRONMENT_EVIDENCE.md
```

Required result values:

```text
result: PASS / PARTIAL / HOLD / STOP
compile_environment_found:
compile_command_ready:
flash_or_upload_performed: false
device_touched: false
next_gate:
```

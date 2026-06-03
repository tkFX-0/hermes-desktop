# SC-FW-08 Firmware Compile Environment Evidence

## Result

status: PASS

This record prepares the no-flash build environment for the current custom
StackChan CoreS3 firmware. Build has not been executed in this step.

## Firmware Project

```text
project_dir: docs/firmware/shikishima_cores3
firmware_source: shikishima_cores3.ino
face_header: faces_data.h
platformio_ini: docs/firmware/shikishima_cores3/platformio.ini
build_readme: docs/firmware/shikishima_cores3/BUILD_README.md
```

## Compile Command Candidate

Run from:

```text
docs/firmware/shikishima_cores3
```

Command:

```powershell
pio run -e cores3_noflash
```

## Expected Environment

```text
platform: espressif32
board: m5stack-cores3
framework: arduino
monitor_speed: 115200
upload_speed: 1500000
```

Dependencies:

```text
M5Unified
ArduinoJson
WebSockets
ESP32 Arduino built-ins:
  - WiFi
  - HTTPClient
  - BLEDevice
  - esp_camera
  - driver/ledc
```

## Pre-build Implementation Completed

```text
platformio_ini_created: true
build_readme_created: true
source_filter_scoped_to_firmware_ino: true
faces_data_header_kept_local: true
pio_command_found_on_path: false
python_platformio_module_found: true
compile_only_build_passed: true
upload_target_not_run: true
flash_not_run: true
device_command_not_sent: true
```

## Toolchain Status

Local checks:

```text
where pio: not found before setup
python -m platformio --version: PlatformIO Core 6.1.19 after setup
direct pio.exe path: PlatformIO Core 6.1.19 after setup
```

PlatformIO is available through `python -m platformio`. PATH can be updated
later if desired, but it is not required for compile-only builds.

## Safety Defaults Verified By Source Review

```text
ENABLE_OTA: false
ENABLE_BLE_CONTROL: false
ENABLE_CAMERA_SEND: false
ENABLE_LED_CONTROL: false
ENABLE_STACKCHAN_BSP_LED_DRIVER: 0
ENABLE_DANCE_CONTROL: true
REQUIRE_CONTROL_TOKEN: true
```

## Fallback If Board ID Is Unknown

If local PlatformIO reports unknown board `m5stack-cores3`, do not improvise an
upload. Update this evidence and use a compile-only fallback plan based on:

```text
board: esp32-s3-devkitc-1
required build flags:
  -DESP32S3
  -DBOARD_HAS_PSRAM
  -DARDUINO_USB_CDC_ON_BOOT=1
  -DARDUINO_USB_MODE=1
  -mfix-esp32-psram-cache-issue
```

## Not Performed

```text
compile_run: false
firmware_upload: false
firmware_flash: false
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

## Next Gate

```text
SC-FW-11 firmware flash GO review
```

Allowed next command:

```powershell
cd docs/firmware/shikishima_cores3
pio run -e cores3_noflash
```

Forbidden next commands without separate GO:

```text
pio run -t upload
pio run -t erase
Burn
Erase
Firmware Exporter Start
StackChan command send
```

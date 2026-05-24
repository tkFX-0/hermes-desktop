# SC-FW-10A PlatformIO Toolchain Evidence

## Result

status: PASS

## Toolchain Setup

```text
route_selected: route_b_install_platformio
platformio_core_version: 6.1.19
install_performed: true
network_download_performed: true
pio_available_by_python_module: true
pio_available_by_direct_exe_path: true
pio_on_path: false
compile_run: true
upload_performed: false
flash_performed: false
device_touched: false
```

PlatformIO was installed into the user Python environment. The generated
`pio.exe` is available under the Python user scripts directory, but that
directory is not currently on PATH. The reliable invocation used for this
session is:

```powershell
python -m platformio
```

## Dependency Resolution

The compile-only run resolved the PlatformIO platform/toolchain dependencies:

```text
platform: espressif32
board: m5stack-cores3
framework: arduino
toolchain: xtensa-esp32s3
libraries:
  - M5Unified
  - ArduinoJson
  - WebSockets
```

## Safety

```text
firmware_upload: false
firmware_flash: false
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
serial_write: false
stackchan_command_sent: false
device_control: false
productionReady: false
execution: disabled
rawValuesReported: false
git_push_performed: false
```

## Next Gate

```text
SC-FW-10 compile-only build: PASS
```

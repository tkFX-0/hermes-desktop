# Shikishima CoreS3 Firmware Build README

## Purpose

This folder is prepared for a compile-only firmware build of:

```text
shikishima_cores3.ino
```

PlatformIO builds the mirrored source in:

```text
src/shikishima_cores3.ino
```

Keep this mirror synchronized with the top-level firmware source before every
compile-only build. The mirror exists because PlatformIO did not treat the
top-level `.ino` as a build source even when `src_dir = .` was configured.

Do not flash, upload, Burn, Erase, or use Firmware Exporter Start from this
folder unless a separate human firmware GO has been approved.

## Safe Compile Command

Run from this folder:

```powershell
pio run -e cores3_noflash
```

This command is compile-only. It should not upload firmware.

## Toolchain Note

Current pre-build check did not find `pio` on PATH. Before running the compile
command, complete the `SC-FW-10A PlatformIO Toolchain GO Form` or provide an
existing PlatformIO executable path.

## Non-ASCII Path Note

The ESP32 linker can fail when the project path contains non-ASCII characters.
If `firmware.map` cannot be opened during link, copy this firmware project to an
ASCII-only temporary workspace and run the same compile-only command there.

Do not use upload/flash targets from the temporary workspace unless a separate
firmware flash GO is approved.

## Forbidden Commands Without Separate GO

```powershell
pio run -t upload
pio run --target upload
pio run -t erase
arduino-cli upload
M5Burner Burn
Firmware Exporter Start
Erase
```

## Expected Board Target

Primary PlatformIO board:

```text
m5stack-cores3
```

If the local PlatformIO installation is too old and does not know that board,
update the compile plan before changing the project. The known fallback from
M5Stack examples is `esp32-s3-devkitc-1` with CoreS3 build flags, but that
fallback must be recorded in evidence before use.

## Required Evidence File After Compile

Create:

```text
docs/shikishima/SC_FW_08_FIRMWARE_COMPILE_ENVIRONMENT_EVIDENCE.md
```

Record:

```text
result:
compile_command:
compile_result:
upload_performed: false
erase_performed: false
burn_performed: false
firmware_exporter_start_performed: false
device_command_sent: false
productionReady: false
execution: disabled
```

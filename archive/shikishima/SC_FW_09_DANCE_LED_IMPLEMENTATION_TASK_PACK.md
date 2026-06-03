# SC-FW-09 Dance / LED Implementation Task Pack

## Mission

Continue from the HOLD-front implementation and prepare the next safe firmware
steps for StackChan dance and RGB LED restoration.

This task pack is intentionally split into non-hardware and hardware gates.

## Current Baseline

```text
SC-FW-04: HOLD-front command surface implemented
LED physical driver: disabled
dance command route: source-ready, not physically tested
firmware compile environment: not confirmed
firmware flash: HOLD
Burn/Erase/Firmware Exporter Start: HOLD
StackChan physical operation: HOLD
productionReady: false
execution: disabled
```

## Worker Routing

```text
Codex:
  StackChan docs/design/research
  firmware compile environment discovery
  compile-only review

ClaudeCode:
  Shikishima core UI/app changes

Human:
  firmware flash GO
  LED physical GO
  dance physical GO
  StackChan device observation
```

## Task A: SC-FW-08 Compile Environment Discovery

Goal:

```text
Find the correct no-flash compile path for the current firmware source.
```

Allowed:

```text
read files
inspect firmware dependencies
document compile command candidate
run no-flash compile only if toolchain is already installed and command is safe
```

Forbidden:

```text
upload
flash
Burn
Erase
Firmware Exporter Start
device command
serial write
StackChan control
```

Output:

```text
docs/shikishima/SC_FW_08_FIRMWARE_COMPILE_ENVIRONMENT_EVIDENCE.md
```

## Task B: SC-LED-01 Compile-only LED Driver Patch

Goal:

```text
Implement the actual LED driver behind existing HOLD gates.
```

Allowed:

```text
firmware source edit
driver wrapper implementation
compile-only check
docs evidence
```

Required:

```text
ENABLE_LED_CONTROL remains false unless this is a scoped test build
ENABLE_STACKCHAN_BSP_LED_DRIVER remains auditable
brightness clamp remains active
ledDriverReady only true after driver init
ledOff available and safe
```

Forbidden:

```text
flash
physical LED test
dance test
motion
camera/mic
```

## Task C: SC-DANCE-01 One-shot Dance GO Review

Goal:

```text
Prepare one physical dance command only.
```

Requires:

```text
firmware flashed by separate GO
CONTROL_TOKEN private and configured
StackChan clear of obstacles
human time window
one command only
after-action HOLD
```

Forbidden:

```text
loop
cron
auto dance after speech
status-check dance
camera/mic
productionReady true
execution enabled
```

## Task D: SC-LED-01 One-shot LED GO Review

Goal:

```text
Prepare one low-brightness LED command only.
```

Requires:

```text
firmware flashed by separate GO
LED driver compile evidence
one low-brightness blue or off command
off state after test
no servo motion
```

## Task E: SC-DANCE-LED-01 Combined Review

Blocked until:

```text
SC-DANCE-01: PASS
SC-LED-01: PASS
```

Goal:

```text
Allow dance preset LED effect during one dance sequence.
```

Still forbidden:

```text
continuous animation
looped dance
autonomous trigger
```

## Required Evidence Fields For Every Gate

```text
result:
gate:
human_go_reference:
run_count:
firmware_flash_performed:
burn_performed:
erase_performed:
firmware_exporter_start_performed:
stackchan_command_sent:
motion_dance_used:
led_physical_test:
camera_monitoring_started:
microphone_used:
token_output:
gate_restored_hold:
productionReady:
execution:
rawValuesReported:
```

## Recommended Immediate Next Command Set

Read-only / no hardware:

```text
git status --short
Get-ChildItem -Recurse -Filter platformio.ini
Get-ChildItem -Recurse -Filter *.ino docs src scripts
rg -n "M5Unified|WebSocketsServer|ArduinoJson|M5StackChan|setRgbColor|refreshRgb" docs src scripts
```

Do not run upload/flash commands.

## Current Pre-build Output

Pre-build implementation now provides:

```text
platformio_ini: docs/firmware/shikishima_cores3/platformio.ini
build_readme: docs/firmware/shikishima_cores3/BUILD_README.md
compile_environment_evidence: docs/shikishima/SC_FW_08_FIRMWARE_COMPILE_ENVIRONMENT_EVIDENCE.md
compile_only_go_form: docs/shikishima/SC_FW_10_COMPILE_ONLY_BUILD_GO_FORM.md
```

Next intended gate:

```text
SC-FW-10A PlatformIO toolchain setup if `pio` is unavailable
SC-FW-10 compile-only build after toolchain availability is confirmed
```

Allowed next command only after explicit GO:

```powershell
cd docs/firmware/shikishima_cores3
pio run -e cores3_noflash
```

## Completion Decision

```text
READY_FOR_COMPILE_ONLY: compile environment found
READY_FOR_LED_DRIVER_PATCH: compile environment found and LED route selected
READY_FOR_HARDWARE_GO: compile-only pass plus human GO
HOLD: compile environment missing or hardware risk unresolved
STOP: any flash/device/external action attempted without GO
```

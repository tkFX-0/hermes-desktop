# SC-FW-04 Dance Route and LED HOLD-front Implementation

## Result

status: PASS_CANDIDATE

This record covers the source-only implementation made before the hardware
HOLD boundary. It prepares the command surface for dance and RGB LED control,
but it does not flash firmware, write firmware, start runtime, or send commands
to StackChan.

## Implemented Scope

- Firmware WebSocket command path includes token-gated `dance`.
- Firmware WebSocket command path includes token-gated `led`.
- Dance start attempts to apply the `dance` LED preset.
- Dance end attempts to turn LEDs off.
- LED command handling is present as a HOLD-front adapter.
- LED physical writes remain blocked by default.
- PC local service has a `stackchanDanceLocal()` command wrapper.
- PC local service has a `stackchanLedLocal()` command wrapper.
- CLI helper has a `stackchanLed()` command wrapper.

## LED Safety Defaults

```text
ENABLE_LED_CONTROL: false
ENABLE_STACKCHAN_BSP_LED_DRIVER: 0
ledDriverReady: false
```

Because these defaults remain closed, the firmware can parse an authorized LED
command but must reject physical LED writes until a future SC-LED-01 hardware
GO explicitly enables and verifies the exact CoreS3 / StackChan-BSP driver path.

## Dance Safety Defaults

```text
ENABLE_DANCE_CONTROL: true
MIN_DANCE_INTERVAL_MS: 5000
requires_control_token: true
```

Dance remains a one-shot, token-gated route. The implementation does not start
dance by itself and does not add any loop, cron, or autonomous trigger.

## Not Performed

```text
firmware_flash: false
burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
stackchan_command_sent: false
led_physical_test: false
dance_physical_test: false
motion_dance_used: false
camera_monitoring_started: false
microphone_used: false
external_api_write: false
productionReady: false
execution: disabled
rawValuesReported: false
git_push_performed: false
```

## Next Gate

Recommended next gate:

```text
SC-FW-03 compile-only review
```

After compile-only review passes, choose one separate hardware GO:

```text
SC-LED-01 one-shot LED hardware test
SC-DANCE-01 one-shot dance hardware test
```

Do not combine LED and dance hardware tests in the same first run.

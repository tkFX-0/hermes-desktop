# SC-FW-03 Compile-only Dance Route + LED Driver Patch GO Form

Status: DRAFT / NOT APPROVED

Date: 2026-05-24

## Purpose

Implement source changes needed to:
- keep the dance route token-gated and usable by explicit one-shot command;
- add a default-off RGB LED driver path;
- avoid any firmware write or physical StackChan operation.

This GO form is for implementation only. It is not approval to flash or test hardware.

## Required Human Fields

time_window_jst:

worker:

exact_scope:

expected_changed_files:

evidence_file:

## Allowed

- Firmware source patch.
- PC bridge token/path patch if needed.
- docs/evidence update.
- static checks.
- compile-only checks if local toolchain is available.

## Required Defaults

```text
ENABLE_LED_CONTROL = false
ENABLE_DANCE_CONTROL = true
ENABLE_SERVO_CONTROL = true
ENABLE_CAMERA_SEND = false
ENABLE_MIC_RECORDING = false
ENABLE_BLE_CONTROL = false
ENABLE_OTA = false
REQUIRE_CONTROL_TOKEN = true
```

## Required Implementation Points

Dance:
- preserve `type: "dance"`;
- preserve `move/dance` alias;
- keep token authorization;
- keep rate limit;
- no auto dance;
- no boot dance;
- no status-check dance.

LED:
- add LED safety gate;
- add low-brightness clamp;
- add LED off function;
- add token-gated LED command;
- add presets: `off`, `blue`, `pass`, `warning`, `dance`;
- no continuous animation in first patch.

Network:
- PC may remain wired Ethernet;
- StackChan may remain Wi-Fi;
- require intentional LAN routing;
- do not require PC Wi-Fi.

## Forbidden

- firmware flash;
- Burn;
- Erase;
- Firmware Exporter Start;
- physical dance test;
- physical LED test;
- servo command to device;
- LED command to device;
- camera/mic;
- runtime start;
- external API;
- productionReady true;
- execution enabled;
- raw token output;
- git push.

## Stop Conditions

STOP if:
- LED requires full firmware rewrite;
- BSP initialization conflicts with current servo/camera setup;
- package/dependency installation is required;
- firmware build requires secrets;
- implementation would require physical device testing;
- any raw token or local-only value would be recorded;
- any command would be sent to StackChan.

## Required Verification

Run if applicable:

```text
npm run typecheck:node
node --check scripts/shikishima-stackchan.mjs
```

Also run:

```text
git diff --name-only
git diff --stat
git status --short
rg -n "ENABLE_LED_CONTROL|type.*led|CONTROL_TOKEN|ENABLE_DANCE_CONTROL|type.*dance" docs/firmware src/main scripts
```

Expected:
- source patch only;
- no package changes;
- no lockfile changes;
- no firmware binary;
- no raw token;
- no device command;
- no git push.

## Result Fields

result:
  PASS / PARTIAL / HOLD / STOP

dance:
  type_dance_preserved:
  move_dance_alias_preserved:
  token_gated:
  rate_limited:
  auto_dance_added:

led:
  led_driver_added:
  enable_led_control_default:
  brightness_clamp:
  led_off:
  led_presets:
  token_gated:
  continuous_animation_added:

safety:
  firmware_flashed:
  burn_performed:
  erase_performed:
  device_command_sent:
  motion_dance_used:
  led_command_sent:
  camera_used:
  microphone_used:
  productionReady:
  execution:
  rawValuesReported:
  git_push_performed:

next_gate:
  SC-LED-01 LED One-Shot GO
  or SC-DANCE-01 Dance One-Shot GO
  or HOLD

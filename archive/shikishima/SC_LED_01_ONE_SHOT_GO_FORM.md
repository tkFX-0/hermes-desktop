# SC-LED-01 LED One-Shot GO Form

Status: DRAFT / NOT APPROVED

Date: 2026-05-24

Purpose:
- Test StackChan RGB LED driver once after compile-only patch is reviewed.

This form does not approve firmware flash by itself.

Prerequisite:
- SC-FW-10 compile-only build: PASS
- SC-FW-11 firmware flash: PASS
- SC-DANCE-01 not running at the same time

## Required Human Fields

time_window_jst:

firmware_build_reference:

firmware_flash_evidence:

expected_command:

evidence_file:

rollback_method:

## Allowed After Separate GO

- one LED command only;
- low brightness;
- recommended sequence: off -> low blue -> off;
- no servo;
- no dance;
- no speech;
- no camera/mic.

## Forbidden

- continuous LED animation;
- high brightness;
- motion/dance;
- audio;
- camera;
- mic;
- external API;
- productionReady true;
- execution enabled.

## Stop Conditions

STOP if:
- LED stays on unexpectedly;
- device becomes unstable;
- servo moves;
- command repeats;
- any camera/mic activates;
- firmware asks for Erase/Burn outside approved plan.

## Evidence Fields

result:
  PASS / PARTIAL / HOLD / STOP

led:
  command_count:
  color:
  brightness:
  off_restored:
  unexpected_motion:

safety:
  dance_used:
  speech_used:
  camera_used:
  microphone_used:
  external_api_write:
  productionReady:
  execution:
  gate_restored_hold:

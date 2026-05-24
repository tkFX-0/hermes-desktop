# SC-DANCE-01 Dance One-Shot GO Form

Status: DRAFT / NOT APPROVED

Date: 2026-05-24

Purpose:
- Test one token-gated StackChan dance command after compile-only patch is reviewed.

This form does not approve firmware flash by itself.

Prerequisite:
- SC-FW-10 compile-only build: PASS
- SC-FW-11 firmware flash: PASS
- SC-LED-01 not running at the same time unless LED has already passed separately

## Required Human Fields

time_window_jst:

firmware_build_reference:

firmware_flash_evidence:

expected_command:

evidence_file:

rollback_method:

## Allowed After Separate GO

- one dance command only;
- no loop;
- no camera;
- no mic;
- no speech unless separately approved;
- observe servo movement and return to HOLD.

## Forbidden

- repeated dance;
- continuous dance;
- dance on boot;
- dance after every reply;
- dance from status check;
- camera;
- microphone;
- productionReady true;
- execution enabled.

## Stop Conditions

STOP if:
- servo stalls;
- movement repeats unexpectedly;
- unexpected high-speed rotation occurs;
- device becomes unstable;
- command repeats;
- camera/mic activates;
- firmware asks for Erase/Burn outside approved plan.

## Evidence Fields

result:
  PASS / PARTIAL / HOLD / STOP

dance:
  command_count:
  duration:
  returned_home:
  unexpected_repeat:
  servo_stall:

safety:
  led_used:
  speech_used:
  camera_used:
  microphone_used:
  external_api_write:
  productionReady:
  execution:
  gate_restored_hold:

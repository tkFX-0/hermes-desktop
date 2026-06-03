# SC-FW-07 HOLD Release Readiness Checklist

## Purpose

Define the checklist required before any HOLD-front StackChan implementation is
allowed to move into compile, flash, LED, or dance hardware testing.

## Current HOLD-front Items

```text
SC-FW-04 dance/LED command surface: implemented
SC-LED physical driver: HOLD
SC-DANCE physical execution: HOLD
firmware flash: HOLD
Burn/Erase/Firmware Exporter Start: HOLD
motion/dance/camera/mic: HOLD
productionReady: false
execution: disabled
```

## Required Preflight

Before any hardware GO:

```text
branch_clean_or_scope_reviewed:
commit_scope_reviewed:
firmware_source_diff_reviewed:
CONTROL_TOKEN_not_placeholder:
raw_token_not_logged:
LAN_route_confirmed_or_serial_gate_selected:
restore_plan_available:
M5Burner_restore_candidate_known:
COM_port_reference_recorded:
StackChan_clear_of_obstacles:
camera_monitoring_disabled:
microphone_disabled:
motion_test_area_safe:
```

## Compile-only Gate

Allowed:

```text
firmware source edit
local compile
static search
docs evidence
```

Forbidden:

```text
flash
Burn
Erase
Firmware Exporter Start
StackChan command send
LED physical test
dance physical test
camera/mic use
productionReady true
execution enabled
```

Required evidence:

```text
compile_result:
changed_files:
ENABLE_LED_CONTROL:
ENABLE_STACKCHAN_BSP_LED_DRIVER:
ENABLE_DANCE_CONTROL:
token_required:
package_changed:
firmware_written:
device_controlled:
```

## Firmware Flash Gate

Firmware flash is a separate Level 5 hardware gate.

Required human GO fields:

```text
date:
time_window:
firmware_source_path:
build_artifact:
flash_tool:
target_device:
target_port:
restore_plan:
stop_conditions:
post_flash_checks:
evidence_file:
```

Do not flash from a mixed or dirty branch without a scope review.

## LED One-shot Gate

Allowed only after compile-only and firmware flash gates pass.

```text
allowed_command_count: 1
allowed_color: off or low blue
max_brightness: LED_MAX_BRIGHTNESS
allowed_servo_motion: false
required_after_action: LED off / HOLD
```

## Dance One-shot Gate

Allowed only after compile-only and firmware flash gates pass.

```text
allowed_dance_count: 1
allowed_loop: false
allowed_camera: false
allowed_microphone: false
allowed_led: false unless SC-LED-01 already passed
required_after_action: HOLD
```

## Combined Dance + LED Gate

Blocked until both pass:

```text
SC-LED-01: PASS
SC-DANCE-01: PASS
```

Combined testing must still be one-shot and time-boxed.

## Push / Commit Boundary

Do not push implementation commits until:

```text
typecheck_node: PASS if Node bridge changed
typecheck_web: PASS if renderer changed
script_syntax_check: PASS if scripts changed
firmware_compile_or_compile_plan_recorded:
docs_evidence_created:
scope_review_done:
human_push_go: true
```

## STOP Conditions

STOP if:

```text
token_needed_but_missing:
raw_secret_would_be_logged:
firmware_tool_requests_erase:
device_port_uncertain:
LAN_route_uncertain_and_no_serial_gate:
unexpected_motion:
unexpected_audio:
camera_monitoring_starts:
microphone_starts:
productionReady_would_be_true:
execution_would_be_enabled:
```

## Recommended Next Order

```text
1. SC-FW-08 firmware compile environment discovery
2. SC-LED-01 compile-only LED driver implementation
3. SC-DANCE-01 one-shot dance GO review
4. SC-LED-01 one-shot LED hardware GO review
5. SC-DANCE-LED-01 combined behavior review
```

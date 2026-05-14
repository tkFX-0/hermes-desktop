# Session-009 Clean B3 PASS #5 GO Pack

## Document Status

```text
roadmapVersion: v3.14.0
date_created: 2026-05-15
status: go_pack_only — not approved
```

## Purpose

Prepare the final clean B3 PASS #5 session.

```text
Current: clean B3 PASS 4/5
Target : clean B3 PASS 5/5
```

## Session Plan

```text
session_id    : shikishima-session-YYYY-MM-DD-009
target        : clean B3 PASS #5
observation   : Settings safe display (recommended)
                OR Models/provider non-secret display
                OR navigation regression subset (different screens from Session-007)
```

## Hard Timing Rule

```text
The app must not launch until AT LEAST +30 seconds after approved_window_start.

Background: Session-004 (-10s) and Session-008 (-1s) were both classified as
PASS_WITH_TIMING_CAVEAT due to pre-window launches.
A +30s buffer eliminates OS scheduling and command execution delay risk.
```

## Recommended Observation: Settings Safe Display

```text
purpose: confirm Settings screen does not expose raw API keys or secrets
screens:
  - navigate to Settings
  - confirm API key fields are masked
  - confirm no raw values visible
  - confirm no execution toggle enabled
  - confirm no productionReady=true label
success: settings_safe = PASS / keys_masked = PASS
```

## Alternative: Models/Provider Non-Secret Display

```text
purpose: confirm Models or provider screen does not expose raw keys
screens:
  - navigate to Models or provider screen
  - confirm no prefilled secret values
  - confirm no raw API keys visible
success: models_no_raw_keys = PASS
```

## Success Criteria

```text
app_start_inside_window         : PASS (start after window_start + 30s)
target_screen_visible           : PASS
no_crash                        : PASS
no_raw_values                   : PASS
no_secrets                      : PASS
no_local_only_values            : PASS
no_execution_enabled            : PASS
no_productionReady_true         : PASS
no_unexpected_GO_label          : PASS
no_deploy_prompt                : PASS
no_robot_voice_camera_prompt    : PASS
working_tree_clean_after        : PASS
```

## STOP Conditions

```text
- app starts before window_start (classify: timing_caveat → do NOT count)
- app starts less than +30s after window_start (classify: timing_caveat → do NOT count)
- crash or unexpected error
- raw value / secret visible
- execution appears enabled
- productionReady appears true
- robot / voice / camera / mic / deploy prompt appears
- unexpected file changes
- time_window expires
```

## GO Template

```text
I explicitly approve this one Level B3 daily operation session only.

Approved session:
shikishima-session-YYYY-MM-DD-009

Approved time_window:
YYYY-MM-DD __:__-__:__ JST

Approved purpose:
Level B3 clean B3 PASS #5 — Settings safe display observation
(confirm API keys masked, no raw values, no execution enabled).

Approved command:
.\node_modules\.bin\electron.cmd .

Required timing rule:
App must not launch until at least +30 seconds after approved_window_start.
```

## Evidence Fields

```text
session_id, date, time_window, app_start_recorded, timing_delta,
command_used, local_binary_exists, app_started,
screens_checked, keys_masked, no_raw_values, no_execution_enabled,
working_tree_before/after, session_result
```

## After Session-009 PASS

```text
1. Create evidence file
2. Human acceptance
3. Create B3 5/5 acceptance record (see LEVEL_B3_5_OF_5_ACCEPTANCE_TEMPLATE.md)
4. Push all pending docs
5. Update LEVEL_3_GAP_AUDIT.md
6. Assess Level 3 gap status
```

---

この範囲では問題を検出していません

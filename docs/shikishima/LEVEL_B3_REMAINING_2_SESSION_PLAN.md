# Level B3 Remaining 2 Session Plan

## Document Status

```text
roadmapVersion: v3.14.0
status: session_plan_v1
date_created: 2026-05-14
```

## Purpose

Plan the final 2 clean B3 PASS sessions needed before Level 3 prerequisites can be assessed.

```text
Current: 3/5 clean B3 PASS
Target : 5/5 clean B3 PASS
```

This document does not approve these sessions. Each requires a time_window GO from the human.

---

## Session-007: Navigation Regression Observation

```text
session_id    : shikishima-session-YYYY-MM-DD-007
target        : clean B3 PASS #4
clean_b3_goal : 4/5
```

### Purpose

Navigate across all visible main screens and confirm no screen transition triggers unexpected execution, raw value exposure, or safety boundary violation.

### Allowed Scope

```text
- observe all main navigation screens
- note screen names and any unexpected behavior
- confirm Control Center still shows HOLD / disabled / false after navigation
- record evidence
```

### Screen Observation List

```text
1. Home / しきしま
2. Chat
3. Sessions
4. Profiles
5. Office
6. Models
7. Skills
8. Persona
9. Memory
10. Tools
11. Schedules
12. Gateway
13. Settings
14. Research
15. Control Center (confirm labels after navigation)
```

### Success Criteria

```text
no_crash                    : PASS
no_raw_values               : PASS
no_secrets                  : PASS
no_local_only_values        : PASS
no_execution_enabled        : PASS
no_productionReady_true     : PASS
no_unexpected_GO_label      : PASS
no_deploy_prompt            : PASS
no_robot_voice_camera_prompt: PASS
control_center_HOLD_confirmed: PASS (verify after navigation)
working_tree_clean_after    : PASS
```

### STOP Criteria

```text
- crash or unexpected error on any screen
- raw value / secret visible
- execution appears enabled
- productionReady appears true
- robot / voice / camera / mic / deploy prompt appears
- unexpected file changes after close
- time_window expires before observation complete
```

### GO Template

```text
I explicitly approve this one Level B3 daily operation session only.

Approved session:
shikishima-session-YYYY-MM-DD-007

Approved time_window:
YYYY-MM-DD __:__-__:__ JST

Approved purpose:
Level B3 navigation regression observation — navigate all visible main screens
and confirm no safety boundary violation.

Approved command:
.\node_modules\.bin\electron.cmd .
```

### Expected Evidence

```text
docs/shikishima/LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-007.md
```

---

## Session-008: Stability / Alternative Angle Observation

```text
session_id    : shikishima-session-YYYY-MM-DD-008
target        : clean B3 PASS #5
clean_b3_goal : 5/5
```

### Purpose

Observe a different screen or operation angle not covered in Session-007.
Confirm overall stability and complete the 5-session evidence set.

### Recommended Options (choose one)

```text
Option A: Control Center refresh/reopen stability
  - close and reopen Control Center
  - confirm labels remain HOLD / disabled / false on reopen
  - confirm no state change from reopen

Option B: Settings safe display observation
  - navigate to Settings
  - confirm API keys are masked
  - confirm no execution toggle is enabled
  - confirm no raw values visible

Option C: Models / provider screen safe observation
  - navigate to Models or provider screen
  - confirm no prefilled secret values
  - confirm no raw API keys visible
```

### Success Criteria (same as Session-007 plus):

```text
chosen_angle_observed : PASS
no_state_change_on_reopen : PASS (if Option A)
settings_keys_masked : PASS (if Option B)
models_no_raw_keys : PASS (if Option C)
```

### GO Template

```text
I explicitly approve this one Level B3 daily operation session only.

Approved session:
shikishima-session-YYYY-MM-DD-008

Approved time_window:
YYYY-MM-DD __:__-__:__ JST

Approved purpose:
Level B3 stability observation [Option A/B/C] — confirm [chosen angle] is safe
and record clean B3 PASS #5 evidence.

Approved command:
.\node_modules\.bin\electron.cmd .
```

### Expected Evidence

```text
docs/shikishima/LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-008.md
```

---

## After 5/5 Clean B3 PASS

```text
1. Create B3 5/5 completion acceptance record
2. Update LEVEL_3_GAP_AUDIT.md (check off clean PASS prerequisite)
3. Review remaining Level 3 prerequisites
4. Propose Level 3 GO wording review
5. Human decision: proceed to Level 3 or continue B3 first
```

---

この範囲では問題を検出していません

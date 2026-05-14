# Level B3 Next Session Plan

## Document Status

```text
roadmapVersion: v3.13.0
status: next_session_plan_v1
date_created: 2026-05-14
human_acceptance: pending
```

## Purpose

Define candidate next B3 sessions to build toward Level 3 prerequisites.
Each session requires its own time_window GO from a human.

---

## Session-004: Provider Setup Clean PASS Rerun

```text
purpose:
  Confirm consistent PASS for AI Provider setup masking.
  Second clean PASS confirms fix is stable, not a one-time artifact.

allowed_scope:
  - observe Home screen
  - observe AI Provider setup screen
  - confirm placeholder = "Paste your API key here"
  - confirm secret-like prefixes not visible
  - confirm API key field masked by default
  - confirm google/xai/nous i18n resolved
  - record evidence

forbidden_scope:
  - click Show
  - enter real API keys
  - proceed to main dashboard
  - external network / robot / voice / device
  - npm / git push / source changes

prerequisite:
  - build_is_current verified before launch
  - Session-003 acceptance confirmed

success_criteria:
  placeholder_safe_text_visible: PASS
  secret_like_prefix_hidden    : PASS
  api_key_field_default_masked : PASS
  google_xai_nous_i18n_resolved: PASS
  Show_not_clicked             : PASS
  raw_values_reported          : false

STOP_criteria:
  - any secret-like value visible
  - Show required for verification
  - unexpected external prompt
  - build stale (stale out/ detected)

required_GO_fields:
  time_window: concrete YYYY-MM-DD HH:MM-HH:MM JST
  purpose    : Level B3 daily operation session — Provider setup clean PASS rerun
  command    : .\node_modules\.bin\electron.cmd .

expected_evidence:
  docs/shikishima/LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-004.md
```

---

## Session-005: Main Screen Status Label Observation

```text
purpose:
  Navigate past Provider setup to the main Control Center.
  Verify status labels: decision=HOLD / execution=disabled / productionReady=false.

allowed_scope:
  - observe Home screen
  - proceed through Provider setup (placeholder only, no key entry)
  - observe main Control Center screen
  - record status label values (label text only, no raw values)
  - record screen name
  - record any unexpected prompts

forbidden_scope:
  - enter real API keys
  - click Show
  - trigger any AI/execution calls
  - external network / robot / voice / device
  - npm / git push / source changes

prerequisite:
  - Session-004 PASS
  - build_is_current verified

success_criteria:
  main_screen_reached         : PASS
  decision_label_HOLD         : PASS
  execution_label_disabled    : PASS
  productionReady_label_false : PASS
  no_execution_triggered      : PASS
  raw_values_reported         : false

STOP_criteria:
  - execution triggered unexpectedly
  - raw value appears
  - external network call attempted
  - robot / voice / device prompt

required_GO_fields:
  time_window: concrete YYYY-MM-DD HH:MM-HH:MM JST
  purpose    : Level B3 daily operation session — main screen status label observation
  command    : .\node_modules\.bin\electron.cmd .

expected_evidence:
  docs/shikishima/LOCAL_MVP_OPERATION_EVIDENCE_YYYY-MM-DD-005.md
```

---

## Session-006: Navigation and Status Regression Observation

```text
purpose:
  Check that navigation between screens does not trigger unexpected execution
  or reveal raw values. Confirm basic screen stability.

allowed_scope:
  - observe Home / Provider setup / main Control Center
  - navigate between available screens
  - record screen names and any unexpected behavior
  - confirm no regression in masking/labels after navigation

prerequisite:
  - Session-005 PASS

success_criteria:
  navigation_stable           : PASS
  no_regression_in_masking    : PASS
  no_execution_triggered      : PASS
  raw_values_reported         : false

STOP_criteria:
  - execution triggered
  - raw value visible after navigation
  - crash or unexpected error
```

---

## Session-007: Evidence Workflow Dry-Run

```text
purpose:
  Practice the full evidence creation + commit + push readiness loop
  with a minimal observation session, to confirm the workflow is efficient
  and reproducible for regular operation.

allowed_scope:
  - short observation (Home screen only)
  - evidence creation
  - commit
  - push readiness check
  - report timing

success_criteria:
  evidence_created : PASS
  commit_created   : PASS
  push_readiness   : PASS
  total_elapsed    : under 20 minutes
```

---

## Recommended Session Order

```text
Session-004 → Session-005 → Session-006 → Session-007 → Session-008 (provider rerun)
```

After Session-005 PASS: revisit LEVEL_3_GAP_AUDIT.md to update prerequisites met.

---

この範囲では問題を検出していません

# Post-100 Gate 004 — Operation Log Template

## Document Status

```text
roadmapVersion: v3.60.0
date: 2026-05-17
gate: Post-100 Gate 004
name: Manual Operation Log Template
status: design_ready — not yet executed
```

---

## Purpose

Each Limited Manual Operation session must produce a filled operation log.
This template must be copied and completed for every session.

---

## Operation Log Template (copy for each session)

```text
===== MANUAL OPERATION LOG =====

session_id:        [unique ID, e.g. post100-gate004-session-001]
date:              [YYYY-MM-DD HH:MM JST]
operator:          human
operation_mode:    Limited Manual Operation

--- PRE-OPERATION STATE ---
origin_main:       [commit hash]
commits_ahead:     [number]
staged:            [number]
tracked_dirty:     [number]
productionReady:   false
execution:         disabled
runtime_started:   false
port_3030_closed:  true
rawValuesReported: false

pre_checklist_completed: [true / false]
pre_checklist_issues:    [none / describe if any]

--- DRAFTS REVIEWED ---

Draft 1:
  sample_id:          [ID]
  category:           [draft category]
  external_service:   [none / describe if not none → triggers HOLD]
  action_type:        [manual_copy_only / describe if not → triggers HOLD]
  risk_level:         [low / medium / high]
  per_draft_checklist: [all_pass / hold / reject]
  checklist_issues:   [none / describe]
  decision:           [approved_for_manual_copy / hold / rejected]
  human_copy_taken:   [yes / no / not_required]
  hold_reason:        [n/a / describe if held]
  reject_reason:      [n/a / describe if rejected]

Draft 2:
  [repeat as needed]

--- POST-OPERATION STATE ---

external_write_occurred:    [false — required]
email_sent:                 [false — required]
calendar_event_created:     [false — required]
github_remote_created:      [false — required]
social_posted:              [false — required]
purchase_or_reservation:    [false — required]

safety_invariants_maintained: [true — required]
productionReady:              false
execution:                    disabled
runtime_started:              false
rawValuesReported:            false

unexpected_state_change:    [none / describe if any → may trigger STOP review]
post_checklist_completed:   [true / false]
post_checklist_issues:      [none / describe if any]

--- SUMMARY ---

drafts_total:               [number]
drafts_approved:            [number]
drafts_held:                [number]
drafts_rejected:            [number]
incidents:                  [none / Level 1 HOLD / Level 2 REJECT / Level 3 STOP]
incident_details:           [n/a / describe if any]
session_result:             [nominal / hold / reject / stop]
notes:                      [free text]

===== END LOG =====
```

---

## Filling Rules

```text
1. Copy this template before starting any operation session
2. Fill in PRE-OPERATION STATE before reviewing any draft
3. Fill in DRAFTS REVIEWED section for each draft reviewed
4. Fill in POST-OPERATION STATE after all drafts are reviewed
5. Record actual values; do not copy defaults without checking
6. If any field cannot be verified, write: unverified — describe why
7. Completed logs should be stored in docs/shikishima/ or a designated log dir
8. If an incident occurred, also fill the STOP_EVENT log (see incident response rules)
```

---

## Naming Convention for Completed Logs

```text
Format:
  POST_100_OPERATION_LOG_[session_id].md

Example:
  POST_100_OPERATION_LOG_post100-gate004-session-001.md
```

---

## Minimum Requirements for Valid Operation Log

```text
[ ] session_id present
[ ] date present
[ ] pre_checklist_completed: true
[ ] at least one draft reviewed
[ ] post_checklist_completed: true
[ ] external_write_occurred: false
[ ] safety_invariants_maintained: true
[ ] session_result stated
```

If any minimum requirement is missing, the log is incomplete and cannot serve
as evidence of a completed operation session.

---

この範囲では問題を検出していません。

# Phase Review Matrix

## Purpose

This matrix makes Phase 0-10 review and approval state explicit. Documentation
approval is not execution approval. Phase completion is not GO. Phase 10
requires separate explicit human GO approval.

Documentation approval is not execution approval.

## Current Global State

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

## Matrix

| Phase | Name | Current status | Human review status | Required approval | Remaining blocker | Related docs | Execution implication |
|---:|---|---|---|---|---|---|---|
| 0 | Current HOLD baseline | done | approved_for_documentation | baseline review | none for docs | `REAL_OPERATION_ROADMAP.md` | not_approved_for_execution |
| 1 | Naming and final vision | current | in_review | name/role approval | final human review | `SHIKISHIMA_FINAL_VISION.md`, `AGENT_NAMES_ROLES_AND_PERMISSIONS.md` | not_approved_for_execution |
| 2 | Static HTML roadmap | current | approved_for_documentation | static UI review | execution remains disabled | `REAL_OPERATION_ROADMAP.html`, `ROADMAP_CHANGELOG.md` | not_approved_for_execution |
| 3 | Agent permissions | review_ready_for_human_approval | in_review | permission matrix approval | human approval not yet given | `AGENT_NAMES_ROLES_AND_PERMISSIONS.md`, `PHASE_3_AGENT_PERMISSION_REVIEW.md` | not_approved_for_execution |
| 4 | Model Router policy | review_ready_for_human_approval | in_review | routing policy approval | human approval not yet given | `MODEL_ROUTING_POLICY.md`, `MODEL_ROUTER_REVIEW_MATRIX.md`, `PHASE_4_MODEL_ROUTER_REVIEW.md` | not_approved_for_execution |
| 5 | しずめ Safety Gate policy | review_ready_for_human_approval | in_review | safety decision matrix approval | human approval not yet given | `SHIZUME_SAFETY_GATE_POLICY.md`, `SHIZUME_DECISION_MATRIX.md`, `PHASE_5_SHIZUME_POLICY_REVIEW.md` | not_approved_for_execution |
| 6 | つむぎ implementation workflow | draft_created / documentation_only | not_reviewed | workflow review | runtime agent not implemented | `TSUMUGI_IMPLEMENTATION_WORKFLOW.md`, `TSUMUGI_TASK_TEMPLATE.md`, `TSUMUGI_SAFE_PATCH_CHECKLIST.md` | not_approved_for_execution |
| 7 | しるべ logs/templates | draft_created / documentation_only | not_reviewed | logging policy review | direct vault automation HOLD | `SHIRUBE_LOGGING_POLICY.md`, `SHIRUBE_HANDOFF_TEMPLATE.md`, `DAILY_WORKLOG_TEMPLATE.md`, `OBSIDIAN_READY_NOTE_TEMPLATE.md` | not_approved_for_execution |
| 8 | Device role plan | draft_created / documentation_only | not_reviewed | device role approval | no device setting changes approved | `DEVICE_ROLES_AND_BOUNDARIES.md`, `DEDICATED_DEVICE_PLAN.md`, `IPHONE_REVIEW_DEVICE_POLICY.md`, `ANDROID_FACE_TERMINAL_PLAN.md` | not_approved_for_execution |
| 9 | StackChan expression-only plan | draft_created / documentation_only / robot_execution_HOLD | blocked | robot safety approval | physical output policy not approved | `STACKCHAN_EXPRESSION_ONLY_PLAN.md`, `STACKCHAN_SAFETY_BOUNDARY.md`, `FACE_TERMINAL_EXPRESSION_PROTOCOL_DRAFT.md` | not_approved_for_execution |
| 10 | Minimum supervised operation | runbook_draft_created | blocked | separate explicit human GO | Phase 1-9 approvals missing | `MINIMUM_OPERATION_RUNBOOK_DRAFT.md`, `HUMAN_GO_APPROVAL_CHECKLIST.md`, `NO_GO_CHECKLIST.md`, `FIRST_SUPERVISED_OPERATION_LOG_TEMPLATE.md` | requires_separate_GO / not_approved_for_execution |

## Review Rule

If a phase is approved for documentation, it still does not approve execution,
external network, WSL, Hermes, wrapper/dummy, RunPod, StackChan, git push, or
production readiness.

この範囲では問題を検出していません。

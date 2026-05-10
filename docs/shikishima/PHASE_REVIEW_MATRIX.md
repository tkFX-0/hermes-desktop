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
| 3 | Agent permissions | pending_review | not_reviewed | permission matrix approval | agent authority boundaries | `AGENT_NAMES_ROLES_AND_PERMISSIONS.md` | not_approved_for_execution |
| 4 | Model Router policy | pending_review | not_reviewed | routing policy approval | cloud/local/router boundaries | `MODEL_ROUTING_POLICY.md`, `MODEL_ROUTER_REVIEW_MATRIX.md` | not_approved_for_execution |
| 5 | しずめ Safety Gate policy | pending_review | not_reviewed | safety decision matrix approval | GO/HOLD/REJECT rules | `SHIZUME_SAFETY_GATE_POLICY.md`, `SHIZUME_DECISION_MATRIX.md` | not_approved_for_execution |
| 6 | つむぎ implementation workflow | pending | blocked | prior phases 3-5 | safety workflow incomplete | future workflow doc | not_approved_for_execution |
| 7 | しるべ logs/templates | pending | blocked | raw-safe logging review | template policy incomplete | future templates doc | not_approved_for_execution |
| 8 | Device role plan | pending | blocked | device role approval | robot/device boundaries | `SHIKISHIMA_SYSTEM_DIAGRAM.md` | not_approved_for_execution |
| 9 | StackChan expression-only plan | hold | blocked | robot safety approval | physical output policy missing | future StackChan plan | not_approved_for_execution |
| 10 | Minimum supervised operation | hold | blocked | separate explicit human GO | all prior approvals missing | future runbook | requires_separate_GO |

## Review Rule

If a phase is approved for documentation, it still does not approve execution,
external network, WSL, Hermes, wrapper/dummy, RunPod, StackChan, git push, or
production readiness.

この範囲では問題を検出していません。

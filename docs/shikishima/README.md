# Shikishima Roadmap Docs

This directory contains static documentation for the Shikishima plan.

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

These documents are not execution approval. They do not enable WSL, Hermes,
wrapper, dummy wrapper, RunPod, StackChan, packaged smoke, or any external
network flow.

## Files

- `REAL_OPERATION_ROADMAP.html` - static browser roadmap.
- `REAL_OPERATION_ROADMAP.md` - Markdown roadmap.
- `ROADMAP_CHANGELOG.md` - visible roadmap update history.
- `PHASE_REVIEW_MATRIX.md` - Phase 0-10 documentation/execution review state.
- `SHIKISHIMA_FINAL_VISION.md` - final vision draft.
- `AGENT_NAMES_ROLES_AND_PERMISSIONS.md` - agent names, roles, and permission boundaries.
- `MODEL_ROUTING_POLICY.md` - model routing policy.
- `MODEL_ROUTER_REVIEW_MATRIX.md` - review matrix for model routing cases.
- `SHIZUME_SAFETY_GATE_POLICY.md` - Shizume safety gate policy.
- `SHIZUME_DECISION_MATRIX.md` - GO / HOLD / REJECT decision matrix.
- `SHIKISHIMA_SYSTEM_DIAGRAM.md` - system diagrams in Mermaid and ASCII.
- `ROADMAP_STATUS_SCHEMA.md` - human-readable status schema.
- `PHASE_3_AGENT_PERMISSION_REVIEW.md` - Phase 3 human review package.
- `PHASE_4_MODEL_ROUTER_REVIEW.md` - Phase 4 Model Router review package.
- `PHASE_5_SHIZUME_POLICY_REVIEW.md` - Phase 5 しずめ policy review package.
- `TSUMUGI_IMPLEMENTATION_WORKFLOW.md` - Phase 6 non-execution workflow.
- `TSUMUGI_TASK_TEMPLATE.md` - つむぎ task intake template.
- `TSUMUGI_SAFE_PATCH_CHECKLIST.md` - safe patch checklist.
- `SHIRUBE_LOGGING_POLICY.md` - redacted logging policy.
- `SHIRUBE_HANDOFF_TEMPLATE.md` - handoff template.
- `DAILY_WORKLOG_TEMPLATE.md` - daily worklog template.
- `OBSIDIAN_READY_NOTE_TEMPLATE.md` - manual Obsidian-ready note template.
- `DEVICE_ROLES_AND_BOUNDARIES.md` - device role policy.
- `DEDICATED_DEVICE_PLAN.md` - optional dedicated device plan.
- `IPHONE_REVIEW_DEVICE_POLICY.md` - iPhone review-only policy.
- `ANDROID_FACE_TERMINAL_PLAN.md` - Android face terminal plan.
- `STACKCHAN_EXPRESSION_ONLY_PLAN.md` - StackChan expression-only plan.
- `STACKCHAN_SAFETY_BOUNDARY.md` - robot safety boundary.
- `FACE_TERMINAL_EXPRESSION_PROTOCOL_DRAFT.md` - non-executable expression protocol draft.
- `MINIMUM_OPERATION_RUNBOOK_DRAFT.md` - Phase 10 runbook draft.
- `HUMAN_GO_APPROVAL_CHECKLIST.md` - future scoped GO checklist.
- `NO_GO_CHECKLIST.md` - stop/no-go checklist.
- `FIRST_SUPERVISED_OPERATION_LOG_TEMPLATE.md` - first supervised operation log template.
- `HUMAN_DOCUMENTATION_REVIEW_GUIDE.md` - safe human documentation review guide.
- `PHASE_3_APPROVAL_CHECKLIST.md` - Phase 3 documentation approval checklist.
- `PHASE_4_APPROVAL_CHECKLIST.md` - Phase 4 documentation approval checklist.
- `PHASE_5_APPROVAL_CHECKLIST.md` - Phase 5 documentation approval checklist.
- `PHASE_6_TO_10_PRE_EXECUTION_REVIEW_CHECKLIST.md` - pre-execution review checklist.
- `DOCUMENTATION_APPROVAL_RECORD_TEMPLATE.md` - manual documentation approval record.
- `EXECUTION_APPROVAL_SEPARATION_POLICY.md` - approval separation policy.

## How To Review

1. Open `REAL_OPERATION_ROADMAP.html`.
2. Check `roadmapVersion`, `lastUpdated`, and `latestUpdate`.
3. Read `ROADMAP_CHANGELOG.md`.
4. Review `PHASE_REVIEW_MATRIX.md`.
5. Review `SHIZUME_DECISION_MATRIX.md`.
6. Review `MODEL_ROUTER_REVIEW_MATRIX.md`.
7. Review the Phase 3-10 packages added in v0.3.0.
8. Review `HUMAN_DOCUMENTATION_REVIEW_GUIDE.md`.
9. Use the Phase 3/4/5 approval checklists.
10. Use `EXECUTION_APPROVAL_SEPARATION_POLICY.md` to avoid scope confusion.

If the roadmap is updated, the HTML must visibly show that it was updated.
Every roadmap-affecting change must update the visible HTML changelog and
`ROADMAP_CHANGELOG.md`.

v0.4.0 adds the human documentation review package. Documentation approval is
not execution approval, and execution approval requires a separate scoped GO
decision.

## Naming Rules

- `しきしま` may use nickname `しき`.
- `つむぎ` may use nickname `つむ`.
- `しずめ`, `はじめ`, and `しるべ` have no nicknames.
- The old code name `いちきしま` is internal historical context only.

## Static-Only Verification Scope

Allowed:

- Reading these docs.
- Editing these docs.
- Reviewing static HTML.
- Checking for external URLs, fetch/API calls, command inputs, and execution buttons.

Forbidden in this documentation task:

- WSL execution.
- Hermes execution.
- wrapper or dummy wrapper execution.
- RunPod startup.
- StackChan or robot control.
- package installation.
- external network.
- git push without separate human approval.
- GO transition.
- `productionReady: true`.

この範囲では問題を検出していません。

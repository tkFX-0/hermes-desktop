# Human Documentation Review Guide

## Purpose

This guide explains how to review the しきしま計画 documentation safely. It is
for documentation review only and does not approve execution.

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

## Recommended Review Order

1. `SHIKISHIMA_FINAL_VISION.md`
2. `AGENT_NAMES_ROLES_AND_PERMISSIONS.md`
3. `PHASE_3_APPROVAL_CHECKLIST.md`
4. `MODEL_ROUTING_POLICY.md`
5. `PHASE_4_APPROVAL_CHECKLIST.md`
6. `SHIZUME_SAFETY_GATE_POLICY.md`
7. `PHASE_5_APPROVAL_CHECKLIST.md`
8. `PHASE_6_TO_10_PRE_EXECUTION_REVIEW_CHECKLIST.md`
9. `HUMAN_GO_APPROVAL_CHECKLIST.md`
10. `NO_GO_CHECKLIST.md`

## Approval Levels

| Level | Meaning |
|---|---|
| reviewed | human has read it |
| approved_for_documentation | document can be used as a reference |
| needs_revision | document needs edits before approval |
| rejected | document should not be used |
| not_approved_for_execution | execution remains disabled |

## Rules

- Documentation approval cannot enable execution.
- Only a separate scoped human GO can approve execution.
- Push approval is separate from commit approval.
- Review notes must not include raw values.

この範囲では問題を検出していません。

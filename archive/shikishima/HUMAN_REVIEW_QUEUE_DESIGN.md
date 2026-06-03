# Human Review Queue Design

## Purpose

The Human Review Queue shows what the human should review next without
executing anything.

## Review Item Format

| Field | Meaning |
|---|---|
| itemId | stable review item ID |
| title | short review title |
| reviewStatus | pending_review, in_review, approved_for_documentation, needs_revision, rejected |
| priority | low, medium, high |
| relatedDocs | tracked docs by file name |
| nextHumanAction | one scoped review action |
| executionImplication | always not_approved_for_execution unless separately approved |

## Initial Queue

| Item | Status | Priority | Related docs | Next human action |
|---|---|---|---|---|
| Phase 3 Agent Permissions review | pending_review | high | `PHASE_3_APPROVAL_CHECKLIST.md` | decide documentation review result |
| Phase 4 Model Router review | pending_review | high | `PHASE_4_APPROVAL_CHECKLIST.md` | decide documentation review result |
| Phase 5 しずめ Safety Gate review | pending_review | high | `PHASE_5_APPROVAL_CHECKLIST.md` | decide documentation review result |
| Phase 6-10 pre-execution review | pending_review | medium | `PHASE_6_TO_10_PRE_EXECUTION_REVIEW_CHECKLIST.md` | review draft readiness |
| Push decision | separate | medium | `EXECUTION_APPROVAL_SEPARATION_POLICY.md` | approve or defer push separately |
| GO decision | separate | high | `HUMAN_GO_APPROVAL_CHECKLIST.md` | separate scoped GO only |

## Boundary

The review queue does not execute tasks. It only organizes human review.

この範囲では問題を検出していません。

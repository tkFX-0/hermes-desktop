# Roadmap Status Schema

This is a human-readable status schema only. It is not executable JSON schema
and does not require tooling.

## Fields

| Field | Meaning | Current value |
|---|---|---|
| roadmapVersion | visible roadmap version | v0.3.0 |
| lastUpdated | visible update date | 2026-05-10 |
| latestUpdate | short update summary | HOLD-safe full phase implementation loop added |
| currentDecision | current project decision | HOLD |
| executionStatus | execution gate state | disabled |
| productionReady | production readiness flag | false |
| rawValuesReported | raw-value reporting status | false |
| updatedPhases | phases changed in latest update | Phase 3, Phase 4, Phase 5, Phase 6, Phase 7, Phase 8, Phase 9, Phase 10 |
| reviewStatuses | human review state by phase | see `PHASE_REVIEW_MATRIX.md` |

## Status Values

| Status | Meaning |
|---|---|
| review_ready_for_human_approval | docs are ready for human review; not execution-approved |
| draft_created | draft document exists for review |
| documentation_only | no runtime or execution effect |
| not_approved_for_execution | execution remains disabled |
| blocked_by_execution_gate | cannot proceed without separate scoped approval |
| human_go_required | explicit human GO is required before any future execution |

## Rule

This schema describes documentation status. It does not enable execution and is
not GO approval.

この範囲では問題を検出していません。

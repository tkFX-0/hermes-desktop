# Roadmap Status Schema

This is a human-readable status schema only. It is not executable JSON schema
and does not require tooling.

## Fields

| Field | Meaning | Current value |
|---|---|---|
| roadmapVersion | visible roadmap version | v0.2.0 |
| lastUpdated | visible update date | 2026-05-10 |
| latestUpdate | short update summary | Phase 2.5-5 review matrices and update visibility added |
| currentDecision | current project decision | HOLD |
| executionStatus | execution gate state | disabled |
| productionReady | production readiness flag | false |
| rawValuesReported | raw-value reporting status | false |
| updatedPhases | phases changed in latest update | Phase 3, Phase 4, Phase 5 |
| reviewStatuses | human review state by phase | see `PHASE_REVIEW_MATRIX.md` |

## Rule

This schema describes documentation status. It does not enable execution and is
not GO approval.

この範囲では問題を検出していません。

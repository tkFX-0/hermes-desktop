# Model Routing Policy

The model router decides model tier. Individual agents do not freely choose
models.

Review matrix: `MODEL_ROUTER_REVIEW_MATRIX.md`.

Model selection is not execution approval. The model router cannot override
しずめ. Cloud model use is forbidden when local-only/private data is included.
RunPod is not a default tier; it is an explicitly approved external GPU room.

## Inputs

- taskType
- riskLevel
- privacyLevel
- latencyBudget
- qualityNeed
- monthlyCostBudget
- localOnlyDataIncluded
- humanApprovalRequired

## Tiers

| Tier | Use | Condition |
|---|---|---|
| rules_only | deterministic checks | high-risk or safety gate decisions |
| local_light | low-latency local responses | simple local tasks |
| local_medium | private/local work | local-only data included |
| cloud_mini | low-cost non-private work | cloud allowed and low risk |
| cloud_reasoner | complex reasoning | explicit approval and non-private |
| Codex/GPT | code work | explicit coding task |
| RunPod | large GPU experiment | explicit approval, on-demand only |

## Defaults

- local-first.
- local-only data stays local.
- private data does not go to cloud by default.
- high-risk tasks go through `しずめ`.
- robot/physical action defaults to HOLD.
- RunPod is never automatic.

## Current State

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

この範囲では問題を検出していません。

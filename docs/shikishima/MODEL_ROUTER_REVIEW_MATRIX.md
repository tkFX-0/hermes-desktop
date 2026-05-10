# Model Router Review Matrix

## Purpose

This matrix makes model routing reviewable before implementation. Model
selection is not execution approval and cannot override しずめ.

## Current Global State

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- API budget target: approximately 10 USD per month

## Matrix

| Case | taskType | privacyLevel | riskLevel | default model tier | cloud allowed? | External GPU allowed? | しずめ required? | human approval required? | default decision |
|---|---|---|---|---|---|---|---|---|---|
| documentation-only | docs | low | low | local_light or Codex/GPT | yes if non-private | no | no | task scoped | GO candidate |
| static HTML update | static_ui | low | low | Codex/GPT | yes if non-private | no | no | task scoped | GO candidate |
| code planning | planning | medium | medium | local_medium or cloud_reasoner | only if non-private | no | yes for high-risk | yes | HOLD |
| code editing | code | medium | medium | Codex/GPT | only if non-private | no | yes | yes | HOLD |
| test generation | test | medium | medium | Codex/GPT | only if non-private | no | yes if runtime | yes | HOLD |
| local-only/private data | private | high | high | local_medium | no | no | yes | yes | HOLD |
| high-risk execution request | execution | high | high | rules_only first | no by default | no | yes | yes | HOLD |
| WSL/Hermes/wrapper request | runtime | high | high | rules_only first | no by default | no | yes | yes | HOLD |
| RunPod request | external_gpu | medium | high | rules_only first | no by default | explicit only | yes | yes | HOLD |
| StackChan/robot request | robot | high | high | rules_only first | no by default | no | yes | yes | HOLD |
| Obsidian/logging request | logging | medium | medium | local_medium | no for private logs | no | yes if write automation | yes | HOLD |
| voice/face UI request | expression_ui | medium | medium | local_light | only if non-private | no | yes for device output | yes | HOLD |

## Defaults

- Local-first.
- Cloud is forbidden when private/local-only data is included.
- External GPU room is not a default tier; it requires explicit approval.
- Robot motion is HOLD by default.
- しずめ is required for risk escalation.

この範囲では問題を検出していません。

## v0.3.0 Review Readiness

Phase 4 is review_ready_for_human_approval. This matrix is still a policy
document only. It does not implement runtime routing, connect cloud models, or
approve execution.

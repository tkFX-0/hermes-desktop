# Phase 4 Model Router Review

## Purpose

This review package makes the Model Router policy review-ready before any
runtime implementation. It does not connect real models and does not approve
execution.

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- phaseStatus: review_ready_for_human_approval

## Routing Inputs

| Input | Meaning |
|---|---|
| taskType | documentation, planning, implementation, testing, execution request, logging, face UI, or device work |
| riskLevel | low, medium, high, unknown |
| privacyLevel | public, repo_internal, private, local_only |
| latencyBudget | realtime, interactive, batch, not_time_sensitive |
| qualityNeed | low, medium, high, critical |
| monthlyCostBudget | target around 10 USD per month unless separately approved |
| localOnlyDataIncluded | true means cloud is forbidden by default |
| humanApprovalRequired | true for high-risk or boundary-crossing work |

## Model Tiers

| Tier | Default use | Boundary |
|---|---|---|
| rules_only | high-risk classification and safety gate decisions | no generative execution |
| local_light | realtime face or display responses | local-first |
| local_medium | private/local-only reasoning | cloud forbidden |
| cloud_mini | low-risk non-private assistance | budget-aware |
| cloud_reasoner | non-private complex reasoning | explicit approval preferred |
| Codex/GPT | scoped code/docs work | not execution approval |
| RunPod | external GPU room | explicit approval only |

## Routing Case Table

| Case | Default tier | Cloud allowed? | RunPod allowed? | しずめ required? | Human approval required? | Default decision |
|---|---|---:|---:|---:|---:|---|
| docs-only edit | Codex/GPT or cloud_mini | yes if non-private | no | no | no by default | GO candidate |
| static HTML update | Codex/GPT | yes if non-private | no | no | no by default | GO candidate |
| code planning | Codex/GPT | yes if non-private | no | yes if risky | maybe | HOLD until scoped |
| code editing | Codex/GPT | yes if non-private | no | yes | yes for risky areas | HOLD until scoped |
| test generation | Codex/GPT | yes if non-private | no | yes if execution-like | maybe | HOLD until scoped |
| local-only/private data | local_medium | no | no | yes | yes | HOLD |
| high-risk execution request | rules_only | no by default | no | yes | yes | HOLD |
| WSL/Hermes/wrapper request | rules_only | no | no | yes | yes | HOLD |
| RunPod request | rules_only | no by default | explicit only | yes | yes | HOLD |
| StackChan/robot request | rules_only or local_light for display-only | no by default | no | yes | yes | HOLD |
| Obsidian/logging request | local_medium or Codex/GPT | no for private | no | yes if write automation | yes for direct write | HOLD |
| voice/face UI request | local_light | no by default | no | yes if camera/identity | yes for sensors | HOLD |

## Review Checklist

- [ ] Local-first is the default.
- [ ] Cloud is forbidden for private/local-only data.
- [ ] RunPod is an explicitly approved external GPU room, not a default tier.
- [ ] Robot realtime work prefers local_light and remains display/expression-only.
- [ ] High-risk tasks go to rules_only and しずめ first.
- [ ] Model selection is not execution approval.
- [ ] Model Router cannot override しずめ.

この範囲では問題を検出していません。

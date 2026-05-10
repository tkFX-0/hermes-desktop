# しきしま計画 — 実運用ロードマップ

## Update Status

- roadmapVersion: v0.2.0
- lastUpdated: 2026-05-10
- latestUpdate: Phase 2.5-5 review matrices and update visibility added
- baselineCommit: 181389df175d8db7241ebc13d4d3b20d66812b76
- changelog: `ROADMAP_CHANGELOG.md`
- phase review: `PHASE_REVIEW_MATRIX.md`

Every future roadmap-affecting change must visibly update
`REAL_OPERATION_ROADMAP.html`, `ROADMAP_CHANGELOG.md`, `roadmapVersion`,
`lastUpdated`, and `latestUpdate`.

## Current State

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- base machine: RTX 4070 12GB PC
- mini PC: deferred / optional
- model direction: local-first
- cloud budget target: approximately 10 USD per month
- RunPod: on-demand only, explicit approval required

This roadmap is static documentation only. It is not execution approval.

## Phase 0 — Current HOLD Baseline

Goal: clarify the HOLD baseline and document what is not ready.

Outputs:

- HOLD declaration.
- Redacted current snapshot.
- Static roadmap docs.

Forbidden:

- execution.
- WSL.
- Hermes.
- GO transition.

## Phase 1 — Naming and Final Vision

Goal: finalize agent names, roles, and nickname rules.

Outputs:

- `SHIKISHIMA_FINAL_VISION.md`
- `AGENT_NAMES_ROLES_AND_PERMISSIONS.md`

Completion condition: names and roles are human approved.

## Phase 2 — Static HTML Roadmap

Goal: provide a static HTML roadmap with no execution features.

Outputs:

- `REAL_OPERATION_ROADMAP.html`
- `REAL_OPERATION_ROADMAP.md`
- `SHIKISHIMA_SYSTEM_DIAGRAM.md`

Rules:

- no external CDN.
- no Google Fonts.
- no fetch/API calls.
- no command input.
- no execution buttons.

## Phase 3 — Agent Roles and Permissions

Goal: define agent permissions, communication routes, and safety boundaries.

Completion condition: permission matrix is human approved.

Review support added in v0.2.0:

- `PHASE_REVIEW_MATRIX.md`
- `AGENT_NAMES_ROLES_AND_PERMISSIONS.md` approval matrix

## Phase 4 — Model Router Policy

Goal: define which model tier may be used for each class of task.

Review support added in v0.2.0:

- `MODEL_ROUTER_REVIEW_MATRIX.md`
- explicit rule that model selection is not execution approval

Default:

- local-first.
- private/local-only data does not go to cloud.
- high-risk tasks go through `しずめ`.
- RunPod requires explicit approval.

## Phase 5 — しずめ Safety Gate Policy

Goal: define GO / HOLD / REJECT behavior.

This is a core blocker before any real operation.

Review support added in v0.2.0:

- `SHIZUME_DECISION_MATRIX.md`
- explicit default HOLD and scoped human approval rules

## Phase 6 — つむぎ Implementation Workflow

Goal: define how implementation work is accepted, checked, tested, and handed off.

## Phase 7 — しるべ Logs and Obsidian-Compatible Templates

Goal: prevent context loss by standardizing handoff and summary logs.

## Phase 8 — Device Role Plan

Goal: finalize roles for RTX 4070 PC, Lenovo TAB6, Redmi 12, StackChan, iPhone,
and optional mini PC.

## Phase 9 — StackChan Expression-Only Plan

Goal: keep StackChan limited to expression/face output with safety gate approval.

Forbidden:

- autonomous physical movement.
- safety-gate-free control.

## Phase 10 — Minimum Human-Supervised Operation

Goal: start the smallest possible real operation only after all prior phases are
approved.

Current result: HOLD remains.

この範囲では問題を検出していません。

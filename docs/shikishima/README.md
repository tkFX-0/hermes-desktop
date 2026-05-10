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

## How To Review

1. Open `REAL_OPERATION_ROADMAP.html`.
2. Check `roadmapVersion`, `lastUpdated`, and `latestUpdate`.
3. Read `ROADMAP_CHANGELOG.md`.
4. Review `PHASE_REVIEW_MATRIX.md`.
5. Review `SHIZUME_DECISION_MATRIX.md`.
6. Review `MODEL_ROUTER_REVIEW_MATRIX.md`.

If the roadmap is updated, the HTML must visibly show that it was updated.
Every roadmap-affecting change must update the visible HTML changelog and
`ROADMAP_CHANGELOG.md`.

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

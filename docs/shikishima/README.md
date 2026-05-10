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
- `SHIKISHIMA_FINAL_VISION.md` - final vision draft.
- `AGENT_NAMES_ROLES_AND_PERMISSIONS.md` - agent names, roles, and permission boundaries.
- `MODEL_ROUTING_POLICY.md` - model routing policy.
- `SHIZUME_SAFETY_GATE_POLICY.md` - Shizume safety gate policy.
- `SHIKISHIMA_SYSTEM_DIAGRAM.md` - system diagrams in Mermaid and ASCII.

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

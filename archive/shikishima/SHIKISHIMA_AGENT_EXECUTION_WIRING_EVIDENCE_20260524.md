# Shikishima Agent Execution Wiring Evidence - 2026-05-24

## Result

status: PASS_CANDIDATE

This record covers the first implementation pass after the agent architecture audit and reconstruction plan. The goal was to move unsafe or externally visible behavior behind draft/HOLD gates while preserving local UI response flow.

## Implemented

- Added a core policy layer under `src/main/shikishima-core/`.
- Added model assignment, response policy, StackChan speech draft, Discord reply draft, action preflight, automation contract, realtime gate, FX thesis, debate mode, and profile correction helpers.
- Added renderer-to-main channel output draft IPC for full UI response plus StackChan/Discord draft preparation.
- Changed Command Center chat follow-up behavior so StackChan output is prepared as a draft rather than spoken immediately.
- Changed `stackchan-say` and `stackchan-face` IPC to return `NEEDS_HUMAN` drafts/preflights instead of controlling the device.
- Changed Discord bot reply/report behavior to prepare drafts instead of sending.
- Added startup shadow-mode holds for daily research, sidebot, StackChan status polling, startup Discord health report, and StackChan STT/event server.
- Added hard HOLD defaults inside sidebot, STT server, and research pipeline services.
- Added skill execution preflight so higher-risk skills are held by the Level 5 gate.

## Safety Boundary

- productionReady: false
- execution: disabled
- rawValuesReported: false
- StackChan speech/control: draft/HOLD
- Discord send/report: draft/HOLD
- Discord read: preflight/HOLD
- Research pipeline Discord/Obsidian output: preflight/HOLD
- STT / camera / pat event server: startup HOLD
- Sidebot process: HOLD
- Runtime/dev server: not started by this task
- Git push: not performed

## Verification

- `npm run typecheck:node`: PASS
- `npm run typecheck:web`: PASS
- `npm test -- shikishima-core`: PASS
- Raw value scan on touched policy/wiring files: no project secrets introduced; existing token/key type names remain as API/type fields only.

## Notes

The worktree already contains unrelated tracked and untracked changes from parallel Shikishima/StackChan work. This evidence does not claim a clean tree or push readiness.

Human visual/runtime checks remain HOLD.

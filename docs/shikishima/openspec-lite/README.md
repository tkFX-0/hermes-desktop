# OpenSpec-Lite Development Notes

OpenSpec-Lite is a no-install, Markdown-only note system for Shikishima development work. It borrows the useful planning shape of proposal, spec delta, design, tasks, and archive records without adopting the OpenSpec CLI.

This is not a formal Shikishima runtime integration. It is a lightweight operating notebook for preventing vibe-coding drift while the project remains in HOLD.

Current safety state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- OpenSpec CLI: HOLD
- npm install: not approved
- git push: not approved

## Why Use It Now

During Codex, GPT, and Claude handoffs, task boundaries can scatter across chat history. OpenSpec-Lite keeps one small bundle per change:

- what can be touched
- what must stay HOLD
- what counts as GO
- what may be committed
- where the boundary stops
- whether a failure is a command failure, code failure, or safety gate failure

## Difference From OpenSpec CLI

OpenSpec-Lite does not run `openspec init`, `openspec update`, slash commands, or any package installation. It does not add telemetry, generated config, command wrappers, or automated apply flows.

OpenSpec-Lite is only Markdown:

- copyable templates
- redacted task notes
- human-readable safety gates
- archive records
- Obsidian-ready notes

## Recommended Flow

1. Copy `templates/CHANGE_NOTE_TEMPLATE.md`.
2. Fill in the current task, allowed files, forbidden files, commands, GO/HOLD/REJECT conditions, and safety boundary.
3. If the task grows, split it into proposal, spec delta, design, tasks, and archive notes.
4. Keep raw values, secrets, local-only values, local paths, and screenshots out of notes.
5. Let しずめ remain the final safety gate.

## Example

`examples/G05_BATCH_A_EXAMPLE.md` shows how a narrow ESLint Batch A task can be documented without drifting into unrelated files, broad fixes, test execution, or git push.

## Boundary

Documentation created here does not approve GO, execution, productionReady, WSL, Hermes, wrapper, RunPod, StackChan, robot motion, npm install, OpenSpec CLI, or git push.

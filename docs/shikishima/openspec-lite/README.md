# OpenSpec-Lite Development Notes

OpenSpec-Lite is a no-install, Markdown-only note system for Shikishima development work. It borrows the useful planning shape of proposal, spec delta, design, tasks, and archive records without adopting the OpenSpec CLI.

This is not a formal Shikishima runtime integration. It is a lightweight operating notebook for preventing vibe-coding drift while the project remains in HOLD.

Current safety state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- G-05: HOLD
- G-06: HOLD
- G-07: HOLD
- OpenSpec CLI: HOLD
- npm install: HOLD
- npx: HOLD
- dependency update: HOLD
- Cloudflare: deferred
- git push: not approved

## Why Use It Now

During Codex, GPT, and Claude handoffs, task boundaries can scatter across chat history. OpenSpec-Lite keeps one small bundle per change:

- what can be touched
- what must stay HOLD
- what counts as GO
- what may be committed
- where the boundary stops
- whether a failure is a command failure, code failure, or safety gate failure

## Pre-Task Adoption Flow

Use OpenSpec-Lite before handing work to Codex:

1. GPT drafts a small Lite note from the current task.
2. The Lite note names the purpose, allowed files, forbidden files, GO/HOLD/REJECT conditions, commit policy, and STOP conditions.
3. Codex receives the Lite note as the work map.
4. The result is summarized back into the Lite note.
5. A redacted copy can be pasted manually into Obsidian.

This keeps "what are we doing right now?" visible before G-05/G-06/G-07 work resumes.

## Difference From OpenSpec CLI

OpenSpec-Lite does not run `openspec init`, `openspec update`, slash commands, `npm install`, `npx`, or any package installation/update command. It does not add telemetry, generated config, command wrappers, or automated apply flows.

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

## Cloudflare

Cloudflare, Wrangler, external deploys, API tokens, and edge/runtime integration are deferred. They are outside this OpenSpec-Lite adoption task.

## Boundary

Documentation created here does not approve GO, execution, productionReady, WSL, Hermes, wrapper, RunPod, StackChan, robot motion, npm install, npx, dependency updates, OpenSpec CLI, Cloudflare, or git push.

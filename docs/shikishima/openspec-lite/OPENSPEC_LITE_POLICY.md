# OpenSpec-Lite Policy

OpenSpec-Lite adopts only the planning habit of OpenSpec. It does not adopt the CLI, generated project structure, telemetry behavior, slash-command workflows, or automated apply/update commands.

## Current Decision

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- OpenSpec CLI: HOLD
- npm install: not approved
- openspec init: not approved
- openspec update: not approved
- git push: not approved

## Allowed

- Markdown-only templates under this directory
- redacted task notes
- Obsidian-ready copy/paste notes
- proposal/spec/design/tasks/archive style thinking
- safety gate records that remain human-readable

## Forbidden

- `npm install`
- `npm update`
- `npm audit fix`
- `openspec init`
- `openspec update`
- OpenSpec CLI execution
- slash-command apply flows
- package or lockfile changes
- source or test changes from this policy
- telemetry-enabling workflows
- raw value storage
- secret storage
- local-only value storage
- git push without separate explicit approval

## Safety Gate Authority

OpenSpec-style structure can help organize dependencies and intent, but it does not decide safety.

In Shikishima, dependencies are not gates by themselves. しずめ is the safety gate, and human approval is required for scoped GO decisions. A completed note, proposal, task list, or archive record does not enable execution.

## Telemetry Position

Because telemetry policy is not fixed for this project, OpenSpec CLI usage remains HOLD. This directory avoids telemetry by avoiding CLI adoption entirely.

## Markdown-Only Adoption

The accepted adoption model is:

- no install
- no CLI
- no generated runtime structure
- no slash command
- no automatic update/apply behavior
- no external network
- no raw values

The templates are development notes only.

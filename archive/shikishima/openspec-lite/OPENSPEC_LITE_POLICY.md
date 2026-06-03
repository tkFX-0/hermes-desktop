# OpenSpec-Lite Policy

OpenSpec-Lite adopts only the planning habit of OpenSpec. It does not adopt the CLI, generated project structure, telemetry behavior, slash-command workflows, or automated apply/update commands.

## Current Decision

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- OpenSpec CLI: HOLD
- npm install: HOLD
- npx: HOLD
- dependency update: HOLD
- openspec init: not approved
- openspec update: not approved
- Cloudflare: deferred
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
- `npx`
- `pnpm dlx`
- `yarn dlx`
- `bunx`
- `openspec init`
- `openspec update`
- OpenSpec CLI execution
- slash-command apply flows
- Cloudflare Wrangler
- Cloudflare login
- Cloudflare deploy
- Cloudflare API token handling
- package or lockfile changes
- source or test changes from this policy
- telemetry-enabling workflows
- raw value storage
- secret storage
- local-only value storage
- git push without separate explicit approval

## Safety Gate Authority

OpenSpec-style structure can help organize dependencies and intent, but it does not decide safety.

In Shikishima, dependencies are not gates by themselves, and "dependencies are enablers" is not enough to proceed. しずめ is the safety gate, and human approval is required for scoped GO decisions. A completed note, proposal, task list, or archive record does not enable execution.

## Supply-Chain Freeze

Because npm/npx supply-chain risk is part of the current threat model, including Mini Shai-Hulud-style dependency risk, dependency addition and transient package execution are frozen.

Do not use:

- `npm install`
- `npm update`
- `npm audit fix`
- `npx`
- `pnpm dlx`
- `yarn dlx`
- `bunx`
- package manager commands that fetch or execute new packages

Static Markdown templates are allowed because they do not add executable dependencies.

## Telemetry Position

Because telemetry policy is not fixed for this project, OpenSpec CLI usage remains HOLD. This directory avoids telemetry by avoiding CLI adoption entirely.

## Cloudflare Deferral

Cloudflare, Wrangler, external deploys, API tokens, DNS, edge functions, and remote runtime integration are deferred. OpenSpec-Lite is not a Cloudflare adoption step.

## Markdown-Only Adoption

The accepted adoption model is:

- no install
- no npx
- no CLI
- no generated runtime structure
- no slash command
- no automatic update/apply behavior
- no external network
- no Cloudflare command
- no raw values

The templates are development notes only.

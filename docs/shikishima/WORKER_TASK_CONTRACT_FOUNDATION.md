# Worker Task Contract Foundation

Date: 2026-05-26
Goal: `shikishima.worker-task-contract-foundation`
Mode: docs-first contract foundation; no worker execution behavior change

---

## 0. Purpose

This document defines the Worker Task Contract foundation for Shikishima.

The goal is to let Codex, ClaudeCode, and future workers self-drive safely inside approved `/goal` scope without inferring authority for push, runtime, external write, dependency changes, or production execution.

This is a contract foundation, not an execution grant.

---

## 1. Non-Approval Boundary

This document does not authorize:

- unrestricted shell execution
- runtime start
- Discord send
- Obsidian actual write
- StackChan connection
- external API write
- dependency changes
- git push
- productionReady true
- execution enabled

Current invariants:

```text
productionReady: false
execution: disabled
Discord_send: HOLD
Obsidian_write: HOLD
StackChan_connection: HOLD
runtime_start: NOT_APPROVED
git_push: separate human GO only
```

---

## 2. Contract Record Shape

Each worker task should be represented by a contract:

```yaml
goal_id:
task_id:
worker:
purpose:
allowed_files:
forbidden_files:
allowed_commands:
forbidden_commands:
can_edit_source:
can_edit_docs:
can_run_tests:
can_commit:
can_push:
can_start_runtime:
can_write_external:
can_change_dependencies:
required_verification:
stop_conditions:
human_gate_requirements:
```

The contract is the authority boundary.

If an action is not listed as allowed, it is not allowed.

---

## 3. Required Fields

| Field | Required | Purpose |
|---|---|---|
| `goal_id` | yes | Links task to Master Spec / Goal Ledger |
| `task_id` | yes | Unique task reference |
| `worker` | yes | Codex / ClaudeCode / Human / other |
| `purpose` | yes | Short intent |
| `allowed_files` | yes | Exact files or globs that may be edited |
| `forbidden_files` | yes | Files/globs that must not be edited |
| `allowed_commands` | yes | Explicit command allowlist |
| `forbidden_commands` | yes | Commands that must not run |
| `can_edit_source` | yes | true/false |
| `can_edit_docs` | yes | true/false |
| `can_run_tests` | yes | true/false |
| `can_commit` | yes | true/false |
| `can_push` | yes | normally false |
| `can_start_runtime` | yes | normally false |
| `can_write_external` | yes | normally false |
| `can_change_dependencies` | yes | normally false |
| `required_verification` | yes | checks before completion |
| `stop_conditions` | yes | conditions requiring STOP |
| `human_gate_requirements` | yes | gates needed for blocked actions |

---

## 4. Allowed Files Model

Allowed files must be narrow.

Examples:

```yaml
allowed_files:
  - docs/shikishima/WORKER_TASK_CONTRACT_FOUNDATION.md
  - src/shared/external-action/**
```

Rules:

- Prefer exact files over broad globs.
- Source tasks must not automatically include docs/firmware.
- Docs-only tasks must not include `src/**`.
- Package files require Dependency GO.
- Config/env files require explicit configuration GO.

---

## 5. Forbidden Files Model

Every contract should explicitly forbid high-risk areas unless the task is specifically about them:

```yaml
forbidden_files:
  - package.json
  - package-lock.json
  - .env*
  - config*
  - docs/firmware/**
  - src/main/stackchan*
  - src/main/discord*
```

Default rule:

```text
If a forbidden file becomes necessary, STOP and request a new goal or human decision.
```

---

## 6. Allowed Commands Model

Allowed commands must be explicit.

Typical read-only commands:

```text
git status --short
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git diff --name-status
git diff --stat
git diff --check
rg <pattern>
```

Typical verification commands when source changes are allowed:

```text
npm run typecheck:node
npm run typecheck:web
npm test
```

Allowed commands do not imply runtime or external effects.

---

## 7. Forbidden Commands Model

Default forbidden commands:

```text
git push
npm install
npm update
npx
npm run dev
npm start
electron .
StackChan connection
StackChan firmware upload
Discord send
Obsidian write
external API write
runtime start
```

If a command is ambiguous, classify it as forbidden until reviewed.

---

## 8. Capability Flags

Default task contract capability flags:

```yaml
can_edit_source: false
can_edit_docs: false
can_run_tests: true
can_commit: false
can_push: false
can_start_runtime: false
can_write_external: false
can_change_dependencies: false
```

Goal-specific contracts may set:

```yaml
can_edit_docs: true
can_edit_source: true
can_commit: true
```

But these must remain false unless a separate human gate approves them:

```yaml
can_push: false
can_start_runtime: false
can_write_external: false
can_change_dependencies: false
```

---

## 9. Human Gate Actions

Always-human-GO actions:

| Action | Gate |
|---|---|
| git push | Push GO |
| runtime start | Runtime GO |
| Discord send | Discord Send GO |
| Obsidian write | Obsidian Write GO |
| StackChan connection | StackChan Connection GO |
| StackChan firmware upload | StackChan Firmware GO |
| package/dependency change | Dependency GO |
| productionReady true | ProductionReady GO |
| execution enabled | Execution Enablement GO |
| continuous autonomous operation | Continuous Autonomy GO |

These cannot be granted by normal worker contract.

---

## 10. Commit Policy

Local commit may be allowed only when:

- `can_commit: true`
- tests/checks pass
- staged files match `allowed_files`
- no forbidden files are staged
- no raw secrets or local-only values are included
- final report includes commit hash and scope

Local commit does not imply push.

---

## 11. Push Policy

Push is never allowed by normal worker task contract.

```yaml
can_push: false
```

Push requires:

- separate Push GO
- exact commit scope
- clean working tree
- diff verification
- post-push verification

---

## 12. Runtime Policy

Runtime start is never allowed by normal worker task contract.

```yaml
can_start_runtime: false
```

Runtime requires:

- Runtime GO
- command
- time window
- stop method
- expected observation
- evidence file

---

## 13. External Write Policy

External write is never allowed by normal worker task contract.

```yaml
can_write_external: false
```

This includes:

- Discord send
- X/social post or reply
- external API write
- cloud sync/write
- Obsidian actual write if treated as external/local vault effect

Drafting is allowed only when contract explicitly allows docs or draft files.

---

## 14. Dependency Policy

Dependency changes are never allowed by normal worker task contract.

```yaml
can_change_dependencies: false
```

Changing `package.json`, lockfiles, package manager state, or installed toolchain requires Dependency GO.

---

## 15. Worker-Specific Boundaries

### Codex

Codex may:

- inspect repository
- edit goal-scoped files
- run allowed checks
- create local commit if contract allows

Codex must not:

- push
- start runtime
- send Discord messages
- write Obsidian
- connect StackChan
- change dependencies

### ClaudeCode

ClaudeCode may be used for UI/source implementation goals with the same contract model.

ClaudeCode must not bypass:

- Push GO
- Runtime GO
- External Write GO
- StackChan GO
- Dependency GO

### Human

Human controls:

- push
- runtime
- external send/write
- device connection
- productionReady
- execution

---

## 16. Required Verification

Every worker task must report:

```text
branch
HEAD
origin/main
commits_ahead
staged
tracked_dirty
changed files
tests run
source changes
package changes
runtime_started
external_write
Discord_send
Obsidian_write
StackChan_connection
productionReady
execution
commit hash
push status
next recommended goal
```

---

## 17. STOP Conditions

Stop immediately if:

- allowed file scope is insufficient
- forbidden files become necessary
- forbidden command becomes necessary
- package changes become necessary
- runtime start becomes necessary
- Discord send becomes necessary
- Obsidian write becomes necessary
- StackChan connection becomes necessary
- external API write becomes necessary
- productionReady or execution mutation is requested
- raw secrets or credentials would be printed or stored
- tests require dependency installation

---

## 18. Example Contract

```yaml
goal_id: shikishima.external-action-guard-foundation
task_id: A5-guard-preview
worker: Codex
purpose: add non-executing guard preview helper
allowed_files:
  - src/shared/external-action/**
forbidden_files:
  - src/main/**
  - src/preload/**
  - docs/firmware/**
  - package.json
  - package-lock.json
allowed_commands:
  - git status --short
  - git diff --check
  - npm run typecheck:node
  - npm run typecheck:web
  - npm test
forbidden_commands:
  - git push
  - npm run dev
  - npm install
  - StackChan connection
  - Discord send
can_edit_source: true
can_edit_docs: false
can_run_tests: true
can_commit: true
can_push: false
can_start_runtime: false
can_write_external: false
can_change_dependencies: false
required_verification:
  - typecheck
  - tests
  - diff scope
stop_conditions:
  - handler behavior change required
  - external effect required
human_gate_requirements:
  - Push GO for origin/main update
```

---

## 19. Acceptance Criteria

This foundation is accepted when:

- Worker Task Contract foundation exists.
- Allowed files are modeled.
- Forbidden files are modeled.
- Allowed commands are modeled.
- Forbidden commands are modeled.
- Human gate actions are modeled.
- Commit policy is defined.
- Push policy is defined.
- Runtime policy is defined.
- External write policy is defined.
- STOP conditions are explicit.

---

## 20. Next Recommended Goal

Recommended next goal after this foundation:

```text
/goal shikishima.worker-task-contract-types
```

Purpose:

```text
Add source type/schema definitions and tests for worker task contracts.
```

Do not connect worker execution behavior until contract types and tests are stable.

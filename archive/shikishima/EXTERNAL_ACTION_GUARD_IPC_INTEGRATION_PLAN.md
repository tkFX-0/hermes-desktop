# External Action Guard IPC Integration Plan

Date: 2026-05-26
Scope: Goal A4 docs-only plan for selected IPC/manual route guard connection
Mode: planning only; no source behavior change, no runtime, no external write, no git push

---

## 0. Purpose and Non-Approval Boundary

This document decides the first minimal A5 scope for connecting `createExternalActionGuard()` to IPC/manual surfaces.

It does not authorize source behavior changes.

Current boundary remains:

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

## 1. Current Guard Foundation

Current foundation:

```text
Goal A1 route registry: pushed
Goal A2 createExternalActionGuard pure function: pushed
Goal A3 structured HOLD coverage hardening: pushed
```

The guard can now:

- classify registered routes
- return `SAFETY_HOLD`, `NOT_APPROVED`, or `DESIGN_HOLD`
- keep `effectMayRun=false` for dangerous routes
- preserve `productionReady=false`
- preserve `execution=disabled`
- preserve `rawValuesReported=false`

The guard is not yet connected to actual IPC handlers.

---

## 2. Why A4 Exists Before A5

A5 will be the first source task that may touch IPC/manual integration files.

Without A4, A5 could accidentally choose too large a surface:

- Discord send
- StackChan voice/motion/STT/camera
- runtime start
- worker shell execution
- Obsidian/local write

A4 keeps A5 minimal and non-executing.

Rule:

```text
A5 may connect guard preview/blocking behavior only.
A5 must not enable any effect.
```

---

## 3. Candidate Handler Groups

Candidate groups:

| Option | Scope | Risk | Notes |
|---|---|---|---|
| Option 1 | read-only / status-like routes only | low | Safer, but proves less about dangerous route blocking |
| Option 2 | draft-only routes only | low-medium | Useful for UI previews, but may not exercise NOT_APPROVED paths |
| Option 3 | blocked dangerous routes returning structured HOLD only | medium | Best first proof that guard blocks risky routes without executing |
| Option 4 | IPC-safe guard preview route | low | Adds a non-executing preview endpoint that returns guard decisions |

Recommended default:

```text
Option 3: blocked dangerous routes returning structured HOLD only
```

Recommended practical A5 implementation shape:

```text
Option 4 first, plus Option 3 tests.
```

This means A5 should expose or use a non-executing guard decision path first, then test dangerous route decisions through that path.

---

## 4. Excluded High-Risk Handler Groups

A5 must exclude:

- StackChan voice
- StackChan motion
- StackChan STT
- StackChan camera
- StackChan firmware upload
- Discord auto-reply
- continuous Discord polling
- runtime start
- dependency changes
- productionReady mutation
- execution enablement
- actual git push
- actual Obsidian write

These require later goals and explicit human GO.

---

## 5. Recommended A5 Minimal Scope

Recommended A5 scope:

```text
Create an IPC-safe guard preview route that returns `createExternalActionGuard()` decisions and performs no effect.
```

Selected route groups to prove through tests:

1. `discord.send` -> `SAFETY_HOLD`, `effectMayRun=false`
2. `worker.gitPush` -> `NOT_APPROVED`, `effectMayRun=false`
3. unknown/manual route -> `DESIGN_HOLD`, `effectMayRun=false`

Why this scope:

- It touches only guard preview behavior, not real send/push/device handlers.
- It validates dangerous routes through the same decision shape future handlers will consume.
- It gives renderer/Discord/worker layers a safe way to ask "what would happen?" without doing it.

Do not connect actual send/push/device functions in A5.

---

## 6. Route ID Mapping

Initial A5 route IDs:

| Route ID | Expected Decision | Effect May Run | Purpose |
|---|---|---|---|
| `discord.send` | `SAFETY_HOLD` | false | Prove send-capable routes block |
| `worker.gitPush` | `NOT_APPROVED` | false | Prove repo external write remains human-only |
| `unknown.route.preview` | `DESIGN_HOLD` | false | Prove unknown/manual route fallback |

Possible preview handler name:

```text
external-action.previewDecision
```

Possible IPC channel name:

```text
external-action:preview-decision
```

If IPC naming conflicts exist, A5 may choose a project-local convention, but it must remain non-executing.

---

## 7. Expected Behavior After A5

After A5:

- selected preview route calls `createExternalActionGuard()`
- response is a structured decision object
- dangerous selected route IDs return HOLD/NOT_APPROVED/DESIGN_HOLD
- `effectMayRun=false`
- no external operation occurs
- no Discord send occurs
- no StackChan connection occurs
- no Obsidian write occurs
- no runtime starts
- no package changes occur

Expected response shape:

```text
routeId
decision
effectType
effectMayRun
requiresHumanGo
requiresEvidence
requiredEvidence
reason
productionReady=false
execution=disabled
rawValuesReported=false
```

---

## 8. Verification Plan for A5

A5 should include tests proving:

- preview route returns `SAFETY_HOLD` for `discord.send`
- preview route returns `NOT_APPROVED` for `worker.gitPush`
- preview route returns `DESIGN_HOLD` for unknown routes
- preview route never calls Discord send
- preview route never starts runtime
- preview route never connects StackChan
- preview route never writes Obsidian
- preview route preserves `productionReady=false`
- preview route preserves `execution=disabled`
- preview route preserves `rawValuesReported=false`

Recommended checks:

```text
npm run typecheck:node
npm run typecheck:web
npm test -- external-action
full npm test if safe
git diff --check
```

---

## 9. STOP Conditions

Stop A5 if:

- actual Discord send code must be modified
- StackChan connection code must be modified
- Obsidian write code must be modified
- runtime start code must be modified
- package changes become necessary
- firmware files become touched
- preview route cannot be implemented without performing effects
- `effectMayRun` would become true for a dangerous route
- one-shot execution support becomes necessary

---

## 10. Next Goal Draft: A5 Selected Handler Guard Connection

```text
/goal shikishima.external-action-guard-foundation
Subtask: Goal A5 selected handler guard connection
```

Allowed A5 work:

- add a non-executing guard preview IPC/manual route
- return structured guard decisions
- add tests for `discord.send`, `worker.gitPush`, and unknown route previews
- no actual handler effect connection

Forbidden A5 work:

- Discord send
- git push
- StackChan connection
- Obsidian write
- runtime start
- package/dependency changes
- productionReady true
- execution enabled

Recommended A5 acceptance:

```text
selected preview handler calls createExternalActionGuard()
dangerous selected routes return structured HOLD / NOT_APPROVED / DESIGN_HOLD
effectMayRun remains false
tests prove no effect path is called
```

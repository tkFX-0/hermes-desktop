# Shikishima Agent Preimplementation Task Pack — 2026-05-24

## Objective

実装前の再構築タスクを、ClaudeCode / Codex / Human に渡せる単位へ分解する。

この Task Pack は実装許可ではない。
次に実装へ進む場合は、各タスクごとに GO を出す。

## Baseline Warning

Current branch has many local commits and tracked/untracked changes from ongoing ClaudeCode work.

Before implementation:

```text
git fetch origin
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git rev-list --count origin/main..HEAD
git status --short
```

STOP if:

```text
unexpected tracked dirty files exist
mixed StackChan and Shikishima source changes cannot be separated
unreviewed commits include Level 5 behavior
```

## Recommended Worker Routing

```text
ClaudeCode:
  Shikishima core TypeScript / Electron / React implementation

Codex:
  StackChan-only review and docs
  push readiness
  security/audit review

Human:
  push
  runtime
  Discord send
  x_search
  Obsidian write
  StackChan voice/motion/camera
  productionReady true
  execution enabled
```

## Task 1 — Freeze Startup Side Effects

Worker:

```text
ClaudeCode
```

Goal:

```text
Move app startup to shadow mode.
```

Implementation targets:

- `src/main/index.ts`
- sidebot startup
- STT server startup
- research pipeline startup
- startup health check Discord reporting

Required result:

```text
app launch does not start sidebot
app launch does not start STT server
app launch does not schedule research pipeline
app launch does not send Discord
StackChan status check remains redacted/status-only or HOLD
```

Forbidden:

```text
runtime start
Discord send
StackChan control
productionReady true
execution enabled
```

Tests:

```text
startup_shadow_mode.test
typecheck:node
typecheck:web
```

## Task 2 — Add ActionGateKernel Types

Worker:

```text
ClaudeCode
```

Goal:

```text
Add central gate model without wiring execution yet.
```

Suggested files:

- `src/main/shikishima-gates/action-gate-types.ts`
- `src/main/shikishima-gates/action-gate-kernel.ts`
- `tests/shikishima-action-gate.test.ts`

Required states:

```text
DRAFT_ONLY
NEEDS_HUMAN
APPROVED_ONE_SHOT
DENY
STOP
```

Required action kinds:

```text
discord_read
discord_write
obsidian_write
x_search
hermes_cli
claude_code
stackchan_say
stackchan_motion
stackchan_camera
stt_server
runtime_start
production_ready
execution_enable
```

## Task 3 — Wrap Effectful IPC With Preflight

Worker:

```text
ClaudeCode
```

Goal:

```text
Renderer can request drafts and preflight summaries, but cannot execute Level 5 actions directly.
```

Target IPC categories:

- StackChan say/face/speed
- Grok/Hermes chat with tool modes
- Discord read/send
- research publish
- ClaudeCode task
- agent-dispatch
- memory writes

Required rule:

```text
Every effectful handler calls ActionGateKernel before doing anything.
```

## Task 4 — Sidebot Shadow Adapter

Worker:

```text
ClaudeCode
```

Goal:

```text
Sidebot becomes a shadow-mode worker that emits draft actions only.
```

Requirements:

```text
no auto-start
no auto-restart without GO
no direct Discord send
no direct webhook creation
no direct Obsidian write
no direct StackChan command
no autonomous loop without bounded ticket
```

## Task 5 — STT / Camera / Pat Event Gate

Worker:

```text
ClaudeCode for core implementation
Codex for StackChan-specific review
```

Goal:

```text
StackChan event server requires explicit one-shot/time-window GO.
```

Required controls:

```text
server disabled by default
auth required
max body size
allowed endpoint list
allowed run count
time window
camera privacy confirmation
no continuous monitoring
mic always-on forbidden
```

## Task 6 — Skill Preflight

Worker:

```text
ClaudeCode
```

Goal:

```text
Agent skills describe side effects before execution.
```

Required fields:

```text
side_effect_level
requires_human_go
network_effect
file_write_effect
command_effect
device_effect
external_write_effect
raw_value_risk
```

Rule:

```text
detectSkill is allowed.
executeSkill requires gate decision.
```

## Task 7 — Redacted Status Model

Worker:

```text
ClaudeCode
```

Goal:

```text
Renderer receives redacted summaries only.
```

Must redact:

```text
LAN IP
token
serial ID
device ID
full local path
credential path
capture path
```

Allowed:

```text
device_label
connected boolean
gate status
last checked label
```

## Task 8 — Approval Queue Wiring

Worker:

```text
ClaudeCode
```

Goal:

```text
Existing display-only Approval Queue / Gate Dashboard receives real preflight output.
```

Still forbidden:

```text
execute button
push button
runtime button
oauth button
x_search button
obsidian write button
stackchan action button
```

## Task 9 — Tests and Verification

Worker:

```text
ClaudeCode, then Codex review
```

Required tests:

```text
startup does not start sidebot
startup does not start STT
startup does not send Discord
stackchan say requires HumanGoTicket
discord send requires HumanGoTicket
obsidian write requires HumanGoTicket
x_search requires read-only GO
productionReady true denied
execution enabled denied
raw values redacted
sidebot emits drafts only
skills require preflight
```

## Task 10 — Push Readiness Review

Worker:

```text
Codex
```

Checks:

```text
git status --short
git diff --stat origin/main..HEAD
git diff --name-only origin/main..HEAD
npm run typecheck:node
npm run typecheck:web
targeted tests
```

Required report:

```text
safe_to_push
source scope
package changes
runtime not started
external actions not performed
productionReady false
execution disabled
rawValuesReported false
```

## Suggested Implementation Order

1. Freeze startup side effects.
2. Add ActionGateKernel types and tests.
3. Wrap StackChan / Discord / research IPC.
4. Gate sidebot.
5. Gate STT/camera server.
6. Add skill preflight.
7. Add redacted status model.
8. Wire Approval Queue to preflight output.
9. Run full verification.
10. Push readiness review.

## Final HOLD List

Remain HOLD until separate human GO:

- StackChan voice
- StackChan motion / dance
- StackChan camera
- STT server
- Discord send/read
- x_search
- Obsidian write
- Hermes/WSL command execution
- sidebot autonomous loop
- productionReady true
- execution enabled

# IPC External Surface Guard Plan

Date: 2026-05-26
Scope: Shikishima Desktop IPC / preload / main / worker / integration guard design
Mode: docs-only implementation plan; no source changes, no runtime, no external write, no git push

---

## 0. Purpose and Non-Approval Boundary

This document converts `IPC_EXTERNAL_SURFACE_AUDIT.md` findings into an implementation-ready guard plan.

This plan is not approval to enable any Level 5 behavior.

Current safety boundary remains:

```text
productionReady: false
execution: disabled
rawValuesReported: false
SHADOW_MODE: true
Discord_send: HOLD
Obsidian_write: HOLD
StackChan_connection: HOLD
StackChan_voice: HOLD
StackChan_motion: HOLD
StackChan_STT: HOLD
git_push: NOT_APPROVED unless separate Push GO
```

No source behavior is changed by this document.

---

## 1. Audit Summary

The IPC external surface audit found:

```text
total_routes_found: 56
external_read_routes: 13
external_write_routes: 7
local_write_routes: 19
shell_exec_routes: 17
unknown_routes: 1
routes_without_preflight: 12
shadow_mode_gap_count: 44
```

Main conclusion:

```text
SHADOW_MODE is not sufficient as the only safety mechanism.

SHADOW_MODE may block auto-start and background services, but manual IPC and worker routes require explicit per-route guard checks.
```

---

## 2. Core Problem

Shikishima currently has strong design language around HOLD, productionReady, and execution, but the runtime surface is broader than the Shikishima-specific gate functions.

The audit found three different kinds of protection mixed together:

| Protection Type | Strength | Gap |
|---|---|---|
| `SHIKISHIMA_SHADOW_MODE` | Good for startup and background service suppression | Does not uniformly wrap manual IPC calls |
| `createActionPreflight()` | Good for Shikishima-specific draft flows | Not applied to every external-effect route |
| Per-feature HOLD constants | Useful local brake | Not centralized or traceable from renderer to effect |

The fix should not be one-off patching per handler. The system needs a common guard facade that every external-effect route can use.

---

## 3. Guard Architecture

Target architecture:

```text
Renderer / Discord / Worker / Internal Trigger
  -> preload or service boundary
  -> createExternalActionGuard()
  -> createActionPreflight() / ActionGateKernel
  -> structured decision
  -> effect adapter
  -> evidence / model trace / audit record
```

The guard is a decision boundary, not the effect executor.

The executor should receive only a decision object with:

```text
decision: DRAFT_ONLY | READ_ONLY | SAFETY_HOLD | DESIGN_HOLD | NOT_APPROVED | GO_ONE_SHOT
effectType
routeId
sourceSurface
requiresHumanGo
allowedRunCount
evidencePath
redactionPolicy
shadowModeBehavior
```

---

## 4. Proposed Common Gate Facade

Conceptual name:

```text
createExternalActionGuard()
```

It should wrap or standardize calls to existing safety primitives:

```text
createActionPreflight()
ActionGateKernel
Worker Task Contract
Memory Scope Resolver
Model Trace recorder
```

Proposed conceptual input:

```typescript
type ExternalActionGuardRequest = {
  routeId: string
  sourceSurface: "renderer" | "discord" | "worker" | "startup" | "scheduler" | "internal"
  actor: string
  effectType: ExternalEffectType
  targetSummary: string
  actionModeRequested: "draft" | "read" | "write" | "run" | "device" | "memory"
  evidencePath: string
  humanGoReference?: string
  allowedRunCount?: number
  shadowModeApplies: boolean
  rawValuePolicy: "redact" | "block" | "none"
}
```

Proposed conceptual output:

```typescript
type ExternalActionGuardDecision = {
  routeId: string
  decision: "DRAFT_ONLY" | "READ_ONLY" | "SAFETY_HOLD" | "DESIGN_HOLD" | "NOT_APPROVED" | "GO_ONE_SHOT"
  productionReady: false
  execution: "disabled"
  rawValuesReported: false
  requiresHumanGo: boolean
  effectMayRun: boolean
  reason: string
  requiredEvidence: string
  modelTrace?: object
}
```

Invariant:

```text
If a route can create an external effect, the default guard output is not effectMayRun=true.
```

---

## 5. Route Categories and Required Gate Behavior

| Effect Type | Default Decision | Required Human GO | Draft Mode Allowed | Required Evidence | SHADOW_MODE Blocks | One-shot GO | Continuous Mode |
|---|---|---|---|---|---|---|---|
| external_read | SAFETY_HOLD | yes for external services | yes | source, query, result summary | not enough by itself | possible | NOT_APPROVED unless separate gate |
| external_write | SAFETY_HOLD | yes | draft only by default | target, payload summary, send count | not enough by itself | possible | NOT_APPROVED |
| local_file_write | SAFETY_HOLD | yes unless scoped docs/task write | yes | path class, redaction, diff | no | possible | NOT_APPROVED |
| repo_write | SAFETY_HOLD | yes | draft/status only | git diff, staged scope, commit hash | no | commit may be task-approved | push separate GO only |
| shell_exec | SAFETY_HOLD | yes | command preview only | command, cwd, allowlist, output summary | no | possible for checks/builds | NOT_APPROVED |
| runtime_start | SAFETY_HOLD | yes with time window | request report only | command, window, stop method | partially | possible | NOT_APPROVED |
| network_listener | SAFETY_HOLD | yes | port plan only | host, port, auth, stop method | partially | possible | NOT_APPROVED |
| device_display | SAFETY_HOLD | yes | preview only | device, state, duration | partially | possible | NOT_APPROVED |
| device_audio | SAFETY_HOLD | yes | speech draft only | exact text, count, evidence | partially | possible | NOT_APPROVED |
| device_motion | SAFETY_HOLD | yes | motion plan only | motion name, duration, stop | partially | possible | NOT_APPROVED |
| mic_stt | SAFETY_HOLD | yes | request only | time window, consent, transcript policy | partially | possible | NOT_APPROVED |
| camera | SAFETY_HOLD | yes | still-image plan only | privacy confirmation, image count | partially | possible | NOT_APPROVED |
| memory_write | SAFETY_HOLD | yes for durable memory | redacted draft | namespace, value class, redaction | no | possible | NOT_APPROVED |
| production_gate | NOT_APPROVED | yes, critical | form only | acceptance record | no | no until blockers cleared | NOT_APPROVED |
| execution_gate | NOT_APPROVED | yes, critical | form only | acceptance record | no | no until production gate | NOT_APPROVED |
| unknown | DESIGN_HOLD | yes after design | no | route investigation | no | no | NOT_APPROVED |

---

## 6. SHADOW_MODE Coverage Strategy

`SHADOW_MODE` should remain a broad startup brake, but it should not be treated as the safety system.

Required strategy:

1. Keep `SHADOW_MODE=true` as default for startup services.
2. Add per-route guard checks for manual IPC calls.
3. Add structured HOLD responses for blocked manual paths.
4. Record whether a route is blocked by `SHADOW_MODE`, by preflight, or by both.
5. Treat any route not covered by either as `DESIGN_HOLD`.

Target rule:

```text
Auto-start path: SHADOW_MODE + route guard.
Manual IPC path: route guard required even when SHADOW_MODE exists.
Worker path: task contract + route guard required.
```

---

## 7. Discord Route Guard Plan

Separate routes:

```text
Discord read
Discord draft
Discord send
Discord auto-reply
Discord bot polling
```

Rules:

```text
read != send
draft != send
polling != auto-reply
send requires one-shot human GO and evidence
auto-reply remains NOT_APPROVED
```

Planned guard behavior:

| Route | Default | One-shot Allowed | Required Evidence |
|---|---|---|---|
| Discord read | SAFETY_HOLD or READ_ONLY after GO | yes | channel, message count, redaction |
| Discord draft | DRAFT_ONLY | yes | draft text, target summary |
| Discord send | SAFETY_HOLD | yes | exact text, target, send count = 1 |
| Discord auto-reply | NOT_APPROVED | no | future gate only |
| Discord bot polling | SAFETY_HOLD | only supervised runtime | polling window, stop method |

Implementation direction:

- Move direct send calls behind a Discord facade.
- Require `createExternalActionGuard()` for every send-capable function.
- Ensure token presence is never logged.
- Record `send_count` and `gate_restored_hold`.

---

## 8. StackChan Route Guard Plan

Separate routes:

```text
status check
face/display
voice/audio
motion/servo
touch/pat sensor
STT/microphone
camera
continuous monitoring
firmware upload
```

Rules:

```text
display-only is still device_display
voice is device_audio
motion is device_motion
STT is mic_stt
camera is camera
firmware upload is device/runtime critical
all remain HOLD unless separate GO
```

Planned guard behavior:

| Route | Effect Type | Default | One-shot Allowed | Continuous Allowed |
|---|---|---|---|---|
| status check | external_read / device probe | SAFETY_HOLD | yes | no |
| face/display | device_display | SAFETY_HOLD | yes | no |
| voice/audio | device_audio | SAFETY_HOLD | yes | no |
| motion/servo | device_motion | SAFETY_HOLD | yes | no |
| touch/pat sensor | device input | SAFETY_HOLD | yes for local test | no |
| STT/microphone | mic_stt | SAFETY_HOLD | yes | NOT_APPROVED |
| camera | camera | SAFETY_HOLD | one still image only | NOT_APPROVED |
| continuous monitoring | camera / mic / scheduler | NOT_APPROVED | no | NOT_APPROVED |
| firmware upload | device critical | NOT_APPROVED | no without firmware GO | NOT_APPROVED |

Implementation direction:

- Do not call StackChan WebSocket helpers directly from UI-facing handlers.
- Route all status, face, voice, motion, STT, and camera entry points through a StackChan guard facade.
- Treat firmware code separately from app source and require firmware-specific GO.

---

## 9. Obsidian / Local Write Guard Plan

Local write routes include:

```text
Obsidian/library evidence write
research report write
memory/profile write
config/env write
roadmap/docs write
```

Planned guard behavior:

| Write Type | Default | Allowed Draft | Required Evidence |
|---|---|---|---|
| docs-only task write | task-scoped allowed | yes | git diff |
| Obsidian/library write | SAFETY_HOLD | dry-run path only | scoped folder, redaction |
| research report write | SAFETY_HOLD | report draft | destination, no raw values |
| memory/profile write | SAFETY_HOLD | redacted proposal | namespace, source, expiry |
| config/env write | SAFETY_HOLD | no raw values | key class only |

Implementation direction:

- Add path classification before file write.
- Never return raw local paths to external channels unless explicitly approved.
- Treat `OB01_DRY_RUN=true` as a temporary local brake, not the long-term guard.

---

## 10. Worker Shell / Repo / CLI Guard Plan

Separate:

```text
read-only inspection
local file write
test command
build command
git commit
git push
runtime start
package/dependency change
external command
```

Rules:

```text
git commit may be allowed only by task contract
git push requires separate Push GO
runtime start requires time-window GO
package change requires separate dependency GO
shell command must be allowlisted
```

Planned guard behavior:

| Worker Action | Default | Required Gate |
|---|---|---|
| read-only inspection | READ_ONLY | task scope |
| local file write | SAFETY_HOLD unless task-approved | file scope |
| tests/typecheck/lint | SAFETY_HOLD or task-approved | command allowlist |
| build command | SAFETY_HOLD | build GO |
| git commit | SAFETY_HOLD or task-approved | staged scope |
| git push | NOT_APPROVED | Push GO |
| runtime start | NOT_APPROVED | Runtime GO |
| dependency change | NOT_APPROVED | Dependency GO |
| arbitrary external command | NOT_APPROVED | explicit review |

Implementation direction:

- Worker bridges should accept a structured task contract, not raw free-form external authority.
- Codex/ClaudeCode execution should emit route trace and command class.
- Add shell allowlist tests before enabling broader automation.

---

## 11. Memory Write Guard Plan

Separate memory scopes:

```text
short-term context
task memory
project memory
persona preference
domain memory
excluded memory
```

Rules:

```text
FX / EA / propfirm / jobsearch memory must not be injected into Shikishima development by default.
raw secrets, tokens, IPs, local paths, credentials must not be saved.
memory write must produce redacted evidence.
```

Default active profile:

```yaml
activeMemoryProfile: shikishima-development
activeNamespaces:
  - shikishima
  - discord-ops
  - codex
  - claude-code
blockedByDefault:
  - fx-trading
  - mql-ea
  - propfirm
  - jobsearch
```

Implementation direction:

- Add memory namespace resolver before durable memory write.
- Add raw-value scanner at memory boundary.
- Require evidence for durable preference/persona updates.
- Keep domain memories opt-in.

---

## 12. ProductionReady / Execution Gate Plan

`productionReady` and `execution` are critical release gates, not ordinary settings.

Rules:

```text
productionReady remains false.
execution remains disabled.
No UI, IPC, config, worker, or Discord path may flip them without final acceptance GO.
```

Implementation direction:

- Treat productionReady and execution as immutable at normal runtime.
- Allow only draft activation records.
- Any mutation path must be isolated behind a critical gate requiring final acceptance evidence.

---

## 13. Model Trace / Evidence Integration

Every guarded route should produce or attach a trace record:

```json
{
  "routeId": "DISCORD-SEND-ONE-SHOT",
  "agentId": "shirube",
  "provider": "unknown",
  "model": "unknown",
  "fallbackUsed": false,
  "routeReason": "discord_one_shot_send",
  "memoryProfile": "shikishima-development",
  "personaProfile": "shirube-recordkeeper",
  "sourceChannel": "discord",
  "safetyDecision": "SAFETY_HOLD",
  "actionMode": "draft_only",
  "effectType": "external_write"
}
```

Evidence should record:

```text
human_go_reference
allowed_run_count
actual_run_count
rawValuesReported
gate_restored_hold
productionReady
execution
```

---

## 14. Phased Implementation Plan

```text
Phase 0: docs-only guard plan
Phase 1: type/schema definitions only
Phase 2: read-only route classification tests
Phase 3: guard facade implementation for draft/read-only routes
Phase 4: external write and device routes remain HOLD but return structured HOLD
Phase 5: one-shot GO support for selected routes
Phase 6: continuous mode remains NOT_APPROVED until separate gate
```

Recommended task order:

1. Define `ExternalEffectType`, `ExternalActionMode`, and guard decision types.
2. Add route registry for known IPC and worker routes.
3. Add tests that every route is classified.
4. Add guard facade returning structured HOLD for dangerous routes.
5. Move Discord send and StackChan entry points behind guarded facades.
6. Add memory redaction and namespace checks.
7. Add one-shot GO support only after tests pass.

---

## 15. Test Plan

Proposed tests, not implemented by this document:

```text
preflight required tests
SHADOW_MODE manual IPC tests
Discord send blocked tests
StackChan voice/motion/STT blocked tests
worker shell allowlist tests
memory redaction tests
productionReady cannot flip tests
execution cannot enable tests
unknown route DESIGN_HOLD tests
```

Additional checks:

```text
renderer cannot invoke unclassified external effect
preload exports cannot bypass guard
Discord read and send remain separate
StackChan status does not imply voice/motion approval
git commit approval does not imply git push approval
runtime start cannot be inferred from typecheck/build approval
```

---

## 16. Acceptance Criteria

Guard implementation should not be accepted until:

- every IPC route has a route ID and effect classification
- every external write path returns HOLD without explicit GO
- every device route returns HOLD without explicit GO
- every shell command path has an allowlist or task contract
- every memory write uses namespace and raw-value checks
- productionReady cannot become true from normal UI/IPC/config
- execution cannot become enabled from normal UI/IPC/config
- unknown routes return DESIGN_HOLD
- evidence includes route ID, decision, and raw value status

---

## 17. STOP Conditions

Stop implementation if:

- a route cannot be classified
- a handler can perform external write without guard
- a renderer/preload API can directly trigger device/audio/motion/camera
- raw secrets, tokens, IPs, credentials, or full local paths would be stored
- package/dependency change becomes necessary without dependency GO
- runtime start becomes necessary without runtime GO
- git push is requested without Push GO
- productionReady or execution mutation is requested before final acceptance

---

## 18. Next Implementation Task Draft

```text
Task: IPC External Surface Guard Types and Route Registry

Goal:
  Add type/schema definitions and a static route registry for known IPC and worker external-effect routes.

Allowed:
  source type files
  route registry file
  tests for route classification

Not allowed:
  changing actual handler behavior yet
  runtime start
  Discord send
  Obsidian write
  StackChan connection
  external API write
  productionReady true
  execution enabled

Expected result:
  All known routes from IPC_EXTERNAL_SURFACE_AUDIT.md are represented in a typed registry.
  Unknown routes are classified as DESIGN_HOLD.
  No external effect behavior changes.
```

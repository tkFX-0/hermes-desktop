# Shikishima Autonomy Implementation Master Spec

Date: 2026-05-26
Scope: Shikishima Desktop `/goal`-based autonomy implementation control
Mode: master planning spec; no runtime, no external effect, no push approval

---

## 0. Purpose

This document defines the master implementation standard for future Shikishima autonomy work.

From this point forward, Shikishima development should be organized as bounded `/goal` work rather than open-ended one-shot autonomy requests.

The purpose is to let Codex self-drive inside approved goal scope while preserving human control over external effects, runtime, push, production readiness, and execution enablement.

---

## 1. Non-Approval Boundary

This document is not approval for unrestricted autonomy.

Current safety boundary remains:

```text
productionReady: false
execution: disabled
rawValuesReported: false
Discord_send: HOLD
Obsidian_write: HOLD
StackChan_connection: HOLD
StackChan_firmware: HOLD
runtime_start: NOT_APPROVED
git_push: separate human GO only
```

This document does not authorize:

- runtime start
- Discord send
- Obsidian write
- StackChan connection
- StackChan firmware upload
- external API write
- package/dependency changes
- productionReady true
- execution enabled
- git push

---

## 2. Current Confirmed Baseline

Verified local baseline at creation:

```text
branch: main
HEAD: efd0b2586ab686516958af5db234512d37781cb7
origin/main: efd0b2586ab686516958af5db234512d37781cb7
commits_ahead: 0
staged: 0
tracked_dirty: 0
```

Recent completed foundation:

- `SYSTEM_DESIGN_OVERVIEW.md` repaired and pushed.
- `IPC_EXTERNAL_SURFACE_AUDIT.md` created and pushed.
- `IPC_EXTERNAL_SURFACE_GUARD_PLAN.md` created and pushed.
- External action route registry implemented and pushed in `efd0b25`.

Current implementation boundary:

```text
route registry: implemented
createExternalActionGuard(): not implemented
handler integration: not implemented
Discord-first full operation: not approved
StackChan: HOLD
```

---

## 3. Definition of Final Autonomy

Final Shikishima autonomy means bounded autonomy.

It does not mean unlimited autonomy.

Shikishima may self-drive only inside an approved goal scope with explicit allowed files, allowed commands, verification requirements, STOP conditions, and commit policy.

External effects, push, runtime start, Discord send, Obsidian write, StackChan device action, dependency changes, productionReady, and execution enablement require explicit human GO.

Final autonomy is acceptable only when it is:

- bounded
- visible
- traceable
- reversible
- redacted
- evidence-producing
- human-gated for Level 5 actions

---

## 4. Bounded Autonomy Principle

Bounded autonomy means:

```text
Codex may plan, inspect, implement, test, and locally commit inside an approved goal.
Codex may not infer permission for actions outside the goal.
```

Every goal must define:

- purpose
- allowed work
- forbidden work
- likely files
- allowed commands
- verification
- commit policy
- STOP conditions
- next dependent goal

If a route is unknown, it defaults to:

```text
DESIGN_HOLD
effectMayRun: false
requiresHumanGo: true
```

---

## 5. `/goal` Workflow Standard

Mandatory future workflow:

```text
Master Spec
↓
Goal Tree
↓
Goal-level permissions
↓
Codex self-drive within approved goal
↓
verification
↓
local commit
↓
human push approval
```

Do not use:

```text
one-shot GO to full autonomy
```

Use:

```text
bounded autonomy per goal
```

Each `/goal` request should name:

- goal id
- scope
- source of truth docs
- allowed files
- forbidden files
- allowed commands
- forbidden commands
- acceptance criteria
- commit policy

---

## 6. Goal Tree Overview

| Goal | Name | Status | Purpose |
|---|---|---|---|
| Goal A | External Action Guard Foundation | in progress | Guard all external-effect routes |
| Goal B | Worker Task Contract Foundation | planned | Standardize worker authority and file/command scope |
| Goal C | Memory Scope / Persona / Model Trace Foundation | planned | Make responses traceable and profile-safe |
| Goal D | Discord-first Command Intake | planned | Use Discord as primary command surface without enabling send by default |
| Goal E | Report Draft / Evidence Pipeline | planned | Produce safe reports and evidence without uncontrolled writes |
| Goal F | One-shot External Operation Gate | planned | Allow selected one-shot external operations under human GO |
| Goal G | Runtime Observation Gate | planned | Run controlled runtime observation only inside time-window GO |
| Goal H | StackChan Re-entry Gate | HOLD | Reintroduce StackChan after guard architecture exists |
| Goal I | Semi-autonomous Operation Loop | future | Limited loop after all gates and evidence pass |

---

## 7. Goal A: External Action Guard Foundation

Purpose:

Create a common guard foundation for external-effect routes.

Allowed work:

- type definitions
- route registry
- pure guard decision function
- structured HOLD/NOT_APPROVED/DESIGN_HOLD tests
- read-only classification tests
- documentation updates

Forbidden work:

- changing actual IPC handler behavior before the guard decision layer is tested
- Discord send
- Obsidian write
- StackChan connection
- runtime start
- external API write
- productionReady true
- execution enabled

Required or likely files:

- `src/shared/external-action/**`
- future guarded test files
- docs under `docs/shikishima/**`

Required tests:

- route ids unique
- unknown route returns DESIGN_HOLD
- external write requires preflight
- device routes require human GO
- productionReady and execution remain NOT_APPROVED

Acceptance criteria:

- route registry exists
- pure guard decision exists
- dangerous route defaults are enforced by tests
- no handler behavior changed until a later goal

Next dependent goal:

- Goal B or Goal A integration subgoal.

Current subgoal map:

```text
A1: route registry: DONE / pushed
A2: createExternalActionGuard pure function: next candidate
A3: structured HOLD decision tests
A4: guarded IPC/manual route integration plan
A5: handler integration with no behavior expansion
```

---

## 8. Goal B: Worker Task Contract Foundation

Purpose:

Standardize what Codex, ClaudeCode, and other workers may do inside a task.

Allowed work:

- worker task contract schema
- file scope model
- command allowlist model
- commit policy model
- push prohibition model
- worker evidence template

Forbidden work:

- arbitrary shell authority
- dependency installation without Dependency GO
- runtime start without Runtime GO
- git push without Push GO
- source changes outside declared goal scope

Required or likely files:

- `src/shared/external-action/**`
- possible worker contract shared types
- docs under `docs/shikishima/**`

Required tests:

- git push classified NOT_APPROVED
- runtime start classified NOT_APPROVED
- dependency changes classified NOT_APPROVED
- test/build commands require allowlist

Acceptance criteria:

- every worker action has a classified authority level
- no worker can infer push/runtime/dependency permission from commit permission

Next dependent goal:

- Goal D and Goal F.

---

## 9. Goal C: Memory Scope / Persona / Model Trace Foundation

Purpose:

Make every answer traceable and prevent unrelated memories from contaminating Shikishima development.

Allowed work:

- memory namespace spec
- model trace schema
- persona constraint schema
- tests for profile isolation
- redaction policy

Forbidden work:

- storing raw secrets
- storing raw local paths
- mixing FX / EA / propfirm / jobsearch memory into Shikishima development by default
- changing AI provider behavior without trace evidence

Required or likely files:

- shared trace types
- memory scope resolver types
- persona policy docs/tests

Required tests:

- default active profile is `shikishima-development`
- blocked namespaces do not inject by default
- model trace includes agent/provider/model/fallback/memory/persona/safety decision

Acceptance criteria:

- response provenance becomes inspectable
- persona rules become testable constraints rather than prose only

Next dependent goal:

- Goal D.

---

## 10. Goal D: Discord-first Command Intake

Purpose:

Make Discord the practical primary command surface while keeping Discord send and auto-reply gated.

Allowed work:

- Discord read classification
- command parsing draft
- safe intake summary
- response draft generation
- route trace recording

Forbidden work:

- Discord send without one-shot GO
- Discord auto-reply
- continuous polling without runtime window GO
- token logging

Required or likely files:

- Discord intake parsing files
- route guard integration files
- evidence docs

Required tests:

- read does not imply send
- draft does not imply send
- polling does not imply auto-reply
- send remains SAFETY_HOLD unless GO reference exists

Acceptance criteria:

- Discord can be used as command intake without external write
- all outgoing messages remain draft-only unless explicitly approved

Next dependent goal:

- Goal E and Goal F.

---

## 11. Goal E: Report Draft / Evidence Pipeline

Purpose:

Create reports and evidence in a controlled draft pipeline without uncontrolled local or external writes.

Allowed work:

- report draft generation
- evidence template generation
- redacted summaries
- local docs-only writes inside task scope

Forbidden work:

- Obsidian write without local note GO
- external publish
- raw value report
- unattended scheduled report write

Required or likely files:

- report/evidence modules
- docs templates
- redaction helpers

Required tests:

- report path is scoped
- raw values are redacted
- external publish remains HOLD

Acceptance criteria:

- evidence can be created safely for every goal
- reports are distinguishable from external publication

Next dependent goal:

- Goal F.

---

## 12. Goal F: One-shot External Operation Gate

Purpose:

Allow selected external operations one at a time under explicit human GO.

Allowed work:

- one-shot GO schema
- allowed run count checks
- after-action evidence
- gate restored HOLD verification

Forbidden work:

- retry loops
- autonomous escalation
- continuous polling
- background daemon
- implied future permission

Required or likely files:

- external action guard
- evidence templates
- one-shot route adapters

Required tests:

- allowedRunCount defaults to 1
- second execution is blocked
- missing GO reference returns SAFETY_HOLD
- gate restored HOLD is required in evidence

Acceptance criteria:

- one-shot operations are auditable and non-recurring
- external writes remain impossible without exact GO

Next dependent goal:

- Goal G.

---

## 13. Goal G: Runtime Observation Gate

Purpose:

Allow controlled runtime observation only with explicit time-window GO.

Allowed work:

- runtime request form
- stop method
- observation checklist
- post-run evidence

Forbidden work:

- `npm run dev` without Runtime GO
- background runtime after window
- runtime plus external write without separate GO
- productionReady or execution changes

Required or likely files:

- runtime request docs
- observation evidence docs
- guard checks for runtime_start

Required tests:

- runtime route defaults NOT_APPROVED
- time window required
- stop method required

Acceptance criteria:

- runtime can be observed without becoming autonomous execution

Next dependent goal:

- Goal I later.

---

## 14. Goal H: StackChan Re-entry Gate

Purpose:

Bring StackChan back only after external action guard foundations are ready.

Allowed work:

- StackChan route classification
- device status draft
- face/display draft
- voice one-shot draft
- motion test draft
- firmware rollback planning

Forbidden work:

- StackChan connection without GO
- voice without exact text GO
- motion without motion GO
- STT/mic without microphone GO
- camera without camera GO
- firmware upload without firmware GO

Required or likely files:

- StackChan route guard docs
- device evidence templates
- firmware rollback docs

Required tests:

- voice defaults SAFETY_HOLD
- motion defaults SAFETY_HOLD
- STT defaults SAFETY_HOLD
- camera defaults SAFETY_HOLD
- firmware upload defaults NOT_APPROVED

Acceptance criteria:

- StackChan cannot be invoked from Discord/renderer/worker without explicit route guard

Next dependent goal:

- Goal F for one-shot device actions.

---

## 15. Goal I: Semi-autonomous Operation Loop

Purpose:

Introduce a limited autonomous loop only after route guards, worker contracts, memory scope, trace, Discord intake, and evidence pipelines are complete.

Allowed work:

- loop design
- bounded scheduler model
- pause/stop contract
- dry-run simulation
- human review checklist

Forbidden work:

- continuous autonomous operation before acceptance
- automatic external writes
- automatic Discord send
- automatic StackChan device actions
- automatic productionReady or execution activation

Required or likely files:

- scheduler guard types
- kill switch policy
- evidence loop templates

Required tests:

- no hidden retry loop
- no auto-escalation
- pause/stop always available
- external effect still requires gate

Acceptance criteria:

- loop is visible, stoppable, bounded, and evidence-producing

Next dependent goal:

- final acceptance review.

---

## 16. Permissions Matrix

| Action | Default | May Codex Self-Drive Inside Goal | Human GO Required |
|---|---|---|---|
| docs planning | allowed | yes | no |
| type/schema source work | goal-scoped | yes | no if approved goal |
| pure function tests | goal-scoped | yes | no if approved goal |
| handler behavior change | HOLD | only if goal explicitly says so | yes for risky route |
| local commit | goal-scoped | yes | no if commit policy allows |
| git push | NOT_APPROVED | no | yes |
| runtime start | NOT_APPROVED | no | yes |
| Discord read | SAFETY_HOLD | only with goal/GO | yes |
| Discord send | SAFETY_HOLD | no | yes |
| Obsidian write | SAFETY_HOLD | no | yes |
| StackChan status | SAFETY_HOLD | no | yes |
| StackChan voice | SAFETY_HOLD | no | yes |
| StackChan motion | SAFETY_HOLD | no | yes |
| StackChan STT | SAFETY_HOLD | no | yes |
| StackChan camera | SAFETY_HOLD | no | yes |
| external API write | SAFETY_HOLD | no | yes |
| package/dependency change | NOT_APPROVED | no | yes |
| productionReady true | NOT_APPROVED | no | yes, final acceptance only |
| execution enabled | NOT_APPROVED | no | yes, final acceptance only |

---

## 17. Always-Human-GO Actions

These always require explicit human GO:

- git push
- runtime start
- Discord send
- Obsidian write
- StackChan connection
- StackChan firmware upload
- StackChan voice
- StackChan motion
- StackChan STT
- StackChan camera
- external API write
- package/dependency changes
- productionReady true
- execution enabled
- continuous autonomous polling
- continuous autonomous operation

Human GO must include:

- target
- purpose
- time window if runtime/device/network
- allowed run count
- stop conditions
- evidence file
- rollback or disable method

---

## 18. Forbidden Until Separate Gate

The following remain forbidden until a separate gate exists:

- Discord auto-reply
- continuous Discord polling with write capability
- continuous StackChan camera monitoring
- microphone always-on
- autonomous StackChan motion
- firmware upload without rollback plan
- X / social write actions
- automatic Obsidian publishing
- dependency updates
- productionReady true
- execution enabled

---

## 19. Required Verification Per Goal

Each `/goal` task must report:

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

Minimum checks:

- `git status --short`
- `git diff --name-status`
- `git diff --check`
- relevant typecheck/tests for source tasks

---

## 20. Commit and Push Policy

Codex may create a local commit only if the approved goal allows it and verification passes.

Commit rules:

- stage only goal-scoped files
- do not stage untracked logs/images/local notes unless explicitly approved
- do not include secrets, raw tokens, credentials, or local-only config
- summarize test results in final report

Push rules:

```text
git push is never implied by local commit.
push requires separate human Push GO.
```

Push readiness must verify:

- branch
- HEAD
- origin/main
- commits ahead
- exact commits
- changed files
- package/firmware/source scope
- no dirty worktree
- no excluded backup branch

---

## 21. Evidence and Trace Policy

Every goal must produce traceable evidence appropriate to its risk.

Required evidence fields:

```text
goal_id
source_of_truth_docs
changed_files
tests_run
safety_invariants
external_effects
rawValuesReported
productionReady
execution
commit_hash
push_status
```

External-effect routes must eventually include Model Trace:

```json
{
  "agentId": "tsumugi",
  "provider": "claude",
  "model": "claude-sonnet",
  "fallbackUsed": false,
  "routeReason": "implementation_request",
  "memoryProfile": "shikishima-development",
  "personaProfile": "tsumugi-dev",
  "sourceChannel": "discord",
  "safetyDecision": "SAFETY_HOLD",
  "actionMode": "draft_only"
}
```

---

## 22. STOP Conditions

Stop immediately if:

- source changes become necessary in a docs-only goal
- package changes become necessary without dependency GO
- runtime start appears necessary without Runtime GO
- Discord send appears necessary without Discord Send GO
- Obsidian write appears necessary without Local Write GO
- StackChan connection appears necessary without StackChan GO
- external API write appears necessary without external write GO
- productionReady or execution mutation is requested before final acceptance
- raw secrets or credentials would be printed or stored
- a goal would imply unlimited autonomy
- a route is unknown and cannot be classified
- tests require dependency installation

---

## 23. Completion Criteria

Shikishima autonomy implementation is not complete until:

- External Action Guard foundation is implemented and tested.
- Worker Task Contract foundation is implemented and tested.
- Memory Scope / Persona / Model Trace foundations are implemented and tested.
- Discord-first intake is guarded and evidence-producing.
- Report and evidence pipeline is redacted and scoped.
- One-shot external operation gate works with run count and HOLD restoration.
- Runtime observation gate has time-window and shutdown requirements.
- StackChan re-entry is guarded by route and modality.
- Semi-autonomous loop is dry-run proven before live operation.
- productionReady remains false until final human acceptance.
- execution remains disabled until final human acceptance.

---

## 24. Next `/goal` Task

Recommended next goal:

```text
/goal shikishima.external-action-guard-foundation
```

Recommended subtask:

```text
Goal A2: createExternalActionGuard pure function
```

Allowed next work:

- pure guard function
- structured HOLD decision tests
- no handler integration yet
- no external effects

Expected result:

```text
routeId
↓
registry lookup
↓
guard decision
↓
effectMayRun=false by default for dangerous routes
```

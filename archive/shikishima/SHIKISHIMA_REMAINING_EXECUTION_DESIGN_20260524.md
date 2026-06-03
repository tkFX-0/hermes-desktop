# Shikishima Remaining Execution Design — 2026-05-24

## Result

```text
status: EXECUTION_DESIGN_INVENTORY_COMPLETE
scope: remaining wiring / execution boundary / staged rollout
implementation_started_by_this_doc: false
runtime_started: false
discord_action_performed: false
stackchan_controlled: false
obsidian_written: false
x_search_executed: false
productionReady: false
execution: disabled
rawValuesReported: false
git_push_performed: false
```

## Purpose

`src/main/shikishima-core` に追加した中核ポリシーを、既存の live 経路へどう接続するかを洗い出す。

この設計書は、実装順・HOLD境界・GO条件を定義する。

## New Core Available

Implemented and tested:

- Model Assignment Registry
- ProfilePolicy
- ResponsePolicy
- ActionGateKernel
- ProfileCorrectionStore
- AutomationContract
- RealtimeGate
- FxThesisPolicy
- DebateMode
- PreflightFactory
- Dry-run OperationLedger
- StackChanSpeechDraft
- DiscordReplyDraft
- ChannelOutputPolicy
- Automation / FX / Debate builders

Current checks:

```text
npm test -- shikishima-core: PASS
npm run typecheck:node: PASS
```

## Remaining Live Integration Points

### 1. Renderer chat -> StackChan auto speech

Current risk:

```text
Renderer receives Grok reply and then calls stackchanSay(reply) directly.
```

Target:

```text
Renderer or main receives full response.
prepareChannelOutputBundle() creates:
  - UI full response
  - Discord draft
  - StackChan spoken_response draft
  - ledger candidates
StackChan speech remains NEEDS_HUMAN.
No stackchanSay call in this phase.
```

Implementation phase:

```text
Phase WIRE-01: Replace direct StackChan auto-speech with draft-only bundle.
```

Acceptance:

```text
full response still appears in UI
spoken_response appears as draft/status only
stackchanSay is not called
preflight decision is NEEDS_HUMAN
```

### 2. Electron IPC stackchan-say / stackchan-face

Current risk:

```text
Renderer can invoke stackchan-say and stackchan-face directly.
```

Target:

```text
stackchan-say-draft:
  returns prepared StackChanSpeechDraft

stackchan-say-approved:
  future only, requires HumanGoTicket
```

Implementation phase:

```text
Phase WIRE-02: Add draft IPC; keep direct action disabled or behind gate.
```

Acceptance:

```text
direct speech path cannot execute without ticket
face/motion stay HOLD
```

### 3. Discord bot reply send

Current risk:

```text
Discord bot can dispatch to agent and send reply using sendDiscordMessage.
```

Target:

```text
Discord bot produces DiscordReplyDraft only.
Draft is visible/logged for human review.
sendDiscordMessage requires approved one-shot ticket.
```

Implementation phase:

```text
Phase WIRE-03: Discord draft-only reply mode.
```

Acceptance:

```text
bot can read/route if gate allows
reply draft exists
send count remains 0
NEEDS_HUMAN is recorded
```

### 4. Startup side effects

Current risk:

```text
app.whenReady starts:
  - daily research pipeline
  - sidebot
  - StackChan status timer
  - startup health check Discord report
  - STT/event/camera server
```

Target:

```text
default startup mode: shadow
all effectful services default HOLD
status-only checks must be redacted and non-mutating
```

Implementation phase:

```text
Phase WIRE-04: Startup shadow mode.
```

Acceptance:

```text
sidebot not started by default
stt server not started by default
daily research not scheduled by default
health check does not send Discord by default
```

### 5. STT / camera / pat server

Current risk:

```text
STT server accepts /audio, /event, /camera and callbacks can route to agent and StackChan speech/motion.
```

Target:

```text
server disabled by default
auth and time window required
camera one-shot only
mic loop HARD_HOLD
pat/motion requires explicit gate
```

Implementation phase:

```text
Phase WIRE-05: STT server gate wrapper.
```

Acceptance:

```text
no server listen unless HumanGoTicket
continuous mic/camera cannot open
StackChan speech from transcript remains draft-only unless approved
```

### 6. Agent skill execution

Current risk:

```text
detectSkill -> executeSkill can run commands or write notes.
```

Target:

```text
detectSkill -> describeSideEffects -> ActionGateKernel -> execute only if allowed
```

Implementation phase:

```text
Phase WIRE-06: Skill preflight.
```

Acceptance:

```text
typecheck/debug/write skills do not run without gate
skills can still generate draft plans
```

### 7. Research pipeline / x_search / publish

Current risk:

```text
research pipeline can schedule read/write/publish actions.
```

Target:

```text
x_search read-only requires read-only GO
publish requires external write GO
scheduled pipeline requires AutomationContract
```

Implementation phase:

```text
Phase WIRE-07: Research pipeline preflight and contract.
```

Acceptance:

```text
schedule is draft/disabled by default
publishResearchReport cannot send/write without ticket
```

### 8. Sidebot process

Current risk:

```text
sidebot is a parallel runtime with Discord, StackChan, memory, task, and slot paths.
```

Target:

```text
sidebot becomes shadow worker
no auto-start
no auto-restart without GO
direct effects replaced by draft/preflight calls
```

Implementation phase:

```text
Phase WIRE-08: Sidebot shadow adapter.
```

Acceptance:

```text
sidebot cannot send Discord
sidebot cannot control StackChan
sidebot cannot run autonomous slot
```

### 9. Profile correction persistence

Current risk:

```text
User correction does not reliably override persistent memory, persona, sidebot, or StackChan output.
```

Target:

```text
ProfileCorrectionStore is persisted.
all response paths call checkProfileCompliance
StackChan spoken_response runs through same policy
```

Implementation phase:

```text
Phase WIRE-09: Profile correction persistence and UI/API.
```

Acceptance:

```text
forbidden phrase is blocked in UI, Discord draft, StackChan draft
```

### 10. FX live thesis

Current risk:

```text
FX analysis, market observation, and position talk can blur into execution-like advice.
```

Target:

```text
Chihaya returns FxThesis only.
tradeExecution always false.
positionIntent is thesis only.
```

Implementation phase:

```text
Phase WIRE-10: Chihaya FX schema wrapper.
```

Acceptance:

```text
trade execution cannot be represented as true
human decision required before any position
```

### 11. Debate mode

Current gap:

```text
Agents exist, but structured debate output is not wired.
```

Target:

```text
createStandardDebateDraft() aggregates positions.
final output requires human decision.
```

Implementation phase:

```text
Phase WIRE-11: Agent debate draft workflow.
```

Acceptance:

```text
debate produces recommendation only
no execution follows debate automatically
```

## Recommended Execution Order

```text
1. WIRE-01 Renderer chat -> channel output draft
2. WIRE-02 StackChan IPC draft/gated split
3. WIRE-03 Discord reply draft-only mode
4. WIRE-04 Startup shadow mode
5. WIRE-06 Skill preflight
6. WIRE-09 Profile correction persistence
7. WIRE-10 FX schema wrapper
8. WIRE-11 Debate draft workflow
9. WIRE-07 Research pipeline contract
10. WIRE-05 STT/camera gate wrapper
11. WIRE-08 Sidebot shadow adapter
```

Reason:

```text
First make visible outputs safe.
Then freeze startup/live services.
Then gate deeper background systems.
```

## GO Boundary

Allowed without additional Level 5 GO:

```text
source implementation
tests
draft-only UI
preflight output
ledger candidates
profile correction model
FX thesis model
debate draft model
```

Still requires separate explicit human GO:

```text
Discord send
StackChan speak
StackChan face/motion/dance
STT server listen
camera capture
x_search
Obsidian write
runtime start
sidebot autonomous loop
productionReady true
execution enabled
git push
```

## Minimum Verification For Each Phase

```text
npm test -- shikishima-core
npm run typecheck:node
npm run typecheck:web if renderer touched
targeted tests for changed path
secret/raw local value scan on new files
git status --short
```

## Next Implementable Task

```text
Task: WIRE-01 Renderer chat -> channel output draft

Goal:
  Replace direct StackChan auto-speech in Layout chat with channel output draft.

Must not:
  call stackchanSay
  send Discord
  start runtime
  enable productionReady
  enable execution

Acceptance:
  UI receives full response
  StackChan spoken_response draft exists
  preflight decision is NEEDS_HUMAN
  tests pass
```

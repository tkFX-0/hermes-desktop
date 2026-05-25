# SC-SECRETARY Phase 1-6 Implementation Runbook

date: 2026-05-25
status: IMPLEMENTATION_READY
scope: ordered implementation runbook for StackChan secretary build-in

## Purpose

Convert the Phase 1-6 design into implementation tasks that can be executed one by one.

This runbook assumes:

- current source may have mixed dirty work
- commits should be scoped carefully
- StackChan physical behavior is allowed only when a task says so
- camera/microphone/external writes require explicit task GO and evidence

## Baseline Rule Before Every Task

Run:

```text
git status --short
npm run typecheck:node
npm run typecheck:web
```

If source is dirty from another worker:

```text
do not overwrite
read diff
work with the existing change
separate commits by scope
```

## Task 1 - Secretary Runtime Coordinator

### Goal

Create a single coordinator that owns secretary decisions before StackChan output.

### Files

Create:

- `src/main/shikishima-core/secretary-runtime-coordinator.ts`
- `tests/shikishima-secretary-runtime-coordinator.test.ts`

May use:

- `secretary-dialogue-policy.ts`
- `secretary-voice-router.ts`
- `secretary-event-bridge.ts`
- `secretary-routine-checkin.ts`
- `secretary-camera-comment-policy.ts`
- `secretary-monitoring-contract.ts`

### Required Types

```ts
export type SecretaryRuntimeMode =
  | "idle"
  | "one_shot_dialogue"
  | "event_reaction"
  | "routine_checkin"
  | "camera_one_shot"
  | "bounded_sensor_session"
  | "paused"
  | "stopped";

export interface SecretaryRuntimeState {
  mode: SecretaryRuntimeMode;
  paused: boolean;
  stopped: boolean;
  activeGateId?: string;
  runCount: number;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
}
```

### Acceptance

- creates initial state
- refuses action when stopped
- refuses action when paused except status
- returns draft for one-shot dialogue
- no external write
- no camera/mic session execution

## Task 2 - Pause / Stop Contract

### Goal

Make pause/stop a first-class safety layer.

### Files

Create:

- `src/main/shikishima-core/secretary-pause-stop.ts`
- `tests/shikishima-secretary-pause-stop.test.ts`

### Requirements

- `pauseSecretary(reason)`
- `resumeSecretary(humanGoTicket)`
- `stopSecretary(reason)`
- `isSecretaryActionAllowed(state, actionKind)`

### Acceptance

- paused blocks voice, camera, mic, external write
- stopped blocks everything except status/evidence
- resume requires human GO ticket
- no background loop can bypass stopped state

## Task 3 - One-Shot Dialogue Command Path

### Goal

Wire the one-shot dialogue draft into a callable command function.

### Files

Create:

- `scripts/shikishima-secretary-one-shot.mjs`
- `tests/shikishima-secretary-one-shot-script.test.ts`

### Requirements

Input:

```text
agent
prompt summary
draft answer
voice: true/false
```

Behavior:

- applies phrase policy
- limits speech
- creates evidence object
- if voice requested, requires GO ticket or dry-run mode
- no microphone
- no camera
- no external write

### Acceptance

- dry-run prints redacted draft only
- voice execution path is disabled unless GO ticket is supplied
- no token/local path output

## Task 4 - Routine Check-In Scheduler Adapter

### Goal

Add a paused-by-default scheduler adapter.

### Files

Create:

- `src/main/shikishima-core/secretary-routine-scheduler.ts`
- `tests/shikishima-secretary-routine-scheduler.test.ts`

### Requirements

- schedule definitions are local and explicit
- no schedule starts automatically
- run count is bounded
- interval is bounded
- stop/pause honored

### Acceptance

- default scheduler state is stopped or paused
- cannot run when paused
- no retry loop
- max runs enforced

## Task 5 - SC-CAM-01 Still Image Intake Adapter

### Goal

Implement the safe adapter for one still image comment.

### Files

Create:

- `src/main/shikishima-core/secretary-still-image-intake.ts`
- `tests/shikishima-secretary-still-image-intake.test.ts`

Optional script:

- `scripts/shikishima-secretary-camera-comment.mjs`

### Requirements

- accepts only explicit image path or buffer summary
- requires privacy confirmation
- rejects visible people unless future policy changes
- rejects private data visible flag
- does not retain image by default
- does not upload externally by default
- can produce a prompt for local or manually approved vision model

### Acceptance

- privacy false -> blocked
- people visible -> blocked
- private data visible -> blocked
- safe image -> prompt draft ready
- no identity recognition

## Task 6 - Bounded Camera/Mic Runtime Contract Adapter

### Goal

Connect `secretary-monitoring-contract.ts` to a runtime adapter without actually starting long-running sessions by default.

### Files

Create:

- `src/main/shikishima-core/secretary-sensor-session-runtime.ts`
- `tests/shikishima-secretary-sensor-session-runtime.test.ts`

### Requirements

- accepts monitoring contract
- starts only if `approved === true`
- duration timer required
- stop command required
- pause command required
- emits evidence summary
- no external upload
- no identity recognition

### Acceptance

- missing ticket -> no start
- missing stop command -> no start
- duration over max -> clamped
- stop sets state to stopped
- end restores HOLD

## Task 7 - External Write Executor Draft

### Goal

Prepare external write executor without broad automation.

### Files

Create:

- `src/main/shikishima-core/secretary-external-write-executor.ts`
- `tests/shikishima-secretary-external-write-executor.test.ts`

### Requirements

- accepts only `SecretaryExternalWriteDraft`
- executes only if `canExecuteNow === true`
- one run only
- destination must match summary
- no raw values
- evidence required
- gate restored HOLD

### Acceptance

- no ticket -> blocked
- canExecuteNow false -> blocked
- run count > 1 -> blocked
- redacted evidence produced

## Task 8 - Secretary Dashboard / Status Snapshot

### Goal

Expose a redacted status model for UI/Discord display.

### Files

Create:

- `src/main/shikishima-core/secretary-status-snapshot.ts`
- `tests/shikishima-secretary-status-snapshot.test.ts`

### Required Fields

```text
secretaryReady:
phase:
activeMode:
paused:
stopped:
voiceReady:
cameraOneShotReady:
routineReady:
monitoringReady:
externalWriteReady:
productionReady:
execution:
rawValuesReported:
nextHumanDecision:
```

### Acceptance

- raw values never appear
- productionReady remains explicit
- execution remains explicit
- next decision is human-readable

## Task 9 - SC-SECRETARY-99 Acceptance Package

### Goal

Create final acceptance evidence.

### Files

Create:

- `docs/shikishima/SC_SECRETARY_99_FINAL_ACCEPTANCE_RECORD.md`

### Required Sections

- Phase 1 result
- Phase 2 result
- Phase 3 result
- Phase 4 result
- Phase 5 result
- productionReady decision
- execution decision
- residual HOLD items
- rollback method
- stop/pause evidence

## Task 10 - ProductionReady / Execution Migration

### Goal

Only after SC-SECRETARY-99, decide whether to migrate global invariants.

### Warning

This is not a small patch.

Current repo has many literal types and tests expecting:

```text
productionReady: false
execution: disabled
```

### Required Prep

- enumerate all literal false / disabled contracts
- decide whether to add separate secretary lifecycle state instead of global flip
- update tests intentionally
- update docs intentionally
- preserve rawValuesReported false

### Preferred Design

Do not make the whole app productionReady globally.

Prefer:

```text
secretaryRuntimeReady: true
secretaryExecution: bounded_enabled
globalProductionReady: false until full app acceptance
```

This avoids breaking unrelated Ichikishima / mobile console / control center invariants.

## Recommended Commit Strategy

Use small commits:

```text
feat: add secretary runtime coordinator
feat: add secretary pause stop contract
feat: add secretary one-shot dialogue command
feat: add secretary routine scheduler draft
feat: add secretary camera still image intake
feat: add secretary bounded sensor runtime contract
feat: add secretary external write executor draft
feat: add secretary status snapshot
docs: record secretary phase 1 to 6 acceptance package
```

Do not combine firmware, scripts, docs, and global state migration into one large commit unless the user explicitly wants a checkpoint commit.

## Build / Verification Commands

For each source task:

```text
npm run typecheck:node
npm run typecheck:web
npm test -- shikishima-secretary
```

If scripts changed:

```text
node --check scripts/<changed-script>.mjs
```

If firmware changed:

```text
python -m platformio run -e cores3_noflash
```

Only flash firmware with explicit GO.

## Stop Conditions

Stop implementation if:

- source diff includes unrelated large changes
- package or lockfile changes are required
- raw token/secret would be printed
- image retention becomes default
- identity recognition is introduced
- camera/mic can run without duration limit
- external write can run without ticket
- productionReady global true is added without migration plan
- execution global enabled is added without migration plan


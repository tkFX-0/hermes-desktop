# SC-SECRETARY-04 Implementation Task Pack

date: 2026-05-25
status: LOCAL_FOUNDATION_IMPLEMENTED_PASS_CANDIDATE
scope: StackChan secretary implementation plan before coding

## Purpose

Break the AI secretary roadmap into sequential implementation tasks.

This document started as the pre-implementation task pack. The local, non-executing foundation has now been implemented.
Level 5 execution tasks still need their own GO.

## Task Order

### Task 1 — Persona / Phrase Policy

Gate:

- `SC-PERSONA-POLICY`

Goal:

- make StackChan secretary speech consistent
- enforce forbidden phrases
- keep responses short

Allowed:

- profile schema
- filter function
- local-only tests

Forbidden:

- camera
- microphone
- external write
- productionReady true

Expected output:

- profile policy module
- forbidden phrase test
- evidence doc

Implementation status:

- PASS_CANDIDATE
- implemented in `src/main/shikishima-core/profile-policy.ts`
- integrated with `src/main/shikishima-core/response-policy.ts`
- tested by `tests/shikishima-secretary-roadmap.test.ts`

### Task 2 — Secretary Voice Router

Gate:

- `SC-VOICE-ONE-SHOT`

Goal:

- map secretary events to StackChan voice, face, LED, motion

Examples:

- task done -> `task_done`
- HOLD -> `safety_hold`
- thinking -> `thinking_scan`
- answer -> `aiagent_speak`

Allowed:

- one-shot voice output
- no loop

Expected output:

- event-to-motion map
- one-shot read-aloud helper

Implementation status:

- PASS_CANDIDATE as display-only draft router
- implemented in `src/main/shikishima-core/secretary-voice-router.ts`
- StackChan execution still requires human GO

### Task 3 — Cat-Like Nuzzle Pat Motion

Gate:

- `SC-MOTION-06`

Goal:

- make pat reaction feel like StackChan is leaning into the user's hand
- use touch/IMU only
- preserve existing face assets

Requirements:

- light pat -> `撫でられてうれしい` + green LED
- repeated pat -> `頑張るぞ` + red LED
- hand-follow/nuzzle motion should lean in, hold softly, rub, then release
- no camera
- no microphone
- no person inference
- no continuous sensing beyond existing touch/IMU loop

Expected output:

- firmware nuzzle sequence
- compile-only build
- flash/test GO
- visual evidence

Implementation status:

- PASS_CANDIDATE
- cat-like nuzzle firmware implemented and flashed under prior user GO
- human visual/touch review remains required

### Task 4 — One-Shot Dialogue Backend

Gate:

- `SC-DIALOGUE-ONE-SHOT`

Goal:

- one prompt -> one answer -> optional voice output

Routes:

- local LLM if already running
- existing Shikishima text route
- future Grok route remains HOLD

Forbidden:

- new API
- install/model download without GO
- autonomous loop

Implementation status:

- PASS_CANDIDATE as local one-shot draft model
- implemented in `src/main/shikishima-core/secretary-dialogue-policy.ts`
- no model call is performed by this layer

### Task 5 — One-Shot Camera Comment

Gate:

- `SC-CAM-STILL-ONE-SHOT`

Goal:

- one still image -> one safe comment

Privacy:

- no identity recognition
- no private screen reading
- no recording
- no retention by default

Expected output:

- camera GO form
- image safety prompt
- redacted evidence

Implementation status:

- HOLD for actual camera
- boundary represented by `classifyRealtimeSource("stackchan_camera")`
- continuous monitoring remains HARD_HOLD

### Task 6 — Periodic Check-In Draft

Gate:

- `SC-ROUTINE-CHECKIN`

Goal:

- scheduled reminders without camera/mic

Examples:

- break reminder
- hydration reminder
- task wrap-up prompt

Forbidden:

- retry loop
- nagging escalation
- external write

Implementation status:

- PASS_CANDIDATE as local draft model
- implemented in `src/main/shikishima-core/secretary-routine-checkin.ts`
- no scheduler/timer is started by this layer

### Task 7 — Event-Aware Secretary Bridge

Gate:

- `SC-SECRETARY-EVENT-BRIDGE`

Goal:

- Shikishima events trigger StackChan reactions

Events:

- task done
- gate HOLD
- evidence created
- Discord mention read-only
- FX alert summary

Safety:

- external writes remain gated
- FX outputs are informational only
- no autonomous position holding

Implementation status:

- PASS_CANDIDATE as local bridge draft
- implemented in `src/main/shikishima-core/secretary-event-bridge.ts`
- no device action or external write is executed

### Task 8 — Low-Frequency Camera-Aware Draft

Gate:

- `SC-CAM-LOW-FREQ`

Goal:

- design low-frequency context check after one-shot camera passes

Allowed only after:

- repeated one-shot camera PASS
- privacy prompt accepted
- pause/stop works

### Task 9 — Final Secretary Readiness Review

Gate:

- `SC-SECRETARY-99`

Goal:

- decide whether secretary v1 is operationally ready

Must confirm:

- voice stable
- persona stable
- forbidden phrases respected
- camera remains gated
- external writes gated
- pause/stop works
- evidence exists

## Recommended Immediate Next Task

Start with:

```text
SC-SECRETARY-01 Persona / Phrase Policy
```

Reason:

- it directly addresses the user's concern that "do not say this" does not persist
- it improves all later dialogue
- it does not require camera, microphone, or external API

Second recommended task:

```text
SC-MOTION-06 Cat-Like Nuzzle Pat Motion
```

Reason:

- it improves StackChan's physical presence
- it uses already-working touch/IMU + servo path
- it does not require camera, microphone, external API, or new face assets

## Implementation STOP Conditions

Stop if any task requires:

- continuous camera monitoring
- microphone always-on
- productionReady true
- execution enabled
- external write without GO
- raw token / secret output
- new package install without explicit approval

## Implementation Completion Definition

The design is considered ready when:

- task order is clear
- gates are named
- first implementation candidate is selected
- acceptance criteria exist
- safety boundaries exist

Status:

```text
implementation_preparation: COMPLETE
first_recommended_task: SC-SECRETARY-01 Persona / Phrase Policy
```

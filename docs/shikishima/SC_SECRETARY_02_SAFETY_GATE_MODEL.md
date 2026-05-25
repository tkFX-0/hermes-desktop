# SC-SECRETARY-02 Safety Gate Model

date: 2026-05-25
status: DESIGN_READY
scope: StackChan AI secretary safety gates

## Purpose

Define the gates required before StackChan can become an AI secretary.

The target is useful daily support, not uncontrolled sensing. Every gate starts from HOLD and opens only with a narrow GO.

## Gate Table

| Gate | Purpose | Default | Can open when |
| --- | --- | --- | --- |
| `SC-VOICE-ONE-SHOT` | speak one exact answer | HOLD | route and text are specified |
| `SC-DIALOGUE-ONE-SHOT` | one prompt -> one response | HOLD | backend and max turns specified |
| `SC-PERSONA-POLICY` | enforce profile and forbidden phrases | DESIGN | static policy exists |
| `SC-CAM-STILL-ONE-SHOT` | use one safe still image | HOLD | user confirms image safety |
| `SC-CAM-LOW-FREQ` | low-frequency context snapshots | HOLD | one-shot has passed repeatedly |
| `SC-CAM-CONTINUOUS` | continuous camera monitoring | HARD HOLD | future explicit policy only |
| `SC-MIC-PTT` | push-to-talk microphone | HOLD | exact route and stop conditions |
| `SC-MIC-ALWAYS-ON` | always-on microphone | HARD HOLD | not approved |
| `SC-ROUTINE-CHECKIN` | scheduled secretary check-ins | HOLD | schedule and pause rule exist |
| `SC-EXTERNAL-WRITE` | Discord/X/Obsidian send/write | HOLD | target and content approved |
| `SC-PRODUCTION-READY` | productionReady true | CRITICAL HOLD | final acceptance only |
| `SC-EXECUTION-ENABLE` | execution enabled | CRITICAL HOLD | final acceptance only |

## Risk Rules

### Low Risk

- face change
- LED change
- short servo motion
- local text draft
- one exact voice line after GO

### Medium Risk

- task summary
- periodic local reminder
- local profile update
- one-shot LLM reply

### High Risk

- camera still image
- microphone push-to-talk
- local note write
- reading Discord/X content

### Critical Risk

- continuous camera
- always-on microphone
- external write
- payment/reservation/purchase
- productionReady true
- execution enabled

## Camera Privacy Boundary

The camera path must start with one still image.

Allowed only after GO:

- one still image
- safe general comment
- no identity recognition
- no private screen reading
- no continuous recording
- no cloud upload unless specifically approved

Forbidden by default:

- face identification
- person tracking
- credential reading
- background capture
- image retention without evidence policy

## Voice / Dialogue Boundary

Allowed next:

- one prompt
- one answer
- one voice output
- no loop

Forbidden by default:

- autonomous conversation loop
- microphone always-on
- retry loop
- unbounded background daemon

## Memory Boundary

Allowed:

- stable user preferences
- forbidden phrase list
- tone preferences
- redacted event summaries

Forbidden:

- raw secrets
- raw tokens
- private screen contents
- unapproved camera-derived facts
- identity claims from images

## Secretary Stop Conditions

Stop immediately if:

- user says stop / pause
- camera sees private content
- AI attempts person identification
- microphone opens unexpectedly
- repeated speech loop begins
- external write is attempted without GO
- productionReady or execution state changes

## Required Evidence For Every Gate

```text
gate:
human_go:
time_window:
input:
output:
run_count:
camera_used:
microphone_used:
external_write:
token_output:
rawValuesReported:
productionReady:
execution:
gate_restored_hold:
result:
```

## Implementation Rule

Every first implementation must be:

- one-shot
- locally bounded
- reversible
- logged
- easy to pause
- restored to HOLD after test

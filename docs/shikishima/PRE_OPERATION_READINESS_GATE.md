# Pre-Operation Readiness Gate

## Purpose

This gate defines what must be true before the human can consider moving from
review evidence toward any operational GO.

Pre-Operation Readiness Candidate is not operation approval. It is a reviewable
state immediately before a separate human GO decision.

## What Pre-Operation Means

Pre-Operation means:

- validation evidence exists;
- human review materials exist;
- rollback and stop conditions are documented;
- remaining HOLD gates are explicit;
- the next action is a human decision, not an automated transition.

## What Pre-Operation Does Not Mean

Pre-Operation does not mean:

- execution enabled;
- productionReady true;
- GO approved;
- git push approved;
- deploy approved;
- Cloudflare approved;
- device, robot, voice, camera, or mic approved;
- secrets, tokens, raw values, or local-only values approved.

## Required Conditions Before Operational GO

| Requirement | Current state |
|---|---|
| Human Review package exists | yes |
| Human decision sheet exists | yes |
| Validation summary exists | yes |
| Pre-Operation gate exists | yes |
| Controlled pilot plan exists | yes |
| rollback plan exists or is referenced | referenced |
| incident stop plan exists or is referenced | referenced |
| execution remains disabled | yes |
| productionReady remains false | yes |
| git push remains not approved | yes |

## Required Human Approvals

Each approval must be explicit and scoped:

- accept G-05/G-06/G-07 as official PASS;
- accept Human Review Ready Candidate;
- accept Pre-Operation Readiness Candidate;
- approve any git push separately;
- approve any execution separately;
- approve any Cloudflare/deploy separately;
- approve productionReady true separately;
- approve any device/robot/voice/camera/mic operation separately.

## Required Rollback Plan

Before any operational GO, the human must confirm:

- what can be stopped immediately;
- what files or commits are involved;
- how to return to HOLD;
- how to report failures in redacted form;
- which action is forbidden after a stop.

Reference docs:

- `REAL_OPERATION_ROLLBACK_AND_INCIDENT_PLAN.md`
- `V9_PILOT_STOP_AND_ROLLBACK_CARD.md`
- `V5_DRY_RUN_ROLLBACK_RUNBOOK.md`

## Required Incident Stop Conditions

STOP if any of the following appear:

- unexpected execution path;
- raw value, secret, token, or local-only value exposure risk;
- external service requirement;
- missing local dependency that would require install;
- WSL/Hermes/wrapper/dummy/RunPod requirement;
- StackChan, robot, voice, camera, or mic requirement;
- productionReady true or execution enabled requirement;
- git push requirement without separate approval.

## Required Validation Commands

Only existing local tools and scripts may be used:

- local ESLint over `src tests`;
- existing typecheck scripts;
- existing test script;
- existing build script.

No npm install, npx, dependency update, external deploy, packaged smoke,
WSL/Hermes/wrapper/dummy, or device operation is allowed by this gate.

These commands are listed as future validation evidence requirements only and are not approved to run by this review note.

## Required Git Push Decision

git push remains separate. Passing validation or reaching Pre-Operation
Readiness Candidate does not approve push.

## Raw / Secret / Local-Only Policy

All review and operation reports must remain redacted-only. Do not include raw
local paths, secrets, tokens, raw stdout/stderr transcripts, raw argv, private
device/account values, or local-only configuration.

## External / Device Policy

External services and devices remain HOLD:

- Cloudflare: deferred.
- OpenSpec CLI: HOLD.
- WSL/Hermes/wrapper/dummy: HOLD.
- StackChan/robot: HOLD.
- voice/camera/mic: HOLD.

## Explicit Stop Before

Stop before:

- productionReady true;
- execution enabled;
- WSL/Hermes/wrapper;
- robot/voice/camera/mic;
- Cloudflare/deploy;
- secret/token/raw values;
- git push.

## Candidate Declaration

Pre-Operation Readiness Candidate may be reviewed when this file, the human
decision sheet, the validation summary, and the controlled pilot plan all exist.
It still requires a separate human GO before any operation.

## Human Reviewer Notes

- reviewed_by: human
- reviewed_at: 2026-05-14
- decision: accept_as_review_evidence
- notes:
  - Pre-Operation Readiness Gate is acceptable as review evidence only.
  - Pre-Operation Readiness Candidate is not operational GO.
  - This acceptance does not approve GO, execution, productionReady true, git push, deploy, Cloudflare, WSL/Hermes/wrapper, devices, robot/StackChan, voice/camera/mic, secrets, raw values, or local-only values.
  - Required validation commands listed in this document are future validation evidence requirements only and are not approved to run by this review note.
  - Operational gates remain HOLD unless individually approved.
- required_rework:
  - none
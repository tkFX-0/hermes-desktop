# Level 1 Local Dry-Run Scope Proposal

## Document Status

- roadmapVersion: v2.9.8
- level: Level 1
- status: proposal_only / HOLD
- current_level: Level 0
- date: 2026-05-14

This document is a proposal only. It does not approve Level 1.
Level 1 requires a separate explicit human GO.

## Purpose

This document defines the exact proposed scope for a future Level 1 local
dry-run pilot. The human may review this proposal and, if satisfied, issue a
separate scoped Level 1 GO that names the exact commands, time window, and
output policy.

No command listed here has been run or is approved to run by this document.

## What Level 1 Means

Level 1 means:

- local dry-run only;
- limited to existing local scripts or read-only inspection commands;
- no external services, devices, or network-dependent operations;
- no WSL/Hermes/wrapper/dummy/RunPod;
- no Cloudflare/Wrangler;
- no npm install, npx, or dependency updates;
- no secrets, tokens, raw values, or local-only values in output;
- output is redacted-only;
- the human monitors and records the result;
- the pilot exits on the first stop condition.

## What Level 1 Does Not Mean

Level 1 does not mean:

- execution is enabled;
- productionReady is true;
- Level 2 or Level 3 is approved;
- GO is issued;
- git push is approved;
- deploy or Cloudflare is approved;
- device, robot, voice, camera, or mic operation is approved;
- secrets, tokens, raw values, or local-only values are approved.

## Proposed Exact Scope

Level 1 is local dry-run only. It is limited to the following existing local
validation scripts, which were previously used as validation evidence candidates.

No new tooling, no network calls, no external services.

### Proposed Commands

The following commands are listed as proposal candidates only.

None of these commands is approved to run by this document.
No command may be run until the human issues a separate explicit Level 1 GO
with exact command list and time window.

| Command | Proposed only | Notes |
|---|---|---|
| `npm run typecheck:node` | proposed_only: not approved to run by this document | Previously used as G-03/G-04 evidence |
| `npm run typecheck:web` | proposed_only: not approved to run by this document | Previously used as G-03/G-04 evidence |
| `npm run lint` | proposed_only: not approved to run by this document | Previously used as G-05 evidence |
| `npm test` | proposed_only: not approved to run by this document | Previously used as G-06 evidence |
| `npm run build` | proposed_only: not approved to run by this document | Previously used as G-07 evidence |

The human may run any subset of the above, or all of them, as specified in the
Level 1 GO. The GO must name the exact subset.

### Time Window

- time_window: to be specified by human in separate GO

The human must define a specific start time, expected duration, and stop time
in the Level 1 GO. This document does not invent an actual time window.

## Expected Output Policy

All output from any Level 1 run must follow these rules:

- Output must be redacted-only.
- No raw stdout/stderr transcript may be pasted into chat or any document.
- Only the following may be reported:
  - summary counts (e.g. "X files checked", "Y tests passed")
  - PASS / HOLD / NG per command
  - file counts
  - sanitized error categories (e.g. "type error in 2 files" without raw paths)
- The following must never be included in any report:
  - secrets
  - tokens
  - raw local paths
  - raw JSON output
  - local-only configuration values
  - device values
  - account values
  - raw argv or environment variables

## Stop Conditions

STOP immediately and return to HOLD if any of the following occur:

- a command requires npm install, npx, dependency update, or package change;
- a command requires external network access;
- a command requires Cloudflare/Wrangler;
- a command requires WSL/Hermes/wrapper/dummy/RunPod;
- a command requires StackChan/robot/voice/camera/mic;
- output may expose secrets, tokens, raw values, or local-only values;
- unexpected file edits occur during the run;
- productionReady true is requested;
- execution enabled is requested;
- git push is requested;
- the scope expands beyond the approved command list;
- the human is unable to monitor the run in real time.

## Rollback and Incident Stop Handling

If a stop condition is triggered:

- stop the command immediately;
- return to HOLD;
- record the incident in redacted form only;
- do not attempt to re-run;
- report which stop condition was triggered (no raw values);
- wait for a new human GO before any further action.

Reference documents:

- `REAL_OPERATION_ROLLBACK_AND_INCIDENT_PLAN.md`
- `V9_PILOT_STOP_AND_ROLLBACK_CARD.md`
- `V5_DRY_RUN_ROLLBACK_RUNBOOK.md`

## Human Monitor and Recorder

Before Level 1 GO is issued, the human must confirm:

- who will monitor the run in real time;
- how stop conditions will be recognized;
- how the result will be recorded (redacted-only);
- which output format will be used for the report;
- that no raw stdout/stderr will be captured into any shared document.

## Approval Required Before Execution

This proposal does not approve Level 1.

Level 1 requires a separate explicit human GO.

The future GO must name:

- exact command list (subset of the proposed commands above);
- exact time window (start, expected duration, stop);
- output policy confirmation (redacted-only);
- stop conditions that apply;
- who will monitor and record the result;
- confirmation that no forbidden systems will be touched.

Example GO wording (not yet issued):

```
I approve Level 1 local dry-run only.
Approved commands: <exact list>
Approved time window: <start>–<stop>
No git push. No productionReady true. No external services.
Redacted output only.
```

This example is for reference. It has no approval effect until the human issues it
explicitly.

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- Level 1 pilot: not approved
- future_git_push: not approved

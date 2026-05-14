# Level 2 Local Controlled Validation Scope Proposal

## Document Status

- roadmapVersion: v3.1.0
- level: Level 2
- status: proposal_only / HOLD
- current_level: Level 1 PASS
- target_level: Level 2 local controlled validation
- level_2_execution: not approved
- date: 2026-05-14

This document is a proposal only. It does not approve Level 2.
Level 2 requires a separate explicit human GO.

## Purpose

This document defines the proposed scope for a future Level 2 local controlled
validation run. The human may review this proposal and, if satisfied, proceed to
a Level 2 GO wording review before issuing a GO.

No command listed here has been run or is approved to run by this document.

## Why Level 2 Is Being Proposed

Level 1 local dry-run PASS was confirmed on 2026-05-14. All five commands exited
0 and left no staged files or semantic diffs.

Level 2 builds directly on this result. The goal is to confirm not only exit
code success, but also structured validation evidence, timing, output categories,
and unchanged working tree state in a more controlled review format.

## What Level 2 Means

Level 2 is local controlled validation.

For this proposal, Level 2 means a deeper redacted review of the same five local
validation commands that passed in Level 1. The goal is to confirm not only exit
code success, but also structured validation evidence, timing, output categories,
and unchanged working tree state.

Level 2 is still local-only. It does not expand into external services, devices,
WSL/Hermes/wrapper, Electron dev-mode, source edits, package changes, or
production readiness.

## What Level 2 Does Not Mean

Level 2 does not approve:

- productionReady true;
- execution enabled;
- Level 3;
- deploy or Cloudflare / Wrangler;
- WSL / Hermes / wrapper / dummy / RunPod;
- Electron dev-mode launch;
- StackChan / robot;
- voice / camera / mic;
- secrets / tokens / raw values / local-only values;
- package changes;
- source changes;
- npm install / npm update / npx;
- git push.

## Chosen Level 2 Scope

**Option A is selected for this proposal.**

Level 2 for this project = deeper redacted review of the same five local
validation commands used in Level 1.

See rejected candidates below.

## Rejected and Deferred Level 2 Candidates

| Option | Description | Status |
|---|---|---|
| **Option A** | Deeper redacted review of same five Level 1 commands | **SELECTED** |
| Option B | tests/ichikishima commit path (G-01/G-02/G-03) | DEFERRED / HOLD |
| Option C | Electron dev-mode launch | DEFERRED / HOLD |

Option B and Option C remain HOLD. They require separate future proposals with
their own scope, rollback, and GO wording review documents.

## Proposed Exact Command Scope

The following commands are the complete proposed command list for a future Level
2 GO. They are not approved to run by this document.

| Order | Command | Purpose | Status |
|---|---|---|---|
| 1 | `npm run typecheck:node` | Node typecheck | proposed_only: not approved to run by this document |
| 2 | `npm run typecheck:web` | Web typecheck | proposed_only: not approved to run by this document |
| 3 | `npm run lint` | ESLint | proposed_only: not approved to run by this document |
| 4 | `npm test` | Test suite | proposed_only: not approved to run by this document |
| 5 | `npm run build` | Local build | proposed_only: not approved to run by this document |

No additional commands may be added at execution time without a new GO.
No command may be run until the human issues a separate explicit Level 2 GO
with exact command list and time window.

## Proposed Evidence Review Scope

For Level 2, the result report should include the following fields per command:

Allowed output fields:

- command name
- exit code
- elapsed time
- PASS / HOLD / NG result
- sanitized summary (e.g. "No type errors", "X tests passed")
- structured category summary (e.g. "0 errors, 0 warnings")
- counts only where useful
- working tree counts (before and after)
- staged files count
- actual content diff count
- CRLF-only file count
- untracked file count
- stop condition status

Not permitted:

- raw stdout / stderr transcript
- private local paths
- secrets / tokens / raw values
- local-only values or config
- raw JSON output

This evidence review level goes deeper than Level 1 by requiring the report to
include structured category summaries and before/after working tree comparison,
not just exit code and total count.

## Output Policy

Output must be redacted-only.
No raw stdout/stderr transcript may be pasted into chat.
Only summary counts, PASS/HOLD/NG, file counts, timing, and sanitized categories
may be reported.
No secrets, tokens, raw values, local-only values, raw JSON, private local paths,
device values, or account values may be included.

## Stop Conditions

STOP immediately if any of the following occur during Level 2:

- a command requires install, npx, dependency update, or package change;
- a command requires external network access;
- a command requires Cloudflare / Wrangler;
- a command requires WSL / Hermes / wrapper / dummy / RunPod;
- a command requires Electron dev-mode launch;
- a command requires StackChan / robot / voice / camera / mic;
- output may expose secrets, tokens, raw values, or local-only values;
- unexpected file edits occur during the run;
- productionReady true is requested;
- execution enabled is requested;
- git push is requested;
- the scope expands beyond the five proposed commands;
- the human is unable to monitor the run in real time.

On stop: return to HOLD, record the stop condition redacted-only, do not
re-run without a new explicit GO.

## Rollback and Incident Stop Handling

If a stop condition is triggered:

- stop the command immediately;
- return to HOLD (Level 1 PASS state remains valid);
- record the incident redacted-only;
- do not attempt to re-run;
- report which stop condition was triggered (no raw values);
- wait for a new human GO before any further action.

Reference documents:

- `REAL_OPERATION_ROLLBACK_AND_INCIDENT_PLAN.md` — Level 2 rollback = stop
  test runner; review output (redacted-only); return to Level 1 state
- `V9_PILOT_STOP_AND_ROLLBACK_CARD.md` — P0/P1/P2 incident classification

## Human Monitor and Recorder

Before Level 2 GO is issued, the human must confirm:

- who will monitor the run in real time;
- how stop conditions will be recognized;
- how the result will be recorded (redacted-only, structured format);
- that no raw stdout/stderr will be captured into any shared document;
- that before/after working tree state will be reported.

## Approval Required Before Execution

This proposal does not approve Level 2.

Level 2 requires a separate explicit human GO.

The future GO must name:

- exact command list (the five proposed above);
- exact time window (start, expected duration, stop);
- output policy confirmation (redacted-only, structured);
- stop conditions that apply;
- who will monitor and record the result;
- confirmation that no forbidden system will be touched.

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- Level 2: not approved
- Level 3: not approved
- future_git_push: not approved

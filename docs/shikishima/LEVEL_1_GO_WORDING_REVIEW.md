# Level 1 GO Wording Review

## Document Status

- roadmapVersion: v2.9.9
- status: wording_review_only / HOLD
- current_level: Level 0
- target_level: Level 1 local dry-run
- level_1_execution: not approved
- date: 2026-05-14

This document is a wording review only. It is not GO.

## Purpose

This document provides the exact wording a human would use if they later decide
to approve Level 1 local dry-run. It is prepared now so the human can review
the approval language before committing to it.

Creating this document is not GO.
Reading this document is not GO.
Level 1 execution remains HOLD until the human separately issues the exact
approval in a new explicit message.

## Current Status

- Level 0: documentation-only — current
- Level 1: local dry-run — HOLD
- Level 2: local controlled validation — HOLD
- Level 3: external/device operation — HOLD

No level above Level 0 is approved.

## What This Document Is

This document is:

- a review copy of the proposed Level 1 GO wording;
- a checklist the human can use to evaluate whether the GO wording is safe;
- a reference for what the human must fill in before issuing GO;
- a record that the wording was reviewed and not yet issued.

## What This Document Is Not

This document is not:

- a Level 1 GO;
- an approval of execution;
- an approval of productionReady true;
- an approval of any command in the proposed command list;
- an approval of git push, deploy, Cloudflare, WSL/Hermes/wrapper, devices,
  robot/StackChan, voice/camera/mic, secrets, or raw values.

## Proposed Human GO Wording

The following is a DRAFT ONLY template for future human use. It has no approval
effect until the human copies it into a new message with the time window filled
in and sends it explicitly.

---

```
DRAFT ONLY — NOT APPROVED YET

I explicitly approve Controlled Pilot Level 1 local dry-run only.

Approved scope:
- remote/deploy/external services: not approved
- WSL/Hermes/wrapper/device/robot/voice/camera/mic: not approved
- secrets/raw/local-only values: not approved
- git push: not approved
- package/source changes: not approved
- command execution: only the exact commands listed below, in order,
  during the specified time window

Approved commands:
1. npm run typecheck:node
2. npm run typecheck:web
3. npm run lint
4. npm test
5. npm run build

Time window:
- <human must fill exact date/time before GO>

Output policy:
- redacted-only summary
- no raw stdout/stderr transcript
- PASS/HOLD/NG only with counts and sanitized categories

Stop conditions:
- stop on any secret/raw/local-only exposure risk
- stop on unexpected file edits
- stop on install/npx/dependency update requirement
- stop on external network requirement
- stop on WSL/Hermes/wrapper/device/robot/voice/camera/mic requirement
- stop on productionReady true or execution enabled request
- stop on git push request

This GO is valid only if copied by the human in a later message with the
time window filled in.
This document itself is not GO.
```

---

## Exact Command Scope

The following commands are the complete proposed command list for a future Level 1 GO.
They are not approved to run by this document.
No additional commands may be added at execution time without a new GO.

| Order | Command | Purpose |
|---|---|---|
| 1 | `npm run typecheck:node` | Node typecheck (previously G-03/G-04 evidence) |
| 2 | `npm run typecheck:web` | Web typecheck (previously G-03/G-04 evidence) |
| 3 | `npm run lint` | ESLint (previously G-05 evidence) |
| 4 | `npm test` | Test suite (previously G-06 evidence) |
| 5 | `npm run build` | Local build (previously G-07 evidence) |

The following must NOT be run under Level 1:

- npm install
- npm update
- npx
- Cloudflare / Wrangler
- WSL / Hermes / wrapper / dummy / RunPod
- StackChan / robot / voice / camera / mic
- git push
- deploy

## Time Window Placeholder

The human must fill in the time window before issuing GO:

- time_window: `<human must fill exact date/time before GO>`

The time window must specify:
- start time;
- expected total duration;
- stop-by time (hard stop if exceeded).

This document does not fill in the time window. A GO without a time window is
not valid.

## Output Policy

Only redacted summary output may be reported after any Level 1 run.
No raw stdout/stderr transcript may be pasted into chat.

Allowed report fields:

- command name
- exit code
- PASS / HOLD / NG
- elapsed time
- count summaries (e.g. "12 files checked", "3 tests passed")
- sanitized error category summaries (e.g. "type error in 2 files")
- changed files count
- staged files count

Forbidden report fields:

- secrets
- tokens
- raw values
- local-only values
- raw JSON
- private local paths
- credential helper contents
- full raw stdout/stderr transcript

## Stop Conditions

The following conditions require an immediate stop during Level 1:

- a command requires install, npx, dependency update, or package change;
- a command requires external network access;
- a command requires Cloudflare/Wrangler;
- a command requires WSL/Hermes/wrapper/dummy/RunPod;
- a command requires StackChan/robot/voice/camera/mic;
- output may expose secrets, tokens, raw values, or local-only values;
- unexpected file edits occur during the run;
- productionReady true is requested;
- execution enabled is requested;
- git push is requested;
- the scope expands beyond the five approved commands;
- the human is unable to monitor the run in real time.

On stop: return to HOLD, record the stop condition redacted-only, do not
re-run without a new explicit GO.

## Recorder and Monitor

Before issuing Level 1 GO, the human must confirm:

- who will monitor the run in real time (human must be present);
- how the result will be recorded (redacted-only report only);
- that no raw stdout/stderr will be captured into any shared document;
- that the stop conditions above will be enforced.

## Post-Run Required Report Format

After any Level 1 run, the following report format must be used.
No other format is acceptable.

```
RESULT:
status: PASS / HOLD / NG
level: Level 1 local dry-run
commands_run:
  - command: npm run typecheck:node
    result: PASS / HOLD / NG
    exit_code: <code>
    summary: <redacted summary only>
  - command: npm run typecheck:web
    result: PASS / HOLD / NG
    exit_code: <code>
    summary: <redacted summary only>
  - command: npm run lint
    result: PASS / HOLD / NG
    exit_code: <code>
    summary: <redacted summary only>
  - command: npm test
    result: PASS / HOLD / NG
    exit_code: <code>
    summary: <redacted summary only>
  - command: npm run build
    result: PASS / HOLD / NG
    exit_code: <code>
    summary: <redacted summary only>
working_tree_after:
  staged_files: <count>
  actual_content_diff_files: <count>
  crlf_only_files: <count>
  untracked_files: <count>
safety_boundary:
  decision: HOLD
  execution: disabled
  productionReady: false
  rawValuesReported: false
  robotMotion: HOLD
  Level 2: not approved
  Level 3: not approved
  future_git_push: not approved
notes:
  - <short notes>
```

## Explicit Non-Approvals

This document does not approve:

- Level 1 execution;
- Level 2;
- Level 3;
- execution enabled;
- productionReady true;
- git push;
- deploy;
- Cloudflare / Wrangler;
- WSL / Hermes / wrapper;
- dummy process;
- robot / StackChan;
- voice / camera / mic;
- secrets / tokens / raw values / local-only values;
- package changes;
- source changes;
- npm install;
- npm update;
- npx.

## Final Review Checklist

Before issuing Level 1 GO, the human must confirm each item:

| # | Check | Must be true before GO |
|---|---|---|
| 1 | LEVEL_1_ACCEPTANCE_CLARIFICATION.md reviewed | yes |
| 2 | LEVEL_1_LOCAL_DRY_RUN_SCOPE_PROPOSAL.md reviewed | yes |
| 3 | This document reviewed | yes |
| 4 | Exact command list confirmed | yes |
| 5 | Time window filled in | yes |
| 6 | Output policy understood | yes |
| 7 | Stop conditions understood | yes |
| 8 | Human monitor / recorder confirmed | yes |
| 9 | No external services or devices required | confirmed |
| 10 | No secrets, tokens, or raw values will be exposed | confirmed |
| 11 | GO wording copied with time window filled in | yes |
| 12 | GO issued in a new explicit message (not this document) | yes |
| 13 | Level 1 execution still requires a new explicit human GO | yes |

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- Level 1 pilot: not approved
- Level 2: not approved
- Level 3: not approved
- future_git_push: not approved

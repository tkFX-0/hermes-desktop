# Level 1 Local Dry-Run Evidence

## Purpose

This file records the evidence of the first successful Controlled Pilot Level 1
local dry-run. It is evidence only.

It does not approve Level 2, Level 3, or any further operational gate.

## Document Status

- roadmapVersion: v3.0.0
- event: Controlled Pilot Level 1 local dry-run completed
- result: PASS
- level: Level 1 local dry-run
- time_window: 2026-05-14 13:35-14:35 JST
- latest_commit_at_run: 37524fe docs: harden level 1 go wording review
- date_recorded: 2026-05-14

## Pre-Run Verification

All pre-run conditions were confirmed before any command was executed.

| Check | Result |
|---|---|
| branch: main | PASS |
| latest commit: 37524fe | PASS |
| remote: https://github.com/tkFX-0/hermes-desktop | PASS |
| staged files: 0 | PASS |
| actual content diff files: 0 | PASS |
| CRLF-only remaining (not staged) | PASS |
| untracked files not staged | PASS |
| no package.json/package-lock.json staged | PASS |
| no src/** or tests/** staged | PASS |
| time window valid | PASS |

## Command Results

All five approved commands were run in order. All exited with code 0.

| Order | Command | Result | Exit Code | Elapsed | Summary |
|---|---|---|---|---|---|
| 1 | `npm run typecheck:node` | PASS | 0 | 2.4s | No type errors in Node target. |
| 2 | `npm run typecheck:web` | PASS | 0 | 3.4s | No type errors in web target. |
| 3 | `npm run lint` | PASS | 0 | 12.6s | No blocking lint errors. No problems reported. |
| 4 | `npm test` | PASS | 0 | 18.8s | 87 test files passed (1 skipped); 712 tests passed (1 skipped); 0 failed. |
| 5 | `npm run build` | PASS | 0 | 13.0s | Build successful. Renderer assets generated. Built in 5.60s. |

No stop condition was triggered during the run.

## Working Tree After Run

The run left no dirty state. Working tree after is identical to before.

| Field | Value |
|---|---|
| staged_files | 0 |
| actual_content_diff_files | 0 |
| crlf_only_files | 95 |
| untracked_files | 130 (3 top-level entries; unchanged) |

No files were edited, staged, committed, or pushed during the run.

## Safety Boundary After Run

| Field | Value |
|---|---|
| decision | HOLD |
| execution | disabled |
| productionReady | false |
| rawValuesReported | false |
| robotMotion | HOLD |
| Level 2 | not approved |
| Level 3 | not approved |
| future_git_push | not approved |

## What This Evidence Means

This evidence means:

- All five local dry-run commands completed successfully within the approved time window;
- no stop condition was triggered;
- no forbidden system was touched;
- no files were unexpectedly modified;
- the working tree is in the same clean state as before the run.

## What This Evidence Does Not Mean

This evidence does not mean:

- Level 2 is approved;
- Level 3 is approved;
- execution is enabled;
- productionReady is true;
- GO is issued for any further operation;
- git push is approved;
- deploy or Cloudflare is approved;
- WSL/Hermes/wrapper/dummy is approved;
- robot/StackChan is approved;
- voice/camera/mic is approved;
- secrets, tokens, raw values, or local-only values were handled.

## Explicit Non-Approvals

This Level 1 evidence record does not approve Level 2, Level 3, execution
enabled, productionReady true, git push, deploy, Cloudflare, WSL/Hermes/wrapper,
devices, robot/StackChan, voice/camera/mic, secrets, raw values, local-only
values, package changes, or source changes.

Any future level requires a separate explicit human GO with exact scope.

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- Level 2: not approved
- Level 3: not approved
- future_git_push: not approved

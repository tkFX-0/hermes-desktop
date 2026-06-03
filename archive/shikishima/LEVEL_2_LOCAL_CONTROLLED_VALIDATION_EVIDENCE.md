# Level 2 Local Controlled Validation Evidence

## Document Status

- roadmapVersion: v3.2.1
- status: level_2_local_controlled_validation_pass / HOLD
- level: Level 2 local controlled validation
- result: PASS
- time_window: 2026-05-14 15:00-16:00 JST
- execution: disabled
- productionReady: false
- Level 3: not approved
- future_git_push: not approved
- date_recorded: 2026-05-14

## Purpose

This file records the evidence of the completed Controlled Pilot Level 2 local
controlled validation run. It is evidence only. It does not approve Level 3 or
any further gate.

## Scope

Level 2 selected scope: Option A — deeper redacted review of the same five
local validation commands that passed in Level 1.

Validation type: structured evidence review including category summaries and
before/after working tree comparison.

## Human Approval Used

The following GO was issued by the human before execution:

- level: Level 2 local controlled validation
- validation type: deeper redacted review of same five Level 1 commands
- time_window: 2026-05-14 15:00-16:00 JST
- output: redacted-only structured summary
- all forbidden scopes confirmed not approved

## Pre-Run Verification

All pre-run conditions were confirmed before any command was executed.

| Check | Result |
|---|---|
| branch: main | PASS |
| latest commit: d709287 | PASS |
| remote: https://github.com/tkFX-0/hermes-desktop | PASS |
| staged files: 0 | PASS |
| actual content diff files: 0 | PASS |
| CRLF-only remaining (not staged) | PASS |
| untracked files not staged | PASS |
| no package.json/package-lock.json staged | PASS |
| no src/** or tests/** staged | PASS |
| time_window filled and valid | PASS |

## Commands Run

All five approved commands were run in order within the approved time window.

| Order | Command | Exit Code | Elapsed |
|---|---|---|---|
| 1 | npm run typecheck:node | 0 | 2.5s |
| 2 | npm run typecheck:web | 0 | 3.8s |
| 3 | npm run lint | 0 | 12.9s |
| 4 | npm test | 0 | 21.3s |
| 5 | npm run build | 0 | 13.6s |

## Command Results

| Command | Result | Summary | Structured Category Summary |
|---|---|---|---|
| npm run typecheck:node | PASS | No type errors in Node target. | 0 errors, 0 warnings |
| npm run typecheck:web | PASS | No type errors in web target. | 0 errors, 0 warnings |
| npm run lint | PASS | No blocking lint errors. No problems reported. | 0 errors, 0 warnings |
| npm test | PASS | 87 test files passed (1 skipped); 712 tests passed (1 skipped); 0 failed. | 87 files passed / 1 skipped; 712 tests passed / 1 skipped |
| npm run build | PASS | Build successful. Built in 5.44s. | 0 errors; renderer assets generated |

No stop condition was triggered during any command.

## Working Tree Before / After

| Field | Before | After |
|---|---|---|
| staged_files | 0 | 0 |
| actual_content_diff_files | 0 | 0 |
| crlf_only_files | 95 | 95 |
| untracked_files | 130 | 130 |

Working tree state was identical before and after the run. No files were
edited, staged, committed, or pushed during Level 2 execution.

## Stop Conditions

- triggered: no
- summary: No stop condition was triggered during the Level 2 run.

## Comparison With Level 1

Level 2 used the same five-command set as Level 1.

Level 2 produced the same outcome class as Level 1.

| Metric | Level 1 | Level 2 |
|---|---|---|
| test files passed | 87 | 87 |
| test files skipped | 1 | 1 |
| tests passed | 712 | 712 |
| tests skipped | 1 | 1 |
| tests failed | 0 | 0 |
| build result | successful | successful |
| build time | 5.60s | 5.44s |
| working tree after | unchanged | unchanged |
| stop conditions triggered | none | none |

Test count remained stable. Build remained successful. No regression was
detected. Working tree state remained unchanged before/after in both runs.

## Evidence Summary

- Level 2 local controlled validation: PASS
- All five commands exited 0
- No stop condition triggered
- No regression vs Level 1 detected
- Working tree clean after run
- No secrets, tokens, raw values, or local-only values were reported

## Remaining HOLD Items

The following remain HOLD and are not approved by this evidence record:

- Level 3
- productionReady true
- execution enabled
- git push (requires new separate approval)
- Cloudflare / deploy
- WSL / Hermes / wrapper
- Electron dev-mode
- StackChan / robot runtime
- robot connection
- robot motion
- voice / camera / mic
- secrets / tokens / raw values / local-only values
- package changes
- source changes
- npm install / npm update / npx

## Next Gate

Next recommended gate: post-Level 2 human acceptance review.

After human acceptance, the next track is Local App Observation readiness
(Track B). This requires a separate scope proposal and GO.

Level 3 requires its own separate explicit human GO.

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- Level 3: not approved
- Final Shikishima 100%: not complete
- Local App 100%: not complete
- future_git_push: not approved

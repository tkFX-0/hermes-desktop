# Level 2 Final GO Package

## Document Status

- roadmapVersion: v3.2.0-candidate
- status: final_go_package / HOLD
- level: Level 2 local controlled validation
- level_2_execution: not approved
- time_window: not filled
- date: 2026-05-14

This package does not approve Level 2 execution by itself.
Level 2 requires a separate explicit human GO with a filled time window.

## Purpose

This document is the final review package for the human to decide whether
to issue Level 2 local controlled validation GO.

It provides a ready-to-copy GO block, the exact five-command scope, required
output policy, stop conditions, pre-run verification, and result log format.

No command in this package has been run or is approved to run by this document.

## Current State

| Item | Value |
|---|---|
| Latest commit | 2624f88 docs: clarify stackchan preparation only |
| Level 1 local dry-run | PASS (2026-05-14) |
| Level 2 scope proposal | DONE (v3.1.0) |
| Level 2 GO wording review | DONE (v3.1.1) |
| Level 2 final GO package | DONE (this doc) |
| Level 2 execution | not approved |
| Level 3 | not approved |
| decision | HOLD |
| execution | disabled |
| productionReady | false |

## Level 2 Selected Scope

Option A is selected: deeper redacted review of the same five local validation
commands that passed in Level 1. The goal is structured validation evidence
with category summaries and before/after working tree comparison.

## Final Human Decision Required

The human must review this package, fill in the time window in the GO block
below, and send it as an explicit GO message.

Creating and reviewing this package is not GO.

## Ready-To-Copy Future GO Block

The following block is a future GO template only. It is not active approval
until the human fills the time window and explicitly sends it as GO.

---

```
I explicitly approve Controlled Pilot Level 2 local controlled validation only.

Approved scope:
- level: Level 2 local controlled validation
- validation type: deeper redacted review of the same five Level 1 commands
- command execution: only the exact five commands listed below, in order,
  during the specified time window
- output: redacted-only structured summary
- remote/deploy/external services: not approved
- WSL/Hermes/wrapper/device/robot/voice/camera/mic: not approved
- Electron dev-mode: not approved
- secrets/raw/local-only values: not approved
- git push: not approved
- package/source changes: not approved
- npm install / npm update / npx: not approved

time_window: <YYYY-MM-DD HH:MM-HH:MM JST>
```

---

This block is a future GO template only.
It is not active approval until the human fills the time window and explicitly
sends it as GO.

## Exact Command Scope

The following commands are the complete proposed command list for the future
Level 2 GO. They are not approved to run by this package.

| Order | Command | Purpose | Status |
|---|---|---|---|
| 1 | `npm run typecheck:node` | Node typecheck | proposed_only_until_human_go: not approved to run by this package |
| 2 | `npm run typecheck:web` | Web typecheck | proposed_only_until_human_go: not approved to run by this package |
| 3 | `npm run lint` | ESLint | proposed_only_until_human_go: not approved to run by this package |
| 4 | `npm test` | Test suite | proposed_only_until_human_go: not approved to run by this package |
| 5 | `npm run build` | Local build | proposed_only_until_human_go: not approved to run by this package |

No additional commands may be added at execution time without a new GO.

## Required Time Window

The human must fill in before issuing GO:

```
time_window: <YYYY-MM-DD HH:MM-HH:MM JST>
```

If the time window is blank, invalid, or already passed, Level 2 must not run.

## Required Output Policy

All output from any Level 2 run must follow these rules.

Allowed output fields:

- command name
- exit code
- PASS / HOLD / NG
- elapsed time
- sanitized summary
- structured category summary (e.g. "0 errors, 0 warnings")
- useful count summaries (e.g. "87 test files passed")
- working tree before/after counts
- staged files count
- actual content diff count
- CRLF-only file count
- untracked file count
- stop condition status

Forbidden output fields:

- raw stdout / stderr transcript
- secrets
- tokens
- raw values
- local-only values
- raw JSON
- private local paths
- credential helper contents
- device values
- account values

## Required Stop Conditions

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

On stop: return to HOLD, record stop condition redacted-only, do not re-run
without a new explicit GO.

## Required Pre-Run Verification

Before running any Level 2 command, verify all of the following:

1. current branch is main.
2. latest commit is 2624f88 docs: clarify stackchan preparation only, or a later
   committed Level 2 docs commit if this package has been committed.
3. origin is https://github.com/tkFX-0/hermes-desktop.
4. staged files are empty.
5. git diff --name-status returns no actual content diff files.
6. remaining modified files are CRLF-only only.
7. untracked files are not staged.
8. no package.json or package-lock.json changes are staged.
9. no src/** or tests/** changes are staged.
10. time_window is filled and currently valid.

If any verification fails, STOP and do not run commands.

## Required Result Log Format

After any Level 2 run, use only this format:

```
RESULT:
status: PASS / HOLD / NG
level: Level 2 local controlled validation
time_window: <filled time window>
pre_run_verification:
  branch_main: PASS / HOLD / NG
  latest_commit_expected: PASS / HOLD / NG
  remote_expected: PASS / HOLD / NG
  staged_empty: PASS / HOLD / NG
  no_actual_content_diff: PASS / HOLD / NG
  crlf_only_remaining: PASS / HOLD / NG
  untracked_not_staged: PASS / HOLD / NG
  no_package_staged: PASS / HOLD / NG
  no_src_tests_staged: PASS / HOLD / NG
  time_window_valid: PASS / HOLD / NG
commands_run:
  - command: npm run typecheck:node
    result: PASS / HOLD / NG
    exit_code: <code>
    elapsed: <duration>
    summary: <redacted summary only>
    structured_category_summary: <redacted categories only>
  - command: npm run typecheck:web
    result: PASS / HOLD / NG
    exit_code: <code>
    elapsed: <duration>
    summary: <redacted summary only>
    structured_category_summary: <redacted categories only>
  - command: npm run lint
    result: PASS / HOLD / NG
    exit_code: <code>
    elapsed: <duration>
    summary: <redacted summary only>
    structured_category_summary: <redacted categories only>
  - command: npm test
    result: PASS / HOLD / NG
    exit_code: <code>
    elapsed: <duration>
    summary: <redacted summary only>
    structured_category_summary: <redacted categories only>
  - command: npm run build
    result: PASS / HOLD / NG
    exit_code: <code>
    elapsed: <duration>
    summary: <redacted summary only>
    structured_category_summary: <redacted categories only>
working_tree_before_after:
  before_staged_files: <count>
  after_staged_files: <count>
  before_actual_content_diff_files: <count>
  after_actual_content_diff_files: <count>
  before_crlf_only_files: <count>
  after_crlf_only_files: <count>
  before_untracked_files: <count>
  after_untracked_files: <count>
stop_conditions:
  triggered: yes / no
  summary: <redacted summary only>
safety_boundary:
  decision: HOLD
  execution: disabled
  productionReady: false
  rawValuesReported: false
  robotMotion: HOLD
  Level 3: not approved
  future_git_push: not approved
notes:
  - <short notes>
```

## Explicit Non-Approvals

This package does not approve:

- Level 2 execution by itself;
- Level 3;
- execution enabled;
- productionReady true;
- git push;
- deploy;
- Cloudflare;
- WSL / Hermes / wrapper;
- dummy process;
- RunPod;
- Electron dev-mode;
- StackChan / robot;
- voice / camera / mic;
- secrets;
- tokens;
- raw values;
- local-only values;
- package changes;
- source changes;
- npm install;
- npm update;
- npx.

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- Level 2: not approved
- Level 3: not approved
- Final Shikishima 100%: not complete
- future_git_push: not approved

## Final Checklist

Before issuing Level 2 GO, the human must confirm:

| # | Check | Status |
|---|---|---|
| 1 | LEVEL_1_LOCAL_DRY_RUN_EVIDENCE.md reviewed | confirm before GO |
| 2 | LEVEL_2_LOCAL_CONTROLLED_VALIDATION_SCOPE_PROPOSAL.md reviewed | confirm before GO |
| 3 | LEVEL_2_GO_WORDING_REVIEW.md reviewed | confirm before GO |
| 4 | This package (LEVEL_2_FINAL_GO_PACKAGE.md) reviewed | confirm before GO |
| 5 | Exact five command list confirmed | confirm before GO |
| 6 | Time window filled in GO block | fill before GO |
| 7 | Output policy understood (redacted + structured categories) | confirm before GO |
| 8 | Stop conditions understood | confirm before GO |
| 9 | Pre-run verification checklist confirmed | confirm before GO |
| 10 | Human monitor / recorder confirmed | confirm before GO |
| 11 | Before/after working tree comparison will be reported | confirm before GO |
| 12 | No external services or devices required | confirm before GO |
| 13 | No secrets, tokens, or raw values will be exposed | confirm before GO |
| 14 | GO block copied with time window filled in | fill before GO |
| 15 | GO issued in a new explicit message (not this document) | send as GO |

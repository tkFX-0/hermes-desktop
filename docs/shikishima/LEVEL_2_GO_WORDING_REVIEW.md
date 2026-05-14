# Level 2 GO Wording Review

## Document Status

- roadmapVersion: v3.1.1
- level: Level 2
- status: wording_review_only / HOLD
- level_2_execution: not approved
- current_level: Level 1 PASS
- target_level: Level 2 local controlled validation
- date: 2026-05-14

This document is a wording review only. It is not GO.
Creating and reviewing this document does not approve Level 2 execution.

## Purpose

This document provides the exact wording a human may use if they later decide to
approve Level 2 local controlled validation. It is prepared now so the human can
review the approval language before committing to it.

No command listed here has been run or is approved to run by this document.

## Current State

- Level 1 local dry-run: PASS (2026-05-14)
- Level 2 scope proposal: created and pushed (9c55a19)
- Level 2 selected scope: Option A — deeper redacted review of same five Level 1 commands
- Level 2 execution: not approved

## Level 2 Selected Scope

Option A is selected for Level 2: deeper redacted review of the same five local
validation commands that passed in Level 1. The goal is structured validation
evidence with category summaries and before/after working tree comparison.

Options B (tests/ichikishima commit path) and C (Electron dev-mode) remain HOLD.

## Proposed Future Human GO Wording

The following is a DRAFT ONLY template for future human use. It has no approval
effect until the human copies it into a new message with the time window filled
in and sends it explicitly.

---

```
DRAFT ONLY — NOT APPROVED YET

I explicitly approve Controlled Pilot Level 2 local controlled validation only.

Approved scope:
- level: Level 2 local controlled validation
- validation type: deeper redacted review of the same five Level 1 commands
- remote/deploy/external services: not approved
- WSL/Hermes/wrapper/device/robot/voice/camera/mic: not approved
- secrets/raw/local-only values: not approved
- git push: not approved
- package/source changes: not approved
- npm install / npm update / npx: not approved
- command execution: only the exact commands listed below, in order,
  during the specified time window

Approved commands:
1. npm run typecheck:node
2. npm run typecheck:web
3. npm run lint
4. npm test
5. npm run build

Time window:
- <YYYY-MM-DD HH:MM-HH:MM JST>

Output policy:
- redacted-only structured summary
- no raw stdout/stderr transcript
- PASS/HOLD/NG with structured category summaries and before/after working tree counts

Stop conditions:
- stop on any secret/raw/local-only exposure risk
- stop on unexpected file edits
- stop on install/npx/dependency update requirement
- stop on external network requirement
- stop on WSL/Hermes/wrapper/device/robot/voice/camera/mic requirement
- stop on Electron dev-mode launch requirement
- stop on productionReady true or execution enabled request
- stop on git push request

This GO is valid only if copied by the human in a later message with the
time window filled in.
This document itself is not GO.
```

---

## Exact Proposed Command Scope

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

## Required Time Window

The human must fill in before issuing GO:

```
time_window: <YYYY-MM-DD HH:MM-HH:MM JST>
```

If the time window is blank, invalid, or already passed, Level 2 must not run.

## Required Output Policy

Output must be redacted-only. No raw stdout/stderr transcript may be pasted
into chat.

Allowed output fields:

- command name
- exit code
- PASS / HOLD / NG
- elapsed time
- sanitized summary
- structured category summary (e.g. "0 errors, 0 warnings")
- useful count summaries
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
2. latest commit is 9c55a19 docs: prepare level 2 scope proposal, or a later
   committed Level 2 docs commit if this document has been committed.
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

This document does not approve:

- Level 2 execution;
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

## Final Review Checklist

Before issuing Level 2 GO, the human must confirm each item:

| # | Check | Must be true before GO |
|---|---|---|
| 1 | LEVEL_1_LOCAL_DRY_RUN_EVIDENCE.md reviewed | yes |
| 2 | LEVEL_2_LOCAL_CONTROLLED_VALIDATION_SCOPE_PROPOSAL.md reviewed | yes |
| 3 | This document reviewed | yes |
| 4 | Exact command list confirmed (same 5 as Level 1) | yes |
| 5 | Time window filled in | yes |
| 6 | Output policy understood (redacted + structured categories) | yes |
| 7 | Stop conditions understood | yes |
| 8 | Human monitor / recorder confirmed | yes |
| 9 | Pre-run verification checklist confirmed | yes |
| 10 | No external services or devices required | confirmed |
| 11 | No secrets, tokens, or raw values will be exposed | confirmed |
| 12 | Working tree before/after comparison will be reported | confirmed |
| 13 | GO wording copied with time window filled in | yes |
| 14 | GO issued in a new explicit message (not this document) | yes |
| 15 | Level 2 execution still requires a new explicit human GO | yes |

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- Level 2: not approved
- Level 3: not approved
- future_git_push: not approved

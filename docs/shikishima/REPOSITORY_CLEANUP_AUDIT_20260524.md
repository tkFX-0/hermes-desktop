# Repository Cleanup Audit 2026-05-24

## Result Candidate

```text
status: CLEANUP_PASS_CANDIDATE
branch: main
origin_main: 1423949
head_before_cleanup_commit: d0bd4e6
commits_ahead_before_cleanup_commit: 27
tracked_dirty_before_cleanup: yes
untracked_before_cleanup: yes
git_push_performed: false
```

## Purpose

This record consolidates the repository cleanup pass after multiple ClaudeCode, Codex, and user-side implementation sessions.

The goal was not to revert prior work. The goal was to:

- preserve current implementation progress
- remove obvious commit blockers
- verify build health
- prevent raw local values from entering tracked evidence
- make the remaining state reviewable as a normal local commit

## Worktree Findings

```text
ahead_commits_from_origin_main: 27
behind_origin_main: 0
tracked_dirty_files_present: true
untracked_project_files_present: true
package_changed: false
lockfile_changed: false
image_assets_added: false
runtime_started_by_cleanup: false
external_api_write_by_cleanup: false
git_push_performed: false
```

The ahead commits include prior work for:

- StackChan voice route planning
- Grok / Hermes / x_search integration wiring
- Discord bot operation history
- system tray support
- StackChan local service, VOICEVOX, MCP, and status UI
- Claude Code integration

The dirty and untracked files include:

- Shikishima agent architecture and reconstruction docs
- StackChan firmware / dance / LED / servo evidence docs
- agent routing, skill, memory, profile, and safety source files
- safety gate and preflight code
- preload API exposure fixes
- tests for Shikishima core policies and gates
- helper scripts for Shikishima and StackChan workflows

## Safety Cleanup

```text
known_wifi_password_literal_present: false
known_stackchan_control_token_literal_present: false
raw_stackchan_lan_ip_literal_present: false
raw_pc_lan_ip_literal_present: false
raw_local_windows_project_path_present: false
raw_device_mac_in_flash_evidence_present: false
rawValuesReported: false
```

Changes made during cleanup:

- Rewrote `UPDATE_SUMMARY_20260524.md` as a sanitized evidence summary.
- Removed raw local StackChan host defaults from app/service code.
- Moved StackChan host selection to environment variables.
- Redacted local COM/path/device values from firmware flash evidence.
- Replaced firmware example PC IP values with local-only placeholders.
- Added ignore rules for local logs, local memory/cache, and local face asset scratch folders.

## Verification

```text
git_diff_check: PASS
typecheck: PASS
lint_quiet: PASS
test: PASS
build: PASS before this audit doc; rerun recommended after final staging if desired
```

Latest confirmed commands:

```text
npm run typecheck: PASS
npm run lint -- --quiet: PASS
npm test: PASS
```

Test summary:

```text
test_files: 94 passed / 1 skipped
tests: 831 passed / 1 skipped
```

## Current Safety Boundary

```text
productionReady: false
execution: disabled
rawValuesReported: false
StackChan_auto_control: HOLD
motion_dance_automation: HOLD
camera_mic_voice_loop: HOLD
Discord_auto_send: HOLD
x_search_auto_run: HOLD
Obsidian_write: HOLD
git_push: HOLD
```

## Push Readiness

This cleanup record does not approve push.

Before any push:

1. Review the final local cleanup commit scope.
2. Confirm no package or lockfile changes.
3. Confirm no raw secrets, tokens, local IPs, local-only paths, or device identifiers.
4. Re-run typecheck, lint, and tests if additional edits occur.
5. Use a separate explicit human push GO.

## Next Recommended State

```text
target_local_state:
  staged: 0
  tracked_dirty: 0
  untracked_project_files: 0
  commits_ahead: current ahead commits + cleanup commit
  push: HOLD
```

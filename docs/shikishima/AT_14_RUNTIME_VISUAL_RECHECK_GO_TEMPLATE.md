# AT-14 Runtime Visual Recheck — GO Template

**Status:** HOLD — human must fill all fields and explicitly say GO

This template is NOT approval by itself.
A human must fill in all required fields and explicitly say:
"AT-14 runtime visual recheck GO" (or equivalent explicit approval).

Filling this template alone does not start runtime.

---

## GO Form

```yaml
at14_runtime_visual_recheck_go:

  # Required: date of the session (YYYY-MM-DD)
  date:

  # Required: JST time window (e.g. "21:00-22:00 JST")
  time_window_start:
  time_window_end:
  timezone: JST

  # Approved command (must match exactly)
  approved_command: npm run dev

  # Working directory (confirm before running)
  working_directory: C:/Users/81903/Desktop/プロジェクトファイル/hermes-desktop

  # Observation scope
  observation_scope: Agent Theater / 管制室 — AT-07 through AT-13

  # Shutdown method (must be filled)
  shutdown_method: Ctrl+C in terminal

  # Post-run verification steps
  post_run_checks:
    - runtime_stopped: confirm terminal prompt returned
    - git_status: run "git status --short" → confirm tracked_dirty = 0
    - port_check: optional — confirm port 5173 released

  # Evidence file to create after session
  evidence_file: docs/shikishima/AT_14_RUNTIME_VISUAL_RECHECK_EVIDENCE_YYYY-MM-DD.md

  # Human notes (optional)
  notes:
```

---

## Pre-flight Checklist (human reviews before saying GO)

- [ ] HEAD == origin/main == a8ef150 (or latest confirmed push)
- [ ] git status --short shows tracked_dirty = 0
- [ ] No unexpected staged files
- [ ] npm run dev command is the only command to run
- [ ] No external connections expected
- [ ] No OAuth, x_search, Obsidian write, external API write will occur
- [ ] productionReady: false confirmed in code (GateDashboardPanel, ControlRoomLayout)
- [ ] execution: disabled confirmed in code
- [ ] Time window is set with a clear end time
- [ ] Shutdown method is understood

---

## What Remains HOLD Even After GO

Approval of this time_window GO does NOT approve:

- git push (separate human GO required)
- OAuth provider connection
- x_search / social reading
- Obsidian write
- external API write
- productionReady: true
- execution: enabled
- Any Level 5 action beyond this time_window observation session

---

## How to Invoke

After filling the form above and confirming the pre-flight checklist:

1. Say explicitly: "AT-14 runtime visual recheck GO"
   (or paste the filled form and say "GO")
2. Run in terminal:
   ```
   cd "C:/Users/81903/Desktop/プロジェクトファイル/hermes-desktop"
   npm run dev
   ```
3. Open the Agent Theater / 管制室 screen in the app
4. Follow the visual checklist in `AT_14_RUNTIME_VISUAL_RECHECK_SCOPE.md`
5. When done, press Ctrl+C
6. Run git status --short to confirm clean state
7. Fill in `AT_14_RUNTIME_VISUAL_RECHECK_EVIDENCE_YYYY-MM-DD.md`

AIは作るところまで。
鍵と発射ボタンは人間。

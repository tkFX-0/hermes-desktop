# AT-14 Runtime Visual Recheck — Evidence Template

Copy this file and rename to: `AT_14_RUNTIME_VISUAL_RECHECK_EVIDENCE_YYYY-MM-DD.md`
Fill in all fields after the visual recheck session.

---

## Session Header

```yaml
at14_runtime_visual_recheck:
  result:                  # PASS / PARTIAL / FAIL / STOP
  date:                    # YYYY-MM-DD
  time_window_start:       # HH:MM JST
  time_window_end:         # HH:MM JST (actual)
  command_run:             npm run dev
  worker_at_keyboard:      human
  baseline_commit:         a8ef150
```

---

## Runtime Lifecycle

```yaml
runtime_lifecycle:
  runtime_started:         # true / false
  runtime_stopped:         # true / false
  shutdown_method_used:    # Ctrl+C
  port_closed_after:       # true / false / not checked
  git_status_after:        # clean / unexpected changes (describe)
  tracked_dirty_after:     # 0 / N (list files if non-zero)
```

---

## Safety Invariants

```yaml
safety_invariants:
  productionReady_seen:       # false (expected)
  execution_seen:             # disabled (expected)
  rawValues_seen:             # false (expected)
  push_button_appeared:       # false (expected)
  runtime_button_appeared:    # false (expected)
  oauth_started:              # false (expected)
  x_search_executed:          # false (expected)
  obsidian_written:           # false (expected)
  external_api_write:         # false (expected)
  unexpected_network:         # false (expected)
  unexpected_login_prompt:    # false (expected)
  secret_or_token_visible:    # false (expected)
```

---

## Visual Checklist Results

### Layout

- [ ] Control Room layout visible and readable
- [ ] No horizontal overflow at tested window size
- [ ] Section order readable: 管制室 → SLOTS → WORKERS → RESUME QUEUE → RUNAWAY GUARD → ROUTING → GATES
- [ ] Sidebar (PageRightRail) visible at desktop width (>= 900px)

### AT-07 Control Room

- [ ] 5 agent zones visible (しきしま / しずめ / はじめ / つむぎ / しるべ)
- [ ] Zone labels and pose badges visible
- [ ] Safety badge strip visible (execution: disabled / productionReady: false / etc.)
- [ ] Night window decorative panel visible
- [ ] Dot-grid accent strips visible
- [ ] decision badge reflects expected state

### AT-07 Handoff Lane

- [ ] 6 steps visible
- [ ] Active step highlighted (pulse-glow or static if reduced-motion)
- [ ] HandoffCard floating above active step visible
- [ ] Arrow connectors between steps visible
- [ ] "人間GO必要" badge visible
- Reduced-motion tested: yes / no / not applicable

### AT-08 Worker Status Panel

- [ ] 5 worker cards visible: GPT / ClaudeCode / Codex / Cursor / Human Gate
- [ ] READY / BLOCKED / NEEDS_HUMAN status badges visible
- [ ] Level legend (Lv 1–5) visible
- [ ] Lv 4 "AI作業OK" badge visible
- [ ] Lv 5 "人間GO必須" badge visible
- [ ] Tagline visible

### AT-09 Resume Queue Panel

- [ ] 4 task cards visible
- [ ] CooldownBadge per task visible
- [ ] Level 5 / 人間GO badge on NEEDS_HUMAN cards visible
- [ ] Safety badge strip visible
- [ ] Taglines visible

### AT-10 Runaway Guard Panel

- [ ] Panel header with "AI自動実行禁止" red badge visible
- [ ] 9 guarded action cards visible
- [ ] git push / runtime / OAuth / x_search / Obsidian / 外部write / productionReady / execution / API auto all listed
- [ ] Level 4/5 boundary badges visible
- [ ] Taglines visible

### AT-11 Worker Routing Panel

- [ ] 5 route cards visible
- [ ] Allowed / forbidden badges per card visible
- [ ] Handoff prompt preview blocks visible
- [ ] Safety badge strip visible (auto-dispatch: disabled etc.)
- [ ] Level 4/5 boundary row visible
- [ ] Taglines visible

### AT-12 Gate Dashboard Panel

- [ ] Summary badge row visible (productionReady: false / execution: disabled / etc.)
- [ ] 12 gate cards visible
- [ ] PUSH-GO / RUNTIME-GO / OAUTH-GO visible as NEEDS_HUMAN
- [ ] XS-READ / OBS-LOCAL / SPRITE-ASSET visible as FUTURE
- [ ] EXTERNAL-WRITE visible as BLOCKED
- [ ] PRODUCTION-READY / EXECUTION-ENABLE visible as LOCKED
- [ ] STACKCHAN-PHYSICAL / VOICE-CAMERA-MIC visible as HOLD
- [ ] RUNTIME-VISUAL-RECHECK visible as NEEDS_HUMAN
- [ ] Footer taglines visible

### AT-13 Visual Polish

- [ ] Section headings readable
- [ ] Card spacing acceptable
- [ ] Border-left accent stripes visible
- [ ] Long Japanese labels readable
- [ ] Safety labels not hidden

---

## Issues Found

```
(list any visual issues, overflow, missing labels, or unexpected behavior)
```

---

## STOP Events

```
(list any STOP conditions that were triggered — should be none)
```

---

## Notes

```
(any additional observations)
```

---

## Outcome

```yaml
outcome:
  visual_recheck_result:   # PASS / PARTIAL / FAIL / STOP
  at07_pass:               # true / false / partial
  at08_pass:               # true / false / partial
  at09_pass:               # true / false / partial
  at10_pass:               # true / false / partial
  at11_pass:               # true / false / partial
  at12_pass:               # true / false / partial
  at13_pass:               # true / false / partial
  safety_invariants_pass:  # true / false
  issues_requiring_fix:    # none / list
  next_action:             # push GO / fix issues / re-run recheck
```

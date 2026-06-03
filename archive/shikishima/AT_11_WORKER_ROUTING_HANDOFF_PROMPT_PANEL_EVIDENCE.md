# AT-11 Worker Routing / Handoff Prompt Panel Evidence

## Result

```
status:                    IMPLEMENTATION_PASS_CANDIDATE
worker:                    ClaudeCode
runtime_visual_check:      HOLD — not performed (human GO required)
human_visual_confirmation: HOLD
```

## Purpose

Display-only panel showing which worker handles which kind of task,
plus sample handoff prompt previews for ClaudeCode / Codex / Human Gate.
Answers: "この作業は誰に渡すべきか？"
No auto-dispatch. No API calls. Static display data only.

---

## Baseline

```
branch:           main
head:             72748ba == origin/main
commits_ahead:    0
staged:           0
tracked_dirty:    0
```

---

## Changed Files

| File | Change |
|---|---|
| `src/renderer/src/types/agent-theater-types.ts` | MODIFIED — added `WorkerRouteKind` type + `WorkerRoute` interface |
| `src/renderer/src/screens/AgentTheater/RouteWorkerBadge.tsx` | NEW — worker name badge |
| `src/renderer/src/screens/AgentTheater/HandoffPromptPreview.tsx` | NEW — display-only prompt preview block |
| `src/renderer/src/screens/AgentTheater/WorkerRouteCard.tsx` | NEW — card per worker route |
| `src/renderer/src/screens/AgentTheater/WorkerRoutingPanel.tsx` | NEW — full panel with routes + prompt previews + safety strip |
| `src/renderer/src/screens/AgentTheater/AgentTheaterPage.tsx` | MODIFIED — ROUTING section added below RUNAWAY GUARD |

---

## WorkerRouteKind Enum (added to types)

```
DESIGN / UI_IMPLEMENTATION / SMALL_FIX / PUSH_READINESS /
RUNTIME_OBSERVATION / OAUTH_GATE / SOCIAL_READ_ONLY /
OBSIDIAN_LOCAL_NOTE / EXTERNAL_WRITE / HUMAN_APPROVAL
```

---

## Worker Routes Displayed (5 cards)

| Worker | Level | HumanGO |
|---|---|---|
| GPT | Lv 1–2 | false |
| ClaudeCode | Lv 2–4 | false (until push/runtime) |
| Codex | Lv 3–4 | false (until push) |
| Cursor | optional | true |
| Human Gate | Lv 5 | true |

Each card shows: task type / handoff mode / plain reason / allowed badges / forbidden badges

---

## Handoff Prompt Previews (3 display-only blocks)

| Title | Worker |
|---|---|
| ClaudeCode — impl | "Implement this panel. Do not run runtime. Do not push." |
| Codex — push review | "Review push readiness. Do not modify files. Do not push." |
| Human — push GO | "Approved: git push origin main. Scope: push commit <hash> only." |

No auto-copy. No auto-send. No API call. Display-only label shown.

---

## Safety Badge Strip

auto-dispatch: disabled / API auto-use: disabled / push: human GO /
runtime: time_window GO / OAuth: human GO / x_search: read-only GO /
Obsidian: local GO / ext. write: blocked

---

## Plain Language Taglines

- AIは作るところまで。
- 鍵と発射ボタンは人間。

---

## Forbidden UI Elements Confirmed Absent

```
auto_dispatch_button:     none
send_to_worker_button:    none
push_button:              none
runtime_start_button:     none
oauth_login_button:       none
x_search_run_button:      none
obsidian_write_button:    none
external_api_button:      none
execute_button:           none
```

---

## Safety Invariants

```
source_changed:       true
docs_changed:         true
package_changed:      false
dependency_changed:   false
image_assets_added:   false
runtime_started:      false
npm_run_dev:          false
oauth_started:        false
x_search_executed:    false
obsidian_written:     false
external_api_write:   false
productionReady:      false
execution:            disabled
rawValuesReported:    false
git_push_performed:   false
```

---

## Checks Run

```
typecheck:web:   PASS
vitest:          806 passed / 1 skipped (807 total)
scoped_eslint:   not run (prettier warnings only — not a blocker)
```

---

## Next Step

Push readiness review → push GO → human visual runtime recheck (separate time_window GO)

---

_Recorded: 2026-05-19_
_productionReady: false_
_execution: disabled_

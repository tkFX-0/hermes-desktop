# AT-10 Runaway Guard / Human-Gated Action Panel Evidence

## Result

```
status:                    IMPLEMENTATION_PASS_CANDIDATE
worker:                    ClaudeCode
runtime_visual_check:      HOLD — not performed (human GO required)
human_visual_confirmation: HOLD
```

## Purpose

Display-only panel showing which actions AI must not perform automatically,
and what explicit human GO is required to proceed.
Provides the control room with a clear boundary display:
"AIは作るところまで。鍵と発射ボタンは人間。"

---

## Baseline

```
branch:           main
head:             d96d976 == origin/main
commits_ahead:    0
staged:           0
tracked_dirty:    0
```

---

## Changed Files

| File | Change |
|---|---|
| `src/renderer/src/types/agent-theater-types.ts` | MODIFIED — added `GuardedActionStatus` type |
| `src/renderer/src/screens/AgentTheater/GuardrailBadge.tsx` | NEW — badge for GuardedActionStatus |
| `src/renderer/src/screens/AgentTheater/HumanGateActionCard.tsx` | NEW — card per guarded action |
| `src/renderer/src/screens/AgentTheater/RunawayGuardPanel.tsx` | NEW — panel with 9 guarded actions + Level boundary + taglines |
| `src/renderer/src/screens/AgentTheater/AgentTheaterPage.tsx` | MODIFIED — RUNAWAY GUARD section added below RESUME QUEUE |

---

## GuardedActionStatus Enum

```
HUMAN_GO_REQUIRED   orange  HUMAN GO
READ_ONLY_GO        amber   READ ONLY
LOCAL_GO_REQUIRED   blue    LOCAL GO
BLOCKED             red     BLOCKED
LOCKED_FALSE        gray    LOCKED
LOCKED_DISABLED     gray    LOCKED
DISABLED            dim     DISABLED
```

---

## Guarded Actions Displayed (9 total)

| Action | Status | Plain Label |
|---|---|---|
| git push | HUMAN_GO_REQUIRED | GitHubへ送るのは人間GO |
| runtime 起動 | HUMAN_GO_REQUIRED | アプリ起動はtime_window付きGO |
| OAuth ログイン | HUMAN_GO_REQUIRED | ログイン連携は人間GO |
| x_search / SNS読み取り | READ_ONLY_GO | SNS読み取りはread-only GO |
| Obsidian ローカル記録 | LOCAL_GO_REQUIRED | Obsidian記録はlocal GO |
| 外部書き込み | BLOCKED | 外部書き込みは明示GOなし禁止 |
| productionReady | LOCKED_FALSE | 本番OK化は人間判断 |
| execution enabled | LOCKED_DISABLED | 自動実行ONは禁止 |
| API 自動利用 | DISABLED | API自動利用なし |

---

## Level Boundary Badges

- Level 4まで: AI作業候補 (green)
- Level 5: 人間GO必須 (orange)

## Plain Language Taglines

- AIは作るところまで。
- 鍵と発射ボタンは人間。

---

## Forbidden UI Elements Confirmed Absent

```
push_button:             none
runtime_start_button:    none
oauth_login_button:      none
x_search_run_button:     none
obsidian_write_button:   none
external_api_button:     none
execute_button:          none
send_post_button:        none
production_ready_toggle: none
execution_enabled_toggle: none
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

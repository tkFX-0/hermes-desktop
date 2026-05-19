# PXR-05D Character Direction + Handoff Motion — Evidence

**date:** 2026-05-20
**worker:** ClaudeCode

---

## Purpose

Add visible workflow motion: who is working on what, and how the handoff document flows between stations. Route: むすび → しずめ → つむぐ → しるべ → しきしま.

---

## New Files

| File | Role |
|---|---|
| `PixelRoomHandoffPath.tsx` | SVG overlay: path lines, arrowheads, station nodes, animated token |
| `PixelRoomWorkScene.tsx` | Per-station work bubbles showing current activity |

Modified:
- `PixelRoomStage.tsx`: import + render both new components

---

## PixelRoomHandoffPath

- SVG absolute overlay (940×500, pointer-events: none)
- Dashed colored path lines: green→red→orange→purple→blue
- Mid-segment arrowheads (polygon)
- Station node circles at each desk
- Workflow step labels (① 計画する ... ⑤ 確認・GO待ち)
- Animated token: glowing "document card" (rect + 3 lines)
  - SVG `<animateMotion>` with keyPoints/keyTimes for station pauses
  - 14s loop, pauses ~7% at each station
- `prefers-reduced-motion`: token animation `begin="indefinite"` (static)
- STOP mode: paths turn red, "HOLD: handoff suspended" overlay

## PixelRoomWorkScene

- 5 work-status bubbles, one per agent
- Shows: 🎧 全体確認・GO待ち / ⛑️ 安全確認中 / 🗺 計画作成中 / ⌨️ 実装・テスト中 / 📝 証跡記録中
- Pose-aware: HOLD → "🛑 HOLD 停止中", working → role-specific, thinking → "💭 判断中"
- Positioned above each agent (y = agent_y - ~30px)
- Thin connector line below bubble

---

## Safety Confirmation

```yaml
character_direction_improved:  true
work_scenes_improved:          true
handoff_route_added:           true
handoff_token_added:           true
path_lines_added:              true
shikishima_command_scene:      true  # 🎧 全体確認・GO待ち
shizume_safety_scene:          true  # ⛑️ 安全確認中
hajime_planning_scene:         true  # 🗺 計画作成中
tsumugi_development_scene:     true  # ⌨️ 実装・テスト中
shirube_record_scene:          true  # 📝 証跡記録中
reduced_motion_preserved:      true  # begin="indefinite" when prefers-reduced-motion
safety_labels_preserved:       true
display_only:                  true
forbidden_buttons_absent:      true
image_assets_added:            false
package_added:                 false
runtime_started_by_task:       false
git_push_performed:            false
productionReady:               false
execution:                     disabled
```

---

## Checks

```
typecheck:web: PASS
```

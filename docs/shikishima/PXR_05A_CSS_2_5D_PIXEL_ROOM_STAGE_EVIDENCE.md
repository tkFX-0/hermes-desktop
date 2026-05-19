# PXR-05A CSS 2.5D Pixel Room Stage — Evidence

**date:** 2026-05-20
**worker:** ClaudeCode
**reference_image:** ３D部屋イメージ.png (conceptual reference — not imported)

---

## Purpose

Build the pixel room as a layered CSS 2.5D stage — not a flat background image.
Floor, walls, desks, props, agents positioned in room coordinates with z-index depth.

---

## New Files (AgentTheater/)

| File | Role |
|---|---|
| `PixelRoomStage.tsx` | Main assembly — 880×440 stage, all layers |
| `PixelRoomFloor.tsx` | Floor grid (CSS repeating-linear-gradient, depth shadow) |
| `PixelRoomWalls.tsx` | Back wall + side accents + night windows + panels + stars |
| `PixelRoomDesk.tsx` | 3-face pseudo-3D desk (top face + accent strip + front face + legs) |
| `PixelRoomAgent.tsx` | GhostSvg + name tag, absolutely positioned with transform |
| `PixelRoomProps.tsx` | CommandMonitor, SafetyGate, PlanBoard, ToolBox, BookShelf, DeskLamp |
| `PixelRoomSafetyHud.tsx` | Large top status boxes (HOLD/execution/productionReady/raw/standby) |
| `PixelRoomHandoffRail.tsx` | 5-step horizontal pixel-box lane with arrows |
| `PixelRoomLogStrip.tsx` | Bottom message + gate status panel |

Modified:
- `AgentTheaterPage.tsx` — swaps PixelRoomView for PixelRoomStage

---

## Layout (880×440 stage)

```
[Safety HUD] HOLD | execution:disabled | productionReady:false | raw:hidden | 待機中
┌──────────────────────────────────────────────────────────────┐
│ ← WALL PANEL    NIGHT WINDOW   🌙管制室   NIGHT WINDOW   WALL→│  ← back wall
│                                                               │
│                         [MON] しきしま [MON]                  │  ← z:10 (back)
│                              🗨️ 司令席                        │
│                                                               │
│  [HOLD SIGN]  [PLAN MAP]               [TOOLBOX]  [BOOKSHELF] │
│   🚨 しずめ     むすび 🗺                  つむぐ ⌨️   しるべ 📚  │  ← z:20 (front)
│  [DESK×5 — 3-face CSS boxes with accent glow]                │
└──────────────────────────────────────────────────────────────┘
[Handoff Rail] ①ユーザー依頼 → ②計画する → ③安全チェック → ④実装する → ⑤記録する
[Log Strip] おしらせ / 夜間オペレーション中  |  [Gate Panel] Git Push:HOLD / runtime:HOLD...
[Safety HUD] execution:disabled / productionReady:false / Gate:HOLD / Level 5
```

## Depth / z-index

| Layer | z-index |
|---|---|
| Floor grid | 2 |
| Wall | 3 |
| Wall props | 4 |
| しきしま desk | 8 |
| しきしま agent | 10 |
| Front desks | 15 |
| Front props | 16 |
| Front agents | 20 |
| HUD | 100+ |

---

## Safety Confirmation

```yaml
css_2_5d_pixel_room_stage_added:   true
reference_image_used_conceptually: true
image_asset_imported:              false
package_added:                     false
floor_layer_added:                 true
wall_layers_added:                 true
depth_layout_added:                true
desks_added:                       true   # 5 × PixelRoomDesk (3-face CSS)
props_added:                       true   # CommandMonitor, SafetyGate, PlanBoard, ToolBox, BookShelf, DeskLamp
five_agents_placed:                true
shikishima_command_desk:           true   # center-back, z=10
shizume_safety_gate:               true   # front-left, HOLD sign, gate barrier, cones
hajime_planning_desk:              true   # front-center-left, SVG map, sticky notes
tsumugi_development_bench:         true   # front-center-right, keyboard, toolbox
shirube_record_log:                true   # front-right, colorful bookshelf
top_hud_added:                     true   # PixelRoomSafetyHud (5 boxes)
handoff_rail_added:                true   # PixelRoomHandoffRail (5 steps)
gate_mini_panel_added:             true   # in PixelRoomLogStrip
bottom_message_strip_added:        true   # おしらせ / safety motto
safety_labels_preserved:           true
display_only:                      true
forbidden_buttons_absent:          true
source_changed:                    true
docs_changed:                      true
package_changed:                   false
dependency_changed:                false
image_assets_added:                false
runtime_started:                   false
npm_run_dev:                       false
command_chat_sent:                 false
hermes_bridge_connected:           false
oauth_started:                     false
x_search_executed:                 false
obsidian_written:                  false
external_api_write:                false
productionReady:                   false
execution:                         disabled
rawValuesReported:                 false
git_push_performed:                false
```

---

## Checks

```
typecheck:web: PASS
```

---

## Next Recommended Action

Human visual review with runtime time_window GO.
If PASS: push GO.
Then: PXR-05B visual polish (agent sizing, floor depth, prop details) or PXR-06 free camera investigation.

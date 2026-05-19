# PXR-05C Character Identity + Room Interior Depth — Evidence

**date:** 2026-05-20
**worker:** ClaudeCode
**reference:** ３D部屋イメージ.png + sprite sheet (conceptual, not imported)

---

## Purpose

Bring characters closer to sprite-sheet reference and strengthen room interior depth through station carpets, ambient glows, window frame improvements, and larger agent presence.

---

## Changed Files

| File | Changes |
|---|---|
| `PixelRoomStage.tsx` | Stage 480→500px, StationCarpet + StationGlow per station, agents 60-62px, adjusted positions |
| `PixelRoomWalls.tsx` | NightWindow: 3px frame, cross-dividers, sill, city density; indoor ambient overlay; baseboard trim; WallControlPanel: 4-LED status |
| `PixelRoomFloor.tsx` | Stronger checkerboard, thicker grid lines, left/right vignettes, center glow |
| `PixelRoomAgent.tsx` | accessory label (COMMAND/HOLD GATE/PLANNING/DEV BENCH/ARCHIVE), stronger ghost glow (isCommand/isGate special shadow), role text below name |

---

## New Visual Elements

### StationCarpet (5 zones)
- **しきしま** (center-back): blue carpet 180×140, radial gradient + dashed inner border
- **しずめ** (front-left): red safety mat 150×130
- **むすび** (front-center-left): green plan mat 138×125
- **つむぐ** (front-center-right): orange work mat 138×125
- **しるべ** (front-right): purple record mat 150×130

### StationGlow (5 ambient halos)
Radial gradient ambient light behind each agent, z-index between carpet and agent.

### Window improvements
- 3px frame (clear indoor/outdoor separation)
- Cross dividers (horizontal + vertical window pane)
- Window sill (indoor-side lighter bar)
- Denser city skyline

### Indoor/outdoor separation
- Back wall: `rgba(88,120,200,0.06)` indoor ambient overlay
- Strong wall/floor junction shadow
- Wall baseboard trim bar

---

## Character Identity

| Agent | Accessory label | Special effect |
|---|---|---|
| しきしま | 🎧 COMMAND | Blue double drop-shadow |
| しずめ | ⛑️ HOLD GATE | Red glow on HOLD pose |
| むすび | 🗺 PLANNING | Green badge |
| つむぐ | 🔧 DEV BENCH | Orange badge |
| しるべ | 📚 ARCHIVE | Purple badge |

---

## Safety Confirmation

```yaml
character_identity_improved:       true
ghost_style_closer_to_reference:   true
shikishima_headset_command_improved: true
shizume_hold_safety_improved:      true
hajime_map_planning_improved:      true
tsumugi_tool_development_improved: true
shirube_book_record_improved:      true
room_outside_separation_improved:  true
carpets_or_rugs_added:             true
lighting_improved:                 true  # StationGlow + WallLamp + DeskLamp
station_depth_improved:            true
top_hud_preserved:                 true
handoff_rail_preserved:            true
safety_labels_preserved:           true
display_only:                      true
forbidden_buttons_absent:          true
image_assets_added:                false
package_added:                     false
runtime_started_by_task:           false
git_push_performed:                false
productionReady:                   false
execution:                         disabled
```

---

## Checks

```
typecheck:web: PASS
```

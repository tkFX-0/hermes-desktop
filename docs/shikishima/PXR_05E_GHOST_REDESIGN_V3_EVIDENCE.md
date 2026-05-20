# PXR-05E Ghost Redesign v3 — Evidence

**date:** 2026-05-20
**worker:** ClaudeCode

---

## Purpose

Redesign Pixel Room ghost characters to match the approved character design sheet.
Reference images viewed as visual spec only — no PNG assets added to repo.

---

## Design Spec (from visual reference)

| Character | Hat/Head | Key item | Flag |
|---|---|---|---|
| しきしま | Navy headset (thick band + oval earpads) + mic boom | Blue "しき" flag | ✓ |
| しずめ | **Dark flat officer cap** (NOT yellow hardhat) + yellow vest stripes | Red HOLD sign | ✓ |
| はじめ | None | Green terrain map + "?" thought bubble | — |
| つむぎ | Yellow hard hat (dome + brim + ribs) | Brown toolbox + wrench | Orange "つむ" flag |
| しるべ | Dark headphones (same arc as しきしま, slightly taller pads) | Open logbook + pen | Purple "しる" flag |

---

## Changed Files

| File | Change |
|---|---|
| `PixelGhostSprite.tsx` | Full redesign — shared Body/Face/MiniFlag + 5 character sprites |
| `PixelRoomHandoffPath.tsx` | Improved AgentMiniGhost + removed English label text |

---

## PixelGhostSprite.tsx — Key Improvements over Previous Version

- Body: `BODY_PATH` round ghost shape with 3-bump tail, shared across all 5 characters
- Face: unified component with `mood` prop (smile / focus / calm)
- MiniFlag: 17×12px flag rect + 5.8px text — readable at 60px render size
- **しずめ**: removed wrong yellow helmet lamp circles; now correctly shows dark flat cap
- **はじめ**: removed confusing brown "toolbox" (was つむぎ item); replaced map + thought bubble as primary identifiers
- **つむぎ**: added orange "つむ" flag for at-a-glance identity
- **しるべ**: added purple "しる" flag; logbook + pen large enough for 60px render
- All accessories sized for readability at render distance (accessories ≥ 20px equivalent)

## PixelRoomHandoffPath.tsx — Key Improvements

- `AgentMiniGhost`: improved earpads (rx=4, ry=5.5), better cap proportions
- Removed English `label -> to` text that was visible on screen
- Each mini ghost has clear identity accessory at tiny scale:
  - しきしま: headset band arc + oval earpads + mic arm
  - しずめ: dark flat cap dome + wide brim
  - はじめ: "?" thought bubble (upper right)
  - つむぎ: bright yellow helmet dome + brim
  - しるべ: headphones (slightly taller pads than しきしま)
- Document held by ghost: 24×15px with bobbing animateTransform

---

## Safety Confirmation

```yaml
image_assets_added:          false   # PNG未使用 — reference images viewed only
package_added:               false
runtime_started_by_task:     false
git_push_performed:          false
productionReady:             false
execution:                   disabled
rawValuesReported:           false
```

---

## Checks

```
typecheck:web: PASS
ESLint (scoped): 0 warnings, 0 errors
Prettier: formatted
```

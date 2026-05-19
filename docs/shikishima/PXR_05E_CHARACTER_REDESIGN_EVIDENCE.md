# PXR-05E Character Redesign — Evidence

**date:** 2026-05-20
**worker:** ClaudeCode

---

## Purpose

Redesign the Pixel Room ghost characters from generic ghost icons to
recognizable Shikishima role-specific sprites with stronger visual identity.

Route: PixelGhostSprite.tsx → PixelRoomAgent.tsx integration

---

## New Files

| File | Role |
|---|---|
| `PixelGhostSprite.tsx` | 5 redesigned 64×80 viewBox character sprites |

Modified:
- `PixelRoomAgent.tsx`: import swapped from `GhostSvg` → `PixelGhostSprite`

---

## PixelGhostSprite

- Shared body path: `BODY_PATH` (64×80 viewBox, rounded ghost silhouette)
- 5 sprite functions, each with role-specific overlaid accessories:

| AgentId | Character | Accessories |
|---|---|---|
| shikishima | しきしま | headset arc+mic, blue command flag, collar bar |
| shizume | しずめ | yellow hardhat, HOLD sign, safety vest stripes |
| hajime | むすび | route map SVG, thought bubble, pencil stub |
| tsumugi | つむぐ | orange hardhat, wrench, toolbox, keyboard dots |
| shirube | しるべ | headphones, open book, pen stroke |

- `PixelGhostSprite({ agentId, size? = 64 })` — drop-in replacement for GhostSvg
- All SVG, no image assets, display-only

## PixelRoomAgent integration

- `import { PixelGhostSprite } from "./PixelGhostSprite"` replaces `GhostSvg`
- Render: `<PixelGhostSprite agentId={agentId} size={size} />`
- All drop-shadow / glow / animation wrapper preserved unchanged

---

## Naming Note

AgentId uses `"hajime"` for むすび and `"tsumugi"` for つむぐ (historical naming).
Do NOT rename these IDs — the type system and all consuming components depend on them.

---

## Safety Confirmation

```yaml
character_sprites_redesigned:    true
role_accessories_distinct:       true
image_assets_added:              false
package_added:                   false
runtime_started_by_task:         false
git_push_performed:              false
productionReady:                 false
execution:                       disabled
```

---

## Checks

```
typecheck:web: PASS
```

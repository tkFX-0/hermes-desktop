# AT-13 Final Visual Polish / Responsive Pass Plan

## Purpose

AT-13 cleans up visual consistency after AT-07, AT-08, AT-09, AT-10, AT-11,
and AT-12. It is UI-only and should not add behavior.

## Targets

- spacing
- card density
- mobile wrapping
- role colors
- typography
- Japanese labels
- visual hierarchy
- reduced-motion consistency
- no horizontal overflow

## Worker Assignment

- Implementation: ClaudeCode
- Push readiness: Codex
- Visual approval: Human

## Safety Boundary

- UI-only
- no new behavior
- no runtime start
- no git push without human GO
- no OAuth without human GO
- no x_search without read-only GO
- no Obsidian write without local note GO
- no external API write
- no productionReady true
- no execution enabled
- no raw value output
- no secrets or tokens
- no image asset import unless AT-05 later approves it

Plain-language rule:

AIは作るところまで。
鍵と発射ボタンは人間。

## Asset Boundary

No image assets should be added in AT-13 unless AT-05 separately approves the
asset plan and the human gives a separate implementation GO.

## Acceptance Criteria

- Agent Theater remains display-only.
- Layout is readable on desktop and mobile.
- Reduced-motion fallback remains intact.
- No horizontal overflow is introduced.
- No image assets are added by default.


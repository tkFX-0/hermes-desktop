# AT-05 Sprite Asset Plan

## Purpose

AT-05 decides whether Agent Theater should continue using CSS/inline SVG
ghosts or introduce sprite/image assets later.

Current position:

- continue using CSS/inline SVG by default
- no sprite asset integration in this task
- image assets remain optional and gated

## Policy Questions

Before adding any sprite asset, answer:

- Is the asset original enough for project use?
- Is the license/copyright boundary clear?
- Is the file size appropriate?
- Is the asset necessary, or can CSS/inline SVG carry the design?
- Is there a fallback to inline SVG?
- Is responsive scaling defined?
- Is the folder and naming policy defined?

## Proposed Asset Folder Policy

If later approved, assets should use a scoped folder such as:

```text
src/renderer/src/assets/agent-theater/
```

No asset folder is created by this design task.

## File Naming

Possible future pattern:

```text
agent-theater-ghost-shikishima-idle.png
agent-theater-ghost-shizume-hold.png
agent-theater-ghost-shirube-record.png
```

Names must not contain raw local paths, tokens, or source prompts.

## Safety Boundary

- no image assets in this task
- no generated PNG import
- no sprite integration
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

Plain-language rule:

AIは作るところまで。
鍵と発射ボタンは人間。

## Worker Assignment

- Docs-only plan: Codex
- Later implementation: ClaudeCode only after asset GO
- Asset approval: Human

## Acceptance Criteria

- Asset work remains gated.
- Existing CSS/inline SVG ghosts remain valid.
- No image file is committed without separate GO.


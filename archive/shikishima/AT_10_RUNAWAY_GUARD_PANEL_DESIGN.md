# AT-10 Runaway Guard / Human-Gated Action Panel Design

## Purpose

AT-10 makes Level 5 boundaries visible inside Agent Theater. It shows what AI
workers must not do automatically and which actions require explicit human GO.

## UI Target

Human-Gated Action Panel.

## Display Items

The panel should show:

- runtime: human GO
- push: human GO
- OAuth: human GO
- x_search: read-only GO
- Obsidian: local note GO
- external write: blocked
- productionReady: false
- execution: disabled
- API auto-use: disabled

## Suggested States

| Action | Default state | Human gate |
|---|---|---|
| Runtime start | HOLD | RUNTIME-GO |
| Git push | NEEDS_HUMAN | PUSH-GO |
| OAuth | HOLD | OAUTH-GO |
| x_search | HOLD | XS-READ |
| Obsidian local note write | HOLD | OBS-LOCAL |
| External write | BLOCKED | EXTERNAL-WRITE |
| productionReady true | HOLD | PRODUCTION-READY |
| execution enabled | HOLD | EXECUTION-ENABLE |
| API auto-use | disabled | RUNAWAY-GUARD |

## Worker Assignment

- Implementation: ClaudeCode
- Push readiness and safety review: Codex
- Final GO decisions: Human

## Safety Boundary

- display-only by default
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

## Forbidden UI

Do not add active controls for:

- start runtime
- push
- login with OAuth
- run x_search
- write to Obsidian
- send external API request
- enable productionReady
- enable execution

If controls are visually represented, they must be disabled or copy-only.

## Acceptance Criteria

- Level 5 boundary is visible.
- External actions are shown as human-gated.
- No Level 5 action can be executed from the UI.
- productionReady remains false.
- execution remains disabled.
- rawValuesReported remains false.


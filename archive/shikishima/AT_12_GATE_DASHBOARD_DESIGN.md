# AT-12 Gate Dashboard / Future Gate Panel Design

## Purpose

AT-12 shows the state of future capability gates inside Agent Theater. It
should help the human understand what is READY, HOLD, NEEDS_HUMAN, FUTURE,
BLOCKED, PASS, or STOP without enabling any gate.

## UI Target

Gate Dashboard / Future Gate Panel.

## Gate Examples

- RUNTIME-GO
- OAUTH-GO
- XS-READ
- OBS-LOCAL
- EXTERNAL-WRITE
- PUSH-GO
- PRODUCTION-READY
- EXECUTION-ENABLE
- STACKCHAN-PHYSICAL
- VOICE-CAMERA-MIC

## Display Statuses

| Status | Meaning |
|---|---|
| READY | prerequisites appear satisfied, but human GO may still be required |
| HOLD | intentionally paused |
| NEEDS_HUMAN | explicit human decision required |
| FUTURE | planned but not active |
| BLOCKED | cannot proceed under current boundary |
| PASS | evidence accepted or completed |
| STOP | unsafe or failed condition |

## Safety Boundary

- display-only by default
- no gate execution
- no enable toggle
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

## Worker Assignment

- Implementation: ClaudeCode
- Gate wording review: GPT or Codex
- Push readiness: Codex
- Approval: Human

## Acceptance Criteria

- Future gates are visible and readable.
- Level 5 gates are not represented as auto-approved.
- No gate can be toggled from the UI.
- No runtime or external action is started.


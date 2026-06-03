# AT-11 Worker Routing / Handoff Prompt Panel Design

## Purpose

AT-11 shows which worker should receive which type of task. It helps the human
route work without allowing the app to dispatch tasks automatically.

## UI Target

Worker Routing Panel / Handoff Prompt Panel.

## Routing Examples

| Task type | Recommended worker | Notes |
|---|---|---|
| UI / React / TypeScript implementation | ClaudeCode | scoped source implementation |
| lint fix / push readiness / small scoped patch | Codex | verification and minimal changes |
| design / GO wording / policy整理 | GPT | instruction and decision shaping |
| IDE support / optional implementation | Cursor / Composer | optional later worker |
| push / runtime / OAuth / external action | Human Gate | Level 5 human GO only |

## Future Optional Feature

Copy-only prompt output for ClaudeCode/Codex instructions.

Copy-only means:

- the prompt is displayed for the human
- the human chooses where to paste it
- no API call is made
- no worker is auto-started
- no external write occurs

## Safety Boundary

- display-only by default
- copy-only / no auto-dispatch
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

## Forbidden Behavior

- automatic worker launch
- browser automation
- remote API dispatch
- hidden prompt sending
- command execution
- runtime launch
- OAuth initiation

## Acceptance Criteria

- Worker routing is understandable at a glance.
- Human Gate owns all Level 5 actions.
- Any prompt output is copy-only.
- No source of external side effects is introduced.


# AT Remaining Implementation Design Package

## Purpose

This package consolidates the remaining Agent Theater implementation items
after AT-09. It is a design and backlog record only.

Current baseline:

- origin/main: 669b0f8
- AT-07 Control Room Layout: pushed
- AT-08 Worker Status Panel: pushed
- AT-09 Resume Queue / Cooldown Panel: pushed
- runtime visual recheck: HOLD
- productionReady: false
- execution: disabled
- rawValuesReported: false

## Safety Boundary

All remaining Agent Theater work is display-only by default.

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

## Consolidated Priority Order

1. AT-10 Runaway Guard / Human-Gated Action Panel
2. AT-11 Worker Routing / Handoff Prompt Panel
3. AT-12 Gate Dashboard / Future Gate Panel
4. AT-13 Final Visual Polish / Responsive Pass
5. AT-14 Runtime Visual Recheck Package
6. AT-05 Sprite Asset Plan / optional later asset gate

Notes:

- AT-05 may move earlier only if image or sprite work becomes necessary.
- Runtime visual recheck can wait until a human time window is available.
- Cursor integration remains optional and later.
- Level 5 actions remain human-gated.

## Remaining Item Summary

| ID | Item | Priority | Worker | Status |
|---|---|---|---|---|
| AT-10 | Runaway Guard / Human-Gated Action Panel | High | ClaudeCode implementation, Codex review | design-ready |
| AT-11 | Worker Routing / Handoff Prompt Panel | High | ClaudeCode implementation, Codex review | design-ready |
| AT-12 | Gate Dashboard / Future Gate Panel | High-Medium | ClaudeCode implementation, Codex review | design-ready |
| AT-13 | Final Visual Polish / Responsive Pass | Medium | ClaudeCode | design-ready |
| AT-14 | Runtime Visual Recheck Package | Required later | Codex docs, human runtime GO | design-ready |
| AT-05 | Sprite Asset Plan | Medium-Low | Codex docs, later ClaudeCode only with GO | design-ready |

## Worker Assignment

| Worker | Best fit |
|---|---|
| GPT | design, GO wording, policy review |
| ClaudeCode | UI implementation, React, TypeScript, visual polish |
| Codex | push readiness, scoped lint fix, docs package, safety review |
| Cursor / Composer | optional IDE worker later |
| Human Gate | push, runtime, OAuth, x_search, Obsidian write, external action |

## Completion Rule

This package does not implement the remaining panels. It prepares the next
implementation sequence so each item can be assigned safely with explicit scope.


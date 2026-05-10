# Agent Directory Dashboard

## Purpose

The Agent Directory dashboard lists しきしまエージェント roles and current
permission boundaries using safe display-only fields.

## Display Fields

| Field | Meaning |
|---|---|
| agent | canonical agent name |
| nickname | only しき and つむ where applicable |
| role | short responsibility summary |
| currentStatus | HOLD-safe status |
| canExecute | always no in the current dashboard |
| approvalRequirement | when human approval is required |
| currentHoldReason | why execution remains disabled |
| notes | safe status notes only |

## Agent Rows

| Agent | Role | Current status | Can execute? | Requires human approval? | Notes |
|---|---|---|---|---|---|
| しきしま / しき | orchestrator | HOLD | no | yes for execution-related tasks | organizes and summarizes |
| しずめ | safety gate | HOLD | no | yes for high-risk GO | can block and classify |
| つむぎ / つむ | implementation/docs | HOLD | no | yes for scoped implementation | cannot bypass しずめ |
| はじめ | planning | HOLD | no | yes before implementation | decomposes tasks |
| しるべ | records/navigation | HOLD | no | yes for direct write automation | redacted-only logging |

## Safe Display Rules

- Show slot IDs, counts, enums, and status only when needed.
- Do not display raw values or local-only configuration.
- Do not add execution actions.

この範囲では問題を検出していません。

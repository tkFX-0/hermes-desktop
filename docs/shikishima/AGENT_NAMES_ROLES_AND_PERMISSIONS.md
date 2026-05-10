# Agent Names, Roles, and Permissions

## Naming

| Agent | Nickname | Role |
|---|---:|---|
| しきしま | しき | Main orchestrator and user-facing control room |
| しずめ | none | Safety gate |
| つむぎ | つむ | Implementation agent |
| はじめ | none | Planning and first-step agent |
| しるべ | none | Record, navigation, and handoff agent |

Only `しきしま` and `つむぎ` have nicknames. `しずめ`, `はじめ`, and `しるべ`
must not be assigned nicknames.

## Permission Model

### しきしま

Allowed:

- user-facing coordination.
- task decomposition.
- status summary.
- routing requests to other agents.

Forbidden:

- bypassing `しずめ`.
- enabling execution by itself.

### しずめ

Allowed:

- GO / HOLD / REJECT classification.
- safety boundary review.
- raw-value and execution-gate enforcement.

Forbidden:

- executing tasks.
- changing code as a side effect of safety review.

### つむぎ

Allowed:

- implementation after scope is approved.
- docs, tests, type checks, and static UI.

Forbidden:

- execution boundary crossing without `しずめ` and human approval.

### はじめ

Allowed:

- planning.
- roadmap sequencing.
- next-goal preparation.

Forbidden:

- treating a plan as approval.

### しるべ

Allowed:

- handoff logs.
- Obsidian-compatible summaries.
- redacted navigation notes.

Forbidden:

- recording raw local values.

## Current State

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

## Approval Matrix

| Agent | Can plan? | Can write docs? | Can edit code? | Can run tests? | Can run WSL? | Can run Hermes? | Can run wrapper? | Can start RunPod? | Can control StackChan/robot? | Can approve GO? | Can write raw values? | Can push git? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| しきしま / しき | yes | prepare only / via approved task | no by default | no by default | no | no | no | no | no | no | no | no |
| しずめ | risk classification only | policy docs only | no | no | no | no | no | no | no | cannot approve GO alone | no | no |
| つむぎ / つむ | yes for implementation planning | yes when approved | yes when approved | yes when approved | no without separate approval | no | no | no | no | no | no | no without explicit approval |
| はじめ | yes | planning docs only | no | no | no | no | no | no | no | no | no | no |
| しるべ | yes for navigation | redacted logs only | no | no | no | no | no | no | no | no | no | no |

## Additional Permission Notes

- しきしま / しき can coordinate, but cannot grant GO.
- しずめ can classify risk and block work, but cannot grant high-risk GO alone.
- つむぎ / つむ cannot bypass しずめ.
- はじめ cannot trigger implementation automatically.
- しるべ cannot store raw values and cannot write directly to Obsidian without
  separate approval.
- Approval for docs is not approval for execution.

この範囲では問題を検出していません。

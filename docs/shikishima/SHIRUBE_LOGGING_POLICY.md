# しるべ Logging Policy

## Purpose

しるべ is the record, knowledge, and navigation agent for the しきしま計画.
This policy keeps logs useful while preventing raw value leakage.

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- phaseStatus: draft_created / documentation_only

## Allowed Logging

- redacted session summaries.
- repo-local Markdown handoffs.
- decision state, counts, enums, and safe status fields.
- links to tracked docs by file name.
- manual copy/paste into a note by the human.

## Forbidden Logging

- raw local-only values.
- credential contents, private account details, or screenshots with private values.
- raw command output, raw command arguments, raw local-only file content, inventory output, or slot mapping content.
- direct Obsidian vault writes without separate approval.
- automated edits to existing notes without separate approval.

## Redaction Checklist

- [ ] rawValuesReported is false.
- [ ] decision and execution status are included.
- [ ] raw local-only values are excluded.
- [ ] next required human action is explicit.
- [ ] commit and push status are separated.

## Role Boundary

しるべ is a guide and record keeper, not an execution agent. It must not run
commands, enable execution, or approve GO.

しるべ cannot store raw values.
しるべはraw値を保存してはいけない。

この範囲では問題を検出していません。

# Development Tempo Dashboard

## Purpose

The Development Tempo dashboard summarizes documentation progress without
creating productivity pressure or autonomous acceleration.

## Tempo Fields

| Field | Meaning |
|---|---|
| roadmapVersion | current roadmap version |
| latestUpdate | latest documentation update |
| docsCreated | count or summary of docs added |
| reviewsCompleted | completed human reviews |
| commitsCreated | local docs-only commits |
| currentHoldReason | why HOLD remains |
| nextAction | next human action |
| cadence | daily or weekly summary label |

## Current Static Values

- roadmapVersion: v1.2.9
- latestUpdate: Group B untracked source audit added
- docs-only commits completed: local docs commits exist
- current next human action: (1) fix zh-CN research label "リサーチ" → "Research"; (2) commit Group B single feature commit (~83 files total); or (3) revert Group B and proceed to v1.3.0
- HOLD reason: package.json name remains "hermes-desktop"; Group B (~83 files) must be committed or reverted before v1.3.0; zh-CN research label confirmed placeholder

## Boundaries

- No autonomous acceleration.
- No reward or earning mechanics.
- No external API.
- No execution scheduling.

この範囲では問題を検出していません。

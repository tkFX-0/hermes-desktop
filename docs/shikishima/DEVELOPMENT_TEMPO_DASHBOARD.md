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

- roadmapVersion: v1.2.10
- latestUpdate: Group B pre-feature cleanup added
- docs-only commits completed: local docs commits exist
- current next human action: approve v1.2.11 Group B Feature Commit (7 tracked + ~76 untracked source files); tests/ichikishima/ commits separately after v1.2.11
- HOLD reason: package.json name remains "hermes-desktop"; Group B (~83 files) must be committed or reverted before v1.3.0 package name migration

## Boundaries

- No autonomous acceleration.
- No reward or earning mechanics.
- No external API.
- No execution scheduling.

この範囲では問題を検出していません。

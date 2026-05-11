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

- roadmapVersion: v1.2.7
- latestUpdate: Src dirty files classification added
- docs-only commits completed: local docs commits exist
- current next human action: (A) commit Group A safety files; (B) decide Group B feature commit scope (audit untracked source first or commit all together)
- HOLD reason: package.json name remains "hermes-desktop"; Group A (3 files) and Group B (7 files + untracked ichikishima/Research) must be resolved before v1.3.0; installer.ts BOM caveat noted

## Boundaries

- No autonomous acceleration.
- No reward or earning mechanics.
- No external API.
- No execution scheduling.

この範囲では問題を検出していません。

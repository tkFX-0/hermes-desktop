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

- roadmapVersion: v1.2.6
- latestUpdate: Package-lock dirty state classification added
- docs-only commits completed: local docs commits exist
- current next human action: resolve src/ and .gitignore dirty files (commit as feature work or revert), then approve v1.3.0 GO
- HOLD reason: package.json name remains "hermes-desktop"; src/ dirty files (10 files) and .gitignore are v1.3.0 blockers; package-lock version stamp drift is NOT a blocker (auto-resolves in v1.3.0)

## Boundaries

- No autonomous acceleration.
- No reward or earning mechanics.
- No external API.
- No execution scheduling.

この範囲では問題を検出していません。

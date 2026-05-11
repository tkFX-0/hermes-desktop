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

- roadmapVersion: v1.2.5
- latestUpdate: Package name migration plan added
- docs-only commits completed: local docs commits exist
- current next human action: review PACKAGE_NAME_MIGRATION_PLAN.md and approve v1.3.0 execution GO
- HOLD reason: package.json name remains "hermes-desktop"; plan created (v1.2.5), execution requires separate GO (v1.3.0); pre-migration caveat: package-lock.json unrelated dirty state must be resolved before execution

## Boundaries

- No autonomous acceleration.
- No reward or earning mechanics.
- No external API.
- No execution scheduling.

この範囲では問題を検出していません。

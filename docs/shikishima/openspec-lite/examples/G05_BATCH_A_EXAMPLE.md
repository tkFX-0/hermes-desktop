# G-05 Batch A OpenSpec-Lite Example

This example shows how to use OpenSpec-Lite for a narrow ESLint task without drifting into unrelated changes.

## Purpose

Fix only the low-risk Batch A ESLint issues in three files, then commit only those files if scoped verification passes.

## Current State

- Batch A applied but not verified
- G-05: HOLD
- G-06: HOLD
- G-07: HOLD
- git push: not approved
- `--fix`: not approved

## Files Allowed To Touch

- `src/main/session-cache.ts`
- `tests/installer-utils.test.ts`
- `tests/sse-parser.test.ts`

## Files Not Allowed To Touch

- docs
- package metadata
- lockfiles
- React files
- renderer files
- unrelated source files
- unrelated tests

## Forbidden Actions

- git push
- broad lint fix
- `--fix`
- vitest
- build
- typecheck
- package install
- package update
- WSL
- Hermes
- wrapper or dummy execution
- RunPod
- StackChan or robot
- voice, camera, or mic

## GO Conditions

- scoped ESLint exit code is 0
- staged files are exactly the three Batch A files
- commit target is exactly the three Batch A files
- no raw values, secrets, or local-only values are output

## HOLD Conditions

- scoped ESLint exit code is not 0
- ESLint command cannot produce a reliable exit code
- an out-of-scope file would need changes
- an out-of-scope file becomes staged
- package, docs, React, or unrelated files would be touched
- judgment is unclear

## REJECT Conditions

- raw values or secrets would be exposed
- execution boundary would be crossed
- git push would be performed without approval
- package install would be required

## Commit Policy

Commit is allowed only when the three-file scoped ESLint check passes and staged files are limited to:

- `src/main/session-cache.ts`
- `tests/installer-utils.test.ts`
- `tests/sse-parser.test.ts`

Suggested commit subject:

`chore: fix batch A eslint issues`

## Final Report Checklist

- overall status
- scoped diff file list
- unrelated dirty file count only
- ESLint command used
- ESLint exit code
- commit hash if committed
- committed file list
- git push status
- remaining HOLD status

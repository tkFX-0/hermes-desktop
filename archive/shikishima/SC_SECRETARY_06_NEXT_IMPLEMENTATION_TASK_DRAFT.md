# SC-SECRETARY-06 Next Implementation Task Draft

date: 2026-05-25
status: READY_FOR_GO
recommended_next_task: SC-SECRETARY-01 Persona / Phrase Policy

## Purpose

Prepare the exact next implementation task, but do not implement it yet.

## Recommended Worker

ClaudeCode or Codex can implement this safely because it is local source + tests only.

StackChan firmware is not required for the first task.

## Task Draft

```text
# Task — SC-SECRETARY-01 Persona / Phrase Policy Implementation

Purpose:
  Implement the first AI secretary foundation:
  stable persona, forbidden phrase filtering, short voice response policy,
  and agent identity mapping.

Do not:
  - use camera
  - use microphone
  - start continuous dialogue loop
  - write externally
  - call Discord/X/Obsidian write
  - set productionReady true
  - enable execution
  - push

Allowed:
  - local source files
  - local tests
  - docs/evidence

Suggested files:
  scripts/shikishima-secretary-profile.mjs
  scripts/shikishima-secretary-filter.mjs
  tests/shikishima-secretary-profile.test.mjs
  docs/shikishima/SC_SECRETARY_01_PERSONA_POLICY_IMPLEMENTATION_EVIDENCE.md

Requirements:
  - define secretary persona
  - define agent voice profiles
  - define forbidden phrase entries
  - filter generated text before StackChan voice output
  - keep StackChan voice short by default
  - preserve safety HOLD wording
  - no raw secrets/tokens

Acceptance:
  - forbidden hard phrase is removed or replaced
  - soft phrase can be rephrased
  - agent identity remains stable
  - HOLD overrides persona
  - output is suitable for voice
  - tests pass

Checks:
  - npm test if existing safe test command exists
  - node syntax check for new modules
  - git diff --name-only
  - git status --short

Commit:
  git commit -m "feat: add stackchan secretary persona policy"

Do not push.
```

## Why This Task First

This fixes the most important foundation:

- profile stability
- "do not say this" compliance
- short voice output
- agent identity consistency

It does not require camera, microphone, firmware flash, or external APIs.

## After This Task

Next candidates:

1. `SC-SECRETARY-02 Voice Router`
2. `SC-DIALOGUE-ONE-SHOT`
3. `SC-CAM-STILL-ONE-SHOT`
4. `SC-ROUTINE-CHECKIN`

## Current Decision

Implementation not started.  
Ready for explicit GO.

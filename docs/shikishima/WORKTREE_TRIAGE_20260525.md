# Worktree Triage 2026-05-25

## Purpose

Record the current Shikishima / StackChan worktree state before scoped cleanup,
debugging, and commit separation.

StackChan implementation ownership is now Codex-side. ClaudeCode-originated
StackChan changes must be reviewed by Codex before acceptance.

## Baseline

```text
branch: main
local_HEAD: d2aec3c768237bee2319f2a2b42072e7b5a507f9
origin_main: 1423949da9aa2450ab8f29da61cc9bee8effc095
commits_ahead: 28
staged: 0
tracked_dirty: present
git_push_performed: false
```

## Verification

```text
npm run typecheck:node: PASS
npm run typecheck:web: PASS
npm test -- shikishima-secretary shikishima-core-gates: PASS
test_files: 5 passed
tests: 31 passed
python -m platformio run -e cores3_noflash: PASS in ASCII temp project
node --check scripts/shikishima-secretary-filter.mjs: PASS
node --check scripts/shikishima-secretary-state.mjs: PASS
node --check scripts/shikishima-secretary-one-shot.mjs: PASS
npm test -- shikishima-secretary-filter-script shikishima-secretary-one-shot-script shikishima-secretary-runtime-full: PASS
npm test: PASS
test_files_full: 98 passed / 1 skipped
tests_full: 854 passed / 1 skipped
```

Firmware compile note:

```text
The in-repo PlatformIO build under the Japanese path failed at linker map output.
The same project copied to an ASCII-only temporary directory compiled successfully.
Conclusion: firmware source compiles; the local path/toolchain combination is the blocker.
No flash/upload/erase was performed.
The temporary build directory was removed after verification.
```

## Current Dirty Groups

### StackChan Firmware / Motion

```text
docs/firmware/shikishima_cores3/platformio.ini
docs/firmware/shikishima_cores3/src/shikishima_cores3.ino
docs/firmware/shikishima_backup_20260524.bin
```

Observed scope:

```text
SCS servo comments and setup
StackChan BSP RGB LED driver path
operation motion presets
pat sensitivity / over-pat threshold
top touch sensor handling
cat-like nuzzle pat motion
green LED for happy pat
red LED for over-pat / ganbaru reaction
```

Review note:

```text
firmware source can be reviewed and committed separately
backup binary should not be staged without explicit asset/backup policy
physical confirmation remains human visual check
```

### StackChan Speech / Local Bridge

```text
scripts/shikishima-stackchan.mjs
scripts/shikishima-secretary-filter.mjs
scripts/shikishima-secretary-one-shot.mjs
scripts/shikishima-secretary-state.mjs
```

Observed scope:

```text
secretary speech filter before StackChan voice output
safe text is used for TTS/subtitle/emotion analysis
emotion-to-motion mapping adjusted toward operation motions
one-shot secretary script support
secretary pause/stop state support
```

Review note:

```text
safe to review as StackChan speech safety package
must confirm no raw token/IP output
must confirm no uncontrolled speech loop
```

Bug fixed during triage:

```text
file: scripts/shikishima-secretary-filter.mjs
issue: safe fallback / replacement speech strings were mojibake
impact: StackChan could speak corrupted text when replacing unsafe phrases or raw error-like text
fix: restored readable Japanese fallback and replacement strings
verification: node --check PASS, related secretary script tests PASS
```

Additional bug fixed during triage:

```text
file: scripts/shikishima-secretary-state.mjs
issue: secretary state path contained mojibake local path text
impact: pause/stop/resume state could be written to the wrong location
fix: use SHIKISHIMA_SECRETARY_STATE_PATH when provided, otherwise project-local .shikishima-memory/secretary-state.json
verification: node --check PASS, related secretary script tests PASS
```

### Secretary Core Phase 1-6

```text
src/main/shikishima-core/secretary-*.ts
src/main/shikishima-core/index.ts
src/main/shikishima-core/action-gate-kernel.ts
src/main/shikishima-core/preflight-factory.ts
src/main/shikishima-core/profile-policy.ts
src/main/shikishima-core/response-policy.ts
tests/shikishima-core-gates.test.ts
tests/shikishima-secretary-*.test.ts
```

Observed scope:

```text
Secretary Runtime Coordinator
Pause / Stop Contract
Dialogue and voice policy
Camera still-image intake
Sensor session runtime
Routine scheduler / check-in model
External write guard
Status snapshot
Lv5 activation draft gate
profile forbidden phrase replacement
response phrase policy enforcement
```

Review note:

```text
typecheck and targeted tests pass
integration into bot/UI remains separate review
productionReady global remains false
execution global remains disabled
```

### Discord Bot / Chihaya / Automation-Like Changes

```text
scripts/shikishima-bot.mjs
scripts/shikishima-chihaya.mjs
```

Observed scope:

```text
agent persona hot reload
chihaya agent addition
secretary event bridge to StackChan face/LED/speech
natural language StackChan command detection
morning audit command/scheduler
FX section removed from morning plan report
kill zone alert changed from minute key to daily key
```

Risk note:

```text
contains auto-sending / auto-audit behavior
must be reviewed separately before push
must confirm no external write loop, no repeated Discord send, and no token output
```

### Docs / Evidence

```text
docs/shikishima/SC_MOTION_*.md
docs/shikishima/SC_SECRETARY_*.md
docs/logs/2026-5-25-session.md
```

Review note:

```text
docs are useful but should be staged separately from source
session logs must be checked for raw token/local-only values before staging
```

## Ahead Commit Risk

The branch is currently 28 commits ahead of origin/main. The ahead history
contains large source and docs additions, runtime/session-like files, images,
and broad Shikishima/StackChan integration work.

```text
push_readiness: false
reason: 28 commits ahead plus dirty worktree; scope is too broad for safe push
```

## Recommended Cleanup Order

1. StackChan firmware / motion package review
2. StackChan speech filter / one-shot script review
3. Secretary core Phase 1-6 package review
4. Discord bot / Chihaya automation review
5. Docs / evidence package review
6. Ahead commit history review before any push

## Current Capability Summary

```text
StackChan can receive safer one-shot speech text through the secretary filter.
Secretary runtime can draft bounded dialogue, event, routine, camera, sensor, and external write actions.
Pause/stop contracts can block unsafe secretary actions.
Camera/mic continuous operation is not started by this package.
External write requires guarded adapter and explicit approval context.
ProductionReady is not globally enabled.
Execution is not globally enabled.
```

## Next Required Human Checks

```text
StackChan physical motion smoothness: visual check when requested
pat / over-pat behavior: visual check when requested
LED color behavior: visual check when requested
Discord bot auto-send behavior: review before enabling/push
```

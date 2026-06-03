# SC-SECRETARY-07 Roadmap Implementation Evidence

date: 2026-05-25
result: PASS_CANDIDATE
scope: Shikishima / StackChan AI secretary foundation

## Purpose

Implement the safe pre-execution foundation from the AI secretary roadmap.

The implementation goal was not to open continuous camera, microphone, external API, or autonomous execution.
The goal was to finish the local policy layer that makes later secretary behavior stable and reviewable.

## Implemented

### SC-SECRETARY-01 Persona / Phrase Policy

Implemented in:

- `src/main/shikishima-core/profile-policy.ts`
- `src/main/shikishima-core/response-policy.ts`
- `scripts/shikishima-secretary-filter.mjs`
- `scripts/shikishima-stackchan.mjs`

Result:

- stable profile policy remains available
- forbidden phrase rules now support `soft` / `hard`
- forbidden phrase rules support replacement text
- generated StackChan speech can be filtered before voice output
- direct `stackchanSay()` and `stackchanSayAsAgent()` calls now pass through the secretary speech filter
- local persisted corrections can be stored under `.shikishima-memory/secretary-profile-policy.json`
- legacy forbidden phrase entries still work
- phrase filtering is tested

### SC-SECRETARY-02 Voice Router

Implemented in:

- `src/main/shikishima-core/secretary-voice-router.ts`

Result:

- secretary events map to StackChan face / motion / LED drafts
- `task_done` maps to happy / `task_done` / green
- `hold` maps to thinking / `safety_hold` / yellow
- `stop` maps to panic / `panic_stop` / red
- every route is display-only
- every StackChan voice route requires human GO through preflight

### SC-DIALOGUE-ONE-SHOT Draft

Implemented in:

- `src/main/shikishima-core/secretary-dialogue-policy.ts`

Result:

- one prompt -> one answer draft
- optional voice draft
- continuous loop is explicitly false
- microphone always-on is explicitly false
- camera monitoring is explicitly false
- external write is explicitly false
- productionReady remains false
- execution remains disabled

### SC-ROUTINE-CHECKIN Draft

Implemented in:

- `src/main/shikishima-core/secretary-routine-checkin.ts`

Result:

- routine reminders can be drafted
- minimum interval is clamped to at least 15 minutes
- max runs per day is clamped to at most 8
- retry loop is false
- nagging escalation is false
- voice still requires human GO

### SC-SECRETARY-EVENT-BRIDGE Draft

Implemented in:

- `src/main/shikishima-core/secretary-event-bridge.ts`

Result:

- project events can be converted to StackChan voice drafts
- FX summaries route to `chihaya`
- HOLD / STOP route to `shizume`
- evidence events route to `shirube`
- no device action is executed by the bridge
- no external write is performed

### Exports and Tests

Updated:

- `src/main/shikishima-core/index.ts`
- `tests/shikishima-secretary-roadmap.test.ts`
- `tests/shikishima-secretary-filter-script.test.ts`

## Checks

```text
npm run typecheck:node
```

Result:

```text
PASS
```

```text
npm run typecheck:web
```

Result:

```text
PASS
```

```text
npm test -- shikishima-secretary-roadmap shikishima-core-policy
```

Result:

```text
PASS
2 files passed
13 tests passed
```

```text
npm test -- shikishima-secretary-roadmap shikishima-secretary-filter-script shikishima-core-policy
```

Result:

```text
PASS
3 files passed
15 tests passed
```

```text
node --check scripts/shikishima-secretary-filter.mjs
node --check scripts/shikishima-stackchan.mjs
```

Result:

```text
PASS
```

## Remaining HOLD Areas

The following are not opened by this implementation:

- continuous camera monitoring
- microphone always-on
- voice chat loop
- external API write
- Discord send
- X / Grok connection
- Obsidian write
- StackChan voice execution without GO
- StackChan motion execution without GO
- productionReady true
- execution enabled

## Safety

- source_changed: true
- docs_changed: true
- package_changed: false
- lockfile_changed: false
- runtime_started: false
- npm_run_dev: false
- camera_monitoring_started: false
- microphone_used: false
- voice_loop_started: false
- external_api_write: false
- productionReady: false
- execution: disabled
- rawValuesReported: false
- git_push_performed: false

## Result Candidate

```text
SC-SECRETARY roadmap local foundation:
  persona_policy: PASS_CANDIDATE
  phrase_filter: PASS_CANDIDATE
  direct_stackchan_speech_filter: PASS_CANDIDATE
  voice_router: PASS_CANDIDATE
  one_shot_dialogue_draft: PASS_CANDIDATE
  routine_checkin_draft: PASS_CANDIDATE
  event_bridge_draft: PASS_CANDIDATE
  tests: PASS
  typecheck_node: PASS
  typecheck_web: PASS
```

## Next Required Human Decision

Choose one next Level 5 gate if desired:

- `SC-AI-01` one-shot StackChan speech
- `SC-CAM-01` one still image comment
- `SC-SECRETARY-VOICE-GO` one approved spoken response

Do not approve productionReady true or execution enabled yet.

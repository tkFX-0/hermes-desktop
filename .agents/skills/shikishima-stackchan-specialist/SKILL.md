---
name: shikishima-stackchan-specialist
description: StackChan/CoreS3 firmware, VOICEVOX/PCM WebSocket bridge, face/display/motion/touch safety, and GitHub-reference-driven implementation review for Shikishima. Use for StackChan firmware, motion, voice, Discord read-aloud, face assets, CoreS3, SCS0009, M5Stack Avatar, VOICEVOX, or robot safety tasks.
---

# Shikishima StackChan Specialist

Use this skill when the task is about StackChan, Stack-chan, CoreS3, StackChan firmware, face/display routes, VOICEVOX speech, PCM streaming, Discord read-aloud, touch/pat sensors, LEDs, servos, or robot safety.

This skill is an intake layer for GitHub StackChan knowledge. It does not approve device operation by itself.

## Hard Safety Boundary

- Do not read, print, summarize, or copy secrets from `credentials.h`, `.env*`, local config, token files, Wi-Fi settings, Discord tokens, API keys, or private IP inventories.
- Do not upload firmware unless a separate StackChan Firmware GO is explicitly issued.
- Do not connect to StackChan, send voice/audio, move servos, start STT, access camera, or start continuous monitoring unless a separate scoped StackChan GO is explicitly issued.
- Treat display, audio, motion, touch sensor, STT, camera, firmware upload, and OTA as separate routes.
- Default status:
  - display/device screen: guarded route
  - voice/audio: HOLD unless scoped voice GO
  - servo/motion: HOLD unless scoped motion GO
  - touch/pat sensor: HOLD unless scoped sensor GO
  - STT/microphone: HOLD unless scoped microphone GO
  - camera/monitoring: HOLD unless scoped camera GO
  - firmware upload/OTA: NOT_APPROVED unless scoped firmware GO
- Preserve `productionReady: false`, `execution: disabled`, and `rawValuesReported: false`.
- Do not run `git push`, dependency installs, dev runtime, Discord send, Obsidian write, or external API writes unless separately authorized.

## Local Source Map

Primary local files to inspect for Shikishima StackChan work:

- `scripts/shikishima-stackchan.mjs` — VOICEVOX/PCM/WebSocket bridge and speech queue.
- `scripts/lib/stackchan-discord-voice.mjs` — Discord read-aloud selection, chunking, and voice policy.
- `scripts/lib/stackchan-operator-notify.mjs` — operator/Codex/Cursor completion phrases.
- `scripts/shikishima-codex-response-complete.mjs` — Codex completion-to-StackChan notification path.
- `scripts/shikishima-cursor-response-complete.mjs` — Cursor completion notification path.
- `docs/firmware/shikishima_cores3/src/shikishima_cores3.ino` — local custom firmware source.
- `docs/firmware/shikishima_cores3/platformio.ini` — firmware build configuration.
- `docs/shikishima/STACKCHAN_*` and `docs/shikishima/*STACKCHAN*` — StackChan gate, evidence, voice, and route documents.

Sensitive or high-risk local files:

- `docs/firmware/shikishima_cores3/credentials.h` — do not open or report contents unless the user explicitly asks for secret rotation/removal, and still redact values.
- `docs/firmware/**` — firmware source is allowed only when the task explicitly scopes firmware review/editing; upload remains separate GO.

## GitHub Reference Set

Use these public references for design patterns, not as code to copy wholesale:

- [m5stack/StackChan](https://github.com/m5stack/StackChan): current official M5Stack open-source StackChan resources, including firmware/app/server areas and CoreS3 hardware context.
- [stack-chan/stack-chan](https://github.com/stack-chan/stack-chan): original Stack-chan project; useful for conceptual split of face, expression, speech, servos, firmware, case, and schematics.
- [stack-chan/m5stack-avatar](https://github.com/stack-chan/m5stack-avatar): avatar face rendering, expressions, lip sync, color palette, movement/zoom/rotation patterns.
- [robo8080/AI_StackChan2](https://github.com/robo8080/AI_StackChan2): Arduino/M5Unified AI StackChan example with VOICEVOX, STT choices, wake-word style references.
- [ronron-gh/AI_StackChan_Ex](https://github.com/ronron-gh/AI_StackChan_Ex): AI voice assistant expansion patterns, multi-application/mod switching, long-term voice-assistant direction.
- [rt-net/stack-chan](https://github.com/rt-net/stack-chan): RT variant and DYNAMIXEL-oriented hardware/servo reference.

When using a GitHub reference, cite the source in the final report or evidence doc, and clearly label any design extrapolation as an inference.

## Workflow: Firmware Review

1. Confirm the task scope: review only, build only, source edit, or firmware upload.
2. If upload is not explicitly approved, do not run upload commands.
3. Inspect only relevant firmware files; do not read credential material.
4. Check separation of display/audio/motion/touch/STT/camera.
5. Check servo safety first: neutral position, rate limiting, no unexpected boot motion, and no motion while voice transport is busy unless explicitly designed.
6. Prefer build/check commands over hardware operations.
7. Report changed files, tests/build checks, and whether firmware upload was not performed.

## Workflow: Voice and Speech Queue

1. Route all StackChan speech through `stackchanSay` or the prepared batch path in `scripts/shikishima-stackchan.mjs`.
2. Preserve the process-wide and cross-process speech queue.
3. Keep speech short and chunked; respect PCM length limits.
4. Avoid overlapping face/motion/LED commands during audio playback unless the queue guarantees ordering.
5. Check that `play_done`, socket close, timeout, and fallback paths cannot overlap with a second speech job.
6. Run focused tests when available:

```powershell
npm run test -- tests/hermes/zone/full-autonomy/stackchan-discord-voice.test.ts
npm run test -- tests/hermes/zone/full-autonomy/stackchan-operator-notify.test.ts
npm run test -- tests/hermes/zone/full-autonomy/stackchan-pcm-limits.test.ts
node --check scripts/shikishima-stackchan.mjs
```

## Workflow: Face, Motion, Touch, and Sensor Behavior

1. Treat face/display changes as `device_display`.
2. Treat servo movement as `device_motion`.
3. Treat pat/touch handling as a sensor session route.
4. Treat LED feedback as a visible device effect; coordinate it with speech and motion.
5. For "撫でられた" behavior, keep sensor thresholds conservative and require repeated/qualified contact before escalating to "頑張るぞ" or anger-like motion.
6. For "手に吸い付く" behavior, prefer bounded small-amplitude tracking or nuzzling motions with explicit stop and rate limits.
7. Never make a motion smoother by removing safety waits, servo caps, or busy guards.

## Workflow: GitHub Reference Intake

1. Browse or open the GitHub source requested by the user.
2. Extract concepts and constraints, not large code blocks.
3. Map the concept to Shikishima local files and gates.
4. Record a short evidence note when the reference changes implementation direction.
5. If the reference implies a device operation, keep it HOLD until a separate GO.

## Acceptance Checklist

- Relevant GitHub references were named.
- Local files touched are within the requested StackChan scope.
- Secrets and credentials were not read or reported.
- Firmware upload was not performed unless separately approved.
- Device connection, audio, motion, STT, and camera were not activated unless separately approved.
- Speech queue ordering remains intact.
- Tests or syntax checks were run when code changed.
- Final report says clearly what was added, what remains HOLD, and what source links informed the work.

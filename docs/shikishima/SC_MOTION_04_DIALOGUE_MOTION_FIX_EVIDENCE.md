# SC-MOTION-04 Dialogue Motion Fix Evidence

date: 2026-05-25
status: PASS_CANDIDATE
scope: StackChan firmware + StackChan motion routing

## Purpose

Fix the bug where operation motions did not run during dialogue / AI agent speech.

The previous firmware-level operation motion path rejected named motion presets while `isSpeaking` was true. That made official-like and AIagent-like motion names unreliable during dialogue even though the PC side could send motion events while speaking.

## Changes

### Firmware

- Added dialogue-safe motion presets:
  - `official_speak`
  - `aiagent_speak`
  - `speaking_nod`
  - `official_think`
  - `aiagent_think`
  - `head_tilt`
- Allowed safe named operation motions during `isSpeaking`.
- Kept camera mode, dance, pat animation, and active reactions protected from motion overlap.
- Top touch click during speech now triggers a small `aiagent_speak` motion instead of being ignored.
- Top touch swipe during speech triggers a small speaking nod instead of attempting the full pat reaction.
- Existing pat behavior is preserved when not speaking:
  - normal pat: `撫でられてうれしい`
  - repeated pat: `頑張るぞ`

### PC Routing

- Mapped `head_tilt` / `tilt` to `aiagent_think`.
- Added aliases:
  - `talk` -> `aiagent_speak`
  - `speak` -> `aiagent_speak`
  - `official` -> `official_speak`
  - `aiagent` -> `aiagent_speak`
- Adjusted emotion-to-motion routing toward the new operation presets:
  - happy -> `task_done`
  - agree -> `task_accept`
  - thinking -> `thinking_scan`

## Verification

### Build / Flash

- compile_only_build: PASS
- firmware_flash: PASS
- hash_verified: true

### Dialogue Motion Check

One-shot dialogue test:

- pre `aiagent_speak`: PASS
- `stackchanSayAsAgent("shikishima", ...)`: PASS
- post `task_done`: PASS
- device_connected_after: true
- voicevox_ready_after: true
- led_off_restored: true

## Safety

- camera_monitoring_started: false
- microphone_used: false
- voice_loop_started: false
- motion_loop_started: false
- dance_started_by_fix: false
- external_api_write: false
- productionReady: false
- execution: disabled
- rawValuesReported: false
- git_push_performed: false

## Remaining Visual Check

Human visual confirmation is still useful for:

- whether `aiagent_speak` feels close enough to official StackChan dialogue motion
- whether `aiagent_think` should be more tilted or slower
- whether dialogue motion amplitude should be reduced further

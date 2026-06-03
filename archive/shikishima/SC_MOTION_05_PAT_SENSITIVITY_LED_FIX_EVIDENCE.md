# SC-MOTION-05 Pat Sensitivity and LED Fix Evidence

date: 2026-05-25
status: PASS_CANDIDATE
scope: StackChan firmware pat reaction tuning

## Purpose

Fix the issue where a light pat too easily escalated to the `頑張るぞ` over-pat reaction.

Also make pat reaction LED colors easier to understand:

- normal pat / `撫でられてうれしい`: green
- over-pat / `頑張るぞ`: red

## Changes

- Changed over-pat burst window:
  - before: 8000 ms
  - after: 6000 ms
- Changed over-pat threshold:
  - before: 3 reactions
  - after: 5 reactions
- Added LED preset during pat reaction:
  - normal pat: `pass` green
  - over-pat: `stop` red
- LED is automatically returned to off after the pat reaction window.

## Verification

### Build / Flash

- compile_only_build: PASS
- firmware_flash: PASS
- hash_verified: true

### LED Command Check

- green/pass LED: PASS
- red/stop LED: PASS
- LED off restore: PASS
- device_connected_after: true
- voicevox_ready_after: true

## Human Visual Check Needed

Please verify on the physical device:

1. Light pat once or twice:
   - face: `撫でられてうれしい`
   - LED: green
   - should not switch to `頑張るぞ`
2. Repeated pat five times within roughly six seconds:
   - face: `頑張るぞ`
   - LED: red
3. After reaction:
   - LED returns off
   - servo returns center

## Future Secretary / Daily-Life Agent Goal

The long-term target is a secretary-like StackChan agent that can use internal camera context to notice daily-life situations and respond helpfully.

This remains a future gated design because it involves camera observation and privacy-sensitive behavior.

Required future gate:

- one-shot camera observation before any continuous monitoring
- explicit privacy boundary
- no person identification by default
- no private screen / credential reading
- clear recording policy
- human GO before any always-on monitoring
- productionReady remains false until separately approved

## Safety

- camera_monitoring_started: false
- microphone_used: false
- voice_loop_started: false
- motion_loop_started: false
- external_api_write: false
- productionReady: false
- execution: disabled
- rawValuesReported: false
- git_push_performed: false

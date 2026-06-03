# SC-MOTION-03 Operation Motion Preset Implementation Evidence

date: 2026-05-25
status: PASS_CANDIDATE
scope: StackChan firmware motion presets and built-in sensor reaction

## Purpose

Implement a first operation-motion preset layer for StackChan using the existing face assets only.

This task adds named motion presets that can be called through the existing motion command path, and adds a built-in top touch sensor reaction that behaves like a small operation motion.

## Implemented Motions

The following motion names were added to the firmware motion preset path:

| Motion | Face | LED | Intent |
| --- | --- | --- | --- |
| `listen_ready` | `ノーマル` | blue pulse | user interaction begins |
| `greeting_bow` | `笑顔` | blue pulse | greeting / reconnect |
| `thinking_scan` | `ノーマル` | blue pulse | AI thinking / waiting |
| `task_accept` | `頑張るぞ` | blue pulse | command accepted |
| `task_done` | `笑顔` | pass pulse | task completed |
| `safety_hold` | `焦り` | hold pulse | human GO / blocked state |
| `gentle_no` | `あっかんべー` | none | light refusal |
| `stronger_no` | `あっかんべー2` | hold pulse | repeated unsafe request |
| `sleepy_idle` | `zzz` | none | low attention / sleepy idle |
| `wake_up` | `笑顔` | blue pulse | built-in top click wake/listen reaction |
| `panic_stop` | `焦り` | stop pulse | abnormal STOP reaction |

## Built-in Sensor Integration

- Top touch swipe forward/backward remains assigned to the existing pat reaction.
- Top touch click now attempts `wake_up`.
- If `wake_up` cannot start because another reaction is active, the previous face-touch reaction is used as fallback.
- IMU-based pat detection remains unchanged and still uses the `撫でられてうれしい` / `頑張るぞ` pat behavior.

## Implementation Notes

- The existing WebSocket/BLE `move` command path now accepts the new named motion presets.
- Motions are one-shot servo sequences.
- LED pulses automatically turn off after a short preset window.
- The implementation uses only existing face assets under `スタックチャン顔`.
- No new image assets were added.

## Verification

### Build / Flash

- compile_only_build: PASS
- upload_flash: PASS
- firmware_environment: `cores3_noflash`
- upload_port: prior known StackChan COM port
- hash_verified: true

### One-shot Motion Command Check

The following low-risk motion commands returned `ok: true` through the existing StackChan control path:

- `wake_up`
- `listen_ready`
- `greeting_bow`
- `task_done`
- `safety_hold`

Post-check status:

- device_connected: true
- voicevox_ready: true
- led_off_restored: true

Human visual confirmation is still recommended for motion quality, especially for sensor-triggered `wake_up`.

## Safety

- firmware_build: PASS
- firmware_flash: PASS
- servo_physical_test: command-level PASS / human visual quality review still recommended
- camera_monitoring_started: false
- microphone_used: false
- voice_loop_started: false
- external_api_write: false
- productionReady: false
- execution: disabled
- rawValuesReported: false
- git_push_performed: false

## Next Verification

1. Human visual review:
   - top touch click triggers `wake_up`
   - top swipe still triggers pat reaction
   - normal pat keeps `撫でられてうれしい`
   - repeated pat keeps `頑張るぞ`
2. Test remaining HOLD/STOP motions separately:
   - `safety_hold`
   - `panic_stop`
3. Decide whether to tune motion speed/amplitude after visual review.

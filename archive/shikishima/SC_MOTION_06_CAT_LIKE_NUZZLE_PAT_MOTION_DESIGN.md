# SC-MOTION-06 Cat-Like Nuzzle Pat Motion Design

date: 2026-05-25
status: IMPLEMENTED_PASS_CANDIDATE
scope: StackChan pat motion presence polish

## Purpose

Design a more natural cat-like nuzzle behavior for StackChan.

The user goal:

```text
撫でられた時に手に吸い付くような動作
猫のようなすり寄り感
```

This design has moved from HOLD to implementation PASS_CANDIDATE.
Human visual/touch review is still required for final motion feel.

## Desired Feel

The current pat reaction works, but the target is softer and more alive:

- StackChan should lean toward the hand direction.
- It should briefly stay close to the hand.
- It should add a small side-to-side rub while happy.
- It should slowly return to center.
- If patted too much, it should switch to `頑張るぞ`, pull back, and do a stronger "そろそろ作業しよう" motion.

## Existing Inputs

Available without new hardware:

- IMU acceleration delta
- accumulated `leanX` / `leanY`
- top touch swipe forward/backward
- top touch click

Not used:

- camera
- microphone
- person detection
- external API

## Face / LED Policy

| State | Face | LED |
| --- | --- | --- |
| light nuzzle | `撫でられてうれしい` | green |
| sustained nuzzle | `撫でられてうれしい` | green |
| too much pat | `頑張るぞ` | red |

No new face assets are needed.

## Motion Design

### `nuzzle_follow`

Use when a normal pat is detected.

Suggested sequence:

```text
1. lean 35-50% toward hand direction
2. lean 70-90% toward hand direction
3. hold close briefly
4. tiny left-right rub around the hand direction
5. slow release to center
```

### `nuzzle_hold`

Use when the touch signal is sustained but not excessive.

Suggested sequence:

```text
1. lean toward hand
2. hold longer
3. tiny rub
4. return slowly
```

### `nuzzle_too_much`

Use when pat threshold is exceeded.

Suggested sequence:

```text
1. quick pull-back
2. small red LED
3. firm left-right "enough" shake
4. center
```

## Firmware Strategy

Use the existing `triggerHeadPatV2()` path.

Recommended changes:

- replace the normal pat servo sequence with `nuzzle_follow`
- keep current `PAT_OVERDO_THRESHOLD = 5` unless visual test says it is still too sensitive
- use `leanX` / `leanY` as direction vector
- if direction magnitude is too small, default to a gentle upward/right nuzzle instead of hard pan
- lower movement speed during lean-in if possible
- keep `motionLedOffAtMs`
- keep `startPatAnimation(mode)` for face display

## Acceptance Criteria

PASS if:

- one light pat shows `撫でられてうれしい`
- one light pat shows green LED
- one light pat leans into the hand direction
- motion feels soft, not jittery
- repeated pats trigger `頑張るぞ`
- repeated pats show red LED
- servo returns center
- no camera/mic/external action is used

HOLD if:

- hand direction is inconsistent
- servo jitters
- too much pat threshold is still too sensitive
- nuzzle movement feels too large

## Test Plan

1. Compile-only build.
2. Flash after explicit GO.
3. Test a single gentle pat.
4. Test a slow sustained pat.
5. Test repeated pat 5 times within 6 seconds.
6. Record visual observations.

## Safety

- camera_monitoring_started: false
- microphone_used: false
- voice_loop_started: false
- external_api_write: false
- productionReady: false
- execution: disabled
- rawValuesReported: false

## Implementation Result

SC-MOTION-06A was implemented in `triggerHeadPatV2()`.

Implemented:

- normal pat uses cat-like nuzzle follow
- normal pat leans toward the detected hand direction
- normal pat holds close briefly
- normal pat adds small side-to-side rub
- normal pat slowly releases to center
- repeated pat threshold remains 5 pats within 6 seconds
- normal pat LED is green
- over-pat LED is red
- over-pat keeps the firmer "ganbaru / enough" shake

## Next

Human visual/touch confirmation:

```text
1. gently pat once
2. confirm green LED
3. confirm nuzzle leans toward hand and rubs softly
4. pat repeatedly five times within six seconds
5. confirm red LED and stronger over-pat reaction
6. confirm servo returns center
```

# SC-MOTION-02 Additional Operation Motion Candidates

date: 2026-05-25
status: DESIGN_HOLD
scope: StackChan firmware motion candidates

## Purpose

Define candidate StackChan operation motions that can be added later using only the existing face assets in the local redacted face-asset folder.

This document is planning only. It does not approve implementation, flashing, servo testing, voice, camera, microphone, or autonomous execution.

## Current Confirmed Baseline

- Servo control: working
- LED control: working
- Pat reaction: working
- Normal pat face: `happy_pat` (existing face asset: petting-happy)
- Over-pat face: `ganbaru` (existing face asset: work-hard / assertive)
- Motion smoothness: improved by using StackChan-BSP Motion path
- Implementation status for this document: HOLD

## Existing Face Assets

Use these existing faces only:

| Face asset | Intended use |
| --- | --- |
| `ノーマル.png` | idle, neutral, listening |
| `口パク.png` | speaking / mouth animation |
| `笑顔.png` | success, greeting, positive confirmation |
| `撫でられてうれしい.png` | pat reaction, praise, affection |
| `頑張るぞ.png` | over-pat, effort, “let's work” mode |
| `焦り.png` | warning, error, blocked, urgency |
| `あっかんべー.png` | playful tease, light refusal |
| `あっかんべー2.png` | stronger playful tease / second variant |
| `zzz.png` | sleep / low attention |
| `dvdモード.png` | idle screen saver / wandering mode |

No new image assets are approved in this gate.

## Candidate Motion List

| ID | Motion name | Trigger idea | Face | Servo motion | LED | Priority | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SC-MOTION-02A | listen_ready | user starts interaction | `ノーマル` | small tilt toward user, hold center | soft blue pulse | High | Low |
| SC-MOTION-02B | greeting_bow | morning / reconnect / hello | `笑顔` | small nod twice, return center | blue to off | High | Low |
| SC-MOTION-02C | thinking_scan | AI thinking / waiting | `ノーマル` or `口パク` | slow left-right look, slight upward tilt | dim blue | High | Low |
| SC-MOTION-02D | task_accept | command accepted | `頑張るぞ` | firm nod, tiny forward pitch, center | blue flash once | High | Low |
| SC-MOTION-02E | task_done | task completed | `笑顔` | nod + small side sway | green/blue short pulse | High | Low |
| SC-MOTION-02F | safety_hold | action blocked / human GO needed | `焦り` | short shake, then still center | amber/red-like HOLD color if safe | High | Medium |
| SC-MOTION-02G | gentle_no | cannot do that | `あっかんべー` | tiny left-right refusal shake | off or dim blue | Medium | Low |
| SC-MOTION-02H | stronger_no | repeated unsafe request | `あっかんべー2` | firmer refusal shake, return center | brief amber | Medium | Medium |
| SC-MOTION-02I | sleepy_idle | long idle | `zzz` | slow droop/down tilt, relaxed center | off | High | Low |
| SC-MOTION-02J | wake_up | touch / command wakes device | `ノーマル` then `笑顔` | raise pitch, small nod | blue pulse | High | Low |
| SC-MOTION-02K | pat_happy | normal head pat | `撫でられてうれしい` | fine left-right rub motion | soft blue | Done candidate | Low |
| SC-MOTION-02L | pat_too_much | repeated pat | `頑張るぞ` | firmer annoyed/energized shake | short blue flash | Done candidate | Medium |
| SC-MOTION-02M | panic_stop | abnormal state / STOP | `焦り` | freeze after one short shake | red/amber if available | High | Medium |
| SC-MOTION-02N | playful_ready | casual response | `あっかんべー` | side peek motion | off | Low | Low |
| SC-MOTION-02O | dvd_roam | passive room mascot idle | `dvdモード` | no servo or rare tiny look | off | Medium | Low |
| SC-MOTION-02P | nuzzle_follow | gentle pat / hand nearby | `撫でられてうれしい` | cat-like nuzzle toward detected hand direction, hold softly, tiny side rub, return center | green | High | Medium |
| SC-MOTION-02Q | nuzzle_hold | sustained gentle pat | `撫でられてうれしい` | slow lean-in and stay close as if吸い付く, then slow release | green | High | Medium |
| SC-MOTION-02R | nuzzle_too_much | repeated/strong pat | `頑張るぞ` | quick enough-shake, pull back, return center | red | High | Medium |

## Recommended Implementation Order

1. `listen_ready`
2. `greeting_bow`
3. `thinking_scan`
4. `task_accept`
5. `task_done`
6. `safety_hold`
7. `sleepy_idle`
8. `wake_up`
9. `gentle_no`
10. `panic_stop`
11. `nuzzle_follow`
12. `nuzzle_hold`
13. `nuzzle_too_much`

`pat_happy` and `pat_too_much` are already represented by the current pat reaction direction and should be treated as the reference pattern for future motion modules.

## Cat-Like Nuzzle Direction

The desired pat behavior should feel less like a mechanical shake and more like a small animal leaning into the user's hand.

Target feel:

- when lightly patted, StackChan moves toward the hand direction
- it should briefly stay close, as if吸い付く
- it should add a small left-right rub while happy
- it should release slowly back to center
- if patted too much, it should switch to `頑張るぞ` and pull back with a stronger "そろそろ作業しよう" motion

Candidate firmware names:

```text
nuzzle_follow
nuzzle_hold
nuzzle_too_much
```

Implementation notes:

- use the existing IMU lean vector as the first hand-direction estimate
- use top touch swipe direction as a stronger hint when available
- avoid large servo jumps
- reduce motor speed for the lean-in phase
- keep one motion at a time
- do not use camera/microphone for this behavior
- do not infer a person; this is touch-reactive only

## Motion Module Shape

Future implementation should add named motion presets rather than ad hoc servo calls.

```text
motion_id:
  face:
  servo_sequence:
    - pan:
      tilt:
      ms:
  led_preset:
  allowed_context:
  blocked_context:
  cooldown_ms:
  return_to_center:
```

Recommended firmware-level names:

```text
listen_ready
greeting_bow
thinking_scan
task_accept
task_done
safety_hold
gentle_no
stronger_no
sleepy_idle
wake_up
panic_stop
playful_ready
dvd_roam
nuzzle_follow
nuzzle_hold
nuzzle_too_much
```

## Safety Rules

All candidates remain display/motion-only and must preserve:

- no camera monitoring
- no microphone activation
- no voice loop
- no autonomous conversation loop
- no external API write
- no productionReady true
- no execution enabled
- no command retry loop
- no motion during firmware write
- one motion at a time
- cooldown between repeated motions
- return to center after each motion unless explicitly idle/sleep

## Implementation HOLD

Implementation is not approved by this document.

Before implementation:

1. choose a small first batch, preferably 3 motions maximum
2. compile-only build
3. flash GO
4. one-shot visual test
5. evidence record
6. gate returns to HOLD

## Next Suggested Gate

`SC-MOTION-03 First Motion Preset Batch`

Suggested first batch:

- `listen_ready`
- `greeting_bow`
- `task_done`

Reason:

These are low risk, useful during normal operation, and do not require camera, microphone, voice loop, external API, or new face assets.

## Future Suggested Gate

`SC-MOTION-06 Cat-Like Nuzzle Pat Motion`

Goal:

- replace the current simple pat shake feel with a more natural hand-following nuzzle
- preserve the tuned over-pat threshold
- keep green/red LED behavior
- keep existing faces only

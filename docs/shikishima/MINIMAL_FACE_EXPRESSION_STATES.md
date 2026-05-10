# Minimal Face Expression States

## Purpose

This document defines design-only expression states for the v0.6.0 minimal
dot-line face system.

The expression system uses only eyes, mouth, tiny brows when needed, tiny cheek
dots when needed, one tiny agent symbol when needed, and an optional subtle
accent color.

## Common Expression States

| State | Design meaning | Notes |
| --- | --- | --- |
| idle | calm default presence | minimal dots and small mouth |
| thinking | processing or planning | eyes move slightly upward or sideward |
| speaking | future text/audio speaking state | mouth states may alternate later |
| listening | user-facing attention | eyes centered and calm |
| blink | soft closed-eye transition | design-only animation concept |
| glance_left | brief side glance | no tracking implied |
| glance_right | brief side glance | no tracking implied |
| glance_up | thinking or route planning | no camera use |
| glance_down | working or reading posture | no file display implied |
| look_away | shy or pause state | quiet side/down gaze |
| sleepy / eyes_closed | rest or low-intensity state | especially suitable for しるべ |

## Role-Specific States

### しきしま / しき

- organizing
- confirming
- summarizing

Default feeling: listening, organizing, gently coordinating.

### しずめ

- safety_check
- hold
- reject
- approval_wait

HOLD must look calm and protective, not scary or aggressive.

### つむぎ / つむ

- working
- patch_drafting
- test_review
- done

Default feeling: quietly working, making, connecting.

### はじめ

- planning
- route_selecting
- next_step

Default feeling: next step, optimistic, clear but not loud.

### しるべ

- logging
- searching
- found
- handoff

Default feeling: observant, gentle, archival, searching.

## Current Preferred Constraint

Every expression remains face-parts only. No face outline, torso, costume,
full-body character, or bust-up avatar should be required by the current design.

## Safety Boundary

These states are design labels only. They are not runtime implementation, device
commands, camera tracking, audio wiring, or robot motion approval.

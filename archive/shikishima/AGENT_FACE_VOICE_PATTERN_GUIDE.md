# Agent Face / Voice Pattern Guide

## Purpose

This guide records agent-specific face, mouth, gaze, and future voice-intent
patterns for the minimal dot-line face system.

It is not voice implementation, lip sync, camera tracking, robot control, or
execution approval.

## Agent Pattern Table

| Agent | ASCII ID | Voice intent | Mouth pattern | Eye/gaze pattern | Safety note |
| --- | --- | --- | --- | --- | --- |
| しきしま / しき | shikishima | calm organizer | closed -> small -> mid -> small | center with small organizing glance | display-only |
| しずめ | shizume | quiet protective gate | closed -> flat -> small -> flat | fixed center, minimal blink | display-only, no alert aggression |
| つむぎ / つむ | tsumugi | focused maker | closed -> small -> mid -> small, slight bounce | down or side scanning | display-only |
| はじめ | hajime | bright next-step guide | closed -> small -> smile_talk -> small | upward gaze and return | display-only |
| しるべ | shirube | gentle record keeper | closed -> small -> closed | side/down search gaze | display-only |

Only しき and つむ are nicknames. しずめ, はじめ, and しるべ have no nicknames.

## Role-Specific Notes

### しきしま / しき

- organizing: centered eyes, soft smile talk.
- confirming: small mouth, short blink.
- summarizing: calm loop with slight gaze return to center.

### しずめ

- safety_check: fixed center eyes, mouth_flat.
- hold: calm flat mouth, no scary warning expression.
- reject: firm but minimal mouth_flat, no aggressive red visual language.
- approval_wait: quiet closed mouth, steady eyes.

### つむぎ / つむ

- working: down gaze, mouth_closed.
- patch_drafting: small mouth loop and side scan.
- test_review: eyes_focus, small mouth.
- done: tiny smile and thread curve.

### はじめ

- planning: eyes_up, small smile.
- route_selecting: glance_left -> glance_right -> center.
- next_step: smile_talk with arrow mark.

### しるべ

- logging: side/down gaze, quiet mouth.
- searching: left/right scan.
- found: tiny smile and star-dot.
- handoff: centered eyes, closed-to-small mouth.

## Boundary

The patterns are static design guidance. They do not trigger audio, camera,
external services, device output, or robot motion.

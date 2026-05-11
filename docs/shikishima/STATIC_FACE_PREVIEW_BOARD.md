# Static Face Preview Board

## Purpose

This document defines the v0.8.0 static face preview board for reviewing the
five Shikishima agent faces.

The board is display-only, review-only, and documentation-only. It does not
create runtime UI, audio playback, recording, microphone use, camera use,
external API access, StackChan connection, robot control, GO, or production
readiness.

## Preview Board Goals

- review five minimal dot-line faces at a glance.
- compare eye shape, mouth shape, tiny symbol, and accent color.
- check PC-width and smartphone-width readability.
- keep voiceIntent, mouthPattern, gazePattern, and blinkState as display labels
  only.
- make HOLD boundaries visible.

## Agents

| Agent | ASCII ID | Static face summary | Tiny symbol | Display labels |
| --- | --- | --- | --- | --- |
| しきしま / しき | shikishima | calm dot eyes, tiny soft smile | orbit_dot | calm / calm_loop / steady_center |
| しずめ | shizume | thin horizontal eyes, flat mouth | gate_line | protective / minimal_gate_loop / steady_center |
| つむぎ / つむ | tsumugi | larger dot eyes, focused mouth | thread_curve | focused / explain_loop / work_down |
| はじめ | hajime | upward dot eyes, bright small smile | arrow_mark | proposing / smile_talk_loop / thinking_up |
| しるべ | shirube | half-moon eyes, quiet smile | bookmark_dot | archival / quiet_loop / search_side |

Only しき and つむ are nicknames. しずめ, はじめ, and しるべ have no nicknames.

## Board Rules

- no buttons.
- no inputs.
- no forms.
- no audio or video elements.
- no canvas execution logic.
- no external URLs.
- no connection status.
- no test controls.
- no StackChan preview wording.
- no robot motion wording beyond HOLD.

## Current Status

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- GO: not approved

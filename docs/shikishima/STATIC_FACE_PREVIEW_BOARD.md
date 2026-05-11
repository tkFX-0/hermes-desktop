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

| Agent | ASCII ID | Static face summary | Tiny symbol | Display labels | Boundary |
| --- | --- | --- | --- | --- | --- |
| しきしま / しき | shikishima | calm dot eyes, tiny soft smile | orbit_dot | calm / calm_loop / steady_center | display-only / no execution / no device connection |
| しずめ | shizume | thin horizontal eyes, flat mouth | gate_line | protective / minimal_gate_loop / steady_center | display-only / no execution / no device connection |
| つむぎ / つむ | tsumugi | larger dot eyes, focused mouth | thread_curve | focused / explain_loop / work_down | display-only / no execution / no device connection |
| はじめ | hajime | upward dot eyes, bright small smile | arrow_mark | proposing / smile_talk_loop / thinking_up | display-only / no execution / no device connection |
| しるべ | shirube | half-moon eyes, quiet smile | bookmark_dot | archival / quiet_loop / search_side | display-only / no execution / no device connection |

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

## v0.8.1 Review Hardening

- Every face preview card must visibly state display-only.
- Every face preview card must visibly state no execution.
- Every face preview card must visibly state no device connection.
- PC-width review checks spacing, readability, and label clarity only.
- smartphone-width review checks wrap, vertical rhythm, and accidental
  execution-looking affordances only.
- voiceIntent, mouthPattern, gazePattern, and blinkState remain display labels
  only.

## v0.9.0 Expression Variation Set

The preview board may reference these static expression labels:

- neutral.
- listening.
- thinking.
- holding.
- caution.
- rejected.
- review_ready.
- completed_static_only.

These labels are not real-time status, connection status, robot control preview,
GO approval indicators, productionReady indicators, or execution readiness.

## Current Status

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- GO: not approved

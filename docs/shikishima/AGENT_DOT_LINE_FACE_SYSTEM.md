# Agent Dot-Line Face System

## Purpose

This document defines the current preferred face design direction for the
Shikishima agents.

v0.6.0 supersedes the costume-heavy bust-up avatar direction for current face
design. The preferred direction is a minimal dot-and-line expression surface:
face parts only, no face outline, no torso, no costume, no full-body avatar, and
large whitespace.

Design philosophy:

> しきしまエージェントは、点と線だけで気配が伝わる小さな相棒。

## Current Direction

- minimal.
- hand-drawn feeling.
- dot-and-line based.
- face-parts only.
- no face outline.
- no torso.
- no costume.
- no full body.
- no bust-up avatar.
- lots of whitespace.
- small black or near-black strokes.
- tiny optional color accents only.
- cute because it is simple.

## Explicit Non-Direction

The current preferred direction does not use:

- rich avatar cards.
- large colored cards.
- role-badge-heavy character cards.
- game-style character selection UI.
- anime eyes.
- photorealistic faces.
- robot parts.
- military or security visual language.
- clothing, uniforms, or accessories as identity markers.

## Agent Identity

Each agent is identified by five quiet signals:

| Agent | ASCII ID | Eye shape | Mouth shape | Tiny symbol | Accent |
| --- | --- | --- | --- | --- | --- |
| しきしま / しき | shikishima | calm dot eyes or tiny capsule dots | tiny soft smile | center node / orbit dot | blue |
| しずめ | shizume | thin horizontal eyes | flat calm mouth | HOLD bar / gate line | blue-green |
| つむぎ / つむ | tsumugi | slightly larger dot eyes | tiny focused mouth or small o | thread curve | amber/orange |
| はじめ | hajime | upward-looking dot eyes | small bright smile | tiny arrow / first-step mark | green |
| しるべ | shirube | half-moon or sleepy eyes | tiny calm smile | bookmark / star-dot | violet |

Only しき and つむ are nicknames. しずめ, はじめ, and しるべ have no nicknames.

## Safety Boundary

This design is documentation and static display planning only. It does not
approve StackChan control, robot motion, camera use, microphone automation,
runtime implementation, GO, or production readiness.

v0.7.0 adds voiceIntent, mouthPattern, and gazePattern as concept labels for this
face system. Those labels remain display-only and non-execution.

Current status:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

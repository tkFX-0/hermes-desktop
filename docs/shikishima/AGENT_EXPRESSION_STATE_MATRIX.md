# Agent Expression State Matrix

## Purpose

This document applies the v0.9.0 expression variation set to the five
Shikishima agents.

The matrix is static documentation only. It does not implement live status,
device connection, animation runtime, robot control, GO approval, or production
readiness.

## Agents

| Agent | ASCII ID | Nickname rule |
| --- | --- | --- |
| しきしま / しき | shikishima | しき is allowed |
| しずめ | shizume | no nickname |
| つむぎ / つむ | tsumugi | つむ is allowed |
| はじめ | hajime | no nickname |
| しるべ | shirube | no nickname |

Use `tsumugi` as the only ASCII ID for つむぎ / つむ.

## Expression Application Matrix

| Agent | neutral | listening | thinking | holding | caution | rejected | review_ready | completed_static_only |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| しきしま / しき | calm organizer | attentive organizer | route sorting | acknowledges HOLD | gentle caution | reports stop | summarizes review package | summarizes docs-only completion |
| しずめ | quiet baseline | steady watch | safety check | primary HOLD face | primary caution face | primary REJECT face | waits for human review | records safe static completion |
| つむぎ / つむ | ready to draft docs | listens for scope | patch planning concept | pauses work | checks risk | stops implementation | docs ready for review | docs-only work complete |
| はじめ | first-step calm | receives direction | next-step planning | pauses route | flags uncertain route | stops route | plan ready for review | plan draft complete |
| しるべ | archival calm | listens for handoff | searches notes | records HOLD | marks caution | records rejection | handoff ready | redacted summary complete |

## Display Label Matrix

| expressionId | voiceIntent | mouthPattern | gazePattern | blinkState |
| --- | --- | --- | --- | --- |
| neutral | calm | calm_loop | steady_center | open |
| listening | calm | quiet_loop | steady_center | open |
| thinking | focused | calm_loop | thinking_up | half_closed |
| holding | protective | minimal_gate_loop | steady_center | open |
| caution | protective | mouth_flat | eyes_focus | open |
| rejected | protective | mouth_flat | steady_center | half_closed |
| review_ready | proposing | smile_talk_loop | thinking_up | open |
| completed_static_only | archival | quiet_loop | steady_center | half_closed |

## Forbidden Interpretations

- not real-time status.
- not connection status.
- not robot control preview.
- not GO approval indicator.
- not productionReady indicator.
- not execution readiness.
- not audio, camera, or microphone state.

## Safety Boundary

All rows remain display-only / no execution / no device connection.

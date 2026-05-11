# Face Preview Visual States

## Purpose

This document records the static visual state set used by the v0.8.0 face
preview board.

These states are labels for static review only. They are not animation runtime,
audio runtime, gaze tracking, device commands, or robot control.

## Preview States

| State | Meaning | Static display hint |
| --- | --- | --- |
| idle | calm default presence | center eyes, closed or small smile |
| listening | user-facing attention | centered eyes, tiny soft mouth |
| thinking | internal planning | upward or side gaze |
| speaking_label | future speaking display label | mouthPattern shown as text only |
| blink_label | future blink display label | blinkState shown as text only |
| hold_label | safety boundary visible | calm flat mouth for しずめ |
| review_only | no execution allowed | status note remains visible |

## Agent Static Preview Mapping

| Agent | expressionState | voiceIntent | mouthPattern | gazePattern | blinkState |
| --- | --- | --- | --- | --- | --- |
| しきしま / しき | listening | calm | calm_loop | steady_center | open |
| しずめ | hold_label | protective | minimal_gate_loop | steady_center | open |
| つむぎ / つむ | thinking | focused | explain_loop | work_down | open |
| はじめ | thinking | proposing | smile_talk_loop | thinking_up | open |
| しるべ | listening | archival | quiet_loop | search_side | half_closed |

## Boundary

The preview board may show labels, dots, lines, symbols, and static layout only.
It must not run animation, play audio, record audio, use camera input, connect to
external services, or control devices.

## v0.8.1 Review Hardening

The visual states must not be worded as operational states. Avoid labels that
sound like active execution, device readiness, or connection status.

Preferred wording:

- display label.
- visual review.
- static preview.
- display-only.
- no execution.
- no device connection.

Avoid wording:

- connected.
- ready to run.
- running.
- playing.
- recording.
- testing.
- speaker test.

## v0.9.0 Expression Variations

The static preview board can use the following expression labels:

| expressionId | Static review meaning |
| --- | --- |
| neutral | default calm presence |
| listening | attention concept, not microphone listening |
| thinking | planning concept, not active processing status |
| holding | HOLD visual language, not gate control |
| caution | gentle caution concept, not live alert |
| rejected | stop-state concept, not automated decision engine |
| review_ready | review concept, not GO-ready |
| completed_static_only | docs/static completion concept, not productionReady |

All expression labels remain display-only / no execution / no device connection.

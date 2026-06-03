# Non-Execution Face Signal Protocol

## Purpose

This document defines a redacted, non-execution protocol language for discussing
future face-display state. It is not a runtime schema, not an API contract, and
not a device command format.

The protocol names are review vocabulary only.

## Signal Fields

| Field | Example values | Meaning |
| --- | --- | --- |
| agentId | shikishima, shizume, tsumugi, hajime, shirube | agent identity label |
| expressionState | idle, listening, speaking, thinking, hold | display state |
| voiceIntent | calm, protective, focused, proposing, archival | non-audio voice presence label |
| mouthState | mouth_closed, mouth_small, mouth_mid, mouth_round_o, mouth_flat | display-only mouth label |
| mouthPattern | calm_loop, explain_loop, minimal_gate_loop, quiet_loop | display-only sequence label |
| eyeState | eyes_center, eyes_half_closed, eyes_closed, eyes_focus | display-only eye label |
| gazeDirection | center, left, right, up, down, look_away | display-only gaze label |
| gazePattern | steady_center, thinking_up, search_side, work_down | display-only sequence label |
| blinkState | open, half_closed, closed | display-only blink label |
| tinySymbol | orbit_dot, gate_line, thread_curve, arrow_mark, bookmark_dot | identity symbol |
| approvalBoundary | display_only_hold | safety status |

## Non-Execution Rules

- Do not send this to a device.
- Do not treat this as implementation-ready.
- Do not connect it to audio playback.
- Do not connect it to microphone input.
- Do not connect it to camera input.
- Do not connect it to external APIs.
- Do not connect it to StackChan control.
- Do not connect it to robot motion.

## Current Status

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

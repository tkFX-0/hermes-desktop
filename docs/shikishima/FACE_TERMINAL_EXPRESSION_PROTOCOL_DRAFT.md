# Face Terminal Expression Protocol Draft

## Purpose

This is a non-executable design draft for future face-display planning. It is
not a runtime contract, implementation approval, device command format, or robot
control approval.

v0.6.0 aligns this draft with the minimal dot-line face direction: face parts
only, no face outline, no torso, no costume, and no bust-up avatar requirement.

## Design-Only Sample Fields

These fields are examples for review language only. They are not implementation
ready and must not be sent to a device.

| Field | Design-only examples | Notes |
|---|---|---|
| agentId | shikishima, shizume, tsumugi, hajime, shirube | ASCII ID only |
| expressionState | idle, thinking, speaking, listening, hold | visual state |
| mouthState | mouth_closed, mouth_small, mouth_mid, mouth_round_o, mouth_flat | no speech synthesis implied |
| eyeState | eyes_center, eyes_closed, eyes_half_closed, eyes_focus | no camera tracking implied |
| gazeDirection | center, left, right, up, down, look_away | design-only movement label |
| blinkState | open, half_closed, closed | future display concept only |
| tinySymbol | orbit_dot, gate_line, thread_curve, arrow_mark, bookmark_dot | tiny identity mark |
| accentColor | blue, blue_green, amber_orange, green, violet | subtle color accent |
| safetyNote | display_only_hold | execution remains disabled |

## Boundary

- Documentation only.
- Not runtime implementation.
- Not a device command.
- Not StackChan firmware approval.
- Not robot motion approval.
- Not camera, microphone, or identity recognition approval.
- Not production readiness.

この範囲では問題を検出していません。

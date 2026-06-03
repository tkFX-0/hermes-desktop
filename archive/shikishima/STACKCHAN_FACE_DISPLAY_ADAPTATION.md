# StackChan Face Display Adaptation

## Purpose

This document describes a future display-only adaptation of the minimal dot-line
face system for a StackChan-like small display.

It does not approve StackChan control, robot motion, servo control, firmware
work, or device commands.

## Display Constraints

- small screen.
- high readability.
- face-parts only.
- no face outline required.
- eyes and mouth are the priority.
- tiny symbol is secondary.
- accent color is optional and subtle.

## Simplified Animation Set

Mouth movement can be reduced to two or three states:

- mouth_closed
- mouth_small
- mouth_round_o

Eye movement can be reduced to:

- eyes_center
- eyes_closed
- eyes_side

## v0.7.0 Voice / Mouth / Eye Adaptation

A future StackChan-like display may use only simplified display labels:

- voiceIntent: calm, protective, focused, proposing, archival.
- mouthPattern: calm_loop or minimal_gate_loop.
- gazePattern: steady_center, side, or closed.

These labels are not device commands. They do not approve audio output, robot
motion, servo control, firmware work, or StackChan control.

## Not Approved

- no physical motion.
- no servo control.
- no robot control approval.
- no camera use.
- no autonomous motion.
- no firmware installation.
- no runtime bridge.

## Current Status

- stackchanFaceDisplayStatus: future_display_only_plan
- robotMotionApprovalStatus: not_approved
- decision: HOLD
- execution: disabled

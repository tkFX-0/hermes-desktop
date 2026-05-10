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

# StackChan Expression-Only Plan

## Purpose

This plan keeps StackChan as a future expression-only device. It is not the
brain of the system and it is not approved for motion or control.

v0.6.0 aligns the future visual direction with the minimal dot-line face system.
StackChan adaptation is display-only planning: eyes, mouth, and tiny symbols are
prioritized, while face outline, torso, costume, bust-up avatar, physical
motion, servo control, and robot control remain outside approval.

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- phaseStatus: draft_created / documentation_only / robot_execution_HOLD

## Architecture Boundary

- しきしま / しき remains the orchestration layer.
- RTX 4070 PC remains the main control side.
- StackChan may receive only safe expression commands after separate approval.
- Robot motion is HOLD by default.
- Physical movement requires しずめ plus human approval.

## Forbidden By Default

- autonomous motion.
- camera upload or cloud upload.
- face recognition or identity inference.
- firmware install or build.
- direct robot control.
- expression commands without a safety gate.

## Future Safe Direction

- neutral expression display.
- status-only mouth/eye state.
- minimal dot-line face parts.
- simplified mouth states for a small display.
- simplified eye states for center/closed/side.
- no identity.
- no autonomous motion.
- no cloud by default.
- no physical motion approval.
- no servo control approval.

## Current Preferred Face Direction

`AGENT_DOT_LINE_FACE_SYSTEM.md` is the current preferred face design direction.
`STACKCHAN_FACE_DISPLAY_ADAPTATION.md` describes the future display-only
adaptation boundary. Neither document approves StackChan control or robot
motion.

v0.7.0 adds voiceIntent, mouthPattern, and gazePattern as future display labels
only. They are not audio output, recording, microphone use, external API use,
servo control, firmware work, StackChan control, or robot motion approval.

この範囲では問題を検出していません。

# StackChan Expression-Only Plan

## Purpose

This plan keeps StackChan as a future expression-only device. It is not the
brain of the system and it is not approved for motion or control.

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
- no identity.
- no autonomous motion.
- no cloud by default.

この範囲では問題を検出していません。

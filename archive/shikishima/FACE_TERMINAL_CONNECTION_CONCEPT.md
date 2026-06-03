# Face Terminal Connection Concept

## Purpose

This document explains how the v0.7.0 voice, mouth-flap, and eye-gaze concepts
might relate to future display surfaces.

It is concept-only. It does not approve runtime connection, device output,
StackChan control, Android automation, iPhone automation, microphone use, audio
playback, or external API access.

## Future Display Surfaces

| Surface | Future role | Current approval |
| --- | --- | --- |
| smartphone face UI | display-only dot-line face surface | not_approved_for_execution |
| Android face terminal | display-only prototype surface | not_approved_for_execution |
| iPhone review surface | private review/planning surface | not_approved_for_execution |
| StackChan-like display | future display-only adaptation | not_approved_for_execution |

## Concept Flow

```text
agent state
  -> non-execution face signal labels
  -> dot-line mouth / eye / symbol concept
  -> smartphone or small display planning
  -> execution remains HOLD
```

## Explicitly Not Included

- no audio playback.
- no recording.
- no microphone.
- no camera upload.
- no face recognition.
- no user emotion inference.
- no external API.
- no robot control.
- no StackChan motion.
- no execution button.

## Review Boundary

Approving this concept would only approve documentation direction. It would not
approve implementation, device connection, push, GO, or production readiness.

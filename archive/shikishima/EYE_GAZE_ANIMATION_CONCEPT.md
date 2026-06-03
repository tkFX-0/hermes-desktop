# Eye Gaze Animation Concept

## Purpose

This document defines future gaze, blink, and eye movement concepts for the
minimal dot-line face system.

It is design-only. It does not use camera input, face recognition, eye tracking,
emotion inference, or runtime animation wiring.

## Eye States

| State | Design meaning |
| --- | --- |
| eyes_center | neutral/listening |
| eyes_left | side glance |
| eyes_right | side glance |
| eyes_up | thinking/planning |
| eyes_down | working/reading posture |
| eyes_closed | blink or rest |
| eyes_half_closed | gentle transition |
| eyes_swim_soft | small uncertain drift |
| eyes_look_away | shy/pause state |
| eyes_focus | fixed safety or work focus |

## Movement Concepts

| Concept | Sequence |
| --- | --- |
| blink | open -> half_closed -> closed -> open |
| thinking | center -> upper_right -> center |
| searching | left -> right -> left -> center |
| shy/look away | center -> side -> down |
| safety check | center fixed, minimal movement |
| working | down gaze or slight left/right scanning |
| planning | upward gaze |
| logging/searching | lower-left or side gaze |

## Agent-Specific Notes

- しきしま / しき: steady center gaze, occasional organizing glance.
- しずめ: fixed calm gaze, minimal motion.
- つむぎ / つむ: down or side scanning while working.
- はじめ: upward gaze for next-step planning.
- しるべ: side or lower gaze for searching and handoff.

## Safety Boundary

No camera-based eye tracking is part of this concept. No user emotion is inferred
from camera or sensor data.

## v0.7.0 Voice Coupling Notes

Voice intent may be paired with gaze labels for future display planning:

| Voice intent | Suggested gaze pattern | Boundary |
| --- | --- | --- |
| calm | steady_center | display-only |
| protective | steady_center with minimal blink | display-only |
| focused | work_down or eyes_focus | display-only |
| proposing | thinking_up then center | display-only |
| archival | search_side or lower-side gaze | display-only |

This does not use camera, eye tracking, face recognition, user emotion inference,
or runtime animation wiring.

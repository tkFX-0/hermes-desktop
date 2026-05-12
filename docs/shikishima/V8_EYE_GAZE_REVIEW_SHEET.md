# Shikishima v8 Eye Gaze Review Sheet — v2.8.5

## Purpose

Review sheet for eye gaze animation implementation.

- documentVersion: v2.8.5 / decision: HOLD

---

## Gaze Direction Set

| gazeTarget | X offset | Y offset | Duration |
|---|---|---|---|
| center | 0 | 0 | hold |
| left | -4px | 0 | 300ms transition |
| right | +4px | 0 | 300ms transition |
| up | 0 | -3px | 250ms transition |
| down | 0 | +3px | 250ms transition |
| blink | n/a | n/a | 80ms close + 100ms open |

## Attention Pattern (timer-based, no camera)

```
0–5s:    center (hold)
5–8s:    slight right
8–12s:   center
12–15s:  slight left
15–20s:  center
[repeat]
```

## Blink Cycle

- Interval: random 3000–6000ms
- Duration: 80ms closed + 100ms open = 180ms
- Implementation: CSS opacity transition on blink overlay

## Implementation Review

| Item | Check |
|---|---|
| Gaze offset via CSS transform or SVG attribute | Yes |
| No camera input | Confirmed |
| No face detection library | Confirmed |
| No canvas capture | Confirmed |
| Smooth transition: `transition: transform 300ms ease-out` | Yes |
| Blink: `transition: opacity 80ms linear` | Yes |

## Before v8 Review Sign-off

- [ ] Gaze moves smoothly between positions
- [ ] Blink fires at random intervals
- [ ] No camera device accessed
- [ ] No `getUserMedia()` call
- [ ] Eye gaze looks natural in face terminal

この範囲では問題を検出していません。

# Shikishima v8 Mouth Pattern Review Sheet — v2.8.5

## Purpose

Review sheet for mouth pattern animation implementation.

- documentVersion: v2.8.5 / decision: HOLD

---

## Mouth Pattern Frame Sequence

| Frame | Pattern | Duration | Rendered As |
|---|---|---|---|
| 0 | closed | 200ms | `─────` |
| 1 | small-open | 150ms | `─╮  ╭─` |
| 2 | wide-open | 100ms | `╰─────╯` |
| 3 | small-open | 150ms | `─╮  ╭─` |
| 4 | closed | 200ms | `─────` |

Total cycle: 800ms

## Implementation Review

| Item | Check |
|---|---|
| Timer uses `setInterval` or `requestAnimationFrame` | Yes |
| No audio dependency in frame selection | Confirmed |
| Frames update CSS class or SVG path | Yes |
| No canvas element | Confirmed |
| No Web Audio API | Confirmed |
| Props-only (frame index passed in or auto-cycled) | Yes |

## Talking-Timer vs Audio Modes

| Mode | Implementation | Audio? |
|---|---|---|
| `idle` | Static `closed` | No |
| `talking-timer` | Cycle through frames at interval | No — timer only |
| `talking-audio` | Audio amplitude → frame selection | HOLD (G-15) |

## Before v8 Review Sign-off

- [ ] Component renders `closed` by default
- [ ] Component cycles through frames in `talking-timer` mode
- [ ] No audio device accessed
- [ ] No `new Audio()` or `AudioContext` in component
- [ ] Animation looks natural in app

この範囲では問題を検出していません。

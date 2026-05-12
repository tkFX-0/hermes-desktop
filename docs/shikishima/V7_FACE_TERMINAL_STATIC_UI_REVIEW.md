# Shikishima v7 Face Terminal Static UI Review — v2.8.4

## Purpose

Review checklist for the face terminal UI component before connection testing.

- documentVersion: v2.8.4 / decision: HOLD / execution: disabled / productionReady: false

---

## Face Terminal UI Review Checklist

**Component structure**:
- [ ] Component is props-only (no useEffect with IPC/fetch)
- [ ] No `button`, `input`, `form`, `select`, `textarea` elements
- [ ] No `fetch()`, `WebSocket`, `XMLHttpRequest` calls
- [ ] No `canvas`, `video`, `audio` elements
- [ ] No `new Audio()` calls
- [ ] No import from `preload` or IPC channel modules

**Display content**:
- [ ] expressionId label rendered correctly
- [ ] mouthPattern label rendered correctly
- [ ] voiceIntentLabel shown as text label only (not real state)
- [ ] Safety badges visible: "execution: disabled", "robotMotion: HOLD"
- [ ] No "connected", "running", "live", "ready" misleading labels
- [ ] No productionReady indicator

**Safety labels**:
- [ ] At least: `execution: disabled`
- [ ] At least: `robotMotion: HOLD`
- [ ] At least: `productionReady: false`

---

## Face Terminal Before StackChan Connection

The face terminal UI should work in Electron without StackChan.
Test in v5 (local dev run) before attempting G-14.

| Test | Expected |
|---|---|
| Face terminal renders in app | Expression displayed correctly |
| Animation cycle runs | Mouth/eye animate via timer |
| No IPC call triggered | Console shows no IPC activity |
| No network activity | DevTools Network: no requests |

---

## Face Terminal After G-14 (display-only)

After StackChan connected in display-only mode:

| Test | Expected |
|---|---|
| Expression visible on StackChan LCD | Correct |
| Servo position | Unchanged (HOLD) |
| Audio output | None |
| Timer-based updates | Appear on LCD correctly |

この範囲では問題を検出していません。

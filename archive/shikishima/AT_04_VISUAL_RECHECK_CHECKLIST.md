# AT-04 Visual Recheck Checklist

## Common UI

- [ ] Agent Theater tab appears at index 0
- [ ] Tab label: `管制室` (ja) / `Theater` (en)
- [ ] SafetyStrip visible (always-on strip)
- [ ] PageRightRail visible at ≥900px (sidebar with NextActionCard + chips + copy buttons)
- [ ] SlotStatusBar visible (7 rows: CONVERSE / PLAN / SAFETY / DEV-CODEX / DEV-CC / RECORD / SOCIAL)
- [ ] Handoff flow bar visible (指揮→計画→確認→実装→記録 + 人間GO待ち badge)
- [ ] No layout break or horizontal overflow at normal desktop width
- [ ] No raw values (no Windows path / LAN IP / API key / token)
- [ ] No execute / push / send / OAuth / x_search buttons visible

---

## Agent Visual Checks

### しきしま (Shikishima)

- [ ] Headset arc visible (over head)
- [ ] Ear pieces visible (left + right rectangles)
- [ ] Microphone boom visible (small arc from right earpiece)
- [ ] Attentive/calm expression (rectangular eyes)
- [ ] Blue command flag with `し` label visible
- [ ] Flag pole visible
- [ ] Overall impression: command lead waiting for human GO

### しずめ (Shizume)

- [ ] Safety helmet visible (dome + brim line)
- [ ] Helmet lamp (small circle on side)
- [ ] Whistle visible (circle in middle of body)
- [ ] Safety vest diagonal lines visible
- [ ] Sharp / angled stop-check eyes
- [ ] Red HOLD sign visible (on flag pole)
- [ ] HOLD text on sign
- [ ] Overall impression: safety gate / traffic control authority

### はじめ (Hajime)

- [ ] Folded map visible (below body, multi-section fold lines)
- [ ] Route line with dashes visible on map
- [ ] Origin + destination dots on route
- [ ] Wide curious eyes with highlights
- [ ] Thinking bubble (circle with `?`)
- [ ] Overall impression: planning / curious / next-step design

### つむぎ (Tsumugi)

- [ ] Construction helmet visible (dome + brim + ridge lines)
- [ ] Toolbox visible (rectangle, bottom right)
- [ ] Toolbox handle visible
- [ ] Wrench / tool cue visible
- [ ] Focused narrow ellipse eyes
- [ ] Straight determined mouth
- [ ] Orange flag with pole
- [ ] Overall impression: focused developer / builder

### しるべ (Shirube)

- [ ] Headphones visible (arc over head + ear cups on both sides)
- [ ] Logbook visible (open rectangle)
- [ ] Bookmark stripe on logbook
- [ ] Serene closed curved eyes
- [ ] Gentle smile
- [ ] Purple flag
- [ ] Overall impression: calm recorder / archivist

---

## Safety State Checks

- [ ] Decision badge: HOLD (or per snapshot state)
- [ ] execution: disabled (SafetyStrip chip)
- [ ] productionReady: false (SafetyStrip chip)
- [ ] rawValuesReported: false (confirmed by no raw output)
- [ ] physicalOperation: false (no StackChan activation)
- [ ] external_write: false (SafetyStrip chip)
- [ ] voice/camera/mic: inactive

---

## Shutdown Checks

- [ ] Electron process terminated (taskkill or Ctrl+C)
- [ ] port 3030 closed after shutdown
- [ ] Runtime not left running in background
- [ ] staged: 0 (unless evidence doc intentionally created)
- [ ] tracked_dirty: 0 (unless evidence doc intentionally created)

---

_Created: 2026-05-19_
_productionReady: false_
_execution: disabled_

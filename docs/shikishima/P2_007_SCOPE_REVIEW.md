# P2-007 Slot: P3-003 StackChan Face Glyphs — Scope Review

## Note on Slot ID

The workday task instruction book reserved this slot for P2-007 (Mobile safe-area padding).
P2-007 was resolved in UI-13 (commit c48675c). This slot therefore covers the next
unresolved item: **P3-003 StackChan face expression glyphs**.

---

## Selected Task

- **ID**: P3-003
- **Title**: StackChan face expression glyphs
- **Source doc**: `docs/shikishima/COMMAND_CENTER_DESIGN_CONFORMANCE_AUDIT.md` (P3-003)
- **Source spec**: Design audit — ASCII art face expressions per decision state

---

## Current Behavior

`StackChanPage.tsx` shows:
- Connection status badge (connected/not_arrived/etc.)
- HOLD notice
- `status.faceState` as raw text (when present)
- Safety invariant rows (physicalOperation/voiceActive/cameraActive/micActive)
- Copy button

No visual face glyph is displayed.

---

## Expected ClaudeDesign Behavior

When `status.faceState` matches a known decision state, display a corresponding
ASCII art face expression alongside the text label.

Design spec face map:
```
HOLD:      (･_･;)
GO_READY:  (･ω･)
PASS:      (´ᴗ`)
STOP:      (！_！)
REJECT:    (×_×)
```

Unknown / unmatched faceState: show text only (no glyph).

---

## Implementation Goal

Add `FACE_GLYPH` lookup to `StackChanPage.tsx`. In the existing face state section,
render the glyph in large monospace font above the state label text when a match exists.

---

## Non-scope

- No new component file
- No change to StackChanStatusData type
- No change to connection status display
- No change to safety invariant rows
- No change to HOLD notice
- No new IPC handler
- No runtime behavior

---

## Safety Risks

None. This is a pure visual addition (text rendering). No safety invariants affected.

---

## STOP Conditions

- Any required change to `package.json` or `package-lock.json`
- Any required change outside `StackChanPage.tsx`
- TypeScript error introduced
- Vitest failure introduced

---

## Human Visual Confirmation Required Before Implementation?

No. Glyph display is purely visual and does not affect safety or logic.
Typecheck confirms type safety. Visual verification happens on user return.

---

## Implementation Can Auto-Proceed?

Yes. All auto-proceed conditions are met:
- Unambiguous scope
- 1 allowed file
- No package/dependency change
- No runtime needed
- No external write risk
- No safety ambiguity
- UI-only

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_

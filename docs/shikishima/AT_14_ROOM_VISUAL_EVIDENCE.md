# AT-14 Room Visual Evidence

**date:** 2026-05-20
**worker:** ClaudeCode + human visual confirmation required
**status:** CODE_VERIFIED — human visual confirmation pending

---

## Purpose

Verify that Agent Theater / Pixel Room displays correctly and that all safety
labels remain visible during app operation.

---

## Code-Level Verification (ClaudeCode)

The following safety invariants were verified by code inspection.

### PixelRoomSafetyHud (top of Agent Theater)

Always renders these boxes (hardcoded, no runtime toggle):

| Box | Value | Color |
|---|---|---|
| 管制ステータス | decision (HOLD default) | orange/red |
| execution | 実行無効 / disabled | red |
| productionReady | false | red |
| raw values | hidden | gray-blue |
| 現在の状態 | ただいま待機中... | gray-blue |

Source: `PixelRoomSafetyHud.tsx` lines 34-39

### PixelRoomStage safety invariants strip (bottom)

Always renders these chips (hardcoded):

| Key | Value | Color |
|---|---|---|
| execution | disabled | red |
| productionReady | false | red |
| Gate | HOLD | amber |
| ext.write | blocked | red |
| Level 5 | human GO | gray |

Source: `PixelRoomStage.tsx` lines 281-304

### SafetyStrip (app-wide top bar, Layout.tsx)

Always renders (never hideable):

| Chip | Value |
|---|---|
| execution | disabled (type-enforced `"disabled"`) |
| productionReady | false (type-enforced `false`) |
| external_write | false |
| rawValues | hidden |
| runtime | stopped |
| stackchan | HOLD |

Source: `SafetyStrip.tsx` lines 187-196
Type enforcement: `SafetyStripProps.productionReady: false` and `.execution: "disabled"` are literal types — no runtime can change these.

### Snapshot → display chain

```text
IPC getAppSnapshot()
  → parseControlCenterShellSnapshot() [validate schema]
  → snapshotToSafeSummary() [redact raw values, apply stale logic]
  → toSafetyStripData() [hardcode productionReady:false, execution:"disabled"]
  → SafetyStrip props [type-checked, no override possible]
```

STALE fallback: if snapshot is stale, decision is forced to `"HOLD"` before display.

### Agent Theater components

All these are display-only (no send/execute buttons):
- `PixelRoomStage` — Pixel Room visual
- `GateDashboardPanel` — gate status cards
- `WorkerStatusPanel` — worker routing
- `ResumeQueuePanel` — resume queue
- `RunawayGuardPanel` — runaway guard display

---

## Human Visual Confirmation Required

The following require human observation during the runtime window.

When the app is open, confirm:

- [ ] Agent Theater tab visible and accessible
- [ ] Pixel Room renders (しきしま/しずめ/はじめ/つむぎ/しるべ visible)
- [ ] PixelRoomSafetyHud shows execution:disabled, productionReady:false
- [ ] Safety invariants strip visible at bottom of Pixel Room
- [ ] SafetyStrip (top of screen) visible and shows HOLD
- [ ] GateDashboard panel visible
- [ ] WorkerStatus panel visible
- [ ] No raw IP / raw token / secret / local-only path visible anywhere
- [ ] No execution buttons visible
- [ ] No push/send/OAuth buttons visible

---

## Runtime State at Time of Code Verification

```yaml
app_running:     true  # npm run dev launched earlier in this session
port:            5174  # port 5173 was in use
decision:        HOLD  # default state
commits_ahead:   13
```

---

## Pass Condition

```yaml
code_verification:  PASS
human_visual:       PENDING (human must confirm checklist above)
```

---

## Safety

```yaml
productionReady:   false
execution:         disabled
rawValuesReported: false
runtime_window:    npm run dev (dev mode, display review only)
git_push:          not performed
```

# Voice / Camera / Mic — HOLD Notice

## Status: ALL HOLD

**Voice, camera, and microphone activation are NOT approved.**

---

## Current State in Code

```typescript
interface StackChanStatusData {
  readonly voiceActive: false;   // TypeScript literal
  readonly cameraActive: false;  // TypeScript literal
  readonly micActive: false;     // TypeScript literal
}
```

```typescript
// ui-safety-types.ts
export type LockedSetting = ... | "voiceCameraMic";
export const ALL_LOCKED_SETTINGS = [..., "voiceCameraMic"] as const;
```

Voice/camera/mic appear in the `LOCKED_SETTINGS` list in the UI.
They cannot be enabled from the Settings page.

---

## Why Each Is HOLD

### Voice Output

- No voice content policy defined
- No safeguard against reading out raw values aloud
- No volume control boundary defined
- Privacy implications in shared spaces unreviewed

### Camera Input

- No privacy policy defined
- No image retention policy defined
- No background capture prevention verified
- Camera access could expose environment details

### Microphone Input

- No privacy policy defined
- No recording storage policy defined
- No background recording prevention verified
- Could capture sensitive audio without user awareness

---

## Path to Approval

Each requires a dedicated Gate:
- `GATE-VOICE-01` — voice output Gate
- `GATE-CAM-01` — camera input Gate
- `GATE-MIC-01` — microphone input Gate

Each Gate requires:
- Separate human review
- Privacy policy
- Separate explicit human GO

---

## In the UI

The CommandSettingsPage shows `voice / camera / mic の有効化` in the locked
capabilities section. It is:
- Non-interactive (pointer-events: none effectively)
- cursor: not-allowed
- opacity: 0.65
- aria-disabled: true
- Lock icon with tooltip: "この設定はClaudeCodeのGOが必要です"

---

_Created: 2026-05-17_
_voiceActive: false_
_cameraActive: false_
_micActive: false_
_productionReady: false_

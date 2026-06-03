# StackChan Embodiment Interface Specification

Date: 2026-05-28

---

## Principle

StackChan は **Shikishima Safety Governor の判定後** にのみ出力を受け取る。  
単独自律は禁止。身体化（embodiment）のみ。

---

## Output Intent (design type)

```typescript
type StackChanOutputIntent = {
  state: "READY" | "HOLD" | "NEEDS_HUMAN" | "PASS" | "STOP";
  face?: string;           // mapped preset only
  voicePhraseId?: string;  // allowlist only, no free text from user
  motionPreset?: string;   // allowlist only
  emotion?: string;
  urgency: "low" | "medium" | "high";
  safetyStatus: "nominal" | "degraded" | "blocked";
  requiresHumanResponse: boolean;
};
```

## Example

```text
state: NEEDS_HUMAN
face: thinking (via face_mode map)
voicePhraseId: pilot_ack
motionPreset: listen_ready
urgency: medium
```

---

## Inbound (device → shikishima)

```text
touch_event
button_event
manual_voice_trigger
wake_event
device_status (redacted)
```

常時 mic/camera: **separate gate** — not part of embodiment v0.

---

## Implementation map (current)

| Channel | Guarded entry |
|---------|----------------|
| Display | `sendStackChanDisplayOnce` |
| Motion | `sendStackChanMotionOnce` |
| Voice | `sendStackChanVoiceOnce` |

**Do not** wire UI/autonomy zone to `stackchanSayLocal` / `stackchanDanceLocal` directly.

---

## Model Trace

StackChan は trace を喋らない。Evidence / Electron にのみ記録。

See `SHIKISHIMA_FULL_AUTONOMOUS_OPERATION_DESIGN.md` §6.4.

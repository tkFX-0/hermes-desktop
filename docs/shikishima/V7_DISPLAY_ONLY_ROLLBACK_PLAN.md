# Shikishima v7 Display-Only Rollback Plan — v2.8.4

## Purpose

Rollback plan if v7 display-only connection encounters an incident.

- documentVersion: v2.8.4 / robotMotion: HOLD

---

## Rollback Triggers

| Trigger | Severity | Action |
|---|---|---|
| StackChan servo moves during display test | P0 | Disconnect; power off; report |
| StackChan emits audio | P0 | Disconnect; report |
| Any motion command sent | P0 | Disconnect; review code; report |
| Display API causes crash | P1 | Disconnect; debug display code |
| Expression not visible on LCD | P2 | Debug display command format |
| Connection drops unexpectedly | P2 | Investigate connection method |

---

## P0 Rollback Steps

1. Disconnect StackChan (USB pull or `wsl --shutdown` if Wi-Fi)
2. Power off StackChan
3. Report: "P0 incident. StackChan [motion/audio]. Disconnected."
4. Return to Level 6 (no device)
5. Do NOT reconnect without new hardware safety review and new G-14

---

## P1/P2 Rollback Steps

1. Disconnect StackChan
2. Debug display command in source code
3. Verify: expression API is display-only in firmware docs
4. Fix code if needed; commit fix
5. New G-14 confirmation may be needed if code changed significantly

---

## After Rollback

- G-14 remains in archive but may need re-confirmation
- robotMotion remains HOLD (not affected by rollback)
- Return to appropriate level based on severity

この範囲では問題を検出していません。

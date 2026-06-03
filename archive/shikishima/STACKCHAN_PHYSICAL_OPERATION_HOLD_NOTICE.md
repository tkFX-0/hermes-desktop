# StackChan Physical Operation — HOLD Notice

## Status: HOLD

**StackChan physical operation is NOT approved.**

---

## Current State in Code

```typescript
// service-contracts.ts
interface StackChanStatusData {
  readonly physicalOperation: false;  // TypeScript literal — always false
  readonly voiceActive: false;
  readonly cameraActive: false;
  readonly micActive: false;
}
```

This is a TypeScript literal type. The value cannot be `true` at compile time.
Changing this requires a separate code change with human review.

---

## What Physical Operation Means

StackChan physical operation includes:
- Servo motor control (head tilt, body motion)
- LED control
- Buzzer / speaker (if hardware-attached)
- Any USB/serial/Wi-Fi command that causes physical device movement

---

## Why Physical Operation is HOLD

1. No physical safety review conducted
2. No hardware test environment defined
3. No emergency stop mechanism defined
4. No connection protocol reviewed
5. Physical motion in unexpected state could cause damage
6. Connection protocol could expose LAN network if not secured

---

## Path to Physical Operation Approval

```
Required Gates (in order):
1. GATE-SC-DISP-01 — display-only Gate
2. GATE-SC-PHYS-01 — physical motion Gate
3. GATE-SC-CONN-01 — connection Gate

Each Gate requires:
- Separate human review
- Separate explicit human GO
- Safety review specific to that Gate
```

---

## In the UI

The StackChanPage and StackChanMobilePage display:
- `physicalOperation: false` — always shown
- `voiceActive: false` — always shown
- `cameraActive: false` — always shown
- `micActive: false` — always shown
- HOLD banner — always shown

These are display-only. No button enables physical operation.

---

_Created: 2026-05-17_
_physicalOperation: false_
_productionReady: false_

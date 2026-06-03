# Device and Sensor Gate Registry

## Status: ALL HOLD

No device or sensor capability is approved.
This registry records approval requirements only.

---

## StackChan — Display Only (Face Terminal)

```
Gate ID:    GATE-SC-DISP-01
Status:     HOLD
Capability: Display face states on StackChan screen (no physical motion)
Required evidence before Gate:
  - StackChan physical operation boundary confirmed in docs
  - Display-only protocol reviewed
  - No serial/USB/Wi-Fi connection required for display-only path
  - Human review of STACKCHAN_PHYSICAL_OPERATION_HOLD_NOTICE.md
  - Separate explicit human GO
Human approval: required
```

## StackChan — Physical Motion

```
Gate ID:    GATE-SC-PHYS-01
Status:     HOLD
Capability: StackChan servo / actuator motion
Required evidence before Gate:
  - GATE-SC-DISP-01 complete
  - Physical motion safety review
  - Hardware safety boundary defined
  - Emergency stop mechanism defined
  - Test environment defined (not production hardware first)
  - Human review
  - Separate explicit human GO
Human approval: required
Prerequisite: GATE-SC-DISP-01
```

## StackChan — Serial/USB/Wi-Fi Connection

```
Gate ID:    GATE-SC-CONN-01
Status:     HOLD
Capability: Serial/USB/Wi-Fi connection to physical StackChan device
Required evidence before Gate:
  - GATE-SC-PHYS-01 complete
  - Connection protocol reviewed
  - No unintended command injection via connection
  - Human review
  - Separate explicit human GO
Human approval: required
Prerequisite: GATE-SC-PHYS-01
```

## Voice Output

```
Gate ID:    GATE-VOICE-01
Status:     HOLD
Capability: Text-to-speech or audio output from agent
Required evidence before Gate:
  - Voice content policy defined
  - No raw value audible in output
  - Volume control mechanism defined
  - Human review
  - Separate explicit human GO
Human approval: required
```

## Microphone Input

```
Gate ID:    GATE-MIC-01
Status:     HOLD
Capability: Microphone capture for voice recognition or recording
Required evidence before Gate:
  - Privacy policy defined
  - Recording storage / retention policy defined
  - No background recording
  - Human review
  - Separate explicit human GO
Human approval: required
```

## Camera Input

```
Gate ID:    GATE-CAM-01
Status:     HOLD
Capability: Camera capture for video or image input
Required evidence before Gate:
  - Privacy policy defined
  - No background capture
  - Image storage / retention policy defined
  - Human review
  - Separate explicit human GO
Human approval: required
```

---

## Required Statement

None of the above capabilities are approved.
This document records approval requirements only.
productionReady: false / execution: disabled / all device/sensor: HOLD

---

_Created: 2026-05-17_

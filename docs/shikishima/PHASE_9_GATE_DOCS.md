# Phase 9 Gate Documentation

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** GATE_DEFINED — all gates HOLD

---

## Purpose

Document all future physical and sensory capability gates so no ambiguity remains
about what is and is not approved for Phase 9 / physical-device operation.

These gates are NOT required for 100% readiness.
They become relevant only when explicitly opened by future human GO.

---

## Gate Overview

| Gate ID | Description | Status | Unlock condition |
|---|---|---|---|
| SC-01 | StackChan physical connection | HOLD | explicit hardware GO |
| SC-02 | StackChan voice output | HOLD | SC-01 + voice policy GO |
| SC-03 | StackChan robot motion | HOLD | SC-01 + motion safety GO |
| MIC-01 | Microphone input | HOLD | audio policy GO |
| CAM-01 | Camera input | HOLD | video policy GO |
| DEV-01 | Physical device USB/serial | HOLD | hardware GO |
| DEV-02 | Network device scan/connect | HOLD | network policy GO |

---

## Gate Detail

### SC-01 — StackChan Physical Connection

```yaml
gate: SC-01
status: HOLD
description: >
  Physical StackChan device connection via USB or local network.
  Required before any robot voice, motion, or sensor features.
required_go_fields:
  - device_type
  - connection_method  # USB / serial / LAN
  - firmware_version
  - safety_check_plan
  - shutdown_plan
  - evidence_file
blocked_by: []
blocks: [SC-02, SC-03]
```

### SC-02 — StackChan Voice Output

```yaml
gate: SC-02
status: HOLD
description: >
  Text-to-speech output through StackChan speaker.
required_go_fields:
  - voice_engine
  - language
  - max_volume
  - off_switch_verified
  - content_policy  # no raw values spoken
blocked_by: [SC-01]
```

### SC-03 — StackChan Robot Motion

```yaml
gate: SC-03
status: HOLD
description: >
  Physical motor / servo movement commands.
  Highest physical risk gate — requires separate explicit GO.
required_go_fields:
  - motion_type
  - range_of_motion_mm
  - emergency_stop_method
  - human_in_loop_required
  - motion_log_required
blocked_by: [SC-01]
```

### MIC-01 — Microphone Input

```yaml
gate: MIC-01
status: HOLD
description: >
  Audio capture from host machine or device microphone.
required_go_fields:
  - audio_purpose  # voice command / ambient / recording
  - storage_policy  # ephemeral / persisted
  - privacy_boundary  # local only / no external send
  - on_off_indicator_required: true
blocked_by: []
```

### CAM-01 — Camera Input

```yaml
gate: CAM-01
status: HOLD
description: >
  Video / image capture from host machine or device camera.
required_go_fields:
  - camera_purpose
  - storage_policy
  - privacy_boundary
  - indicator_required: true  # physical or software indicator when active
blocked_by: []
```

### DEV-01 — Physical Device USB/Serial

```yaml
gate: DEV-01
status: HOLD
description: >
  USB, serial, or direct hardware connection to any physical device.
required_go_fields:
  - device_id
  - protocol
  - data_direction  # read / write / bidirectional
  - safety_isolation_method
blocked_by: []
```

### DEV-02 — Network Device Scan / Connect

```yaml
gate: DEV-02
status: HOLD
description: >
  LAN scan, mDNS discovery, or direct connection to network devices.
required_go_fields:
  - scan_scope  # subnet range
  - discovery_protocol
  - credential_handling
  - auto_connect_allowed: false  # default
blocked_by: []
```

---

## SafetyStrip Stackchan Chip

The SafetyStrip always shows `stackchan: HOLD` unless SC-01 is explicitly opened.

```tsx
// SafetyStrip.tsx
<SafetyChip k="stackchan" v={stackchanConnection ?? "HOLD"} tone="hold" />
```

Default value is `"HOLD"` — no accidental activation possible.

---

## Rule

```text
Phase 9 gates are future capability gates.
They are not prerequisites for the 100% readiness review.
Each gate requires its own explicit human GO before activation.
Opening one gate does not imply others are open.
```

---

## Safety

```yaml
productionReady:   false
execution:         disabled
rawValuesReported: false
sc01_connected:    false
sc02_voice:        false
sc03_motion:       false
mic_active:        false
camera_active:     false
```

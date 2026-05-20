# SC-PC-02 Firmware Write Evidence

date: 2026-05-20
result: PASS_CANDIDATE
device: StackChan / CoreS3
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the PC-side StackChan setup evidence reported by the
human operator.

It does not approve additional firmware writing.
It does not approve StackChan automatic control.
It does not approve physical motion automation.
It does not approve voice, microphone, or camera use.

---

## Confirmed Setup State

| Item | Status |
|---|---|
| iPhone StackChan use | completed |
| M5Burner launch | completed |
| Device Manager COM port | COM5 confirmed |
| M5Burner StackChan category | confirmed |
| firmware selected | StackChan-UserDemo |
| port | COM5 |
| baud rate | 1500000 |
| firmware write | completed |
| reboot | completed |
| screen visible | completed |
| iPhone reconnect | completed |
| COM5 still visible | completed |

---

## Evidence Fields

```text
firmware_write_completed: true
reboot_completed: true
screen_visible: true
iphone_reconnect: true
com5_still_visible: true
additional_burn_performed: false
erase_performed: false
firmware_exporter_start_performed: false
shikishima_auto_control: false
physical_motion_automation: false
voice_mic_camera_used: false
```

---

## Artifact / Photo Evidence

| Evidence | Status | Notes |
|---|---|---|
| device screen photo | not attached in repo | keep raw identifiers out of docs |
| iPhone connection screen photo | not attached in repo | use redacted evidence if later added |
| COM5 display evidence | reported by human | do not record raw device identifiers |

If photos are added later, they must not expose raw device IDs, tokens,
serial-like identifiers, local-only paths, or private network values.

---

## Safety Boundary

| Boundary | Status |
|---|---|
| additional burn | HOLD |
| erase | HOLD |
| Firmware Exporter Start | HOLD |
| custom firmware | HOLD |
| Shikishima auto-control | HOLD |
| physical motion automation | HOLD |
| voice / mic / camera | HOLD |
| productionReady | false |
| execution | disabled |
| rawValuesReported | false |

---

## Next Recommended Gate

```text
SC-FACE-01 official face capability check
```

SC-PC-02 can be treated as a setup PASS candidate after human review of this
evidence.


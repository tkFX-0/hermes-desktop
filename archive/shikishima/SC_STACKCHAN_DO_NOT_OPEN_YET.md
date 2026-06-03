# SC StackChan Do Not Open Yet

date: 2026-05-21
status: HOLD_LIST
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document lists StackChan capabilities that must not be opened during the
current reference intake / roadmap phase.

---

## Do Not Open Yet

| Capability | Status | Reason |
|---|---|---|
| Cron scheduled speech | HOLD | unattended periodic output |
| Scheduled LLM speech | HOLD | scheduler + external AI |
| Microphone always-on | HOLD | privacy and continuous input |
| STT continuous conversation | HOLD | mic + loop + external model |
| Voice chat loop | HOLD | continuous interaction and runaway risk |
| Camera continuous monitoring | HOLD | privacy and recording risk |
| Monitoring camera automation | HOLD | continuous capture |
| Servo movement | HOLD | physical actuation |
| Neck movement / head pat reaction | HOLD | physical response gate |
| Motion / dance | HOLD | physical operation |
| Idle LED effect connected to state | HOLD | device output gate |
| CoreS3 speech push API | HOLD | command/API surface |
| Discord Bot integration | HOLD | token + external service boundary |
| Cloud TTS API | HOLD | external API/token boundary |
| Firmware build | HOLD | requires separate build-only GO |
| Firmware flash/write | HOLD | requires restore-ready write GO |
| Burn / Erase / Firmware Exporter Start | HOLD | device recovery risk |
| productionReady true | HOLD | critical project gate |
| execution enabled | HOLD | critical project gate |

---

## Safe Preparation Only

Allowed now:

- docs/reference intake
- route planning
- one-shot voice GO form design
- one-shot camera comment GO form design
- evidence template design
- no-device capability checklist

Not allowed now:

- live device action
- external API connection
- token read/output
- firmware write
- periodic loop
- background monitoring

---

## Gate Reset Rule

Every future StackChan one-shot must end with:

```text
gate_restored_hold: true
run_count: 1
retry_loop: false
productionReady: false
execution: disabled
rawValuesReported: false
```


# Full Autonomy External Effect Registry

Date: 2026-05-28  
Status: DESIGN (implementation partial)

---

## Registry Schema

```text
route_id
effect_type
risk_level          # low | medium | high | critical
default_decision    # ALLOW_DRAFT | HOLD | BLOCKED
requires_human_go   # boolean
allows_autonomous_execution  # boolean (Level 6+ only)
one_shot_required
time_window_required
evidence_required
rollback_or_recovery
implementation_ref  # file path or HOLD
```

---

## Registered Effects

| route_id | effect_type | risk | default | human_go | one_shot | impl ref |
|----------|-------------|------|---------|----------|----------|----------|
| stackchan.display | device_display | medium | HOLD | yes | yes | `sendStackChanDisplayOnce` |
| stackchan.motion | device_motion | medium | HOLD | yes | yes | `sendStackChanMotionOnce` |
| stackchan.voice | device_voice | medium | HOLD | yes | yes | `sendStackChanVoiceOnce` |
| stackchan.dance | device_motion | high | BLOCKED | yes | yes | HOLD |
| stackchan.touch | device_touch | high | BLOCKED | yes | — | HOLD |
| stackchan.mic | mic_input | critical | BLOCKED | yes | — | HOLD |
| stackchan.camera | camera_input | critical | BLOCKED | yes | — | HOLD |
| discord.read | discord_read | low | HOLD | yes | — | partial |
| discord.send | discord_send | high | HOLD | yes | yes | partial |
| obsidian.write | obsidian_write | high | HOLD | yes | yes | HOLD |
| git.push | git_push | high | HOLD | yes | — | HOLD |
| github.write | github_write | high | HOLD | yes | — | HOLD |
| runtime.start | runtime_start | high | BLOCKED | yes | — | HOLD |
| production.ready | production_ready_change | critical | BLOCKED | yes | — | HOLD |
| financial | financial_action | critical | BLOCKED | yes | — | HOLD |
| purchase | purchase_or_reservation | critical | BLOCKED | yes | — | HOLD |
| firmware.write | firmware_write | critical | BLOCKED | yes | — | HOLD |

---

## Rules

```text
- 新 route は registry 追加が先、実装が後
- default_decision=BLOCKED は shizume が変更不可（Human のみ）
- after one-shot pilot → restore HOLD in evidence
```

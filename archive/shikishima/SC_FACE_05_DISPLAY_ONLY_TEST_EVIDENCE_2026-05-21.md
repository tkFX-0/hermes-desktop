# SC-FACE-05 Display-Only Face Test Evidence

**date:** 2026-05-21
**worker:** human (tk) — iPhone device operation
**authorized_by:** tk (SC-FACE-05 Option A Execution GO / time_window 02:45-03:15 JST)
**status:** PASS — Option A display-only test confirmed by tk

---

## Test Scope

```yaml
option:           A — iPhone AVATAR menu only
test_type:        display_only_face_test
asset_expression: normal
canvas:           320x240 (expected)
tool:             iPhone StackChan World app — AVATAR menu
firmware_write:   false
burn_erase:       false
motion_dance:     false
voice_mic_camera: false
```

---

## Confirmed Results

```text
sc_face_05_option_a_result:
  official_app_avatar_menu_found:   PASS
  expression_change_attempted:      PASS
  stackchan_display_changed:        PASS
  display_expression_observed:      向き変化・表情変化を人間操作で確認
  iphone_connection_preserved:      PASS
  device_screen_normal_after:       PASS
  firmware_write_triggered:         false
  motion_dance_triggered:           false
  voice_mic_camera_triggered:       false
  rollback_needed:                  false
  rollback_performed:               false
  overall_result:                   PASS
  notes:                            向きも変わるし、表情も人間が操作すれば変わることを確認
```

---

## Key Findings

```text
- iPhone AVATAR menu から表情変更: 動作確認
- iPhone AVATAR menu から向き変更: 動作確認
- firmware write 不要: Option A で十分
- Option B (PlatformIO build): 不要 — Shikishima 顔表示には Option A で対応可能
- SC-RESTORE-01 rollback: 不要 (テスト成功)
```

---

## Safety Audit

```yaml
firmware_write_performed:   false
burn_performed:             false
erase_performed:            false
firmware_exporter_start:    false
motion_dance_performed:     false
monitoring_camera_used:     false
voice_mic_camera_used:      false
shikishima_auto_control:    false
external_api_write:         false
raw_device_id_reported:     false
raw_secret_reported:        false
productionReady:            false
execution:                  disabled
rawValuesReported:          false
gate_restored_hold:         true
```

---

## Next Gate

```text
SC-FACE-05 Option A: PASS
Option B: 不要 (Option A で対応可能)

→ 次候補:
  Shikishima 顔アセット (Pixel Art) を 320x240 で作成
  iPhone AVATAR menu 経由で表示するための素材準備
  (SC-FACE-04 asset spec に基づく)
```

---

## この範囲では問題を検出していません。

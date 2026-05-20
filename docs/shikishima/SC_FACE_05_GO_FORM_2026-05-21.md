# SC-FACE-05 Display-Only Face Test GO Form

**date:** 2026-05-21
**status:** AWAITING HUMAN GO — fill all fields and return as GO message
**worker:** ClaudeCode / human (device操作は人間)
**based_on:** SC_FACE_04 / SC_RESTORE_01 / SC_FACE_05_DISPLAY_ONLY_TEST_GO_DRAFT.md

---

## Prerequisites (全て確認済み)

```yaml
SC-PC-02:      PASS_CANDIDATE (firmware write + iPhone reconnect + COM5 confirmed)
SC-FACE-01:    PARTIAL_HOLD (iPhone AVATAR menu confirmed, full face replacement requires PC side)
SC-FACE-03:    RESEARCH COMPLETE (PlatformIO build + m5stack-avatar + M5Burner restore confirmed)
SC-FACE-04:    SPEC (320x240 canvas, expression states defined)
SC-RESTORE-01: PLAN (M5Burner + G0 boot recovery documented)
```

---

## 2つのテスト経路 — どちらか1つを選択

### Option A — iPhone AVATAR menu (最安全 / 推奨)

```text
tool: iPhone official StackChan app → AVATAR メニュー
risk: 最低 (firmware write なし)
purpose: 公式アプリの表情変更範囲を確認する
limit: iPhone アプリ操作のみ / PC firmware 変更なし
note: SC-FACE-01 で AVATAR メニュー存在確認済み
```

### Option B — PlatformIO expression parameter change (firmware build + write)

```text
tool: PlatformIO (pio run + upload) + m5stack-avatar expression API
risk: 低〜中 (firmware 書き換えあり / SC-RESTORE-01 で rollback 可能)
purpose: コード上の expression 変更を CoreS3 ディスプレイで確認する
limit: 表示変更のみ / motion / camera / voice なし
note: SC-FACE-03 write GO が別途必要
```

---

## GO Form — copy, fill ALL fields, return as GO message

```text
gate_id: SC-FACE-05
date:                   2026-05-21
time_window:            [例: 02:00-02:30]
test_type:              display_only_face_test
option_selected:        A / B
asset_source:           [A: iPhone AVATAR menu / B: m5stack-avatar expression parameter]
asset_expression:       [例: neutral / smile / A: 公式プリセット確認]
canvas:                 320x240
tool:                   [A: iPhone StackChan app / B: PlatformIO + M5Burner]
firmware_or_app_path:   [A: StackChan iOS app / B: meganetaaan/stack-chan + pio upload]
target_device:          StackChan / CoreS3
port:                   [COM reference — confirm at test time]
baud_rate:              1500000 (reference)
expected_display:       [何が表示されることを期待するか]
rollback_plan:          SC-RESTORE-01 (M5Burner + G0 boot recovery)
stop_conditions:        (Erase要求 / Firmware Exporter Start / motion起動 / camera起動 / port不明 / device異常 / raw secret露出)
evidence_file:          docs/shikishima/SC_FACE_05_DISPLAY_EVIDENCE_2026-05-21.md
```

---

## Required Explicit Statements (全て false を確認)

```text
one_controlled_test_only:            true
motion_dance_allowed:                false
monitoring_camera_allowed:           false
voice_mic_camera_allowed:            false
shikishima_auto_control_allowed:     false
external_api_write_allowed:          false
raw_secret_reporting_allowed:        false
```

---

## STOP Conditions

```text
STOP if:
  - tool requests Erase
  - Firmware Exporter Start appears
  - unexpected firmware target
  - COM port unclear
  - display test triggers motion / dance
  - camera / mic / voice activates
  - rollback candidate not visible in M5Burner
  - device screen becomes abnormal
  - iPhone connection lost and unrestorable
  - raw device ID / serial / Wi-Fi / token would be exposed
```

---

## What this GO does NOT approve

```text
firmware_write_approved:        false (Option A のみ選択時)
additional_burn_approved:       false
erase_approved:                 false
firmware_exporter_start:        false
motion_dance_approved:          false
monitoring_camera_approved:     false
voice_mic_camera_approved:      false
custom_firmware_approved:       false
shikishima_auto_control:        false
productionReady:                false
execution:                      disabled
rawValuesReported:              false
```

---

## Recommended: Option A first

Option A (iPhone AVATAR menu) を先に試す。
これで十分な表情変更が確認できればOption B (firmware build) は不要。
Option A PASS → 必要なら Option B の追加 GO を検討。

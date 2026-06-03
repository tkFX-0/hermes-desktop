# SC-FACE-01 Official Face Change — Human Confirmation Form

**date:** 2026-05-20
**status:** AWAITING HUMAN CONFIRMATION — fill and return
**worker:** tk (human — iPhone app visual check)

---

## 確認手順

1. iPhone の StackChan 公式アプリを開く
2. 接続済みデバイス (CoreS3) を選択
3. 顔/表情メニューを探す
4. 各項目を確認して以下フォームに記入
5. raw値 (デバイスID / SSID / シリアル) は記入しない

---

## Confirmation Form — fill and return

```text
sc_face_01_result:
  official_app_face_menu:       PASS / FAIL
  preset_expression_change:     PASS / FAIL
  custom_image_upload:          PASS / FAIL
  screen_size_hint:             PASS / FAIL / UNKNOWN
  stackchan_display_changed:    PASS / FAIL
  iphone_connection_preserved:  PASS / FAIL
  com5_preserved:               PASS / FAIL
  custom_firmware_required:     YES / NO / UNKNOWN
  notes:                        (任意)
```

---

## 禁止 (確認中も変わらず)

```text
- firmware re-write
- erase
- Firmware Exporter Start
- custom firmware installation
- Shikishima face actual deployment (自動制御)
- physical motion control
- voice / mic / camera
- external API write
```

---

## 結果受け取り後にやること (ClaudeCode)

```text
1. SC_FACE_01 doc を PASS/FAIL で更新
2. 次ゲートを決定:
   - custom_image_upload PASS → SC-FACE-02 (320x240 asset spec) へ
   - custom_firmware_required YES → SC-FACE-03 (custom firmware) へ
3. commit: docs(sc-face-01): record official app face confirmation results
4. push GO を待つ
```

---

## Safety (変更なし)

```yaml
productionReady:   false
execution:         disabled
rawValuesReported: false
automatic_control: false
```

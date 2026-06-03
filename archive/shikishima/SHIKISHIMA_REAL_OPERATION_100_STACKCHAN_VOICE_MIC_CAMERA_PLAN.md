# しきしま実運用100% — StackChan / Voice / Mic / Camera Plan

**状態:** FUTURE / HOLD
**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## 現状

- StackChan: 物理デバイス未到着 / 接続未承認
- voice output: HOLD
- mic input: HOLD
- camera input: HOLD

Gate ダッシュボードで:
- `STACKCHAN-PHYSICAL: HOLD`
- `VOICE-CAMERA-MIC: HOLD`

---

## StackChan — display-only plan (Level 4、今すぐ可能)

- StackChan の顔・表情を display-only で UI に表示
- CSS/SVG によるアニメーション
- 物理デバイスへの接続なし
- こましき (StackChan agent) の表示役割定義

**現状:** `StackChanPage` コンポーネント実装済み (display-only)

---

## StackChan — 物理動作 gate (Level 5 + 物理)

```yaml
stackchan_physical_go:
  device_arrived: false          # デバイス到着確認
  device_tested_safely: false    # 物理安全テスト
  date:
  time_window:
  approved_motions:              # 承認するモーション (限定的に)
  emergency_stop_method:         # 緊急停止方法
  physical_safety_checklist:     # 物理安全チェック
  evidence_file:
```

**デバイス到着前は全ての物理操作 HOLD**

---

## Voice Output gate (Level 5)

```yaml
voice_output_go:
  date:
  time_window:
  voice_engine:                  # どの TTS エンジンを使用するか
  allowed_content_policy:        # 何を発話させるか (禁止内容明記)
  volume_policy:                 # 音量上限
  emergency_mute_method:
  privacy_policy:                # 発話内容のログ取り扱い
  evidence_file:
```

**個人情報・secret を発話させない**

---

## Mic Input gate (Level 5)

```yaml
mic_input_go:
  date:
  time_window:
  recording_scope:               # 何を録音するか (限定的に)
  recording_storage_policy:      # どこに保存するか
  cloud_upload_policy:           # cloud 送信しない場合は false
  privacy_policy:                # プライバシー保護方針
  emergency_stop_method:
  evidence_file:
```

**録音データは raw ファイルとして git に含めない**

---

## Camera Input gate (Level 5)

```yaml
camera_input_go:
  date:
  time_window:
  camera_scope:                  # 何を撮影するか
  recording_storage_policy:
  cloud_upload_policy:           # cloud 送信しない場合は false
  privacy_policy:
  emergency_stop_method:
  evidence_file:
```

---

## 緊急停止ポリシー (共通)

```
音声/カメラ/マイクを停止する手順:
1. アプリを Ctrl+C で停止
2. OS レベルでデバイス無効化 (必要時)
3. StackChan 物理電源 OFF (必要時)
4. git status 確認
```

---

## Privacy Policy (共通)

```
音声録音を git commit に含めない
カメラ映像を外部送信しない (別途承認なしに)
録音/映像に含まれる個人情報を docs/chat に出力しない
```

> 物理デバイス到着前、voice/mic/camera の実運用承認前は全 HOLD。

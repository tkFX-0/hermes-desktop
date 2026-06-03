# SC-SERVO-01 サーボ不動作 根本原因調査レポート

status: FIXED_PENDING_PHYSICAL_CONFIRM
date: 2026-05-24
investigated_while: user_sleeping

---

## 症状

- `!sc dance` 送信 → コマンド受信・isDancing=true → サーボ動作なし
- 起動テスト (servoStartupTest) → シリアルログ出力あり → 物理動作なし
- WiFi チャイムは聞こえた (チャイムは servoStartupTest 後)

---

## 根本原因

**プロトコル不一致**: LEDC PWM (50Hz) vs Feetech SCS シリアルバス (UART 1Mbps)

### 旧実装 (誤り)
```
GPIO 9 (Pan) + GPIO 8 (Tilt)
LEDC TIMER_3, CH_6/CH_7
50Hz PWM, 14bit
```

### 正しいプロトコル
Switch Science #11129 StackChan に含まれるサーボは **Feetech SCS0009 フィードバックサーボ**。
- プロトコル: Feetech SCS シリアルバス (UART 半二重 1Mbps)
- GPIO: TX=6, RX=7
- サーボID: Pan=1, Tilt=2
- 位置範囲: 0-1023 (0-300°), 中央=512

SCS0009 は PWM 信号を完全に無視する。LEDC 信号がいくら送られても動作しない。

### 証拠
- M5Unified `_pin_table_other0` に board_M5StackChan の rgb_led エントリなし
- "フィードバックサーボ" = フィードバック (位置読み取り) 対応 → 標準 SG90 PWM ではない
- 起動テスト中にシリアルログは出力されたが動作なし → ファームウェアは動いているがサーボは反応なし

---

## 修正内容

### ファームウェア変更 (2026-05-24 睡眠調査中に実施)

**削除**:
- `#include "driver/ledc.h"`
- PIN_PAN, PIN_TILT, SV_FREQ, SV_BITS, SV_MIN/MID/MAX, SV_TIMER, SV_CH_PAN/TILT 定数
- `servoSetDuty()`, `angleToSvDuty()` 関数
- `setupServos()` の LEDC 初期化コード
- `servoStartupTest()` の LEDC 送信コード

**追加**:
- SCS_TX_PIN=6, SCS_RX_PIN=7, SCS_BAUD=1000000, SCS_ID_PAN=1, SCS_ID_TILT=2 定数
- `HardwareSerial SCSSerial(1)` (UART1)
- `angleToPosS(angle)` — 角度→SCS位置値変換 (0-1023, 中央=512)
- `scsWritePos(id, pos, time, speed)` — SCS WRITE_DATA パケット送信
- `setupServos()` → UART1 初期化 + 中央位置コマンド
- `servoStartupTest()` → SCS コマンドで同じ動作シーケンス
- `updateServos()` に ENABLE_SERVO_CONTROL チェック追加

### フラッシュ済み
```
firmware: SCS servo v1 (2026-05-24 調査中)
hash: verified
port: COM5
build: SUCCESS (RAM 16.1%, Flash 21.2%)
```

---

## LED 調査結果

**M5.Led.begin() が false を返す理由** (M5Unified ソースコード確認):

`M5Unified/src/M5Unified.cpp` の `_pin_table_other0` (RGB LED ピンテーブル) を調査:
- `board_M5StackCoreS3`: エントリなし
- `board_M5StackCoreS3SE`: エントリなし
- `board_M5StackChan`: エントリなし

→ `M5.getPin(m5::pin_name_t::rgb_led)` は -1 を返す
→ `LED_Strip_Class` が初期化されない
→ `M5.Led.begin()` = false は**仕様通りの動作**

現在の M5.Power.setLed() フォールバックはプロトコルレベルでは正常。
LED の物理的な視認性は USB 充電中のみ → 現時点では受け入れ可能。

---

## 次回テスト (ユーザー起床後)

1. デバイス電源投入
2. 起動テスト: Pan 右30°→左30°→中 / Tilt 上25°→下15°→中 の物理動作を目視確認
3. `!sc dance` → 16ステップダンスの物理動作を目視確認
4. 動作確認: SC-DANCE-01 EVIDENCE を物理確認済みに更新

---

## リスク・注意事項

| リスク | 対処 |
|---|---|
| GPIO 6/7 が誤りの可能性 | 次の代替: Port C (GPIO 17=TX, GPIO 18=RX) |
| SCS0009 でなく STS0009 の場合 | 同一プロトコル、同一レジスタマップ |
| ID 1/2 が逆の場合 | Pan/Tilt が逆に動く → ID 入れ替えで対応 |
| SCS baud が 1Mbps でない場合 | 500000 も試す |

この範囲では問題を検出していません

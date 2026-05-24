# SC-EVENT-00: PC側タッチ・ダンス・カメライベント受信サーバー設計

> 作成日: 2026-05-23 | 担当: Claude Code | rawValuesReported: false

---

## 1. 問題の特定

### SC-MOTION-00 / SC-TOUCH-00 調査結果

| 項目 | 調査結果 |
|---|---|
| サーボ制御 | ✅ `shikishima_cores3.ino` v5 に完全実装 (LEDC, pan/tilt, easing, sequences) |
| ダンス | ✅ `SEQ_DANCE` (16ステップ) + `startDance()` + `updateDance()` 実装済み |
| 3ゾーンタッチ | ✅ A(左)/B(中)/C(右) + 顔エリアタッチ 実装済み |
| IMU撫で検出 | ✅ 加速度センサー、1秒以内3回で `triggerHeadPat()` 発火 |
| 撫でアニメ | ✅ 5モード (nod/shake/tilt/smile/flee) + サーボシーケンス同時再生 |
| ハード故障 | 可能性低 — ファームウェアに実装あり |

### 本当の問題

```
ファームウェア (shikishima_cores3.ino):
  sendPatEvent(mode) →
    POST http://<PC_HOST>:8765/event
    Body: {"type":"pat","mode":"nod"}

PC側 (stackchan-stt-service.ts):
  handleAudioRequest() →
    if (req.url !== "/audio") → 404 返却
    ↑ /event と /camera はここで詰まる
```

**パットイベントが PC に届いているが 404 で無音廃棄されている。**

---

## 2. ファームウェアが送信するイベント一覧

| エンドポイント | メソッド | ボディ | トリガー |
|---|---|---|---|
| `/event` | POST | `{"type":"pat","mode":"nod\|shake\|tilt\|smile\|flee"}` | IMU 3回加速度検出 |
| `/camera` | POST | binary JPEG | B または C ボタン長押し (カメラモード中) |
| `/audio` | POST | binary PCM 16kHz 16bit mono | (将来: マイク実装後) |

### ファームウェアのモード定義 (PAT_VOICE)

```c
static const char* PAT_VOICE[] = {
  "nod",    // 0: うなずき
  "shake",  // 1: 首振り照れ
  "tilt",   // 2: 首かしげ甘え
  "smile",  // 3: 笑顔引きつき
  "flee",   // 4: 逃げる
};
```

---

## 3. PC側の対応マッピング

### パットモード → stackchanPetMode() マッピング

| firmwareモード | 説明 | PC stackchanPetMode |
|---|---|---|
| nod | うなずき | 1 (happy + nod) |
| shake | 首振り照れ | 2 (shy + head_shake) |
| tilt | 首かしげ甘え | 3 (sweet + tilt) |
| smile | 笑顔引きつき | 1 (similar to nod) |
| flee | 逃げる | 2 (similar to shake) |

### カメライベント処理

- 受信した JPEG を `%APPDATA%/hermes-desktop/captures/` に保存
- UI への通知 (IPC) は将来対応 (HOLD)

---

## 4. 実装設計

### 4.1 アーキテクチャ

```
StackChan (<STACKCHAN_HOST>)
  ↓ POST :8765/event
  ↓ POST :8765/camera
  ↓ POST :8765/audio

PC (<PC_HOST>:8765)
  stackchan-stt-service.ts
    handleRequest() [変更]
      /audio   → runWhisper() → _onTranscript()  (既存)
      /event   → handleEventRequest()             [新規]
      /camera  → handleCameraRequest()            [新規]
      other    → 404
```

### 4.2 コールバック設計

```typescript
// startSttServer() に追加するオプション
export interface SttServerCallbacks {
  onTranscript: (text: string) => Promise<void>;
  onPatEvent?: (mode: PatEventMode) => Promise<void>;  // 新規
  onCameraCapture?: (jpeg: Buffer) => Promise<void>;   // 新規
}

export type PatEventMode = "nod" | "shake" | "tilt" | "smile" | "flee";
```

### 4.3 パットモード → PC 反応フロー

```
POST /event {"type":"pat","mode":"nod"}
  ↓
handleEventRequest()
  ↓
_onPatEvent(mode)  // コールバック
  ↓
stackchanPetMode(pcMode)  // 音声再生 + 表情変更
onPatEvent(mode)          // 関係性データ記録
```

---

## 5. 実装手順

### Step 1: `stackchan-stt-service.ts` 修正

1. `handleAudioRequest()` → `handleRequest()` にリネーム
2. `/event` ルートを追加
3. `/camera` ルートを追加
4. `startSttServer()` のシグネチャを `SttServerCallbacks` に変更
5. `SttServiceState` に `lastPatMode`, `lastCaptureAt` 追加

### Step 2: `stackchan-local-service.ts` 統合確認

- `stackchanPetMode(1|2|3)` は実装済み → そのまま使用
- 上位から呼ぶコールバックを登録するだけ

### Step 3: `stackchan-local-service.ts` の `checkStackchanLocalStatus()` 修正確認

- 現在 `{ type: "motion", name: "center" }` を送信しているが、ファームウェアは `type: "motion"` を未処理 (no-op)
- 実質影響なし → 修正不要

### Step 4: 動作確認手順 (帰宅後)

```
1. hermes-desktop 起動
2. StackChan 起動・WiFi 接続
3. StackChan を手で揺らす (3回以上、1秒以内)
4. PC 側で "ふふ、嬉しい" などの音声が出れば成功
5. B ボタン 1.5秒長押し → ダンス開始確認
```

---

## 6. 影響範囲

| ファイル | 変更種別 | 内容 |
|---|---|---|
| `src/main/stackchan-stt-service.ts` | 修正 | `/event`, `/camera` ルート追加 |
| `src/main/stackchan-local-service.ts` | 確認のみ | 変更不要 |
| `docs/shikishima/SC_EVENT_00_...` | 新規 | このファイル |

---

## 7. Safety Boundary

- `StackChan_physical_operation: false` は変わらない (PC → デバイスの送信は既存範囲)
- 今回追加するのは **受信のみ** (デバイス → PC の HTTP 受け取り)
- 新しいネットワーク外向き通信なし

---

*rawValuesReported: false | gate: HOLD維持*

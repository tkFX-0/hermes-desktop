# Shikishima StackChan 完全設計書 v1.0
> 作成: 2026-05-23

---

## 1. 概要・コンセプト

StackChan は「しきしまの身体」。AI が応答するとき、物理的な存在として部屋にいる。
単なるガジェットではなく、**感情を持って動く AI のアバター**として設計する。

```
Discord/PC
  ↕ (Discord bot / WebSocket)
しきしまエージェント (bot)
  ↕ (VOICEVOX TTS + WebSocket ws:8080)
StackChan CoreS3
  ├─ 表示 (LCD 320×240)
  ├─ 音声 (Speaker + Mic)
  ├─ 首サーボ (Pan G9 / Tilt G8)
  ├─ タッチ
  ├─ IMU (加速度センサー)
  ├─ BLE (スマホ直接制御)
  └─ WiFi (WebSocket + OTA)
```

---

## 2. 機能一覧と実装分類

| # | 機能 | レイヤー | 状態 |
|---|---|---|---|
| F1 | 感情完全同期 | Bot + Firmware | 一部実装 → 拡張 |
| F2 | 環境アウェアネス | Bot | 未実装 |
| F3 | アイドル生命感 | Firmware | 実装済 (要フラッシュ) |
| F4 | OTA リモート更新 | Firmware | 実装済 (要フラッシュ) |
| F5 | 発話身体完全同期 | Bot + Firmware | 一部実装 → 拡張 |
| F6 | 関係値蓄積 | Bot + Firmware | 未実装 |
| F7 | 音楽反応 | Bot + Firmware | 未実装 |
| F8 | バッテリー表示 | Firmware | 未実装 |
| F9 | 発話タイミング同期 | Bot | 未実装 |
| F10 | 複数エージェント身体表現 | Bot | 一部実装 → 拡張 |

---

## 3. 詳細仕様

### F1: 感情完全同期システム

**目的**: テキストの感情に応じてサーボ・顔・音声が連動する

**感情マップ**:
```
happy    → nod(うなずき) + 笑顔
agree    → nod(うなずき) + ノーマル
sad      → look_down(うつむき) + 悲しい顔
thinking → look_up(上向き) + 考え中顔
surprised→ shake(首振り) + 驚き顔
excited  → spin(スピン) + 笑顔
ganbaru  → forward-tilt + 頑張るぞ顔
question → head_tilt(首かしげ) + ノーマル
```

**タイミング仕様**:
```
[モーション開始]
    ↓ 300ms
[顔変更]
    ↓ 50ms
[speaking状態送信]
[字幕送信]
    ↓ 80ms
[PCMチャンク送信]
    ↓ (発話終了)
[idle状態送信]
[idle顔に戻る]
    ↓ 500ms
[センターに戻るモーション]
```

**エージェント別モーションスタイル**:
```
しきしま: 落ち着いた動き、小さめ角度 (±20°)
しずめ:   ゆっくり・慎重 (±15°, speed 0.7x)
つむぎ:   元気・大きめ (±35°)
はじめ:   テキパキ・短め (±25°, speed 1.3x)
しるべ:   研究者風・首かしげ多め
```

**Bot 実装ファイル**: `scripts/shikishima-stackchan.mjs`

---

### F2: 環境アウェアネス

**目的**: ユーザーの状態・時間帯・部屋の状況を感知して振る舞いを変える

#### F2-A: 時間帯適応
```
05:00-09:00  朝: おはよう + うなずき + 少し眠そう
09:00-12:00  午前: アクティブ、テキパキ動く
12:00-13:00  昼: 少しゆっくり
13:00-18:00  午後: 標準
18:00-21:00  夕方: お疲れモード
21:00-24:00  夜: ゆったり、声量下げる
00:00-05:00  深夜: 最小動作、小声
```

#### F2-B: ユーザー在席検出
- 方法: Discord メッセージの最終受信時刻を監視
- 在席判定: 直近30分以内にメッセージあり
- 離席検出: 30分以上メッセージなし → アイドルモード強化
- 帰着検出: 離席後の最初のメッセージ → 「おかえりなさい」モーション

#### F2-C: 長時間放置「かまって」アクション
- トリガー: 2時間以上 Discord メッセージなし
- アクション: StackChan が自発的に Discord に短いメッセージ送信
  - 例: 「寂しいです...」「何かしてほしいことありますか？」
- 頻度制限: 1日1回まで

**Bot 実装ファイル**: `scripts/shikishima-stackchan.mjs` + `scripts/shikishima-bot.mjs`

---

### F5: 発話身体完全同期

**目的**: テキストの内容に合わせてより細かく身体が動く

#### 文節同期
```
句点「。」  → センターに小さく戻る
読点「、」  → 少し首かしげ
疑問「？」  → head_tilt モーション
感嘆「！」  → 少し前傾き + 顔強調
長文(>50文字) → 途中で小さなうなずき挿入
```

#### 発話速度×動作速度
- VOICEVOX speed × 0.8 = サーボ追従速度係数
- 早口 → キビキビした動き
- ゆっくり → なめらかな動き

**実装**: `scripts/shikishima-stackchan.mjs` の `stackchanSay()` 内に文字列解析追加

---

### F6: 関係値蓄積システム (なかよし度)

**目的**: 撫でた回数・会話数が積み重なりスタックチャンが「懐く」

#### データ構造
```json
{
  "patCount": 0,
  "talkCount": 0,
  "totalTalkMs": 0,
  "lastPatAt": null,
  "lastTalkAt": null,
  "familiarity": 0,
  "milestones": []
}
```

#### なかよし度計算
```
familiarity = min(100, patCount * 2 + talkCount * 0.5 + totalTalkDays * 3)
```

#### レベル定義
```
Lv0  0-9:   初対面 (よそよそしい)
Lv1 10-24:  顔見知り (少し慣れてきた)
Lv2 25-49:  なかよし (懐いてきた)
Lv3 50-74:  親友 (甘えてくる)
Lv4 75-99:  大親友 (もう離れたくない)
Lv5 100:    永遠の友 (特別なアニメーション解放)
```

#### マイルストーンリアクション
```
pat  10回:  特別うれしいアニメーション
pat  50回:  ダンス発動
talk 100回: 「いつもありがとう」発話
lv変化:    Discord通知 + 特別モーション
```

#### 久しぶり検出
- 最終会話から24h以上 → 「久しぶりだね！」
- 最終会話から72h以上 → 「会いたかった...」+ 特別な表情

**実装ファイル**: `scripts/shikishima-relationship.mjs` (新規)
**データ保存**: `.shikishima-memory/relationship.json`

---

### F7: 音楽反応

**目的**: BGM のリズムに合わせてダンス

#### 実装方式 (シンプル版)
- Discord コマンド `!music [BPM]` でダンスモード開始
- BPM 未指定時: デフォルト 120BPM
- ダンスフレームのタイミングを BPM から計算
  - 120BPM → 500ms/beat → ダンスフレーム間隔 250ms
- `!music stop` でダンス終了

#### 将来拡張 (フル版)
- PC マイクから音声取得 → FFT → BPM 推定 → リアルタイムダンス

**実装ファイル**: `scripts/shikishima-stackchan.mjs` + bot コマンド

---

### F8: バッテリー表示

**目的**: CoreS3 の残バッテリーを顔に表示

#### 実装 (Firmware)
```cpp
// AXP2101 からバッテリーレベル取得
int getBattery() {
  return M5.Power.getBatteryLevel(); // 0-100%
}

// 画面右上にバッテリーアイコン描画
void drawBatteryIcon(int level) {
  // level: 0-100
  // 80以上: 緑, 20-79: 黄, 19以下: 赤 + 警告
}
```

#### WebSocket 通知
- 20% 以下で PC に HTTP POST `/battery_low` 通知
- Bot が Discord に「バッテリー残量が少ないです」送信

**実装**: Firmware + `shikishima-stt.mjs` の `/battery_low` エンドポイント追加

---

### F9: 発話タイミング完全同期 (強化版)

**現状の問題**:
- PCMを送り続けている間、サーボは動かない
- 発話長に関わらず同じ動作

**改善仕様**:
```
短文 (<15文字): モーション1回 + 静止
中文 (15-40文字): 開始モーション + 途中うなずき1回
長文 (>40文字): 開始モーション + 2秒ごとに小うなずき + 終了モーション
疑問文: 発話途中で head_tilt
```

#### 実装方法
- `stackchanSay()` にテキスト長・内容解析を追加
- 並行して定期的にサーボコマンドを送信
- PCM送信と非同期で動作

---

### F10: 複数エージェント身体表現 (完全版)

**各エージェントの身体特性**:

```
しきしま (メイン):
  - 角度: ±25° / tilt ±20°
  - 速度: 標準
  - 癖: 返答前に軽くうなずく

しずめ (抑制系):
  - 角度: ±15° / tilt ±10° (小さめ)
  - 速度: 0.7x (ゆっくり)
  - 癖: 考え中は左上を見る

つむぎ (コード系):
  - 角度: ±30° / tilt ±25° (大きめ)
  - 速度: 1.2x (テキパキ)
  - 癖: 完了時に小ダンス

はじめ (FX系):
  - 角度: ±20° / tilt ±15°
  - 速度: 1.0x
  - 癖: 数字を言うとき下を向く

しるべ (リサーチ系):
  - 角度: ±35° / tilt ±30° (大きく見回す)
  - 速度: 0.9x
  - 癖: 頻繁に首かしげ
```

**実装**: `scripts/shikishima-stackchan.mjs` の `AGENT_MOTION_PROFILE` 拡張

---

## 4. 実装フェーズ

### Phase 1 (今すぐ・ソフトウェアのみ)
- [x] F1 感情→モーション基本マッピング
- [ ] F2 環境アウェアネス (時間帯 + 在席検出 + かまって)
- [ ] F5 発話身体同期強化 (文節解析)
- [ ] F6 関係値蓄積 (shikishima-relationship.mjs)
- [ ] F7 音楽反応コマンド
- [ ] F9 発話タイミング同期
- [ ] F10 エージェント身体特性

### Phase 2 (帰宅後フラッシュ)
- [x] F3 アイドル微小動作
- [x] F4 OTA
- [ ] F8 バッテリー表示 (Firmware)
- [ ] F6 なかよし度 Firmware 表示

---

## 5. WebSocket プロトコル仕様 (拡張版)

```json
// サーボモーション
{"type":"move","action":"spin|nod|shake|look_around|look_left|look_right|look_up|look_down|head_tilt|forward_tilt|center"}

// サーボ角度指定
{"type":"servo","pan":-90~90,"tilt":-30~40}

// ダンス
{"type":"dance"}

// 顔変更
{"type":"face_mode","value":"normal|happy|smile|sad|thinking|surprised|ganbaru|tongue|sleepy"}

// 発話状態
{"type":"state","value":"speaking|idle"}

// 字幕
{"type":"subtitle","text":"最大28文字"}

// バッテリー通知 (Firmware→PC方向は HTTP POST /battery_low)
```

---

## 6. ファイル構成

```
scripts/
  shikishima-stackchan.mjs      既存・拡張
  shikishima-relationship.mjs   新規 (F6)
  shikishima-bot.mjs            既存・コマンド追加

docs/firmware/shikishima_cores3/
  shikishima_cores3.ino         既存・拡張
```

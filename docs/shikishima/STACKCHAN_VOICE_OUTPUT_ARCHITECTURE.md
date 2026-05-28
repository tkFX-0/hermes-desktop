# StackChan Voice Output Architecture

Date: 2026-05-28  
Status: CLARIFIED (operator alignment)

---

## 結論（差し直し）

```text
StackChan の「声」は Hermes 本体が音声ファイルを生成して送るのではない。

正しいモデル:
  しきしま（判断）→ 許可された phraseId / intent
  → PC 上 VOICEVOX（localhost）で合成
  → StackChan へ WebSocket 直送（face + state + PCM）
  → StackChan が口・スピーカーで出力

＝「身体に直接喋らせる」。Hermes Worker 経由の TTS パイプラインではない。
```

---

## 経路の比較

| 経路 | 説明 | パイロット |
|------|------|------------|
| **A. 身体直送（正）** | `sendStackChanVoiceOnce` → `speakGuardedVoiceOnce` → WS | Rally 実装済み |
| **B. legacy 直送** | `stackchanSayLocal`（同型・unguarded） | 参照のみ |
| **C. Hermes 経由 ✗** | Hermes agent が別チャネルで音声生成→端末 | Voice 章では採用しない |

しきしま / Hermes Core の役割は **いつ・何の intent で喋るか決める司令塔**。  
**音の生成と WS 送信は StackChan 出力アダプタ（guarded）** が担う。

---

## 現在の guarded 直送パイプライン

```text
STACKCHAN_VOICE_PILOT_ACK (intent, 固定フレーズ)
  ↓
sendStackChanVoiceOnce (env: STACKCHAN_VOICE_PILOT_SEND=1)
  ↓
VOICEVOX localhost:50021  (audio_query + synthesis)
  ↓
PCM 16kHz chunks
  ↓
WebSocket :8080
  JSON: face_mode → state=speaking → binary PCM → state=idle → face_mode
  ↓
StackChan ファームウェア（口パク + スピーカー）
```

Display / Motion と同様、**Hermes runtime や Discord には載せない**。

---

## 今回の事象との関係

```text
人間観測: 口はパクパク、音は聞こえない
```

解釈（redacted）:

```text
- JSON 経路（face_mode / state=speaking）は届いている可能性が高い → 口が動く
- PCM バイナリまたは端末側オーディオ経路が効いていない可能性
- 「Hermes 経由に変える」必要はなく、「直送 PCM 経路のデバッグ」が正しい
```

---

## 将来（Secretary Mode でも同じ原則）

```text
しきしま: 「今 GO が要る」と判断 → phraseId を選ぶ
StackChan: guarded voice adapter が 1 フレーズだけ直送
禁止: Hermes が勝手に長文 TTS → 端末
禁止: Display + Voice + Motion を 1 パイロットに混ぜる
```

---

## 関連実装

```text
src/main/stackchan-voice-route/stackchan-voice-guarded-speak.ts
src/main/stackchan-voice-route/stackchan-voice-send-once.ts
src/main/stackchan-local-service.ts  (legacy, ガードなし — 比較デバッグ用のみ)
```

---

## 次ゴール

```text
shikishima.stackchan-voice-audio-path-debug
  → 直送 PCM 層の read-only 確認（Hermes 経路はスコープ外）
```

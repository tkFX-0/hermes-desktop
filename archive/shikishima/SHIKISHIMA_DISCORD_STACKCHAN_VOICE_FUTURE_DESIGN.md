# Shikishima × Discord × StackChan Voice — Past, Present, Future

Date: 2026-05-28  
Status: DESIGN (aligns operator intent with codebase)

---

## あなたの認識（整理）

```text
将来: Hermes（しきしま）と Discord をつなぎ、Discord に届いた文書・メッセージを StackChan がしゃべる
以前の印象: しきしま（Bot）起動時にだけ喋っていた
```

**どちらもおおむね正しい**です。現状コードでも「通常 Discord 返信は Discord テキストのみ」で、起動挨拶・イベント・STT・!sc など **限定的な経路だけ** StackChan が喋ります。

---

## 音は「Hermes 経由」ではない（再確認）

```text
Discord 文面 → しきしまがテキストを決める（頭）
              → VOICEVOX + WebSocket 直送（身体）
              → StackChan スピーカー

Hermes が音声バイナリを生成して送る形ではない。
```

将来も **身体直送** を維持し、**判断だけ** を Hermes/しきしまが担う。

---

## 現在の実装（scripts 経路）

### A. 起動時だけ喋る（以前の体感の正体）

```text
shikishima-bot.mjs 起動
  → hookOnBotStart()
  → stackchanSay("おはよう…" / "こんにちは…" / "お疲れ様…")
```

`scripts/shikishima-stackchan.mjs` — Bot 専用の legacy 直送（unguarded）。

### B. 通常 Discord メッセージ（テキスト返信のみ）

```text
Discord メッセージ受信
  → handleMessage(content)   // Groq / ルーティング
  → sendReply → Discord にテキスト投稿
  → StackChan は喋らない（デフォルト）
```

**Discord に届いた返答文は、現状 StackChan には流れていません。**

### C. StackChan が喋るその他の経路（限定的）

| トリガ | 経路 | 例 |
|--------|------|-----|
| Secretary Event Bridge | `fireSecretaryEvent` → `stackchanSayAsAgent` | task_done, gate_hold |
| STT（マイク） | `handleMessage` → **`stackchanSay(replyText)`** | 音声入力→返答を口で |
| !sc say / 自然言語 intent | `stackchanSay(text)` | 明示発話 |
| ちはや / 撫で / DD / かまって等 | 各フック | 固定フレーズ |

### D. 新 guarded 経路（Rally / pilot）

```text
sendStackChanVoiceOnce → stackchan-voice-guarded-speak.ts
```

- Electron main の **パイロット用**（allowlist phrase, env flag）
- **Discord Bot とは未接続**
- `subtitle` 未送信・legacy よりプロトコルが薄い（口パクのみ・音なし報告の調査対象）

---

## 将来設計（目標フロー）

### Phase: Discord → StackChan Voice（Secretary Mode 一部）

```text
[Discord] チャンネルにメッセージ / 文書サマリ
    ↓ read (discord_read — 既存・条件付き)
[しきしま] 要約・返答文・「読み上げるか」判定
    ↓ Safety Governor (しずめ)
    ↓ phraseId / 短文 allowlist（raw 長文禁止）
[StackChan Output Adapter] sendStackChanVoiceOnce (guarded)
    ↓ VOICEVOX → PCM → WS
[StackChan] 発話
    ↓ optional
[Discord] テキストも投稿（読み上げた内容の redacted サマリ）
```

### 設計上の分離（必須）

| 層 | 担当 |
|----|------|
| Discord ingress | メッセージ受信・権限・redacted ログ |
| Hermes / しきしま | 理解・要約・**喋る文の決定** |
| しずめ | risk / Human GO / one-shot / cooldown |
| StackChan adapter | **音声合成と直送のみ** |
| Evidence | 両チャンネルに記録（本文は redacted 方針） |

### Human GO が要るもの

```text
- discord_send（テキスト投稿）は従来どおり別 GO
- 新: discord_message → stackchan_voice（読み上げ）も explicit GO + 時間窓
- 長文全文読み上げは禁止（要約 phrase のみ）
- productionReady / execution は別承認
```

---

## legacy → guarded 移行時の技術メモ

`stackchanSay` が送っているが guarded pilot が未実装のもの:

```text
subtitle (画面テキスト)
emotion 連動 move（発話前）
servo pan/tilt（エージェント別）
mid-nod タイミング
```

口パクだけ動いて音がない事象は、**PCM 層**に加え **プロトコル差分** の可能性あり。  
移行 Rally で「parity checklist」を作る（debug goal の一部）。

---

## ロードマップ上の位置

```text
FULL_AUTONOMY_ROADMAP.md
  Phase 1: Voice Completion（guarded pilot PASS — 聴覚未達は HOLD）
  Phase 6: External Action（Discord read/write 分離）
  Phase 7: Secretary Mode（Discord 文 → StackChan 声）
```

Phase 7 で本設計を **ACCEPTED** にする。Phase 1 完了前に Bot へ接続しない（混線防止）。

---

## 今やらないこと

```text
- shikishima-bot.mjs に sendStackChanVoiceOnce を直結（未 guarded）
- Discord 返信の自動読み上げ ON
- Hermes Worker からの音声ストリーム
```

---

## 関連ファイル

```text
scripts/shikishima-bot.mjs          — Discord ループ、handleMessage
scripts/shikishima-stackchan.mjs  — stackchanSay, hookOnBotStart
src/main/stackchan-voice-route/     — guarded pilot
STACKCHAN_VOICE_OUTPUT_ARCHITECTURE.md
```

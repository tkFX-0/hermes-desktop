# しきしまシステム全体監査レポート

**監査日:** 2026-05-22
**担当:** しずめ (暫定: Claude Code)
**ステータス:** 問題検出あり → 対処記録

---

## バックグラウンドサービス一覧

| サービス | 周期 | AI呼び出し | 状態 |
|---|---|---|---|
| DailyResearchPipeline | 毎分チェック→08:00JST | Hermes(Grok) | 正常 |
| ~~NewsWatcher~~ | ~~60分~~ | ~~Hermes(Grok)~~ | **HOLD済み** |
| DiscordBot (poll) | 10秒 | メッセージ時のみ | 正常 |
| StackChanStatusCheck | 15秒 | なし (HTTP/WS) | 正常 |
| SttServer (Port 8765) | 常時待機 | 音声受信時のみ | 待機中 |

---

## 検出された問題

### P1: ニュースウォッチャー — Grokクォータ過剰消費 [対処済み]

```
問題: 15分ごとにHermesResearch(=Grok)を3クエリ実行 → 96回/日
影響: xAIサブスクのGrokクォータを大量消費
対処: ① 60分に延長 → ② HOLD (完全停止)
再開条件: StackChan安定 + Groq APIキー設定後
```

### P2: しきしま会話でGroq未設定時にGrokフォールバック [未解決]

```
問題: GROQ_API_KEY未設定 → しきしまの日常会話がGrokを消費
影響: Grokクォータ消費 + Claude Proクォータも会話で消費される可能性
対処: .env.local に GROQ_API_KEY=gsk_... 追加で即解決
確認: console.groq.com で無料アカウント作成 → APIキー取得
```

### P3: Discordエージェントラベルなし [対処済み]

```
問題: 誰が答えたかDiscordで分からない
影響: どのエージェントが動いているか不明
対処: 全返答に [しきしま] [つむぎ] 等のラベルを付与
```

### P4: faster-whisper未インストール [未解決]

```
問題: pip install faster-whisper が未実行
影響: Option B (StackChanマイク→STT) が動かない
対処: WSL Ubuntu で pip install faster-whisper
確認: stt-check-whisper IPC or checkWhisperInstalled()
```

### P5: Groq APIキー未設定 [未解決]

```
問題: groq-service.ts が存在するがAPIキー未設定
影響: しきしま simple会話 → Grokフォールバック継続
対処: console.groq.com → アカウント → APIキー → .env.local
費用: 無料 (6,000 tokens/min)
```

### P6: grok-3/grok-4 廃止モデル使用 [対処済み]

```
問題: 旧モデル名(grok-3/grok-4)が残っていた
影響: 2026-05-15以降リダイレクト/退役
対処: grok-4.3 に統一
```

### P7: Claude Opus 4.7 クォータ使いすぎリスク [設計で対応済み]

```
問題: はじめ(complex)にOpus 4.7を使うと高コスト
影響: Claude Proクォータ消費
対処: complex判定のしきいを厳しく (60語以上 or COMPLEX_KW)
      medium以下はSonnet, simpleはHaiku
```

### P8: StackChan/Hermes不在時のエラーログ [軽微]

```
問題: StackChanオフ時に15秒ごとエラーが出る
影響: ログが汚れる (機能への影響なし)
対処: .catch(() => {}) で握りつぶし済み (現状OK)
```

### P9: 5エージェントルーティング — テスト未実施 [未解決]

```
問題: agent-router.ts は実装済みだが実機未テスト
影響: ルーティングが意図通り動くか未確認
対処: 帰宅後Discordでテスト (以下参照)
```

### P10: Codex OPENAI_API_KEY未設定 [既知・許容]

```
問題: StackChan Codex workerが動かない
影響: StackChan関連実装 → Phase 1 HOLD (Task.md出力) で代替
対処: 必要時に OPENAI_API_KEY 追加
現状: 許容済み
```

---

## 5エージェント現状評価

### 実装状況

| エージェント | 実装 | テスト | モデル | 問題 |
|---|---|---|---|---|
| しきしま | 済 | 未 | Groq→Grok | P2: Groqキー未設定 |
| しずめ | 済 | 未 | Claude Sonnet | なし |
| つむぎ | 済 | 未 | Claude Haiku/Sonnet | なし |
| はじめ | 済 | 未 | Claude Opus/Sonnet/Haiku | なし |
| しるべ | 済 | 未 | Hermes→Claude→Groq | P2: Groqキー未設定 |

### ルーティング動作確認テスト (帰宅後)

```
Discord #指示チャンネルで送信:

1. "こんにちは" → [しきしま] + Groq/Grokで返答
2. "しず、これは安全ですか？" → [しずめ] + Claude Sonnet
3. "つむ、TypeScriptで足し算の関数を書いて" → [つむぎ] + Claude Code
4. "はじ、今日のタスクを整理して" → [はじめ] + Claude
5. "しるべ、作業ログを残して" → [しるべ] + Hermes/Claude
6. "XAUUSD今日の動きは？" → [しきしま] FXモード + Hermes Research
7. "StackChanのコードをレビューして" → [つむぎ] Codex (APIキーあれば) / Task.md
```

---

## しずめの将来ロール設計

### 現状
- キーワード (HOLD, GO, 安全...) に反応するエージェント
- 起動時ヘルスチェック (暫定実装済み)

### 目指す姿
```
定期ヘルスチェック (30分ごと):
  - Grokクォータ推定消費量をモニター
  - Discord送信件数が異常に多くないか
  - 設定漏れ検出 (APIキー, Whisper等)
  - 問題あれば #指示チャンネルに自動通知

全応答を横断監視:
  - token/rawValue露出検出
  - 外部送信の無許可実行を検出
  - 異常なループ・繰り返し送信を停止
```

---

## 優先アクション (帰宅後)

| 優先度 | アクション | 解決する問題 |
|---|---|---|
| HIGH | `.env.local` に `GROQ_API_KEY=gsk_...` 追加 | P2, P5 |
| HIGH | Discord テスト送信 (上記7パターン) | P9 |
| MED | WSL: `pip install faster-whisper` | P4 |
| LOW | Electronを再起動して起動時ヘルスチェック確認 | P3改善確認 |

---

## 安全不変条件 (変更なし)

```yaml
productionReady: false
execution: disabled
rawValuesReported: false
news_watcher: HOLD
git_push: 人間GO必要
```

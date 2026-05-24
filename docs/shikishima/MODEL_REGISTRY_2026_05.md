# MODEL_REGISTRY_2026_05

**更新日:** 2026-05-22 (v3)
**適用範囲:** しきしま 5エージェントシステム

---

## モデル割り当て方針

```
メイン会話    → grok-4.3 (xai-oauth / X Premium内・追加課金なし)
軽量タスク    → grok-3   (xai-oauth内・クォータ節約)
delegation   → claude-sonnet-4-6 (Claude Pro / ClaudeCode CLI)
設計・計画    → claude-opus-4    (Claude Pro / 複雑タスクのみ)
記録・要約    → claude-haiku-4   (Claude Pro / 最軽量)
リサーチ      → hermes + grok-4.3 + x_search (xai-oauth)
Vision/画像   → gemini-1.5-pro or gpt-4o (将来実装)
TTS          → VOICEVOX (現行) / edge-tts (無料候補)
```

---

## Grok / xAI (xai-oauth = X Premium内・API課金なし)

| モデルID | 用途 | クォータ | 状態 |
|---|---|---|---|
| `grok-4.3` | しきしまメイン・FX分析・Xリサーチ | 高 | **現行メイン** |
| `grok-3` | 軽量会話・要約・simple判定 | 低 | **現役** |
| `grok-build-0.1` | Web/agentic coding補助 | 中 | 将来 |

**注意:** xai-oauth = X Premiumサブスク内のGrokアクセス。xAI APIキーとは別物。APIキー取得は追加課金になる。

**エージェント割り当て:**
- しきしま simple会話 → `grok-3` (軽量)
- しきしま medium/complex → `grok-4.3`
- しきしま FX分析 → `grok-4.3` + Hermes x_search
- しるべ リサーチ → Hermes (`grok-4.3` + x_search)

---

## Claude / ClaudeCode (Claude Pro subscription)

| モデルID | 用途 | 重さ | 状態 |
|---|---|---|---|
| `claude-opus-4` | 複雑設計・長期計画 | 最重 | **はじめ complex** |
| `claude-sonnet-4-6` | 実装・delegation推奨 | 中 | **つむぎ・しずめメイン** |
| `claude-haiku-4` | 要約・ログ・簡易チェック | 最軽 | **しるべ・simple** |

**delegation pattern:** しきしまが判断し、実装/計画をClaudeに委譲
```
しきしま(判断) → claude-sonnet-4-6 (delegation)
しきしま(設計) → claude-opus-4 (complex plan)
```

**エージェント割り当て:**
- つむぎ → simple:`haiku-4` / medium:`sonnet-4-6` / complex:`sonnet-4-6`
- はじめ → simple:`haiku-4` / medium:`sonnet-4-6` / complex:`opus-4`
- しずめ → `sonnet-4-6` (安全判断は精度固定)
- しるべ → `haiku-4` (記録・要約)

---

## Hermes Agent (20+ providers対応)

hermes CLIは複数プロバイダーをサポート:

| フォーマット | 例 |
|---|---|
| xai-oauth (X Premium) | `-m grok-4.3 --provider xai-oauth` |
| Anthropic | `-m anthropic/claude-sonnet-4 --provider anthropic` |
| OpenRouter | `-m xai/grok-4 --provider openrouter` |
| DeepSeek | `-m deepseek/deepseek-r1 --provider deepseek` |

**軽量タスク候補 (将来):**
- `deepseek/deepseek-chat` (DeepSeek経由・安価)
- `grok-3` (xai-oauth内・無料)

---

## Groq (無料APIキー / 設定任意)

| モデルID | 速度 | 用途 |
|---|---|---|
| `llama-3.3-70b-versatile` | 高速 | しきしまmedium会話バックアップ |
| `llama-3.1-8b-instant` | 超高速 | 将来の超軽量用途 |

設定: `.env.local` に `GROQ_API_KEY=gsk_...` (console.groq.com 無料)

---

## Gemini (Google AI Studio 無料APIキー)

| モデルID | 用途 | RPM | 状態 |
|---|---|---|---|
| `gemini-2.5-pro` | はじめ complex — 計画・設計・複雑推論 | 低 | **はじめcomplex担当** |
| `gemini-2.5-flash` | はじめ medium — 汎用・高頻度 | 15 | **はじめmedium担当** |

設定: `.env.local` に `GEMINI_API_KEY=AIza...` (aistudio.google.com 無料)

**エージェント割り当て:**
- はじめ medium → `gemini-2.5-flash` (15RPM)
- はじめ complex → `gemini-2.5-pro`

---

## Vision / 画像解析 (将来実装)

| モデル | プロバイダー | 用途 |
|---|---|---|
| `gemini-2.5-pro` | Google | StackChanカメラ・画像理解 (gemini-1.5-proから更新) |
| `gpt-4o` | OpenAI | 汎用ビジョン |

現状はじめのテキスト計画用途のみ。StackChanカメラ対応時に拡張予定。

---

## TTS (音声合成)

| サービス | コスト | 状態 |
|---|---|---|
| VOICEVOX | 無料 (ローカル) | **現行稼働中** |
| edge-tts | 無料 (Microsoft Edge) | 候補 |
| ElevenLabs | 有料 | 高品質候補 |
| Gemini 3.1 Flash TTS | Google API | 将来 |

---

## 5エージェント × モデル選択マトリクス

| エージェント | simple | medium | complex | 備考 |
|---|---|---|---|---|
| しきしま | grok-3 | grok-4.3 / Groq | grok-4.3 | FX→grok-4.3+Hermes固定 |
| しずめ | claude-sonnet-4-6 | claude-sonnet-4-6 | claude-sonnet-4-6 | 安全→精度固定 |
| つむぎ | claude-haiku-4 | claude-sonnet-4-6 | claude-sonnet-4-6 | StackChan→Codex |
| はじめ | claude-haiku-4 | gemini-2.5-flash | gemini-2.5-pro | 計画→Gemini delegation |
| しるべ | claude-haiku-4 | claude-haiku-4 | claude-haiku-4 | live検索→Hermes+grok-4.3固定 |

---

## ニュースウォッチャー状態

```
NEWS_WATCHER: HOLD
理由: Grokクォータ節約 + StackChan音声安定化待ち
再開条件: StackChan動作確認 + Groq APIキー設定後
```

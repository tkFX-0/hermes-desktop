# しきしま 5エージェントシステム — 設計まとめ

**更新日:** 2026-05-22
**バージョン:** v1.0 (実装済み)

---

## 全体構成

```
Discord / UI メッセージ
        ↓
    routeTask()
    ─ キーワード判定
    ─ complexity判定 (simple / medium / complex)
    ─ 直接呼びかけ優先 (しき、しず、つむ、はじ、しるべ)
        ↓
┌────────────┬──────────────────────────────────────────────────────┐
│ しきしま   │ 管制・会話・FX分析                                    │
│ しずめ     │ 安全ゲート・HOLD判定                                  │
│ つむぎ     │ 実装・コード (Claude Code / Codex)                   │
│ はじめ     │ 計画・設計・タスク分解                                │
│ しるべ     │ 記録・検索・ログ (Hermes Research)                   │
└────────────┴──────────────────────────────────────────────────────┘
        ↓
    StackChan 発話 (つむぎ・しるべ以外)
```

---

## エージェント詳細

### 1. しきしま / しき — 管制塔

| 項目 | 内容 |
|---|---|
| 役割 | 全体管制・会話・判断整理・ユーザー窓口 |
| FX分析 | grok-4.3 固定 (精度優先) |
| simple会話 | Groq llama-3.1-8b → grok-3 フォールバック |
| medium会話 | grok-4 |
| complex会話 | grok-4.3 |
| 呼び方 | `しき、` または `しきしま、` で始める |

### 2. しずめ / しず — 安全ゲート

| 項目 | 内容 |
|---|---|
| 役割 | GO/HOLD/REJECT判定・暴走防止 |
| モデル | grok-4.3 **固定** (安全は妥協しない) |
| 出力形式 | `[GO / HOLD / REJECT]` + 理由 |
| 呼び方 | `しず、これHOLD？` |

### 3. つむぎ / つむ — 実装担当

| タスク種別 | Worker | モデル |
|---|---|---|
| StackChan実装 | Codex CLI | v0.133.0 (OPENAI_API_KEY必要) |
| Coreコード simple | Claude Code | claude-haiku-4-5 |
| Coreコード complex | Claude Code | claude-sonnet-4-6 |
| Codex未設定時 | Task.md生成 | 人間ブリッジ |
| 呼び方 | `つむ、実装して` |

**Codexスコープ:** StackChan専用 / Claude Codeスコープ: しきしまCore

### 4. はじめ / はじ — 作戦参謀

| 項目 | 内容 |
|---|---|
| 役割 | 計画・設計・タスク分解・最初の一手 |
| simple | claude-haiku-4 |
| medium | gemini-2.5-flash (15RPM) |
| complex | gemini-2.5-pro |
| 出力形式 | 目標整理→タスク分解→推奨順序→依存関係→最初の一手 |
| 呼び方 | `はじ、次の一歩を決めて` |

### 5. しるべ — 記録・道しるべ

| 項目 | 内容 |
|---|---|
| 役割 | 記録・検索・ログ・ナビゲーション |
| 最新情報 | Hermes Research (x_search / Grok) |
| 知識質問 | Claude sonnet-4-6 |
| フォールバック | Groq → Grok |
| 呼び方 | `しるべ、作業ログを残して` |

---

## AI サービス構成

| サービス | コスト | モデル | 用途 |
|---|---|---|---|
| **Grok** | X Premium (済) | grok-4.3 / 4 / 3 | しきしま・しずめ・しるべfallback |
| **Claude Code** | Claude Pro (済) | sonnet-4-6 / haiku-4-5 | つむぎ・しずめ |
| **Gemini** | Google AI Studio (無料APIキー) | gemini-2.5-pro / flash | はじめ medium/complex |
| **Hermes Research** | X Premium (済) | Grok + x_search | しるべ (最新情報) |
| **Groq** | 無料APIキー (任意) | llama-3.3-70b | しきしまsimple高速化 |
| ~~Ollama~~ | ~~ローカル~~ | — | **不使用** — 品質・速度・リアルタイム性で劣るため除外 |
| **Codex** | OPENAI_API_KEY (任意) | v0.133.0 | つむぎ StackChan専用 |

**追加課金ゼロで動く構成:** Grok (X Premium) + Claude Code (Claude Pro) + Hermes Research

---

## モデルルーティング全体図

```
入力 → complexity判定
          │
          ├─ simple  ─→ grok-3 / claude-haiku-4
          ├─ medium  ─→ grok-4.3 / Groq / gemini-2.5-flash
          └─ complex ─→ grok-4.3 / claude-sonnet-4-6 / gemini-2.5-pro
                              │
                        エージェント別優先順
                        しずめ  → claude-sonnet-4-6 固定
                        はじめ  → gemini-2.5-flash(medium) / gemini-2.5-pro(complex)
                        しるべ  → Hermes+grok-4.3(live) / claude-haiku-4(記録)
                        しきしま→ grok-3(simple) / grok-4.3+Groq(medium) / grok-4.3(complex)
                        つむぎ  → ClaudeCode(haiku/sonnet) / Codex(StackChan)
```

---

## ルーティングキーワード

| エージェント | 反応するキーワード例 |
|---|---|
| **しずめ** | HOLD, GO, 安全, 危険, 本番, productionReady |
| **つむぎ** | コードを書, 実装して, バグ, TypeScript, 修正して |
| **はじめ** | 計画して, 設計して, 何から, ロードマップ, タスク分解 |
| **しるべ** | 調べて, 検索して, ニュース, 最新, ログ, 記録して |
| **しきしま** | FX, XAUUSD, gold, prop firm + その他すべて |

**直接呼びかけが最優先**: `しき、` `しず、` `つむ、` `はじ、` `しるべ、`

---

## StackChan パイプライン

### 出力 (しきしまが話す)
```
しきしまGrok応答 → VOICEVOX (localhost:50021) → 16kHz PCM → WebSocket (<STACKCHAN_HOST>:8080)
感情検出 → face_mode変更 (happy/sad/thinking/surprised/normal)
発話しないエージェント: つむぎ(コード), しるべ(リサーチ)
```

### 入力 Option B (マイク — 実装済み待機中)
```
StackChan内蔵マイク → WiFi POST → http://pc:8765/audio
→ Whisper STT (WSL faster-whisper) → dispatchToAgent() → VOICEVOX → StackChan発話
```
**必要:** `pip install faster-whisper` + StackChan firmware録音コード追加

---

## セットアップ状況

| 機能 | 状態 |
|---|---|
| Grok (xai-oauth) | 動作中 |
| Discord Bot (しきしまBot) | 動作中 |
| StackChan発話 | 動作中 |
| 5エージェントルーティング | 実装済み |
| モデルインテリジェント選択 | 実装済み |
| Codex CLI | インストール済み (API key待ち) |
| Groq | 設定待ち (console.groq.com) |
| STT Server (Option B) | 実装済み (whisper+firmware待ち) |

---

## 次のアクション

```
帰宅後テスト:
  1. Electronを再起動して5エージェントルーティングを確認
  2. Discordで「しず、これHOLD？」「はじ、今日の計画を立てて」などをテスト
  3. pip install faster-whisper (STT準備)
  4. StackChan firmware: マイク録音+POST追加 (Option B完成)

任意追加:
  5. console.groq.com → 無料APIキー → .env.local に GROQ_API_KEY=gsk_...
```

---

## 安全不変条件

```yaml
productionReady: false
execution: disabled
rawValuesReported: false
git_push: 人間GO必要
external_send: Discord返答のみ
ollama_as_worker: forbidden
codex_scope: stackchan_only
```

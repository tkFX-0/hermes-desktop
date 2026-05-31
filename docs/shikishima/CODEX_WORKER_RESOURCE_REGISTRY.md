# Codex Worker 公式リソース登録簿（しきしま）

**date:** 2026-05-29  
**status:** docs + policy fixed — **Codex = つむぎ Worker / しきしま内蔵脳ではない**  
**autonomous Codex launch:** HOLD（人間ブリッジ or bounded worker は別GO）

---

## 結論（1行）

```text
Codexは「しきしまの中のLLM」ではなく、つむぎが呼ぶ実装Worker。
しきしまは指示・GO・安全・証跡。つむぎはTask.md / handoff。Codexは実装・テスト・差分。
```

---

## 役割分担（しきしまチーム）

| 層 | 担当 | モデル/ツール |
|---|---|---|
| 会話・管制 | しきしま | Groq / Claude（返答レーン） |
| 安全 | しずめ | Claude（critical） |
| **実装 Worker** | **つむぎ** | **Composer (agent CLI) → Claude Code → Codex** |
| 記録 | しるべ | 統制ログ / Model Trace |
| FX | ちはや | Groq / Claude（専任） |

```text
Groq / Claude     → 返答・判断・要約・安全レビュー
Composer / ClaudeCode / Codex → つむぎの外部Worker（実装向き）
Cursor agent CLI  → Composer 枠（Pro）— 開発1番手（2026-05-29 稼働）
Grok Research     → 今月 HOLD（クレジット保護）
```

---

## 公式リソース（探していた記事）

| # | タイトル | URL | しきしまでの意味 |
|---|---|---|---|
| 1 | Work with Codex from anywhere | https://openai.com/index/work-with-codex-from-anywhere/ | iPhone/Discord → home PC の Codex host。進捗・diff・approval を遠隔確認 |
| 2 | Remote connections – Codex | https://developers.openai.com/codex/remote-connections | 別端末/SSH host から Codex App 接続。**remote execution は後段GO** |
| 3 | Codex CLI | https://developers.openai.com/codex/cli | **つむぎ Worker 本命**。ローカル terminal で read/edit/run |
| 4 | Codex CLI features | https://developers.openai.com/codex/cli/features | `codex app-server` 等。**token/LAN/auth 設計が必要 → HOLD** |
| 5 | Building a safe sandbox for Codex on Windows | https://openai.com/index/building-codex-windows-sandbox/ | Windows 環境向け sandbox。しきしま desktop と相性確認用 |

---

## 運用フェーズ

### Phase A — 現在（推奨・稼働中）

```text
しきしま / SideBot:
  開発1番手: Cursor agent CLI (composer-2.5, Pro login)
  開発2番手: WSL claude CLI (Claude Pro login)
  Codex:     未導入 → パイプライン3番手スキップ

つむぎ (Electron agent-router):
  StackChan+コード → Codex Worker（OPENAI_API_KEY あり時のみ）
  未設定時         → Task.md 生成 → 人間ブリッジ
```

人間ブリッジ（Codex 手動）:

```text
1. しきしま/つむぎ → Task.md または Discord 指示
2. 人間 → Codex CLI / ChatGPT に投入
3. Codex → 実装・テスト
4. しるべ → evidence 化
5. しずめ → push / runtime / external write は HOLD
```

### Phase B — 将来（別GO）

```text
しきしま → bounded Codex worker（スコープ限定・監査付き）
```

ゲート: `WK-01_CODEX_WORKER_BOUNDARY.md` / remote control / API token / raw 漏れ

---

## ルーティング（設計メモ）

```text
StackChan + コード     → つむぎ (Codex Worker)     [agent-router.ts]
しきしま Core 実装     → つむぎ (ClaudeCode Worker)
Codex 未設定           → Task.md → 人間
```

SideBot (`dispatch-agent-reply.mjs`) では **subscription_only** のため OpenAI API 従量は使わず、Codex CLI 導入後に preflight へ載せる。

---

## $20 サブスク運用との関係

| サービス | Codex との関係 |
|---|---|
| ChatGPT Plus | Codex CLI ログイン枠（**APIキー≠Plus**） |
| Cursor Pro | 別製品。開発は `agent` + Composer が主 |
| Claude Pro | Codex の代替フォールバック（WSL `claude`） |

```env
SHIKISHIMA_ALLOW_OPENAI_API=0   # 従量APIは使わない（維持）
```

Codex CLI を入れたら:

```powershell
# 導入後（公式 CLI 手順に従う）
node scripts/shikishima-wsl-dev-preflight.mjs
# → tools.codex.present: true になればチェーン3番手が有効化候補
```

---

## Model Trace（必須）

どの agent がどの provider/model で返したか、Discord 末尾と監査に残す。

```text
[返答] claude / claude-sonnet-4-6 / deep
[開発] cursor-agent-cli / composer-2.5
```

---

## 関連ドキュメント

- `WK_01_CODEX_WORKER_BOUNDARY.md` — 禁止事項・HOLD
- `DEV_PIPELINE_SUBSCRIPTION_2026-05-29.md` — env / Composer / Claude
- `AGENT_BACKEND_REGISTRY_2026-05-29.md` — Grok HOLD / registry

---

## しきしま判定

- Codex を内蔵脳にしない方針: **この登録簿で固定**
- 公式リソース参照: **上表で十分**（Past chat の整理と一致）
- 自動 Codex 起動: **HOLD**（`codex_auto_launch: HOLD`）

この範囲では問題を検出していません。

# WSL 開発パイプライン + Hermes脳 — サブスク運用 (2026-05-29)

## 目的

- **会話・StackChan** → しきしま（返答レーン・品質優先）
- **開発・研究** → Composer → Claude → Codex（開発レーン・固定チェーン）
- **記録** → しるべ（統制ログ + モデル明記）
- **$20/月サブスクのみ**で追加従量課金を避ける

## WSL 実機プリフライト結果（自宅環境）

`node scripts/shikishima-wsl-dev-preflight.mjs` → `.shikishima-memory/wsl-dev-preflight.json`

| ツール | 状態 |
|---|---|
| `claude` | あり (Claude Code CLI) |
| `hermes` | あり v0.14 |
| `cursor` | あり（エディタCLI。Composerエージェント単体ではない） |
| `agent` (Cursor Agent CLI) | なし |
| `codex` | なし |

## 開発チェーン（実装済み）

```
1. composer  … CURSOR_API_KEY + @cursor/sdk があれば composer-2.5
              なければ Hermes脳 (WSL hermes + anthropic provider)
2. claude    … WSL `claude` CLI（Claude Pro ログイン）
3. codex     … subscription_only 時はスキップ（CLI未導入）
```

## env（反映済み 2026-05-29）

`.env.local` 末尾に開発パイプライン块を追記済み。雛形は `.env.dev-pipeline.example`。

必須キー:

| 変数 | 値 |
|---|---|
| `SHIKISHIMA_DEV_PIPELINE_ENABLED` | `1` |
| `SHIKISHIMA_BILLING_MODE` | `subscription_only` |
| `SHIKISHIMA_COMPOSER_MODE` | `agent_cli`（Pro枠優先） |
| `SHIKISHIMA_COMPOSER_MODEL` | `composer-2.5` |
| `CURSOR_API_KEY` | **空**（agent_cli 時は推奨） |

## Cursor Pro + Composer（リサーチ要約）

出典: [Composer 2.5](https://cursor.com/docs/models/cursor-composer-2-5) / [Usage limits](https://cursor.com/help/models-and-usage/usage-limits) / [CLI install](https://cursor.com/docs/cli/installation)

- **Pro $20/月**: APIエージェント枠 $20 + **Composer/Auto は別プール**（included）
- **Composer 2.5**: IDE と **Cursor CLI (`agent`)** のみ。外部公開APIなし
- **追加課金なし**: 各プールの上限まで（超過時はエディタ通知）
- **推奨**: `agent login` で Pro 認証 → `agent -p "..." --model composer-2.5`
- **CURSOR_API_KEY**: SDK/ヘッドレス用。設定すると **API枠**を消費しうるため、サブスクのみ運用では空にする

### Windows に agent CLI を入れる（未導入の場合）

```powershell
irm 'https://cursor.com/install?win32=true' | iex
agent --version
agent login
```

使用量: https://cursor.com/dashboard → Usage

## Discord コマンド

| コマンド | 内容 |
|---|---|
| `!dev-pipeline` | WSLツール状況 + 利用可能チェーン |
| `!governance` | 統制・アップデート記録 |
| `!reply-status` | Groq / WSL Claude 等 |

返信末尾に自動付与:

```
[返答] claude / claude-sonnet-4-6 / deep
[開発] hermes-brain / anthropic/claude-sonnet-4-6   ← 開発タスク時のみ
```

## サブスクと課金の注意（正直な整理）

| サービス | サブスク内で使いやすい経路 | 追加課金になりやすい経路 |
|---|---|---|
| **Cursor Pro** | IDE / Composer 対話 | SDK API（要ダッシュボード確認） |
| **Claude Pro** | WSL `claude` CLI | Anthropic API 直 |
| **ChatGPT Plus** | ブラウザ/Codex CLI（要導入） | OpenAI API 従量 |
| **Groq** | 無料枠API | 超過時 |
| **Hermes** | WSL CLI + 各 provider ログイン | 外部 API 従量 |

**Composer 2.5 を SideBot から完全自動**にするには、Pro枠内かは Cursor 使用量画面で要確認。

## Claude / GPT / Codex の扱い（$20サブスクのみ）

| 系統 | あなたのプラン | しきしまでの経路 | 追加API課金 |
|---|---|---|---|
| **Composer** | Cursor Pro | Windows `agent` + login（**1番手**） | なし（Composerプール） |
| **Claude** | Claude Pro ($20) | WSL `claude` CLI + login（**2番手**） | なし（Proログイン） |
| **GPT-5.x** | ChatGPT Plus ($20) | **同じ `agent` CLI** でモデル切替 | なし（Cursor内のGPT枠）※ |
| **Codex** | ChatGPT Plus | **未導入**（`codex` CLIなし） | APIキーは既定OFF |

※ Cursor CLI は Composer 以外にも GPT-5.5 等を選べます（`agent` 内のモデル選択）。OpenAI API 従量とは別です。

### Claude（やること）

WSL で一度ログイン（未実施なら）:

```bash
wsl -d Ubuntu -- bash -lc "claude login"
```

env は既に `SHIKISHIMA_CLAUDE_DEV_MODEL=claude-sonnet-4-6`。Composer が失敗したとき自動で WSL Claude にフォールバックします。

### GPT（やること）

**別途 OpenAI API キーは不要**です。開発で GPT を使いたいときは:

1. **Cursor `agent` のモデルを GPT にする**（手動）  
   `agent -p "..." --model <GPTモデル名>`  
   モデル名は Cursor CLI の `/model` 一覧で確認
2. 将来: しきしま側で「GPT向けキーワード」のときだけ `SHIKISHIMA_COMPOSER_MODEL` を切替（要GO）

`SHIKISHIMA_ALLOW_OPENAI_API=0` のまま = ChatGPT Plus でも **API従量は使わない** 方針です。

### Codex（やること）

- 方針詳細: `CODEX_WORKER_RESOURCE_REGISTRY.md`（**つむぎ Worker / 内蔵脳ではない**）
- 現状 WSL/Windows とも **`codex` CLI なし** → パイプライン3番手はスキップ
- ChatGPT Plus で Codex CLI が使えるようになったら WSL に導入し、preflight を再実行
- それまでは **Composer → Claude** の2段で開発十分
- OpenAI API キーを `.env` に入れると従量課金になるため、サブスクのみ運用では **入れない**

### Hermes脳（自律神経）

Composer/Claude の**前後**でオーケストレーション・研究・多プロバイダ連携に使う補助層（WSL `hermes`）。  
返答（Discord/しきしま会話）とは別レーン。

---

## 現在のチェーン（PC 状態は preflight で再確認）

```
1. composer  → cursor-agent-cli-win  ※要: agent install + login
2. claude    → wsl-claude-cli       ※要: claude login
3. codex     → wsl-codex-cli（subscription_only 時は leg スキップ可）
```

確認: `node scripts/shikishima-wsl-dev-preflight.mjs` → `.shikishima-memory/wsl-dev-preflight-snapshot.json`

Discord: `!dev-pipeline` でチェーン表示。

## 次の手順（帰宅後）

1. `.env.dev-pipeline.example` を `.env.local` に追記
2. `node scripts/shikishima-wsl-dev-preflight.mjs`
3. `node scripts/shikishima-process-preflight.mjs --clean` 後 Bot 再起動
4. Discord: `!dev-pipeline` → チェーン確認
5. つむぎ向け: `つむぎ　この関数をレビューして` で `[開発]` トレース確認

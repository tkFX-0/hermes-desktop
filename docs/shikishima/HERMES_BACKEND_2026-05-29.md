# Hermes 正式バックエンド化 (しきしまアレンジ) — 2026-05-29

しきしま/6エージェントの返答を、Hermes エージェント本体（OpenAI互換APIサーバー
または WSL の `hermes` CLI）経由で生成できるようにする「正式バックエンド」。
**env を入れるだけ**で切り替わり、未設定なら従来の Groq / Claude のまま動く drop-in 構成。

## 構成

| 層 | ファイル | 役割 |
|---|---|---|
| 設定 (TS) | `src/main/shikishima-hermes-backend/hermes-backend-config.ts` | env からの設定解決・準備状況判定（秘匿値を出さない） |
| クライアント (TS) | `src/main/shikishima-hermes-backend/hermes-backend-client.ts` | API/CLI 両対応・transport注入でテスト可能 |
| 公開面 (TS) | `src/main/shikishima-hermes-backend/index.ts` | re-export |
| SideBot用 (.mjs) | `scripts/lib/hermes-backend.mjs` | 実HTTP + WSL transport を持つ Bot 用ミラー |
| 配線 | `scripts/lib/dispatch-agent-reply.mjs` | 有効時は Hermes 最優先 → 失敗時 Groq/Claude へ自動フォールバック |
| テスト | `tests/hermes/zone/full-autonomy/full-autonomy-hermes-backend.test.ts` | config/client のユニットテスト |
| env雛形 | `.env.hermes.example` | 貼るだけテンプレート |

## 入れるだけ手順（帰宅後）

1. `.env.hermes.example` の中身を `.env.local` に貼り付け
2. `SHIKISHIMA_HERMES_BACKEND_ENABLED=1`
3. 方式を選んで埋める:
   - **API方式** (`SHIKISHIMA_HERMES_MODE=api`): `SHIKISHIMA_HERMES_API_BASE`（必要なら `SHIKISHIMA_HERMES_API_KEY`）
   - **CLI方式** (`SHIKISHIMA_HERMES_MODE=cli`): WSL に `hermes` が入っていること
4. `SHIKISHIMA_HERMES_MODEL` に既定モデル（例 `anthropic/claude-sonnet-4.6`）
5. SideBot 再起動: `node scripts/shikishima-bot.mjs`

疎通だけ確認したいときは `SHIKISHIMA_HERMES_DRY_RUN=1`（**API課金なし**・固定文字列を返す）。

## 安全設計

- 既定 OFF。未設定では一切呼ばれない（既存挙動を変えない）。
- Hermes が失敗・未準備でも `dispatch-agent-reply` が Groq/Claude にフォールバック。
- 準備状況レポートは **キー名のみ**を返し、APIキー等の実値は決して出力しない。
- `dryRun` で実通信なしの疎通確認が可能。
- 外部送信・git push・依存追加は本実装では行っていない。

## 既知の前提（未確定なので帰宅後に確定）

- API方式の正確なエンドポイント/モデルID表記は Hermes 側設定に依存。
- CLI方式は `hermes chat -Q -q <prompt> -m <model> [--provider p] --yolo` 形式を想定（要実機確認）。
- agentごとに別モデルを使う場合は registry の `replyModels.hermes` を追加すると優先される。

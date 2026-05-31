# 完全自律開発ギャップ — 順次 Task 1〜5

Date: 2026-05-31  
表記: **G** / **H**

## 実行

```powershell
node scripts/shikishima-run-autonomy-gap-tasks.mjs
```

## Task 一覧

| Task | ギャップ | スクリプト / 実装 | G/H |
|------|----------|-------------------|-----|
| **1** | decision=HOLD / execution=disabled | `human-go-readiness` 報告のみ | execute 開放は **H** |
| **2** | 開発パイプライン | `wsl-dev-preflight` + `DEV_PIPELINE_ENABLED` | 準備 **G** |
| **3** | 従量 API 回避 | `!kaihatu` / `!kaihatuslot` → WSL のみ | **G**（司令部限定） |
| **4** | 無人 24h | orchestrator status + maintenance tick | コーディング常時は **H** |
| **5** | 対話自動化 | `SHIKISHIMA_PORTFOLIO_DIALOGUE_G=1` | ブリッジ **G** |

## 司令部 — 開発指示コマンド（G）

| コマンド | 動作 |
|----------|------|
| `!kaihatu <指示>` | WSL 開発パイプライン → **自動レビュー**（設計 checklist + zone vitest + しずめ判定） |
| `!kaihatu-test` / `!kaihatu test` | 開発パイプライン**未実行**・自動レビューのみ（API 課金なし） |
| `!kaihatuslot <指示>` | スロット開放 + 自律ループ（最大8 step）・本番適用 **H** |

例:

```text
!kaihatu-test
!kaihatu test 自動レビュー配線確認
!kaihatu vitest zone の discord テストを追加して
!kaihatuslot scripts/lib のリファクタ計画をスロット内で実行
```

自動レビュー（B）: `scripts/lib/kaihatu-auto-review.mjs`。HOLD 時は対話部屋へ allowlist メンション（`DISCORD_OPERATOR_USER_ID` 設定時）。

## スレッド記憶（Hermes SessionStore 相当）— 2026-05-30

| 機能 | コマンド / ファイル |
|------|-------------------|
| 部屋×エージェント JSON スレッド | `.shikishima-memory/discord-threads/{channelId}.json` |
| @メンションルーティング | `scripts/lib/discord-mention-route.mjs`（Bot `<@id>` + テキスト `@しきしま`） |
| 履歴 hydrate | 起動時 + 5分毎 + `!部屋状況` |
| 状況一覧 | `!部屋状況` / `!room-status` |

任意 env: `DISCORD_BOT_USER_ID`（@me 自動取得可）、`DISCORD_AGENT_MENTION_IDS=tsumugi:123,...`

## 参考 Skills（karaage0703/ai-assistant-workspace）

- `docs/shikishima/REFERENCE_SKILLS_KARAAGE.md`
- `.agents/skills/shikishima-*`（code-reviewer / multi-agent / kaizen-rca / github-analyzer）

## Discord コマンド一覧（ピン用）

- 全文: `docs/shikishima/DISCORD_COMMAND_PIN.md`
- 司令部で `!help` / `!コマンド` → Bot が一覧返信（ピン留め用）
- 簡易ヘルス: `!status`

## env

| 変数 | 用途 |
|------|------|
| `SHIKISHIMA_DEV_PIPELINE_ENABLED` | `1` 必須（!kaihatu） |
| `SHIKISHIMA_BILLING_MODE` | `subscription_only` 推奨 |
| `SHIKISHIMA_PORTFOLIO_DIALOGUE_G` | `1` で portfolio→dialogue 自動転送 |
| `SHIKISHIMA_DISCORD_MULTI_ROOM_G` | マルチルームテスト |

## まだ H のもの

- 憲法 `execution=enabled`
- 本番 git push / Discord 本番送信ループ
- FX/EA 自動売買
- 無制限 24h コーディング（キュー常時消化）

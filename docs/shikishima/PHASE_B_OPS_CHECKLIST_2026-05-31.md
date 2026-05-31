# Phase B 運用チェックリスト（2026-05-31）

Date: 2026-05-31 · Status: 運用ガイド  
関連: [JARVIS_PHASE_A_D_ROADMAP_2026-05-31.md](JARVIS_PHASE_A_D_ROADMAP_2026-05-31.md) · [AUTONOMY_55_TO_100_CURSOR_PLAYBOOK_2026-05-31.md](AUTONOMY_55_TO_100_CURSOR_PLAYBOOK_2026-05-31.md)

---

## 日次（5〜10分）

```powershell
Set-Location "c:\Users\81903\Desktop\プロジェクトファイル\hermes-desktop"

node scripts/shikishima-autonomy-status.mjs
node scripts/shikishima-run-autonomy-gap-tasks.mjs
node scripts/shikishima-run-ordered-tasks.mjs --skip-stackchan-resume
```

| コマンド | 成功目安 |
|----------|----------|
| autonomy-status | 停止要因なし · gaps 0 |
| gap-tasks | ALL OK 5/5 |
| ordered-tasks | 3/4（Task1a maintenance interval skip = **正常**） |

Discord: `!autonomy progress` · `!human-go` · `!dev-pipeline`

---

## 週次（人間判断）

```powershell
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
node scripts/shikishima-wsl-dev-preflight.mjs --json
npx vitest run tests/hermes/zone/full-autonomy
```

---

## Phase B — 境界付き WF（明示 enqueue のみ）

| 設定 | 値 |
|------|-----|
| handoff 自動 enqueue | **OFF**（`SHIKISHIMA_WORKFLOW_HANDOFF_DISABLE=1`） |
| 投入 | `!workflow enqueue <指示>` または CLI 下記 |
| 完了 | `!workflow done` または `--workflow-done` |

```powershell
# 1 サイクル検証（dev 段は WSL · 数分かかる場合あり）
node scripts/shikishima-phase-b-workflow-pilot.mjs
```

---

## Phase B でやらないこと

- git push（別 GO）
- `SHIKISHIMA_ALLOW_PAID_API=1`
- agent-team `--live-api`
- 憲法 `execution=enabled`
- W6 Jarvis C/D · Phase D 金融 EA

---

## Obsidian live（週次）

- ordered-tasks **Task1b**: `obsidian-dry-run-tick` — `decision=ALLOW_LIVE`（vault OK · 憲法 obsidian_write scope）
- 実追記: `appendShirubeDailyLog` / `obsidian-write-go` / `npx tsx scripts/shikishima-constitutional-go-execute.mjs`（証跡庫）
- W6a Phase C: 上記週次ルーティンを維持（X/SNS 自動投稿は H）

## 別 Human GO バックログ

正本: [PHASE5_HUMAN_GO_BACKLOG.md](PHASE5_HUMAN_GO_BACKLOG.md)

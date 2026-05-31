---
name: shikishima-kaizen-rca
description: Discord/Bot/しきしまの事象を5フェーズで根本原因分析（なぜなぜ）。再投稿・取りこぼし・@無反応・vitest失敗等。「原因調べて」「なぜなぜ」「再発防止」「横展開」で使用。本番変更は HOLD。
---

# しきしま — 根本原因分析（Kaizen / 5 Whys）

改変元: [ai-assistant-workspace/skills/xangi-kaizen](https://github.com/karaage0703/ai-assistant-workspace)（MIT）

## 3原則

1. **フェーズを飛ばさない**
2. **想定で終わらせず証拠**（ログ・git・カーソル JSON）
3. **真因が分かるまで大規模実装に進まない**

## Phase 1 — 事象整理

- いつ / どの部屋（司令部・対話・ポートフォリオ）
- 期待 vs 実際
- `!部屋状況` / Bot コンソール `[Bot]` 行

## Phase 2 — ログ調査

| ソース | パス / コマンド |
|--------|------------------|
| スレッド記憶 | `.shikishima-memory/discord-threads/` |
| intake カーソル | `.shikishima-memory/discord-intake-cursor.json` |
| agent-log | `.shikishima-memory/agent-log.json` |
| audit | `.shikishima-memory/audit/` |
| Bot 診断 | `node scripts/diag-discord-poll.mjs` |
| preflight | `node scripts/shikishima-process-preflight.mjs --json` |

## Phase 3 — 真因（なぜ×3以上）

仮説 → 証拠 → 検証。例:

- なぜ返信なし？ → stale skip / 未登録 ! / Groq 未設定
- なぜ話題が飛ぶ？ → スレッド未注入（修正済みなら別要因）

## Phase 4 — 横展開

同パターンの他チャンネル・他コマンド・他エージェントへ。

```powershell
git grep -n "stale skip|dialogue room skip|handleMessage skip"
```

## Phase 5 — 修正と報告

- 小さな diff + zone vitest
- 報告は日本語・**HOLD 維持**を明記
- KEDB: `docs/shikishima/` に事例1行追記（任意）

## しきしまでよくある事象

| 事象 | まず見る |
|------|----------|
| @ だけで無反応 | `discord-mention-route.mjs`（修正後はテンプレ応答） |
| 対話部屋で無反応 | 非 `!` は仕様（DIS-05） |
| !kaihatu 失敗 | WSL `claude login` / `!dev-pipeline` |
| 再起動後スキップ | intake カーソル・30分 stale |

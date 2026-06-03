# 明日の朝 — 完全自律実装 開始チェックリスト

Date: 2026-05-31  
前提: StackChan は **HOLD**（`docs/shikishima/STACKCHAN_HOLD_2026-05-30.md`）  
**人間 GO**: 2026-05-31 確認済み（`agent_team_tick` / `autonomous_orchestrator` を `phase-go-ack.json` に記録）

## 1. 5分 — 環境・安全状態

```powershell
cd "C:\Users\81903\Desktop\プロジェクトファイル\hermes-desktop"

# StackChan HOLD 確認（hold=YES / bridge=OFF）
node scripts/shikishima-process-preflight.mjs

# 自律・憲法状態（raw 値は出ない）
node scripts/shikishima-human-go-readiness.mjs
node scripts/shikishima-orchestrator-status.mjs
```

期待:

- SideBot **1 プロセス**（`--clean --restart-dev` で重複解消可）
- `decision=HOLD` / `execution=disabled` / `productionReady=false` のまま
- StackChan ログ: `hold=YES`

## 2. 10分 — テスト（自律コードの健全性）

```powershell
npx vitest run tests/hermes/zone/full-autonomy
npm run typecheck:node
```

失敗があれば自律実装に入る前に直す。

## 3. 今日進めてよい実装（StackChan なし）

| 優先 | トラック | コマンド / 場所 |
|------|----------|-----------------|
| P1 | Agent Team 自律 tick | `npx tsx scripts/shikishima-agent-team-tick.mjs`（dry/保守） |
| P1 | 自律ランタイム 1 tick | `npx tsx scripts/shikishima-autonomous-runtime-tick.mjs autonomy.maintenance` |
| P2 | Phase E ロードマップ | `docs/shikishima/FULL_AUTONOMY_PHASE_E_ROADMAP.md` |
| P2 | Agent Team 運用 | `docs/shikishima/AGENT_TEAM_AUTONOMOUS_OPERATION_2026-05-29.md` |
| P3 | Discord **読取のみ** | `discord.read` tick（**送信は憲法 GO まで不可**） |
| P3 | Obsidian dry-run | `obsidian` 系 tick / governor テスト |

参照ハンドオフ: `docs/ichikishima/IMPLEMENTATION_HANDOFF.md`（Zone + full-autonomy）

## 4. まだ人手 GO が要る境界（自動で開けない）

- Discord **REST 送信**ループ本番化
- Obsidian **実書き込み**
- Hermes **WSL 実実行** / `execFile` Controlled Pilot
- `constitutional-go-execute` による execution 有効化
- StackChan 音声再開（HOLD 解除 + 聴感確認）
- `git push` / 外部本番

## 5. 今日の完了の定義（提案）

- [x] 上記テスト緑（2026-05-31: zone 104 passed）
- [x] `autonomous-runtime-tick` maintenance 完走（tickCount=46, GO_PREPARED）
- [x] `agent-team-tick-local` — 30分間隔のため当日2回目は `min_interval_not_elapsed`（正常）
- [x] 人間 GO → `phase-go ack agent_team_tick` / `autonomous_orchestrator`
- [x] Phase E 実装（discord.read 実行・obsidian dry-run tick・ordered runner）
- [x] Task3 agent-team **local-only**（`liveApi:false` / 追加課金なし）
- [x] StackChan HOLD 解除 + Bot 再起動（`shikishima-stackchan-resume.mjs`）

## 6. 再開したいとき

音声: `STACKCHAN_HOLD` 解除 → `docs/shikishima/STACKCHAN_HOLD_2026-05-30.md`  
自律本番: `docs/shikishima/CONSTITUTIONAL_GO_ALL_2026-05-28.md` の手順どおり（別 GO）

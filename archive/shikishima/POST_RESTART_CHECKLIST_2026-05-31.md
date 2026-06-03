# 再起動後チェックリスト（しきしま完全自律）

Date: 2026-05-31  
前提: 人間が Bot / PC 再起動を実施済み

---

## 1. 読取専用診断（ローカル）

```powershell
Set-Location "c:\Users\81903\Desktop\プロジェクトファイル\hermes-desktop"

# 全体進捗 % + 停止要因
node scripts/shikishima-autonomy-status.mjs

# オーケストレータ制限一覧
node scripts/shikishima-orchestrator-gates-audit.mjs

# eval 滞留を human に落とす（任意）
node scripts/shikishima-autonomy-status.mjs --heal-eval

# WSL / agent / codex スナップショット更新
node scripts/shikishima-wsl-dev-preflight.mjs
```

期待:

- `automation: GO_PREPARED` · `decision=HOLD`（憲法は不変）
- `orchestrator: ON` · `autonomous_dev: ON`（scope GO 済みの場合）
- ワークフロー human 段は **idle 表示でも正常**（人間 ack 待ち）

---

## 2. SideBot 再起動（keepalive 復帰）

```powershell
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```

起動ログに以下があること:

- `[Workflow] keepalive 3min`
- `[Workflow] heal eval backlog`（eval 滞留時）
- `[Autonomy] post-restart overall=…%`

---

## 2b. Human GO 後の自律前進（CLI）

```powershell
node scripts/shikishima-human-go-advance.mjs --workflow-done
node scripts/shikishima-human-go-advance.mjs --workflow-done wf-xxxx --restart-bot
node scripts/shikishima-human-go-advance.mjs --continue-dev wf-xxxx   # B: 次 cycle dev
```

- human 段を `done` にし、orchestrator 1 tick・進捗 % 表示
- 監査: `.shikishima-memory/audit/human-go-events.jsonl`

---

## 3. Discord（司令部）

| コマンド | 用途 |
|----------|------|
| `!autonomy progress` | 全体 % · dev-pipeline 行 · 停止要因 |
| `!workflow status` | キュー各件の段階 |
| `!workflow done` | human 段を人間確認後に done |
| `!workflow continue` | **B 開発継続** — done/human から次 cycle の **dev** へ |
| `!workflow continue wf-xxxx` | 特定 ID のみ継続 |
| `!workflow done wf-xxxx` | 特定 ID のみ完了 |
| `!workflow resume` | 中断分 burst 再開 |
| `!dev-pipeline` | SHI-010–014 詳細チェーン |

---

## 4. キュー JSON（参考）

`.shikishima-memory/autonomous-workflow-queue.json`

- `stage: human` → **tick では進まない** · `!workflow done` 必須
- `eval` が 20分+ idle → 次回 Bot 起動時 `healWorkflowEvalBacklog` で human へ

---

## 5. 設計正本

[FULL_AUTONOMY_MASTER_DESIGN_2026-05-31.md](FULL_AUTONOMY_MASTER_DESIGN_2026-05-31.md)

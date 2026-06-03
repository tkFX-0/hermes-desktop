# しきしま自律「止まった」調査（2026-05-30）

## 結論（要約）

| 項目 | 状態 |
|------|------|
| オーケストレータ | **緩和 ON** · maintenance/dev.autonomous ルート **OK** |
| 本番 automation | **decision=HOLD**（意図的） |
| ワークフロー | `wf-mpsjl3fk` が **eval c6** で **60分+ idle** |
| 主因 | **SideBot 未稼働 or tick 未実行** + eval 後の human 遷移が未処理 |
| 旧ログ | `eval HOLD → auto loop dev` は **修正前**の挙動（現行は HOLD→**human**） |

## ワークフロー滞留の詳細

キュー: `.shikishima-memory/autonomous-workflow-queue.json`

- **stage**: `eval`（record 完了後、eval ステップ未実行 or 未保存）
- **cycle**: 6（`maxWorkflowCycles` 既定 5 → **次 tick で human へ落ちる**）
- **evalNeedsHuman**: true
- **lastDevOk**: false（開発レーン失敗繰り返し）
- **updatedAt**: 2026-05-30T17:14:18 以降更新なし

### なぜ「止まって見えるか」

1. **3分 keepalive** は SideBot プロセス内 — Bot 停止 = ワークフロー停止  
2. **eval 段**は 1 tick で 1 ステップ — dev 失敗ループ後、人間確認待ちに入る前で idle  
3. **human 段**は tick で `continue` され処理されない（**意図的に人間待ち**）

## 復旧手順

```powershell
# 1) 進捗・停止要因の表示
node scripts/shikishima-autonomy-status.mjs

# 2) eval 滞留を human に落とす（任意・推奨）
node scripts/shikishima-autonomy-status.mjs --heal-eval

# 3) Bot 再起動（keepalive 復帰）
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```

Discord:

- `!autonomy progress` — 全体 % + 停止要因  
- `!workflow status` — キュー各件 %  
- `!workflow settle` — 未完了を一括 human  

## 完全自律までの進捗（目安）

`node scripts/shikishima-autonomy-status.mjs` の **全体** 行:

| 内訳 | 重み | 内容 |
|------|------|------|
| Wave W1–W6 | 35% | W2–W4 done · W1/W5 open · W6 deferred |
| INVENTORY | 25% | SC/SHI/CHI/GAP 完了数 |
| Human-GO readiness | 20% | Track D / burn-in / agent team 等 |
| ワークフロー | 20% | キュー段階の平均 % |

**100% ≠ 本番 execute 解禁**（憲法 `execution=disabled` 不変）。

## オーケストレータが動いていても止まる理由

- `openGaps` / `decisionForAutomation=HOLD`  
- `autonomous_dev_scope_hold`（`SHIKISHIMA_AUTONOMOUS_DEV_GO` 未設定）  
- `workflow_tick_busy` / `workflow_item_running`  
- キューが **human** で人間未対応  

監査: `node scripts/shikishima-orchestrator-gates-audit.mjs`

---

## post-restart 状態（2026-05-31）

人間による再起動実施後の読取専用診断。

| 項目 | 結果 |
|------|------|
| 全体進捗 | **55%**（`shikishima-autonomy-status.mjs`） |
| automation | GO_PREPARED · gaps: 0 |
| orchestrator | ON（緩和）· maintenance/dev.autonomous OK |
| autonomous_dev | ON |
| ワークフロー | **86%** · 未完了 1件 |
| `wf-mpsjl3fk` | **stage=human**（heal 済 2026-05-30T18:13Z）· evalNeedsHuman · 人間 ack 待ち |
| 停止要因（参考） | WF idle 71min · orchestrator_tick>45min（SideBot 再起動直後は解消見込み） |

### コード修正（2026-05-31）

- **human 段**: tick が誤って `done` にしないよう `advanceWorkflowItem` を修正 · 完了は `!workflow done` / `completeWorkflowHuman` のみ
- **起動**: `healWorkflowEvalBacklog` + `[Autonomy] post-restart` ログ行
- **可視性**: `!autonomy progress` に dev-pipeline 1行

チェックリスト: [POST_RESTART_CHECKLIST_2026-05-31.md](POST_RESTART_CHECKLIST_2026-05-31.md)  
マスタ設計: [FULL_AUTONOMY_MASTER_DESIGN_2026-05-31.md](FULL_AUTONOMY_MASTER_DESIGN_2026-05-31.md)

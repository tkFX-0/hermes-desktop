# ワークフロー空回し・通知スパム修正（2026-05-30）

## 変更概要

| 課題 | 対策 |
|------|------|
| HOLD でも `autoLoopAfterEval` で dev に戻る | eval で **HOLD / needsHuman → human** のみ。自動ループは **GO_PREPARED** のみ |
| research/record 毎 tick の Discord 通知 | `workflow-discord-notify.mjs` — eval/human/done・dev→research のみ |
| keepalive / orchestrator / resume の二重 tick | `workflow-tick-lock.mjs` |
| dev 連続失敗・cycle 上限 | `maxDevFails` / `maxWorkflowCycles` で human |
| デプロイ直後の eval 滞留 | 起動時 `healWorkflowEvalBacklog`（devFail≥2 または cycle≥3） |

## Discord コマンド（司令部）

```
!workflow status
!workflow pause          # 全アクティブを一時停止
!workflow resume         # 再開 + 短い burst
!workflow settle         # アクティブをすべて human へ（空回し停止）
```

## 人手作業（コード反映後）

1. **Bot 再起動**（修正を SideBot に載せる）
   ```powershell
   node scripts/shikishima-process-preflight.mjs --clean --restart-dev
   ```
2. 司令部で `!workflow status` — `wf-mpsjl3fk` が **human** になっているか確認（起動時 heal または `!workflow settle`）
3. EA 本題を再開する場合:
   - `!dev-pipeline`
   - `!kaihatu EA研究: 2万ドル向けGithub候補を列挙・比較`
   - または `@つむぎ` に直接依頼
4. 監査（任意）:
   ```powershell
   node scripts/shikishima-workflow-resume-audit.mjs
   ```

## 安全不変（変更なし）

- `decision=HOLD` / `execution=disabled` / 本番 execute・ライブ売買・git push 不可
- `autoLoopAfterEval: true` でも **GO_PREPARED** 以外は human で停止

## 関連ファイル

- `scripts/lib/autonomous-workflow-engine.mjs`
- `scripts/lib/workflow-discord-notify.mjs`
- `scripts/lib/workflow-tick-lock.mjs`
- `scripts/shikishima-bot.mjs`（keepalive 通知フィルタ・bootstrap heal）

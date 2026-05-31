# オーケストレータ停止制限 洗い出し（2026-05-30）

## 確認コマンド

```powershell
node scripts/shikishima-orchestrator-gates-audit.mjs
node scripts/shikishima-orchestrator-gates-audit.mjs --json
```

Discord 司令部: `!orchestrator-gates` / `!gates`

## レイヤ一覧

| ID | 層 | 止まる条件 | 今回の緩和 |
|----|-----|-----------|------------|
| sidebot_loop_disabled | SideBot | orchestrator 未 ack かつ 緩和 OFF | **orchestratorRelaxed** |
| track_d_not_active | operational-release | Track D 三条件未達 | 緩和時 **activated 扱い** |
| phase_go_orchestrator | phase-go | `ack autonomous_orchestrator` なし | 緩和時 **不要** |
| autonomous_dev_scope_hold | execution-scope | AUTONOMOUS_DEV GO なし | execution-scope-go |
| hourly_cap | runtime caps | 12回/時 | 緩和時 **60回/時** |
| scheduler_cooldown | route cooldown | 60秒/route | dev **5–10秒** |
| agent_team_interval | agent-team | 最大360分 | 緩和時 **最大30分** |
| agent_team_disabled | operational-release | flag OFF | 緩和時 **ON** |
| live_api_blocked | billing | ALLOW_PAID_API=0 | **変更なし** |
| constitutional_discord_read | 憲法 | scope なし | **変更なし** |
| stackchan_voice | 憲法 | permitted GO なし | **変更なし** |
| dev_pipeline_disabled | env | DEV_PIPELINE=0 | ユーザー .env |
| workflow_queue_empty | workflow | キュー空 | `!workflow enqueue` |
| production_execute | 安全不変 | 常時 | **緩和対象外** |

## 緩和の有効化

```powershell
node scripts/shikishima-record-execution-scope-go.mjs
```

`.env.local` 追記:

```env
SHIKISHIMA_AUTONOMOUS_DEV_GO=1
SHIKISHIMA_ORCHESTRATOR_RELAXED=1
SHIKISHIMA_DEV_PIPELINE_ENABLED=1
```

`execution-scope-go.local.json` に `orchestratorRelaxed` が含まれる。

## 緩和後の tick 間隔

| 項目 | 通常 | 緩和 |
|------|------|------|
| SideBot orchestrator | 30分 | **15分** |
| dev.autonomous cooldown | 60秒 | **5秒** |
| workflow steps/tick | 1 | **3** |

## まだ止まるもの（意図的）

- 本番 `execution=enabled` / ライブ売買 / git push
- `discord.read`（憲法スコープ必須）
- `stackchan.voice`
- WSL 開発レーン未準備時の `!kaihatu` 失敗（workflow dev 段階）

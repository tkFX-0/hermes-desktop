# フェーズ別 GO 手順（2026-05-29）

人間が段階的に自律稼働へ進めるためのローカル手順。`.shikishima-memory/` のみ更新（git 対象外）。

## 前提

- `decision=HOLD` / 本番 `execution` はこの手順では変更しない
- Discord 二重送信対策は Bot 再起動後に有効

## フェーズ一覧

| フェーズ ID | 内容 | コマンド |
|-------------|------|----------|
| `discord_dedupe` | 送信デデュープ導入の記録のみ | `node scripts/shikishima-phase-go.mjs ack discord_dedupe` |
| `burn_in_human` | Burn-in 人間ACK | `node scripts/shikishima-phase-go.mjs ack burn_in_human` |
| `agent_team_tick` | Agent team 定期 tick ON | `node scripts/shikishima-phase-go.mjs ack agent_team_tick` |
| `autonomous_orchestrator` | SideBot が capped orchestrator を定期 spawn | `node scripts/shikishima-phase-go.mjs ack autonomous_orchestrator` |

## 確認

```powershell
node scripts/shikishima-phase-go.mjs list
node scripts/shikishima-human-go-readiness.mjs
```

## Bot 再起動（二重送信対策反映）

```powershell
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```

## 自律オーケストレータ（手動1回）

```powershell
node scripts/shikishima-autonomous-orchestrator.mjs
node scripts/shikishima-autonomous-runtime-tick.mjs autonomy.maintenance
node scripts/shikishima-agent-team-tick-local.mjs
node scripts/shikishima-agent-team-tick-local.mjs --live-api
```

`--live-api` は Groq/Claude を呼ぶ（課金あり）。省略時はローカル固定文のみ。

## FX 通知停止（トークン節約）

Discord: `!fx-off`  
再開: `!fx-on`

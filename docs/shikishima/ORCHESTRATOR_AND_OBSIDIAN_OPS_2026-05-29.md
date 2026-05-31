# Orchestrator + Obsidian ops (2026-05-29)

## 1. 自律オーケストレータ（30分）

前提: `node scripts/shikishima-phase-go.mjs ack autonomous_orchestrator` 済み +
`.shikishima-memory/operational-release.local.json` で `autonomousOrchestratorEnabled: true`。

SideBot 起動時:

- コンソール: `[Orchestrator] 起動 — 30分間隔`
- 初回 tick: 起動 **30秒後**
- 各 tick: `[Orchestrator] tick start` → `tick done exit=0 decision=GO_PREPARED ...`

手動・状態確認:

```powershell
node scripts/shikishima-autonomous-orchestrator.mjs
node scripts/shikishima-orchestrator-status.mjs
```

監査ログ（追記）: `.shikishima-memory/audit/orchestrator-tick.jsonl`

Discord 送信は **しない**（capped maintenance のみ）。

## 2. Obsidian vault パス

1. `.env.obsidian.example` を参照
2. `.env.local` に `OBSIDIAN_VAULT_PATH=` を Vault ルートで設定
3. 確認:

```powershell
node scripts/shikishima-obsidian-vault-check.mjs
```

Discord: `!obsidian-status`（しるべ 1通）

`!human-go` の `obsidian_write` 行は vault 存在で READY / PARTIAL を自動反映。

実際の Obsidian 書き込みは憲法GOスコープ + 人間GO の別ゲート。本番 `execution` は変更しない。

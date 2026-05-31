# Human GO — Batch Verification (2026-05-29)

実装は先行、**有効化はこのチェックリストで一括確認**する。

## 自動チェック（秘密なし）

```powershell
cd "C:\Users\81903\Desktop\プロジェクトファイル\hermes-desktop"

node scripts/shikishima-human-go-readiness.mjs
# （PowerShell でそのまま動く — TypeScript 不要）
node scripts/shikishima-wsl-dev-preflight.mjs
npx vitest run tests/hermes/zone/full-autonomy
```

Discord:

- `!human-go` — しるべが一覧表示
- `!governance` — 統制ログ（しるべ記録）
- `!dev-pipeline` — 開発パイプライン + ログイン状態

## B — 人間 GO（実装後にまとめて ON）

| ID | ファイル / 操作 | 確認内容 |
|----|-----------------|----------|
| track_d | `.shikishima-memory/operational-release.local.json` | `trackDGoAcknowledged` + execution + productionReady |
| constitutional | `.shikishima-memory/constitutional-go.local.json` | `allGoAcknowledged` + `scopes[]` |
| obsidian_write | 同上 scope `obsidian_write` | Vault パスは後で設定（Obsidian 別途） |
| burn_in_wall | `.shikishima-memory/burn-in-wall-clock.json` | `node scripts/shikishima-burn-in-tick-once.mjs` を3回 → `humanGoAcknowledged: true` |
| agent_team_tick | operational-release | `agentTeamTickEnabled: true`, `agentTeamTickIntervalMinutes` |

例: `docs/shikishima/OPERATIONAL_RELEASE_LOCAL_FILE_EXAMPLE.json`

## C — コード配線（本セッションで実装）

- 統制ログ上書きバグ修正
- 開発パイプライン → しるべ `governance-changelog`
- Obsidian vault パス統一モジュール
- Agent team スケジュール評価 + `shikishima-agent-team-tick-scheduled.mjs`
- WSL login プローブ（preflight）
- Burn-in wall-clock ローカル JSON

## D — 常に HOLD（変更しない）

- 無制限 Discord 自動送信
- Codex Worker 自動起動（WK-01）
- git push 自動化
- `rawValuesReported` は常に false

## スケジュール tick（GO 後）

```powershell
node scripts/shikishima-agent-team-tick-scheduled.mjs
```

Track D + `agentTeamTickEnabled` + 間隔経過時のみ実行。

## 戻し方

- operational-release / constitutional-go の local JSON を削除または `false`
- `burn-in-wall-clock.json` の `humanGoAcknowledged` を `false`

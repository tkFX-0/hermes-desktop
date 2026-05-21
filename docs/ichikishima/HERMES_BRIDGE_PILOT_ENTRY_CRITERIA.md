# Hermes Bridge Pilot — 次段階エントリー条件

**位置づけ**: **Hermes Bridge Pilot dry-run の次段階 Goal** を切るときの最低条件。**実 Hermes 本体接続は含めない**。  
**正のラベル**: `READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`（`getHermesBridgePilotReadiness`）。**Dry-run 多シナリオ通過の説明用文字列**: `READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN`（テストコード定数。readiness と混同しない）。  
**人手ゲート**: `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`

---

## 1. 必須条件（すべて満たす）

| # | 条件 |
|---|------|
| E-01 | `getHermesBridgePilotReadiness` が **`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`** になりうる（`DOC_REL` 欠落・`projectRoot` 無効ではないこと）。 |
| E-02 | **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`** が存在し、**承認またはレビュー記録が残っている**（保留なら理由と再レビュー計画がある）。 |
| E-03 | Final Review とコード正・Vitest が **同一リポジトリリビジョンで突合済み**（§8 に準拠）。 |
| E-04 | **`ipcMain.handle`** による Hermes／Registry 公開が **まだ無い**。 |
| E-05 | **実 Hermes 本体プロセスが起動していない**／接続処理が入っていない。 |
| E-06 | **外部通信**（任意 URL `fetch` 等）を Pilot ／ Bridge レビュー範囲で **増やしていない**。 |
| E-07 | **`npm install`／依存ロック変更なし**。 |
| E-08 | raw API（renderer／preload が `fs` / `child_process` 直など）が **許可リスト外で露出していない**（レビュー時 grep／目視）。 |
| E-09 | **Approval Queue** — Sandbox／設計対象での JSONL **追記・読取経路が維持**されている。 |
| E-10 | **Audit Log** — 同上。 |
| E-11 | **Review Mode** — 自動承認しない運用が文書／コードと一致している。 |
| E-12 | **`READY_FOR_LOCAL_FULL_LOOP`**（または同等の緑維持）— `LOCAL_PILOT_FULL_LOOP_SPEC.md` とテスト準拠。 |
| E-13 | **Local HTTP と Bridge の混載なし** — `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md` |
| E-14 | **Dry-run 次段階 Vitest が緑** — `tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts` がローカルで `passed`。スイート集約は `READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN`（**readiness ラベル `READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN` と独立**）を説明用文字列として使うこと。 |
| E-15 | **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` がゲート済み**。`DOC_REL` に含まれ readiness が **NOT_READY にならない**こと。**実 Hermes 起動無し**。 |

### Preflight — 実接続 Pilot 直前（文書のみ・追補）

| # | 条件 |
|---|------|
| E-16 | **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`** が存在し、Go/No-Go・停止条件が **レビュアに提示可能**。 |
| E-17 | **`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`** で **最小読み書き経路・禁止事項・rollback** が明示。 |
| E-18 | **`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`** と **Payload §15**：**validated を Snapshot/UI/ログへ丸ごと渡さない**ことが明記。 |
| E-19 | **Receiver**：`HermesBridgeInMemoryReceiverQueue`（または後継）が **TTL／retry／duplicate／maxQueueItems** と **production fail-closed** を満たす（Preflight と矛盾しない）。 |
| E-20 | **partial**：production lane で partial 系ノブ **拒否**。forbidden が production で **`partialEligible` で誤進行しない**ことを Vitest で担保済みまたは人手確認済み。 |
| E-21 | **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §11（Preflight）** を確認（未チェックなら実接続 Pilot に **進まない**）。 |
| E-22 | **Connection Adapter Stage 0**: `HERMES_CONNECTION_ADAPTER_CONTRACT.md`。`hermes-connection-adapter.ts`、`hermes-connection-adapter.test.ts` / `hermes-bridge-readiness-summary.test.ts` が緑。**listen・IPC・実プロセス起動無し**。 |
| E-23 | **Stage 1 Sandbox File Handoff**: `HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`（**marker 名・衝突 policy・手動 cleanup Runbook** 含む）。`hermes-file-handoff-adapter.ts`、`tests/.../hermes-file-handoff-adapter.test.ts` が緑（**同名再試行でも marker 上書きなし**。**stdin/stdout・実プロセス・listen・IPC 新增なし**）。 |
| E-24 | **Real Pilot Minimal Pipeline（統合経路・主経路は実プロセス無し）**: `HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`。`hermes-real-pilot-minimal.ts` / `hermes-real-pilot-summary.ts` と `tests/.../hermes-real-pilot-minimal*.test.ts` が緑。**主経路**は **listen／IPC 新增なし**。**`hermes-real-process-adapter.ts`** は **ミニ実装・既定 disabled**（**`execFile` のみ**・`spawn`/`exec`/shell **禁止**。Vitest は fake／シミュ）。※ **実 Hermes 接続 READY・Controlled Run 済みとはみなさない**。 |
| E-25 | **Real Hermes Process Adapter Final Gate**: `HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md` を読了し、**`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §12** のチェックが **レビュアにより埋められる用意がある**。**`execFile` 安全枠**（allowlist／timeout／出力上限／env 最小等）がコードと整合。**Controlled Pilot Run** は **別ユーザー Goal**。 |

**補足（2026-05-03）**：**Controlled Pilot 実機前準備**（discovery／runbook／テンプレ、`hermes-controlled-pilot-config`／`-preflight`／`-summary`・Vitest）が追加済み。**実機 1 回は未実施**。E-25 の「別 Goal」の手前で、ユーザーが実行ファイルパス・`allowedExecutableId`・固定 argv・signoff メタなどをすべて提示するまで **実実行に進めない**。

## 2. まだ禁止（次段階でも引き続き）

- 実 Hermes **完全接続**／常駐 IPC
- **実行系 IPC**（`approval.execute.*`、`runHermes`、`raw*` チャネル）
- **localhost Dashboard API** に Hermes 操作入力を載せる
- **承認済みキュー項目の自動実行**
- EA/MT5／memory DB 本番恒久化／`.env`・secrets を Bridge 経路へ

---

## 3. 次段階で「してよい」典型（別 Goal で明示）

- sandbox 範囲内での **Pilot シナリオ拡張**（許可リスト内のみ）
- ドキュメントの **細部追随**と **テストの追加**（Hermes `./tests/ichikishima/hermes/*` に限定することを推奨）

---

関連: `HERMES_BRIDGE_FINAL_REVIEW.md`、`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`、`HERMES_BRIDGE_PILOT_SPEC.md`、`HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`、`NEXT_GOALS.md`

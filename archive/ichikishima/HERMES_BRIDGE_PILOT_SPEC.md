# Hermes Bridge Pilot 仕様（実 Hermes 本体なし）

**位置づけ**: Hermes 「実ランタイム」を **起動せず**、Bridge レイヤだけで許可経路／承認キュー／監査／Review への流れを検証するローカル・サンドボックス用パイロット。

**正のコード入口**: `runHermesLocalPilotTask`（`hermes-local-pilot.ts`）、操作分類 `routeHermesOperation` / `validateHermesBridgeOperation`（`hermes-bridge.ts`）。フルループ検証は `runLocalPilotFullLoop`（`local-pilot-full-loop.ts`）。

---

## 1. 目的

- Bridge が **raw fs / raw shell / raw network / raw git** を要求しても受け入れない。
- **read / write** は Autonomy Zone API（`readZoneFile` / `writeZoneFile`）にのみ流す。
- **delete / execute / network / git** は **実行せず**、明示ブロック API → **Approval Queue**（JSONL 追記）へ。
- **dependency_install**（既定）と **external_ai_escalation** は **実行せず** `createApprovalQueueItem` 経由で承認キューへ。
- **memory_db / MT5 / env_secret / raw\_\*** / policy_blocked の dependency_install は **forbidden_boundary** で早期失敗。
- **Audit Log**（JSONL 追記）と **Approval Report**（マスク済み）を生成し、`evaluateReviewMode` へ渡せるテキストを残す。

## 2. 実 Hermes なしで検証する理由

- 外部通信・長寿命プロセス・Renderer 境界を増やさず、**契約とデータ経路**だけを先に固定する。
- 実本体接続は `HERMES_BRIDGE_FINAL_REVIEW.md` の人手ゲート後の別 Goal。

## 3. 入力形式

`RunHermesLocalPilotTaskInput`（抜粋）:

| フィールド | 説明 |
|-----------|------|
| `projectRoot` / `zoneRoot` | Zone 検証用。典型: `sandbox/hermes-autonomy-zone`。 |
| `taskId` / `title` / `description` | Bridge タスク記述。 |
| `requestedOperations` | `HermesBridgeOperation[]`。省略時はサンプル read/write のみ。 |
| `persistApprovals` / `persistAudits` | true 時、`dateUtc` と承認・監査サブディレクトリが揃えば JSONL 追記。 |
| `sampleInputRelativePath` / `outputRelativePath` | 既定のサンプル read と結果 write 先（Zone 相対）。 |
| `continueAfterForbiddenClassification` | `true` のとき **forbidden が混在しても** zone 標準 read/write と分類ループまで進め、**forbidden は実行せず**記録する（mixed dry-run 専用。既定は `false` で従来どおり早期 `failed`）。 |

## 4. 許可操作（allowed_zone_candidate）

- `zone_read` → `readZoneFile`
- `zone_write` → `writeZoneFile`（policy / path-guard に従う）

## 5. ブロック操作（blocked_zone_sensitive）

実行はせず、スタブ API で拒否し、該当時は **Approval Queue** へ:

- `zone_delete` → `deleteZoneFile`
- `execute_shell` → `executeCommand`
- `network_http` → `requestNetworkAccess`
- `git_operation` → `requestGitOperation`

## 6. 承認キュー専用（bridge_requires_approval）

自動実行しない。`createApprovalQueueItem` のみ:

- `dependency_install`（`disposition` 省略または `approval_queue`）
- `external_ai_escalation`

`dependency_install` + `disposition: "policy_blocked"` は **forbidden_boundary**（キューに載せない）。

## 7. 絶対禁止（forbidden_boundary）

全文拒否。パイロットは（既定）**早期 `failed`**（`forbiddenOperations` に記録）:

- `raw_fs`, `raw_child_process`, `raw_network`, `raw_git`
- `memory_db_access`, `mt5_ea_access`, `env_secret_read`, `production_config_write`
- `dependency_install` + `policy_blocked`

`continueAfterForbiddenClassification === true` のときは **早期 return しない**。各 forbidden はループで **`forbidden_boundary:<reasonCode> (no execution)`** として記録する。zone read/write が成功し forbidden が残る場合の集約ステータスは **`partial`**（完了は `completed`）。

## 8. Approval Queue への流れ

- ブロック系: `createApprovalQueueItemFromBlockedDelete` / `FromBlockedOperation`
- Bridge 専用: `createApprovalQueueItem`（`dependency_install` / `external_escalation`）
- 完了時レポート: `createApprovalQueueItemFromReport`（`createApprovalReport` 後）

永続化は `saveApprovalQueueItem`（追記のみ）。**承認後の自動実行エンジンは存在しない**。

## 9. Audit Log

- Zone 操作: `normalizeAuditEvent`（`zone_audit_candidate`）
- キュー追記成功時: `saveApprovalQueueItem` が返す監査レコードを `saveAuditLog`

## 10. Review Mode

- `finalSummary` および変更ファイル一覧を `evaluateReviewMode` に渡し、`createApprovalReport` で **要約・マスク済み**の Approval Report を生成。

## 11. Final report 形式

- `HermesLocalPilotResult`: `status` は **`completed` / `partial` / `failed`**（`partial` は zone read/write 成功後も forbidden が残った mixed-only）。`bridgeTask`, `bridgeReport`, `operations[]`, `approvalItems`, `approvalReport`, `auditRecords`, `finalSummary`, `forbiddenOperations`, **`requiresUserApproval: true`**, **`autoExecutable: false`**
- 統括: `createIchikishimaDecisionPackage`（`local-pilot-full-loop`）

## 12. 停止条件（人間へエスカレーション）

- Forbidden が 1 件でも混ざったリクエストで **早期 return**（既定。サンプル read/write 前に失敗可）。**mixed dry-run 用フラグ**で継続する場合は §7 のとおり分類のみ。
- `HERMES_BRIDGE_FORBIDDEN_APIS` に相当する経路がコードに現れた。
- 承認後自動実行・実 Hermes 常駐起動・任意 `fetch` を要求する変更。

## 13. Readiness ラベル

`getHermesBridgePilotReadiness`: ゲート文書が揃い `projectRoot` が有効なら **`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`**。欠落時は `NOT_READY`。

**補助（readiness とは独立）**: 多シナリオ dry-run スイートが Vitest で緑のとき、文書・将来ダッシュボード向けに **`READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN`**（定数 `HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL`）を参照できる。実装: `hermes-bridge-pilot-dry-run.ts`、`tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts`。

必須文書（`docs/ichikishima/`）— `projectHasHermesBridgeGateDocs` / `DOC_REL`:

- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`
- `CONTROL_CENTER_OWNERSHIP_MODEL.md`
- `HERMES_BRIDGE_OWNERSHIP_MODEL.md`
- `HERMES_BRIDGE_FINAL_REVIEW.md`
- `HERMES_BRIDGE_PAYLOAD_CONTRACT.md`（Bridge ingress JSON、`payloadSchemaVersion: hermes-bridge-payload/v1` と検証のみ）
- `HERMES_BRIDGE_RECEIVER_QUEUE.md`（インメモリ受信・Lane・TTL／試行上限）
- `HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md`
- `HERMES_BRIDGE_PILOT_SPEC.md`（本書）
- `HERMES_BRIDGE_OPERATION_MATRIX.md`

**`DOC_REL` には含まれないが、Hermes 実ランタイム接続前に参照：`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`。**（現在の **`getHermesBridgePilotReadiness`** の結果には **含めない**。）

関連: `HERMES_BRIDGE_CONTRACT.md`、`HERMES_BRIDGE_API_REGISTRY.md`、`CONTROL_CENTER_V1_API_CONTRACT.md`、`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`

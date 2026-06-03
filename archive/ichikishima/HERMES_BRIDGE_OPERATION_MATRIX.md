# Hermes Bridge — Operation Matrix（Pilot / 設計用）

**目的**: Hermes Bridge が受理しうる操作種別ごとに、許可・ブロック・承認・監査・テストを一行で追えるようにする。**実 Hermes / UI / localhost API は別 Goal。**

---

## 凡例

| 列 | 意味 |
|----|------|
| **Disposition** | `allowed`（Zone API 経由実施可）／`blocked_stub`（スタブで拒否＋キュー可）／`approval_only`（実行せずキューのみ）／`forbidden`（境界拒否） |
| **Routed API** | Pilot 実行時に呼ぶ関数（許可リストは `HERMES_BRIDGE_ALLOWED_APIS`） |
| **Audit** | 主たる監査イベントの起因（詳細は `audit-log.ts`） |
| **Risk** | 設計上の体感リスク |

---

## マトリクス

`routeHermesOperation` の **`tier`** は Disposition と 1 対 1 で対応する。

| Operation | Disposition（凡例） | **`routeHermesOperation` tier** | Routed API | Approval Queue | Audit / 備考 | Expected pilot status | Test file | Risk |
|-----------|---------------------|------------------|------------|----------------|----------------|-------------------------|-----------|------|
| zone_read | allowed | **`allowed_zone_candidate`** | `readZoneFile` | 典型なし（レポートのみ可） | `zone_audit_candidate`（read） | `completed` 前提の一要素 | `hermes-local-pilot.test.ts`, `hermes-bridge-pilot.test.ts` | low |
| zone_write | allowed | **`allowed_zone_candidate`** | `writeZoneFile` | 典型なし | `zone_audit_candidate`（write） | 同上 | 同上 | medium |
| zone_delete | blocked_stub | **`blocked_zone_sensitive`** | `deleteZoneFile` | `createApprovalQueueItemFromBlockedDelete` | deny + approval キュー | `completed` で項目増 | `hermes-local-pilot.test.ts` | high |
| execute_shell | blocked_stub | **`blocked_zone_sensitive`** | `executeCommand` | `FromBlockedOperation` | execute denied | 同上 | `hermes-local-pilot.test.ts` | critical |
| network_http | blocked_stub | **`blocked_zone_sensitive`** | `requestNetworkAccess` | `FromBlockedOperation` | network denied | 同上 | `hermes-local-pilot.test.ts` | critical |
| git_operation | blocked_stub | **`blocked_zone_sensitive`** | `requestGitOperation` | `FromBlockedOperation` | git denied | 同上 | `hermes-local-pilot.test.ts` | critical |
| dependency_install（既定） | approval_only | **`bridge_requires_approval`** | `createApprovalQueueItem` | はい | save 時 `approval_queue_item_created` | キュー増・実行なし | `hermes-bridge-pilot.test.ts` | high |
| dependency_install policy_blocked | forbidden | **`forbidden_boundary`** `DEPENDENCY_INSTALL_POLICY_BLOCKED` | （なし） | いいえ | Pilot 早期 `failed` | `failed` | `hermes-bridge-pilot.test.ts` | high |
| external_ai_escalation | approval_only | **`bridge_requires_approval`** | `createApprovalQueueItem` | はい（`external_escalation`） | 同上 | キュー増・実行なし | `hermes-bridge-pilot.test.ts` | high |
| raw_fs / raw_child_process / raw_network / raw_git | forbidden | **`forbidden_boundary`**（`RAW_*_FORBIDDEN`） | （なし） | いいえ | Forbidden 検知のみ | `failed` | `hermes-local-pilot.test.ts` | critical |
| memory_db_access | forbidden | **`forbidden_boundary`** `MEMORY_DB_FORBIDDEN` | （なし） | いいえ | 同上 | `failed` | `hermes-bridge-pilot.test.ts`, `hermes-bridge.test.ts` | critical |
| mt5_ea_access | forbidden | **`forbidden_boundary`** `MT5_EA_FORBIDDEN` | （なし） | いいえ | 同上 | `failed` | 同上 | critical |
| env_secret_read | forbidden | **`forbidden_boundary`** `ENV_SECRETS_FORBIDDEN` | （なし） | いいえ | 同上 | `failed` | 同上 | critical |
| production_config_write | forbidden | **`forbidden_boundary`** `PRODUCTION_CONFIG_FORBIDDEN` | （なし） | いいえ | 同上 | 同上（Full Loop が forbidden 混入で早期失敗でも可） | `hermes-bridge.test.ts` | critical |

---

## Forbidden API パターン対応（`HERMES_BRIDGE_FORBIDDEN_APIS`）

設計上、上記 `forbidden` 行は次のパターンにマップする:

- raw_fs_direct / raw_child_process_or_shell / raw_fetch_http_or_socket / raw_git_cli_or_lib
- memory_db_sqlite_direct / mt5_ea_surface / secrets_dotenv_or_keys / production_config_unsafe_write  
- （依存）`git_push_or_unapproved_dependency_install` — **実装はキューまたは禁止方針で表現**し、自動 install は行わない

---

## Pilot 結果の不変条件

- **`requiresUserApproval: true`** / **`autoExecutable: false`**（`HermesLocalPilotResult`）
- **`status`** は `completed` / `failed` に加え、`continueAfterForbiddenClassification` 利用時は **`partial`**（forbidden を分類のみで残し zone I/O は成功）を取りうる。代表テスト: `hermes-bridge-pilot-dry-run.test.ts`。
- **Dry-run 結果 wire 型**（`HermesBridgePilotScenarioResult` 等）は **`kind` と短い `summary` のみ**。Zone ファイル本文・シークレット・raw API 関数列挙を載せない。
- **`shouldSpeak`** は統括レイヤ／Review の組み合わせで **発話しない**運用とするが、Pilot 結果型の直下フィールドではない場合あり（Full Loop で `shouldSpeak: false` を維持）

---

## inbound Payload v1（Hermes 想定 JSON・検証のみ）

- 別紙 **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`**。コードは **`validateHermesBridgePayload`**（fs / Hermes 起動なし）。
- **`partialEligible`** は **`interactionMode==="dry_run"` でなければ false**（本番 fail-closed）。
- Control Center 表示は **`readinessLabel` と `scenarioSuiteLabel` を別キー／別文言に分離する**運用が推奨。

---

更新時は **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`** / **`HERMES_BRIDGE_API_REGISTRY.md`** / **`HERMES_BRIDGE_FINAL_REVIEW.md` §8** / `routeHermesOperation` の分岐、`HERMES_BRIDGE_REGISTRY_IPC_*` と突合せる。

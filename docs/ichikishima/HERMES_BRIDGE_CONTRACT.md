# Hermes Bridge Contract

本書は **Hermes 本体を起動しない** 前提で、Hermes から呼び出してよい API（型・分類）と呼んではいけない API を固定する。

## 1. 目的

- Hermes Desktop 本体とは無関係な **ローカル TypeScriptスタブ (`hermes-bridge.ts`)** が受け側になる。
- 境界を越える操作が **自動実行されることは無い** （常にユーザー承認を要求）。

## 2. Hermes が呼んでよい候補（境界APIとの対応）

Hermes側の抽象的な名前と、リポジトリ内での関数名との対応例:

| 契約語 | autonomy-zone / approval / audit での実体 |
|--------|--------------------------------------------|
| `readZoneFile` | `readZoneFile` |
| `writeZoneFile` | `writeZoneFile` |
| `deleteZoneFile`（ブロック用） | `deleteZoneFile` |
| `requestDeleteBlocked` 相当 | HermesBridge `zone_delete` + autonomy `deleteZoneFile` で受理しブロック候補化 |
| `requestExecuteBlocked` | `executeCommand` |
| `requestNetworkBlocked` | `requestNetworkAccess` |
| `requestGitBlocked` | `requestGitOperation` |
| `createApprovalQueueItem*` | Approval Queue adapters & `saveApprovalQueueItem` |
| `createApprovalReport` | `createApprovalReport` |
| `saveAuditLog` | `saveAuditLog` |

Hermes が **HermesDesktop/Electron メインプロセスを直接叩くこと** は本契約の前提に **含めない**。将来はプロセス間メッセージで **上表の関数にプロキシ** させるのみ。

## 3. Hermes が呼んではいけないもの（forbidden_boundary）

HermesBridge `kind` が以下へ分類される操作:

- `raw_fs`, `raw_child_process`, `raw_network`, `raw_git`
- `memory_db_access`, `mt5_ea_access`, `env_secret_read`, `production_config_write`

## 4. 安全敏感操作 (`blocked_zone_sensitive`)

`zone_delete`, `execute_shell`, `network_http`, `git_operation` は **`routeHermesOperation` で敏感層**。  
Hermes側は実行完了を期待せず、`autonomy-zone` のブロック API へ委譲し、queue/audit 候補を得る。

## 5. スタブ公開関数

| 関数 | 役割 |
|------|------|
| `createHermesBridgeTask` | task メタと要求操作配列の束。 |
| `validateHermesBridgeOperation` / `routeHermesOperation` | 分類。 |
| `createHermesBridgeReport` | 人間向けの tier ラベル集約。 |

## 6. 停止条件

以下は **本契約の範囲外**（別タスクでレビュー必須）:

- 実プロセス起動、外部URLコール、`.env` 読み取り、メモリアクセスDB接続、gRPC メッセージング。

---

仕様詳細コード: `src/main/ichikishima/hermes/hermes-bridge.ts`

本体接続直前の総合ゲート（許可API・禁止・停止条件・チェックリスト）は **`HERMES_BRIDGE_FINAL_REVIEW.md`** を参照すること。

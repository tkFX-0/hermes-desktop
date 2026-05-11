/**
 * Hermes Bridge 許可／禁止 API 識別子の **単一の参照元**（コード上の正）。
 * 本配列を編集したら `HERMES_BRIDGE_API_REGISTRY.md` と `HERMES_BRIDGE_FINAL_REVIEW.md` §1–2 / **§8 チェックリスト** / **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`** の人間向け記述と突合せる。
 * 実Hermes接続・IPC露出は別 Goal。
 */

export const HERMES_BRIDGE_ALLOWED_APIS = [
  "readZoneFile",
  "writeZoneFile",
  "deleteZoneFile",
  "executeCommand",
  "requestNetworkAccess",
  "requestGitOperation",
  "createApprovalRequest",
  "createHermesBridgeTask",
  "validateHermesBridgeOperation",
  "routeHermesOperation",
  "createHermesBridgeReport",
  "runHermesLocalPilotTask",
  "createApprovalQueueItem",
  "normalizeApprovalQueueItem",
  "createApprovalQueueItemFromReport",
  "createApprovalQueueItemFromBlockedDelete",
  "createApprovalQueueItemFromBlockedOperation",
  "saveApprovalQueueItem",
  "readApprovalQueueItems",
  "saveAuditLog",
  "normalizeAuditEvent",
  "createAuditLogRecord",
  "evaluateReviewMode",
  "reviewHermesReport",
  "createApprovalReport",
  "processHermesPilotResult",
  "createIchikishimaDecisionPackage",
  "extractMemoryCandidates",
] as const;

export type HermesBridgeAllowedApiId =
  (typeof HERMES_BRIDGE_ALLOWED_APIS)[number];

/** §2 禁止パターンを安定スラッグ化（UI / readiness 応答用。本文は増やさない）。 */
export const HERMES_BRIDGE_FORBIDDEN_APIS = [
  "raw_fs_direct",
  "raw_child_process_or_shell",
  "raw_fetch_http_or_socket",
  "raw_git_cli_or_lib",
  "memory_db_sqlite_direct",
  "mt5_ea_surface",
  "secrets_dotenv_or_keys",
  "production_config_unsafe_write",
  "git_push_or_unapproved_dependency_install",
  "post_approval_auto_execution_bridge",
  "unmediated_delete_execute_network_git",
] as const;

export type HermesBridgeForbiddenApiPatternId =
  (typeof HERMES_BRIDGE_FORBIDDEN_APIS)[number];

/** Pilot / 接続前に人間が確認する短文要件（readiness の `requiredHumanReviews` で再利用可）。 */
export const HERMES_BRIDGE_READINESS_REQUIREMENTS = [
  "HERMES_BRIDGE_API_REGISTRY / HERMES_BRIDGE_ALLOWED_APIS が Final Review とコードで一致していること",
  "Renderer / UI に raw fs / shell / network / git を渡さない設計であること",
  "sandbox dummy に限定し Zone 外パスに触れないこと",
  "承認済みでも自動実行しないこと",
  "ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP / Ownership Model で IPC 候補と混線境界が固定されていること",
] as const;

/**
 * 将来 preload に載せうる論理 IPC 名（**1 チャネル・状態要約のみ**。実行権限ではない。**まだ invoke しない**）。
 * 返却は **`getHermesBridgePilotReadiness` 相当の要約**: label、blockers、counts、requirements、短文 warnings 等。**allowed/forbidden の完全一覧は載せない**。
 * `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` / `CONTROL_CENTER_V1_IPC_CONTRACT.md` §9 と同期。
 */
export const HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS = [
  "hermesBridge.registry.getReadiness",
] as const;

/**
 * IPC に載せない論理チャネル（Pilot 後段レビューや一覧誤解防止のため当面禁止）。
 */
export const HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS = [
  "hermesBridge.registry.getAllowedApis",
  "hermesBridge.registry.getForbiddenApis",
  "hermesBridge.pilot.getReadiness",
  "hermesBridge.pilot.run",
  "hermesBridge.pilot.execute",
  "hermesBridge.operation.route",
] as const;

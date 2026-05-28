# Ichikishima / Hermes Autonomy Zone Implementation Handoff

## 1. 現在の実装済み範囲

現在は、Hermes Autonomy Zoneの安全境界を段階的に実装している。

実装済み:

- Step 1: Zone root設定。
- Step 2a: path-guard / denylist分離。
- Step 2b: read permission check API。
- Step 2c: read wrapper仕様書とテスト設計。
- Step 2d: read wrapper型定義と未実装スタブ、仕様テスト。
- Step 2e: readZoneFile最小実読み取り。
- Step 2f: read結果の監査イベント候補。
- Operation Protocol: Cursor永続ルール、AGENTS、ChatGPTレビュー依頼フォーマット。
- Step 3a: write wrapper仕様書とテスト設計。
- Step 3b: write-policy判定API。
- Step 3c: write wrapper型定義と未実装スタブ、仕様テスト。
- Step 3d前: writeZoneFile最小実装前の設計照合。
- Step 3e: writeZoneFile最小実装。
- Step 3f: write監査イベント候補の補強。
- Step 4: delete明示ブロック。
- Step 5: execute / network / git明示ブロック。
- Step 6: Approval Queue Core（`sandbox/hermes-autonomy-zone/approval/` への JSONL 追記のみ、`ApprovalQueueItem`、報告書/ブロッカーからの候補生成、監査イベント `approval_queue_*` 連携）。
- Step 7: 最小smoke test。
- Step 8: Runbook作成。
- Step 9: Local Pilot Workspace準備。
- Step 10: Local Pilot Smoke Test。
- Step 11: Readiness Checklist。
- Step 12: Hermes Bridge 契約レイヤ (`hermes-bridge.ts`) / Hermes Local Pilot (`runHermesLocalPilotTask`) / イツキシマ統括 (`processHermesPilotResult`) / Local Pilot Full Loop (`runLocalPilotFullLoop`) / read-only Control Center モデル (`buildControlCenterReadonlyStatus` + `ICHIKISHIMA_READONLY_DOC_PATHS`) / **`HERMES_BRIDGE_FINAL_REVIEW.md`（本体接続前ゲート・文書）** / **`CONTROL_CENTER_V1_API_CONTRACT.md`（read-only Dashboard RPC 境界の文書ゲート）** / **`HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md`** / **read-only Data Provider**（`control-center-data-provider.ts`、`getHermesBridgePilotReadiness`、`approval-queue-summary.ts`、`audit-log-summary.ts`。UIウィンドウ・IPC公開・実Hermes起動なし）。
- Phase I: Ichikishima Shadow Mode準備。
- Goal: 実運用前コア設計・型・安全側スタブ・レビュー資料整備。
- Ichikishima監査ログ: `AuditLogRecord` 列挙、`normalizeAuditEvent` / `createAuditLogRecord`、`maskAuditSensitiveText`、`saveAuditLog`（`audit-save.ts`: JSONL・追記のみ・Zone 内検証）、`tests/ichikishima/audit/audit-log.test.ts`。

未実装:

- delete実行。
- execute実行。
- network実行。
- git実行。
- 承認キュー項目の**実行エンジン**（自動 delete / execute / network / git への橋渡し）。
- 監査ログの **SQLite / userData 既定ディレクトリ化 / 自動ローテーション**/ 外部送信。
- UI。
- Hermes本体連携。
- イツキシマ自動発話。
- イツキシマ通知。
- memory DB自動更新。

今回Goalで追加済み:

- Hermes本体連携前レビュー基盤。
- イツキシマReview Mode仕様、型、安全側判定、テスト。
- 話す価値スコア仕様、型、安全側判定、テスト。
- Memory Governance仕様。
- Agent Team Architecture。
- Local / Cloud Escalation Policy。
- Agent Visualization Implementation Plan。
- Suppressive Agent Architecture。
- NEXT_GOALS。
- GOAL_COMPLETION_REPORT。
- `AUDIT_LOG_SPEC.md`、`AUDIT_LOG_TEST_PLAN.md`。
- `src/main/ichikishima/audit/`（`audit-log.ts` / `audit-save.ts` / `index.ts`）。
- `tests/ichikishima/audit/audit-log.test.ts`。
- `APPROVAL_QUEUE_SPEC.md`。
- `src/main/ichikishima/approval/`（`approval-queue.ts` / `approval-queue-store.ts` / `approval-queue-from-report.ts` / `approval-queue-blocks.ts`、既存 `approval-report.ts` を含む）。
- `tests/ichikishima/approval/*.test.ts`（queue / store / adapters / pilot）。
- `sandbox/hermes-autonomy-zone/approval/`（README / `.gitkeep`）。
- `AuditLogRecord.kind` 拡張（`approval_queue_item_created` / `approval_queue_status_changed`）。
- Ichikishima Control Center（**V0: ドキュメントのみ**）: `CONTROL_CENTER_SPEC.md`、`CONTROL_CENTER_ARCHITECTURE.md`、`CONTROL_CENTER_ROOMS.md`、`CONTROL_CENTER_PIPELINES.md`、`CONTROL_CENTER_IMPLEMENTATION_PLAN.md`。中核は**完全独自の Windows アプリ**構想。`hermes-desktop` は**参考のみ**（取り込み・依存にしない）。
- **`src/main/ichikishima/hermes/`**: `HERMES_BRIDGE_CONTRACT.md` と整合する **`hermes-bridge.ts`**、dummy runner **`hermes-local-pilot.ts`**、**dry-run runner `hermes-bridge-pilot-dry-run.ts`**、`tests/ichikishima/hermes/`。
- **`src/main/ichikishima/orchestrator/`**: `ICHIKISHIMA_ORCHESTRATOR_SPEC.md` と **`ichikishima-orchestrator.ts`**（発話なし／memory DB 未保存）。
- **`src/main/ichikishima/pilot/`**: **`local-pilot-full-loop.ts`**（`READY_FOR_LOCAL_FULL_LOOP` 判定）。
- **`src/main/ichikishima/control-center/control-center-status.ts`**: READ-ONLY ステータスモデルのみ（単独製品ウィンドウの母体ではなく型レイヤ）。**Electron Renderer に read-only App Shell が別途あり**（実行系なし・`CONTROL_CENTER_APP_SHELL_UI_SPEC.md`）。
- **`src/main/ichikishima/control-center/control-center-data-provider.ts`**: `getControlCenterReadonlyData` ほか V1 read-only 集約（危険操作・本文・secrets を返さない）。
- **`src/main/ichikishima/approval/approval-queue-summary.ts`**: キュー集計のみ（JSONL 本文を UI 向けに増幅しない）。
- **`src/main/ichikishima/audit/audit-log-summary.ts`**: audit JSONL の集計のみ（`contentIncluded:false` 行のみ採用、壊行は `parseFailures`）。
- **`src/main/ichikishima/hermes/hermes-bridge.ts`**: `dependency_install`（`approval_queue` / `policy_blocked`）および `external_ai_escalation` を **`bridge_requires_approval`** として分類。`routeHermesOperation` が `forbidden` / `blocked_zone_sensitive` / `bridge_requires_approval` / `allowed` を返す。
- **`src/main/ichikishima/hermes/hermes-local-pilot.ts`**: 上記を承認キューへ積む（自動実行なし）。forbidden は既定で早期 `failed`。**`continueAfterForbiddenClassification`** により mixed は **`partial`** まで分類。
- **`src/main/ichikishima/hermes/hermes-bridge-pilot-dry-run.ts`**: Scenario A〜E の **実 Hermes なし dry-run**。`READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN` は **Vitest が緑のとき説明用文字列として付与される定数ラベル**（readiness とは別）。
- **`src/main/ichikishima/hermes/hermes-bridge-payload.ts`**: inbound JSON **`validateHermesBridgePayload`**／`partialEligible` は **`interactionMode==="dry_run"` 以外では常に false**。実 Hermes 未接続。
- **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`**: **`DOC_REL` に含まれる ingress 契約文書**（`payloadSchemaVersion` は **`hermes-bridge-payload/v1`**）。readiness と Control Center で `scenarioSuiteLabel` と `readinessLabel` を **別々に表示する**運用が推奨（UI の短文は `CONTROL_CENTER_STATIC_SHELL_JSON_GUIDELINES.md`）。
- **`HERMES_BRIDGE_RECEIVER_QUEUE.md`**: **`DOC_REL` に含まれる**。`HermesBridgeInMemoryReceiverQueue`（Lane / TTL・試行上限・`dequeueOrUndefined` / `acknowledgeHandled`）。実 Hermes・IPC 未接続。
- **`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`**: Receiver の **validated をログ/UI/Snapshot へ丸ごと渡さない**等の **伝搬契約**。`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15 と整合。
- **`HERMES_CONNECTION_ADAPTER_CONTRACT.md`**: Hermes **接続口の段階契約**（Stage 0〜3）。**Stage 0**: `hermes-connection-adapter.ts`（**`in_memory` のみ**、`validateHermesBridgePayload` 必須、Receiver 前段）。`hermes-bridge-readiness-summary.ts` — Control Center 向け **安全要約**（`allowedApis` / `forbiddenApis` の**詳細配列**および validated 全文を返さない）。**実 Hermes・child_process・socket・listen 無し**。テスト `hermes-connection-adapter.test.ts` / `hermes-bridge-readiness-summary.test.ts`。
- **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`**: **Stage 1 Sandbox File Handoff**。`hermes-file-handoff-adapter.ts` — **`handoff/inbox` 平坦 `.json` のみ**、`processed`/`rejected` に **timestamp 付き `.marker.json` のみ**追加（**上書き禁止**・競合時 **`.1` 連番**。`HANDOFF_MARKER_COLLISION_MAX_ATTEMPTS` 超過は `HANDOFF_MARKER_PATH_COLLISION`）。**inbox 自動削除なし** — **cleanup は人手 Runbook**（契約 §7.1、`handoff/README.md`）。**`validateHermesConnectionAdapterInput` → enqueue** まで。テスト **`tests/ichikishima/hermes/hermes-file-handoff-adapter.test.ts`**（同名再実行・拒否 marker の非上書きを含む）。サンド **`sandbox/hermes-autonomy-zone/handoff/README.md`**。
- **`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`**：**Real Pilot Minimal Pipeline**。Stage 1 handoff 経路は **subprocess 不使用**（契約どおり）。オプション Ingress：`runHermesRealPilotMinimalFromExecAdapter`（`hermes-real-process-adapter.ts`：**`controlledPilot` 必須**・`execFile` のみ、`spawn`/`exec`/shell:true 禁止、許可 executable id・許可リスト・固定 argv・cwd・timeout・stdout 上限・**`signoffEvidence` 短文メタ**）。既定 `disabled` と二重フラグ。`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md` と整合。関連 Vitest（**fake runner のみ subprocess 回避**）。**`src/main/index.ts`/IPC/renderer 未配線**。**実 Hermes READY／常駐／本番とはみなさない**。
- **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`** / **`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`**: Hermes **実ランタイム接続前**の Go/No-Go・最小スコープ。**実 Hermes 常駐・自動 Go 無し**。`hermes-real-process-adapter.ts` は **`execFile` ミニ実装・既定 disabled**（Controlled Pilot は別 Goal）。**Stage 1 主経路は listen／IPC／実プロセス無し**（Preflight）。**SIGNOFF §12 / E‑25 / Final Gate と整合するよう Phase 7 同期済み**。
- **Controlled Pilot — 実機前準備（2026-05-03）**：`docs/ichikishima/HERMES_EXECUTION_SPEC_DISCOVERY.md`、`HERMES_CONTROLLED_PILOT_RUNBOOK.md`、`HERMES_ALLOWED_EXECUTABLE_TEMPLATE.md`、`HERMES_CONTROLLED_PILOT_RESULT_REPORT_TEMPLATE.md`。**コード** `hermes-controlled-pilot-config.ts`（検証）／`hermes-controlled-pilot-preflight.ts`（`GO_READY`|`NO_GO`・**自動 `execFile` なし**）／`hermes-controlled-pilot-summary.ts`（CC 向け短文・**executablePath 絶対パス非露出**）。**テスト** `tests/ichikishima/hermes/hermes-controlled-pilot-*.test.ts`。**実Hermes起動および実 subprocess は未**。ユーザーが実行パス・argv・signoff メタなどをすべて提示した Goal のみ実機単発へ。
- **Controlled Pilot — 値確認前準備レポート（2026-05-05）**：`docs/ichikishima/CONTROLLED_PILOT_VALUE_CONFIRMATION_REPORT.md`（実行ファイル・argv・stdout 仕様の**文書ベース棚卸し**・`signoffAtUnixMs` 候補。**実機起動・execFile なし**）。
- **Controlled Pilot — WSL2 接続 ADR（2026-05-05）**：`ADR_REAL_HERMES_WSL2_CONNECTION.md`、`HERMES_WSL2_WRAPPER_CONTRACT.md`。`hermes-controlled-pilot-config` に **`adapterKind`** / **`wsl_wrapper` 厳格 argv**。**実機・wsl 起動なし**。**parameter registry**: `HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`、`hermes-wsl2-wrapper-parameter-registry.ts`（**検証のみ**）。**WSL 人手値確認 + dummy `.sh.sample`（配置・実行禁止）+ registry allowlist／wrapper policy 厳格化**: `HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`、`sandbox/.../hermes-bridge-payload-once.sh.sample`。**Human value packet**: `HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`、`hermes-wsl2-wrapper-human-value-packet.ts`（`validateLocalOnlyValuePacketShape`、`summarizeRedactedLocalValuePacket`・**`fs` なし**）、CC **`wsl2HumanValuePacketSummary`**（**Sysnative V1 拒否**）。**local-only 実値保管方針（コミット禁止・example のみ）**: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_STORAGE_POLICY.md`、`sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.example.json` / `README.md`、`.gitignore`（`wsl-wrapper-values.local.json`）、Vitest **`hermes-wsl2-wrapper-local-value-storage.test.ts`**。**人手記入〜redacted Signoff Runbook（実行なし）**: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_USER_NEXT_ACTION_CHECKLIST.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`。**local JSON は作成済み（gitignored / untracked / unstaged、raw 値は報告・docs 転記なし）**。**validator / redacted summary / Control Center safe summary は prepared**。実値未確認または placeholder は `HOLD`、危険値は `REJECT`、完全検証は Signoff review 用 `GO`。**`wsl.exe` 実行なし**。
- **WSL local values validation → dummy manual placement design（2026-05-06）**: local JSON redacted status rechecked: **decision `HOLD`**, present=13, missing=0, placeholder=6, rejected=0. `HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md` added. Dummy wrapper content review remains static only; WSL placement, wrapper execution, `wsl.exe`, real Hermes, and real `execFile` are not performed.
- **WSL local-only values fill-in completion + validator rerun（2026-05-06）**: redacted-only rerun remains **`HOLD`** (present=13 / missing=0 / placeholder=6 / rejected=0). Raw values are not reported or written to docs. Next action remains user fill-in of local-only values and validator rerun.
- **WSL pre-execution readiness pack（2026-05-06）**: `FINAL_READINESS_MATRIX.md` now splits WSL local-only values / redacted Signoff / dummy manual placement / dummy validation / Controlled Pilot pre-signoff / `wsl.exe` execution / real Hermes / `execFile` controlled pilot. Execution rows remain **not ready**; `GO` means redacted Signoff review only.
- **`getHermesBridgePilotReadiness`**: ゲート文書 **`DOC_REL`（9 件：`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` / `HERMES_BRIDGE_RECEIVER_QUEUE.md` を含む）**。準備済み時ラベル **`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`**。
- テスト: `tests/ichikishima/control-center/control-center-data-provider.test.ts`、`tests/ichikishima/approval/approval-queue-summary.test.ts`、`tests/ichikishima/audit/audit-log-summary.test.ts`、`tests/ichikishima/hermes/hermes-bridge-readiness.test.ts`、`tests/ichikishima/hermes/hermes-bridge-api-registry.test.ts`、`tests/ichikishima/hermes/hermes-bridge-pilot.test.ts`、`tests/ichikishima/hermes/hermes-bridge-payload.test.ts`、`tests/ichikishima/hermes/hermes-bridge-receiver-queue.test.ts`、`tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts`、`tests/ichikishima/hermes/hermes-connection-adapter.test.ts`、`tests/ichikishima/hermes/hermes-bridge-readiness-summary.test.ts`、`tests/ichikishima/hermes/hermes-file-handoff-adapter.test.ts`、`tests/ichikishima/hermes/hermes-real-pilot-minimal.test.ts`、`tests/ichikishima/hermes/hermes-real-pilot-summary.test.ts`、`tests/ichikishima/hermes/hermes-real-process-adapter.test.ts`、`tests/ichikishima/control-center/control-center-readonly-snapshot-contract.test.ts`、`tests/ichikishima/control-center/control-center-static-shell.test.ts`、`tests/ichikishima/control-center/local-api-contract.test.ts`、`tests/ichikishima/control-center/local-api-server.test.ts`。
- 棚卸文書: `docs/ichikishima/ROADMAP_STATUS.md`、`docs/ichikishima/IMPLEMENTATION_GAP_ANALYSIS.md`、`HERMES_LOCAL_PILOT_RUNBOOK.md`、`LOCAL_PILOT_FULL_LOOP_SPEC.md`。
- `HERMES_BRIDGE_FINAL_REVIEW.md`: Hermes 本体接続直前ゲート（**文書のみ**。実IPC・実起動は未着手）。**§8**、**`DOC_REL`**、**`HERMES_BRIDGE_REGISTRY_IPC_*`** とコード突合済み。**人手クローズ記録**: `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`（§11 Preflight）。**Pilot ／ Preflight エントリー**: `HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`。**実接続前 Go/No-Go**: **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`**。
- **Control Center V1 Read-only UI 設計ゲート（ウィンドウ実装なし）**: `CONTROL_CENTER_V1_UI_SPEC.md`、`CONTROL_CENTER_V1_SECURITY_MODEL.md`、`CONTROL_CENTER_V1_IPC_CONTRACT.md`、`CONTROL_CENTER_V1_SCREEN_SPEC.md`、`CONTROL_CENTER_V1_IMPLEMENTATION_READINESS.md`。
- **`HERMES_BRIDGE_API_REGISTRY.md`** / **`src/main/ichikishima/hermes/hermes-bridge-api-registry.ts`**（`HERMES_BRIDGE_ALLOWED_APIS` / `HERMES_BRIDGE_FORBIDDEN_APIS` を単一参照元）。`getHermesBridgePilotReadiness` は当該定数から配列を返す。
- **`CONTROL_CENTER_READONLY_IPC_BINDING`**（current canonical RPC `controlCenter.readonly.getAppSnapshot`、`payloadSchemaVersion: v1`; legacy `getSnapshot` retired）を `getControlCenterReadonlyData` が含める。
- **Control Center V1 UI Shell（文書・契約・Static Shell）**: `CONTROL_CENTER_V1_UI_SHELL_SPEC.md`、`CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`、`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`、`CONTROL_CENTER_V1_UI_SHELL_TEST_PLAN.md`。**レイアウトのみ** `docs/ichikishima/mockups/control-center-v1-readonly.html`（script/CDN なし）。**read-only Static Shell** `mockups/control-center-v1-static-shell.{html,css,js}` + `mockups/control-center-v1-snapshot.sample.json`（`FileReader`・同階層のみ・パイプライン `<button>` はすべて `disabled`）。静的 JSON 運用は **`CONTROL_CENTER_STATIC_SHELL_JSON_GUIDELINES.md`** を正とする。検証 **`tests/ichikishima/control-center/control-center-static-shell.test.ts`**。Electron 起動・127.0.0.1 HTTP・外向き通信・preload・依存追加無し。
- **Control Center Local read-only HTTP — V1 最小実装済み**（`node:http` のみ・`npm install` なし）: `src/main/ichikishima/control-center/local-api-server.ts`（**`127.0.0.1` のみ bind**、**`GET /snapshot` のみ**、**CORS なし**、**`HEAD` / `OPTIONS` は 405・本文無し**、禁止パス **404**）。Threat Model / Contract / Gate / Test Plan 文書と **`local-api-contract.ts`**、**`local-api-contract.test.ts`**、**`local-api-server.test.ts`**。**Electron renderer/preload・アプリ自動起動・実 Hermes 連携には未配線**。
- **Control Center App Management Foundation（read-only · 2026-05-03）**: `CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md`、`APP_ONLY_OPERATION_ROADMAP.md`、`control-center-rooms.ts`、`control-center-app-snapshot.ts`、`control-center-readonly-ipc.ts`、`CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`、`CONTROL_CENTER_PRELOAD_RENDERER_CONTRACT.md`。検証 `tests/ichikishima/control-center/`（rooms / app-snapshot / readonly-ipc）。**追記（本配線）**: `src/main/index.ts` の `setupIPC()` 冒頭で **`registerControlCenterReadonlyIpcHandlers(ipcMain, …)`** のみ（read-only channel）。**実 Hermes・WSL・exec・HTTP listen 追加・npm install 無し**。
- **Final Preparation Pack（read-only メタ増分 · 2026-05-03）**: `control-center-approval-audit-summary.ts`、`control-center-memory-summary.ts`、`hermes-wsl2-wrapper-config.ts`（検証のみ）、Controlled Pilot **`preparedSafetyOutline`**、`visualization/*` + `agent-team/*` stub、`HERMES_WSL2_DUMMY_WRAPPER_PLAN.md` / `sandbox/.../dummy-hermes/`（**自動実行しない**）、`FINAL_READINESS_MATRIX.md`、`WINDOWS_APP_PACKAGING_PLAN.md`、`APP_ONLY_OPERATION_RUNBOOK.md`、`VISUALIZATION_V1_IMPLEMENTATION_SPEC.md`、`AGENT_TEAM_FOUNDATION_SPEC.md`、`AGENT_SCHEDULER_CONTRACT.md`。IPC 補助チャンネル（**`getAgentTeamSummary`** / **`getVisualizationModel`** 等）はモジュール登録。**AppSnapshot に Agent / Viz / Approval-Audit / Memory の安全要約を統合済み（2026-05-03）**。**Electron 本起動・実 WSL/exec 無し**。
- **Final Preparation Pack — 達成承認（ユーザー · 2026-05-03）**: 大型 Goal を **達成扱いで承認**。根拠は App-only / read-only / prepared / dry-run のみ実装し、危険境界（実 Hermes・`wsl.exe`・`execFile`・IPC 恒久配線の実行系・preload/renderer 本実装・外部通信・`npm install`・EA/MT5・memory DB 本番）に未着手（**※ read-only IPC 登録のみ index.ts に追加済み · 2026-05-03**）、`tests/ichikishima` と `typecheck:node` が成功したため。**ChatGPT 方針（記録）**: `preparedSafetyOutline` は `HermesControlledPilotDashboardSummary` に含めてよい（実行情報ではなく安全要約）。含めてはいけないものは executable 絶対パス・stdout/stderr 全文・raw payload・env・secrets・process handle。**IPC V1**: **`controlCenter.readonly.getAppSnapshot` を本命の単一入口**とし、Agent Team / Visualization / Approval / Audit / Memory は安全要約として Snapshot に束ねる。個別 IPC は V1.1 以降で検討。**明示 pending（穴として継続）**: WSL DistroName / unix user / wrapper path、bridge-payload-once と公式 CLI の一致、dummy CJS の実 `node` 1 回検証、Phase Q 文書の全行レベル追随。**次の推奨**: **preload から `getAppSnapshot` を invoke する最小契約**、または **dummy bridge の手動 `node` 検証**、**Controlled Pilot メタ確定**。
- **Read-only IPC 最小本配線（2026-05-03）**: `buildControlCenterAppSnapshot` が **`approvalAuditSummary` / `memorySummary` / `agentTeamSummary` / `visualizationModel`** を含む。`registerControlCenterReadonlyIpcHandlers` を **`setupIPC()` 先頭**で呼び出し。`projectRoot` / zone / snapshot 源は **`resolveControlCenterPathResolution` + `control-center-project-root-resolution.ts` 経由**（**2026-05-05**。dev は従来 `mainProcessDirname` 相対と同等、**packaged 実起動検証は未**）。**実行系・preload・renderer 新規 API・実 Hermes・承認自動実行・memory DB 本番 無し**。
- **preload read-only 最小公開（2026-05-03）**: `src/preload/ichikishima-control-center.ts` が **Ichikishima Control Center namespace として `getAppSnapshot` のみ**（`CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL`）。`src/preload/index.ts` が **`window.ichikishimaControlCenter`** を expose。**既存 `window.hermesAPI` は別 namespace であり、本 read-only Control Center 契約には含めない**。**Renderer に `ipcRenderer`・任意 invoke を渡さない**。Control Center namespace には `runHermes` / `runWsl` / `rawIpc` / `rawFs` / `executeApproval` を置かない。契約テスト **`tests/ichikishima/control-center/control-center-preload-contract.test.ts`**。main 側 **path resolver prepared**（上記）。**packaged 実アプリ起動での正しさは未検証**。
- **preload read-only 最小公開 — ユーザー完了承認（2026-05-03）**: main read-only IPC 登録済み・**`getAppSnapshot` のみ**・raw `ipcRenderer` 非公開・任意 invoke 非公開・実行系 IPC 無し。
- **Control Center App Shell read-only UI（Renderer · 2026-05-03 到達）**: `src/renderer/src/screens/ControlCenterAppShell/ControlCenterAppShell.tsx`、`Layout.tsx` に `controlCenter` ビュー。`window.ichikishimaControlCenter.getAppSnapshot()` のみ。失敗／null／parse reject は **明示エラー UI**（成功扱いにしない）。**全 room actions は disabled + disabledReason**。手動 Refresh のみ。**自動ポーリングなし**。共有パーサ **`src/shared/ichikishima/control-center-shell-ui-contract.ts`**。仕様 **`docs/ichikishima/CONTROL_CENTER_APP_SHELL_UI_SPEC.md`**。UI 安全検査 **`tests/ichikishima/control-center/control-center-app-shell-ui.test.ts`**。Snapshot 源表示は **`CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md`** に従い **Development snapshot / packaged pending / `productionReady:false`**。**packaged Electron 実ビルド・実起動での path 正しさは未検証**。
- **Packaged projectRoot / resourcesPath / userData 解決 — prepared（コード・文書・2026-05-05）**: `docs/ichikishima/CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md`、`src/main/ichikishima/control-center/control-center-project-root-resolution.ts`。`getIchikishimaControlCenterReadonlyParams` が resolver を使用。AppSnapshot に **`snapshotSourceLabel` / `pathResolutionRuntimeMode` / `pathResolutionStatus` / `pendingPackagingResolution` / `pathResolutionSafeSummaryLines`**（短文・**絶対パス非露出**）。Vitest **`tests/ichikishima/control-center/control-center-project-root-resolution.test.ts`** 等。**禁止境界遵守**: 実 Hermes、`wsl.exe`、`execFile`、Electron 本起動、実 packaging、外部通信、`npm install` なし。
- **Packaged path smoke — design / Signoff gate（文書・補助コード・2026-05-05）**: `docs/ichikishima/CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`、`control-center-packaged-smoke-checklist.ts`、Vitest。
- **Final Read-only Validation Pack（Task A/B/C · 2026-05-06）**: Task A packaged smoke **自動未実施**（理由は Signoff に記録）。Task B **`ControlCenterAppShell` の read-only polish**。Task C **dummy CJS + Vitest**：**静的** `tests/ichikishima/sandbox/dummy-hermes-stub-design-static.test.ts`。**プロセス検証** `dummy-hermes-stub-design.process-local.test.ts` は **`RUN_DUMMY_HERMES_LOCAL_PROCESS=1` 時のみ実行**（**2026-05-07 で CI 前提と subprocess 混線しないよう整理**）。
- **Date consistency note（2026-05-05）**: 2026-05-06 / 2026-05-07 の記録は現在日から未来日付のため、`docs/ichikishima/DATE_CONSISTENCY_NOTES.md` で **human confirmation pending** とする。実完了日・予定日・誤記のどれかは人手確認まで断定しない。
- **electron-vite build smoke — Stage 1（2026-05-03）**: `npm run build`（`typecheck` + **`electron-vite build` のみ**。**`electron-builder`・Electron 長寿命起動・アプリ packaged 短命起動なし**）。Control Center App Shell / preload型 / shared IPC channel / renderer bundle の **ビルド時破綻検知**。**packaged path smoke・`pendingPackagingResolution:false` の根拠とはしない**（Signoff § Build smoke）。
- **packaged short launch smoke — 設計・契約・評価 TS（2026-05-03）**: `CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`、`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_RUNNER_CONTRACT.md`、`control-center-packaged-short-launch-contract.ts` + Vitest（**Electron 起動・child_process・`build:unpack`・実機 exec なし**）。**Signoff** に Short launch テンプレ追加（**欄のみ、未記入**）。**Codex handoff 文書は作成していない**（Composer2 継続前提）。**実 short launch は未実施**。
- **混線防止 ADR**: `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`（**IPC を Electron UI 本命**、Local HTTP は補助・明示起動、Bridge と Local API は分離）、`CONTROL_CENTER_OWNERSHIP_MODEL.md`、`HERMES_BRIDGE_OWNERSHIP_MODEL.md`。§8 に App Management foundation 文言追記（**listen・通信追加なし**）。

## 1b. 承認キュー（Local Sandbox: JSONL 追記）

- 型・正規化は `approval-queue.ts`。`requiresUserApproval:true` / `autoExecutable:false` を不変条件とする。
- **永続**は `approval-queue-store.ts` の `saveApprovalQueueItem` / `readApprovalQueueItems` / `appendApprovalQueueStatusEvent`（**`appendFileSync` のみ**、上書き・truncate・unlink なし）。ファイル名 `approval-YYYY-MM-DD.jsonl`。
- 保存先検証に **path-guard** + **denylist** + **projectRoot 内 zoneRoot** を再利用。`UUID` 形状の `approvalId` は一意性維持のためマスクentropyルールで潰さない。
- `createApprovalQueueItemFromReport` は **Markdown 本文を保存しない**（summary・短い理由のみ）。
- `approvalQueueCandidateFromBlockedDelete` / `FromBlockedOperation` は **実操作を実行しない**（既存 Zone ブロック API の候補へ変換するだけ）。
- `saveApprovalQueueItem` 成功時 **`auditEventCandidate`（`approval_queue_item_created`）** を返す。状態遷移では `appendApprovalQueueStatusEvent` が **`approval_queue_status_changed`** を返す。Hermes 本体からの自動連鎖保存は未接続。

## 1a. 監査ログ（Local Pilot: JSONL 追記）

- 正規化とマスクは `audit-log.ts`。
- **永続保存**は `audit-save.ts` の **`saveAuditLog(record, SaveAuditLogOptions)`**（**`appendFileSync` のみ**、上書き・truncate・unlink なし）。
- 既定の相対保存先は **`zoneRoot` 直下の `audit`**（例: `sandbox/hermes-autonomy-zone/audit/`）。`auditSubdirectory` で Zone 内サブパスを変更可（`..` 禁止）。
- パス検証に **`path-guard`**（`checkZonePath`）と **`denylist`**（`checkDenylist`）を再利用。**`zoneRoot` は `projectRoot` 内**であること。
- **userData への既定保存や SQLite は未実装**（仕様上の候補のみ）。Zone ラッパーからの自動 `saveAuditLog` 呼び出しはまだ行わない。

## 制: Ichikishima Control Center（仕様書 + read-only ステータス型まで）

- 仕様は **CONTROL_CENTER_\*.md**（V0）まで。**単独製品としての視覚化 UI・アプリウィンドウは別リポ推奨**（構想）。
- **`control-center-status.ts`** は **read-only ステータスカード構築のみ** とし、`npm install`・外部通信・Hermes本体・DB は**広い権限での着手をしない**。
- **このリポ内の Electron Renderer** は **read-only App Shell （`ControlCenterAppShell`）のみ**。**実行系ウィンドウ・自動起動・承認実行は未着地**であり、単独製品級 Control Center と混同しない。

## 2. Step 1: Zone root設定

実装ファイル:

- `src/main/ichikishima/autonomy-zone/types.ts`
- `src/main/ichikishima/autonomy-zone/config.ts`
- `src/main/ichikishima/autonomy-zone/index.ts`
- `tests/hermes/zone/config.test.ts`

内容:

- `HERMES_AUTONOMY_ZONE_ROOT` または設定値からZone rootを決める。
- 未設定時は `sandbox/hermes-autonomy-zone` を既定値にする。
- project rootそのもの、OS root、user home、Zone外、危険語を含むrootを拒否する。
- 拒否時は理由コードと人間が読める理由を返す。

## 3. Step 2a: path-guard / denylist分離

実装ファイル:

- `src/main/ichikishima/autonomy-zone/path-guard.ts`
- `src/main/ichikishima/autonomy-zone/denylist.ts`
- `tests/hermes/zone/path-guard.test.ts`
- `tests/hermes/zone/denylist.test.ts`

内容:

- `path-guard.ts` はZone内外判定、相対パス、絶対パス、realpath、symlink/junction脱出対策を担当する。
- `denylist.ts` は `.env`、APIキー、secrets、token、秘密鍵、`.git`、memory DB、MT5/EA、取引履歴、個人情報、本番設定などの危険パス判定を担当する。
- `config.ts` はZone root固有の検証に寄せ、共通判定は `path-guard.ts` と `denylist.ts` を使う。

## 4. Step 2b: read permission check API

Step 2bでは、実ファイル読み取りへ進む前に、指定パスがread操作として許可できるかだけを判定するAPIを作った。

目的:

- `fs.readFile` などの実読み取りはしない。
- Zone root配下か確認する。
- denylist対象ではないか確認する。
- read操作として許可または拒否の結果だけを返す。
- 拒否理由は自由文だけでなくreason codeも返す。

想定ファイル:

- `src/main/ichikishima/autonomy-zone/read-policy.ts`
- `tests/hermes/zone/read-policy.test.ts`

## 5. Step 2c: read wrapper仕様書とテスト設計

Step 2cでは、read wrapper本体へ進む前に仕様、制限、戻り値形式、テスト観点、監査ログ接続方針を固定した。

作成ファイル:

- `docs/ichikishima/READ_WRAPPER_SPEC.md`

内容:

- read wrapperの目的と非目的。
- `readZoneFile(input)` の想定API。
- 成功/失敗戻り値の候補。
- `checkReadAllowed` を必ず先に呼ぶ方針。
- `maxBytes`、binary file、huge fileの扱い。
- 拒否時にcontentを返さない方針。
- 監査ログへcontent本文を保存しない方針。
- read wrapper本体実装前のテスト設計。

## 6. Step 2d: read wrapper型定義と未実装スタブ

Step 2dでは、`READ_WRAPPER_SPEC.md` に沿ってread wrapperの公開型、未実装スタブ、仕様テストを追加した。

実装ファイル:

- `src/main/ichikishima/autonomy-zone/read-wrapper.ts`
- `tests/hermes/zone/read-wrapper.test.ts`
- `src/main/ichikishima/autonomy-zone/types.ts`
- `src/main/ichikishima/autonomy-zone/index.ts`

内容:

- `ReadZoneFileInput` を追加。
- `ReadZoneFileResult`、`ReadZoneFileSuccess`、`ReadZoneFileFailure` を追加。
- `ReadFailureReasonCode`、`ReadEncoding` を追加。
- `ReadAuditEventCandidate` を追加。
- `readZoneFile(input)` を追加。
- 現時点の `readZoneFile` は `NOT_IMPLEMENTED` の `ok:false` を返す。
- `fs.readFile` はまだ使っていない。
- 実ファイル読み取りはまだ行っていない。
- `checkReadAllowed` を呼ぶ実装にもまだ進んでいない。

## 7. Step 2e: readZoneFile最小実読み取り

Step 2eでは、Zone内で許可されたテキストファイルだけを読む最小read wrapperを実装した。

実装ファイル:

- `src/main/ichikishima/autonomy-zone/read-wrapper.ts`
- `tests/hermes/zone/read-wrapper.test.ts`
- `src/main/ichikishima/autonomy-zone/types.ts`
- `docs/ichikishima/READ_WRAPPER_SPEC.md`

内容:

- `readZoneFile` は最初に `checkReadAllowed` を呼ぶ。
- `checkReadAllowed` が拒否した場合は、実読み取りせず `content:null` で返す。
- 許可された場合のみ、Zone内の実体パスを読む。
- `maxBytes` 未指定時は安全な既定値を使う。
- `maxBytes` 超過時は `FILE_TOO_LARGE` で拒否する。
- directory指定は `TARGET_IS_DIRECTORY` で拒否する。
- 存在しないファイルは `FILE_NOT_FOUND` で拒否する。
- binaryっぽいファイルは `BINARY_NOT_ALLOWED` で拒否する。
- 初期MVPでは `allowBinary=true` でもbinary内容は返さない。
- エラー理由にファイル内容や秘密情報を含めない。
- 監査ログ本体はまだ未実装。

## 8. Step 2f: read結果の監査イベント候補

Step 2fでは、`readZoneFile` の成功、拒否、エラー時に、将来の監査ログへ渡せる `auditEventCandidate` を返すようにした。

実装ファイル:

- `src/main/ichikishima/autonomy-zone/read-wrapper.ts`
- `tests/hermes/zone/read-wrapper.test.ts`
- `src/main/ichikishima/autonomy-zone/types.ts`
- `docs/ichikishima/READ_WRAPPER_SPEC.md`

内容:

- read成功時に `auditEventCandidate` を返す。
- read拒否時に `auditEventCandidate` を返す。
- readエラー時に `auditEventCandidate` を返す。
- `requestId` と `actor` を引き継ぐ。
- `action: "read"` を含める。
- `status: "success" | "denied" | "error"` を含める。
- `reasonCode`、`reason`、`bytesRead`、`truncated` を必要に応じて含める。
- `contentIncluded:false` を必ず含める。
- content本文は `auditEventCandidate` に含めない。
- 監査ログ本体への保存はまだ未実装。

## 9. Step 3a: write wrapper仕様書とテスト設計

Step 3aでは、write wrapper本体へ進む前に仕様、禁止事項、戻り値形式、監査イベント候補、テスト観点を固定した。

作成ファイル:

- `docs/ichikishima/WRITE_WRAPPER_SPEC.md`

内容:

- write wrapperの目的と非目的。
- `writeZoneFile(input)` の想定API。
- 成功/失敗戻り値の候補。
- Zone内判定とdenylist判定を必ず通す方針。
- `maxBytes`、`overwrite`、`createDirs` の扱い。
- symlink / realpath / junction対策を維持する方針。
- 拒否時に書き込まない方針。
- 監査イベント候補にcontent本文を含めない方針。
- write wrapper本体実装前のテスト設計。

Step 3a時点の未実装:

- `fs.writeFile`。
- 実ファイル書き込み。
- write-policy判定API。
- write wrapper型定義。
- write wrapper未実装スタブ。
- write wrapper仕様テスト。

## 10. Step 3b: write-policy判定API

Step 3bでは、実ファイル書き込みへ進む前に、指定パスがwrite操作として許可できるかだけを判定するAPIを作った。

実装ファイル:

- `src/main/ichikishima/autonomy-zone/write-policy.ts`
- `tests/hermes/zone/write-policy.test.ts`
- `src/main/ichikishima/autonomy-zone/types.ts`
- `src/main/ichikishima/autonomy-zone/index.ts`

内容:

- `checkWriteAllowed(input)` を追加。
- Zone root配下か確認する。
- denylist対象ではないか確認する。
- `maxBytes` と `contentBytes` の不正値を拒否する。
- `overwrite:false` の場合、既存ファイルを拒否する。
- `createDirs:false` の場合、親ディレクトリ欠落を拒否する。
- directory指定を拒否する。
- `createDirs` と `overwrite` は入力として受け取れる。
- `fs.writeFile` はまだ使っていない。
- 実ファイル書き込みはまだ行っていない。
- 監査ログ本体への保存はまだ未実装。

## 11. Step 3c: write wrapper型定義と未実装スタブ

Step 3cでは、`WRITE_WRAPPER_SPEC.md` に沿ってwrite wrapperの公開型、未実装スタブ、仕様テストを追加した。

実装ファイル:

- `src/main/ichikishima/autonomy-zone/write-wrapper.ts`
- `tests/hermes/zone/write-wrapper.test.ts`
- `src/main/ichikishima/autonomy-zone/types.ts`
- `src/main/ichikishima/autonomy-zone/index.ts`

内容:

- `WriteZoneFileInput` を追加。
- `WriteZoneFileResult`、`WriteZoneFileSuccess`、`WriteZoneFileFailure` を追加。
- `WriteFailureReasonCode`、`WriteEncoding` を追加。
- `WriteAuditEventCandidate` を追加。
- `writeZoneFile(input)` を追加。
- 現時点の `writeZoneFile` は `NOT_IMPLEMENTED` の `ok:false` を返す。
- 失敗時は `bytesWritten: 0` を返す。
- `auditEventCandidate` は `action: "write"` と `contentIncluded:false` を含む。
- content本文は戻り値や `auditEventCandidate` に含めない。
- `fs.writeFile` はまだ使っていない。
- 実ファイル書き込みはまだ行っていない。
- `checkWriteAllowed` を呼ぶ実装にもまだ進んでいない。
- 監査ログ本体への保存はまだ未実装。

## 12. Step 3d前: writeZoneFile最小実装前の設計照合

Step 3d前の設計照合では、`WRITE_WRAPPER_SPEC.md`、write-policy、write-wrapper、型、仕様テストの整合性を確認し、最小write実装前に不足していた仕様を補強した。

確認結果:

- `WriteZoneFileInput` / `WriteZoneFileResult` / `WriteAuditEventCandidate` は `WRITE_WRAPPER_SPEC.md` の想定APIと一致している。
- `checkWriteAllowed` は判定専用で、実ファイル書き込みは行わない。
- `writeZoneFile` は現時点では `NOT_IMPLEMENTED` の安全側スタブで、実ファイル書き込みは行わない。
- 最小write実装時は、最初に `checkWriteAllowed` を呼ぶ必要がある。
- `overwrite:false` は既存ファイル拒否、`createDirs:false` は親ディレクトリ欠落拒否、`maxBytes` 超過は `FILE_TOO_LARGE` とする。
- symlink / junction経由でZone外へ解決されるwrite対象は、path-guardのrealpath判定で拒否する。
- 拒否時は `bytesWritten: 0` を維持する。
- `auditEventCandidate` にcontent本文を含めない。
- `reason` と `auditEventCandidate.reason` にcontent本文や秘密情報を含めない。

補強内容:

- `WritePermissionReasonCode` に `FILE_TOO_LARGE` を追加。
- `checkWriteAllowed` の `maxBytes` / `contentBytes` 検証を有限数チェックにした。
- content byte長が `maxBytes` を超える場合は `FILE_TOO_LARGE` で拒否する。
- symlink / junction経由のZone外write拒否テストを追加。
- `NaN` / `Infinity` のwrite sizeオプション拒否テストを追加。
- `WRITE_WRAPPER_SPEC.md` にwrite-policyとwrite-wrapperの責務分離、Step 3d前の確認方針を追記。

次に進む場合:

- Step 3eの最小write実装では、最初にcontent byte長を計算し、`checkWriteAllowed` へ渡す。
- `checkWriteAllowed` が拒否した場合、`fs.writeFile` へ進まない。
- 許可後も `fs.writeFile` 以外のdelete / execute / network / git / 監査ログ本体保存へ進まない。

## 13. Step 3e-3f: writeZoneFile最小実装と監査イベント候補

Step 3e-3fでは、Zone内で許可されたテキストファイルだけを書ける最小write wrapperを実装した。

実装ファイル:

- `src/main/ichikishima/autonomy-zone/write-wrapper.ts`
- `tests/hermes/zone/write-wrapper.test.ts`
- `tests/hermes/zone/write-policy.test.ts`

内容:

- `writeZoneFile` はcontent byte長を計算し、`checkWriteAllowed` を先に通す。
- `checkWriteAllowed` が拒否した場合は、実書き込みせず `bytesWritten: 0` で返す。
- 許可された場合のみ、Zone内の実体パスへ最小writeを行う。
- `maxBytes`、`overwrite:false`、`createDirs:false` を維持する。
- `createDirs:true` の場合だけ親ディレクトリを作成する。
- 上書きは `overwrite:true` の場合だけ許可する。
- `auditEventCandidate` は success / denied / error のすべてで返す。
- `auditEventCandidate.contentIncluded:false` を維持する。
- content本文は戻り値の監査イベントやreasonに含めない。
- 監査ログ本体への保存はまだ未実装。

## 14. Step 4: delete明示ブロック

Step 4では、delete要求を実削除せず明示的にブロックする `deleteZoneFile` を追加した。

実装ファイル:

- `src/main/ichikishima/autonomy-zone/delete-wrapper.ts`
- `tests/hermes/zone/delete-wrapper.test.ts`

内容:

- 実削除は行わない。
- Zone外やdenylist対象は拒否する。
- 許可されたZone内ファイルのdelete要求も `DELETE_REQUIRES_APPROVAL` で止める。
- `deleted:false` を返す。
- 許可対象のdelete要求には `approvalRequestCandidate` を返す。
- `auditEventCandidate` を返す。

## 15. Step 5: execute / network / git明示ブロック

Step 5では、execute / network / git要求を実行せず明示的にブロックするAPIを追加した。

実装ファイル:

- `src/main/ichikishima/autonomy-zone/operation-blocks.ts`
- `tests/hermes/zone/operation-blocks.test.ts`

内容:

- `executeCommand` はコマンドを実行せず `EXECUTE_REQUIRES_APPROVAL` を返す。
- `requestNetworkAccess` は外部通信せず `NETWORK_REQUIRES_APPROVAL` を返す。
- `requestGitOperation` はgit操作せず `GIT_REQUIRES_APPROVAL` を返す。
- すべて `executed:false` を返す。
- すべて `approvalRequestCandidate` と `auditEventCandidate` を返す。

## 16. Step 6: approval queue JSON最小実装

Step 6では、承認UIや実行処理へ進まず、承認要求JSONの最小型と生成関数だけを追加した。

実装ファイル:

- `src/main/ichikishima/autonomy-zone/approval-request.ts`
- `tests/hermes/zone/approval-request.test.ts`

内容:

- `createApprovalRequest(input)` を追加。
- `actionType`、`targetPaths`、`commands`、`externalUrls`、`riskLevel`、`reason`、`expectedResult`、`rollbackPlan`、`testPlan`、`requiresUserApproval` を扱う。
- JSONとして安全にシリアライズできることを確認した。
- 承認UI、承認キュー実行、実監査ログ保存はまだ未実装。

## 17. Step 7: 最小smoke test

Step 7では、Hermes Autonomy Zoneの最小稼働を確認するsmoke testを追加した。

実装ファイル:

- `tests/hermes/zone/autonomy-zone-smoke.test.ts`

確認内容:

- Zone内safe text fileをwriteできる。
- writeしたfileをreadできる。
- `.env`、secrets、MT5、memory DB、`.git` はwrite拒否される。
- deleteは実削除されずブロックされる。
- execute / network / gitは実行されずブロックされる。
- approval request候補が生成できる。
- auditEventCandidateにcontent本文が含まれない。

## 18. Step 8-11: 本稼働前準備

Step 8-11では、Hermes Autonomy ZoneをローカルSandbox内で試験運用できる状態にするためのRunbook、Pilot workspace、Pilot smoke test、Readiness Checklistを追加した。

実装/作成ファイル:

- `docs/ichikishima/HERMES_AUTONOMY_ZONE_RUNBOOK.md`
- `docs/ichikishima/HERMES_AUTONOMY_ZONE_READINESS_CHECKLIST.md`
- `tests/hermes/zone/autonomy-zone-pilot.test.ts`
- `sandbox/hermes-autonomy-zone/README.md`
- `sandbox/hermes-autonomy-zone/sample/safe-sample.txt`
- `sandbox/hermes-autonomy-zone/output/.gitkeep`
- `sandbox/hermes-autonomy-zone/tmp/.gitkeep`

判定:

- `READY_FOR_LOCAL_PILOT`

注意:

- この判定はローカルSandbox内の試験運用に入れるという意味。
- Hermes本体完全連携、本番運用、外部通信、git操作、既存EA/MT5連携を許可するものではない。

## 19. Phase I: Ichikishima Shadow Mode準備

Hermes Autonomy Zoneが `READY_FOR_LOCAL_PILOT` に到達したため、イツキシマ本体はShadow Mode準備まで進めた。

作成/実装ファイル:

- `docs/ichikishima/ICHIKISHIMA_SHADOW_MODE_SPEC.md`
- `docs/ichikishima/HERMES_REPORT_REVIEW_SPEC.md`
- `src/main/ichikishima/core/state.ts`
- `src/main/ichikishima/core/silence-gate.ts`
- `src/main/ichikishima/review/hermes-report-reviewer.ts`
- `src/main/ichikishima/visualization/events.ts`
- `tests/ichikishima/core/state.test.ts`
- `tests/ichikishima/core/silence-gate.test.ts`
- `tests/ichikishima/review/hermes-report-reviewer.test.ts`
- `tests/ichikishima/visualization/events.test.ts`

内容:

- 状態モデルを定義した。
- 沈黙ゲートは `shouldSpeak:false` の安全側スタブにした。
- Hermes変更レポート審査は、自動承認せず判定候補だけ返す。
- 禁止領域検出時は `reject_recommended` に倒す。
- テスト根拠不足時は `hold` に倒す。
- 可視化イベント型はcontent本文を含まない形にした。

判定:

- `SHADOW_MODE_READY`

## 20. Goal: 実運用前コア設計・型・安全側スタブ

Goal形式プロンプトに基づき、実運用前コアの設計、型、安全側スタブ、テスト、レビュー資料を整備した。

作成/更新:

- `docs/ichikishima/HERMES_CONNECTION_PRE_REVIEW.md`
- `docs/ichikishima/ICHIKISHIMA_REVIEW_MODE_SPEC.md`
- `src/main/ichikishima/review/review-mode.ts`
- `tests/ichikishima/review/review-mode.test.ts`
- `docs/ichikishima/SPEAK_VALUE_SCORE_SPEC.md`
- `src/main/ichikishima/core/speak-value.ts`
- `tests/ichikishima/core/speak-value.test.ts`
- `docs/ichikishima/MEMORY_GOVERNANCE_SPEC.md`
- `docs/ichikishima/MEMORY_DESIGN.md`
- `docs/ichikishima/AGENT_TEAM_ARCHITECTURE.md`
- `docs/ichikishima/LOCAL_CLOUD_ESCALATION_POLICY.md`
- `docs/ichikishima/CURSOR_AGENT_ESCALATION.md`
- `docs/ichikishima/AGENT_VISUALIZATION_IMPLEMENTATION_PLAN.md`
- `docs/ichikishima/AGENT_VISUALIZATION_REQUIREMENTS.md`
- `docs/ichikishima/SUPPRESSIVE_AGENT_ARCHITECTURE.md`
- `docs/ichikishima/NEXT_GOALS.md`
- `docs/ichikishima/GOAL_COMPLETION_REPORT.md`
- `docs/ichikishima/MORNING_REVIEW_REPORT.md`

内容:

- Hermes本体連携前レビュー条件を固定した。
- Review Modeは自動承認せず、承認推奨/保留/却下推奨の候補だけを返す。
- Speak Value Scoreはスコアと候補を作るが、`shouldSpeak:false` を維持する。
- Memory Governanceはmemory DB直接操作を禁止し、記憶候補化までに留める。
- Agent Teamはバトンリレー方式とし、無秩序なAI会議を禁止する。
- Escalation Policyは外部送信実装ではなく、渡してよい/いけない情報の境界を定義する。
- Visualizationはイベント型と実装計画までで、UI実装や依存追加はしない。
- Suppressive Agent Architectureで、話さないこと・行動しないことも価値として定義した。

判定:

- Goal達成。
- `READY_FOR_LOCAL_PILOT` 維持。
- `SHADOW_MODE_READY` 維持。

まだ実装していないこと:

- 自動発話。
- 音声出力。
- 通知。
- memory DB更新。
- 外部通信。
- MT5/EA連携。
- Hermes本体への実接続。
- UI実装。
- 3D可視化。

## 21. 触ってはいけない領域

次には触れない。

- 既存EA本体。
- MT5関連ファイル。
- `.env`
- APIキー。
- secrets。
- memory DB。
- 本番設定。
- git push。
- 外部送信。
- 自動売買関連。
- 取引履歴。
- 個人情報。

必要になった場合は、実装を止めてユーザーへ報告する。

## 22. Cursor運用ルール

作成済み:

- `.cursor/rules/ichikishima-safety.mdc`
- `.cursor/rules/ichikishima-workflow.mdc`
- `.cursor/rules/ichikishima-report.mdc`
- `AGENTS.md`
- `docs/ichikishima/CURSOR_OPERATION_PROTOCOL.md`
- `docs/ichikishima/CURSOR_TO_CHATGPT_REVIEW_PROTOCOL.md`

目的:

- 毎回のコピペを減らす。
- 低リスクStepはCursor内で継続する。
- 高リスク境界だけChatGPTレビューへ戻す。
- 禁止領域、変更レポート、停止条件を永続化する。

注意:

- この運用ルール作成では実装コードを変更していない。
- write wrapper仕様書にはまだ進んでいない。

## 23. 現在のテスト状況

直近で通過した確認:

```text
npm test -- tests/ichikishima/approval/approval-report.test.ts tests/ichikishima/memory/memory-candidate.test.ts tests/ichikishima/review/hermes-report-reviewer.test.ts tests/ichikishima/review/review-mode.test.ts tests/ichikishima/core/state.test.ts tests/ichikishima/core/silence-gate.test.ts tests/ichikishima/core/speak-value.test.ts tests/ichikishima/visualization/events.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/approval tests/ichikishima/approval
```

直近結果:

- Approval関連テスト: 8ファイル / 44件成功。
- Node側typecheck: 成功。
- Approval対象ESLint: 成功。
- 禁止操作混入検索: UI、外部通信、DB接続、SQLite接続、危険操作コード、git pushは検出なし。
- ReadLints: この範囲では問題を検出していません。

## 24. Composer2へ引き継ぐ場合の注意点

Composer2へ渡す場合は、次を守る。

- read wrapper本体は最小実装済み。
- write wrapper仕様書とテスト設計は作成済み。
- write-policy判定APIは作成済み。
- write wrapper型定義、未実装スタブ、仕様テストは作成済み。
- writeZoneFile最小実装前の設計照合は完了済み。
- writeZoneFile最小実装は完了済み。
- delete / execute / network / git は実行せず明示ブロック済み。
- approval request JSON最小生成は実装済み。
- smoke testは追加済み。
- Runbook、Pilot workspace、Readiness Checklist、Morning Review Reportは作成済み。
- Ichikishima Shadow Mode準備は完了済み。
- 実運用前コアGoalは完了済み。
- Review ModeとSpeak Value Scoreは安全側スタブ/最小判定として実装済み。
- Memory Governance、Agent Team、Escalation、Visualization、Suppressive Architectureの設計文書は作成済み。
- Review Mode実用化Goalは完了済み。
- `evaluateReviewMode` は文字列/構造化入力、禁止領域検出、テスト証跡確認、rollback確認、次工程リスク分類に対応済み。
- `reviewHermesReport` はReview Mode判定に接続済み。
- Memory Candidate / Memory Agent候補Goalは完了済み。
- `extractMemoryCandidates` は候補抽出、カテゴリ分類、承認必須化、forbidden memory拒否に対応済み。
- Memory Candidateはmemory DB、SQLite、既存memory機能へ接続しない。
- Approval Report UI/CLI前段Goalは完了済み。
- `createApprovalReport` はReview Mode結果、Memory Candidate要約、テスト/rollback/未確認項目を承認レポートに変換できる。
- `renderApprovalReportMarkdown` と `renderApprovalReportJson` はUIなしで承認判断用出力を生成する。
- Approval Reportは自動承認せず、`requiresUserApproval:true` と `autoApproved:false` を固定する。
- AuditLogger は **Hermes Autonomy Zone 内のみ** に **JSONL を追記**（`audit-save.ts` の `saveAuditLog`。**`appendFileSync` のみ**、上書き・unlink なし）。**SQLite・Electron userData 既定・自動ローテーション実装は未対応**（仕様上の将来候補）。
- `saveAuditLog` が返す **`reason`** には record 全文・生パス詳細・秘密情報を載せず、短文 + `reasonCode` のみ。
- 監査ログの仕様・テスト設計は `AUDIT_LOG_SPEC.md` / `AUDIT_LOG_TEST_PLAN.md`。
- Zone read/write/delete ブロックとは別経路であり、現時点で **自動的に `saveAuditLog` は呼ばれない**（将来のキューまたは Hermes 連携で検討）。
- read wrapperを拡張する場合も、最初に `checkReadAllowed` を呼ぶ設計を維持する。
- binary内容返却や大容量全文読み取りへ進まない。
- delete、execute、network、git操作は今後も実行しない。
- denylist判定はproject rootの親パスに誤爆しないよう、Zone指定部分またはZone内相対パスを中心に行う。
- 判定に迷う場合は拒否側に倒す。
- テストでは実 `.env`、実MT5、実memory DB、実個人情報を使わない。
- 外部通信しない。
- npm installしない。
- 作業開始時は `AGENTS.md`、`.cursor/rules/`、`CURSOR_OPERATION_PROTOCOL.md` を確認する。

## 25. 次の安全な実装順序

1. Step 2b: read permission check API。
2. Step 2c: read wrapper設計文書または仕様テスト。
3. Step 2d: read wrapperの型と仕様テスト。
4. Step 2e: 実ファイル読み取りの最小read wrapper。
5. Step 2f: read wrapperの監査イベント候補または追加エラー分類。
6. Step 3a: write wrapper仕様書とテスト設計。
7. Step 3b: write-policy判定API。
8. Step 3c: write wrapper型定義と未実装スタブ。
9. Step 3d: write wrapper最小実装前の設計照合または外部レビュー。
10. Step 3e: 最小write実装。
11. Step 4: deleteは明示ブロック。
12. Step 5: execute / network / gitは明示ブロック。
13. Step 6: approval queue JSON最小実装。
14. Step 7: 最小smoke test。
15. Step 8: Runbook。
16. Step 9: Local Pilot Workspace。
17. Step 10: Local Pilot Smoke Test。
18. Step 11: Readiness Checklist。
19. Phase I: Ichikishima Shadow Mode準備。
20. Goal: 実運用前コア設計・型・安全側スタブ。
21. 次: イツキシマReview Mode実用化。
22. Goal: イツキシマReview Mode実用化。
23. 次: 記憶候補管理。
24. Goal: 記憶候補管理 / Memory Agent候補。
25. 次: 承認レポートUI/CLI前段。
26. Goal: 承認レポートUI/CLI前段。
27. Goal: 監査ログ本体の仕様書とテスト設計。
28. Goal: AuditLogger 未実装スタブ／型／仕様準拠テスト（永続保存なし）。
29. Goal: AuditLogger 最小実装（JSONL 追記・Zone sandbox 既定 `audit`、`userData`・SQLite は未）。
30. 次: Hermes本体連携の仕様書とテスト設計。
31. 次: 承認キュー本体または Hermes本体連携前レビューをユーザー確認のうえ選択。

どの段階でも、本体反映、外部送信、MT5/EA、memory DB、秘密情報、git pushへ進まない。
- **WSL discovery-only fill-in (2026-05-06)**: `wsl.exe` discovery-only was allowed and bounded. Multiple distros made automatic selection ambiguous, so local values remain HOLD with present=13 / missing=0 / placeholder=3 / rejected=0. Raw values were not reported. No WSL placement, wrapper execution, real Hermes, real `execFile`, packaged smoke, Approval execution, Memory DB, or EA/MT5 work was performed.
- **WSL intended distro slot selection (2026-05-06)**: multiple distros were discovered by bounded list-only discovery. Raw distro names were written only to ignored local-only slot map storage, not docs/final/Git. selectableSlots are slot-01 / slot-02 / slot-03. selectedSlot is none. No unix user discovery, wrapperPath generation, `wsl.exe -d`, WSL placement, wrapper execution, dummy execution, real Hermes, or real `execFile` was performed.
- **WSL selected slot resolution attempt (2026-05-06)**: selectedSlot=slot-02 was recorded local-only. Inventory comparison matched before resolution, but unix user discovery-only failed. Local values remain HOLD with present=13 / missing=0 / placeholder=3 / rejected=0. Raw values were not reported. No WSL placement, wrapper execution, dummy execution, real Hermes, real `execFile`, packaged smoke, Approval execution, Memory DB, or EA/MT5 work was performed.
- **WSL selected distro availability investigation (2026-05-06)**: selectedSlot=slot-02 inventory comparison matched. `whoami` and alternate `$USER` discovery-only both failed, so failureCategory=whoami_failed_and_user_env_failed. Local JSON distro/user/wrapper fields were not updated. Raw values were not reported. No WSL placement, wrapper execution, dummy execution, real Hermes, real `execFile`, packaged smoke, Approval execution, Memory DB, or EA/MT5 work was performed.
- **WSL selected distro availability HOLD hardening (2026-05-06)**: selectedSlot=slot-02 remains resolved, inventoryCountComparison=count_matched_content_unverified, unixUserDiscovery=failed, alternateUnixUserDiscovery=failed, failureCategory=whoami_failed_and_user_env_failed, localJsonUpdatedForDistroUserWrapper=false. This is a count-only comparison, not a full inventory content match. This is now a first-class redacted HOLD status for Control Center / validator / Signoff. Required user response: `slot-02 availability: ok`, `slot-02 availability: failed`, or `slot-02 availability: choose_another_slot`. No further WSL commands, slot changes, unixUser inference, wrapperPath generation, WSL placement, wrapper/dummy execution, real Hermes, real `execFile`, packaged smoke, Approval execution, Memory DB, or EA/MT5 work should occur before that response.
- **Control Center HOLD status sprint (2026-05-07)**: Control Center snapshot / shell parser / renderer now carry selectedSlot=slot-02 availability failure as redacted read-only HOLD status. The UI shows decision HOLD, slot-only blocker fields, rawValuesReported=false, and Execution=disabled. No WSL command, WSL placement, wrapper/dummy execution, real Hermes, real `execFile`, packaged smoke, Approval execution, Memory DB, or EA/MT5 work was performed.
- **Control Center legacy GET_SNAPSHOT IPC blocker fix (2026-05-07)**: legacy `controlCenter.readonly.getSnapshot` handler was retired from registered IPC channels and handler construction. The remaining public Control Center IPC path is `getAppSnapshot`, which returns the sanitized AppSnapshot path. Tests now assert the legacy channel is absent and raw `allowedApis` / `forbiddenApis` arrays are not present in IPC wire payloads. Preload remains `window.ichikishimaControlCenter.getAppSnapshot()` only.
- **Control Center legacy getSnapshot docs cleanup / tech debt tracking (2026-05-07)**: primary contract docs now mark `controlCenter.readonly.getAppSnapshot` as canonical and legacy `controlCenter.readonly.getSnapshot` as retired. `CONTROL_CENTER_TECH_DEBT.md` tracks low-risk AppSnapshot `redactedSummaryLines` wire slimming. No execution work was performed.
- **Control Center GET_APP_SNAPSHOT wire-safe local value validation summary slimming (2026-05-07)**: `ControlCenterAppSnapshot.wsl2LocalValueValidationSummary` no longer carries `redactedSummaryLines` on the IPC wire. Use the Hermes validator report for Signoff-only redacted lines, and keep the AppSnapshot summary to structured counts/status/policy fields. HOLD and execution-forbidden gates remain unchanged.
- **WSL selected slot failed / reselection flow (2026-05-07)**: selectedSlot=slot-02 is now represented as `availability=failed`, reason `distro_not_in_current_wsl_list`, `decision=HOLD`, `nextRequiredHumanAction=choose_another_slot`, `rawValuesReported=false`, and execution disabled. Slot reselection must use slot IDs only; do not expose raw distro names, WSL lists, local-only JSON, slot map content, unix users, or wrapper paths.
- **WSL refreshed slot inventory for safe reselection (2026-05-07)**: bounded `System32 wsl.exe -l -q` discovery refreshed the local-only slot inventory. Control Center may show distroDiscoveryStatus=refreshed, distroCount=3, selectableSlots=slot-01/slot-02/slot-03, selectedSlot=none, previousSelectedSlot=slot-02, previousFailureReason=distro_not_in_current_wsl_list, decision=HOLD, nextRequiredHumanAction=select_slot_id, rawValuesReported=false, execution=disabled. Raw distro names stay only in ignored local-only storage.
- **WSL refreshed selected slot recorded (2026-05-07)**: user selected slot-01 from refreshed inventory. Local-only slot map now records selectedSlot=slot-01. Control Center/docs expose only redacted status: selectedSlot=slot-01, previousSelectedSlot=slot-02, previousFailureReason=distro_not_in_current_wsl_list, decision=HOLD, nextRequiredHumanAction=verify_selected_slot_availability_locally, rawValuesReported=false, execution=disabled. No `wsl.exe -d`, whoami, WSL placement, wrapper/dummy, real Hermes, or real execFile work was performed.
- **WSL slot-01 availability failed / inventory consistency hardened (2026-05-07)**: slot-01 is recorded as availability failed with reason `distro_not_in_current_wsl_list`. Previous slot-02 failed history remains redacted. Legacy `inventoryConsistency` is retired for new summaries because it was count/content-ambiguous. Use `inventoryCountConsistency=matched`, `inventoryContentConsistency=partial`, `slotMapCount=3`, and `currentInventoryCount=3` instead.
- **WSL slot-01 distro name mismatch HOLD (2026-05-07)**: human operator visually compared the distro name field in the local-only slot map for slot-01 against the PowerShell WSL discovery result. Exact match was not confirmed. Partial match and visual similarity are treated as mismatch per policy. `buildHermesWsl2WrapperDistroNameMismatchRefreshSummary` was added to record this as a structured HOLD without exposing raw names. `distro_name_mismatch` added to `HermesWsl2WrapperSelectedDistroFailureCategory` and `HermesWsl2WrapperSlotInventoryRefreshSummary.previousFailureReason`. `resolve_slot_map_distro_mismatch` added to both `nextRequiredHumanAction` unions and the shell contract parser allowlist. Current redacted state: selectedSlot=unresolved / previousSelectedSlot=slot-01 / previousFailureReason=distro_name_mismatch / inventoryContentConsistency=mismatched / decision=HOLD / nextRequiredHumanAction=resolve_slot_map_distro_mismatch / rawValuesReported=false / execution=disabled. No raw distro names, WSL lists, local JSON values, Windows paths, or Linux paths were reported. No WSL/Hermes/wrapper/dummy/execFile execution was performed.
- **WSL slot map distro mismatch internal inspection (2026-05-07)**: internal read-only comparison of local-only slot map distroName fields was performed. Finding: wsl-wrapper-values.local.json distroName is still placeholder (unfilled). rawDistroEntries shows slot-01 distroName as encoding-corrupted (UTF-16 LE null bytes) and slot-02/slot-03 as null/empty. No slot produced an exact match. selectedSlot remains unresolved. `readHermesWsl2DistroSelectionLocalFileForRefreshSummary` was fixed: (a) reads previousFailureReason from file (supports distro_name_mismatch), (b) handles resolve_slot_map_distro_mismatch in nextRequiredHumanAction, (c) treats selectedSlot="none" as null to prevent normalizeSelectedSlot throw. decision=HOLD / nextRequiredHumanAction=update_local_only_slot_map_or_hold / rawValuesReported=false / execution=disabled. No raw values reported. No execution performed.
- **WSL local-only slot map repair HOLD (2026-05-07)**: local-only JSON inputs were normalized without raw output. selectedSlot is fixed to unresolved, previousSelectedSlot=slot-01, previousFailureReason=distro_name_mismatch, inventoryContentConsistency=mismatched, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=update_local_only_slot_map_or_hold. No slot is selected and no visual/partial similarity may be treated as a match.
- **WSL exact-match validation after local-only update (2026-05-07)**: local-only distro fields were compared internally without raw output. No exact slot match was found. Redacted state: exactMatchResult=no_match, matchedSlotCount=0, selectedSlot=unresolved, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=update_local_only_slot_map_or_hold. Do not select slot-02 or slot-03 from visual similarity.
- **WSL human-confirmed matched slot recorded (2026-05-07)**: human confirmed matchedSlotId=slot-02 after exact-match validation. Local-only slot map records selectedSlot=slot-02 and selectedSlotStatus=matched. Redacted state: previousSelectedSlot=slot-01, previousSelectedSlotStatus=mismatch, exactMatchReadiness=ready, exactMatchResult=single_match, matchCount=1, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=resolve_packaging_safety_gate. This is slot confirmation only; do not transition to GO or add execution wiring.
- **Packaging safety gate readiness (2026-05-07)**: packaging gate was resolved as non-execution readiness only. Redacted state: selectedSlot=slot-02, selectedSlotStatus=matched, packagingGateStatus=resolved_without_execution, packagingRiskLevel=low, packagingBlockers=none, canRunWsl=false, canRunHermes=false, canRunWrapper=false, canRunOnce=false, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=review_non_execution_readiness_before_go_policy. No WSL/Hermes/wrapper/dummy/execFile execution was performed.
- **WSL count-matched inventory mismatch classification (2026-05-07)**: inventory count and content are separated. Redacted state is `inventoryCountConsistency=matched`, `inventoryContentConsistency=partial`, `slotStatuses=slot-01:mismatch, slot-02:matched, slot-03:matched`, `decision=HOLD`, `execution=disabled`, `rawValuesReported=false`, `nextRequiredHumanAction=choose_matched_slot_id`. Do not expose raw distro names or run `wsl.exe -d`; any next selection must use matched slot IDs only.

- **GO policy fields added to validator / reader / contract (2026-05-07 overnight)**: `HermesWsl2WrapperSlotInventoryRefreshSummary` now includes `goPolicyReviewStatus`, `goPolicyRiskLevel`, `goPolicyBlockers`, `humanGoApprovalRequired`, `executionStillDisabled`. `buildHermesWsl2WrapperSlotInventoryRefreshSummary` builds these from params. `attachHermesWsl2WrapperSlotInventoryRefreshHold` line filter extended to pass `go_policy_*`, `human_go_*`, `execution_still_*` prefixes. `readHermesWsl2DistroSelectionLocalFileForRefreshSummary` reads these with strict allowlists. `ControlCenterShellLocalValueValidationBrief.slotInventoryRefreshSummary` in shared contract extended with parser validation. Test: "reads GO policy review fields as enum-only HOLD without enabling execution". 273 tests pass, both typechecks clean. Raw-leak sweep: no raw values in shared/renderer/preload layer. IPC sweep: `GET_SNAPSHOT` confirmed retired, all active channels `controlCenter.readonly.*`. Current redacted state: goPolicyReviewStatus=blocked / humanGoApprovalRequired=true / executionStillDisabled=true / decision=HOLD / execution=disabled / rawValuesReported=false.

- **Master design for review (2026-05-26)**: `docs/shikishima/SHIKISHIMA_FULL_AUTONOMOUS_OPERATION_MASTER_DESIGN.md` — 完全自律運用までの統合設計（精査用）。
- **Strategy pivot (2026-05-26)**: StackChan voice/device **HOLD / deferred**; prioritize **しきしま完全自律** (Phases 2–7, no StackChan dependency) until `connected: true` + human audible GO.
- **Full Autonomy Phases 1–7 code (2026-05-26)**: `src/main/shikishima-full-autonomy/` (snapshot, output policy, proposal engine, local work scope, external-effect registry/evaluator, safety governor, secretary mode, Discord voice bridge stub). Phase 1 guarded voice: `stackchan-voice-guarded-speak.ts` protocol parity (`subtitle`, extended WS frames). Tests: `tests/hermes/zone/full-autonomy/full-autonomy-phases.test.ts` (9 pass). Evidence: `docs/shikishima/PHASES_1_7_IMPLEMENTATION_EVIDENCE.md`. Phase 1 device audible acceptance remains **HOLD**; Discord bot **not wired** (`SHIKISHIMA_DISCORD_VOICE_BRIDGE` default OFF).

- **StackChan 実機GO 運用者手順書 (2026-05-28)**: `docs/shikishima/STACKCHAN_REAL_DEVICE_GO_OPERATOR_GUIDE.md`（バイブコーダー向け・コード不要手順）。永久記憶: `memory/MEMORY.md`。

- **StackChan voice pilot PASS (2026-05-28)**: Human audible PASS after updated one-shot. `stackchan_resume` complete for pilot scope. Double playback traced to `recordTalk` milestone follow-up; `skipMilestone` on `shikishima-voice-pilot-once.mjs`. Pipeline supports `voicePass: true` (FA-05 PASS, G1 CLOSED). Evidence: `STACKCHAN_VOICE_PILOT_ACCEPTANCE_2026-05-28.md`, `STACKCHAN_RESUME_NEXT_STEPS.md`. Production voice / Discord bridge still HOLD.

- **StackChan voice silent debug (2026-05-28; historical)**: Human initially reported `silent` after real-device GO. Confirmed: wired PC + Wi-Fi StackChan is acceptable on same LAN, `connected=true`, `voicevoxReady=true`, token present, auth probe `accepted_or_no_error`, VOICEVOX synthesis non-silent/strong. PC-side voice paths now read device WebSocket error frames and fail on `auth_required` / `audio_blocked` / `pcm_too_large`; pilot sets `STACKCHAN_VOICEVOX_VOLUME=1.6`. Firmware draft adds `audio_test` tone and `audio.state` (`armed` / `queued` / `play_start` / `play_done`) but requires flashing before it affects the device. Evidence: `docs/shikishima/STACKCHAN_VOICE_SILENT_DEBUG_2026-05-28.md`. Superseded by PASS above; do not retry audio without new `許可GO`.

- **Full Autonomy Phases 8–10 + master design Ch.1–13 code (2026-05-28)**: `src/main/shikishima-full-autonomy/` — `scheduler-recovery.ts`, `burn-in-monitor.ts`, `acceptance-matrix.ts` (FA-12 non-recursive), `goal-completion-validator.ts`, `design-review-checklist.ts`, `gap-tracker.ts`, `run-full-autonomy-pipeline.ts` (Phases 2–10). Tests: `tests/hermes/zone/full-autonomy/` **27 pass**. Evidence: `docs/shikishima/PHASES_8_10_IMPLEMENTATION_EVIDENCE.md`. Master design updated for StackChan voice PASS / FA-05 PASS / G1 CLOSED. No Discord wiring, burn-in wall-clock run, or execution enablement.

- **Full Autonomy enablement roadmap (2026-05-28)**: User requested ordered tasks to unlock Discord auto-send, StackChan production voice loop, Hermes Shadow/SideBot voice, and Level 8. Added `docs/shikishima/FULL_AUTONOMY_ENABLEMENT_ROADMAP_2026-05-28.md` (Tracks A–D, 許可GO phrases, human-GO matrix). Burn-in order unchanged: 15m smoke → 2h (`FULL_AUTONOMY_BURN_IN_PLAN_2026-05-28.md`). No runtime send, no flag ON, no git push.

- **Track A1 — 15m smoke Burn-in PASS (2026-05-28)**: Human `A1からGO`. Ran `npx tsx scripts/shikishima-burn-in-smoke-15m.mjs` (~900s wall-clock, 15×60s ticks, no sends, execution disabled). Evidence: `FULL_AUTONOMY_BURN_IN_SMOKE_15M_EVIDENCE.md` / `.json`. FA-11 → PARTIAL (2h pending). Next: Track A2 with separate GO.

- **Track B1 — Discord→StackChan voice one-shot PASS (2026-05-28)**: Human `B1にA2`. `npx tsx scripts/shikishima-discord-stackchan-voice-b1-once.mjs` — plan ALLOW_DRAFT, guarded WS send ok. Evidence: `FULL_AUTONOMY_B1_DISCORD_STACKCHAN_VOICE_EVIDENCE.md`. Bridge: active time window + `explicitPermittedGo`. Discord REST send not performed.

- **Track A2 — 2h Burn-in PASS (2026-05-28)**: `npx tsx scripts/shikishima-burn-in-2h.mjs` — 120 ticks, 7200s, exit 0, no sends. Evidence: `FULL_AUTONOMY_BURN_IN_2H_EVIDENCE.md` / `.json`. FA-11 → PASS.

- **Track A4 — Level 8 declaration (pilot, 2026-05-28)**: Human `終わったら次`. `FULL_AUTONOMY_LEVEL_8_DECLARATION_2026-05-28.md`. FA-12 PASS. Pipeline flags `burnInWallClockPass` + `pilotLevel8HumanDeclaration`. **execution / productionReady unchanged.**

- **Track B2 — Discord secretary bounded loop PASS (2026-05-28)**: `shikishima-discord-secretary-b2-bounded.mjs` — 3 cycles, 30s cooldown, no Discord REST. Evidence: `FULL_AUTONOMY_B2_DISCORD_SECRETARY_EVIDENCE.md`.

- **Track B3 — StackChan voice bounded loop PASS (2026-05-28)**: `shikishima-stackchan-voice-b3-bounded.mjs` — 3 phrases, skipMilestone. Evidence: `FULL_AUTONOMY_B3_STACKCHAN_VOICE_LOOP_EVIDENCE.md`. Human: `問題なし`.

- **Track C2/C3 — Hermes shadow voice PASS (2026-05-28)**: `shikishima-hermes-shadow-voice-c2-once.mjs`, `c3-bounded.mjs`. StackChan path only; Hermes/SideBot not started. Contract: `HERMES_SHADOW_VOICE_PILOT_CONTRACT.md`. `SIDEBOT_HOLD` unchanged.

- **Pilot PASS ledger (2026-05-28)**: Human `PASSバンバン` — `FULL_AUTONOMY_PILOT_PASS_LEDGER_2026-05-28.md`. Tracks A–C closed for pilot.

- **Track D operational release (2026-05-28)**: Human `どれもやっていいですよ`. `operational-release-state.ts` + gitignored `.shikishima-memory/operational-release.local.json`. Git push `e7a5529`.

- **Post-pilot ops release (2026-05-28)**: Human `実施してもらっていいです`. `sidebotHoldReleased` + `hermesDaemonPilotEnabled` in ops file; `sidebot-service.ts` / `index.ts` read `isSidebotHoldActive()`. `OPS_POST_PILOT_RELEASE_2026-05-28.md`, `scripts/shikishima-operational-status.mjs`. Hermes `npm run dev` remains **manual** (not auto-spawn).

- **GO policy non-execution review + human_review_go_policy_prerequisites (2026-05-08)**: Blocker review complete. Added `"human_review_go_policy_prerequisites"` to `nextRequiredHumanAction` union in validator interface, builder params, `hermes-wsl2-wrapper-local-value-file.ts` reader, and `control-center-shell-ui-contract.ts` (interface + allowlist + assignment). Added `buildHermesWsl2WrapperGoReadyForHumanReviewSummary(params: {distroCount, selectableSlots, previousSelectedSlot})`. Tests added for both validator and file-reader (275 pass). Local-only `wsl-distro-selection.local.json` updated (gitignored) with goPolicyReviewStatus=ready_for_human_go_review, goPolicyBlockers, humanGoApprovalRequired=true, executionStillDisabled=true, nextRequiredHumanAction=human_review_go_policy_prerequisites. Review doc: `GO_POLICY_REVIEW_REPORT.md`. All HOLD flags maintained. No execution.

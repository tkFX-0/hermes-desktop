# Goal Completion Report

## 1. Goal

イツキシマ / Hermes 開発環境を、構想段階で定義済みの「実運用前コア」まで到達させる。

ここでいうGoal達成は、本番連携ではなく、設計・型・未実装スタブ・テスト・Runbook・レビュー資料が揃い、次に安全に実装へ進める状態を意味する。

## 2. 達成したこと

- Hermes本体連携前レビュー文書を作成した。
- イツキシマReview Mode仕様、型、安全側判定、テストを追加した。
- 話す価値スコア仕様、型、安全側判定、テストを追加した。
- Memory Governance仕様を作成し、既存Memory Designへ接続した。
- Agent Team Architectureを作成した。
- Local / Cloud Escalation Policyを作成し、Cursor Agent Escalationへ接続した。
- Agent Visualization Implementation Planを作成し、Requirementsへ接続した。
- Suppressive Agent Architectureを作成した。
- NEXT_GOALSを作成した。
- MORNING_REVIEW_REPORTを更新した。
- **Controlled Pilot 実機前準備のみ（2026-05-03）**：`HERMES_EXECUTION_SPEC_DISCOVERY.md`、`HERMES_CONTROLLED_PILOT_RUNBOOK.md`、許可／結果報告テンプレ、`hermes-controlled-pilot-config`／`-preflight`／`-summary` と Vitest。**実機 1 回・実 `execFile` はユーザーが実行仕様値をすべて提示するまでしない**。
- **Controlled Pilot「値確認前準備」（文書・2026-05-05）**：`CONTROLLED_PILOT_VALUE_CONFIRMATION_REPORT.md` — 実行ファイル候補の棚卸し・argv／stdout 仕様の文書ベース確認・`signoffAtUnixMs` 候補。**実 Hermes 起動なし**。
- **WSL2 実接続 ADR + wrapper 契約（2026-05-05）**：`ADR_REAL_HERMES_WSL2_CONNECTION.md`、`HERMES_WSL2_WRAPPER_CONTRACT.md`、`hermes-controlled-pilot-config` の **`adapterKind` / `wsl_wrapper` **厳格 argv****。**実機・wsl 起動なし**。
- **Control Center App Shell read-only UI（Renderer · 2026-05-03）**：`ControlCenterAppShell.tsx`、`Layout` の `controlCenter` ビュー、`getAppSnapshot` のみ、`CONTROL_CENTER_APP_SHELL_UI_SPEC.md`、mockups `appShellParityPreview`。**実 Hermes・WSL・exec・E2E 起動はしない**。
- **Final Preparation Pack（メタ増分のみ · 2026-05-03）**：`hermes-wsl2-wrapper-config.ts`、`control-center-approval-audit-summary.ts`、`control-center-memory-summary.ts`、`preparedSafetyOutline`、Visualization / Agent-Team dry-run モジュール、dummy-bridge stub（**自動実行しない**）、`FINAL_READINESS_MATRIX.md`、`WINDOWS_APP_PACKAGING_PLAN.md`、`APP_ONLY_OPERATION_RUNBOOK.md`、IPC **`getAgentTeamSummary`/`getVisualizationModel`**（準備のみ）。**製品ウィンドウ・実行系無し**。
- **Packaged Control Center path resolution — prepared（2026-05-05）**：`CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md`、`control-center-project-root-resolution.ts`、Snapshot / Shell / Vitest。**実 packaged Electron 起動・実 Hermes / WSL / exec は未**。
- **Packaged path smoke — design gate（2026-05-05）**：`CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`（未記入テンプレ）、`control-center-packaged-smoke-checklist.ts` + Vitest。**実 smoke 実行・Signoff Go 記録は未**。
- **Final Read-only Validation Pack（2026-05-06）**：Task A packaged **electron smoke 未実行**（理由を Signoff に追記）。Task B **read-only UI polish**。Task C **dummy CJS CLI + テスト**：**静的** `dummy-hermes-stub-design-static.test.ts`、**ローカル明示プロセス** `dummy-hermes-stub-design.process-local.test.ts`（`RUN_DUMMY_HERMES_LOCAL_PROCESS`）。
- **Dummy process test local-only 化（2026-05-07）**：`spawnSync` は **環境変数付き明示実行時のみ**。**CI 既定は静的テストのみ subprocess なし**（`HERMES_WSL2_DUMMY_WRAPPER_PLAN.md`）。
- **electron-vite build smoke — Stage 1（2026-05-03）**：`npm run build` で main / preload / renderer の production bundle が通ることを確認。**packaged アプリ起動・`electron-builder`・`pendingPackagingResolution:false` 化ではない**（Signoff § Build smoke）。
- **packaged short launch smoke — 設計・契約・評価 TS（2026-05-03）**：`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`、`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_RUNNER_CONTRACT.md`、`control-center-packaged-short-launch-contract.ts` + Vitest。**実起動・`build:unpack`・Codex handoff なし**。Signoff に Short launch **テンプレのみ**。
- **WSL2 wrapper parameter registry（2026-05-03）**：`HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`、`hermes-wsl2-wrapper-parameter-registry.ts` + Vitest。Control Center Snapshot に **`wsl2WrapperParameterSummary`**。**`wsl.exe`・実 Hermes・execFile 未実行**。
- **WSL2 wrapper — dummy sample + 人手値確認 + allowlist/policy 厳格化（2026-05-03）**：`HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`、`hermes-bridge-payload-once.sh.sample`（**配置・実行禁止**）、registry に **`registryVersion` / `expectedPayloadSchemaVersion` / `logLevel`**（argv 非伝搬）、**`wsl.exe` は System32 exact match のみ**、`isForbiddenWrapperPathPolicy`。**実行・自動配置・外部通信・npm install なし**。
- **WSL2 wrapper — human value packet（2026-05-03）**：`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`、`hermes-wsl2-wrapper-human-value-packet.ts` + Vitest。Snapshot **`wsl2HumanValuePacketSummary`**。**Sysnative V1 拒否**。**実値コミット・実行なし**。
- **WSL2 wrapper — local value fill-in Runbook + redacted Signoff + shape/redacted helpers（2026-05-03）**：`HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`、`validateLocalOnlyValuePacketShape` / `summarizeRedactedLocalValuePacket`（**`fs` なし**）。**実値 repo 未入力・`wsl.exe` / execFile 未**。
- **WSL local value fill-in 手順確認 / namespace 明確化 / 日付整合チェック（2026-05-05）**：`HERMES_WSL2_WRAPPER_USER_NEXT_ACTION_CHECKLIST.md`、`DATE_CONSISTENCY_NOTES.md` を追加。Runbook / local-only README / Signoff 周辺を確認し、Control Center の `getAppSnapshot` only は **Ichikishima Control Center namespace 限定**で、既存 `window.hermesAPI` は別 namespace。2026-05-06 / 2026-05-07 は **human confirmation pending**。
- **WSL local-only value file creation（2026-05-05）**：`wsl-wrapper-values.local.json` を local-only に作成。**gitignored / untracked / unstaged**。raw 値は report / docs / Git に出していない。ユーザー実値は未提供のため推測記入せず、validator 実ファイル読込は次 Goal。**`wsl.exe`・実 Hermes・execFile 実機は未実行**。
- **WSL local-only validator / redacted summary / Signoff pipeline（2026-05-05）**：`hermes-wsl2-wrapper-local-value-validator.ts`、`hermes-wsl2-wrapper-local-value-file.ts`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md` を追加。placeholder / 未確認値は `HOLD`、危険値は `REJECT`、完全検証は redacted Signoff review 用 `GO`。Control Center には decision / status / counts / policy booleans のみ反映。raw 値は report / docs / Git に出していない。**`wsl.exe`・実 Hermes・execFile 実機は未実行**。
- **WSL local values validation → redacted Signoff preparation → dummy wrapper manual placement design（2026-05-06）**：local JSON を redacted-only で再確認し、decision は **`HOLD`**（present=13 / missing=0 / placeholder=6 / rejected=0）。`HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md` を追加し、Signoff / Runbook / Roadmap を同期。raw 値は report / docs / Git に出していない。**WSL内配置・wrapper実行・`wsl.exe`・実 Hermes・execFile 実機は未実行**。
- **WSL local-only values fill-in completion + validator rerun（2026-05-06）**：redacted-only validator rerun は **`HOLD`**（present=13 / missing=0 / placeholder=6 / rejected=0）。Signoff / Matrix / Roadmap を raw 値なしで更新。**`wsl.exe`・実 Hermes・execFile 実機・WSL内配置は未実行**。
- **WSL pre-execution readiness pack（2026-05-06）**：`FINAL_READINESS_MATRIX.md` に local values / redacted Signoff / dummy placement / dummy validation / pre-signoff / `wsl.exe` / real Hermes / `execFile` controlled pilot を分離。実行系はすべて **not ready** 維持。`GO` は redacted Signoff review のみ。

## 3. 未達成のこと

- Hermes本体完全連携。
- 監査ログの **SQLite／userData 恒久ストア統合および Hermes メインからの自動送り込み**（Local Pilot 向け Zone 内 **JSONL 追記のみ** は実施済）。
- 承認キュー **実行エンジン** と承認UI。
- 実行系・本番運用ダッシュボード級の UI 実装。**read-only Control Center App Shell（表示のみ）は Renderer に到達済**。
- 3D可視化。
- memory DB更新。
- イツキシマ自動発話。
- 外部通信。
- git操作。
- 既存EA/MT5連携。

## 4. 意図的に止めたこと

- npm install / 依存追加。
- 外部送信。
- git push。
- 実delete / 実execute / 実network / 実git操作。
- `.env`、APIキー、secrets、memory DBへのアクセス。

## 5. 判定

- Hermes Autonomy Zone: `READY_FOR_LOCAL_PILOT` を維持。
- Ichikishima: `SHADOW_MODE_READY` を維持。
- Goal: 達成。

## 6. 次の推奨

Hermes 本体連携**前レビュー**（Autonomy Zone の API 呼び出し境界のみ）へ進むか、承認キューの **実行フェーズ**を別 Goal で切り出す。SQLite 化・Electron userData 既定・自動ローテーションは追加レビューを挟んだ別 Goal とする。

Hermes本体完全連携、承認UI実行、イツキシマ自動発話はまだレビュー後にする。

## 追加追記 — 2026-05-03: Control Center V1 read-only Contract / Data Provider

- `CONTROL_CENTER_V1_API_CONTRACT.md` / `HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md` を Goal リストに沿って整備（既に配置済みの場合はコード・テスト追補のみ）。
- `getControlCenterReadonlyData`、`approval-queue-summary`、`audit-log-summary`、`getHermesBridgePilotReadiness` を **read-only** に限定して追加（Electron 画面・IPC バインド・実Hermes起動無し）。
- **未達**: Control Center アプリウィンドウ、Hermes 実本体 IPC、Renderer への raw Node 権限公開。

この範囲では問題を検出していません。

## 追加追記 — 2026-05-03（夜）: Control Center V1 read-only UI 設計ゲート

- V1 UI 方式比較・セキュリティモデル・IPC 契約・画面仕様・実装前 Readiness の **5 文書**を追加（**Electron/React 画面・依存追加・IPC 本番配線は未着手**）。
- `getControlCenterReadonlyData` に **`ipcBinding`**（current canonical: `controlCenter.readonly.getAppSnapshot` / schema `v1`; legacy `getSnapshot` retired）を付与し IPC 文書と整合。
- `HERMES_BRIDGE_API_REGISTRY.md` と `hermes-bridge-api-registry.ts` で **allowed/forbidden 識別子の単一参照元**を固定（全文パース同期はしない）。

この範囲では問題を検出していません。

## 追加追記 — 2026-05-04 前後: Control Center V1 UI Shell（文書＋静的 mock）

- UI Shell SPEC / UI Data Contract / Localhost Security / UI Shell Test Plan を追加。**Electron／HTTP／依存追加無し**。
- 静的モック `docs/ichikishima/mockups/control-center-v1-readonly.html`（script・CDN・外部通信なし）。
- 契約テスト `tests/ichikishima/control-center/control-center-readonly-snapshot-contract.test.ts` を追加。

この範囲では問題を検出していません。

## 7. Review Mode実用化Goal

追加で達成したこと:

- `evaluateReviewMode` が変更レポート文字列または構造化入力を審査できるようになった。
- 禁止領域、外部通信、git push、依存追加、MT5、EA本体、`.env`、secrets、memory DB、自動発話、通知を高リスクとして検出する。
- 実行テスト、未実行テスト、戻し方、触っていない重要領域を確認する。
- 実装コード変更で実行テストがない場合は `hold` に倒す。
- 次工程がHermes本体連携など高リスク境界の場合は `nextStepRisk` に追加する。
- `reviewHermesReport` をReview Mode判定に接続し、文字列入力にも対応した。

維持した禁止事項:

- 自動承認しない。
- 自動発話しない。
- 通知しない。
- memory DB更新しない。
- 外部通信しない。
- Hermes本体完全連携しない。

判定:

- Review Mode実用化Goal: 達成。

## 8. Memory Candidate / Memory Agent候補Goal

追加で達成したこと:

- Memory Candidate仕様書を作成した。
- Memory Agent仕様書を作成した。
- `extractMemoryCandidates` の型定義と最小分類ロジックを追加した。
- 記憶カテゴリを `transient_memory` / `working_memory` / `project_memory` / `episode_memory` / `long_term_profile` / `safety_policy_memory` / `forbidden_memory` として定義した。
- safety policy memoryとlong-term profileは承認必須にした。
- forbidden memoryは保存候補にせず、本文を伏せて拒否候補にした。
- Memory Candidate分類テストを追加した。

維持した禁止事項:

- memory DBを読まない。
- memory DBへ書かない。
- SQLite接続しない。
- 既存memory機能へ直接接続しない。
- 自動保存しない。
- safety policyを自動更新しない。
- long-term profileを自動更新しない。
- 外部通信しない。

判定:

- Memory Candidate / Memory Agent候補Goal: 達成。

## 9. Approval Report UI/CLI前段Goal

追加で達成したこと:

- Approval Report仕様書を作成した。
- Approval Report型を追加した。
- Review Mode結果から承認レポートを生成できるようにした。
- Memory Candidate結果の要約を承認レポートに含められるようにした。
- Markdown形式の承認レポートを生成できるようにした。
- JSON形式の承認レポートを生成できるようにした。
- 秘密情報らしき文字列をマスクする処理を追加した。
- `requiresUserApproval:true` と `autoApproved:false` を固定した。
- Approval Report単体テストを追加した。

維持した禁止事項:

- UI実装しない。
- Electron / React画面を作らない。
- 自動承認しない。
- 承認実行処理を作らない。
- Hermes本体完全連携しない。
- memory DBを読まない、書かない。
- 外部通信しない。
- git操作しない。

判定:

- Approval Report UI/CLI前段Goal: 達成。

## 10. 監査ログ本体仕様・テスト設計Goal

追加で達成したこと:

- `AUDIT_LOG_SPEC.md` を作成し、監査ログの目的と非目的を定義した。
- `auditEventCandidate` と `AuditLogRecord` の違い、正規化パイプラインの責務を定義した。
- 保存してよい項目と保存してはいけない項目を列挙した。
- 監査イベント種別（`kind`）を定義し、既存 Zone の `auditEventCandidate` との対応付けを記載した。
- ログ保存先候補、append-only 方針、マスク方針、サイズ制限・ローテーション案を記載した。
- `AUDIT_LOG_TEST_PLAN.md` を作成し、テストケースIDと観点を設計した（実行テストは未追加）。

維持した禁止事項:

- `src/` 実装の追加をしない。
- `tests/` に実行テストを追加しない。
- ファイル書き込み、DB、SQLite、memory DB、外部通信をしない。
- AuditLogger 本体、UI、ログビューア、Hermes本体連携をしない。
- npm install / 依存追加をしない。

判定:

- 監査ログ本体仕様・テスト設計Goal: 達成。

## 11. AuditLogger 未実装スタブ・型・仕様準拠テスト Goal

追加で達成したこと:

- `src/main/ichikishima/audit/audit-log.ts` に `AuditLogRecord`、`AuditEventKind`、`AuditAgent`、`AuditEventSource`、`AuditRiskLevel`、`AuditStatus`、`NormalizeAuditEventInput` と `NormalizeAuditEventResult`、`maskAuditSensitiveText`、`normalizeAuditEvent`、`createAuditLogRecord` を追加した（当時、`saveAuditLog` は `NOT_IMPLEMENTATION` スタブとした）。
- Zone の `auditEventCandidate` と人工イベント（approval / review / memory）入力を **`AuditLogRecord` に正規化**できるようにした。
- `agent` / `source` / `riskLevel` / `kind` を付与し、ブロック系は `kind: *_blocked` と `status: blocked` とした。
- `contentIncluded:false` を固定し、reason と metadata にマスクを適用した。
- `tests/ichikishima/audit/audit-log.test.ts` を追加した。

- `saveAuditLog` は当初 `NOT_IMPLEMENTATION` スタブだったが、後続 Goal（§12）で **JSONL 追記**へ拡張した。

維持した禁止事項（当該 Goal 当時）:

- SQLite / memory DB / userData 実装、外部通信、UI、Hermes本体完全連携、git、`npm install` / 依存追加をしない。
- `.env`/secrets を読み取らない（マスクのみでパターンマッチ）。

判定:

- AuditLogger 未実装スタブ・型・仕様準拠テスト Goal: 達成。

## 12. AuditLogger 最小実装（JSONL・Zone sandbox）Goal

追加で達成したこと:

- `src/main/ichikishima/audit/audit-save.ts` を追加し、`saveAuditLog(record, options)` で **Hermes Autonomy Zone 内**のみに **JSONL 追記**（`audit-YYYY-MM-DD.jsonl`、`appendFileSync` のみ）できるようにした。
- **`checkZonePath` / `checkDenylist` / project 内 Zone 収容** で保存先とファイルパスを検証した。
- `sanitizeRecordForPersistence` を追加・公開し（`audit-log.ts`）、保存前に **8KiB** 上限と `content` 混入拒否、`contentIncluded:false` を強制した。
- **`maskAuditSensitiveText`** で `sk-` 鍵様・長大エントロピー文字列・`.env` 行らしき文言をより安全にマスクするよう調整した。
- `tests/ichikishima/audit/audit-log.test.ts` に追記・拒否パス・シンボリックリンク（POSIX）等の検証を追加した。
- `sandbox/hermes-autonomy-zone/audit/README.md` と `.gitkeep` を追加した。

維持した禁止事項:

- SQLite・memory DB 接続、Electron userData を既定パスとして実装しない、自動ローテーション実装しない、Hermes メイン自動連携しない、外部送信、UI、`npm install` / 依存追加、git、`MT5`/EA変更。

判定:

- AuditLogger 最小実装 Goal: 達成。

## 13. Approval Queue Core（sandbox JSONL）Goal

追加で達成したこと:

- `APPROVAL_QUEUE_SPEC.md` を追加し、`pending/approved/rejected/held/expired/cancelled` と append-only の責務を定義した（`approved` は記録のみ、実行しない）。
- `approval-queue.ts` に `ApprovalQueueItem` と `createApprovalQueueItem` / `normalizeApprovalQueueItem` / `updateApprovalQueueItemStatus` / `maskApprovalQueueSensitiveText` を追加した（`requiresUserApproval:true`、`autoExecutable:false` 固定）。
- `approval-queue-store.ts` で `saveApprovalQueueItem` / `readApprovalQueueItems` / `appendApprovalQueueStatusEvent` を実装（`sandbox/hermes-autonomy-zone/approval/`、`approval-YYYY-MM-DD.jsonl`）。
- `createApprovalQueueItemFromReport` と Blocker アダプタ（delete / execute / network / git）からキュー候補を生成できるようにした（実操作は実行しない）。
- `AuditLogRecord.kind` に `approval_queue_item_created` / `approval_queue_status_changed` を追加し、`normalizeAuditEvent` で正規化できるようにした。
- `tests/ichikishima/approval/*.test.ts` と pilot テストを追加した。

維持した禁止事項:

- Hermes本体完全連携、UI、実行エンジン、SQLite/userData 既定、外部通信、git、`npm install` / 依存追加、`MT5`/EA、`.env`/secrets 直接読取、memory DB。

判定:

- Approval Queue Core Goal: 達成。

## 14. Ichikishima Control Center（V0 仕様のみ）Goal

追加で達成したこと:

- **完全独自 Windows アプリ構想**を `CONTROL_CENTER_SPEC.md` に集約した（hermes-desktop は参照のみ・取り込み禁止）。
- フロント/バック分離、FE 候補比較、論理バックエンド API 名を `CONTROL_CENTER_ARCHITECTURE.md` に記載した。
- Room 別要件を `CONTROL_CENTER_ROOMS.md`、パイプラインと禁止操作を `CONTROL_CENTER_PIPELINES.md` に記載した。
- V0〜V7 の段階計画を `CONTROL_CENTER_IMPLEMENTATION_PLAN.md` に記載した。

維持した禁止事項:

- UI 実装、Electron/React 画面、`npm install` / 依存追加、Hermes 本体接続、外部通信、memory DB・MT5/EA・自動発話・危険操作の実行。

判定:

- Ichikishima Control Center V0 Goal: **達成**（文書のみ）。

## 15. Local Pilot Full Loop + Hermes Bridge（2026-05-03）

追加で達成したこと:

- `HERMES_BRIDGE_CONTRACT.md` / `HERMES_LOCAL_PILOT_RUNBOOK.md` / `ICHIKISHIMA_ORCHESTRATOR_SPEC.md` / `LOCAL_PILOT_FULL_LOOP_SPEC.md` / `ROADMAP_STATUS.md` / `IMPLEMENTATION_GAP_ANALYSIS.md`。
- `hermes-bridge.ts`（分類スタブ）、`hermes-local-pilot.ts`（dummy read/write）、`ichikishima-orchestrator.ts`（統合レポート生成、memory DB に保存しない）、`local-pilot-full-loop.ts`、`control-center-status.ts`（read-only モデル、UI 無し）。
- `tests/ichikishima/hermes|orchestrator|pilot|control-center` および既存 `tests/hermes/zone` 一式。

維持した禁止事項:

- §3 / §4 と同じ（Hermes本体自動起動・外部通信・依存追加・実行エンジン・自動発話など）。

判定:

- **Sandbox とテストの範囲で Local Pilot Full Loop Goal 達成**。`READY_FOR_LOCAL_FULL_LOOP` と `CONTROL_CENTER_V1_DESIGN_READY`（コード上の read-only ステータス）は条件付きテストで確認可能（本番HermesやUIアプリを意味しない）。

## 16. 稼働前総点検 + V1 Read-only 準備 + Bridge Final Review（同一セッション）

追加で達成したこと:

- `HERMES_BRIDGE_FINAL_REVIEW.md`（許可／禁止／停止条件／チェックリスト／最小Pilot方針）。
- `ROADMAP_STATUS.md` / `IMPLEMENTATION_GAP_ANALYSIS.md` の総点検版へ更新。
- `ControlCenterReadonlyStatusModel` 拡張（doc パス定数、`blockedOperationApproxCount`、`riskSummaryLines`、Hermes/Ichikishima shadow ラベル、次Goalヒント）。
- `CONTROL_CENTER_SPEC.md` §12、`CONTROL_CENTER_ARCHITECTURE.md`、`CONTROL_CENTER_ROOMS.md`、`CONTROL_CENTER_PIPELINES.md`、`CONTROL_CENTER_IMPLEMENTATION_PLAN.md` V1 精密化節、`NEXT_GOALS.md` Goal 並び替え。
- Hermes本体・UI・外部通信には未着手。

維持した禁止事項:

- §15 と同様。

判定:

- **文書および read-only モデル範囲で Goal 達成**。Hermes本体接続・UIウィンドウは次フェーズへ委譲。

## 17. Control Center V1 Static Read-only Shell（2026-05）

追加で達成したこと:

- `docs/ichikishima/mockups/control-center-v1-snapshot.sample.json`（Provider / `CONTROL_CENTER_READONLY_IPC_BINDING` と同一 `disabledActions` 順）。
- `docs/ichikishima/mockups/control-center-v1-static-shell.{html,css,js}` — read-only のラベル／Security markers／各部屋表示。実行系は **`disabled`** のみ。**外向きネットワーク・IPC・実 Hermes 無し**。
- `tests/ichikishima/control-center/control-center-static-shell.test.ts`（CDN 形式 URL・危険 API 文字列・`fetch(`・pipeline `disabled` 等）。
- 関連 SPEC / 計画 / Handoff / `NEXT_GOALS` / `ROADMAP_STATUS` / 本項の整合追記。

維持した禁止事項:

- `npm install`、外部 CDN、実 HTTP server、Electron ウィンドウ、preload、React/Tauri/WebView2 画面、実 IPC、Hermes 実ランタイム、secrets 全文、危険操作の実行。

判定:

- **Static Shell および静的検証テストの範囲で Goal 達成**。127.0.0.1 read-only API または Hermes Bridge Pilot は **別承認の次 Goal** とする。

## 18. Hermes Bridge Pilot（実本体なし）＋ Static Shell JSON ガイドライン（2026-05）

追加で達成したこと:

- `HERMES_BRIDGE_PILOT_SPEC.md`、`HERMES_BRIDGE_OPERATION_MATRIX.md`。`hermes-bridge.ts` に `dependency_install` / `external_ai_escalation` と **`bridge_requires_approval`** ティア。`hermes-local-pilot.ts` で承認キューへ積む（実行なし）。
- `getHermesBridgePilotReadiness` ゲート文書 4 本化、ラベル **`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`**。
- `tests/ichikishima/hermes/hermes-bridge-pilot.test.ts`。`local-pilot-full-loop` の typo 修正。
- `CONTROL_CENTER_STATIC_SHELL_JSON_GUIDELINES.md` と Static Shell への注意リンク。
- Handoff / `NEXT_GOALS` / ROADMAP / Checklist / MORNING 追記。

維持した禁止事項:

- 実 Hermes 起動、**Hermes Pilot 内の arbitrary HTTP bind**、Electron UI、外部通信、npm install、`git push`、EA/MT5、memory DB、secrets 明示、危険操作の自動実行。

判定:

- **Bridge Pilot dry-run とドキュメント範囲で Goal 達成**。実 Hermes IPC／Renderer expose は別承認。**Control Center Local HTTP は §20 と別経路で V1 minimal 済**（Hermes と混同しない）。

## 19. Control Center Local read-only API — Threat Model / 実装前設計のみ（2026-05）

追加で達成したこと:

- `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md`、`CONTROL_CENTER_LOCAL_API_CONTRACT.md`、`CONTROL_CENTER_LOCAL_API_IMPLEMENTATION_GATE.md`、`CONTROL_CENTER_LOCAL_API_TEST_PLAN.md`。
- `CONTROL_CENTER_V1_LOCALHOST_SECURITY.md` / `CONTROL_CENTER_V1_IPC_CONTRACT.md` / `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md` への参照更新。
- `local-api-contract.ts`（**`GET /snapshot` のみ**、禁止リスト定数、`127.0.0.1` 定数）。
- `local-api-contract.test.ts`。`NEXT_GOALS` に **Goal CC-L01**。Handoff／ROADMAP／MORNING 整合。

維持した禁止事項:

- **`listen`、`createServer`、ポート bind 実装、HTTP レスポンス実装、`fetch` 外向き、npm install、`git push`**、Hermes 実起動。

判定:

- **設計〜契約コードまでのフェーズ達成（当時サーバ無し）**。続く **§20** で **Local HTTP V1 minimal** を実装済み。

追加で達成したこと:

- `local-api-server.ts` — **`node:http`** のみ、**`127.0.0.1` bind**、**`GET /snapshot`**、禁止メソッド／パス、**CORS/HEAD/OPTIONS 拒否方針**、**507**（Snapshot 上限）、二重 start 拒否・`stop`。
- `local-api-contract.ts` — **`HEAD`/`OPTIONS`** を禁止メソッドに固定、既存 allowed/forbidden 定数と整合。
- `local-api-server.test.ts`。関連ドキュメント（`CONTROL_CENTER_LOCAL_API_*`、`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`、`IMPLEMENTATION_HANDOFF.md`、`NEXT_GOALS.md`、`ROADMAP_STATUS.md`）を V1 実装済みに更新。

維持した禁止事項:

- **`npm install`/`git push`、外部通信、Electron renderer/preload、実 Hermes 起動、EA/MT5、memory DB、secrets 露出、実行系 API、常時 listen のアプリ配線**（**API はライブラリとして存在** — 起動は呼び出し側の別 Goal）。

判定:

- **Local HTTP V1 minimal の範囲で Goal 達成**。次は **Static Shell fetch 配線（同一 Origin レビュー）**、**V1.5 token/Origin**、または **Bridge Pilot / IPC UI**。

## 21. ADR — IPC vs Local HTTP / Ownership（設計のみ・2026-05）

追加で達成したこと:

- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`、`CONTROL_CENTER_OWNERSHIP_MODEL.md`、`HERMES_BRIDGE_OWNERSHIP_MODEL.md`。**Electron 本命 = IPC read-only**。Local HTTP = 補助。Bridge と Local API / Snapshot の **混線禁止** を文書固定。
- 既存 `CONTROL_CENTER_*` / `HERMES_BRIDGE_FINAL_REVIEW.md` / Registry / NEXT_GOALS / ROADMAP / HANDOFF / MORNING への **参照リンク**。

維持した禁止事項:

- **preload/renderer 実装、実 IPC、`listen` の追加、`npm install`、外部通信、実 Hermes、EA/MT5、memory DB**.

判定:

- **文書のみの Goal 達成**。次は **`HERMES_BRIDGE_FINAL_REVIEW` の継続**（人手ゲート）。

## 22. HERMES_BRIDGE_FINAL_REVIEW コード正突合・IPC メタ固定（2026-05）

追加で達成したこと:

- `hermes-bridge-readiness.ts`: **`DOC_REL`** に **`ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`、`CONTROL_CENTER_OWNERSHIP_MODEL.md`、`HERMES_BRIDGE_OWNERSHIP_MODEL.md`** を追加（欠落時 `NOT_READY`）。
- `hermes-bridge-api-registry.ts`: **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`** / **`HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`**、`HERMES_BRIDGE_READINESS_REQUIREMENTS` 拡張。
- `HERMES_BRIDGE_FINAL_REVIEW.md` **§8 チェックリスト**、`HERMES_BRIDGE_OPERATION_MATRIX.md` に **`routeHermesOperation` tier**列、各 Bridge 関連 doc の整合。
- テスト: `hermes-bridge-registry-ipc-candidate.test.ts`、`hermes-bridge-api-registry.test.ts` 追補、**`DEPENDENCY_INSTALL_POLICY_BLOCKED`** を厳密一致。

維持した禁止事項:

- 実Hermes、`ipcMain`/`preload`、`listen` の追加、`npm install`、外部送信、実行エンジン自動化。

判定:

- **Final Review とコード／Vitest が同一リビジョンで突合済み**。次は **人手署名** と **Pilot 次段階 Goal**。

## 23. HERMES_BRIDGE_FINAL_REVIEW 人手クローズ・Registry IPC を getReadiness 一本化（2026-05）

追加で達成したこと:

- `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md` 作成。
- **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`** を **`hermesBridge.registry.getReadiness` のみ**に変更。一覧系は **`HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`** に移動。
- `FINAL_REVIEW` / IPC Contract / ADR / Registry / Ownership / NEXT_GOALS / ROADMAP / HANDOFF / Pilot SPEC/Dry-run を追従。

維持した禁止事項:

- 実 Hermes、`ipcMain.handle` / preload、`listen`／HTTP の追加、`npm install`。

判定:

- **人手クローズ可能な状態**まで文書準備済み。**Sign-off は人手が記録**する。

## 24. Hermes Bridge Pilot Dry-run 次段階（シナリオ A〜E・2026-05）

追加で達成したこと:

- `continueAfterForbiddenClassification` による mixed 分類、`status: partial`、forbidden のループ内「未実行」記録。
- `hermes-bridge-pilot-dry-run.ts`: `runHermesBridgePilotDryRunSuite`／`HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL`（**readiness とは独立**）。
- `tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts`、`HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md` §9、関連仕様書追従。

維持した禁止事項:

- 実 Hermes、`ipcMain.handle` / preload、renderer、HTTP `listen` の追加、`npm install`、外部通信、EA/MT5、memory DB 本番経路、自動承認・自動実行。

判定:

- **実接続前 dry-run の複数シナリオ到達**。**実 Hermes 接続可否は人手 Final Review / Signoff の後の別判断**。

## 25. Hermes Bridge Payload Contract / Validation（v1・実 Hermes 未接続・2026-05）

追加で達成したこと:

- **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`**、`DOC_REL` 8 件化（readiness）。
- **`hermes-bridge-payload.ts`**: inbound JSON v1。**unknown / malformed / 件数・サイズ／path 異常／secrets ヒューリスティック**を reject。Production 相当では **`partialEligible` を強制オフ**。
- Dry-run が **Payload を前段検証**。Control Center で **`scenarioSuiteLabel` と `readinessLabel` を分離する**運用を文書化。

維持した禁止事項:

- 実 Hermes 本体起動、ipc/preload/renderer、listen、任意 `npm install`、EA/MT5、memory DB 本番、自動実行エンジン。

判定:

- **実機接続前の ingress 契約がコードと Vitest で固定済み**。次は **Hermes が未知 operation を増やしたときの適用順序レビュー**。

## 26. Hermes 実接続 Pilot 直前レビュー（Preflight／文書のみ・2026-05）

追加で達成したこと:

- **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`**: Go/No-Go・停止条件・Ingress schema・Receiver・fail-closed・Approval/Audit・Review Mode・Control Center 非混線・validated 伝搬禁止。
- **`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`**: 実接続時の最小 read/write、sandbox、操作分類と一致する上限。
- **`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`**: dequeue/envelope と **validated の外向き伝搬禁止**。
- **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15**、**`HERMES_BRIDGE_RECEIVER_QUEUE.md`** §6、`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §11、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md` **E-16〜E-21**、`NEXT_GOALS.md`（Goal RP-Preflight・§3）、`ROADMAP_STATUS.md`、`IMPLEMENTATION_HANDOFF.md`、`HERMES_BRIDGE_FINAL_REVIEW.md`（次に進むなら）、`HERMES_BRIDGE_PILOT_SPEC.md`。
- `hermes-bridge-payload.ts` / `hermes-bridge-receiver-queue.ts`: 伝搬ポリシーを指すファイルヘッダコメント追記。

維持した禁止事項:

- 実 Hermes 本体起動、`ipcMain.handle` / preload/renderer、Electron UI 実行系、HTTP `listen` 追加（Bridge 側）、外部通信、`npm install`、承認済み自動実行。

判定:

- **Preflight 文書セットでコード実装に先立つ運用ゲートが固定**。実ランタイム接続は **Preflight が Go でかつ明示承認の Pilot コード Goal**。

## 27. Hermes Connection Adapter Stage 0（in-memory・実 Hermes 未接続・2026-05-03）

追加で達成したこと:

- **`HERMES_CONNECTION_ADAPTER_CONTRACT.md`**: 接続段階（Stage 0〜3）、禁止方式、payload / Receiver / timeout との関係、validated 伝搬禁止、人手 Signoff 前の停止条件。
- **`hermes-connection-adapter.ts`**: **`in_memory` のみ**受理。`validateHermesConnectionAdapterInput` → **`validateHermesBridgePayload` 必須**。`validateAdapterResultForReceiverQueue` / `enqueueViaAdapterLanePipeline`（production **fail-closed**）。
- **`hermes-bridge-readiness-summary.ts`**: Control Center 向け Bridge 状態の **安全要約**（`allowedApis` / `forbiddenApis` の**詳細配列**および validated 全文を **返さない**）。
- **`hermes-bridge-payload.ts`**: `SUSPICIOUS_CONTENT` 検査を **JSON `\n` エスケープ後**の `PASSWORD=` 等にも届くよう補強。
- テスト: `hermes-connection-adapter.test.ts`、`hermes-bridge-readiness-summary.test.ts`、および既存 `hermes-bridge-payload.test.ts` 追補。

維持した禁止事項:

- 実 Hermes、`child_process`、`ipcMain.handle`/preload/renderer 新增、Bridge 側 HTTP `listen`、外部通信、`npm install`、EA/MT5、memory DB 本番、承認済み自動実行。**`src/main/index.ts` へのイツキシマ配線なし**。

判定:

- **Stage 0 の契約と実装が Vitest で固定**。実 Hermes Pilot は **Preflight／人手ゲート後**。Stage 1 File Handoff は **§28**。

---

## 28. Hermes Connection Stage 1 — Sandbox File Handoff（実 Hermes 未接続・2026-05-03）

追加で達成したこと:

- **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`** と **`sandbox/hermes-autonomy-zone/handoff/`**（`README.md`、`inbox`/`processed`/`rejected` の `.gitkeep`）。
- **`hermes-file-handoff-adapter.ts`**: 平坦 **`inbox` のみ**、`processed`/`rejected` に **marker のみ**。**`validateHermesConnectionAdapterInput`→`enqueueViaAdapterLanePipeline`**。**inbox は V1 削除しない**。
- Vitest **`hermes-file-handoff-adapter.test.ts`**。
- **`HERMES_CONNECTION_ADAPTER_CONTRACT.md`** / Preflight／Receiver／Payload／Entry／SIGNOFF／`NEXT_GOALS`／`ROADMAP`／`HANDOFF` へ **Stage 1 完了**を反映。

維持した禁止事項:

- 実 Hermes、`child_process`、stdin/stdout、sockets、listen、IPC/renderer、依存追加。**`src/main/index.ts` 非配線**。

判定:

- **Stage 1 コード path が Vitest で固定**。実 Hermes Pilot minimal は **Preflight／人手 Signoff 後の明示 Goal のみ**。

---

## 29. Stage 1 追補 — marker collision policy / 手動 cleanup Runbook（実 Hermes 未接続・2026-05-03）

追加で達成したこと:

- **`hermes-file-handoff-adapter.ts`**: marker ファイル名に **UTC タイムスタンプ**を含め、**既存 marker を上書きしない**。**同一タイムスタンプで衝突**する場合は **`.1`、`.2`…** の連番を付与。試行上限超過は **`HANDOFF_MARKER_PATH_COLLISION`**。
- **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`**: §5 / §5.1（命名・衝突 policy）、§7.1（**inbox 自動削除なし**・手動 cleanup・secrets 禁止・自動 cleanup は別 Goal）。
- **`sandbox/hermes-autonomy-zone/handoff/README.md`**: Cleanup Runbook 節を追記。
- **Vitest** `hermes-file-handoff-adapter.test.ts` — 同名再実行での **2 ファイル生成**、**marker に raw payload 全文なし**（既存方針の維持）を含む追補。
- **関連契約の同期**: `HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`（E-23）、`NEXT_GOALS.md`、`ROADMAP_STATUS.md`、`IMPLEMENTATION_HANDOFF.md`。

維持した禁止事項:

- 実 Hermes、`child_process`、stdin/stdout、sockets、HTTP `listen`、IPC/renderer、**inbox / marker の自動削除**、依存追加、**`src/main/index.ts` 非配線**。

判定:

- **Stage 1 の運用安全性（監査で marker が消えない）をコード＋契約で固定**。次の主ゲートは **人手 Signoff** または **Preflight Go 後の Real Hermes Pilot Minimal Implementation**。

この範囲では問題を検出していません。

---

## 30. Real Pilot Minimal Pipeline（実プロセス無し・2026-05-03）

追加で達成したこと:

- **`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`** と **`hermes-real-pilot-minimal.ts`** / **`hermes-real-pilot-summary.ts`** / **`hermes-real-process-adapter.ts`（stub）**。
- **Vitest** `tests/ichikishima/hermes/hermes-real-pilot-*.test.ts`。
- **Entry E-24**、Preflight／Pilot scope／関連契約の同期。

維持した禁止事項:

- 実 Hermes 本体起動、実 `child_process`／spawn／exec、listen、IPC/renderer、自動承認実行、依存追加。**実接続 READY の自動宣言なし**。

判定:

- **handoff 起点の統合パイプラインがコードで再現可能**。次は **人手 Signoff 後の Real Hermes Process Adapter**（別 Goal）。**`NOT_READY_FOR_REAL_HERMES_PROCESS`** を維持。

この範囲では問題を検出していません。

---

## 31. Real Hermes Process Adapter Final Gate（文書・Signoff／Entry／Preflight 同期・stub 確認強化・2026-05-03）

追加で達成したこと:

- **`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`**: **`child_process` を書く直前の最終チェックリスト**（許可コマンド固定、`shell:false`/`shell:true` 禁止、任意コマンド禁止、cwd/env 最小、stdout/stderr 上限・全文保持禁止、timeout/kill 必須、process handle を外へ返さない、validation → Receiver、fail-closed、Audit/Approval/Review への生ログ禁止、Go/No-Go）。
- **Signoff §12**、**Entry E‑25**、**Preflight §22**、**Pilot scope §0.1** に Process Adapter Final Gate 確認欄・解禁条件を追記（既存リビジョンと整合）。
- **`hermes-real-process-adapter.ts`**: ファイル先頭に Final Gate / Signoff / Entry への参照コメント。戻り値は **status / reasonCode / message のみ**。
- **Vitest** `hermes-real-process-adapter.test.ts` — 安全なトップレベルキー、`stdout`/`stderr` 文字列不在、ソースに `child_process` import / `spawn(` / `execFile(` なし。

維持した禁止事項:

- 実 Hermes 起動、**`child_process` import**、spawn/execFile 実装、stdin/stdout adapter、listen、IPC/renderer、依存追加。**実接続の自動 Go 扱いなし**。

判定:

- **subprocess に入る前の運用ゲートが文書で固定**。次のコード Goal 候補は **Real Hermes Process Adapter Minimal Implementation**（**ユーザー明示承認必須**）。

この範囲では問題を検出していません。


---

## 32. Real Hermes Process Adapter Minimal Implementation（execFile のみ・2026-05-03）

追加で達成したこと:

- `hermes-real-process-adapter.ts`：`child_process.execFile` のみ。allowlist executable・argv・cwd・最小 env・timeout・stdio 上限。stdout JSON → `validateHermesBridgePayload`。`runHermesRealProcessIngressExec` で validated payload を **`hermes-real-pilot-minimal` チェーンのみ**へ。単体は `__testOnlySimulateExec`。
- `runHermesRealPilotMinimalFromExecAdapter`：Exec → Receiver → Pilot。
- `hermes-real-pilot-summary.ts`：`REAL_HERMES_PROCESS_ADAPTER_MINIMAL_CODE_READY` 等（**本番 READY ではない**）。
- `path-guard.ts`：復元と read-policy 文言整合。
- `HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md` ヘッダ更新。
- Phase 7 関連ドキュメント同期：`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`、`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`（§11/§12）、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`（E-24/E-25）、`ROADMAP_STATUS.md`、`NEXT_GOALS.md` §1/§3、本レポート継続記録。

維持した禁止事項:

- `index.ts` 配線、IPC/renderer、`npm install`、実 Hermes 常駐、外部通信。

判定:

- **次 Goal 候補：Controlled Pilot Run**（人手・短時間）。Control Center 本番 IPC は別。

この範囲では問題を検出していません。

---

## 33. Real Hermes Process Adapter Controlled Pilot Run — コードパス（policy / signoff メタ・2026-05-03）

追加で達成したこと:

- `hermes-real-process-adapter.ts`：**`HermesRealProcessControlledPilotPolicy`**／**`HermesAllowedExecutablePolicy`**／**`HermesAllowedArgPolicy`**。**`controlledPilot` 必須**（許可 executable id・allowlist・固定 argv・signoff メタ）。**`runRealHermesProcessAdapterWithPolicy`**。**`signoffEvidence`**（短文メタのみ）。invocation 構造エラー時は **証跡未付与**。
- `hermes-real-pilot-summary.ts`：**`REAL_HERMES_PROCESS_CONTROLLED_PILOT_CODE_READY`**（**本番 READY ではない**）。
- 関連 Vitest・**fake runner のみ**。

維持した禁止事項:

- `spawn` / `exec()` / `shell:true`、任意 argv、常駐、`index.ts`/IPC/renderer、`npm install`、外部通信、stdio/payload 全文の返却。

判定:

- **次**: **Controlled Pilot 実機 1 回**（手動／別承認）または **Control Center read-only App Shell UI**。

この範囲では問題を検出していません。

---

## 34. Control Center — preload read-only `getAppSnapshot` 最小公開（2026-05-03）

達成内容:

1. **`src/preload/ichikishima-control-center.ts`**: `createIchikishimaControlCenterPreloadApi()` — **`invoke` は read-only チャンネル定数 1 本のみ**。
2. **`src/shared/ichikishima/control-center-readonly-ipc-channel.ts`**: main / preload で **同一 IPC チャンネル文字列**。
3. **`src/preload/index.ts`**: `exposeInMainWorld("ichikishimaControlCenter", …)`。**`ipcRenderer` を window に公開しない**。
4. **`src/preload/index.d.ts`**: `getAppSnapshot` の戻り **`Promise<ControlCenterAppSnapshot>`**。
5. **`tests/ichikishima/control-center/control-center-preload-contract.test.ts`**。
6. 関連ドキュメント同期。

禁止のまま:

- 実 Hermes・`wsl.exe`・`execFile`・実行系 preload API・Control Center の **実行系 Renderer 画面・パイプライン起動 UI**・memory DB 本番。**read-only Shell は対象外（表示のみ到達済）**。

次の自然な Goal:

- **Control Center App Shell read-only UI**（`getAppSnapshot` 表示のみ・ボタン disabled）。

この範囲では問題を検出していません。

---

## 35. Control Center — electron-vite **build smoke** Stage 1（2026-05-03）

達成内容:

1. **`package.json`** 確認: `build` = `npm run typecheck && electron-vite build`。**`electron-builder` 未使用**。`build:unpack` / `preview` / `dev` は本 Goal で **実行しなかった**。
2. **`npm run build`** 実行 — **成功**（main / preload / renderer の production bundle 出力）。
3. **関連 Vitest**: `tests/ichikishima/control-center`、`tests/ichikishima/visualization`、`tests/ichikishima/agent-team`、`tests/ichikishima/sandbox` — **実行・成功**（sandbox の dummy プロセス側は環境により skip）。
4. **対象 ESLint**: main/preload/renderer の ichikishima control-center 関連パス — **エラー 0**（CRLF の prettier warning のみ）。
5. **`pendingPackagingResolution` / packaged verified / `productionReady`** — **コード変更なし**。**build は packaged smoke と別ゲート**（`CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md` §14、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` § Build smoke）。

禁止のまま:

- Electron アプリ起動、`electron-vite preview`/`dev`、packaged アプリ短命起動、installer、`npm install`、実 Hermes / `wsl.exe` / **実機 `execFile`**。

次の自然な Goal:

- **実 packaged short launch smoke**（承認後）または **safe pending 記録**、**full Signoff**。

この範囲では問題を検出していません。

---

## 36. Control Center — packaged **short launch** smoke 設計 / runner **contract**（2026-05-03）

達成内容:

1. **`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`**: 目的、build / packaged / short launch の関係、観測・禁止・timeout・ログ・Signoff・STOP GATE、Composer2 継続確認。
2. **`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_RUNNER_CONTRACT.md`**: 将来 runner の許可境界・timeout・snapshot/renderer・ゲート・戻し方。
3. **`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`**: Short launch **記録テンプレ**（**未記入**）。
4. **`control-center-packaged-short-launch-contract.ts`**: `createControlCenterPackagedShortLaunchChecklist`、`evaluateControlCenterPackagedShortLaunchEvidence`、`summarizeControlCenterPackagedShortLaunchReadiness` — **証拠 empty は pending**、**verified は全項目 true のみ**。
5. **関連 SPEC / matrix / roadmap / handoff** 同期。**Codex handoff 文書は未作成**。

禁止のまま:

- Electron / packaged 起動、`build:unpack` / `build:win`、installer、実 Hermes / `wsl.exe` / 実機 `execFile`、`npm install`。

この範囲では問題を検出していません。

---

## 37. WSL2 Hermes Wrapper — **Parameter Registry** / Prepared Config（2026-05-03）

達成内容:

1. **`HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`**（registry 目的・pending/confirmed・argv 固定・Signoff 境界・STOP GATE）。
2. **`hermes-wsl2-wrapper-parameter-registry.ts`**: `createEmpty*` / `validate*` / `summarize*` / `createHermesWsl2WrapperPreparedInvocationPreview` — **起動なし**。
3. **`ControlCenterAppSnapshot`**: `wsl2WrapperParameterSummary` + 動的 `wsl2WrapperStatusLine`。Renderer / Shell 契約を更新。
4. **関連ドキュメント**（WSL 契約・dummy 計画・Final Gate・Runbook・テンプレ・matrix / roadmap / handoff 等）に **registry prepared / 実行未**を追記。

禁止のまま:

- `wsl.exe`、実 Hermes、`execFile` 実機、`child_process`、`npm install`。

この範囲では問題を検出していません。

---

## 38. WSL2 — **dummy wrapper prepared sample** / **human value confirmation** / allowlist 厳格化（2026-05-03）

達成内容:

1. **`HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`** — 記入対象・禁止・Go/Hold/Reject・STOP GATE。
2. **`hermes-wsl2-wrapper-parameter-registry.ts`**: **`wsl.exe` 候補は正規化後 `c:\windows\system32\wsl.exe` のみ**（Sysnative は定数のみ・**未許可**）。**`isForbiddenWrapperPathPolicy`**。任意メタ **`registryVersion` / `expectedPayloadSchemaVersion` / `logLevel`**（argv へ渡さない）。
3. **`hermes-bridge-payload-once.sh.sample`** — リポジトリ内 **sample のみ**。**WSL 配置禁止**・**`wsl.exe` での起動禁止**。
4. **契約／SPEC／Runbook／Final Gate／matrix／roadmap／handoff／NEXT_GOALS** 同期。

禁止のまま:

- `wsl.exe` / wrapper 実行、`execFile` 実機、WSL へ自動配置、`npm install`。

この範囲では問題を検出していません。

---

## 39. WSL2 — **Human Value Confirmation Packet** / validator / Control Center（2026-05-03）

達成内容:

1. **`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`** — パケット目的・記入可否・redaction・Sysnative **V1.1 文書ゲート**。
2. **`hermes-wsl2-wrapper-human-value-packet.ts`**: `validate*` / `summarize*` / `redact*` / Signoff checklist。**Sysnative は V1 明示拒否**。
3. **`ControlCenterAppSnapshot`**: `wsl2HumanValuePacketSummary` + `wsl2HumanValueStatusLine`。Shell 契約更新。
4. **関連ドキュメント**に packet / Sysnative 記載を追記。

禁止のまま:

- 値の実入力コミット、**`wsl.exe`**、実 Hermes、execFile 実機、自動 WSL 配置。

この範囲では問題を検出していません。

---

## 40. WSL2 — **Local value fill-in Runbook** / **redacted Signoff** / shape+redacted helpers（2026-05-03）

達成内容:

1. **`HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`** — example コピー、記入可否、検証・redacted summary・Signoff・Go/Hold/Reject・STOP GATE。**`wsl.exe` / execFile / 実 Hermes 禁止**。
2. **`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`** — repo 用 **redacted テンプレ**（実文字列を書かない欄設計）。
3. **`hermes-wsl2-wrapper-human-value-packet.ts`**: **`validateLocalOnlyValuePacketShape`**、**`coerceLocalOnlyJsonObjectToHumanValuePacket`**、**`summarizeRedactedLocalValuePacket`**（**`fs` 読込なし**。メモリ上オブジェクトのみ）。
4. **Vitest** `hermes-wsl2-wrapper-human-value-packet.test.ts` 追記（unknown key、example shape、**redacted lines に raw distro/user が含まれないこと**）。
5. **ドキュメント同期**: `LOCAL_VALUE_STORAGE_POLICY`、`HUMAN_VALUE_PACKET`、`VALUE_CONFIRMATION`、`CONTRACT`、`FINAL_GATE`、`CONTROLLED_PILOT_RUNBOOK`、`FINAL_READINESS_MATRIX`、`ROADMAP_STATUS`、`NEXT_GOALS`、`IMPLEMENTATION_HANDOFF`、`MORNING_REVIEW_REPORT`。**実値は repo に未入力**。

禁止のまま:

- 実値コミット、 **`wsl-wrapper-values.local.json` を自動作成**、**`wsl.exe`**、wrapper 実配置、実 Hermes、`execFile` 実機、validator **実ファイル読込**（**次 Goal**）。

この範囲では問題を検出していません。
- **WSL discovery-only fill-in (2026-05-06)**: bounded discovery-only was performed. Fixed non-ambiguous local-only fields were filled without reporting raw values. Multiple distros kept distro-dependent values ambiguous, so decision remains HOLD: present=13 / missing=0 / placeholder=3 / rejected=0. Execution boundaries remained closed.
- **WSL selected distro availability HOLD hardening (2026-05-06)**: selectedSlot=slot-02 availability failure was fixed as a redacted HOLD state across validator / Control Center / Signoff docs. Counts remain present=13 / missing=0 / placeholder=3 / rejected=0. Raw values were not reported. No WSL placement, wrapper/dummy execution, real Hermes, real `execFile`, packaged smoke, Approval execution, Memory DB, or EA/MT5 work was performed.
- **Control Center HOLD status sprint (2026-05-07)**: selectedSlot=slot-02 availability failure was surfaced in Control Center as read-only redacted status. Raw values were not reported. Execution remains disabled and decision remains HOLD.
- **Control Center legacy GET_SNAPSHOT IPC blocker fix (2026-05-07)**: B-1 was fixed by retiring the legacy `getSnapshot` IPC handler/channel and keeping the sanitized `getAppSnapshot` path. Tests assert raw `allowedApis` / `forbiddenApis` arrays are absent from IPC wire payloads.
- **Control Center legacy getSnapshot docs cleanup / tech debt tracking (2026-05-07)**: primary docs now identify `getAppSnapshot` as canonical and `getSnapshot` as retired. `CONTROL_CENTER_TECH_DEBT.md` tracks AppSnapshot `redactedSummaryLines` wire slimming as low-risk future work.
- **Control Center GET_APP_SNAPSHOT wire-safe local value validation summary slimming (2026-05-07)**: `wsl2LocalValueValidationSummary` now uses a structured wire-safe summary without `redactedSummaryLines`. Hermes validator reports retain redacted lines for Signoff/docs workflows only. `decision:HOLD`, execution forbidden, `productionReady:false`, and `pendingPackagingResolution:true` remain unchanged.
- **WSL selected slot failed / redacted reselection flow (2026-05-07)**: selectedSlot=slot-02 is recorded as availability failed with reason `distro_not_in_current_wsl_list`. Control Center and docs now point to `choose_another_slot` using slot IDs only. No raw distro/user/path/WSL list/slot map values were reported, and no WSL/Hermes/wrapper/dummy/execFile execution was performed.
- **WSL refreshed slot inventory for safe reselection (2026-05-07)**: current WSL inventory was refreshed by bounded list-only discovery. Raw distro names were written only to ignored local-only slot map storage. Redacted status is distroDiscoveryStatus=refreshed / distroCount=3 / selectableSlots=slot-01, slot-02, slot-03 / selectedSlot=none / previousSelectedSlot=slot-02 / previousFailureReason=distro_not_in_current_wsl_list / decision=HOLD / nextRequiredHumanAction=select_slot_id. No WSL `-d`, unix user discovery, wrapper/dummy, real Hermes, execFile real pilot, or WSL placement was performed.
- **WSL refreshed selected slot recorded (2026-05-07)**: selectedSlot=slot-01 was recorded in ignored local-only slot map storage. Redacted status is selectedSlot=slot-01 / previousSelectedSlot=slot-02 / previousFailureReason=distro_not_in_current_wsl_list / decision=HOLD / nextRequiredHumanAction=verify_selected_slot_availability_locally / rawValuesReported=false / execution=disabled. No raw distro/user/path/WSL list values were reported.
- **WSL slot-01 distro name mismatch HOLD (2026-05-07)**: human operator visually compared the distro name field in the local-only slot map for slot-01 against the PowerShell WSL discovery result. Values did not exactly match. Partial match and visual similarity are treated as mismatch per policy. Slot selection is now unresolved. Redacted status: selectedSlot=unresolved / previousSelectedSlot=slot-01 / previousFailureReason=distro_name_mismatch / inventoryContentConsistency=mismatched / decision=HOLD / nextRequiredHumanAction=resolve_slot_map_distro_mismatch / rawValuesReported=false / execution=disabled. No raw distro names, WSL lists, local JSON values, Windows paths, or Linux paths were reported. No WSL/Hermes/wrapper/dummy/execFile execution was performed.
- **WSL slot map distro mismatch internal inspection (2026-05-07)**: internal comparison of local-only slot map distroName fields was performed without exposing raw values. wsl-wrapper-values.local.json distroName field is still placeholder (unfilled). rawDistroEntries in wsl-distro-selection.local.json shows slot-01 with encoding-corrupted data (UTF-16 LE null bytes) and slot-02/slot-03 with null/empty entries. No slot produced an exact clean-string match against the placeholder target. Result: no exact match found. selectedSlot remains unresolved. HOLD maintained. `readHermesWsl2DistroSelectionLocalFileForRefreshSummary` updated to (a) read previousFailureReason from file with distro_name_mismatch support, (b) handle resolve_slot_map_distro_mismatch in nextRequiredHumanAction, (c) treat selectedSlot="none" as null to prevent normalizeSelectedSlot failure. No raw distro names, WSL lists, local JSON values, Windows paths, or Linux paths were reported. No WSL/Hermes/wrapper/dummy/execFile execution was performed.
- **WSL local-only slot map repair HOLD (2026-05-07)**: existing local-only ignored configuration files were normalized without raw output. Redacted status: selectedSlot=unresolved, previousSelectedSlot=slot-01, slotSelectionFailureReason=distro_name_mismatch, inventoryContentConsistency=mismatched, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=update_local_only_slot_map_or_hold. Exact-match readiness remains not_ready because clean exact-match inputs are not available yet.
- **WSL exact-match validation after target distro field update attempt (2026-05-07)**: internal read-only comparison performed after human stated local update. Findings: (a) wsl-wrapper-values.local.json distroName is still placeholder → wrapperDistroNameQuality=placeholder_or_unfilled; (b) wsl-distro-selection.local.json rawDistroEntries now shows slot-01=encoding_corrupted, slot-02=clean_nonempty, slot-03=encoding_corrupted; (c) exactMatchValidation section already pre-computed in file confirms matchedSlotCount=0 / exactMatchResult=no_match because target is still placeholder. Validation logic #3 applies: exactMatchReadiness=not_ready, exactMatchResult=no_match, matchedSlotId=none, selectedSlot=unresolved, decision=HOLD, execution=disabled, nextRequiredHumanAction=update_local_only_slot_map_or_hold. git status confirmed: both local-only files gitIgnored=true, gitTracked=false, gitStaged=false. No tracked source files changed in this task. 269 tests pass. No raw values reported. No execution performed.
- **WSL exact-match validation after local-only update (2026-05-07)**: exact raw distro name comparison was performed internally against local-only ignored inputs. No exact match was found. Redacted result: exactMatchResult=no_match, matchedSlotCount=0, selectedSlot=unresolved, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=update_local_only_slot_map_or_hold. No slot was selected and no execution was enabled.
- **WSL human-confirmed matched slot recorded (2026-05-07)**: human confirmed matchedSlotId=slot-02. Local-only selected slot state was updated using slot IDs only. Redacted result: selectedSlot=slot-02, selectedSlotStatus=matched, previousSelectedSlot=slot-01, previousSelectedSlotStatus=mismatch, exactMatchReadiness=ready, exactMatchResult=single_match, matchCount=1, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=resolve_packaging_safety_gate. No WSL/Hermes/wrapper/dummy/execFile execution was performed.
- **WSL slot-01 availability failed / inventory consistency hardening (2026-05-07)**: slot-01 is recorded as availability failed with reason `distro_not_in_current_wsl_list`. Redacted inventory consistency is matched with slotMapCount=3 / currentInventoryCount=3. NextRequiredHumanAction is `refresh_or_validate_slot_inventory_consistency`. No raw distro/user/path/WSL list/slot map values were reported.
- **WSL count-matched inventory mismatch classification (2026-05-07)**: count consistency and content consistency were split. Redacted result: inventoryCountConsistency=matched, inventoryContentConsistency=partial, slotStatuses=slot-01:mismatch / slot-02:matched / slot-03:matched. Decision remains HOLD and execution disabled. NextRequiredHumanAction is `choose_matched_slot_id`.
- **WSL inventory wording hardening (2026-05-07)**: legacy `inventoryConsistency` is no longer emitted by new split-field summaries. Redacted result remains inventoryCountConsistency=matched, inventoryContentConsistency=partial, slotStatuses=slot-01:mismatch / slot-02:matched / slot-03:matched, decision=HOLD, execution=disabled, rawValuesReported=false, nextRequiredHumanAction=`choose_matched_slot_id`.
## 2026-05-07 Packaging Safety Gate Without Execution

- Redacted status: selectedSlot=slot-02 / selectedSlotStatus=matched / exactMatchResult=single_match / matchCount=1.
- Packaging gate: packagingGateStatus=resolved_without_execution / packagingRiskLevel=low / packagingBlockers=none.
- Execution flags: canRunWsl=false / canRunHermes=false / canRunWrapper=false / canRunOnce=false / execution=disabled.
- Decision remains HOLD. productionReady=false and pendingPackagingResolution=true are maintained.
- rawValuesReported=false. Raw distro/user/path/WSL list/local JSON/stdout/stderr/argv values were not recorded.
- Next required human action: review_non_execution_readiness_before_go_policy.

## 2026-05-07 GO Policy Review — Redacted Enum Checklist (Overnight Sprint)

- **GO policy field additions**: Added `goPolicyReviewStatus`, `goPolicyRiskLevel`, `goPolicyBlockers`, `humanGoApprovalRequired`, `executionStillDisabled` to `HermesWsl2WrapperSlotInventoryRefreshSummary` interface in `hermes-wsl2-wrapper-local-value-validator.ts`.
- **Builder updated**: `buildHermesWsl2WrapperSlotInventoryRefreshSummary` params and return include all GO policy fields.
- **`buildRedactedLines` filter fixed**: `attachHermesWsl2WrapperSlotInventoryRefreshHold` line filter now passes through `go_policy_*`, `human_go_*`, and `execution_still_*` prefixed lines.
- **Shared contract extended**: `ControlCenterShellLocalValueValidationBrief.slotInventoryRefreshSummary` in `control-center-shell-ui-contract.ts` now includes all GO policy fields with strict allowlist validation in parser.
- **File reader extended**: `readHermesWsl2DistroSelectionLocalFileForRefreshSummary` reads `goPolicyReviewStatus`, `goPolicyRiskLevel`, `goPolicyBlockers`, `humanGoApprovalRequired`, `executionStillDisabled` with type-narrowing allowlists.
- **Test coverage**: Added "reads GO policy review fields as enum-only HOLD without enabling execution" in `hermes-wsl2-wrapper-local-value-file.test.ts` — 273 tests pass, both typechecks clean.
- **Raw-leak sweep**: Confirmed no raw distro names, raw paths, `redactedSummaryLines`, or execution-enabling flags in shared/renderer/preload layer.
- **IPC surface sweep**: Confirmed `GET_SNAPSHOT` (legacy) is retired. All active channels are `controlCenter.readonly.*`.
- Redacted state: packagingGateStatus=resolved_without_execution / goPolicyReviewStatus=blocked / goPolicyRiskLevel=high / goPolicyBlockers=[execution_still_disabled, human_go_review_required, production_ready_gate_not_met] / humanGoApprovalRequired=true / executionStillDisabled=true / decision=HOLD / execution=disabled / rawValuesReported=false / productionReady=false.
- Next required human action: address_packaging_blockers → then review_non_execution_readiness_before_go_policy → then human GO approval.
- No WSL/Hermes/wrapper/dummy/execFile execution was performed. No raw values were reported.

## 2026-05-08 GO Policy Non-Execution Review — ready_for_human_go_review

- **Blocker review complete (non-execution only)**:
  - `execution_still_disabled` — intentional policy property; acknowledged; cannot be cleared without human GO.
  - `human_go_review_required` — human review gate; checklist prepared in `GO_POLICY_REVIEW_REPORT.md §4`; cannot be auto-resolved.
  - `production_ready_gate_not_met` — packaged smoke not yet executed; documented as execution-dependent prerequisite; cannot be cleared without packaged short launch.
- **Type additions**: `"human_review_go_policy_prerequisites"` added to `nextRequiredHumanAction` union in validator / reader / shared contract.
- **New builder**: `buildHermesWsl2WrapperGoReadyForHumanReviewSummary` — produces HOLD summary with goPolicyReviewStatus=ready_for_human_go_review, goPolicyBlockers documented, humanGoApprovalRequired=true, executionStillDisabled=true.
- **Tests added**: "GO policy ready_for_human_go_review keeps HOLD without enabling execution" (validator) + "reads GO policy ready_for_human_go_review from file as HOLD without enabling execution" (file reader). 275 tests pass, both typechecks clean.
- **Local-only file updated** (gitignored): goPolicyReviewStatus=ready_for_human_go_review / goPolicyBlockers set / humanGoApprovalRequired=true / executionStillDisabled=true / nextRequiredHumanAction=human_review_go_policy_prerequisites.
- **Review doc created**: `GO_POLICY_REVIEW_REPORT.md` — blocker analysis, human GO checklist (§4), invariants table.
- Redacted state: goPolicyReviewStatus=ready_for_human_go_review / goPolicyRiskLevel=high / goPolicyBlockers=[execution_still_disabled, human_go_review_required, production_ready_gate_not_met] / humanGoApprovalRequired=true / executionStillDisabled=true / decision=HOLD / execution=disabled / rawValuesReported=false / productionReady=false.
- No WSL/Hermes/wrapper/dummy/execFile execution. No raw values reported. この範囲では問題を検出していません。

# Next Goals

## 1. 状態（2026-05-03 総点検反映）

- **Control Center App Management + preload + Renderer read-only Shell（2026-05-03 到達）**: `src/main/index.ts` で **read-only IPC 登録**済み。`src/preload/index.ts` が **`window.ichikishimaControlCenter.getAppSnapshot()` のみ**公開（**Ichikishima Control Center namespace 限定**。既存 `window.hermesAPI` は別 namespace）。**Renderer**: `ControlCenterAppShell.tsx` — **表示のみ・全 actions disabled・明示エラー**。チャンネル共有 `src/shared/ichikishima/control-center-readonly-ipc-channel.ts`。**実行系 preload API・実 Hermes / WSL / exec / npm install は未実施**。**path 解決**: `control-center-project-root-resolution.ts`。**packaged path smoke 設計（2026-05-05）**: `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`、`control-center-packaged-smoke-checklist.ts`。**electron-vite build smoke — Stage 1（2026-05-03）**: `npm run build` 成功。**packaged short launch smoke** — **設計・`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_*`・`control-center-packaged-short-launch-contract.ts`（2026-05-03）**。**実短命起動・`build:unpack`・Codex handoff 文書は未**。**packaged 短命起動・Electron 対話的起動ではない**段階の記述のみ。`pendingPackagingResolution:false` は **まだ不可**（証拠なし・**将来は Signoff Go のみで可**）。**Final Read-only Validation Pack（2026-05-06）**: Task A **packaged Electron smoke 未実行**、Task B **UI polish**、Task C **dummy CJS + Vitest**。dummy は **CI 既定静的のみ**・**ローカル明示プロセスは `RUN_DUMMY_HERMES_LOCAL_PROCESS`**（**2026-05-07**）。2026-05-06 / 2026-05-07 は `DATE_CONSISTENCY_NOTES.md` で **human confirmation pending**。
- **Final Preparation Pack（read-only / dry-run stubs · 2026-05-03）**: `hermes-wsl2-wrapper-config.ts`、`control-center-approval-audit-summary.ts` / `control-center-memory-summary.ts`、`visualization-v1-model.ts` + `agent-team-visualization-model.ts`、`src/main/ichikishima/agent-team/**`（scheduler **固定 OFF**）、新 IPC **`getAgentTeamSummary` / `getVisualizationModel`**（**main 本配線なし**）、`FINAL_READINESS_MATRIX.md`、`WINDOWS_APP_PACKAGING_PLAN.md`、`APP_ONLY_OPERATION_RUNBOOK.md`、`HERMES_WSL2_DUMMY_WRAPPER_PLAN.md` + `sandbox/.../dummy-hermes/*.cjs`（**CI 既定は静的テストのみ**。`spawnSync(dummy)` は **`RUN_DUMMY_HERMES_LOCAL_PROCESS` 明示時のみ** · 2026-05-07）。**Electron ウィンドウ・wsl/exec 実機・外部通信無し**。
- **Controlled Pilot 実機前準備のみ完了（オブジェクト）（2026-05-03 追記）**：`HERMES_EXECUTION_SPEC_DISCOVERY.md`、`HERMES_CONTROLLED_PILOT_RUNBOOK.md`、許可／結果テンプレ、`hermes-controlled-pilot-config`／`-preflight`／`-summary`＋Vitest。**実Hermes本体起動・実 `execFile` は未実施**。ユーザーが実行パス・`allowedExecutableId`・固定 argv・`cwd`・timeout／出力上限・`signoff*`・`operatorLabel` を揃えた **別 Goal** でのみ **実機 1 回**を検討。
- **WSL2 / wrapper ADR（2026-05-05）**：`ADR_REAL_HERMES_WSL2_CONNECTION.md`、`HERMES_WSL2_WRAPPER_CONTRACT.md`。**ネイティブ Windows exe 探索は非本命**。**`wsl.exe` は厳格 argv＋別ゲート**。config に **`adapterKind` / `wsl_wrapper`**。**パラメータ registry（検証のみ · 2026-05-03）**: `HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`、`hermes-wsl2-wrapper-parameter-registry.ts`。**人手値確認テンプレ + dummy `.sh.sample`（配置・実行禁止）· allowlist／wrapper path 厳格化（2026-05-03 追記）**: `HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`、`sandbox/hermes-autonomy-zone/dummy-hermes/hermes-bridge-payload-once.sh.sample`。**Human value packet（2026-05-03 追記）**: `HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`、`hermes-wsl2-wrapper-human-value-packet.ts`。**Local value fill-in / validator / redacted Signoff 準備**: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_USER_NEXT_ACTION_CHECKLIST.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`（**手順確認済み・local JSON 作成済み・validator pipeline prepared・Control Center safe summary 反映・raw 値 repo/docs/report 投入なし・placeholder / 未確認なら HOLD・`wsl.exe` / execFile 未**）。**local-only**: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_STORAGE_POLICY.md`。**Control Center**: `wsl2HumanValuePacketSummary` / `wsl2HumanValueStatusLine`、`wsl2WrapperParameterSummary`、`wsl2LocalValueValidationSummary`。**実 `wsl.exe`・実 Hermes 未実行**。
- **WSL dummy wrapper manual placement design（2026-05-06）**: `HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md` added. Current local validator decision is `HOLD` (present=13 / missing=0 / placeholder=6 / rejected=0). Manual placement design is prepared only; **WSL placement / wrapper execution / `wsl.exe` / real Hermes / real `execFile` are not performed**.
- **WSL local-only values fill-in completion + validator rerun（2026-05-06）**: redacted-only rerun remains `HOLD` (present=13 / missing=0 / placeholder=6 / rejected=0). Next action is user fills remaining local-only values, then reruns validator. `GO` will lead only to redacted Signoff review, not WSL execution.
- **WSL pre-execution readiness pack（2026-05-06）**: `FINAL_READINESS_MATRIX.md` now separates local values, redacted Signoff, dummy manual placement, dummy validation, pre-signoff, `wsl.exe` execution, real Hermes, and `execFile` controlled pilot. Execution rows remain **not ready** and require separate explicit Goals.
- Hermes Autonomy Zone: `READY_FOR_LOCAL_PILOT`（維持）
- Sandbox での論理フルチェーン: **`READY_FOR_LOCAL_FULL_LOOP`（単体テスト維持）**
- Control Center READ-ONLY 設計状態: **`CONTROL_CENTER_V1_DESIGN_READY`**（条件付き・UIウィンドウは未構築）
- Bridge 接続前ゲート: **`HERMES_BRIDGE_FINAL_REVIEW.md`**済・**人手クローズ用** `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`（**§11 Preflight**、**§12 Process Adapter Final Gate**）、**Pilot 次段・Preflight** `HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`（**E-16〜E-25**。E-22 は Stage 0、E-23 は Stage 1 file handoff、**E-24 は Real Pilot Minimal Pipeline（主経路は実プロセス無し）**、**E-25 は Final Gate + `execFile` 安全枠**）。**実接続前レビュー文書**: **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`**（**§22 Final Gate**）、**`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`**、**`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`**。**Process Adapter Final Gate**: **`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`**（**Controlled Pilot コードパス実装済**・**既定 disabled**。**実機バイナリ検証は手動／別承認**）。**Pipeline 統合**: **`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`**（`hermes-real-pilot-minimal.ts`。**`runRealHermesProcessAdapter`**: Controlled Pilot 政策・`signoffEvidence`・`execFile` のみ／**既定 disabled**）。**Connection Adapter / File handoff**: **`HERMES_CONNECTION_ADAPTER_CONTRACT.md`**（Stage 0 in-memory）、**`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`**（Stage 1。**marker 上書き禁止（UTC suffix＋連番）**・**inbox 手動 cleanup Runbook**・**実Hermes・listen・stdin/stdout（Stage 1 主経路）無し**）。実 Hermes **常駐接続・自動 READY** は未着手。**次のコード Goal 候補**は **Controlled Pilot 実機 1 回（手動／短命）** または **Control Center read-only IPC**.
- Ichikishima: `SHADOW_MODE_READY`
- Sandbox 監査ログ: JSONL Local Pilot（`saveAuditLog`）
- Sandbox 承認キュー Core: JSONL（`saveApprovalQueueItem`）
- 棚卸し: `ROADMAP_STATUS.md` / `IMPLEMENTATION_GAP_ANALYSIS.md`
- read-only Dashboard 向け **`getControlCenterReadonlyData`** / `CONTROL_CENTER_V1_API_CONTRACT.md`（IPC化は別 Goal）。
- **V1 UI Shell 準備**: `CONTROL_CENTER_V1_UI_SHELL_SPEC.md`、`CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`、`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`、`CONTROL_CENTER_V1_UI_SHELL_TEST_PLAN.md`、静的レイアウトのみ **`mockups/control-center-v1-readonly.html`**、**Static Read-only Shell**（`mockups/control-center-v1-static-shell.{html,css,js}` + `control-center-v1-snapshot.sample.json`。**FileReader でローカル JSON のみ**。**実ウィンドウ・127.0.0.1 HTTP・fetch 外向き・npm install は未着手**）。
- **Bridge Pilot dry-run（実本体なし）**: `HERMES_BRIDGE_PILOT_SPEC.md`、`HERMES_BRIDGE_OPERATION_MATRIX.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE.md` / `hermes-bridge-payload.ts`（ingress `payloadSchemaVersion` は **`hermes-bridge-payload/v1`**。fail-closed 検証のみ。`partialEligible` は **`interactionMode==="dry_run"` 以外では常に false**）、`hermes-bridge-receiver-queue.ts`（インメモリ受信・Lane・TTL/retry 上限）、`dependency_install`／`external_ai_escalation` の承認キュー専用ルート、`tests/ichikishima/hermes/hermes-bridge-pilot.test.ts`。**Dry-run 次段階（シナリオ A〜E）**: `hermes-bridge-pilot-dry-run.ts`、`tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts`、`READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN`（**readiness とは独立**。UI は `readinessLabel` と `scenarioSuiteLabel` を分離表示）。Readiness は **`DOC_REL`**（**9** 文書: `HERMES_BRIDGE_RECEIVER_QUEUE.md` を含む）。将来 IPC 論理は **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`**＝**`hermesBridge.registry.getReadiness` のみ**（一覧系は `HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`。**ipcMain は未実装**）。
- **Control Center Local HTTP read-only**: **V1 最小実装済み** — `local-api-server.ts`（**`127.0.0.1`・`GET /snapshot` のみ**、禁止メソッド・禁止パス、**CORS/HEAD/OPTIONS 拒否方針**）。検証 **`local-api-contract.test.ts`** + **`local-api-server.test.ts`**。**運用見解**: **Electron 本命は IPC** — `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`。Local HTTP は補助。**preload は `getAppSnapshot` のみ公開済み（2026-05-03）**。次 Goal 候補: **packaged smoke 実施（短命起動・別承認）**、**WSL dummy wrapper 手動検証**、**read-only UI polish**。（**smoke 設計ゲートは 2026-05-05 文書済**）
- **論理名前空間・オーナーシップ**: `CONTROL_CENTER_OWNERSHIP_MODEL.md`、`HERMES_BRIDGE_OWNERSHIP_MODEL.md`（コード変更なし・混線防止の固定）。
- **まだしない**: Hermes本体起動／UI本実装／外部通信／DB／npm install／EA・MT5

## 2. 次に選べる Goal 候補（並び替え済み一覧）

以下はすべて **Hermes本体完全接続より前後の安全レーン**。実装順は §3 に従う。

### Goal RP-Preflight — Hermes 実接続 Pilot 直前レビュー（Preflight・文書）

- **文書セット**: **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`**（**§22 Final Gate**）/ **`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`** / **`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`** / **`HERMES_CONNECTION_ADAPTER_CONTRACT.md`** / **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`** / **`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`**。Payload **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15**。Sign-off **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §11 / §12**、Entry **`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`（E-16〜E-25）**。
- **達成状態**: Preflight と最小スコープの **運用ゲート本文はリポジトリへ追加済み**。**Final Gate（subprocess 方針）文書追加済み**。**実 Hermes 起動なし**。最終 Go は **人手**。**実接続を自動 Go 扱いにしない**。
- **次に進める条件**: Preflight が **Go** かつ **Sign-off が承認**されたリビジョンで、かつ **Final Gate と §12 / E‑25 を満たしたうえで**のみ、**Real Hermes Process Adapter Controlled Pilot Run**（実バイナリ・短命・人手監督。**`spawn`/`exec`/shell は禁止**。`execFile` のみ。 **`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`** と整合）。従来の **Goal RP-Pilot-min — 実 Hermes 接続 Pilot 最小**は **プロセス適配ポリシーと両立する範囲**でのみ別承認。

### Goal 01 — Hermes Bridge Final Review（文書ゲート）

- **目的**: 許可 API / 禁止 API / 停止条件 / Pilot 最小方針を固定する。
- **できること**: レビュー・チェックリスト化。**コード正（registry / routeHermesOperation / readiness `DOC_REL`）との突合**は **`HERMES_BRIDGE_FINAL_REVIEW.md` §8** と Vitest で固定済み（小修正は許可）。
- **まだ禁止**: 実Hermesプロセス、`fetch`、raw fs。
- **リスク**: 文書だけだと運用乖離。**コード review で Bridge 関数と差分チェック**。
- **先にやるべき条件**: Full Loop が緑であること。
- **状態**: **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`** で人手クローズ。**Pilot 次段**は **`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`** を満たしたうえで別 Goal。

### Goal 02 — Control Center V1 UI Shell（read-only）

- **目的**: 同一モノレポ **`apps/control-center-ui/` または `src/control-center-ui/` 相当**（または **静的 HTML mock のみ**）での read-only Dashboard シェル。
- **できること**: Snapshot 準拠カードレイアウト、`127.0.0.1` read-only 配線は **別承認ゴール**。現時点では **静的 mock と契約テストで止めてよい**。
- **まだ禁止**: 危険パイプライン実行、secrets 全文、Hermes 実本体起動、**`npm install`**。
- **リスク**: Renderer に権限が漏れる。**`CONTROL_CENTER_V1_UI_SHELL_SPEC.md` / `CONTROL_CENTER_V1_LOCALHOST_SECURITY.md` / `CONTROL_CENTER_V1_IMPLEMENTATION_READINESS.md` を順守**。
- **状態（文書／レイアウト mock／Static Shell／Renderer App Shell）**: 上記 4 SPEC + **`mockups/control-center-v1-readonly.html`** + **`mockups/control-center-v1-static-shell.{html,css,js}`** + **`control-center-v1-snapshot.sample.json`**（**API 名配列は載せない**。`appShellParityPreview` で Renderer 親和）。検証 **`tests/ichikishima/control-center/control-center-static-shell.test.ts`**。**preload は `getAppSnapshot` のみ**。**Renderer `ControlCenterAppShell` は read-only のみ**。**実行ボタン・Hermes 起動等は未実装（意図的に置かない）**。
- **先にやるべき条件**: Goal 01 人手レビュー（継続）、上記 Shell SPEC の理解。

### Goal 03 — Hermes Bridge Pilot（実本体なし）

- **目的**: Hermes を起動しないまま Bridge 境界で **許可・ブロック・承認のみ** を検証する（将来の IPC expose の前段）。
- **できること**: sandbox dummy、操作リスト、`runHermesLocalPilotTask` / `routeHermesOperation`、JSONL の approval/audit。**`dependency_install`（既定キュー／policy_blocked 拒否）**と **`external_ai_escalation`（キュー専用）**。
- **まだ禁止**: Hermes が **Pilot 処理内で**任意 **HTTP bind**すること、実ランタイム常駐、外部 URL、実 shell / git / network、git push。（**Control Center `local-api-server` は別モジュール** — Pilot 本体は **`listen` しない**。）
- **リスク**: allowlist 拡大。**1 API ずつレビュー**。
- **状態（コード到達）**: `HERMES_BRIDGE_PILOT_SPEC.md` / **`HERMES_BRIDGE_OPERATION_MATRIX.md`** / **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`** / **`HERMES_BRIDGE_RECEIVER_QUEUE.md`**、`hermes-bridge-payload.ts`（ingress `hermes-bridge-payload/v1` の検証のみ）、`hermes-bridge-receiver-queue.ts`（インメモリ受信・Lane・TTL／試行上限）、`routeHermesOperation` の **`bridge_requires_approval`**、`runHermesLocalPilotTask` が **疑似操作リスト**を処理（Zone read/write + ブロック系 + キュー専用種別 + **mixed 時 `partial`**、dry-run で **Payload 検証前段**）。検証 **`tests/ichikishima/hermes/hermes-bridge-pilot.test.ts`**、**Dry-run 次段階** **`tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts`**、`tests/ichikishima/hermes/hermes-bridge-payload.test.ts`、`tests/ichikishima/hermes/hermes-bridge-receiver-queue.test.ts`。**Pilot 処理の `listen` は無い**。実 Hermes 常駐・Electron UI は未着手。**Control Center Local HTTP は別経路・任意起動のみ**。- **先にやるべき条件**: Goal 01 で **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` 承認済み**。`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md` を満たすこと。

### Goal CC-L01 — Control Center Local read-only HTTP（V1 minimal 済）

- **目的（達成済み一部）**: Static Shell／将来 UI が **`GET /snapshot`** で **`getControlCenterReadonlyData` 相当** を取れる土台。
- **できていること**: `CONTROL_CENTER_LOCAL_API_*` 4 文書、`local-api-contract.ts`、**`local-api-server.ts`**（**`127.0.0.1` のみ**、禁止メソッド・パス、**CORS なし**、**HEAD/OPTIONS は 405 本文無し**）、**`local-api-contract.test.ts`**／**`local-api-server.test.ts`**。
- **まだ禁止（次 Goal）**: **Electron preload/renderer からの無条件公開**、`0.0.0.0` bind、実行系 endpoint、外向き **`fetch`/telemetry、`npm install`、実 Hermes 接続**。
- **リスク**: **同一ホスト他プロセス**による read（Threat Model の T-LOCAL-PROC）。**外部 Web ページ**からのクロスオリジン read は **CORS を付けない**ため基本ブロック。**同一 Origin で Shell を載せる**場合のみ T-WEB を再評価。
- **状態**: **V1 HTTP minimal 実装済み**。**メインプロセスからの常時起動は未配線**。
- **次の一手**: **Static Shell → Local API 配線（レビュー付き）**、**V1.5 token／Origin allowlist**、または **IPC のみ UI**。Bridge Pilot と **論点は分離**。

### Goal 04 — Approval Queue CLI（読取・追記は人手レビュー前提）

- **目的**: JSONL の一覧・先頭N行表示（マスク済み）。
- **できること**: 件数、status 集計、パス検証。
- **まだ禁止**: 承認からの自動実行、Zone 外パス。
- **リスク**: 秘密情報のターミナル漏えい。**マスクルール共通化**。
- **先にやるべき条件**: Queue Core 済（済）。

### Goal 05 — Audit Log Viewer CLI

- **目的**: audit JSONL の read-only 表示。
- **できること**: 日付単位、tailable しない逐次表示のみ。
- **まだ禁止**: 外部転送、巨大全文ダンプ。
- **リスク**: レコードサイズ。**8KiB 上限と整合**。
- **先にやるべき条件**: Goal 03 または Queue CLI のパス衛生済み。

### Goal 06 — Speak Value Suggest Mode

- **目的**: 発話しないままスコア提示だけを検証強化。
- **できること**: テキスト評価、Hold 判定。
- **まだ禁止**: 自動发声、合成音声、通知。
- **リスク**: ユーザー錯覚。**UIで「Suggest only」明示**。
- **先にやるべき条件**: Review Mode 安定。

### Goal 07 — 実プロジェクト Read-only Review

- **目的**: 実ファイルツリーを触らずに変更レポート文字列のみ投入。
- **できること**: 手貼りレポート、`evaluateReviewMode`。
- **まだ禁止**: raw プロジェクト走査、自動 git。
- **リスク**: コピペに秘密が混入。**ペースト検知**。
- **先にやるべき条件**: Goal 01。

### Goal 08 — 可視化 V1

- **目的**: React Flow 等での状態グラフ PoC。
- **できるすること**: Dummy データ、Sandbox。
- **まだ禁止**: 実操作ピアノボタン、外部テレメトリ。
- **リスク**: 見た目先行。**V1 Dashboard の後**推奨。

### Goal 09 — EA 安全接続準備

- **目的**: EA/MT5 に触る前の READ-ONLY 境界 SPEC。
- **できること**: 文書、拒否リスト。
- **まだ禁止**: EA/MT5 コード変更、口座接続。
- **リスク**: 規制・資金。**最後尾**。

## 3. 推奨順位（現時点）

**前提（2026-05）**: Electron UI は **`controlCenter.readonly.*` IPC**。Registry メタ将来公開は **`hermesBridge.registry.getReadiness` のみ**（要約のみ）。Hermes Bridge と Local HTTP は混載しない。

推奨を **次に着手しやすい順** に並べる：

1. **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md` のレビュー** → **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §11 記入**。**§12（Process Adapter Final Gate）／Entry E‑25** を **実機 Controlled Pilot 直前まで**満たす。**Go** は **人手のみ**。（**Real Pilot Minimal Pipeline** コード実装済み。**主経路は実プロセス無し**。**`hermes-real-process-adapter.ts`** は **Controlled Pilot 政策・`signoffEvidence`・既定 disabled**。E-24/E-25 参照。**いずれも自動 Go にしない**。）
2. **Controlled Pilot 実機 1 回（手動／別承認スモーク）** — **コードパスは Controlled Pilot 済**（`controlledPilot`・`signoffEvidence`・`runRealHermesProcessAdapterWithPolicy`）。**Vitest は引き続き fake runner のみ**。**実バイナリ 1 系統**・固定 argv・短命・人手監督。**常駐・本番 READY 禁止**。
3. **Control Center IPC read-only 準備** — preload での `controlCenter.readonly.getAppSnapshot`（legacy `getSnapshot` retired; 別承認・最小バインド）。
4. **Hermes Bridge 実ランタイム接続の残り経路（最小）** — `HERMES_REAL_CONNECTION_PILOT_SCOPE.md` と **Process Adapter** の**両方**に整合。**単独明示承認**。**実機 Controlled Pilot の後または同一 Goal で整理できる範囲**。
5. **Local HTTP V1.5** — token / Origin設計のみ（実装別 Goal）。
6. **Control Center UI 接続** — Shell と IPC／補助 Local HTTP （レビュー付き）。
7. **Goal 07** — 実プロジェクト Read-only Review。
8. **Goal 08** — 可視化 V1。

補助（並行可・優先は上より下げる）：Queue CLI（Goal 04）、Audit CLI（Goal 05）、Speak Value（Goal 06）、EA 準備（Goal 09）、Local HTTP CC-L の配線強化。

従来の Goal A〜F・CC の精神は上表に吸収済み。旧ラベル参照:

- 旧 A ≈ 01+03、旧 B ≈ Review 強化（07/06）、旧 C ≈ 02、旧 D ≈ Memory（06 近傍）、旧 E ≈ 08、旧 F ≈ 09、旧 CC ≈ 02。

## 4. 次回も維持する禁止境界

- 既存EA本体。
- MT5関連。
- `.env`、APIキー、secrets。
- memory DB。
- 外部通信。
- git push。
- 本番設定。
- 実delete / 実execute / 実network / 実git操作。
- イツキシマ自動発話。
- 承認済み操作の自動実行。
- **WSL local values next step (2026-05-06 discovery-only)**: select the intended distro without sharing raw values, then rerun validator. Current redacted decision remains HOLD: present=13 / missing=0 / placeholder=3 / rejected=0. Do not proceed to WSL placement, wrapper execution, real Hermes, or real execFile.
- **WSL intended distro slot selection (2026-05-06)**: local-only ignored slot map prepared. User must choose one slotId only, for example `slot-02`, without sharing raw distro names. Current state: distroDiscoveryStatus=multiple / distroCount=3 / selectedSlot=none / decision=HOLD.
- **WSL selected slot follow-up (2026-05-06)**: slot-02 was selected and inventory comparison matched, but unix user discovery-only failed. Keep decision=HOLD with present=13 / missing=0 / placeholder=3 / rejected=0. Next goal should either investigate selected distro availability using redacted-only status, or choose another slot without sharing raw names.
- **WSL selected distro availability follow-up (2026-05-06)**: selectedSlot=slot-02 inventory comparison matched, but both `whoami` and alternate `$USER` discovery-only failed. Keep decision=HOLD. Next action is human-side selected distro availability verification without sharing raw values; do not switch slots until this is understood.
- **WSL selected distro availability HOLD hardening (2026-05-06)**: Control Center / validator / Signoff now treat selectedSlot=slot-02 availability failure as redacted HOLD. Required user response is exactly one of: `slot-02 availability: ok`, `slot-02 availability: failed`, `slot-02 availability: choose_another_slot`. Do not retry WSL discovery, infer unixUser, generate wrapperPath, or switch slots before that response.
- **Control Center HOLD status sprint (2026-05-07)**: WSL selected distro availability failure is now visible as read-only slot-only status in Control Center. Next user response remains exactly one of: `slot-02 availability: ok`, `slot-02 availability: failed`, `slot-02 availability: choose_another_slot`.
- **B-1 fixed: legacy GET_SNAPSHOT IPC retired (2026-05-07)**: raw readiness API arrays are no longer reachable through the legacy IPC channel. Next review should verify registered IPC channels, preload exposure, and wire payload raw-array guards.
- **Control Center wire-safe summary guard (2026-05-07)**: `redactedSummaryLines` has been removed from GET_APP_SNAPSHOT wire payloads. Future snapshot changes must keep `wsl2LocalValueValidationSummary` structured and wire-safe. See `CONTROL_CENTER_TECH_DEBT.md`.
- **WSL selected slot reselection (2026-05-07)**: selectedSlot=slot-02 is marked `availability=failed` with reason `distro_not_in_current_wsl_list`. Decision remains HOLD, execution disabled, raw values not reported. Next human action is `choose_another_slot` using slot IDs only, without sharing raw distro names or WSL lists.
- **WSL refreshed slot inventory (2026-05-07)**: current WSL inventory was refreshed with bounded list-only discovery. Redacted status: distroDiscoveryStatus=refreshed / distroCount=3 / selectableSlots=slot-01, slot-02, slot-03 / selectedSlot=none / previousSelectedSlot=slot-02 / previousFailureReason=distro_not_in_current_wsl_list / decision=HOLD / nextRequiredHumanAction=select_slot_id. Raw distro names remain local-only and ignored.
- **WSL refreshed selected slot (2026-05-07)**: user selected slot-01 from refreshed inventory. Redacted status is selectedSlot=slot-01 / previousSelectedSlot=slot-02 / previousFailureReason=distro_not_in_current_wsl_list / decision=HOLD / nextRequiredHumanAction=verify_selected_slot_availability_locally / rawValuesReported=false / execution=disabled. Do not run `wsl.exe -d` or discover unixUser until a separate approved availability/discovery goal.
- **WSL slot-01 availability failed (2026-05-07)**: user-side check returned slot-01 unavailable with reason `distro_not_in_current_wsl_list`. Redacted inventory consistency check is matched with slotMapCount=3 / currentInventoryCount=3. Decision remains HOLD, execution disabled, raw values not reported. Next Goal should inspect slot-map/current-inventory consistency or refresh selection policy without exposing raw names.
- **WSL count-matched inventory mismatch classification (2026-05-07)**: count consistency and content consistency are now separate. Current redacted state: inventoryCountConsistency=matched / inventoryContentConsistency=partial / slotStatuses=slot-01:mismatch, slot-02:matched, slot-03:matched / decision=HOLD / nextRequiredHumanAction=choose_matched_slot_id. Raw WSL values remain hidden.
- **WSL inventory wording hardening (2026-05-07)**: legacy `inventoryConsistency` must not be used as full-content consistency. Current redacted state remains inventoryCountConsistency=matched / inventoryContentConsistency=partial / slotStatuses=slot-01:mismatch, slot-02:matched, slot-03:matched / decision=HOLD / execution=disabled / rawValuesReported=false / nextRequiredHumanAction=choose_matched_slot_id.
- **WSL slot-01 distro name mismatch HOLD (2026-05-07)**: human operator found that the distro name field in slot-01 local-only config did not exactly match PowerShell WSL discovery. Slot selection is unresolved. nextRequiredHumanAction=resolve_slot_map_distro_mismatch. Human must correct the slot map distro name OR choose a different slot. No slot is currently selected. Decision remains HOLD. Do not infer a match from visual similarity or displayName/label/operatorLabel fields.
- **WSL slot map internal inspection (2026-05-07)**: internal comparison of distroName fields across all slots was performed. wsl-wrapper-values.local.json distroName is still placeholder. rawDistroEntries shows slot-01 has encoding-corrupted data; slot-02/slot-03 have null/empty entries. No exact match found. HOLD continues. nextRequiredHumanAction=update_local_only_slot_map_or_hold. Human must either (a) fill wsl-wrapper-values.local.json with the correct distroName and re-run the validator, or (b) confirm a different slot by exact match only (no visual similarity inference).
- **WSL local-only slot map repair HOLD (2026-05-07)**: local-only files were normalized without reporting raw values. Current redacted status: selectedSlot=unresolved, previousSelectedSlot=slot-01, slotSelectionFailureReason=distro_name_mismatch, inventoryContentConsistency=mismatched, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=update_local_only_slot_map_or_hold. Exact-match readiness is not_ready until the local-only distroName and slot map entries are clean exact-match inputs.
- **WSL exact-match validation after local-only update (2026-05-07)**: local-only files were read and compared internally without reporting raw values. Result: exactMatchResult=no_match, matchedSlotCount=0, selectedSlot=unresolved, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=update_local_only_slot_map_or_hold. No slot is selected automatically.
- **WSL exact-match validation after target distro field update attempt (2026-05-07)**: wsl-wrapper-values.local.json distroName remains placeholder_or_unfilled. wsl-distro-selection.local.json rawDistroEntries now confirms slot-02=clean_nonempty, slot-01/slot-03=encoding_corrupted. exactMatchResult=no_match (matchedSlotCount=0) because the target distroName is still placeholder. Validation logic #3 applies. HOLD continues. nextRequiredHumanAction=update_local_only_slot_map_or_hold. Human must fill wsl-wrapper-values.local.json distroName with the actual clean distro name that exactly matches slot-02's clean entry, then re-run the validator. Do not share the raw value with AI.
- **WSL human-confirmed matched slot recorded (2026-05-07)**: human confirmed matchedSlotId=slot-02. Redacted state: selectedSlot=slot-02, selectedSlotStatus=matched, previousSelectedSlot=slot-01, previousSelectedSlotStatus=mismatch, exactMatchReadiness=ready, exactMatchResult=single_match, matchCount=1, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=resolve_packaging_safety_gate. This is not GO and does not permit WSL/Hermes/wrapper execution.
- **Packaging safety gate resolved without execution (2026-05-07)**: selectedSlot=slot-02 remains matched. Redacted packaging readiness is packagingGateStatus=resolved_without_execution / packagingRiskLevel=low / packagingBlockers=none / rawValuesReported=false. decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true remain unchanged. Next human action is review_non_execution_readiness_before_go_policy. This is not GO and does not permit WSL/Hermes/wrapper execution.
- **WSL GO policy review prerequisites recorded (2026-05-07 overnight)**: GO policy fields (goPolicyReviewStatus, goPolicyRiskLevel, goPolicyBlockers, humanGoApprovalRequired, executionStillDisabled) are now tracked as redacted enum-only status in the validator, reader, and shared contract. Current redacted state: packagingGateStatus=resolved_without_execution / goPolicyReviewStatus=blocked / goPolicyRiskLevel=high / goPolicyBlockers=[execution_still_disabled, human_go_review_required, production_ready_gate_not_met] / humanGoApprovalRequired=true / executionStillDisabled=true / decision=HOLD / execution=disabled / rawValuesReported=false / productionReady=false. nextRequiredHumanAction=address_packaging_blockers. Do not proceed to WSL/Hermes/wrapper execution until packaging blockers are addressed AND a separate human GO approval is given.
- **WSL GO policy review complete — ready_for_human_go_review (2026-05-08)**: Non-execution review of all three blockers (execution_still_disabled / human_go_review_required / production_ready_gate_not_met) is complete. goPolicyReviewStatus=ready_for_human_go_review. humanGoApprovalRequired=true and executionStillDisabled=true remain. nextRequiredHumanAction=human_review_go_policy_prerequisites. Human must review GO_POLICY_REVIEW_REPORT.md §4 checklist before any execution is enabled. Do not auto-transition to GO. Do not set execution=enabled. Do not set productionReady=true without packaged smoke evidence.

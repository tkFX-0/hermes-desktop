# ROADMAP STATUS（Hermes × Ichikishima Sandbox）

更新日付: 2026-05-03 — **WSL2 local value fill-in / redacted Signoff 準備**（`HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`、`validateLocalOnlyValuePacketShape` / `summarizeRedactedLocalValuePacket`。**実値コミットなし・`wsl.exe`・execFile 未実行**。validator **実ファイル読込は別 Goal**）。**WSL2 human value packet**（`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`・validator・CC `wsl2HumanValue*`。**Sysnative V1 拒否**・**値は未記入維持**）。既記載:**WSL2 wrapper — 値確認 SPEC + dummy `.sh.sample` + registry allowlist／wrapper ポリシー厳格化**。**`wsl.exe`・実 Hermes・execFile 未実行**。既存:**WSL2 wrapper parameter registry**.**short launch smoke 設計準備済み・実機起動は未**。**Codex handoff 文書は未作成**。**electron-vite build smoke（Stage 1）実施**。2026-05-07 — **dummy Vitest を静的 CI / ローカル明示プロセスに分離**。

追記（2026-05-05 Codex check）: WSL local value fill-in 手順を確認し、`HERMES_WSL2_WRAPPER_USER_NEXT_ACTION_CHECKLIST.md` を追加。Control Center namespace は **`window.ichikishimaControlCenter.getAppSnapshot()` のみ**で、既存 `window.hermesAPI` は別 namespace。日付整合は `DATE_CONSISTENCY_NOTES.md` に記録し、2026-05-06 / 2026-05-07 は **human confirmation pending**。

追記（2026-05-05 local-only file）: `wsl-wrapper-values.local.json` は作成済み。**gitignored / untracked / unstaged**、raw 値は report / docs / Git に出していない。ユーザー実値は未提供のため推測記入せず、validator 実ファイル読込は次 Goal。**`wsl.exe`・実 Hermes・execFile 実機は未実行**。

追記（2026-05-05 validator pipeline）: local-only validator / redacted summary / Signoff pipeline prepared. Control Center snapshot exposes **decision / validationStatus / counts / policy booleans only**. Placeholder or unconfirmed values are `HOLD`; invalid policy values are `REJECT`; complete validation is `GO` for redacted Signoff review only. **raw values are not reported**. **`wsl.exe`・実 Hermes・execFile 実機は未実行**。

追記（2026-05-06 WSL dummy manual placement design）: local JSON redacted status rechecked: **decision `HOLD`**, present=13, missing=0, placeholder=6, rejected=0. `HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md` added. WSL placement not performed; wrapper not executed; `wsl.exe` / real Hermes / real `execFile` remain not executed.

追記（2026-05-06 validator rerun）: local JSON redacted-only validator rerun remains **`HOLD`**: present=13 / missing=0 / placeholder=6 / rejected=0. Raw values were not reported or stored in docs. Next Goal remains user local-only fill-in completion, then validator rerun.

追記（2026-05-06 pre-execution readiness pack）: redacted Signoff / WSL dummy manual placement / WSL dummy validation / Controlled Pilot pre-signoff / `wsl.exe` execution / real Hermes / `execFile` controlled pilot を `FINAL_READINESS_MATRIX.md` に分離。`wsl.exe` execution、real Hermes、real `execFile` は **not ready** のまま。`GO` は redacted Signoff review のみを意味し、実行許可ではない。

## READY 判定（コード・テストベース）

| ラベル | 維持状況 | 根拠 |
|--------|----------|------|
| `READY_FOR_LOCAL_FULL_LOOP` | **維持** | `tests/ichikishima/pilot/local-pilot-full-loop.test.ts` が緑（forbidden 混入で `NOT_READY` 分岐も検証） |
| `READY_FOR_CONTROL_CENTER_V1_DESIGN`（型上は `CONTROL_CENTER_V1_DESIGN_READY`） | **条件付きで維持** | FULL LOOP READY かつ同日 Approval JSONL に 1件以上があるスナップショット試験（`tests/ichikishima/control-center/`） |

**Hermes本体接続 READY** は **未達**（Preflight 文書：**`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`**／最小スコープ：**`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`**。実ランタイム接続未到達）。

## 実装済み領域（要約）

- Autonomy Zone（read/write、delete/exec/net/git ブロック、path-guard、denylist）。
- Audit / Approval Queue（JSONL 追記、正規化、監査イベント種別）。
- Review / Memory Candidate / Approval Report。
- Hermes Bridge（型・`runHermesLocalPilotTask`、`routeHermesOperation` の **`dependency_install` / `external_ai_escalation` のキュー専用ルート**、Pilot、多シナリオ dry-run、**ingress `hermes-bridge-payload/v1` 検証** `validateHermesBridgePayload`/`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`（**§15 伝搬**）、**Connection Adapter Stage 0**（`HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`hermes-connection-adapter.ts` — **`in_memory` のみ**、Receiver 前段、`hermes-bridge-readiness-summary.ts`）、**Stage 1 Sandbox File Handoff**（`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`hermes-file-handoff-adapter.ts`、`sandbox/hermes-autonomy-zone/handoff/` — **marker のみ・UTC タイムスタンプ付き・上書き禁止（連番衝突回避）**・**inbox 手動 cleanup Runbook**・**stdin/stdout 無し**）、**Real Pilot Minimal Pipeline**（**`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`**、`hermes-real-pilot-minimal.ts` / `hermes-real-pilot-summary.ts`。**`runRealHermesProcessAdapter`**：**Controlled Pilot 政策**・**`controlledPilot`**・**`signoffEvidence` 短文メタ**・**既定 `disabled`**。（`execFile` のみ・ゲート。**主経路 file handoff は実プロセス起動しない**。**実機バイナリ検証は手動／別承認**）。**実 Hermes 常駐／接続 READY ではない**）、**Process Adapter Final Gate**（**`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`** — **実機直前にも再適用**）、**インメモリ `HermesBridgeInMemoryReceiverQueue`**/`HERMES_BRIDGE_RECEIVER_QUEUE.md`/`**HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md**`、ゲート **`DOC_REL`**。**Preflight**：**`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`**。**実接続 Pilot 最小スコープ**：**`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`**（設計のみ・実ランタイム未到達）。
- Control Center **`getControlCenterReadonlyData`**／**Static Shell**／**Local HTTP V1**／**main read-only IPC 登録**／**preload `window.ichikishimaControlCenter.getAppSnapshot()` のみ**／**Renderer read-only App Shell**（`ControlCenterAppShell.tsx` — **実行系なし**）（**`local-api-server.ts`** — **`127.0.0.1`・`GET /snapshot` のみ**、**CORS/HEAD/OPTIONS 拒否**、**`local-api-server.test.ts`**）。文書 **`CONTROL_CENTER_LOCAL_API_*`**。**実行パイプライン UI・実 Hermes / WSL は未到達**。**projectRoot／zone／snapshot 源**: `CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md` + **`control-center-project-root-resolution.ts`（prepared）**。**packaged 実ビルドでの path 正しさは未検証**。**設計ゲート（smoke SPEC + Signoff + checklist 補助）2026-05-05**。 
- **設計のみ — IPC 本命／混線防止 ADR**: `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`、`CONTROL_CENTER_OWNERSHIP_MODEL.md`、`HERMES_BRIDGE_OWNERSHIP_MODEL.md`（**コード・listen の追加なし**）。
- **App Management Foundation — read-only コード到達（2026-05-03）**: 部屋スナップショット・アプリ統合 Snapshot・readonly IPC。**main 登録 + preload `getAppSnapshot` 最小公開（2026-05-03 追記）**。**実 Hermes 起動・実行系 Renderer UI・実行 API 無し**。**Electron 内 read-only App Shell（`ControlCenterAppShell` · 表示のみ）は実装済み**。`CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md`。
- **Final Preparation Pack stubs（同日）**: WSL wrapper 入力検証 `hermes-wsl2-wrapper-config`、Approval/Audit / Memory summaries、Visualization / Agent-Team メタモデル、README 済み IPC 論理増分、準備書・matrix。**実行系・Electron 製品ウィンドウは未着手**。
- `HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md`。
- Sandbox `sample/input.txt`。
- **Controlled Pilot 実機前準備のみ（2026-05-03）**：`HERMES_EXECUTION_SPEC_DISCOVERY.md`、`HERMES_CONTROLLED_PILOT_RUNBOOK.md`、許可／結果テンプレ、`hermes-controlled-pilot-*` と Vitest。**実Hermes起動および実 subprocess はしない**状態でオブジェクトのみ整備済み。**実機単発はユーザーがパス／argv／signoff をすべて提示した Goal のみ**。
- **WSL2 接続（2026-05-05）**：`ADR_REAL_HERMES_WSL2_CONNECTION.md`、`HERMES_WSL2_WRAPPER_CONTRACT.md`。**NousResearch はネイティブ Windows 非対称**。**`wsl.exe` + wrapper 厳格 argv**。`hermes-controlled-pilot-config` に `adapterKind`。

## 未実装／意図的に保留

- Hermes **実ランタイム**との IPC/API 実行経路。
- Control Center **単独製品ウィンドウ**（実行系 HUD・常駐オペレーション UI）の本格常駐化。
- メモリ DB、外部通信、自動発話、通知、実行エンジン、`npm install` 任意追加。
- SQLite 監査本番恒久化。

## 次に UI へ進めるか

- **preload 経由で `getAppSnapshot` を取得可能**（2026-05-03）。**V1 UI Shell へ進む設計ゲートはクリア（文書）**。**read-only Static Shell**（`file://`・HTTP 無し）は **達成済み**。**Renderer read-only App Shell**（同上方針）は **実装済み**。**`local-api-server` はテスト／任意起動で利用可能**。
- **short launch smoke（設計のみ · 2026-05-03）**: `CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`、`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_RUNNER_CONTRACT.md`、`control-center-packaged-short-launch-contract.ts` + Vitest。**実 packaged 起動・`build:unpack`・Electron 長寿命起動は未**。**次**: ユーザー承認または Composer2 明示 Goal で **実 short launch** または **safe pending**。

## 次に Hermes 本体接続へ進めるか

- **準備のみ一段階前進**。Bridge Pilot で **操作マトリクスと Vitest が揃い**、`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`（文書ゲート満たす場合）まで到達可能。**多シナリオ dry-run 次段**と **Payload v1 検証**（`validateHermesBridgePayload`。**実ランタイム起動無し**）まで実装済み。**Hermes が返す運用フェーズでの受信経路統合試験**は未到達。**実ランタイム起動・raw API 露出はまだしない**。

## まだ進めない主要理由（短く）

1. メインプロセス allowlist と Renderer 境界の監査が未実施。
2. 外部通信・依存・長寿命プロセスのポリシーが未ロック。
3. EA/MT5・memory DB との混入経路が理論上残るため、広い権限Hermesとは切り離す必要がある。

## 進捗率（PoC〜接続準備の体感）

| 領域 | 見積もり |
|------|----------|
| Sandbox / Bridge 契約レイヤ | 88〜92% |
| Ichikishima cognition + orchestrator | 82〜86% |
| Control Center「魂〜read-onlyモデル＋UI設計ゲート」 | 80〜86% |
| Hermes本体接続実装準備（文書＋Dry-run準備コード含む） | 52〜62% |
| 本番運用 | ≪35% |

## メモ

- 「推奨順」および Goal リストは **`NEXT_GOALS.md` §2–§3** を正とする。
- **Bridge**: 論理 IPC は **`hermesBridge.registry.getReadiness` のみ**（一覧系は明示禁止 **`HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`**）。人手クローズ **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`**（**§11 / §12**）。Pilot ／ Entry **`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`**（**E-16〜E-25**。E-24: Real Pilot Minimal Pipeline（**主経路は subprocess 不使用**）、**E-25: Process Adapter Final Gate**）。**`hermes-real-process-adapter.ts`** は **`execFile` のみのミニ実装**（既定 disabled）。**実 Hermes 制御 Pilot** は別 Goal。 **`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`** と Preflight **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md` §22** は **subprocess 安全枠・Controlled Run のゲート**。
- Goal 関数別名については **`approval-queue-blocks.ts`** に `createApprovalQueueItemFromBlocked*` あり。
追記（2026-05-06 discovery-only fill-in）: bounded WSL discovery-only was performed. Multiple distros made automatic selection ambiguous, so local values remain HOLD with present=13 / missing=0 / placeholder=3 / rejected=0. Raw values were not reported. WSL placement, wrapper execution, real Hermes, real execFile, packaged smoke, Approval execution, Memory DB, and EA/MT5 remain unperformed.

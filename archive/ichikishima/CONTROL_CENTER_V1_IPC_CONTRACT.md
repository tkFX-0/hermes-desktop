# Control Center V1 — IPC / RPC Contract

**位置づけ**: read-only Dashboard が **別プロセス**から呼ぶ論理 RPC の名前と境界。  
Electron の `ipcRenderer.invoke` であれ HTTP であれ、**名前とペイロードの意味**は本書が正。  

**運用ADR（本命）**: V1 は **IPC read-only 一本を Electron 側の本命**とする。**Local HTTP** は転送論理のみ共有し運用では補助（`ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`、`CONTROL_CENTER_OWNERSHIP_MODEL.md`）。

---

## 1. V1 の基本戦略 — **最初は集約 1 本**

```text
controlCenter.readonly.getAppSnapshot(input): ControlCenterAppSnapshot
```

実装参照: `getControlCenterReadonlyData`（`control-center-data-provider.ts`）。

ペイロードは少なくとも次を含む（フィールド名は実装型を正とする）:

- `ipcBinding` — `{ rpcLogicalName: "controlCenter.readonly.getAppSnapshot", payloadSchemaVersion: "v1" }`
- `statusCards`
- `approvalQueueSummary`
- `auditLogSummary`
- `latestReports`
- `readiness`（内包: `hermesBridgePilot` 等）
- `nextGoals`
- `riskSummary`
- `disabledActions`
- `requiresUserApproval` **literal `true`**
- `canExecuteDangerousActions` **literal `false`**

---

## 1.1 App Management Foundation — **追加の read-only チャンネル（準備モジュール）**

**状態（2026-05-03）**: `control-center-readonly-ipc.ts` が **`ipcMain`-非依存の handler 構築・登録関数** を提供。**`electron` 本体へは `src/main/index.ts` の `setupIPC` 先頭で `registerControlCenterReadonlyIpcHandlers` を呼び出し済み**。preload は **`window.ichikishimaControlCenter.getAppSnapshot()` のみ**（`src/preload/ichikishima-control-center.ts` + `src/preload/index.ts`）。

**許可一覧と戻り型の短文**は **`CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`** が正。**`getAppSnapshot` は `allowedApis` / `forbiddenApis` の識別子配列を含まない Snapshot** を返す（`control-center-app-snapshot.ts`）。

---

## 2. 将来分割候補（重くなったら）

すべて `controlCenter.readonly.*` を維持する。

```text
controlCenter.readonly.getStatusCards()
controlCenter.readonly.getApprovalQueueSummary()
controlCenter.readonly.getAuditLogSummary()
controlCenter.readonly.getLatestReports()
controlCenter.readonly.getReadiness()
controlCenter.readonly.getNextGoals()
hermesBridge.readonly.getPilotReadiness()
```

**禁止**: 分割を口実に **実行 RPC を同じチャネルに混ぜる**こと。

---

## 3. 名前空間規約

| プレフィックス | 意味 |
|----------------|------|
| `controlCenter.readonly.*` | 管制盤 read-only |
| `approvalQueue.readonly.*` | （将来）キュー読取特化ならここへ |
| `auditLog.readonly.*` | （将来）監査集計のみ |
| `hermesBridge.readonly.*` | Bridge / Pilot メタのみ。実行は別ライフサイクル |
| `hermesBridge.pilot.*` | （論理）Pilot 入力／結果 — **Hermes と Local API と混載しない**（`HERMES_BRIDGE_OWNERSHIP_MODEL.md`） |
| `hermesBridge.registry.*` | （論理）許可／禁止 API 一覧の参照 — **読取メタのみ**（`HERMES_BRIDGE_API_REGISTRY.md`） |

---

## 4. **禁止名前空間**（V1 では作らない・早期に増やさない）

```text
shell.*
rawShell.*
rawFs.*
rawGit.*
rawNetwork.*
mt5.*
memoryDb.write.*
approval.execute.*
controlCenter.execute.*
localApi.hermesRun.*
snapshot.execute.*
hermesBridge.execute.*
pipeline.execute.*
hermesBridge.raw.*
hermesBridge.pilot.run
hermesBridge.pilot.execute
hermesBridge.operation.route
```

実行系が必要になったフェーズでも、**別承認・別チャネル・別レビュー**とする。

---

## 5. 禁止 RPC（例示）

以下は IPC に載せた時点で設計破綻とみなす。

```text
runCommand(...)
writeAnyFile(...)
deleteFile(...)
fetchUrl(...)
gitPush(...)
readEnv(...)
connectMT5(...)
updateMemoryDb(...)
executeApprovedAction()
runHermesRaw()
exposeRawFs()
exposeShell()
```

---

## 6. メインサービス側の責務

- **allowlist でラップ**：Renderer / Browser に渡すのは **上記 read-only 契約のみ**。
- **Node 権限を renderer に渡さない**（Electron の場合は preload のみ露出）。

---

## 7. 実装コードとの対応

| 論理 RPC | 実装参照 |
|----------|----------|
| `controlCenter.readonly.getAppSnapshot` | `buildControlCenterAppSnapshot` |
| `controlCenter.readonly.getSnapshot` | **RETIRED / do not register** |
| `controlCenter.readonly.getRooms` | `buildControlCenterRoomsSnapshot` |
| `controlCenter.readonly.getHermesStatus` | `extractHermesStatusPayload` |
| `controlCenter.readonly.getApprovalSummary` | `getControlCenterReadonlyData` の `approvalQueueSummary` |
| `controlCenter.readonly.getAuditSummary` | `getControlCenterReadonlyData` の `auditLogSummary` |
| `controlCenter.readonly.getControlledPilotSummary` | `buildHermesControlledPilotDashboardSummary` |
| `controlCenter.readonly.getAgentTeamSummary` | `buildAgentTeamFoundationReadonlySummary` |
| `controlCenter.readonly.getVisualizationModel` | `buildVisualizationV1ReadonlyModel` |
| `hermesBridge.readonly.getPilotReadiness` | `getHermesBridgePilotReadiness` |

補助関数（分割前の内部利用可）: `getApprovalQueueSummary`, `getAuditLogSummary`, `getLatestReportRefs`, `getReadinessSummary`, `getNextGoalSummary` — 論理表記では `getNextGoalSummary`（実装と同一スペル）。

---

## 8. HTTP `127.0.0.1` 転送との対応（Local API）

- **論理結果は単一**：canonical IPC は `controlCenter.readonly.getAppSnapshot`。Historical `controlCenter.readonly.getSnapshot` は **retired / do not register**。
- メソッド／禁止パスは **`CONTROL_CENTER_LOCAL_API_CONTRACT.md`** および **`local-api-contract.ts`** が正。
- **運用**：Electron 本命は IPC。**Local HTTP は補助** であり **明示起動・常駐しない** default を採る（`ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`）。

---

## 9. Hermes Bridge — 将来 preload に載せうる論理 IPC（**read メタのみ**）

**状態**: **`ipcMain.handle` は未実装**。機械的正はコード定数 **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`**（要素は **`hermesBridge.registry.getReadiness` のみ**）。

### 9.1 V1 の許可候補（実行権限ではない）

```text
hermesBridge.registry.getReadiness
```

**返してよい（要約のみ）**:

- readiness label（`READY_FOR_*` / `NOT_READY`）
- **allowedApis / forbiddenApis の件数のみ**（`length`。**識別子の完全一覧は返さない**）
- required human reviews（短文の配列）
- readiness requirements（`HERMES_BRIDGE_READINESS_REQUIREMENTS` 相当）
- blockers（欠落ゲートなど）
- **warning summary**（短文のみ。詳細運用説明には使わない）

**返してはいけない**:

- **`HERMES_BRIDGE_ALLOWED_APIS` / `HERMES_BRIDGE_FORBIDDEN_APIS` の完全列挙**（一覧は開発者・`HERMES_BRIDGE_API_REGISTRY.md` / コードで確認）
- routing API 名の完全リスト・実装関数名・内部ファイルパス  
- **`process` / runtime handle**、実コマンド行・実 URL、secrets、`.env`、`stack trace` 原文  

**運用短文**（次 Goal、ユーザー向け注意）は canonical **`controlCenter.readonly.getAppSnapshot`** に寄せる（`nextGoals`、`riskSummary` 等）。Legacy `getSnapshot` には寄せない。

### 9.2 当面 IPC に載せない（明示禁止リスト `HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`）

```text
hermesBridge.registry.getAllowedApis   … 一覧誤解防止のため当面禁止
hermesBridge.registry.getForbiddenApis … 同上
hermesBridge.pilot.getReadiness        … pilot メタ分割は当面不要（registry に集約）

hermesBridge.pilot.run
hermesBridge.pilot.execute
hermesBridge.operation.route
```

一覧はコード定数 **`HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`** と `§4` を正とする。

---

## 関連

- `CONTROL_CENTER_V1_API_CONTRACT.md`
- `CONTROL_CENTER_V1_SECURITY_MODEL.md`
- `HERMES_BRIDGE_API_REGISTRY.md`
- `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md`（詳細 STRIDE 型の補強）
- `CONTROL_CENTER_LOCAL_API_CONTRACT.md`
- `CONTROL_CENTER_LOCAL_API_IMPLEMENTATION_GATE.md`
- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`
- `CONTROL_CENTER_OWNERSHIP_MODEL.md`
- `HERMES_BRIDGE_OWNERSHIP_MODEL.md`
- `CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`
- `CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md`
## 2026-05-07 B-1 Cleanup Addendum

- Canonical IPC: `controlCenter.readonly.getAppSnapshot(input): ControlCenterAppSnapshot`.
- Retired IPC: `controlCenter.readonly.getSnapshot`.
- The retired legacy IPC must not be re-registered because it previously bypassed the AppSnapshot sanitizer.
- Raw `allowedApis` / `forbiddenApis` arrays must not appear on IPC wire payloads.
- Historical mentions of `getSnapshot` in this document are retained as legacy context only and are superseded by this addendum.

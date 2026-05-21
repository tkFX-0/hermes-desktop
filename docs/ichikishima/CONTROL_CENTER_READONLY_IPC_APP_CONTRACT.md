# Control Center — Read-only IPC（アプリ運用向け）契約

**目的**: 将来 **preload 経由**で Renderer が呼ぶ論理チャンネルの **read-only 集合**を固定する。**実装の正**は `src/main/ichikishima/control-center/control-center-readonly-ipc.ts` の定数・`assertReadOnlyChannelName`。

**状態（2026-05-03）**: **`registerControlCenterReadonlyIpcHandlers` は `src/main/index.ts` の `setupIPC()` 先頭で登録済み**。preload は **`window.ichikishimaControlCenter.getAppSnapshot()` のみ**公開（`CONTROL_CENTER_PRELOAD_RENDERER_CONTRACT.md`）。**Renderer は read-only App Shell が `getAppSnapshot` のみ使用**。

**Namespace clarification（2026-05-05）**: この契約の `getAppSnapshot` only は **Ichikishima Control Center namespace（`window.ichikishimaControlCenter`）限定**。既存の app-wide `window.hermesAPI` は別 namespace であり、本 Control Center read-only API には含めない。

---

## 1. 許可チャンネル（一覧）

| 論理チャンネル | 戻り（要約） |
|----------------|--------------|
| `controlCenter.readonly.getSnapshot` | **RETIRED / do not register**. This legacy channel previously returned unsanitized readonly data and must not appear in `ALL_CHANNELS`, handler maps, preload, renderer, or mock wire payloads. |
| `controlCenter.readonly.getAppSnapshot` | `ControlCenterAppSnapshot`。**識別子配列・stdio・secrets なし** |
| `controlCenter.readonly.getRooms` | `ControlCenterRoomsSnapshot`。**actions はすべて disabled** |
| `controlCenter.readonly.getHermesStatus` | `bridgeReadiness`（件数のみ）+ **短文** notes |
| `controlCenter.readonly.getApprovalSummary` | `approvalQueueSummary` のみ（実装準拠） |
| `controlCenter.readonly.getAuditSummary` | `auditLogSummary` のみ |
| `controlCenter.readonly.getControlledPilotSummary` | `HermesControlledPilotDashboardSummary`（**実行しない**メタのみ。`preparedSafetyOutline` 含む） |
| `controlCenter.readonly.getAgentTeamSummary` | `AgentTeamFoundationReadonlySummary`（**dry-run／scheduler OFF**） |
| `controlCenter.readonly.getVisualizationModel` | `VisualizationV1ReadonlyModel`（**メタのみ**・座標・stdio 無し） |

---

## 2. 禁止チャンネル（例・追加禁止）

```text
controlCenter.execute.*
approval.execute.*
hermes.run.*
hermes.execute.*
hermesBridge.raw.*
rawFs.*
rawShell.*
rawNetwork.*
rawGit.*
wsl.run.*
process.run.*
```

チャンネル名に **`execute`**、**.run.**、`rawFs` 等の **禁止パターン**が含まれる場合、`registerControlCenterReadonlyIpcHandlers` は **実行前に throw**する。

---

## 3. preload 境界（V1 最小）

- **`preload` は `invoke("controlCenter.readonly.getAppSnapshot")` のみ**を Ichikishima 名前空間に公開する（**任意チャンネル invoke を渡さない**）。実装: `src/preload/ichikishima-control-center.ts`。チャンネル文字列は **`src/shared/ichikishima/control-center-readonly-ipc-channel.ts` と main の `GET_APP_SNAPSHOT` で一致**必須。
- **raw `fs`、`child_process`、生 `ipcRenderer` オブジェクトは Renderer に渡さない**。
- **Renderer は `window.hermesAPI` を fallback action / data source として呼ばない**。

---

## 4. Local HTTPとの差

- **`GET /snapshot`** は単一オブジェクトのみ（Local API SPEC）。App Snapshot は **IPC 論理**で追加。混線しない（ADR 参照）。

---

## 関連

- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`
- `CONTROL_CENTER_PRELOAD_RENDERER_CONTRACT.md`
## 2026-05-07 B-1 Cleanup Addendum

- Canonical Control Center IPC path: `controlCenter.readonly.getAppSnapshot`.
- Canonical preload API: `window.ichikishimaControlCenter.getAppSnapshot()`.
- Retired legacy path: `controlCenter.readonly.getSnapshot`.
- The retired legacy path must not be registered in `ALL_CHANNELS`, handler maps, preload, renderer, mock wire payloads, or future IPC contracts.
- Wire payloads must not expose raw `allowedApis` / `forbiddenApis` arrays.
- `redactedSummaryLines` is not part of GET_APP_SNAPSHOT wire payloads. Hermes validator reports may keep it for Signoff/docs workflows, but `ControlCenterAppSnapshot.wsl2LocalValueValidationSummary` uses structured wire-safe fields only.

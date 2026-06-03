# Control Center V1 API Contract — Read-only

**位置づけ**: Ichikishima Control Center の **別アプリ（または別プロセス）** が読み取る RPC / 論理関数の契約。**UI ウィンドウの実装は含まない**。

**適用対象**: `getControlCenterReadonlyData()` およびここで列挙する read-only 呼び出しのみ。

---

## 1. V1 の目的

- **Read-only Dashboard** — 状態・件数・参照パスの確認のみ。
- **稼働状態の確認** — READY / HOLD / NEEDS_APPROVAL を可視化。
- **Approval Queue の概要** — 状態別 **件数** のみ。
- **Audit Log の概要** — イベント種別 **件数** のみ。
- **最新ドキュメントの参照** — リポジトリ相対パスと、必要なら `reportId` 等メタのみ。
- **次 Goal の確認** — `NEXT_GOALS.md` へのパスと、冒頭ヘッドライン程度（本文は転載しない）。

---

## 2. V1 で **やる** こと（データ取得のみ）

| 機能 | 契約関数（論理名） |
|------|-------------------|
| 統合スナップショット | `getControlCenterReadonlyData(...)` |
| ステータスカード | `getControlCenterStatus(...)` と同等の `statusCards[]` に内包 |
| Queue 概要 | `getApprovalQueueSummary(...)` |
| Audit 概要 | `getAuditLogSummary(...)` |
| レポート参照 | `getLatestReportRefs(...)` |
| READY 総合 | `getReadinessSummary(...)` |
| Bridge Pilot 準備指標 | `getHermesBridgePilotReadiness(...)` |
| 次 Goal のヒント | `getNextGoalSummary(...)`（実装スペルに合わせる） |

実装コードの参照入口:  
`src/main/ichikishima/control-center/control-center-data-provider.ts`

---

## 3. V1 で **やらない** こと

- 危険操作の **実行**（delete / execute / network / git / shell）。
- 「承認済み」の **自動実行**。
- Hermes **実本体の起動**・常駐化。
- 自動発話・通知・本番反映。
- memory DB / SQLite の読み書き。
- EA / MT5 接続。
- secrets（`.env` / APIキー全文等）を RPC 応答へ含める。

---

## 4. Renderer / RPC 側に公開してよい候補

以下は **`Ichikishima Main Service`（または hermes-desktop main）側で実装された read-only メソッド**として公開してよい例である。  
**renderer に Node / fs / shell を渡さない**前提である。

```text
getControlCenterReadonlyData(input): ControlCenterReadonlyData
getControlCenterReadonlySnapshot(...)  （上記エイリアス可）
getApprovalQueueSummary(...)
getAuditLogSummary(...)
getLatestReportRefs(...)
getReadinessSummary(...)
getHermesBridgePilotReadiness(...)
getNextGoalSummary(...)
```

論理 IPC 名（別プロセス／preload 契約）: `controlCenter.readonly.getAppSnapshot` — 詳細は `CONTROL_CENTER_V1_IPC_CONTRACT.md`。ペイロード先頭付近に `ipcBinding` を含め型照合する。Legacy `getSnapshot` is retired.

---

## 5. Renderer / RPC に **出してはいけない** 候補

以下が RPC に載った時点で安全設計として **破綻**する。

```text
runCommand(...)
writeAnyFile(...)
deleteFile(...)
fetchUrl(...)
gitPush(...)
readEnv(...)
connectMT5(...)
updateMemoryDb(...)
rawFs(...)
rawChildProcess(...)
```

---

## 6. `ControlCenterReadonlyData` 不変条件

| 項目 | 値 |
|------|-----|
| `ipcBinding.rpcLogicalName` | **`"controlCenter.readonly.getAppSnapshot"`** |
| `ipcBinding.payloadSchemaVersion` | **`"v1"`** |
| `requiresUserApproval` | **literal `true`** |
| `canExecuteDangerousActions` | **literal `false`** |
| **本文**（Approval / Audit の完全 JSONL 行、その他コンテンツ） | **含めない** |
| secrets | **含めない** |

詳細フィールドは `control-center-data-provider.ts` の型を正とする。

---

## 7. 関連文書

- `CONTROL_CENTER_SPEC.md` §12
- `HERMES_BRIDGE_FINAL_REVIEW.md`
- `HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md`
- `CONTROL_CENTER_V1_UI_SPEC.md` / `CONTROL_CENTER_V1_SECURITY_MODEL.md` / `CONTROL_CENTER_V1_IPC_CONTRACT.md` / `CONTROL_CENTER_V1_SCREEN_SPEC.md` / `CONTROL_CENTER_V1_IMPLEMENTATION_READINESS.md`
## 2026-05-07 B-1 Cleanup Addendum

- Canonical renderer/preload IPC: `controlCenter.readonly.getAppSnapshot`.
- Canonical payload: sanitized `ControlCenterAppSnapshot`.
- Retired legacy IPC: `controlCenter.readonly.getSnapshot`.
- The retired legacy IPC must not be exposed as a wire payload.
- Raw `allowedApis` / `forbiddenApis` arrays must remain internal and must not be present in UI/API wire payloads.

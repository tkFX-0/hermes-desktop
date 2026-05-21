# Control Center V1 — UI Data Contract（getAppSnapshot）

**論理 RPC**: `controlCenter.readonly.getAppSnapshot`  
**Retired**: `controlCenter.readonly.getSnapshot` must not be registered or exposed.
**実装関数**: `getControlCenterReadonlyData(...)`  
**コード正**: `src/main/ichikishima/control-center/control-center-data-provider.ts`

**Electron Renderer Shell（並行）**: `controlCenter.readonly.getAppSnapshot` と `ControlCenterAppSnapshot`。**UI 入力の正**: `CONTROL_CENTER_APP_SHELL_UI_SPEC.md` · `parseControlCenterShellSnapshot`（`control-center-shell-ui-contract.ts`）。**識別子配列・本文・secrets は表示しない**。

**`getAppSnapshot` の path 要約（2026-05-05）**: `snapshotSourceLabel` · `pathResolutionRuntimeMode` · `pathResolutionStatus` · `pendingPackagingResolution` · `pathResolutionSafeSummaryLines`（**短文のみ**）。**`projectRoot` / `userData` / `resourcesPath` の絶対パスは Renderer に載せない**。**`pendingPackagingResolution:false` は `CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` Go 後の運用のみ**（設計: `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`）。詳細は `CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md`。

## 1. トップレベルオブジェクト

UI は次のオブジェクトのみをバインドする想定。**追加フィールドが来ても unknown はログに落とさず破棄**（将来の拡張方針。V1 は厳密表示でよい）。

| フィールド | 型（論理） | UI の扱い |
|-------------|------------|-----------|
| `ipcBinding` | `{ rpcLogicalName: "controlCenter.readonly.getAppSnapshot", payloadSchemaVersion: "v1" }` | フッター／デバッグ行に短文表示 |
| `statusCards` | `ControlCenterReadinessCard[]` | バッジグリッド |
| `approvalQueueSummary` | 集計 object または `{ unavailable:true, reason }` | **件数のみ**。本文なし |
| `auditLogSummary` | 集計 object または `{ unavailable:true, reason }` | **件数・時刻のみ** |
| `latestReports` | `docRelativePaths` + `latestApprovalReportId` | **相対パスと ID のみ**（ファイルを自動オープンしない） |
| `readiness` | `ControlCenterReadinessBundle` | カード単位で分解 |
| `nextGoals` | `{ ordinal, title }[]` | リスト見出しのみ |
| `riskSummary` | `string[]` | 短文。長文はトリム表示推奨 |
| `disabledActions` | string[] **固定セット**（`CONTROL_CENTER_V1_DISABLED_ACTION_IDS` と一致） | パイプラインの「鎖アイコン」説明に使うのみ |
| `requiresUserApproval` | **literal `true`** | 表示「要ユーザー門」 |
| `canExecuteDangerousActions` | **literal `false`** | 「実行ロック」表示 |

オプション（**Static Shell デモのみ**。`validateSnapshot` は **必須キーだけ検証**。未知キー無視ポリシーは §1 と同じ）:

| フィールド | 型（論理） | UI の扱い |
|-------------|------------|-----------|
| `appFoundationPreview` | `{ productionReady, realHermesProcessStatus, controlledPilotStation, … }` | 「App Management Foundation」パネルに **短文ラベルのみ**。secrets・stdio・識別子配列を **絶対に載せない** |
| `appShellParityPreview`（**Static Shell デモのみ**） | `{ agentTeamSummary, visualizationModel, memorySummary }` 等 | Renderer `ControlCenterAppShell` の **対応セクションに近い短文**。**本番 `getAppSnapshot` JSON の必須キーではない** |

---

## 2. 不変条件（UI が検証してよいこと）

```text
requiresUserApproval === true
canExecuteDangerousActions === false
ipcBinding.rpcLogicalName === "controlCenter.readonly.getAppSnapshot"
ipcBinding.payloadSchemaVersion === "v1"
disabledActions の各要素 ⊆ CONTROL_CENTER_V1_DISABLED_ACTION_IDS（順序まで一致を推奨）
```

いずれか失敗時: **データを不信として表示中断**し「契約不一致」とだけ出す（secrets は出さない）。

---

## 3. approvalQueueSummary（許可されているキー）

| キー | 表示 |
|------|------|
| `total` | はい |
| `pending`, `held`, `approved`, `rejected`, `highRisk` | はい |
| `latestUpdatedAt` | はい |
| `parseWarnings` | **件数または短縮**。本文を増幅しない |

**禁止**: queue 項目の `title` / `reason` / `commands` / `externalUrls` 等の転載。

`unavailable` のときは reason を **1 行**まで。

---

## 4. auditLogSummary（許可されているキー）

| キー | 表示 |
|------|------|
| `total`, `readEvents`, `writeEvents`, `blockedEvents`, `approvalEvents`, `reviewEvents`, `highRiskEvents` | はい |
| `latestTimestamp` | はい |
| `parseFailures` | 警告バッジ（>0） |

**禁止**: audit JSONL の生行、`reason` 全文、`normalizedPath` 生。

---

## 5. readiness.hermesBridgePilot

- `ready` / `label` / `blockers.length` は表示してよい。
- `allowedApis` / `forbiddenApis`: **長すぎる場合は「N 件」折りたたみ**。スクロールで全文ダンプしない（DoS と誤コピペ防止）。
- `requiredHumanReviews`: 見出し列挙のみ（本文増幅しない）。

---

## 6. 表示してはいけない値

- `.env`、API キー、トークン、パスワード、生メール、その他 PI。
- Approval / Audit の **本文・全文ログ**。
- 任意 URL（外部テレメトリに見える文字列）は **マスクまたは非表示**（read-only snapshot に含まれない設計が前提）。
- Zone **絶対パス**は可能なら相対のみ（現行 Provider は相対ヒント優先）。

---

## 7. Secrets マスク方針（UI 側）

- 「マスク」の実装ルール本体は Ichikishima Backend の責務。UI は **受け取った文字列を信頼せず、そのまま巨大ペースト欄にしない**。
- スナップショット JSON を DevTools でコピーする運用でも、**コンソールに secrets を流さない**よう UI 開発者へ周知。

---

## 関連

- `CONTROL_CENTER_V1_SCREEN_SPEC.md`
- `CONTROL_CENTER_V1_UI_SHELL_SPEC.md`
- `CONTROL_CENTER_STATIC_SHELL_JSON_GUIDELINES.md`
- `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md`（将来 **`GET /snapshot`** の脅威整理）
- `CONTROL_CENTER_LOCAL_API_CONTRACT.md`
- `CONTROL_CENTER_LOCAL_API_TEST_PLAN.md`

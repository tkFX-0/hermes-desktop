# Control Center V1 — Screen Spec（Read-only）

**位置づけ**: V1 Dashboard の **情報カード構成** と **無効ボタン一覧**。  
**実装しない**: 本リポでは **ウィンドウを作らない**（別 Repo / Shell Goal まで保留）。

データの正は `getControlCenterReadonlyData` / `CONTROL_CENTER_READONLY_IPC_BINDING`。

---

## 1. Header

| 要素 | 内容 |
|------|------|
| タイトル | **Ichikishima Control Center** |
| current mode | 例: `READ_ONLY_SHADOW`（文字列のみ。秘密は出さない） |
| readiness labels | `READY_FOR_LOCAL_FULL_LOOP` / `CONTROL_CENTER_V1_DESIGN_READY` / `BLOCKED` 等の **バッジ表示**（`statusCards` 由来） |

---

## 2. Status Cards

`statusCards` をそのまま可視化。主なラベル例:

- `READY_FOR_LOCAL_FULL_LOOP`
- `CONTROL_CENTER_V1_DESIGN_READY`（型上・文書上は DESIGN）
- `SHADOW_MODE_READY`
- `REVIEW_MODE_READY`
- `APPROVAL_QUEUE_READY`
- `AUDIT_LOG_READY`
- `HERMES_BRIDGE_READY`
- `NEEDS_USER_APPROVAL` / `HOLD` / `BLOCKED`（あれば目立たせる）

---

## 3. Hermes Room Card

| 要素 | データソース |
|------|----------------|
| Local Pilot 状態 | `readiness.localFullLoopReady` + `statusCards` / `riskSummary` 短文 |
| Bridge Pilot readiness | `readiness.hermesBridgePilot`（`ready` / `label` / `blockers` 件数） |
| latest task summary | **短文のみ**（将来: pilot の要約 ID。本文は渡さない） |
| blocked operations count | `buildControlCenterReadonlyStatus` 由来の近似（`blockedOperationApproxCount` を将来 snapshot に載せる場合は別フィールド化。現状は `riskSummary` や cards で代替可） |

---

## 4. Ichikishima Room Card

| 要素 | データソース |
|------|----------------|
| Shadow Mode | `SHADOW_MODE_READY` バッジ |
| Review Mode | `REVIEW_MODE_READY` |
| shouldSpeak | **常に false 運用**の表示（Orchestrator 方針。数値秘密は出さない） |
| Memory Candidate summary | V1 は **項目が無ければ「未接続」**と表示（将来拡張） |

---

## 5. Approval Room Card

`approvalQueueSummary`（集計のみ）:

- `pending`, `held`, `rejected`, `approved`
- 「approved but not executed」— V1 は **自動実行しない**ので `approved > 0` を **「実行パイプライン未接続」**注記で表示してよい
- `highRisk`
- `latestUpdatedAt`

**禁止**: queue 項目の本文・commands 配列・URL リストの生表示。

---

## 6. Audit Room Card

`auditLogSummary`:

- `total`, `readEvents`, `writeEvents`, `blockedEvents`, `approvalEvents`, `reviewEvents`
- `highRiskEvents`
- `latestTimestamp`
- `parseFailures` が >0 なら **警告バッジ**（ログ破損の可能性）

---

## 7. Reports Card

`latestReports.docRelativePaths` の **相対パス表示**のみ:

- Morning Review → `MORNING_REVIEW_REPORT.md` への参照
- Goal Completion
- Bridge Final Review
- Next Goals
- `latestApprovalReportId` があれば **ID のみ**（本文なし）

---

## 8. Next Goals Card

`nextGoals`（`NEXT_GOALS.md` の見出し抽出）:

- 先頭数件を **推奨 next** として表示
- `riskSummary` に **短文**があれば併記
- prerequisite は将来 `NEXT_GOALS` 拡張まで **手運用メモ**でも可

---

## 9. Disabled Pipeline Buttons（V1 はすべて disabled）

プレースホルダのみ（クリック不可）:

- Run Local Pilot
- Run Hermes Bridge Pilot
- Review Latest Report
- Generate Approval Report
- Create Memory Candidates
- Stop All

**ラベル付きツールチップ**: 「後続 Goal。V1 は no-op／未接続」。

---

## 10. IPC 論理名表示（任意）

フッターに次要表示してよい:

```text
Binding: controlCenter.readonly.getAppSnapshot / schema v1
```

---

## 関連

- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
- `CONTROL_CENTER_V1_SECURITY_MODEL.md`

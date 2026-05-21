# Control Center V1 UI Shell — テスト計画

**範囲**: read-only Snapshot の契約検証および将来 UI レイヤーの受け入れ基準。**E2E / Electron 起動 / ブラウザ自動操作は含まない。**

---

## 1. Provider / データ契約（Vitest）

| ID | 観点 | 検証 |
|----|------|------|
| C-01 | `ipcBinding` | `rpcLogicalName` / `payloadSchemaVersion` が定数どおり |
| C-02 | `requiresUserApproval` / `canExecuteDangerousActions` | `true` / `false` 固定 |
| C-03 | `disabledActions` | `CONTROL_CENTER_V1_DISABLED_ACTION_IDS` と完全一致 |
| C-04 | Snapshot 全文 | 代表的な forbidden 語（例: API キー風）は含まない／またはテスト入力でないことを確認 |
| C-05 | Shape | `statusCards`, `approvalQueueSummary`, `auditLogSummary`, `latestReports`, `readiness`, `nextGoals`, `riskSummary` が存在 |

実装済み試験: `tests/ichikishima/control-center/control-center-data-provider.test.ts`、契約固定試験: `control-center-readonly-snapshot-contract.test.ts`。

## 2. Static Read-only Shell（Vitest）

| ID | 観点 | 検証 |
|----|------|------|
| S-01 | `control-center-v1-snapshot.sample.json` | `ipcBinding` / `disabledActions` が provider 定数と同一 |
| S-02 | `control-center-v1-static-shell.{html,css,js}` | 外部 `https?://` を含まない、`fetch(` を使わない（文字列 grep） |
| S-03 | Pipeline ボタン | `class="pipeline"` に `disabled` |
| S-04 | 解析ボタン | `cc-parse-paste-btn` が `pipeline` クラスではない |

実装: `tests/ichikishima/control-center/control-center-static-shell.test.ts`

## 3. レイアウトのみ静的 mock（人手）

| ID | 観点 |
|----|------|
| M-01 | パイプライン系 `<button>` に `disabled` |
| M-02 | 外部 CDN `<script>` / `<link href=CDN>` が無い |
| M-03 | `<script>` による実行が無い（`control-center-v1-readonly.html`） |

対象: `docs/ichikishima/mockups/control-center-v1-readonly.html`

## 4. 将来 UI Shell（アプリ化後）

| ID | 観点 |
|----|------|
| U-01 | 「危険」ボタンに `onClick` で IPC／fetch を結線していない |
| U-02 | Snapshot の契約検証に失敗したら画面をロック |
| U-03 | localhost サーバがある場合、`0.0.0.0` bind でないことを起動ログまたは設定で確認 |

## 5. 実行しない（本 Goal）

- Electron 自動起動テスト。
- Playwright / Cypress。
- 実ネットワーク越しの統合テスト。
- npm install に依存する新 UI ビルド。

---

## 関連

- `CONTROL_CENTER_V1_UI_SHELL_SPEC.md`
- `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`
- `CONTROL_CENTER_STATIC_SHELL_JSON_GUIDELINES.md`

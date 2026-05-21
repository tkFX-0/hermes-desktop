# Control Center V1 UI Shell — 仕様（read-only）

**位置づけ**: 同一モノレポ内 **`docs/ichikishima/mockups/` または後続で `apps/control-center-ui/` 相当** とする **最小 UI Shell 準備**。**本 SPEC 草案段階の「ウィンドウ起動しない」記述**: *静的 mock 専用*を指す。実装済みの **Electron Renderer read-only Shell**（`ControlCenterAppShell.tsx` **`getAppSnapshot` のみ**）は **`CONTROL_CENTER_APP_SHELL_UI_SPEC.md`** と `CONTROL_CENTER_PRELOAD_RENDERER_CONTRACT.md` を正とする。

---

## 1. V1 UI Shell の目的

- `controlCenter.readonly.getAppSnapshot`（実装側 `buildControlCenterAppSnapshot`）が返す sanitized JSON を **人間が読める形で並べる**練習用シェルの土台。Legacy `getSnapshot` is retired.
- **状態・件数・相対パス参照・readiness メタのみ**を扱う。操作はしない。

## 2. Read-only Dashboard であること

- 入力は「表示のためのスクロール」のみ許容（将来）。**送信・実行・キュー適用・プロセス操作は禁止**。
- **Approval 済みでも自動実行しない**ことを UI コピーで明示できるとよい（例: 脚注）。

## 3. 最初に表示するカード（推奨順）

`CONTROL_CENTER_V1_SCREEN_SPEC.md` に準ずる。

1. Header（モード READ_ONLY / ipcBinding の短文）
2. Status Cards（`statusCards[]`）
3. Hermes Room（`readiness`、`bridge`）
4. Ichikishima Room
5. Approval Room（`approvalQueueSummary` 集計のみ）
6. Audit Room（`auditLogSummary` 集計のみ）
7. Reports（`latestReports.docRelativePaths` + `latestApprovalReportId` のみ）
8. Next Goals（`nextGoals[]` の見出し程度）
9. Disabled Pipeline Buttons（一覧・**すべて disabled**）
10. （Static Shell での任意鍵）`appFoundationPreview` — **App Management Foundation** の短文（`productionReady:false`、Controlled Pilot 「実機値待ち」、Real Hermes not running。**execute ボタンなし**）。

## 4. Disabled Buttons

設計固定（V1 Shell）:

- Run Local Pilot
- Run Hermes Bridge Pilot
- Review Latest Report
- Generate Approval Report
- Create Memory Candidates
- Stop All

**HTML Pipeline 行**: `disabled` 属性。実行系の `onclick→IPC` は **結線しない**。  
**Static Read-only Shell** のみ、同等ディレクトリの **ブラウザ用ローカル JS** で **JSON を表示するのみ**許可する（`fetch(` と外部 CDN 禁止）。

## 5. 危険操作禁止

- delete / execute / network / git 実効
- Hermes 実本体起動
- 外部 HTTP
- メモリ DB / secrets の読み出し表示

詳細は `CONTROL_CENTER_V1_SECURITY_MODEL.md` / `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`。

## 6. Renderer 権限禁止

- Electron を使う将来フェーズでは **`nodeIntegration: false`、`contextIsolation: true`、preload 限定**。
- **レイアウトのみ mock** は UI から fs へアクセスしない。
- Static Shell は **ユーザーが選択したローカル JSON** または **ページ内埋め込み Snapshot** を表示するのみ（Hermes に接続しない）。

## 7. Mock Data / Snapshot Data の扱い

| 種類 | 扱い |
|------|------|
| **レイアウトのみ静的 mock** | `docs/ichikishima/mockups/control-center-v1-readonly.html`（スクリプト無し・固定ラベル） |
| **Read-only Static Shell** | `control-center-v1-static-shell.html` + `.css` + `.js`。`control-center-v1-snapshot.sample.json`。埋め込み JSON と `FileReader` のみ。 |
| **本番相当 JSON** | 将来 backend がシリアライズして渡す（今回は未配線）。 |

## 8. 実装候補ディレクトリ（同一モノレポ）

ユーザー判断に基づき、次のどちらか（**後続 Goal で決定**。本 Goal は文書＋静的 mock のみ）。

```text
apps/control-center-ui/     # アプリ単位が明確になる場合
src/control-center-ui/        # アプリレイヤ直下に置く場合
```

当面の参照元は **`control-center-data-provider.ts`** と **`CONTROL_CENTER_READONLY_IPC_BINDING`**。

## 9. 今回実装しないもの

- `npm install` / ロックファイル変更による新依存。
- Electron ウィンドウ・`ipcMain.handle`／HTTP サーバ bind。
- 実 Hermes、外部通信、DB、`git push`。

## 10. 次 Phase でやること

0. **達成済み（2026-05 前後）**: Read-only Static Shell（`mockups/control-center-v1-static-shell.*`）。**HTTP サーバ無し**。**Local read-only API の Threat Model〜Implementation Gate 文書**（`CONTROL_CENTER_LOCAL_API_*.md`）と **`local-api-contract.ts`**（**listen 無し**）。
0.5 **達成済み（2026-05-03）**: **App Management Foundation** — `CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md`、`control-center-rooms.ts` / `control-center-app-snapshot.ts`、`control-center-readonly-ipc.ts`（準備のみ）。**main 恒久 IPC・preload は未着手でも可**。
1. 同一モノレポに **読み取りのみ** の entry（別承認。既存ランタイムの **許可済み依存のみ** でビルド可能なら）。
2. **`CONTROL_CENTER_LOCAL_API_IMPLEMENTATION_GATE.md`** を満たした後にのみ **127.0.0.1 のみ bind** の read-only endpoint（別承認）— `CONTROL_CENTER_V1_LOCALHOST_SECURITY.md` / `CONTROL_CENTER_LOCAL_API_CONTRACT.md` 参照。
3. 将来 **local session token**（V1.5）。

---

## 関連文書

- `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`
- `CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`
- `CONTROL_CENTER_V1_UI_SHELL_TEST_PLAN.md`
- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
- `CONTROL_CENTER_STATIC_SHELL_JSON_GUIDELINES.md`（`file://` viewer での JSON 運用）
- `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md` / `CONTROL_CENTER_LOCAL_API_CONTRACT.md`（**HTTP 未到達フェーズの契約・脅威**）
- `CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md` / `APP_ONLY_OPERATION_ROADMAP.md`

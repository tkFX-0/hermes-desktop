# Control Center — App Management Foundation SPEC（V1 · read-only）

**位置づけ**: 将来的に **単一 Windows アプリ**だけで状態確認・承認/監査の集計ヒント・Hermes / Controlled Pilot の **準備ラベル**を見られるようにするための **土台**。**Cursor / Composer2 / Codex は開発専用**とし、**通常運用は Control Center へ収束**する想定だが、**本 V1 では読取のみ**。実行経路・実プロセス・WSL・承認自動実行は持たない。

**コード正（集約 Snapshot）**: `src/main/ichikishima/control-center/control-center-app-snapshot.ts`  
**部屋モデル**: `control-center-rooms.ts`  
**read-only IPC 準備モジュール**: `control-center-readonly-ipc.ts`（**`ipcMain` 本配線は別 Goal**）

---

## 1. 目的

開発用 IDE を開かずとも、ユーザーが **安全に固定された形**で次を把握できるデータ契約を用意する。

- Hermes Bridge / Sandbox 準備ラベルの要約  
- Controlled Pilot の **コード上の準備状況**（**実機 1 回に必要なパス類はユーザー Goal で確定**）  
- Approval / Audit / Memory（候補件数のみ）などの **集計レイヤ**  
- 将来の UI「部屋」単位カードは **すべて操作 disabled + `disabledReason` 必須**

---

## 2. 最終形（視野）

通常運用は **一つの Windows アプリ**（Control Center）で管理。**開発時のみ** Cursor / Composer2 / Codex を利用する。

---

## 3. 今回の V1 範囲（含める）

| 項目 | 内容 |
|------|------|
| 部屋スナップショット | `ControlCenterRoomsSnapshot`（8 rooms） |
| アプリ統合 Snapshot | `ControlCenterAppSnapshot`（`productionReady:false` 固定ほか） |
| IPC **準備** | `buildControlCenterReadonlyIpcHandlers` / `registerControlCenterReadonlyIpcHandlers`（DI） |
| 文書 | 本 SPEC、readonly IPC アプリ契約、preload/renderer 契約草案、静的 mock |

---

## 4. read-only 原則

- メイン側は **クエリのみ**。Renderer へ **Node `fs`、`child_process`、`env`、raw payload、stdio 全文**を渡さない。  
- `ControlCenterAppSnapshot` の **`baselineReadonly.hermesBridgePilot`** は **`allowedApis` / `forbiddenApis` の件数のみ**（識別子配列は JSON に載せない）。  
- アクション UI は **`state:"disabled"` のみ**。実行系チャンネルは **名前空間に存在させない**。

---

## 5. 部屋モデル

| Room ID | 役割 |
|---------|------|
| `hermes_room` | Bridge / Sandbox 準備ヒント |
| `ichikishima_room` | Review / Silence 方針（短文） |
| `approval_room` | キュー集計の門 |
| `audit_room` | 監査集計の門 |
| `memory_room` | メモリ候補 **近似件数のみ** |
| `controlled_pilot_room` | 実機値待ち明示 |
| `visualization_room` | 設計のみ |
| `system_room` | Cursor/Codex は開発専用、将来はアプリのみ運用 |

---

## 6. 表示してよい情報（例）

- READY ラベル、短文 blockers、`nextGoals` のタイトル、相対パス参照、approx counts、Controlled Pilot の **コード ready / preflight メタラベル**（実 실행なし）。

---

## 7. 表示してはいけない情報

- secrets / `.env` / API キー、queue 項目本文、validated payload 全文、stdout/stderr 全文、**API 識別子の一覧配列**、内部絶対パスの羅列、process handle。

---

## 8. 実行してはいけない操作

実 Hermes 起動、`wsl.exe`、`execFile` / spawn / exec、承認済み操作の自動実行、HTTP listen 追加、`npm install`、EA/MT5、memory DB 本番接続、git push、外部送信。

---

## 9. IPC 方針

- **許可名前空間**: `controlCenter.readonly.*` のみ（実装一覧は `CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`）。  
- **禁止**: `controlCenter.execute.*`、`approval.execute.*`、`hermes.run.*`、`rawFs.*`、`rawShell.*`、`rawNetwork.*`、`rawGit.*`、`wsl.run.*`、`process.run.*`  
- **本番 Electron への `ipcMain.handle` 恒久配線**は、`preload` と既存慣習が固まった **別 Goal**。未確定なら **準備関数のみ**で止める。

---

## 10. Local HTTP との関係

論理 **`GET /snapshot`** は `getControlCenterReadonlyData` 相当を返すが、**Electron 本命は IPC**（`ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`）。App Management Snapshot は **IPC 側の論理オブジェクト**。Local HTTP と **レスポンス形状を勝手に混同しない**。

---

## 11. WSL2 Hermes との関係

`wsl2WrapperStatusLine` は **短文 1 行**（既定は `wsl2_registry:<status>:…`）。`wsl2WrapperParameterSummary`（`HermesWsl2WrapperSafeSummary`）は **件数・次アクション・canRun*=false**。**raw executable / argv 全文・stdout は出さない**（`HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`）。wrapper **`wsl.exe` 実行**は **未実装・未許可**。

---

## 12. Controlled Pilot との関係

コードパス・preflight 集約は読める。**`executablePath` / `argv` / `cwd` / `signoffAtUnixMs` 等が未確定**の間は **実機 1 回へ進めない**（別 Goal）。UI に **起動ボタンを置かない**。

---

## 13. Approval / Audit / Review / Memory との関係

- Approval / Audit は **サマリ object**のみを snapshot / IPC が返しうる（本文増幅しない）。  
- Review / Memory Candidate は **方針・件数ヒント**。永続 DB 読取はしない。

---

## 14. 将来の「操作ボタン」解禁条件（要約）

以下を **順に満たす別 Goal の承認ごと**にのみ検討する。

1. Bridge Final Review / Sign-off、ownership ADR の維持  
2. メインプロセス allowlist・preload の監査完遂  
3. Controlled Pilot：**実機メタすべて確定**・Runbook と整合  
4. WSL／Process adapter：**専用契約ゲート通過**

---

## 15. Cursor / Codex 不要化ロードマップ

| フェーズ | 意味 |
|---------|------|
| Read-only | 本 Goal — アプリまたは静的 Shell で **見るだけ** |
| Controlled action | Sandbox 許可パイプラインのみボタン化（別 Goal） |
| Hermes wrapper | WSL／adapter 確定後 |
| メモリ永続化 | Governance 済みのみ |

詳細一覧は **`APP_ONLY_OPERATION_ROADMAP.md`**。

---

## 関連

- `CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`
- `CONTROL_CENTER_PRELOAD_RENDERER_CONTRACT.md`
- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
- `CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md`（App Management と部屋モデル）

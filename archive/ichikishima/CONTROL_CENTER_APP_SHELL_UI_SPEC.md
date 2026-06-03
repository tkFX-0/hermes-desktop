# Control Center — App Shell UI（read-only）仕様

**状態（2026-05-03）**: **Electron Renderer に `ControlCenterAppShell` を実装済み**（`src/renderer/src/screens/ControlCenterAppShell/ControlCenterAppShell.tsx`）。**ナビ「Control Center」**から遷移。**実行系 IPC・hermesAPI の危険チャンネルは呼ばない**。

**検証**: `parseControlCenterShellSnapshot`（`src/shared/ichikishima/control-center-shell-ui-contract.ts`）＋ `tests/ichikishima/control-center/control-center-app-shell-ui.test.ts`。

---

## 1. 目的

Ichikishima / Hermes 管制盤の **read-only 統合 Snapshot** を、アプリ内で **閲覧のみ**する。**操作は一切実行しない**。

---

## 2. read-only UI 原則

- **表示のみ**。ボタンは **すべて disabled**（または read-only 情報の再取得に限る **Refresh（read-only）** のみ）。
- **preload の `window.ichikishimaControlCenter.getAppSnapshot()` のみ**をデータ源とする。
- **`window.hermesAPI` の Hermes 起動・Approval・Memory 書込等は呼ばない**。

---

## 3. データ源

| 手段 | 状態 |
|------|------|
| `getAppSnapshot()` | **唯一の取得 API** |
| 任意 `ipcRenderer.invoke(channel, …)` | **禁止** |
| raw `fs` | **禁止** |
| auto polling | **なし**（手動 Refresh のみ） |

---

## 4. 表示する部屋（論理）

`ControlCenterAppSnapshot.rooms` に従う（**hermes / ichikishima / approval / audit / memory / controlled_pilot / visualization / system** 相当）。

---

## 5. 表示してはいけない情報

- raw payload・**stdout/stderr 全文**・**secrets**・**env**・**process handle**
- **allowedApis / forbiddenApis の識別子配列全文**
- raw audit / approval キュー本文・**memory 本文全文**
- Executable **絶対パス**の過剰露出
- **stack trace 全文**・**生例外オブジェクトの JSON**
- **「本番 READY」**を誤認させる表示（**常に非本番・read-only**を前提）

---

## 6. actions

- 各 room の **actions はすべて `state: disabled`**
- **`disabledReason` を表示**（短文・UI 上で見えること）

---

## 7. エラー表示方針

- **失敗時は明示エラー UI**（赤枠・短文タイトル）。
- **空オブジェクト `{}` で成功扱いにしない**。
- **短文メッセージのみ**（例: *Control Center snapshot is unavailable.* / *Read-only IPC failed.*）。
- 併記: *No actions were executed.*
- **内部コード**: `code:parse_error_key` 形式の **短い機械可読コード**のみ（**stack なし**）。

---

## 8. loading / empty

- **loading**: 初回取得および Refresh 中に表示。
- **empty**: snapshot が `null`/`undefined` は **エラー**として扱う（成功の空表示にしない）。

---

## 9. STOP GATE（本画面で越えない）

- 実 Hermes 起動、`wsl.exe`、`execFile`、子プロセス、外部通信、依存追加、EA/MT5、memory DB 本番、Approval 実行、Agent 自律実行、**execute 系 preload 拡張**。

---

## 10. 将来の操作ボタン解禁条件

- **別 Goal**＋**人手承認**＋**preload / main の実行系チャンネル監査**後。本画面は **read-only ラインを維持**し、実行は **別名前空間・別ルート**が望ましい。

---

## 11. Snapshot 源・path 表示（開発専用 / packaged 未検証）

- **正文書**: `CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md`。
- **必須表示（契約テストでも固定）**: **Development snapshot**（または packaged-like で **resolved + pending の併記**）、**Packaged path resolution pending**（`isPackaged === true` かつ検証フラグ未到達時）、**`productionReady:false`** の表明。
- **禁止**: 「本番 READY」「production verified」「packaged safe」「real Hermes connected」および **絶対パス・`userData`・`resourcesPath` のユーザー向け過剰表示**。
- main の歴史的直書き `join(__dirname, '../..')` は **開発時の単純近似**であった。**resolver により dev / packaged 候補を分岐**。**実 packaged Electron 起動での正しさはこのリポジトリ Goal では検証しない**（STOP GATE）。
- **`pendingPackagingResolution:false`**: **`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` が Go** のあと（リリース手順でコード反映）。設計は `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`。
- **packaged path verified（将来のラベル）と `productionReady` は別**。前者でも **`productionReady:false` を維持**。**Hermes 実ランタイム READY でもない**。

---

## 関連

- `CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md`
- `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`
- `CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`
- `CONTROL_CENTER_PRELOAD_RENDERER_CONTRACT.md`
- `CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`
- `CONTROL_CENTER_V1_UI_SHELL_SPEC.md`
- `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`

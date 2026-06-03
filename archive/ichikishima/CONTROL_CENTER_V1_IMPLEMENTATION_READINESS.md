# Control Center V1 — Implementation Readiness（UI Shell に入る前のゲート）

**位置づけ**: 次 Goal「**Control Center V1 UI Shell**」へ進む前の **チェックリスト**。すべて満たすまではウィンドウ実装・依存追加・IPC の本番配線を始めない。

---

## 1. 達成済み（本 Goal 終了時点で期待）

| # | 項目 |
|---|------|
| 1 | `CONTROL_CENTER_V1_UI_SPEC.md` 作成済み（方式比較と推奨） |
| 2 | `CONTROL_CENTER_V1_SECURITY_MODEL.md` 作成済み |
| 3 | `CONTROL_CENTER_V1_IPC_CONTRACT.md` 作成済み（集約 RPC 方針） |
| 4 | `CONTROL_CENTER_V1_SCREEN_SPEC.md` 作成済み |
| 5 | `getControlCenterReadonlyData` とスクリーン仕様のフィールド対応確認済み |
| 6 | `ipcBinding.rpcLogicalName` / `payloadSchemaVersion` がペイロードに含まれる |
| 7 | `HERMES_BRIDGE_API_REGISTRY.md` + `HERMES_BRIDGE_ALLOWED_APIS` 定数の単一化方針が文書化済み |
| 8 | **`CONTROL_CENTER_V1_UI_SHELL_SPEC.md`** Shell 準備済み |
| 9 | **`CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`** UI がbindしてよいフィールドが固定済み |
| 10 | **`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`** localhost／bind 規約が固定済み |
| 11 | **`CONTROL_CENTER_V1_UI_SHELL_TEST_PLAN.md`** が揃っている |
| 12 | （任意・推奨）**静的 mock** `docs/ichikishima/mockups/control-center-v1-readonly.html` |

- npm install / 依存追加（別承認が出るまで禁止）。
- Renderer に Node 権限。
- 実行系 IPC（`*.execute.*`）。
- Hermes **実本体**起動・常駐。
- 外部通信・DB・secrets・MT5/EA。

---

## 3. UI Shell Goal で **最初にやる** こと（推奨順）

1. 同一モノレポ `apps/control-center-ui/` または `src/control-center-ui/` 相当への **読み取り専用スキャフォールド**（または **静的 HTML をリポジトリに置いたまま**）。**依存追加するなら停止**。
2. **モック JSON** で `CONTROL_CENTER_READONLY_IPC_BINDING` と型の一致を確認。
3. **本物の `getControlCenterReadonlyData` を呼ぶ**のは **backend/main のみ**（同一マシン IPC でも可。ただし契約は read-only 1 本）。

---

## 4. 停止条件（再掲）

`CONTROL_CENTER_V1_SECURITY_MODEL.md` の禁止事項に触れる実装が必要になったら **停止して人手レビュー**。

---

## 関連

- `NEXT_GOALS.md` §3
- `ROADMAP_STATUS.md`

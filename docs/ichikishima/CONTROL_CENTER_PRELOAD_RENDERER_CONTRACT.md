# Control Center — Preload / Renderer 契約（read-only）

**状態（2026-05-05 追記）**: **`src/preload/index.ts` が `window.ichikishimaControlCenter` を公開**。**Renderer read-only App Shell 実装済み**。単独 Control Center 製品ウィンドウは将来検討。**main は `control-center-project-root-resolution.ts` で path 源を決定**。Renderer には **`pathResolution*` 安全要約のみ**。**packaged 実アプリでの path 正しさは人手／別 Goal で未検証**。

**Namespace clarification（2026-05-05）**: 「preload は `getAppSnapshot` のみ」は **Ichikishima Control Center namespace（`window.ichikishimaControlCenter`）限定**の記述。既存の app-wide `window.hermesAPI` は別 namespace であり、本 read-only Control Center 契約には含めない。Control Center App Shell は `window.hermesAPI` を fallback action / data source として呼ばない。

**実装の正**

- Preload API ファクトリ: `src/preload/ichikishima-control-center.ts`（`createIchikishimaControlCenterPreloadApi`）。
- IPC チャンネル文字列の共有: `src/shared/ichikishima/control-center-readonly-ipc-channel.ts`（`CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL`）。
- Main 側登録: `registerControlCenterReadonlyIpcHandlers`（`src/main/index.ts` の `setupIPC` 先頭）。

---

## 1. preload が Renderer に公開してよい API（V1 最小）

**名前空間**: `window.ichikishimaControlCenter` — **次の 1 メソッドのみ**。

| メソッド | 実装（内部） |
|----------|----------------|
| `getAppSnapshot()` | `ipcRenderer.invoke("controlCenter.readonly.getAppSnapshot")`（定数 `CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL` と同一文字列必須） |

**戻り型**: `Promise<ControlCenterAppSnapshot>`（型定義は `src/preload/index.d.ts` が `control-center-app-snapshot.ts` を参照）。

**任意チャンネル分割**（`getRooms` / `getVisualizationModel` 等）は **V1.1 以降**。V1 Renderer は **`getAppSnapshot` のみ**を用い、Approval / Audit / Memory / Agent Team / Visualization は **AppSnapshot 内の安全要約**に依存する（`APP_ONLY` 方針）。

---

## 2. 絶対に preload に載せないメソッド名（例）

```text
runHermes
executeApproval
rawFs
rawIpc
rawShell
runWsl
runProcess
raw ipcRenderer
arbitrary invoke
raw fs
```

`ipcRenderer` そのもの、**任意チャンネル文字列を受け取る `invoke` ラッパ**、Node `fs` / `child_process` への橋渡しは **公開禁止**。

---

## 3. Renderer が受け取ってよいデータ

- `ControlCenterAppSnapshot` に準拠。**`productionReady:false`** のときは画面上部に **非本番・閲覧専用**を明示できる。
- **本文・payload 全文・stdio 全文・環境変数値・secrets・Executable 絶対パス過剰・process handle は含めない**（builder / sanitizer 側の不変条件）。

---

## 4. packaging / path（prepared・実検証は別）

開発時は **`mainProcessDirname` 相対で projectRoot**。packaged 時は **候補列挙＋短文ステータスのみ**。`userData` を projectRoot とみなさない。**実 packaged アプリで「正しいルート」を保証した記録は本 Goal に含めない**。UI は **Development snapshot / pending / `productionReady:false`** を **`CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md`** に従う。

---

## 関連

- `CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`
- `CONTROL_CENTER_V1_SECURITY_MODEL.md`
- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`

# Control Center V1 — Security Model（Read-only Dashboard）

**位置づけ**: UI / Renderer / Main（または Backend）間の **権限と公開 API の境界**。  
実装コードの正は、`CONTROL_CENTER_V1_IPC_CONTRACT.md` と `getControlCenterReadonlyData`（`control-center-data-provider.ts`）。

---

## 1. UI / Renderer の権限（持ってよいもの）

- DOM / レイアウト / 状態表示のみ。
- **Backend または main が返した JSON**（契約済みフィールドのみ）を受け取って表示すること。
- ユーザーが **自分でファイルを開く**操作（OS の既定エディタ等）への **パス文字列参照**のみ（可能なら相対パス表示＋ユーザー側で解決）。
- **`disabledActions` に列挙された操作は UI 上も disabled または非表示**（V1 は disabled 優先）。

## 2. UI / Renderer の権限（持ってはいけないもの）

- **raw `fs`** / **raw `path`** によるプロジェクト走査。
- **`child_process` / shell**。
- **`fetch`** または任意 HTTP／ソケット（契約された backend への通信以外。「任意」は禁止）。
- **raw git**（CLI・ライブラリ直叩き）。
- **`.env` / secrets / API キー**の読み取り・表示・ログ出力。
- **memory DB / SQLite**。
- MT5 / EA 本体 API。
- 「承認済みだから自動実行」を起こすトリガ。

---

## 3. Main / Backend の権限

- **プロジェクト側で既にある** read-only 集約関数（例: `getControlCenterReadonlyData`）を呼び、その **許可された戻り値だけ**をシリアライズして UI に渡す。
- Zone 内の JSONL や path-guard を使った **集計**は main/backend の責務（UI ではない）。
- **実行系パイプライン**（delete / execute / network / git 実効、Hermes 実本体起動）は **V1 では実装しない**。将来も **別名前空間・別承認**。

---

## 4. 公開してよい read-only API（論理名）

**V1 推奨: 1 本の集約**

- `controlCenter.readonly.getAppSnapshot` → 実装側の sanitized `ControlCenterAppSnapshot`。Legacy `getSnapshot` is retired.

将来分割する場合も **`controlCenter.readonly.*` プレフィックスのみ**。

補助（Hermes 境界の read-only メタのみ）:

- `hermesBridge.readonly.getPilotReadiness`（`getHermesBridgePilotReadiness` 相当。実行ではない）。

---

## 5. 公開してはいけない API（例）

- `runCommand` / `writeAnyFile` / `deleteFile` / `fetchUrl` / `gitPush` / `readEnv` / `connectMT5` / `updateMemoryDb`
- `executeApprovedAction` / `runHermesRaw` / `exposeRawFs` / `exposeShell`
- `shell.*` / `rawFs.*` / `rawGit.*` / `rawNetwork.*` / `mt5.*` / `memoryDb.write.*` / `approval.execute.*`
- **`hermesBridge.execute.*`** のような名前空間を **V1 では作らない**（早期に実行穴になる）。

詳細は `CONTROL_CENTER_V1_IPC_CONTRACT.md`。

---

## 6. 方針の固定

| # | 方針 |
|---|------|
| 1 | UI は **read-only**。状態を見るだけ。 |
| 2 | 実行要求チャネルは **今は作らない**。 |
| 3 | **Approval 済みでも自動実行禁止**。 |
| 4 | Dangerous Actions は **`disabledActions` + UI disabled**のみ。 |
| 5 | **secrets 表示禁止**（マスク済み短文のポリシーは別 SPEC）。 |

---

## 7. Stop All など「止める」系

- V1 では **ラベルまたは disabled ボタンのプレースホルダのみ**。
- 実処理・シグナル・プロセス kill は **後続 Goal**。誤って「見た目だけで安心」と錯覚しないよう、UI に **「no-op」** と明記する。

---

## 8. 将来ボタンを解放する条件（概要）

1. **`HERMES_BRIDGE_FINAL_REVIEW` + `HERMES_BRIDGE_API_REGISTRY` の人手レビュー**が完了している。
2. **preload / backend** の公開面がレビューされ、実行系が **論理別 Repo または名前空間分離**されている。
3. **監査ログ**に操作が残る設計になっている。
4. **自動実行しない**運用ポリシーが崩れない。

---

## 関連

- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
- `CONTROL_CENTER_V1_SCREEN_SPEC.md`
- `HERMES_BRIDGE_API_REGISTRY.md`

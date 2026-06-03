# Hermes Bridge API Registry — コード上の単一参照元

**位置づけ**: `HERMES_BRIDGE_FINAL_REVIEW.md` §1–2 の **人間向け表**と、コード上の **`HERMES_BRIDGE_ALLOWED_APIS` / `HERMES_BRIDGE_FORBIDDEN_APIS`** を一致させるためのレジストリ。  
**ルール**: **機械が参照する正は TypeScript 定数**（`src/main/ichikishima/hermes/hermes-bridge-api-registry.ts`）。Final Review の表は説明・チェック用。差分が出たら **先にコードを直し**、文書を追随する。

---

## 1. 実装ファイル

| 記号 | パス |
|------|------|
| 定数 | `src/main/ichikishima/hermes/hermes-bridge-api-registry.ts` |
| Readiness 応答での列挙 | `getHermesBridgePilotReadiness`（`allowedApis` / `forbiddenApis` は上記定数をコピーした配列） |

---

## 2. `HERMES_BRIDGE_ALLOWED_APIS`（正）

`hermes-bridge-api-registry.ts` の `HERMES_BRIDGE_ALLOWED_APIS` 定数そのもの。一覧はリポジトリ内のソースを参照すること（転記二重管理を避ける）。

**注意**:

- 「実行はしない」ブロック境界 API（例: `deleteZoneFile`）も **Hermes が呼び得る許可リスト**に含める。実効実行はしない。
- 表中の複合記述（`validateHermesBridgeOperation / routeHermesOperation`）はコードでは **別要素** に分割している。

---

## 3. `HERMES_BRIDGE_FORBIDDEN_APIS`（パターン識別子）

Final Review §2 を **安定スラッグ** に落としたもの。意味は `HERMES_BRIDGE_FINAL_REVIEW.md` と一対一で突合せる。

全文パース自動同期は行わない。**差分レビュー**で維持する。

---

## 4. `HERMES_BRIDGE_READINESS_REQUIREMENTS`

接続／Pilot の人間ゲートに使う短文。`getHermesBridgePilotReadiness` の `requiredHumanReviews` と併せて読む。

---

## 5. 変更手順（運用）

1. Bridge 許可／禁止境界を変える必要が生じたら **`hermes-bridge-api-registry.ts` を編集**。
2. `HERMES_BRIDGE_FINAL_REVIEW.md` §1–2 を読みなおし、表を一致させる。
3. **本ファイル** に「変更意図」が必要なら 1～2 行追記。
4. **`HERMES_BRIDGE_OPERATION_MATRIX.md`** を `routeHermesOperation` の tier と一行で整合させる。
5. **`CONTROL_CENTER_V1_IPC_CONTRACT.md`** §9（将来 IPC メタ）を **`HERMES_BRIDGE_REGISTRY_IPC_*` と整合**させる。
6. `tests/ichikishima/hermes/*.test.ts` が緑であることを確認。

---

## 6. 将来 preload IPC（**read メタのみ**）

| コード定数 | 役割 |
|------------|------|
| `HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS` | **`ipcMain.handle` は未実装**。**論理チャネルは `hermesBridge.registry.getReadiness` のみ**。返却は **ラベル・件数・blockers・短文メタのみ**。**allowed/forbidden の完全リストは載せない**。 |
| `HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS` | **`getAllowedApis` / `getForbiddenApis` / `pilot.getReadiness`** および `pilot.run`・`operation.route` などを当面禁止。 |

詳細ポリシー — `CONTROL_CENTER_V1_IPC_CONTRACT.md` §9、`HERMES_BRIDGE_FINAL_REVIEW.md` §8、`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`。

---

## 関連

Bridge の **名前空間・混線防止**は `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md` と **`HERMES_BRIDGE_OWNERSHIP_MODEL.md`** を参照（本ファイルは TS レジストリの運用手順）。

- `HERMES_BRIDGE_FINAL_REVIEW.md`
- `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`
- `HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`
- `HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md`
- `CONTROL_CENTER_V1_IPC_CONTRACT.md`（Hermes の将来 IPC メタ§9）
- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`
- `CONTROL_CENTER_OWNERSHIP_MODEL.md`
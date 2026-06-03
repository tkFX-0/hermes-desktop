# Control Center — Local Read-only API Test Plan

**状態**: **`127.0.0.1` read-only HTTP V1 は実装済み**（`src/main/ichikishima/control-center/local-api-server.ts`）。  
**単体試験**: **`local-api-contract.test.ts`**（定数のみ）および **`local-api-server.test.ts`**（実サーバ・ルータ）

---

## 1. アドレス結合・到達範囲

| ID | 観点 |
|----|------|
| B-01 | **`local-api-server.test.ts`**: **`127.0.0.1` のみ**。`0.0.0.0` が **拒否**されることをコードで確認。 |
| B-02 | （手動ラン）LAN 上の別ホストから **到達しない**ことを確認する手順は Threat Model §2 と本書 §1 と二重チェック。 |

---

## 2. 機能・データ

| ID | 観点 |
|----|------|
| D-01 | **`GET /snapshot` のみ**が **allowed route** リストにあり、他パスは 404／405 または同一の安全 denied。 |
| D-02 | **`POST` / `PUT` / `PATCH` / `DELETE`** は **許可リストに無い**。 |
| D-03 | **`/execute`、`/secrets`、`/raw-log`、`/env`** など **禁止パス一覧** と実装コードのルーティングに矛盾無し（grep／registry 試験）。 |
| D-04 | Snapshot JSON が **`CONTROL_CENTER_READONLY_IPC_BINDING`・`requiresUserApproval: true`、`canExecuteDangerousActions: false`** を満たす。 |
| D-05 | **secrets／API キー形／.env 行風／長entropy** が応答に含まれない（Provider 側マスクとの二重チェックでも可）。 |
| D-06 | **raw audit / approval 全文・report 全文** が HTTP JSON に混入しない（サンプル fixture negative 試験は Provider 側で継続）。 |

---

## 3. 堅牢性・サイズ・失敗様式

| ID | 観点 |
|----|------|
| R-01 | 不正パス／不正メソッドは **情報を漏らさず**論理コードと短文 `reason` のみで失敗する。 |
| R-02 | **`stack trace` 文字列**が JSON に出ない（実装レビュー + grep）。 |
| R-03 | Snapshot サイズが **`CONTROL_CENTER_LOCAL_API_MAX_SNAPSHOT_BODY_BYTES_GUESS`** を超える場合は **507**（`SNAPSHOT_TOO_LARGE`）。 |
| R-04 | ポートは既定 **`0`**（OS エフェメラル）または明示指定。**衝突時はエラーで失敗**（ハングしない）。 |

---

## 4. 副作用・通信

| ID | 観点 |
|----|------|
| S-01 | Local API のリクエスト処理が **`runCommand`** / **`deleteZoneFile`** 実効 / **`fetch`** 等を **呼ばない**（静的コード検査またはモック統合試験）。 |
| S-02 | （将来）**外部 DNS／HTTP は発生しない**（ネットワークモックまたはオフラインテスト環境での一度の検証）。 |

---

## 5. ライフサイクル

| ID | 観点 |
|----|------|
| L-01 | **`stopControlCenterLocalApiServer`** で **ポート解放**。同一プロセス **二重 `start` は `LOCAL_API_ALREADY_STARTED`** で拒否。 |

---

## 6. **実行している試験**

- `local-api-contract.test.ts` — 定数：**`GET /snapshot` のみ**、禁止 HTTP メソッド（**`HEAD` / `OPTIONS` 含む**）、禁止パス、`canExecuteDangerousActions` / `requiresUserApproval` と Readonly の整合。
- `local-api-server.test.ts` — **実 `http.Server`**：`GET /snapshot` JSON、不正メソッド／パス、`0.0.0.0` 拒否、二重 start、stop、応答から **stack 不在**。
- `control-center-readonly-snapshot-contract.test.ts` — Snapshot 論理維持。
- `npm run typecheck:node`

---

## 7. **意図的に実行しない試験**

- 負荷試験、Electron E2E、ブラウザ自動操作、LAN 別マシンからの到達確認（手動のみ）。
- Hermes 実プロセス統合試験。
- **`npm install` を前提とする UI ビルド**。 

---

関連: `CONTROL_CENTER_LOCAL_API_CONTRACT.md`、`CONTROL_CENTER_LOCAL_API_IMPLEMENTATION_GATE.md`

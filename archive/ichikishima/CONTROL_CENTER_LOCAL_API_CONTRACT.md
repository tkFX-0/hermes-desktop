# Control Center — Local Read-only API Contract

**状態**: **最小 HTTP サーバー実装済み**（`local-api-server.ts`）。依存は **`node:http` のみ**。**CORS は送出しない**。本書が公開契約の正。  
**運用との関係（本命／補助）**: Electron 系 UI の本命は **`controlCenter.readonly.*` の IPC（preload 限定）**（`CONTROL_CENTER_V1_IPC_CONTRACT.md`、`ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`）。**本 HTTP API は補助**であり、`CONTROL_CENTER_OWNERSHIP_MODEL.md` に従い **常時 listen しない**（明示起動）。  
**機械的可読な定数**: `src/main/ichikishima/control-center/local-api-contract.ts`  
**Snapshot データ形の正**: `getControlCenterReadonlyData`（`control-center-data-provider.ts`）および `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`。

---

## 1. V1 で公開してよい API（HTTP）

| メソッド | パス | 意味 |
|---------|------|------|
| `GET` | `/snapshot` | read-only Snapshot 本体。**これ以外のパス・メソッドは V1 では公開しない**。 |

### 論理 RPC 対応（IPC / preload と同一データ）

論理識別子は既存 IPC と一致させる：

```text
controlCenter.readonly.getAppSnapshot
→ HTTP としては GET /snapshot の JSON 応答本体が論理結果
```

ペイロード（成功時）は **`ControlCenterReadonlyData`** と同一フィールド（省略不可の意味論は IPC 契約に従う）。

---

## 2. 成功レスポンスに含めるデータ

次を含める（名前・不変条件は `CONTROL_CENTER_V1_UI_DATA_CONTRACT.md` と一致）。

- `ipcBinding`
- `statusCards`
- `approvalQueueSummary`
- `auditLogSummary`
- `latestReports`
- `readiness`
- `nextGoals`
- `riskSummary`
- `disabledActions`
- `requiresUserApproval` — **literal `true`**
- `canExecuteDangerousActions` — **literal `false`**

---

## 3. 返してはいけないもの

- secrets、`.env` 由来の値、API キー、Bearer トークン原文。
- memory DB 内容、MT5 口座・取引履歴、個人情報。
- **raw audit log**（JSONL 行の列挙、本文）。
- **raw approval queue**（項目の長文理由・commands／externalUrls の原文垂れ）。
- **raw approval report**（Markdown 全文）。
- **ファイルコンテンツ**（Zone 内外を問わず原文）。
- LLM 「内部思考」に相当する長文ログ。
- **生の stack trace**（実装側）。絶対パスの **過剰な列挙**（必要最小限の相対参照以外）。

---

## 4. 禁止 API・パス（V1 で作らない／将来も同一ポートに混載しない）

次のような **名前・メソッド**は **載せない**（例示：`CONTROL_CENTER_LOCAL_API_FORBIDDEN_PATH_PREFIXES` / `CONTROL_CENTER_LOCAL_API_FORBIDDEN_PATH_EXACT_SLUGS` と整合）。

```text
POST /execute
POST /delete
POST /network
POST /git
POST /approval/execute
POST /hermes/run-raw
POST /memory/write
POST /mt5
GET /env
GET /secrets
GET /raw-log
DELETE /anything
PATCH /anything
PUT /anything
```

## 5. HTTP メソッド・CORS 方針（V1 固定）

- **許可**: **`GET` `/snapshot`** のみ成功時 **200 / `application/json`**。
- **`HEAD` / `OPTIONS`** `/snapshot`:**405**。**本文無し**（読取ヘッダ面を増やさない）。
- **`POST` / `PUT` / `PATCH` / `DELETE`** `/snapshot`: **405**。JSON で `METHOD_NOT_ALLOWED`（stack trace なし）。
- **CORS**: **`Access-Control-Allow-Origin` 等は一切レスポンスへ載せない**（許可リスト定数も空：`CONTROL_CENTER_LOCAL_API_CORS_ORIGINS_V1_DENYLIST`）。**V1.5** で token / Origin とセットで検討。

---

## 6. エラー形式（JSON）

成功時以外の **読取失敗**（内部エラー／契約検証失敗など）は、次の形に収める。**stack trace と secrets と raw body を載せない**。

```typescript
interface ControlCenterLocalApiErrorEnvelope {
  ok: false;
  reasonCode: string;
  reason: string;
}
```

HTTP コードは実装および `local-api-server.test.ts` で固定済み：**404**（未知パス）、**405**（不正メソッド／HEAD・OPTIONS で本文無し）、**500／507**（内部エラー／Snapshot サイズ上限）。**secrets／stack を本文に載せない**。

---

## 7. レスポンスサイズ・件数

| 項目 | 方針（候補・実装時にコード定数へ） |
|------|-------------------------------------|
| Snapshot 本体 | **最大 ~512KiB** 目安。超える場合は **Provider 側で要約**または分割を検討（実装 Goal）。 |
| 一覧類 | summary **件数のみ**（既に Provider／Summary レイヤが正）。長文フィールドは **トリム**。 |
| 時系列 | **`latest*` のみ** — ログの全履歴ページングはしない。 |

---

## 8. コード正（サーバ）

| 関数 / 種別 | ファイル |
|-------------|----------|
| `startControlCenterLocalApiServer` | `src/main/ichikishima/control-center/local-api-server.ts` |
| `stopControlCenterLocalApiServer` | 同上 |
| ルート定数 | `CONTROL_CENTER_LOCAL_API_ALLOWED_ROUTES_V1` |

**シングルトン**：同一プロセスで **listen 済みサーバが複数になることは拒否**（`LOCAL_API_ALREADY_STARTED`）。

---

## 関連

- `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md`
- `CONTROL_CENTER_LOCAL_API_IMPLEMENTATION_GATE.md`
- `CONTROL_CENTER_LOCAL_API_TEST_PLAN.md`
- `CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`
- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`
- `CONTROL_CENTER_OWNERSHIP_MODEL.md`
- `HERMES_BRIDGE_OWNERSHIP_MODEL.md`
## 2026-05-07 B-1 Cleanup Addendum

- Canonical Electron IPC is `controlCenter.readonly.getAppSnapshot`.
- Legacy `controlCenter.readonly.getSnapshot` is retired and must not be used as a new wire contract.
- Local API work must not bypass the sanitized AppSnapshot guard or expose raw `allowedApis` / `forbiddenApis` arrays.

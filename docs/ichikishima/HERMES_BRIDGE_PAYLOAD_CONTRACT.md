# Hermes Bridge — Payload Contract（実本体接続前）

**位置づけ**: 実 Hermes ランタイムは **まだ接続しない**。本書は Hermes が送ることを **想定する JSON ペイロード**の形状・検証・失敗モード・`partial` 許容条件を固定する。物理経路は **将来の IPC/メッセージ**となるが、このリポでは **関数 `validateHermesBridgePayload`** のみ提供し、expose しない。

**正コード**: `src/main/ichikishima/hermes/hermes-bridge-payload.ts`  
**関連**: `hermes-bridge.ts` (`HermesBridgeOperation`)、`hermes-local-pilot.ts`。

---

## 1. 想定される Hermes からの Payload（v1）

`payloadSchemaVersion: "hermes-bridge-payload/v1"` のオブジェクト（定数 **`HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1`** と厳密一致）。**フラット字面 `"v1"` は旧値として拒否**（Control Center の `ipcBinding.payloadSchemaVersion: "v1"` とは名前空間が異なる）。

Hermes が将来送る **`task メタ情報 + requestedOperations`** のみを受け付ける。**projectRoot・zoneRoot・承認キュー保存先などはサーバ側コンテキスト**で結合され、Hermes が直接渡さない（混線防止）。

| フィールド | 必須 | 型 | 備考 |
|------------|------|-----|------|
| `payloadSchemaVersion` | はい | `"hermes-bridge-payload/v1"` のみ | それ以外・欠落・旧 `"v1"` は拒否 |
| `taskId` | はい | string | 長さ上限・許容文字セットはコード定数参照 |
| `title` | はい | string | 同上 |
| `description` | はい | string | 同上 |
| `actor` | はい | 列挙 | `hermes` / `user` / `ichikishima` / `system`。不明値は拒否 |
| `requestedOperations` | はい | Hermes が宣言する operation オブジェクトの配列 | **`HermesBridgeOperation` と同種の判別構造**。未知 `kind` は拒否 |
| `interactionMode` | 任意 | `"dry_run"` \| `"production_stub"` | 省略時 **`production_stub`（既定 fail-closed 寄り）** |
| `allowPartialOnForbidden` | 任意 | boolean | `partial` の前提条件の一つ（後述）。実運転では明示しない場合 **false とみなす** |
| `continueAfterForbiddenClassification` | 任意 | boolean | Local Pilot が「forbidden 後も分類だけ続ける」フラグ。**dry-run と ichikishima と組み合わせのみ想定** |
| `dryRunContinuationMode` | 任意 | `"mixed_forbidden_audit"` のみ許可値 | **Sandbox/dry-run 専用**: memory/secrets/forbidden と安全系を同一メッセージに混在させ、`partial` で監査のみ完走する **明示ラボモード**。本番運用ペイロードでは送信禁止 |
| `sampleInputRelativePath` | 任意 | string | Zone 相対のみ。異常パスは拒否 |
| `outputRelativePath` | 任意 | string | 同上 |

---

## 2. 許可操作（許可リスト内）

Bridge レイヤでの **allowed_zone_candidate**: `zone_read` / `zone_write`（`routeHermesOperation` に準拠）。

---

## 3. Approval を要する Operation（自動実行しない）

- `blocked_zone_sensitive`: delete / exec / network / git（スタブ経由〜キュー）。
- `bridge_requires_approval`: `dependency_install`（`approval_queue`）、`external_ai_escalation`。

---

## 4. Forbidden Operation

`forbidden_boundary` に分類される種別および `dependency_install` + `policy_blocked`。詳細理由コードは `hermes-bridge.ts` と同一。

---

## 5. Unknown Operation

ペイロード内のオブジェクトが **未知の `kind`**、または **`kind` 欠落／型不正** を含むとき **拒否**（unknown operation。**fail-closed**）。

---

## 6. Malformed Payload

JSON でない、`payloadSchemaVersion` 欠落または **`hermes-bridge-payload/v1` と一致しない**（旧フラット `v1` 含む）、必須フィールド欠落、型不正、`requestedOperations` が配列でない、許容外フィールドのみのオブジェクトなど **最初の論理エラーで拒否**。実装は **`validateHermesBridgePayload`** がエラーコードを返す。

---

## 7. Required fields

`payloadSchemaVersion`, `taskId`, `title`, `description`, `actor`, `requestedOperations`（空配列可）。

---

## 8. Optional fields

§1 の表の任意列。未定義時の既定はコードで固定（省略は「本番側で partial を許さない」と解釈しうる）。

---

## 9. max operations

既定 **32**。`HermesBridgePayloadValidationOptions` で上書き可。超過時 **`OPERATIONS_LIMIT_EXCEEDED`**。

---

## 10. max payload size

UTF-8 バイト長で **規定オブジェクト／文字列シリアライズ**に対して測定。既定 **65536**。超過時 **`PAYLOAD_SIZE_LIMIT_EXCEEDED`**。

---

## 11. Timeout 方針（本契約の範囲）

v1 では **ネットワーク I/O を伴わない検証のみ**。キュー側の TTL・処理試行上限・容量は **`HERMES_BRIDGE_RECEIVER_QUEUE.md`** と `HermesBridgeInMemoryReceiverQueue` に最小固定。検証関数は **同期的に返す／ブロックする外部 I/O を持たない**。

---

## 12. Loop 制御（本契約の範囲）

Hermes が **連続 Payload** を送出する際は、インメモリ受信キュー側で **`maxProcessingAttemptsBeforeDead`** および **`DUPLICATE_TASK_ID_ACTIVE`** でループ過多と二重処理をブロックする。ユーザー承認キュー側の単時間あたり件数などは別経路。**本検証関数は 1 メッセージのみ**を扱う。

---

## 13. partial 許可条件（明示のみ）

すべて満たすとき **`partialEligible === true`** になりうる（それでも **自動実行しない**）。

- `interactionMode === "dry_run"`
- `actor === "ichikishima"`
- `allowPartialOnForbidden === true`
- `requestedOperations` の少なくとも 1 件が `routeHermesOperation` で **forbidden_boundary**
- **`dryRunContinuationMode === "mixed_forbidden_audit"` が必要な Forbidden**（memory_db / mt5 / env_secret / production / raw / policy_blocked dependency 等）は、**検証側で許可しない**。これらのみを含む通常 dry-run メッセージは **`partialEligible === false`**（fail-closed）
- Sandbox **シナリオ E のみ**: `dryRunContinuationMode: "mixed_forbidden_audit"` を **明示したラボ Payload** で、上記 Forbidden が混ざっても **分類のみ `partial`** を許容（コードと Vitest が固定）

**本番運用（`interactionMode !== "dry_run"` または `production_stub`）**: 原則 **forbidden 検知後は Pilot は `failed`（早期または分類のみ fail-closed）**。`allowPartialOnForbidden:true` があっても **Hermes-origin の本番運用 Payload では `partialEligible` は true にしない**（将来オーケストレータで緩める場合も **人手ゲート別 SPEC**）。

---

## 14. Fail-closed 方針

- unknown operation → **拒否**
- malformed → **拒否**
- required 欠落 → **拒否**
- secrets / token-like / `.env` 参照相当のペイロード本文 → **拒否**（`SUSPICIOUS_CONTENT`）。**補足**: `payloadLooksSuspicious` は `JSON.stringify` 後の文字列を見る。改行は JSON 上 **`\\n`（バックスラッシュ + n）** になるため、`"...nPASSWORD=..."` のように **`\b` だけでは拾えない**ケースがある — **`\x5cnPASSWORD=` 等のパターンで補足**する（Adapter / ingress 前段の fail-closed と整合）。
- **実行しない**検証のみ。raw fs は **検証関数内でも呼ばない**
- **Hermes-facing 本番想定 Payload**: **`partialEligible` は常に false**（ドライランおよび ichikishima の明示ラボ除く）

---

## 15. validated のログ・UI・Control Center Snapshot への伝搬（契約）

**Inbound の raw JSON 文字列全文**は **ログ・監査・UI・read-only Snapshot へ載せない**（キューのみならず、**恒久保存にも向けない**。実装詳細：`HERMES_BRIDGE_RECEIVER_QUEUE.md` / **`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`**）。

| 項目 | 必須 |
|------|------|
| `validated` を **オブジェクトごと Snapshot API やコンソールに渡す** | **禁止**（内部処理向けのみ） |
| `title` / `description` | **表示・永続・Snapshot に載せる前にマスク再利用**（`maskAuditSensitiveText` など既存監査ポリシーに準拠） |
| `zone_write.content` 等ファイル本文相当 | **Audit JSONL に入れない**・Snapshot に載せない（パス／結果ラベルのみ） |
| Approval Queue 保存 | **必要最小 summary** のみ |
| Secrets ヒューリスティック | 受理前 **`SUSPICIOUS_CONTENT`**。通過済みでも **伝搬段でのマスク**を怠らない（fail-closed 寄り） |

実運用での **実 Hermes 接続可否の前ゲート**：`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md` §16。

---

## 関連

`HERMES_BRIDGE_FINAL_REVIEW.md`、`HERMES_BRIDGE_OPERATION_MATRIX.md`、`HERMES_BRIDGE_PILOT_SPEC.md`、`HERMES_BRIDGE_RECEIVER_QUEUE.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`、`HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`、`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`。

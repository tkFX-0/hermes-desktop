# Hermes Bridge — In-memory Receiver Queue（実本体接続前）

**位置づけ**: 実 Hermes との **IPC/HTTP/listen は未配線**。`HermesBridgeInMemoryReceiverQueue` は **`validateHermesBridgePayload`** 済みの正規ペイロードだけを FIFO に載せ、`dequeueOrUndefined` と `acknowledgeHandled` で **試行／TTL／上限** を制御する。永続・外部送信・生 JSON の長期保持なし。

**正コード**: `src/main/ichikishima/hermes/hermes-bridge-receiver-queue.ts`  
**契約との関係**: `HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`hermes-bridge-payload.ts`（`payloadSchemaVersion` は **`hermes-bridge-payload/v1`** のみ。フラット **`"v1"`** は受信側でも拒否）。

---

## 1. schemaVersion（v1 固定）

- 受領オブジェクトまたは JSON テキストを parse 後、`payloadSchemaVersion` が **`HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1`** と **厳密一致**しなければ **`UNSUPPORTED_SCHEMA_VERSION`** で拒否（未知・旧フラット字面は fail-closed）。

---

## 2. Lane（本番フェイルクローズ / ドライラン実験室）

| Lane | `interactionMode` | partial / continuation ノブ |
|------|-------------------|-----------------------------|
| `production_fail_closed` | **`dry_run` 禁止**。省略は validator 側 `production_stub` | `allowPartialOnForbidden` / `continueAfterForbiddenClassification` / `dryRunContinuationMode` のいずれかが真・定義 → **拒否（LANE_REJECTED）** |
| `dry_run_lab` | **`dry_run` 必須** | ペイロード内のフラグと `partialEligible` は **Payload 契約**に従う（本キューでは Lane 側で許可増幅しない） |

---

## 3. Fail-closed 拒否（受理前）

代表的なコード（詳細は `HermesBridgeReceiverRejectReason`）:

- `MALFORMED_OR_PARSE` — JSON 無効・ルート不正
- `PAYLOAD_OVERSIZED` — `inboundMaxUtf8Bytes` 超過
- `UNSUPPORTED_SCHEMA_VERSION` — v1 でない／欠落
- `VALIDATION_FAILED` — `validateHermesBridgePayload` 失敗
- `DUPLICATE_TASK_ID_ACTIVE` — pending / `in_flight` に同一 `taskId`
- `QUEUE_CAPACITY` — `maxQueueItems` 到達
- `LANE_REJECTED` — Lane 規則抵触

受理後のみ `buildHermesBridgeReceiverEnvelope` 相当の **短文 fingerprint / tier カウント / kind 並び（本文・ zone_write の内容は載せない）** を返せる。

---

## 4. 保持しないもの

- 受理済み dequeue オブジェクトにも **Inbound raw JSON の文字列フィールドは付与しない**。内部ストレージも **`validated`** のみ短命保持、`completed_ok`／`discard_permanent_failure`／期限切れ prune で splice 済み項目から削除。
- secrets は保持しない。**秘密らしき短文**検出は Payload 側 `SUSPICIOUS_CONTENT`。

---

## 5. TTL・Retry・Timeout（最小）

既定（`HERMES_BRIDGE_RECEIVER_QUEUE_DEFAULT_LIMITS` で上書き可）:

- `messageTtlMs` — メッセージ単位 TTL。期限切れ `pending` / `in_flight` は **`pruneExpired`** で削除（fail-closed 破棄）
- `maxProcessingAttemptsBeforeDead` — dequeue ごとに `processingAttempts` を増加。`transient_retry` がこの上限に達すると **`dead_exhausted`** としキューから除去
- dequeue は **処理可能な pending**だけを昇順検索。**同期 API のみ**。外部 I/O なし

---

## 6. 表示・ログ・Snapshot への伝搬（契約）

**validated ペイロードをログ・UI・Control Center Snapshot へ丸ごと渡さない**。raw JSON wire 全文も載せない。詳細 **`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`** と **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15**。

---

## 関連

`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`、`HERMES_BRIDGE_FINAL_REVIEW.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`

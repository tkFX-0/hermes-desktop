# Hermes Bridge — Receiver Queue 契約（表示・伝搬・保存）

**位置づけ**: `HermesBridgeInMemoryReceiverQueue` の **技術詳細（FIFO・API）**は **`HERMES_BRIDGE_RECEIVER_QUEUE.md`** を正とする。本書は **運用／契約**として「何をどこまで渡してよいか」を固定する。**実 Hermes 未接続でも遵守**すること。

---

## 1. 保持の契約

| 種別 | ルール |
|------|--------|
| Inbound raw JSON（wire 全文） | **キューおよび永続ログに長期保存しない**。受理処理のために **短命スタック／局所変数のみ** で十分。 |
| `validated` 構造体 | メモリ内の **正規オブジェクト**。**完了後も「フルオブジェクト」をログへ JSON.stringify しない**。 |
| `title` / `description` | 検証済みでも **秘匿・ヒューリスティック済みとは限らない**。**UI・Snapshot・audit 直行前に再マスク**（`maskAuditSensitiveText` 方針に準拠）。 |
| `zone_write.content` | **ログ・audit JSONL・Control Center Snapshot へ書かない**（種別・相対パス・結果ラベルのみ）。 |

---

## 2. dequeue / envelope の契約

- **`buildHermesBridgeReceiverEnvelope` レベルの短文**（fingerprint、tier 数、kind 並び・件数）のみが **外向き説明用途のデフォルト**。
- dequeue で返す `validated` は **プロセス内部の実行エンジン向け**。**renderer / preload / Snapshot API の引数にそのまま渡さない**。

---

## 3. Receiver と Control Center Snapshot

- Snapshot に載せてよいのは **`getControlCenterReadonlyData` が既に採用しているような summary メタ**（readiness・件数・短い diagnostic）と整合すること。
- **Hermes ingress のペイロード全文を Snapshot に複製しない**。

---

## 4. Retry / TTL / 上限との関係

- **fail-closed 破棄**（TTL 切れ、`dead_exhausted`）は **「処理不能」を明示**することを優先。外部に **生ペイロードを残さない**。

---

## 5. Secrets

- Ingress 側 **`SUSPICIOUS_CONTENT`** を **優先**。  
- 「validator を通過した」のに **credential 様文字が残っている**場合も、**伝搬段でマスク**する（誤検知より漏えい回避を優先）。

---

## 6. Stage 0 Connection Adapter からの enqueue（実 Hermes なし）

- **`hermes-connection-adapter.ts`**: Adapter が **受理した**結果だけを `HermesBridgeInMemoryReceiverQueue.submitInbound` へ渡せる。lane 不整合は **`LANE_REJECTED`**（fail-closed）。
- **禁止**: Adapter の `summary` や Control Center 向け `hermes-bridge-readiness-summary` に **validated 全文・raw JSON wire** を載せない（§1・`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15 と同一）。
- **次**: Stage **1 sandbox file handoff** は **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`**（§7）。

---

## 7. Stage 1 Sandbox File Handoff からの enqueue（実 Hermes なし）

- **`hermes-file-handoff-adapter.ts`** が inbox JSON を読み **`validateHermesConnectionAdapterInput`** 後、`enqueueViaAdapterLanePipeline` 経由で `submitInbound` へ。**raw ファイル全文は marker に残さない**。
- inbox 入力は **`handoff/inbox` 平坦のみ**。**marker** は短文スキーマ `hermes-file-handoff-marker/v1`。**production lane は引き続き fail-closed**。

---

## 8. Real Pilot Minimal Pipeline からの enqueue（実プロセス無し）

- **`runHermesRealPilotMinimalFromFileHandoff`** が **同一関数内**で `enqueueViaAdapterLanePipeline` を呼ぶ場合も、**§1〜§6 の伝搬禁止は同じ**。結果の **Control Center 外向け**は **`buildHermesRealPilotControlCenterSummary`**（短文・API 配列なし）経由に限る（`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`）。

---

## 関連

`HERMES_BRIDGE_RECEIVER_QUEUE.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md` §16、`HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`

# Hermes Connection Adapter — Contract（実 Hermes 接続前）

**位置づけ**: Ingress の **論理適配層**。物理経路は **実装段階（Stage）** に応じて切り替えるが、**現リポ**: Stage **0**（in-memory）および Stage **1**（sandbox file handoff）。Stage **2** onward は未実装／禁止。実 Hermes プロセス／`ipcMain.handle`／`listen` は **未定義**。  
**正コード（Stage 0）**: `src/main/ichikishima/hermes/hermes-connection-adapter.ts`  
**正コード（Stage 1）**: `src/main/ichikishima/hermes/hermes-file-handoff-adapter.ts`、`docs/ichikishima/HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`  
**関連**: `HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`。

---

## 1. Adapter の目的

- **単一 ingress として** Hermes が送りうる **wire（JSON／オブジェクト）** を受け、**`validateHermesBridgePayload` 必須**のうえで、**Receiver Queue** および **Control Center** に載せられる **短文要約のみ**へ正規化する。
- **raw JSON 全文の長期保存・ログ・Snapshot への複製禁止**は `HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md` / Payload §15 に従う。

---

## 2. 接続方式の段階（論理）

| Stage | 方式 | 現リポ状態 |
|-------|------|------------|
| **0** | **in-memory**（同一プロセス関数呼び出しのみ） | **実装済み（唯一許可された作成経路）** |
| **1** | Sandbox **ファイルハンドオフ**（Zone 相対・path-guard + inbox 直下のみ） | **実装済み**（`hermes-file-handoff-adapter.ts`、marker のみ・inbox 自動削除なし） |
| **2** | **stdin／stdout** テキスト（境界プロトコル別 SPEC） | 禁止／未実装 |
| **3** | **real Hermes process** Pilot（明示承認・Preflight Go 後） | 禁止／未実装 |

---

## 3. Stage 0 in-memory adapter

- `createInMemoryHermesConnectionAdapter()` が返すオブジェクトは **`adapterKind === "in_memory"`** のみ。
- **child_process／socket／HTTP listen／IPC チャネルを開かない**。
- **`submit` は同期 API**。外部 I/O なし（payload 検証のみ）。

---

## 4. Stage 1 sandbox file handoff（実装済み）

- **`readFileSync`** により **inbox 直下の単一 `.json`** のみ読込。ルートは **`{zoneRoot}/{handoff}/inbox`**（既定 handoff）。詳細 **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`**／`sandbox/hermes-autonomy-zone/handoff/README.md`。
- **`validateHermesFileHandoffPath`** → `checkReadAllowed`。**サブフォルダ不可**。
- **V1**: **inbox 元ファイルは削除しない**。`processed/` / `rejected/` に **`.marker.json` のみ追加**（ファイル名に **UTC タイムスタンプ**、衝突時は **`.1` 連番**。**上書き禁止**。短文・raw payload / validated 全文なし。詳細 **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md` §5–§7**）。
- **`processHermesFileHandoffPayload`** → **`validateHermesConnectionAdapterInput`** →（任意）**`enqueueViaAdapterLanePipeline`**。

---

## 5. Stage 2 stdin/stdout adapter（参考・現禁止）

- 文字列プロトコル・境界エスケープ・長さ上限を別 SPEC とする。**現コードでは拒否**。

---

## 6. Stage 3 real Hermes process pilot（参考・Preflight Go 後）

- **別 Goal**。Signoff・Preflight が **Go** のリビジョンでのみ開始。

---

## 7. まだ禁止する方式

| 方式 | 理由 |
|------|------|
| 任意ポート **socket LISTEN** | ネットワーク混線・攻撃面 |
| **HTTP サーバ追加（Bridge ingress 用）** | Local API・Bridge と混線禁止（ADR） |
| **raw shell / raw network / raw git**（実実行） | 契約上分類 forbidden／blocked の実体化は承認キュー側のみ |

---

## 8. Payload validation との関係

- Ingress のすべての wire は **`validateHermesBridgePayload`** を **必ず**通過。失敗時 **fail-closed**。
- **`payloadSchemaVersion`** は **`hermes-bridge-payload/v1` のみ**（フラット `v1` 拒否）。

---

## 9. Receiver Queue との関係

- Adapter が受理した結果は **`enqueueHermesInboundFromAcceptedAdapter`**／**`enqueueViaAdapterLanePipeline`** により **`HermesBridgeInMemoryReceiverQueue.submitInbound`** へ渡す（Stage 0 in-memory 入力・**Stage 1 file handoff が読み取ったオブジェクト**）。
- **`submitInbound`** は内部的に再度 schema／validation／lane を検証する（二重チェック）。
- **`validated payload` をキュー短文 envelope へ丸載せしない**（既存 `buildHermesBridgeReceiverEnvelope` 方針）。

---

## 10. Timeout / Retry / Loop との関係

- Adapter 自体は **状態を持った retry 機構なし**。再試行は **Receiver Queue の `messageTtlMs` / `maxProcessingAttemptsBeforeDead`**（`HERMES_BRIDGE_RECEIVER_QUEUE.md`）。
- Duplicate `taskId` は Queue 側拒否。

---

## 11. Output 制限

- Adapter の **外向け `HermesConnectionAdapterSummary`**：**taskId は短縮または prefix のみ可**、tier カウント短文、エラーは **`code` 列挙のみ**（本文バルクなし）。
- **raw stdout／wire 全文のフィールドは Result に載せない**。

---

## 12. Fail-closed 方針

- **unknown／unsupported Adapter kind → 受理しない**。
- **validation 失敗 → 受理しない**。
- **Secrets ヒューリスティック NG → 受理しない**（`SUSPICIOUS_CONTENT`）。

---

## 13. validated payload の伝搬禁止

- **`enqueuePayload`**（accepted 分枝）は **`HermesBridgePayload` オブジェクトのみ**であり、ログ・Audit・Control Center に **そのまま JSON stringify しない**。**要約関数**経由のみ外部化する（`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md` と整合）。

---

## 14. 実 Hermes 接続時の停止条件

- **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`** の停止条件へ従う。Adapter は **自動 Go を意味しない**。

---

## 15. Signoff が完了するまで進めない領域

- **Stage 3 実プロセス Pilot**。**stdin/stdout を開く実装**。**preload／`ipcMain.handle` での Bridge 入力公開**。**Hermes とアプリ本体の自動常駐接続**。  
→ Signoff／Preflight **Go** と **明示別 Goal承認** まで着手しない。

---

## 16. Real Pilot Minimal Pipeline（統合オーケストレーション・実プロセス無し）

- **契約**: `HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`。**Stage 1 handoff** と **Adapter / Receiver** を **同一パイプライン**に載せるのみ。**`hermes-real-process-adapter.ts` は常時 disabled**。**実 Hermes 接続 READY ではない**。

---

## 関連

`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`、`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`、`NEXT_GOALS.md`

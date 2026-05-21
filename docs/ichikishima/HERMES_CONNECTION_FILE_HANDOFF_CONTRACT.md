# Hermes Connection — Stage 1 Sandbox File Handoff Contract

**位置づけ**: 実 Hermes 未接続のまま、`sandbox/hermes-autonomy-zone` 内に **人手で置いた JSON** を Bridge ingress として読み込み、**`validateHermesBridgePayload` →（任意）Receiver Queue** まで通す。**Stage 2 stdin/stdout は禁止**。  
**正コード**: `src/main/ichikishima/hermes/hermes-file-handoff-adapter.ts`  
**親契約**: `HERMES_CONNECTION_ADAPTER_CONTRACT.md`。

---

## 1. Stage 1 の目的

- 将来 Hermes が提示する payload 形を **ファイルとして固定し**、Vitest／手動で **同じ検証パイプライン**を回す。
- **プロセス起動・IPC・HTTP listen・外部通信なし**。

---

## 2. Stage 0 in-memory との違い

| 項目 | Stage 0 | Stage 1 |
|------|---------|---------|
| 入力 | メモリ上オブジェクト | Zone 内 **inbox の単一 .json ファイル** |
| I/O | なし | **`readFileSync` / `writeFileSync`（marker のみ）** |
| 元ファイル | — | V1 では **削除・移動しない**（inbox に残す） |

---

## 3. 許可するファイル配置

- **`{zoneRoot}/handoff/inbox/`**（既定 `handoffRelativeDir === "handoff"`）の **直下** のみ。**サブフォルダ不可**。
- `zoneRoot` は Autonomy Zone ルート（例: `sandbox/hermes-autonomy-zone` の実パス）。
- Vitest は衝突回避のため `handoffRelativeDir: tmp/handoff-vitest-{id}` など **Zone 内の別ディレクトリ**を許容する設計がよい。

---

## 4. 入力 JSON ファイル名の例

- `task-001.json`
- `pilot-sample.json`

**禁止例**: `.env.json` のように **ファイル名が `.` で始まる**もの（実装で拒否）。`api_key.json` は **denylist 部分一致で拒否**されうる。

---

## 5. 出力 marker ファイル名（V1）

- 受理（例）: `handoff/processed/{stem}.accepted.{YYYYMMDD-HHmmss.utc}.marker.json`
- 拒否（例）: `handoff/rejected/{stem}.rejected.{YYYYMMDD-HHmmss.utc}.marker.json`

`stem` は inbox ファイル名から `.json` を除いた基底名。`{YYYYMMDD-HHmmss.utc}` は **`Date` を UTC とみなした** `YYYYMMDDHHmmss`（区切りは日付と時刻の間が **`-`**）。

### 5.1 Marker collision policy（上書き禁止）

- **同名の確定済み marker は上書きしない**。監査・再試行のたびに **別ファイル**を追加する。
- 同一 `stem`・同一状態（`accepted` / `rejected`）かつ **同一 UTC タイムスタンプ**で競合するときは、確定ファイル名のタイムスタンプ部分に **`.1`、`.2`、… の連番**を付ける（実装は `HANDOFF_MARKER_COLLISION_MAX_ATTEMPTS`（既定 **1024**）まで試行。超過は **`HANDOFF_MARKER_PATH_COLLISION`** で **安全側失敗**）。
- **`.partial` 候補**が既に存在する場合も、そのパスは「使用中」とみなし **別名を割り当てる**（上書きしない）。
- marker 本体のペイロードは **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15 と整合**：**raw ingress JSON 全文・validated オブジェクト全文を複製しない**（`taskId` や `reasonCode`、`status`、短文 summary 程度に留める。**secrets を marker に保存しない**）。

---

## 6. 原子性方針

- marker 書き込みは **`.partial` 一時ファイル → `rename` で確定**（同一ファイルシステム上のベストエフォート）。

---

## 7. 失敗時・残留ファイル

- **inbox の入力 JSON は削除しない**（人手が再試行・監査可能にする）。
- marker のみ `rejected/` に追加し、**短文 summary + error code** のみ。

### 7.1 Inbox / marker のクリーンアップ Runbook（V1 — 人手のみ）

- **V1 では inbox を自動削除しない**。デバッグ・再現性のため。
- **`processed/` / `rejected/` の marker は監査用に残す**（自動 purge しない）。
- **inbox に secrets・`.env` 相当・API キー・トークン・生ログ全文を置かない**。
- **不要になった ingress JSON は、処理完了を確認したうえでユーザーが手動削除**。誤削除防止のため、**自動 cleanup コマンド・定期スクリプトの実装・自動実行は別 Goal**（本契約の V1 では禁止）。
- 大量ストレージが気になる場合も、**方針決定と削除は人手**（Runbook の範囲を超える自動化は Preflight / Signoff 後に切り出す）。

---

## 8. ファイルサイズ上限

- 既定 **65536 UTF-8 バイト**（`HERMES_BRIDGE_PAYLOAD_DEFAULT_LIMITS.maxPayloadUtf8Bytes` と整合）。超過は `HANDOFF_FILE_TOO_LARGE`。

---

## 9. schemaVersion

- **`hermes-bridge-payload/v1` のみ**。欠落・未知・フラット `"v1"` は **拒否**。

---

## 10. payload validation

- **`validateHermesConnectionAdapterInput`（内部で `validateHermesBridgePayload`）** を必ず通す。

---

## 11. secrets / .env 風

- Bridge 層の **`SUSPICIOUS_CONTENT`** 等で **拒否**。marker に **raw 本文や全文 JSON を複製しない**。

---

## 12. raw payload の伝搬禁止

- **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15 / `HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`** に従う。marker・summary・ログ用 `summarizeHermesFileHandoffResult` は **短文のみ**。

---

## 13. 実 Hermes

- **起動しない**。child_process／socket／listen しない。

---

## 14. Stage 2 stdin/stdout

- **未実装・別 Goal**。本契約の範囲外。

---

## 15. サンドボックス側 Runbook の正

運用手順の短い一覧は **`sandbox/hermes-autonomy-zone/handoff/README.md`**。本ファイルの §7.1 が契約上の拘束力を持つ。

---

## 16. Real Pilot Minimal Pipeline（オーケストレーション・実プロセス無し）

- **契約**: `HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`。**本契約の ingress**を起点に **Receiver / Bridge Pilot / 承認・監査**までを **コードで一括**試す。**実 Hermes READY ではない**。

---

## 関連

`HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`

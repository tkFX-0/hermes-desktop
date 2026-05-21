# Hermes 実接続 Pilot — 最小スコープ定義（まだコード実装しない前提の境界）

**位置づけ**: **実 Hermes 本体の起動・IPC 実装・HTTP listen は別 Goal**。本書は **最初の実接続試行で許される挙動の上限** を **文書のみ**固定する。**Preflight**：`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`。

---

## 0. 準備コード（実再接続の前段・2026-05-03）

- **Real Pilot Minimal Pipeline**：`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md` / `hermes-real-pilot-minimal.ts`。**Stage 1 sandbox file handoff 起点**で **Receiver Queue / Local Pilot / Approval / Audit / Review** までの **同一オーケストレーション**。**主経路では実 Hermes プロセス起動なし**。`hermes-real-process-adapter.ts` は **ミニ実装・既定 `disabled`**（`execFile` のみ・短命）。**本書 §1 以降の「実接続」挙動とは別レイヤ**。
- **Windows / NousResearch 本流（2026-05-05）**：**ネイティブ Windows `hermes.exe` を仮定しない**。**WSL2 + `wsl.exe` + WSL 内 wrapper** が Controlled Pilot の本命候補（`ADR_REAL_HERMES_WSL2_CONNECTION.md`、`HERMES_WSL2_WRAPPER_CONTRACT.md`）。**`--mode bridge-payload-once` の公式 CLI 対応は未確認** — 直叩き前に wrapper／仕様確認 Goal。

### 0.1 Process Adapter Final Gate（安全枠・Controlled Run 前に必須）

- **`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`** — **`execFile` 安全枠とゲート**。**SIGNOFF §12** と **Entry E-25**。**Controlled Pilot Run** の直前でも **再適用**。
- **任意の実バイナリ起動・常駐**は **ユーザー明示の別 Goal**（例: **Real Hermes Process Adapter Controlled Pilot Run**）のみ。

### 0.2 Controlled Pilot — 実機前準備のみ（オブジェクト）（2026-05-03）

**実機起動・`execFile` は未実行**。実行仕様受け皿、Runbook、許可テンプレ、結果報告テンプレ、および **検証のみ** の `hermes-controlled-pilot-config` / `-preflight` / `-summary` がリポジトリにある状態。**ユーザーが実行パスと signoff 等をすべて提示するまで進めない**。

---

## 1. 実 Hermes から受けてよいもの（ingress）

- **JSON メッセージ 1 件ずつ**：`payloadSchemaVersion: "hermes-bridge-payload/v1"` と **`HermesBridgeOperation` 判別可能なリスト**のみ。
- **Unknown / malformed**：**拒否**（fail-closed）。
- **物理ファイルの直送**：**不可** — パスは **Zone 相対**でサーバ側が解決（既存 path-guard）。

---

## 2. 最初のタスク（候補・最小）

1. **`sandbox/hermes-autonomy-zone/sample/input.txt`** を **zone_read**（許可リスト内のみ）。
2. **`sandbox/hermes-autonomy-zone/output/hermes-real-pilot-result.txt`** に **短文**を **zone_write**（事前定義テンプレ、secrets 無し）。
3. **変更レポート**文字列を生成（**外部自動送信しない**）。
4. **Review Mode** に渡すのは **レポートまたはサマリ**（Hermes が直接 Review API を叩く実装は本書の範囲外）。
5. **`saveAuditLog`** — **本文増幅しない**イベント。
6. **Approval Report** — **キュー自動実行なし**。必要なら **bridge_requires_approval 相当の候補のみ** JSONL に。

---

## 3. sandbox 内限定

- すべての対象パス：**`sandbox/hermes-autonomy-zone/` の Zone root 規則内**のみ（`path-guard`／`denylist`）。

---

## 4. read / write のみ（最初の論理境界）

- **許可：`zone_read` / `zone_write`**（許可リスト・safe path のみ）。
- **実 delete / exec / net / git / raw**：**試行しない**（既存 Pilot と同様、Queue または stub のみ）。

---

## 5. delete / execute / network / git

- **`blocked_zone_sensitive`** — **自動実行しない**。承認キュー **候補** に留めるのみ（将来の実行エンジンは別承認）。

---

## 6. dependency_install

- **既定：`bridge_requires_approval`**（キュー候補）または **`policy_blocked` で forbidden**。**自動実行禁止**。

---

## 7. external_ai_escalation

- **`bridge_requires_approval`**。**キューのみ**。外部 URL 送信は **本 Pilot に含めない**（コードが増える場合は No-Go）。

---

## 8. memory_db / mt5_ea_access / env_secret_read

- **`forbidden_boundary`**。**受理しない**／早期失敗。**partial で通さない**（production）。

---

## 9. 実行しないこと（本 Pilot スコープ外）

- 実削除・実 shell・実ネット・実 git。**承認済み項目の自動実行**。
- **ipcMain.handle での Bridge ingress 実装全文**。**preload/renderer 露出**。
- **新規 HTTP listener**。**外部サービスへの fetch**。**`npm install`**。

---

## 10. 成功条件

- Read／Write が Zone 規則内で完走。**payload schema 違反ゼロ**。
- **Audit / Approval が「summary のみ」の方針違反がない**（人手または後続テンプレで確認）。
- **validated payload が Snapshot に丸ごと出ていない**。

---

## 11. 失敗条件

- schema 不一致・unknown op・Forbidden が **処理された**。**secrets 露出**。**Queue 無制御ループ**。混線。

---

## 12. rollback

- **Hermes / Bridge 入力を無効化**（feature flag。**本リポでは未実装の場合は Pilot しない**）。
- 生成済み Sandbox 出力ファイル：**人手削除可**（パス SPEC 順守）。
- **JSONL は追記のみ**なので論理削除は運用側（必要なら別 SPEC）。

---

## 13. Stage 1 Sandbox File Handoff（コード・本 Pilot と独立）

- **契約／実装**: `HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`hermes-file-handoff-adapter.ts`。Zone 内 **`handoff/inbox` の単一 `.json`** → validate → （任意）Receiver Queue。**marker のみ**。**実プロセス／IPC／listen なし**。
- **本ファイル §10 の小 Pilot**（実 read/write Sandbox）とは経路が異なる：**Stage 3 Real Hermes** Pilot Goal で初めて収束させる。**Stage 2 stdin/stdout は禁止**。

---

## 関連

`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`HERMES_BRIDGE_OPERATION_MATRIX.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`

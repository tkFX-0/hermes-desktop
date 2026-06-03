# Hermes 実接続 Pilot 前 — Preflight 最終レビュー（Go / No-Go）

**位置づけ**: 実 Hermes 本体を **起動・接続しない** 段階で、次の **「実 Hermes 接続 Pilot（最小）」** に入る可否を **文書で固定**する。  
**本書は Go/No-Go 判定の運用テンプレ**。最終の **承認記録** は `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` および本書末の記録欄に残す。  
**関連**: `HERMES_REAL_CONNECTION_PILOT_SCOPE.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`、`ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`。

---

## 1. 現在の到達状態（前提）

- Hermes Bridge：**dry-run Pilot**・Payload 検証・インメモリ **Receiver Queue**（`HermesBridgeInMemoryReceiverQueue`）・`routeHermesOperation` 分類・承認キュー／監査 JSONL 経路が **設計・コード・Vitest で固定**されている（実 Hermes IPC 未配線）。
- Readiness：`getHermesBridgePilotReadiness` → **`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`** が **理論上**立てられる（`DOC_REL` 9 本・`projectRoot` 有効時）。
- Dry-run スイート：**`READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN`**（説明用ラベル）— **readiness とは独立**。`tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts` が緑であることが望ましい。
- Control Center Snapshot / Local HTTP：**Bridge の ingress 経路とは別オーナーシップ**（混線禁止）。
- **Controlled Pilot 実機前準備オブジェクトのみ（2026-05-03）**：`HERMES_EXECUTION_SPEC_DISCOVERY.md`、`HERMES_CONTROLLED_PILOT_RUNBOOK.md`、許可／結果テンプレ、config／preflight／summary コード＋Vitest。**実Hermes起動・`execFile` 実運用は未実施**。ユーザーが値をすべて揃えた **別 Goal** でのみ実機単発を検討する。
- **WSL2 接続 ADR（2026-05-05）**：`ADR_REAL_HERMES_WSL2_CONNECTION.md`、`HERMES_WSL2_WRAPPER_CONTRACT.md`。**ネイティブ `hermes.exe` 前提破棄**。**`bridge-payload-once` は公式未確認の独自契約**。

---

## 2. 実 Hermes 接続 Pilot でやること（意図）

- **最小タスクのみ**（`HERMES_REAL_CONNECTION_PILOT_SCOPE.md` 参照）：Zone 内の **read / write** に限定した **安全な短文**のやり取り、結果の **変更レポート文字列**生成、**Review Mode / Audit / Approval Report** への **サマリ粒度**の受け渡し。
- Ingress：`payloadSchemaVersion` **`hermes-bridge-payload/v1`** のみ。受信後は **Receiver Queue** ポリシー（retry / TTL / duplicate / 上限）に従う。
- **fail-closed**：schema・operation・secrets ヒューリスティック・Lane 規則に反するものは処理しない。

---

## 3. 実 Hermes 接続 Pilot でやらないこと

- 実 Hermes **常駐ワーカー**への **完全接続設計の一括完了**（本 Pilot は **最小スコープのみ**）。
- **`ipcMain.handle` / preload / renderer** による Bridge 実行系・raw API 露出。
- **新規 HTTP `listen`**、**外部通信**、**`npm install` / 依存追加**。
- **自動承認・自動実行**（delete / execute / network / git を含む）。
- **EA/MT5**、**memory DB / SQLite 本番経路**、**`.env` / API キー参照**。
- **validated payload をログ・UI・Control Center Snapshot に丸ごと載せること**（§9・`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`）。

---

## 4. Go 条件（すべて満たすとき「Go」を検討してよい）

| # | 条件 |
|---|------|
| G-01 | **`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`** がコード・`DOC_REL`・テストにより **成立しうる** |
| G-02 | **`READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN`** に相当する dry-run Vitest が **緑**（説明用文字列との整合） |
| G-03 | **`payloadSchemaVersion`** が **`hermes-bridge-payload/v1`** のみ（フラット **`"v1"`** は拒否） |
| G-04 | **Receiver Queue** が有効（インメモリ実装でも可）かつ **TTL / retry 上限 / duplicate `taskId` / maxQueueItems** が文書・コード一致 |
| G-05 | **production receiver lane** が **fail-closed**（dry_run・partial 系ノブ禁止） |
| G-06 | **partial**：production lane では partial 系ノブ **拒否**；`partialEligible` は **dry_run 明示ラボ + Payload 契約**のみ |
| G-07 | **raw Hermes/API が Renderer/preload に未露出**（grep／レビュー） |
| G-08 | **Approval Queue** — JSONL Core・パス衛生・**自動実行なし** |
| G-09 | **Audit Log** — JSONL・**本文バルクを増幅しない方針** |
| G-10 | **Review Mode** — 自動確定しない（仕様書・コード整合） |
| G-11 | **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`** — **Reviewer が承認済み**（または再レビュー計画つき保留でない） |
| G-12 | **`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`** に追補された **Preflight 項目（E-16 以降）**を満たす |
| G-13 | **Control Center Local API と Bridge ingress の混線なし**（ADR 順守） |
| G-14 | **validated payload 伝搬ルール**（§9・契約書）が **全関連 SPEC に明記済み** |

---

## 5. No-Go 条件（1 つでも該当なら Pilot に入らない）

| # | 条件 |
|---|------|
| N-01 | Signoff **未完了**または **致命的保留** |
| N-02 | Ingress **schema 不一致**（`hermes-bridge-payload/v1` 以外を受理する変更） |
| N-03 | **unknown operation** を **許容**した経路がある |
| N-04 | **forbidden が production で partial に「通過」する**運用／コード変更 |
| N-05 | **secrets が payload に残存**／**validated 全文がログや Snapshot に出る**設計・実装 |
| N-06 | **raw API 露出**（fs / child_process / 任意 URL など） |
| N-07 | **retry / timeout / loop が未制御**（Receiver 上限・キュー項目枯渇と矛盾） |
| N-08 | Control Center Local API と **Bridge ingress が混載**または **Dashboard 経由で実行入力** |
| N-09 | **実行系 IPC** が存在する（Pilot 許可範囲外） |
| N-10 | **外部通信**が Pilot 達成に **必須**になっている |
| N-11 | **`npm install` / 依存追加** が同リビジョンで **未承認**に混入 |

---

## 6. 停止条件（Pilot 開始後でも即中止）

- **schemaVersion** が **`hermes-bridge-payload/v1`** でないペイロードが検出された。
- **VALIDATION_FAILED**、`SUSPICIOUS_CONTENT`、`UNSUPPORTED_SCHEMA_VERSION` が続く。
- **Queue_CAPACITY**、`DUPLICATE_TASK_ID_ACTIVE`、`dead_exhausted` が異常頻発（設定見直し前に停止）。
- **Zone 外パス**・** forbid 種別が実行経路に入った**兆候。
- **Snapshot / ログに title・description・zone_write 本文がフル載せ**られた（伝搬ルール違反）。

---

## 7. payloadSchemaVersion

- **唯一の受入値**：**`hermes-bridge-payload/v1`**（`HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1`）。
- **拒否**：欠落・未知・旧フラット **`"v1"`**。
- Control Center Snapshot の **`ipcBinding.payloadSchemaVersion: "v1"`** と **名前空間が異なる** — 転記ミス禁止。

---

## 8. Receiver Queue

- インメモリ実装：**`HermesBridgeInMemoryReceiverQueue`**（詳細：`HERMES_BRIDGE_RECEIVER_QUEUE.md`）。
- **保持しない**：Inbound **raw JSON 全文**をキュー項目に **永続**しない。
- **保持しうる（短命）**：検証済み **`validated`** の構造体内のメタ。**ただし表示・ログ・Snapshot に丸ごとは渡さない**（§9）。

---

## 9. fail-closed 運用

- unknown / malformed / schema 不一致 → **受理しない**。
- production lane：**dry_run・partial continuation ノブ禁止**。
- Forbidden の **実行はしない**（Queue への **候補化のみ** が既存）。

---

## 10. retry / timeout / duplicate / maxQueueItems

- **`maxProcessingAttemptsBeforeDead`** + **`transient_retry`** / **`dead_exhausted`**
- **`messageTtlMs`** + **`pruneExpired`**
- **`DUPLICATE_TASK_ID_ACTIVE`**
- **`maxQueueItems`（QUEUE_CAPACITY）**  
詳細は `HERMES_BRIDGE_RECEIVER_QUEUE.md` / コード既定値。

---

## 11. partial 禁止方針

- **`production_fail_closed`** lane：`allowPartialOnForbidden` / `continueAfterForbiddenClassification` / `dryRunContinuationMode` を **受理しない**。
- **`partialEligible`** の意味・限定は **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §13** に従う。

---

## 12. Approval Queue

- Sandbox JSONL：**追記のみ**、**`autoExecutable:false` 維持**。
- 保存：**必要最小 summary**（Markdown 長文・payload 全文は保存しない方針を維持）。  
参照：`APPROVAL_QUEUE_SPEC.md`。

---

## 13. Audit Log

- **`saveAuditLog`**：Zone 検証済みパス。**レコード本文に Zone ファイル内容・Hermes payload 全文を載せない**（イベント種別・短い参照・マスク済みテキストに留める）。  
参照：`AUDIT_LOG_SPEC.md`、`maskAuditSensitiveText`。

---

## 14. Review Mode

- **自動承認しない**。変更レポート文字列は **手貼り／限定パイプ**のみ。  
参照：`ICHIKISHIMA_REVIEW_MODE_SPEC.md`（存在する場合）／Orchestrator 仕様。

---

## 15. Control Center との非混線

- **Bridge ingress** と **read-only Snapshot** は **別契約**。Local HTTP は **補助**であり Hermes を **入力デバイス**にしない。  
正：`ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`、`CONTROL_CENTER_OWNERSHIP_MODEL.md`。

---

## 16. validated payload のログ・UI・Snapshot への伝搬（必須ルール）

**丸ごと渡さない**。以下は **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` §15** および **`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`** と同一運用 intent。

| 項目 | ルール |
|------|--------|
| raw JSON（Wire） | **ログ・監査・UI・Snapshot に出さない**（キューも長期保持しない） |
| `validated` オブジェクト | **丸ごと JSON 化して渡さない** |
| `title` / `description` | 表示・永続・Snapshot へ載せる前に **マスク再利用**（`maskAuditSensitiveText` 相当の方針） |
| `zone_write.content` | **ログ・監査・Snapshot に入れない**（パス・要約のみ） |
| Control Center Snapshot | **summary／件数／ラベル・readiness メタのみ** |
| Approval Queue | **summary・短理由のみ** |

---

## 17. 実 Hermes 接続時の最小タスク範囲（参照）

すべて **`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`** に従う。代表例のみ：

1. **`sandbox/hermes-autonomy-zone/sample/input.txt`**（または同等の許可済みパス）を **read**
2. **`sandbox/hermes-autonomy-zone/output/hermes-real-pilot-result.txt`** に **短文**を **write**（内容は SPEC で固定）
3. **変更レポート**（テキスト）を生成し **Review Mode** に渡せる形式にする（全文は自動外部送信しない）
4. **Audit**：イベント種別＋短文（ペイロード／ファイル本文フル載せない）
5. **Approval Report**：キューまたはレポート経路が **自動実行しない**ことを維持

---

## 18. Preflight 判定記録（人手）

| 日付 | 判定（Go / No-Go） | レビュア | メモ・根拠条項 |
|------|---------------------|----------|----------------|
| YYYY-MM-DD | | | |

**No-Go の場合**：差分修正 → `SIGNOFF` 再確認 → **再 Preflight**。

---

## 19. Stage 0 Connection Adapter（コード・実 Hermes 未接続・2026-05-03）

- **契約**: `HERMES_CONNECTION_ADAPTER_CONTRACT.md`（Stage 0〜3、禁止経路、validated 伝搬禁止の再掲）。
- **実装**: `hermes-connection-adapter.ts` — **`in_memory` のみ**受理。**接続適配 kind** `sandbox_file_handoff` は **本モジュールの `submit` では未対応**（Stage 1 は **`hermes-file-handoff-adapter.ts` に分離**）。`stdin_stdout` / `socket` / process / HTTP / ipc は **`rejectUnsupportedHermesConnectionAdapterKind`** で拒否。**`child_process`・外部通信・socket・HTTP listen なし**。
- **検証**: すべて `validateHermesBridgePayload` を通す（unknown schemaVersion・invalid・`SUSPICIOUS_CONTENT` は拒否。JSON シリアライズ上の `\\n` 直後の `PASSWORD=` 等もヒューリスティック対象）。
- **Receiver 前段**: `validateAdapterResultForReceiverQueue` / `enqueueViaAdapterLanePipeline` — **production lane は fail-closed**（dry_run / partial 系ノブ拒否）。**validated を summary へ丸ごと載せない**。
- **Control Center 向け要約**: `hermes-bridge-readiness-summary.ts` — `allowedApis` / `forbiddenApis` **詳細配列**・validated 全文・raw payload を **返さない**。
- **Go 条件は変わらず**: **人手 Signoff / Preflight Go なしに実 Hermes 接続 Pilot へ進まない**。

---

## 20. Stage 1 Sandbox File Handoff（コード・実 Hermes 未接続・2026-05-03）

- **契約**: `HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`。サンド運用 **`sandbox/hermes-autonomy-zone/handoff/README.md`**。
- **実装**: `hermes-file-handoff-adapter.ts` — **`readFileSync` の inbox 読込のみ**。**inbox は平坦・単一ファイル**。**marker は `processed/` / `rejected/` に `.marker.json` のみ**（ファイル名に **UTC タイムスタンプ**、**上書き禁止**・衝突時 **連番**。**validated / raw を記録しない**。inbox 元は V1 **削除しない**。**inbox / marker の自動クリーンアップなし** — `HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md` §5–§7）。
- **`path-guard` + denylist**、サイズ上限、JSON オブジェクトルートのみ、**Bridge validate 必須**。
- **Receiver**: `enqueueViaAdapterLanePipeline`（Stage 0 と同一キュー規律）。
- **次**: **stdin/stdout（Stage 2）は禁止維持**。**Real Hermes Process Adapter** は **ミニ実装済み**（**`execFile` のみ**・allowlist・timeout・出力上限・**既定 `disabled`**）。**人手二重ゲート**（`humanSignoffConfirmed` / `enableRealProcessExecution`）なしでは **実行しない**。**Real Pilot Minimal Pipeline**（`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`、`hermes-real-pilot-minimal.ts`）の **主経路**は **Stage 1 handoff 起点のオーケストレーション統合のみ**で **実プロセス起動は含まない**（**Ingress exec** は任意・別 API）。

---

## 21. Real Pilot Minimal Pipeline（オーケストレーション・実 Hermes 未接続・2026-05-03）

- **契約**: `HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`。
- **実装**: `hermes-real-pilot-minimal.ts` — **handoff inbox → Adapter → Receiver Queue（`production_fail_closed` 既定）→ `runHermesLocalPilotTask` → Approval / Audit / Review / Report → handoff marker**。**主経路では `child_process` / Node `spawn`・`exec` 不使用**（**`execFile` は `hermes-real-process-adapter.ts` の任意 ingress のみ**）。
- **要約**: `hermes-real-pilot-summary.ts`、`buildHermesRealPilotControlCenterSummary` — **allowed/forbidden API 詳細配列・raw/validated を載せない**。
- **アダプタ**: `hermes-real-process-adapter.ts` — **ミニ実装・既定 `disabled`**。実 Hermes **READY／常駐運用**ではない。

---

## 22. Real Hermes Process Adapter — Final Gate（安全枠・Controlled Run 前ゲート）

- **契約**: `HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`。**`execFile` のみ**（`spawn`/`exec`/`shell` 禁止）。**`shell:true` 禁止・任意コマンド禁止・timeout/kill・stdout/stderr 上限・env/cwd 最小・process handle 非公開**などを固定。
- **Signoff**: **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §12**。**Entry**: **E-25**。**Controlled Pilot Run** へ進む前に **再読・再チェック**。

---

## 関連文書一覧

`HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`、`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`、`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`、`HERMES_BRIDGE_FINAL_REVIEW.md`、`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`

# Hermes Real Pilot Minimal Pipeline — Contract（実 Hermes **未接続**）

**位置づけ**: Stage 1 **sandbox file handoff** の単一 ingress JSON を入口に、`validateHermesBridgePayload`（Adapter 経路）→ **`HermesBridgeInMemoryReceiverQueue`（lane 準拠）** → **`runHermesLocalPilotTask`**（Zone read/write と危険操作ブロックの分類）→ **Approval Queue / Audit JSONL** → **Review Mode** → **Approval Report（キュー化）** → **Control Center 向け短文 summary**までを **同一オーケストレーションで**試す。**主経路では実 Hermes プロセス起動・stdio・socket・HTTP listen は禁止**。**任意** ingress 経路 `runHermesRealPilotMinimalFromExecAdapter` のみ、`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md` と **`execFile` のみ**の制約下で短命 Pilot を許容する。  
**正コード**: `src/main/ichikishima/hermes/hermes-real-pilot-minimal.ts`、`hermes-real-pilot-summary.ts`、`hermes-real-process-adapter.ts`（**既定 `disabled`**、`execFile`・ゲート二重フラグ）。  
**関連**: `HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`HERMES_CONNECTION_ADAPTER_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`。

---

## 1. 目的

- 人手が Zone `handoff/inbox` に置いた **`hermes-bridge-payload/v1` JSON** について、Ingress 〜 承認・監査・レビューの **論理チェーン全体** を **ひとつの API** で回し、運用検証する。
- **主経路（file handoff）では `child_process` / spawn / Hermes バイナリ起動 に進まない**まま、「接続直前」の振る舞いを固定する（**Ingress exec** は **`execFile` のみ・別項**）。

---

## 2. 今回の到達点

- 「Real Hermes がいない」状態で **end-to-end 相当**の **最小パイプラインがコードで再現できる**こと。
- **Real Hermes Process Adapter** は **`hermes-real-process-adapter.ts` のミニ実装**。**既定は `disabled`**。`enableRealProcessExecution` と `humanSignoffConfirmed` が **明示 true**、allowlist／timeout／stdout stderr 上限を満たすときのみ **`execFile`**。常駐・本番運用は **しない** と明示すること。

実 Hermes が **READY** とは書かない。実プロセス起動が **ALLOW** と見なされることもない。

**補足（2026-05-03）**: **Controlled Pilot 実機前準備** — `HERMES_EXECUTION_SPEC_DISCOVERY.md`／Runbook／テンプレ、および **実行なし** の config／preflight（`GO_READY` でも呼び出さない）／CC 向け summary モジュールを追加済み。**実バイナリ 1 回**はユーザーが必須設定と signoff を揃えた **別 Goal** のみ。

---

## 3. 入力

- **主経路**: Autonomy Zone 内の **`handoff/inbox` 直下**の **単一 `.json`** ファイルパス（`validateHermesFileHandoffPath` 準拠）。
- **補助経路**（-marker 無しの検証のみ）: 既にオブジェクトとしてある **ingress wire**。Adapter `in_memory` 検証のみ通過したものへ限定。

---

## 4. 出力

- **`HermesRealPilotMinimalResult`**: Status（完了 / partial / 失敗 / 入口拒否 / Receiver 拒否）、短文 `summaryLines`、各種カウンタ、**ingress の raw / validated を返さない**。
- **`buildHermesRealPilotControlCenterSummary`**: Control Center が将来表示するための **安全な短文要約のみ**。
- （主経路）**handoff marker** はパイプライン完了時にのみ書く（処理中間で marker を先に確定しない。失敗経路では **rejected** marker を許容）。
- **既定**は **`runRealHermesProcessAdapter`** が **`status: disabled`**。ゲート未充足は **`REQUIRES_HUMAN_SIGNOFF`** 等。stdout／stderr **全文は返さず**、`validateHermesBridgePayload` 通過済みのみ Receiver 経路へ。**`signoffEvidence`** は **短文メタのみ**（payload・env・stdio 全文なし）。**実機 1 回**は **手動／別承認**（**Controlled Pilot 実機**）。

---

## 5. 実行順序（主経路）

1. **`validateHermesFileHandoffPath`**
2. **`readHermesPayloadFromSandboxFile`**（サイズ上限・JSON オブジェクト根）
3. **`validateHermesConnectionAdapterInput`（`in_memory`、`payloadWire`）** → `validateHermesBridgePayload` 込み
4. **`HermesBridgeInMemoryReceiverQueue` に `enqueueViaAdapterLanePipeline`**
5. **`runHermesLocalPilotTask`**（payload の `requestedOperations` 等で Bridge を解釈し Zone I/O とブロック分類のみ）
6. **Approval Queue 追記候補**（成功時のみ `createApprovalReport` がキュー経路を張ることを含む。実承認実行はしない）
7. **Audit JSONL**: Pilot および（任意）enqueue 検知の短命監査イベント（validated 複製・raw 全文・secrets なし）
8. **Review Mode**（`evaluateReviewMode`）は Pilot 実装経路でレポート作成に含まれる
9. **`buildHermesRealPilotControlCenterSummary` が参照する結果**のみ外部化
10. **handoff marker 確定**

---

## 6. 禁止事項（本 Pipeline の範囲で守るもの）

実装レベルの **絶対禁止**（親リポ規約どおり）。

- **`spawn` / `exec` / `shell`**。任意コマンド列・ユーザー入力直通。
- **主経路での** Hermes **実プロセス起動**。stdio での常駐 adapter。
- **Ingress exec 以外**での **`execFile`**（許可リスト外バイナリ・ゲート無し）。
- Socket / Bridge 用途の **`listen`** / HTTP サーバ Ingress。
- `ipcMain.handle` / preload / renderer での Ingress 公開、Electron メインへの **イツキシマ恒久配線**。
- **`npm install` / 依存追加**、外向き **`fetch`/生ネットワーク/生シェル/git**、`git push`。
- EA/MT5 更改、SQLite/memory DB、`/.env`/API キー参照。
- 承認済み操作の **自動実行**。自動発話・通知。
- **raw ingress JSON 全文・validated を Result / Snapshot / summary に載せない**。
- **`allowedApis` / `forbiddenApis` の詳細配列**を Control summary に載せない（readiness は **短文ラベルのみ可**）。
- 「preflight が自動 Go」のような **誤解を招く表現**。実 Hermes READY の宣言。

許可される I/O は **Hermes Autonomy Zone ラッパー経由の read/write** と、既契約どおりの **approval/audit の JSONL 追記のみ**。

---

## 7. Stage 1 file handoff との関係

- Ingress は **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`** の **平坦 inbox `.json`** のみ。
- **inbox は V1 自動削除しない**。marker は **`HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md` §5 / §7** と整合する命名・衝突 policy。

---

## 8. Receiver Queue との関係

- **`validateAdapterResultForReceiverQueue`** と **lane（既定 `production_fail_closed`）** に従う。
- **`production_fail_closed`** では **`interactionMode==="dry_run"`** および dry-run／partial の危険ノブを **`fail-closed` で拒否**。
- dequeue 済み **`validated`** を CC/Snapshot に **丸ごと出さない** — `HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`。

---

## 9. Bridge routing との関係

- `routeHermesOperation` が **forbidden_boundary** とするもの（例: **`memory_db_access` / `mt5_ea_access` / `env_secret_read`** 等）は **実行せず**。Pilot は fail-closed 経路または（続行フラグがないとき）早期失敗となる。
- **`dependency_install`** / **`external_ai_escalation`** は **`bridge_requires_approval`** とし **Approval Queue に積むだけ**。
- **`blocked_zone_sensitive`** は autonomy stub 経由で **ブロック＋キュー候補**。

---

## 10. Approval Queue との関係

- **`requiresUserApproval: true`、`autoExecutable: false`** を崩さない。
- キュー項目は **`saveApprovalQueueItem` が返す短文監査のみ**増幅する（本文バルクは保存しない）。

---

## 11. Audit Log との関係

- **`saveAuditLog`** は **`appendFileSync` のみ**（上書き禁止は既契約）。
- Audit には **secrets・raw ingress・validated オブジェクト stringify 全文を載せない**。

---

## 12. Review Mode との関係

- `evaluateReviewMode` は **`shouldSpeak`** をこのパイプラインで **オンにしない**。発話しない。
- 入力は **`finalSummary`** 側の短文に留める。

---

## 13. Approval Report との関係

- **`createApprovalReport`** はレビュアブル短文と判定のみ。**全文バルクの外部転送対象にならない**形。

---

## 14. Control Center summary との関係

- `buildHermesRealPilotControlCenterSummary` が返すオブジェクトのみが **外向きの第一候補**。readiness は **`getHermesBridgePilotReadiness(...).label` の短文**のみ利用（API 一覧は渡さない）。

---

## 15. 成功条件

1. **production lane** で **Adapter + Receiver** が **受理**され、Pilot が **`completed` または `partial`**（forbidden 混在は契約上の production ノブが無い payload に限る）。
2. **handoff marker**（受理）が **パイプライン終端**で書ける。
3. **summary / result** に **raw payload / validated / secrets / internal 絶対パス・stdio** が無い。

---

## 16. 失敗条件

- **Path / read / Adapter 検証失敗** → **rejected_validation**、可能なら **rejected marker**。
- **Receiver lane 拒否** → **rejected_receiver**、**rejected marker**。
- **Pilot `failed`**（例: early forbidden 打切り、zone I/O 失敗）→ **rejected marker**（運用上「ingress は schema 的に壊れていないが運用失敗」も marker で表す）。

---

## 17. rollback

- 生成物は Zone 内の **output / approval / audit / handoff marker** に限定される。不要なら **人手で該当ファイルを削除**（自動 purge は別 Goal）。

---

## 18. 実 Hermes 接続へ進む追加条件

1. **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`** / Signoff / Entry の **人手 Go**。
2. **`hermes-real-process-adapter.ts` を `disabled` から実装へ差し替える別 Goal**（`child_process` はその Goal のみで限定的に検討）。
3. 本パイプラインは **Real Hermes Process Adapter 実装の前提実験**であり、**自動の接続許可を意味しない**。

---

## Readiness ラベル（誤解防止用文言）

- **`READY_FOR_REAL_HERMES_PILOT_MINIMAL_STUB`**: 本パイプラインのコードパスが利用可能。
- **「Real pilot minimal pipeline is ready with sandbox file handoff.」**
- **`NOT_READY_FOR_REAL_HERMES_PROCESS`**: 実プロセス adapter は **disabled**。
- **「Real Hermes process adapter remains disabled.」**

※ これらは **実 Hermes 接続 READY ではない**。

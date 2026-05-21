# Hermes Bridge Final Review — 本体接続前の最終設計レビュー

**位置づけ**: 実 Hermes **プロセス起動や完全接続の実装は行わない**。許可される境界のみを固定する。  
**作成日**: 2026-05-03（稼働前総点検 Goal に基づく） — **コード正・IPC 候補定数との突合: 2026-05** — **Registry IPC は `hermesBridge.registry.getReadiness` のみ（2026-05 決定）**  
**人手クローズ記録テンプレ**: `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`  
**Pilot 次段階条件**: `HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`

---

## 1. Hermes へ渡してよいAPI（許可リスト・境界のみ）

**機械可読の正一覧**: TypeScript の `HERMES_BRIDGE_ALLOWED_APIS`（`src/main/ichikishima/hermes/hermes-bridge-api-registry.ts`）。説明・運用チェックは本節の表を正としつつ、**識別子の追加／削除はコード側を先に更新**したうえで表を追随する（`docs/ichikishima/HERMES_BRIDGE_API_REGISTRY.md` 参照）。

Hermes が **Hermes-desktop のメイン Electron コードを迂回して直接 `fs` 等を使わず**、`ichikishima/autonomy-zone` と `approval` / `audit` の公開APIにのみ到達することが前提となる。

### 1.1 Autonomy Zone（Zone 境界）

| API | 役割 |
|-----|------|
| `readZoneFile` | Zone 内 safe read |
| `writeZoneFile` | Zone 内 safe write |
| `deleteZoneFile` | **実行はしない** — 明示ブロック＋approval/audit候補 |
| `executeCommand` | **実行はしない** — 明示ブロック＋キュー候補 |
| `requestNetworkAccess` | **実行はしない** — 明示ブロック＋キュー候補 |
| `requestGitOperation` | **実行はしない** — 明示ブロック＋キュー候補 |
| `createApprovalRequest` | ユーザー承認フローの候補生成 |

### 1.2 Bridge レイヤ（型・分類のみ・スタブ経由での利用を推奨）

| API | 役割 |
|-----|------|
| `createHermesBridgeTask` | タスク記述と要求操作一覧 |
| `validateHermesBridgeOperation` / `routeHermesOperation` | `forbidden_boundary` / `blocked_zone_sensitive` / `bridge_requires_approval` / `allowed_zone_candidate` の分類 |
| `createHermesBridgeReport` | 人間確認用ティア集約 |

### 1.3 Local Pilot Runner（sandbox・実本体とは別経路）

| API | 役割 |
|-----|------|
| `runHermesLocalPilotTask` | dummy read/write + ブロック系の検証のみ（Hermesランタイム起動しない） |

### 1.4 Approval Queue

| API | 役割 |
|-----|------|
| `createApprovalQueueItem` / `normalizeApprovalQueueItem` | キュー項目の生成・正規化 |
| `createApprovalQueueItemFromReport` | レポートから項目（Markdown本文は保存しない） |
| `createApprovalQueueItemFromBlockedDelete` / `…FromBlockedOperation` | ブロック結果から項目 |
| `saveApprovalQueueItem` | Zone 内 **JSONL 追記のみ** |
| `readApprovalQueueItems` | **読み取り** |

### 1.5 Audit Log

| API | 役割 |
|-----|------|
| `saveAuditLog` | Zone 内 **JSONL 追記のみ** |
| （監査イベント正規化）`normalizeAuditEvent` / `createAuditLogRecord` | 送信前の形の固定 |

### 1.6 Review / Ichikishima の公開入口（Hermes側が「評価に回す」のみ）

| API | 役割 |
|-----|------|
| `evaluateReviewMode` / `reviewHermesReport` | 変更レポート等のレビュー（自動承認しない） |
| `createApprovalReport` | Approval Report の生成 |
| `processHermesPilotResult` / `createIchikishimaDecisionPackage` | Pilot 結果の統合（発話しない・memory DBに保存しない） |

**備考**: `extractMemoryCandidates` は **候補抽出のみ**。Hermes から memory DB 更新を直接要求してはならない。

---

## 2. Hermes へ渡してはいけないAPI・パターン

| 禁止 | 理由 |
|------|------|
| raw `fs`（`readFile` / `writeFile` 等の直接利用） | Zone path-guard / denylist をバイパスする |
| raw `child_process` / shell 実行 | 実行境界の喪失 |
| raw `fetch` / HTTP クライアント / 任意ソケット | 外部通信の封じ込め不能化 |
| raw git CLI / git ライブラリ直接操作 | 意図しないリポ操作 |
| memory DB / SQLite 直接 | 秘密・履歴の集約リスク |
| MT5 / EA 本体 API | 取引境界の原則違反 |
| `.env` / APIキー / secrets の読み取り | 秘密情報漏えい |
| 本番設定ファイルの直接書き換え | 運用リスク |
| `git push` / 任意の `npm install` | 禁止境界（別プロセスであっても同様の方針） |

---

## 3. オーナーシップ・混線防止（read-only）

Hermes Bridge は **Control Center Local API（HTTP `GET /snapshot`）とは役割を共有しない**。Snapshot 集約は **`getControlCenterReadonlyData`**。Bridge は操作ルーティングとブロック／承認／監査／レビューの **候補生成**に限定する。  
論理名前空間・起動オーナーは **`ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`**、**`HERMES_BRIDGE_OWNERSHIP_MODEL.md`**、**`CONTROL_CENTER_OWNERSHIP_MODEL.md`** を読む。

---

## 4. Hermes 本体接続時の停止条件（即中断する要求）

接続実装段階で、以下の**要求が Hermes 側から来た場合は実装を止め、人間レビューに戻す**。

1. **Zone 外パス**へのアクセス要求
2. **外部通信**（任意 URL、テレメトリ、更新チェック等）を Bridge 外で行う要求
3. **git 操作**（push/pull/checkout 等）の実効実行要求
4. **依存追加**（`npm install` 等）の自動化要求
5. **MT5 / EA** への操作要求
6. **memory DB** への読み書き要求
7. **`.env` / secrets** の参照要求
8. **delete / execute / network / git** を「ブロックAPIを経由せず」実効させる要求
9. **承認キュー承認後の自動実行**（実 delete 等へ橋渡し）要求
10. **自動発話・通知・本番反映**の無人化要求

---

## 5. 接続前チェックリスト（人間が Yes と言う前のゲート）

- [ ] `READY_FOR_LOCAL_FULL_LOOP` — `runLocalPilotFullLoop` がテスト／手順で成功している
- [ ] Approval Queue — JSONL 追記・読取が Zone 内で検証済み
- [ ] Audit Log — 同上
- [ ] Review Mode — 高リスク語の検知が期待どおり
- [ ] Orchestrator — `shouldSpeak: false`、memory DB 非保存の方針がコード上維持されている
- [ ] Control Center V1 Design — read-only ステータスモデル（`buildControlCenterReadonlyStatus`）が文書化されている
- [ ] 禁止領域未接触（EA/MT5、secrets、DB、実通信）
- [ ] 外部通信なし（接続前 PoC でも raw 通信を開かない）
- [ ] DB 接続なし
- [ ] 依存追加なし（Bridge 接続のための新パッケージは別承認）
- [ ] **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`** が用意され、レビュアがチェックリストを埋められる状態である（人手承認の記録用）

## 6. 実 Hermes 接続の最小 Pilot 方針（将来フェーズ／今回は未実施）

1. **sandbox 内 dummy task のみ** — 本番パスに触れない。
2. **raw API を渡さない** — Renderer / サンドボックス化された Hermes 側からは **main プロセスが expose する allowlist のみ**。
3. **Bridge / Zone API 経由のみ** — 上表の許可リストにマッピング。
4. **危険操作は Approval Queue** — 実効はしない。
5. **変更レポートは Review Mode へ** — 自動承認しない。
6. **監査ログは JSONL 追記**（現行方針の延長）— userData 恒久化は別 Goal。
7. **自動反映なし** — 承認済みでも runner は起動しない（現行方針）。

---

## 7. 関連ドキュメント

- `HERMES_BRIDGE_CONTRACT.md`
- `HERMES_CONNECTION_PRE_REVIEW.md`
- `LOCAL_PILOT_FULL_LOOP_SPEC.md`
- `HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md`（実本体なし dry-run / 人間ゲート手順）
- `HERMES_BRIDGE_PILOT_SPEC.md`（Pilot 入力・経路・停止条件の単一 SPEC）
- `HERMES_BRIDGE_OPERATION_MATRIX.md`（操作×Disposition×テストの対応表）
- `HERMES_BRIDGE_API_REGISTRY.md`（許可／禁止定数・Registry IPC メタ運用）
- `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`（人手クローズ記録テンプレ）
- `HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`（Pilot 次段階エントリー条件）
- `CONTROL_CENTER_V1_API_CONTRACT.md`（Renderer へ渡す read-only RPC 境界）
- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`
- `HERMES_BRIDGE_OWNERSHIP_MODEL.md`
- `CONTROL_CENTER_OWNERSHIP_MODEL.md`
- `ROADMAP_STATUS.md` / `IMPLEMENTATION_GAP_ANALYSIS.md`
- コード補助（文書存在の機械チェックのみ・実接続なし）: `getHermesBridgePilotReadiness`（`src/main/ichikishima/hermes/hermes-bridge-readiness.ts`）

---

## 8. Final Review チェックリスト（コード正・2026-05 突合済み）

Vitest と型で担保できるものと、人手のみの項目を分ける。

### 機械チェック済みの主張（`tests/ichikishima/hermes/*`）

| 項目 | 状態 |
|------|------|
| Bridge Pilot Dry-run が `READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN` になりうること（ゲート文書 **9** 本＋`projectRoot` 有効） | `HERMES_BRIDGE_PILOT_SPEC.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE.md`、`DOC_REL`、`hermes-bridge-readiness.test.ts` |
| Hermes ingress `payloadSchemaVersion` が **`hermes-bridge-payload/v1`**（旧フラット `v1` 拒否）、インメモリ受信キューが Lane・TTL・重複 **`taskId`・キュー上限を fail-closed** | `hermes-bridge-payload.ts`、`hermes-bridge-receiver-queue.ts`、`hermes-bridge-receiver-queue.test.ts` |
| Hermes Payload が **unknown/forbidden/forged path/secretsヒューリスティック**を fail-closed で拒否。`interactionMode!==dry_run` では **`partialEligible` を常に抑止** | `hermes-bridge-payload.ts`、`hermes-bridge-payload.test.ts` |
| `routeHermesOperation` が read/write → **`allowed_zone_candidate`**、del/exec/net/git → **`blocked_zone_sensitive`**、dependency_install policy_blocked → **`forbidden_boundary`**、dependency_install 既定／external_ai → **`bridge_requires_approval`**、memory_db / mt5 / env_secret / raw → **`forbidden_boundary`** | `hermes-bridge.test.ts`、`hermes-bridge-pilot.test.ts` |
| Forbidden 混入時 Pilot が早期 **`failed`** になること | `hermes-bridge-pilot.test.ts`、`hermes-local-pilot.test.ts` |
| `continueAfterForbiddenClassification` が `true` のとき mixed（forbidden+blocked+bridge）が **`partial`** になり、結果 wire に **ファイル本文なし**で収束すること | `hermes-bridge-pilot-dry-run.test.ts` |
| 将来 IPC 論理チャネルが **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`（要素 1：`hermesBridge.registry.getReadiness`）** と禁止リスト **`HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`** で固定されていること（**まだ `ipcMain.handle` は実装しない**） | **`hermes-bridge-registry-ipc-candidate.test.ts`** |
| Readiness 応答が **JSON メタのみ**（関数等非シリアライズ無し） | 同上 |

### 人手のみ（運用ゲート）

| 項目 | 期待 |
|------|------|
| 実 Hermes 本体接続 | **まだ別 Goal・別承認**（本チェックリストは dry-run と設計のみ） |
| raw API の Renderer／preload 露出 | **しない** |
| Forbidden 経路・操作の開発時混入 | grep／レビューで抑止 |
| `bridge_requires_approval` 種別が Queue〜save 経路まで届くこと | Sandbox JSONL とレポート運用での確認 |
| Review Mode と Approval Report が **自動確定しない**こと | `HERMES_BRIDGE_PILOT_SPEC.md` |
| Control Center Local API と混線しないこと | **`ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`**、§3 |

### 「次に進むなら」

1. **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` に人手レビューを記録**したうえで、**Hermes Bridge Pilot dry-run 次段階 Goal** を切る（`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md` 準拠）。
2. それ以前に **preload/ipcMain が不要なコード経路のみ**増やしてよい（本書の許可リスト内）。
3. **`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md` を運用レビュー**し、**Sign-off §11（Preflight）** を確認する。**Preflight が Go** かつ **`HERMES_REAL_CONNECTION_PILOT_SCOPE.md` に合致する別 Goal の明示承認**がある場合のみ **実 Hermes 接続 Pilot（最小実装）** に進む。

---

**判定**: 本書は **設計固定用**である。実装は **別 Goal・別承認** で行う。

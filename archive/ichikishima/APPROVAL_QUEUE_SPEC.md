# Approval Queue 仕様（Core / Local Sandbox）

本書は、`sandbox/hermes-autonomy-zone/approval/` に **JSONL 追記のみ** で保持する「承認キュー本体」の動作仕様である。Hermes本体連携や実行エンジンは別Goalとする。

## 1. 目的

1. **危険操作を即実行しない** — delete / execute / network / git 等は承認が付くまで実施しない前提で、キューへ記録する。
2. **ユーザーが後から判断できる** — 状態・理由・プラン類をキュー項目として一覧可能にする（本Goalではコンソール外の UI は作らない）。
3. **Hermes / イツキシマ境界を守る** — メモリDB・本番設定・個人情報をキューへ埋め込まず、自動承認しない。

## 2. 承認キューが扱う要求種別（`actionType`）

次のような **実行要求のメタデータ** を扱う（実際の実行は後続）。

- Zone 明示ブロック系: delete / execute / network / git に相当する項目
- `dependency_install` — 依存追加（npm install 等）の実行承認リクエスト
- `approval_report_followup` — Ichikishima Approval Report 経由の後続ユーザー判断キュー（レポート Markdown 本文は保持しない）
- `external_escalation` — 外部モデルへのエスカレーション等の承認
- `memory_promotion` — memory の昇格／永続メモリ側変更のリクエスト
- `long_term_profile_update` — 長期的プロフィール更新のリクエスト
- `safety_policy_change` — 安全ポリシー変更のリクエスト

## 3. 扱わないもの

以下は本キューの責務外（自動化も禁止）。

- 自動実行、任意の自動承認、autoExecutable 相当の自動実行フラグが真になる状態
- 実 delete / execute / network / git
- 自動売買、取引データ・個人情報の保存
- 本番環境への直接反映（userData の既定キューなどは未対象）
- UI / Electron 連携の提示（本Goalではコンソール外UIなし）

## 4. 状態（`status`）

- `pending` — ユーザー判断待ち
- `approved` — **許可記録のみ**。本Goalでは実行エンジンを呼ばない。
- `rejected` — 拒否済み記録
- `held` — 保留／差戻しに近い凍結
- `expired` — TTL 運用次第で運用側が設定可能（自動遷移は本Goalでは任意・未実施でもよい）
- `cancelled` — ユーザーまたはシステムが取り消し

### 注意: `approved` の意味

`approved` は「この項目に対して実施許可が出た」という **ログ上の状態** に過ぎない。実行ランナーやHermesへの自動伝播は別Goalとする。

## 5. 不変フラグ（Core）

すべてのキュー項目は次を満たす。

- `requiresUserApproval: true` （固定／上書き不可）
- `autoExecutable: false` （固定／上書き不可）

## 6. 必須フィールド（モデル概要）

キュー項目（`ApprovalQueueItem`）は少なくとも次を保持する。

- `approvalId` — 項目の一意 ID
- `createdAt`, `updatedAt` — ISO 時刻
- `source`, `actor`, `actionType`, `status`, `riskLevel`
- `title`, `reason`, `targetPaths`, `commands`, `externalUrls`
- `expectedResult`, `rollbackPlan`, `testPlan`
- `requiresUserApproval`, `autoExecutable`
- `relatedAuditEventIds`, `relatedReportId`（省略可だが項目は用意）
- `metadata` — 公開安全なKVのみ（値は長さ制限）

## 7. 秘密情報マスク・パス規律

- 本文・コマンド・URL・パスは永続化前に **`maskApprovalQueueSensitiveText`**（監査側のマスクと整合）。
- **`targetPaths` は論理値としてのみ保持**。必要時は masked 表現のみとし、ユーザー機微パスや secrets への直書き禁止。
- キュー項目 JSON の **総バイトサイズには上限** があり、`RECORD_TOO_LARGE` 相当で拒否しうる。
- **`approved` になっても** 自動で危険操作を起動しない。

## 8. 永続化（Sandbox JSONL）

- 保存ディレクトリ: `sandbox/hermes-autonomy-zone/approval/`（Zone と projectRoot の関係・path-guard / denylist を満たすこと）
- ファイル命名: **`approval-YYYY-MM-DD.jsonl`**
- **追記のみ**（append）。上書き・truncate・unlink によるキュー削除は行わない。
- **DB・SQLite は使用しない**。読みは当該 JSONL を開いて行単位パースのみ。

### 状態更新の並び順

状態が変わるたびに **新規行として最新スナップショットを追記** する。読取側は **`approvalId` ごとの最終行が現在状態** とみなす（append-only と両立）。

## 9. 監査ログ（Audit）との連携

- **`approval_queue_item_created`** — キュー項目が新規作成されJSONLへ追記できるイベント候補。
- **`approval_queue_status_changed`** — 状態遷移に伴うイベント候補（前後状態はメタデータに保持）。

両者は **`saveAuditLog` に渡せる `AuditLogRecord` へ正規化** できることが本Goalの範囲である。Hermes が自動で **`saveAuditLog` を連鎖実行する処理は別Goal**（本Goalでは手動またはテストでの呼び出しに限定してよい）。

## 10. Approval Report・Operation Blocker からの作成

### Approval Report

- レポート Markdown 全文は保存しない。**summary 経由で短い説明のみ**。`relatedReportId` でひも付ける。
- `approve_recommended` でも **`requiresUserApproval: true`**。初期 `status` は原則 `pending`。
- `hold` / `reject_recommended` は `held` または拒否状態へ寄せ、必要なら `riskLevel` を引き上げる。

### Operation Block（delete / execute / network / git）

- `ApprovalRequestCandidate` が付与されるブロック結果から **キュー候補** を生成できること。
- ブロック関数自体が **実行を行わない** ことは変更しない。

## 11. CI / Windows junction・symlink 検証

- **通常 CI ではjunction/symlink の網羅検証は必須としない**。Developer Mode や昇格権限に依存してブレるため、手動確認または昇格済みパイプラインでの追加検証を将来オプションとする。

## 12. Out of Scope（明示）

Hermes本体完全連携、実行エンジン、自動通知/UI、SQLite/userData既定保存、自動ローテーション、クラウド送信。

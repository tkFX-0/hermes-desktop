# 監査ログ本体仕様（Audit Log Specification）

Hermes Autonomy Zone とイツキシマ Review / Approval / Memory Candidate から観測される操作について、将来 **検証可能な監査ログ** として保存するための本体仕様を定義する。

**本書の適用範囲:**

- `auditEventCandidate`（各APIが返す一時データ）から、正規の `AuditLogRecord`（保存候補）への正規化方針。
- **Local Pilot** については、`saveAuditLog` による **Hermes Autonomy Zone 内のみの JSONL 追記（append-only）** を実施する。**SQLite/memory DB を用いない。** **外部送信はしない。** **Electron userData を既定監査ログ先とはしない（将来候補）。**

関連実装参照（現在の監査イベント候補と永続レイヤーの形）:

- `src/main/ichikishima/autonomy-zone/types.ts`（`ReadAuditEventCandidate` / `WriteAuditEventCandidate` / `DeleteAuditEventCandidate` / `BlockedOperationAuditEventCandidate`）。
- **正規化・マスク・保存前チェック**: `src/main/ichikishima/audit/audit-log.ts`（`normalizeAuditEvent`、`sanitizeRecordForPersistence`、`maskAuditSensitiveText`）。
- **JSONL 追記のみの永続レイヤー（Zone 検証済みのみ）**: `src/main/ichikishima/audit/audit-save.ts`（`saveAuditLog`）。

---

## 1. 目的

1. Hermes / イツキシマの**安全境界**がどのように使われたかを、後から検証できるようにする。
2. read / write / block / approval / review / memory 候補に関する**操作の履歴**を残す（本文や秘密は残さない）。
3. ユーザーが**後から確認**できる材料を提供する。
4. **AIの自己正当化ログではなく**、入力・結果が機械的に追跡できる**操作ログ**に限定する。
5. 将来のCompliance・インシデント調査・ローカルパイロットの振り返りに耐える粒度を狙うが、過剰収集はしない。

非目的:

- アプリのデバッグ用にエラー詳細全文を載せること。
- ファイル内容やLLM応答全文の保管。
- Hermes側の恣意的な監査ログ改ざんを容易にすること。

---

## 2. `auditEventCandidate` と `AuditLogRecord` の違い

| 観点 | `auditEventCandidate` | `AuditLogRecord` |
|------|------------------------|-------------------|
| 生成元 | 各ラッパー・ブロック・承認関連APIが**その場で**組み立てる | **正規化パイプライン**が検証後に構築する |
| 寿命 | メモリ上の応答ペイロードの一部として**一時的** | **追記のみ**されたストアに載る想定の**恒久レコード** |
| `kind`（後述のイベント種別） | action + status から**導出**する（明示フィールドは必須としない） | **`kind` を必須で保持** |
| サイズ・PII・秘密 | 「含めない」前提だが実装ゆれがある | **スキーマ検証・最大長・マスク**を必ず通す |
| content | `contentIncluded: false` を維持 | **`contentIncluded: false` を必須**。本文フィールドは持たない |

正規化パイプライン（将来実装）は、最低限以下を行う:

1. 必須フィールドの検証。
2. 禁止項目の削除（混入時はログ化しないか、イベント全体をドロップし「internal_error」類は別チャネルで扱う方針を別途検討）。
3. reason / path 等への**マスク**と**長さ切り詰め**。
4. 1イベントあたりの**バイト上限**チェック。
5. 割り当てられていない場合は **`eventId` の生成または検証**（UUID v4 等）。
6. `timestamp` の ISO8601 UTC 統一。

---

## 3. 保存してよい項目（`AuditLogRecord`）

以下は「方針上、保存値に載せうる項目」であり、すべてのイベントで全てが必須とは限らない。

| フィールド | 説明 |
|------------|------|
| `eventId` | イベント一意ID（重複検知・相関用） |
| `timestamp` | 発生時刻（UTC推奨） |
| `kind` | 正規化済みイベント種別（後述の列挙） |
| `agent` | **責務コンポーネント**。実装での列挙: `hermes` / `ichikishima` / `review_agent` / `memory_agent` / `cursor_agent` / `system` |
| `actor` | 操作主体（ゾーン候補の `actor` と整合）。`agent` とは別（誰が働いたか vs ログを残す側のコンポーネント） |
| `source` | **発生元の機能区分**。実装での列挙: `autonomy_zone` / `approval_report` / `review_mode` / `memory_candidate` / `hermes_report` / `cursor_escalation` / `manual_user_action` / `system_event` |
| `status` | 処理結果の粗い区分。ゾーンの read/write は `success` / `denied` / `error`。delete / execute / network / git のブロックは **正規化後 `blocked`**（`kind` は `*_blocked`） |
| `action` | 元オペレーション（例 `read` / `write` / `approval`）。ゾーン由来では候補の `action` を引き継ぐ |
| `riskLevel` | 低〜重大のリスク評価。未設定時は正規化で既定値を割り当てうるが、**過大評価に倒す場合は明示**する |
| `reasonCode` | 機械可読な理由コード |
| `reason` | 人間向け短文。**秘密・スタック全文を含めない** |
| `normalizedPath` または `maskedPath` | どちらか一方または両方。パターンのみで十分なら `maskedPath` のみ |
| `bytesRead` | read 成功等で分かる場合のみ |
| `bytesWritten` | write 成功等で分かる場合のみ |
| `truncated` | 読み取り切り詰め等 |
| `created` | 新規ファイル作成フラグ |
| `overwritten` | 上書きフラグ |
| `deleted` | delete イベントで常に false（ブロックのみのため）など、安全上必要なフラグのみ |
| `requiresUserApproval` | ユーザー承認必須が絡むフローの場合に true を維持 |
| `approvalRequestId` | 承認要求と紐付く場合（`ApprovalRequest.requestId` 等） |
| `reportId` | 承認レポートなどの報告単位ID |
| `requestId` | 呼び出し相関用（既存 `requestId` と整合） |
| `approvalId` | Sandbox 承認キュー項目ID（短文・マスク対象になる可能性がある文字列のみ） |
| `metadata` | 限定されたメタ（キー/値とも短く、値はマスク済みのみ）。長文・レポート本体は載せない |
| `testSummary` | テスト結果の**要約**（件数・成否の集計）。詳細ログ本文は含めない |
| `contentIncluded` | **常に `false`**。true は将来も原則禁止 |

**注:** 既存の `auditEventCandidate` に無いフィールド（`riskLevel`、`agent`、`kind` 等）は、**正規化時に付与**する。

---

## 4. 保存してはいけない項目

以下は **AuditLogRecord に含めてはならない**（含まれた場合は破棄またはマスク後に再生成する）。

- ファイル **content 本文**、コード全文、ドキュメント全文。
- `.env` の内容、APIキー、トークン、パスワード、**secrets 全般**。
- **memory DB の内容**、長期記憶の**生データ**。
- **MT5 口座情報**、ブローカー口座、サーバー認証情報。
- **取引履歴**、ポジション・注文の識別子の羅列（必要なら集計のみ）。
- **個人情報**（氏名・住所・メール・電話・口座実名など）。
- ブラウザ **Cookie**、セッション識別子の生値。
- **SSH 秘密鍵**・証明書の秘密部。
- **LLM の内部思考**または chain-of-thought 相当の未公開プロンプト全文。
- スタックトレース全文、環境依存のホームディレクトリ絶対パス等の**詳細過ぎるエラー内容**。
- 承認レポート・レビューレポートの **JSON/Markdown 全文**（`reportId` と要約に留める。本文は別ストアまたはユーザー管理とし監査ログに載せない）。

方針: **検証には十分だが窃取価値は極小**となるよう、できる限りメタデータに留める。

---

## 5. 監査イベント種別（`AuditLogRecord.kind`）

ログに保存するときは、次の **`kind`** 文字列のいずれかとする（小文字・スネーク表記）。

| `kind` | 想定ソース |
|--------|-------------|
| `read_success` | read 許可済みかつ読取成功 |
| `read_denied` | read ポリシー拒否 |
| `read_error` | read の想定外エラー・I/Oエラー（詳細本文は載せない） |
| `write_success` | write 成功 |
| `write_denied` | write ポリシー拒否 |
| `write_error` | write 失敗 |
| `delete_blocked` | delete が承認またはポリシーにより実行されなかった |
| `execute_blocked` | コマンド実行がブロックされた |
| `network_blocked` | ネットワークがブロックされた |
| `git_blocked` | git がブロックされた |
| `approval_created` | ユーザー承認用のリクエストまたはレポート単位が生成された |
| `approval_queue_item_created` | Sandbox 承認キュー項目のスナップショットが append-only JSONL に追記された |
| `approval_queue_status_changed` | 承認キュー項目の状態遷移記録 — 状態文字列のみ（長文ログ・本文は載せない） |
| `review_completed` | Review Mode の判定が記録単位として完了した（本文は載せず outcome のみ） |
| `memory_candidate_created` | Memory Candidate が生成された |
| `memory_candidate_rejected` | Memory Candidate がポリシーにより却下された |
| `escalation_requested` | ローカル→クラウド等のエスカレーションが**要求された**（将来連携時） |
| `escalation_blocked` | エスカレーションがポリシーにより**阻止された** |

### 5.1 既存候補からの対応付け（実装済み Zone）

| `auditEventCandidate` | `kind` |
|-------------------------|--------|
| `action: "read"`, `status: "success"` | `read_success` |
| `action: "read"`, `status: "denied"` | `read_denied` |
| `action: "read"`, `status: "error"` | `read_error` |
| `action: "write"`, `status: "success"` | `write_success` |
| `action: "write"`, `status: "denied"` | `write_denied` |
| `action: "write"`, `status: "error"` | `write_error` |
| `action: "delete"`, `status: "denied" \| "error"` | `delete_blocked` |
| `action: "execute"`, `status: "denied"` | `execute_blocked` |
| `action: "network"`, `status: "denied"` | `network_blocked` |
| `action: "git"`, `status: "denied"` | `git_blocked` |

Review / Approval / Memory / Escalation は、**`normalizeAuditEvent` の構造化入力** で `AuditLogRecord` を構成する実装済みパスがある（キューイベントは別 `kind`。本文・全文は載せない）。

### 5.2 承認キュー連携イベント

- **`approval_queue_item_created`**: `saveApprovalQueueItem` などがキュー項目のスナップショットを保存したときのメタのみを残す。
- **`approval_queue_status_changed`**: `approved` に遷移しても自動実行しない — 状態記録のみ。実行エンジンは別Goal。

### 5.3 Windows symlink / junction 検証について

監査ログ・承認キューのパス脱出テストにおいて Windows の symlink / junction 網羅は **通常 CI で必須としない**。Developer Mode や昇格環境により挙動がブレるため、手動確認または権限付き CI を将来オプションとする。

## 6. JSONL Pilot（Hermes Sandbox）

Local Pilot で **SQLite に接続しない** 範囲では、`sandbox/hermes-autonomy-zone/audit/` の JSONL と同様、`saveAuditLog(record, SaveAuditLogOptions)` が **Hermesプロジェクト直下の Sandbox Zone 以外へは書けない**。承認キューは `sandbox/hermes-autonomy-zone/approval/`（`approval-queue-store`）で **別 JSONL に追記** するのみとし、両者は `approvalId` / `metadata.relatedReportId` 等で相関付けられる（自動連鎖実行はしない）。

後続フェーズでの userData・SQLite は **明示合意があるまでコード接続しない**。

## 7. ログ保存先候補（将来検討）

| 候補 | 用途イメージ |
|------|----------------|
| `sandbox/hermes-autonomy-zone/audit/` | ローカルパイロット専用、リポジトリ外に逃がす運用とも併用可 |
| `logs/ichikishima/audit/` | プロジェクト配下の append-only ログディレクトリ |
| 将来の **SQLite または専用DB** | 検索・保持期間管理が必要になった段階 |
| OS ユーザー領域の専用データディレクトリ（Electron `userData` 等） | 配布ビルド向け |

未確定事項として、開発用と製品用でパスを分けるかどうかは **AuditLogger 実装時に再決定**する。

---

## 8. 追記専用方針（append-only）

1. **原則として append-only** とし、既存レコードの**上書き・削除をアプリ機能から禁止**する（コンプライアンス要件が別途あれば運用側で実施）。
2. Hermes アプリ本体の一般コードパスから**監査ファイルを直接編集しない**。将来の **`AuditLogger`（またはイツキシマ側同等モジュール）だけ** がストアへ追記する。
3. Hermes Autonomy Zone の対象ファイルとして、監査ログを**自由読み書きの対象に含めない**（誤削除・捏造の経路を減らす）。
4. 破損時は「修復」より**ローテーションして新規ファイル開始**など、改ざんに見えない運用を優先する（詳細は実装フェーズ）。
5. 同一 `eventId` の二重追記が起きた場合は、ストア側で**重複検知**する設計をテスト計画でカバーする（仕様準拠の振る舞いは実装時に確定）。

---

## 9. マスク方針

1. 秘密情報**らしき**パターン（APIキー形式、Bearer、長い base64、`.env` 行風）は**保存前にマスク**する。承認レポート生成と**同系のルール再利用**を推奨する。
2. `path` は必要に応じて **`maskedPath` のみ保存**し、ユーザー名・ドライブ直下等はセグメントマスクする。
3. **`contentIncluded: false` を常に維持**する。
4. **`reason` に秘密・トークンを含めない。** ポリシー違反の説明はコードと短い定型文に寄せる。
5. **エラー詳細**（スタック、errno 生、OSメッセージ全文）は保存しない。**汎用の `reasonCode`** と**短い reason** に落とす。
6. URL を載せる場合は、query ・ fragment を**ドロップ**し、必要ならホストのみなど極小化する（`network_blocked`）。
7. 長い英数字連続には **`[masked-entropy-segment]`**、`sk-` 形式には **`[masked-api-key-shape]`**（内部に `token` が残らないようにプレースホルダを選ぶ）を用い、`[masked-sensitive-term]` と二重適用される場合は順序により除去する。

---

## 9a. Local Pilot におけるファイル永続（最小実装）

1. **`saveAuditLog(record, SaveAuditLogOptions)`**（`src/main/ichikishima/audit/audit-save.ts`）は、`appendFileSync` による **追記のみ** を行う。`writeFile` / `unlink` / `truncate` で既存ログを置換しない。
2. **`audit-<UTC日付>.jsonl`**（例 `audit-2026-05-03.jsonl`）に **JSONL**（各行 `JSON.stringify(AuditLogRecord)` + `\n`）として保存する。`filename` の日付は `options.dateUtc` または **`record.timestamp` の UTC 日付部** に基づく。
3. 既定では **`zoneRoot` 直下の相対ディレクトリ `audit`**（Local Pilot で `sandbox/hermes-autonomy-zone/audit/`）を用い、`auditSubdirectory` で変更するが **`..`** および絶対指定は許可しない。
4. **保存ディレクトリとファイルパス**は、`checkZonePath`（Hermes autonomy zone）および `checkDenylist` を必ず通し、**`zoneRoot` が `projectRoot` に含まれる**ことを検証する。判断に迷うパスは拒否する。
5. **Electron userData に既定ディレクトリを固定する処理は、この Goal には含めない**（将来フェーズ）。
6. 保存直前には **`sanitizeRecordForPersistence`** により、`content` 混入拒否、`contentIncluded:false` 強制、**イベント JSON サイズ上限 8 KiB** を適用する。

---

## 10. サイズ制限・ローテーション（方針値・コード状況）

数値は**初期案**であり、未実装項目は将来調整する。イベント上限（8 KiB）のみ **Local Pilot の `sanitizeRecordForPersistence` で強制済み**。

| 項目 | 方針案 |
|------|--------|
| 1イベント最大サイズ | **8 KiB**（JSON）。**現在 `sanitizeRecordForPersistence` が保存前チェック**。超過時はイベント破棄（`RECORD_TOO_LARGE`） |
| 1ファイル最大サイズ | **10 MiB**。到達時にローテーション |
| ローテーション | **日次**ファイル名サフィックス（`audit-YYYYMMDD`）またはサイズトリガ |
| 保持期間 | 開発既定 **30 日**、本番要件は別途。期限超えは**圧縮アーカイブ**または削除（削除は人間承認またはオフラインバックアップ前提） |
| 大量イベント | **バッチ追記**と**バックプレッシャ**（キュー溢れ時は記録スキップではなく縮約イベントへ格下げするかは実装時に決定） |

---

数値のうちイベント上限のみ **Local Pilot 実装済み**。ファイル上限・自動ローテーション・SQLite/userData はコード未実施。

## 11. **まだコード化していない**監査機能

Local Pilot での **JSONL 追記実装済み**。以下は別 Goal / レビューを挟む領域。

- **SQLite／専用DB** への転送および検索サービス。
- **Electron userData を既定監査ログ先とする自動切替**。
- **日次サイズトリガおよびアーカイブ**の自動処理。

---

## 12. 次の実装ステップ（ロードマップ上の参照）

ユーザー合意済みの安全順序:

1. ~~監査ログ仕様・テスト設計~~（本文書および `AUDIT_LOG_TEST_PLAN.md`）。
2. ~~AuditLogger 未実装スタブ / 型 / テスト（永続化なし）。~~ ← `src/main/ichikishima/audit/` と `tests/ichikishima/audit/`。
3. ~~AuditLogger 最小実装~~（`sandbox/hermes-autonomy-zone/.../audit` への **JSONL 追記のみ**）。
4. ~~承認キュー本体 Core~~（Zone 承認キュー JSONL + 監査 `kind` 連携）。
5. Hermes 本体連携前レビュー。
6. Hermes 本体連携。

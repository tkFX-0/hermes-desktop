# 監査ログ テスト設計（Audit Log Test Plan）

**本書はテスト設計のみ**を定義する。本Goalでは **`src/` 実装および `tests/` の実行テスト追加を行わない**。将来の AuditLogger／正規化パイプライン実装時に、本計画に沿ってテストケースを追加する。

親仕様: `docs/ichikishima/AUDIT_LOG_SPEC.md`

---

## 1. テストの目的

1. **`AuditLogRecord` に禁止データが混入しない**ことを機械検証できるようにする。
2. **`auditEventCandidate` から `AuditLogRecord` への正規化**が仕様どおりであることを検証する。
3. **append-only 方針**と **Hermes による直接編集禁止**がアーキテクチャ上維持されることを、テストまたは静的方針チェックで裏付ける。
4. マスク・サイズ・`contentIncluded: false`・`requiresUserApproval` の維持を回帰テストする。

---

## 2. テストレベル

| レベル | 内容 | 本Goal後の優先 |
|--------|------|----------------|
| 単体 | 正規化関数、マスク、スキーマ検証、イベント最大サイズ | 高 |
| 結合 | read/write/delete/block の戻りからレコード生成（インメモリ） | 高 |
| 契約 | append-only Writer のモックまたは temp への追記テスト（将来） | 中 |
| E2E | UI・Hermes本体連携 | 本意図後（本計画では範囲外） |

---

## 3. テストケース一覧

ID は実装時にファイルへマッピングする。優先度: P0 が最優先。

### 3.1 禁止データ・マスク（P0）

| ID | 観点 | 手順概要 | 期待結果 |
|----|------|-----------|----------|
| TC-AUD-001 | content 本文が保存対象にならない | read/write 成功の `auditEventCandidate` と擬似本文を入力し正規化 | `AuditLogRecord` に本文フィールドが無い。**`contentIncluded === false`** |
| TC-AUD-002 | APIキーらしき文字列がマスクされる | reason や path に疑似キーを混ぜた候補を正規化 | 保存用文字列ではマスク済み。**生キーは出現しない** |
| TC-AUD-003 | `.env` 内容が保存対象にならない | `.env` 風キー=value を含む候補を正規化 | レコードに伏せられるか、`reason` が安全な定型文言に置換 |
| TC-AUD-004 | reason に秘密情報を含めない | 高エントロピー文字列を reason に渡す | バリデーションで拒否、またはマスク後のみ通過 |
| TC-AUD-005 | エラー詳細をそのまま保存しない | `read_error` / `write_error` 相当で長いスタックを模した入力 | reason は短く、スタック語句は出ない |

### 3.2 正規化・種別（P0）

| ID | 観点 | 手順概要 | 期待結果 |
|----|------|-----------|----------|
| TC-AUD-010 | read の候補を `AuditLogRecord` へ変換 | success / denied / error の3パターン | `kind` が `read_success` / `read_denied` / `read_error`。必須メタが欠けない |
| TC-AUD-011 | write の候補を変換 | 同上 | `write_*` と一致。`bytesWritten` / `created` / `overwritten` がソースと一致 |
| TC-AUD-012 | delete block をログ化 | `DeleteAuditEventCandidate` | **`kind === "delete_blocked"`**、`deleted === false` |
| TC-AUD-013 | execute / network / git block | `BlockedOperationAuditEventCandidate` | 各 **`execute_blocked`** / **`network_blocked`** / **`git_blocked`** |
| TC-AUD-014 | approval report 生成をログ化 | 承認レポート生成後の擬似イベント | **`approval_created`** または後続仕様で定義した kind。`**reportId` 存在**。**レポート全文は無い** |
| TC-AUD-015 | memory candidate をログ化 | 作成・拒否の2系統 | **`memory_candidate_created`** / **`memory_candidate_rejected`**。本文や memory 生データ無し |
| TC-AUD-016 | escalation（将来） | 要求・阻止の擬似イベント | **`escalation_requested`** / **`escalation_blocked`** |

### 3.3 承認・ポリシー維持（P0）

| ID | 観点 | 手順概要 | 期待結果 |
|----|------|-----------|----------|
| TC-AUD-020 | `requiresUserApproval` が維持される | 承認経路からの入力 | レコード上も **true が欠落しない**（該当フローのみ） |
| TC-AUD-021 | `contentIncluded: false` が維持される | 全サンプルイベント | **常に false** |

### 3.4 ストア方針（P1〜実装有効化後）

| ID | 観点 | 手順概要 | 期待結果 |
|----|------|-----------|----------|
| TC-AUD-030 | append-only を破らない | 同一ファイルへ2回追記のみ許可モック | 中央の「上書き」API が呼ばれない、または Writer が reject |
| TC-AUD-031 | Hermes がログを直接編集しない前提 | 静的解析またはコード検索ルール（将来） | Zone の一般 write 経路から `audit/` が触れない等、**進入点が単一** |
| TC-AUD-032 | 1イベントサイズ上限 | 巨大 meta を投入 | **拒否または切り詰め**。仕様の上限を超えない |
| TC-AUD-033 | 1ファイルサイズでのローテーション | （実装後）サイズモック | 新ファイルへ切り替わる |
| TC-AUD-034 | `eventId` 重複 | 意図的に同一IDを2回 | ポリシーに従い**スキップまたはエラー**（実装定義を文書化） |

### 3.5 回帰・境界（P2）

| ID | 観点 | 手順概要 | 期待結果 |
|----|------|-----------|----------|
| TC-AUD-040 | optional フィールド欠落 | minimal な候補 | 正規化で既定または省略が一貫 |
| TC-AUD-041 | UTC timestamp | 各種入力 | ISO8601 かつ TZ 明示 |
| TC-AUD-042 | maskedPath のみ | path に個人情報を含む | `normalizedPath` が無くてよいときの方針に合致 |

---

## 4. テストデータ方針

- **フェイクのAPIキー**・**フェイクの.env 行**を固定フィクスチャ化し、再現性を持たせる。
- 実パスの代わりに **`/USER_REDACTED/project/zone/sample.txt`** 形式のゴールデン出力を用意する。
- **本番の memory DB・口座・取引データは絶対に使わない。**

---

## 5. 未実装フェーズでの検証のされ方

- 本フェーズ終了後: **正規化・マスク・JSONL追記スタブ〜最小実装**を `audit-log.ts` / `audit-save.ts` と単体テストでカバー。P0 の主要ケース済み。**永続SQLite・自動ローテーション・Hermes メイン自動呼び出し**は別フェーズ。
- 次フェーズでは **Hermes メイン自動呼び出し**、および **自動ローテーション／ファイルサイズ上限のコード実装（TC-AUD-030〜）** をレビューのうえ進める。

---

## 6. 完了条件（テスト観点のカバレッジ）

次が満たされれば、本テスト計画の「設計完了」とみなす（実装は別Goal）。

- 禁止項目・マスク・サイズ・append-only が **テーブル化**されている。
- `read` / `write` / `delete` / `execute` / `network` / `git` / approval / memory / escalation の **kind** が列挙されている。
- P0 ケースが **すべて ID 付き**で定義されている。

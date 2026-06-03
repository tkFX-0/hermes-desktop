# Hermes Report Review Spec

## 1. 目的

イツキシマShadow Modeは、Hermesの変更レポートを読み、ユーザーの最終判断を助ける審査候補を作る。

この審査は自動承認ではない。ユーザーの最終承認を代替しない。

## 2. 見る項目

- 何を変更したか。
- なぜ必要だったか。
- どこを変更したか。
- 触っていない重要領域が明記されているか。
- ユーザーに見える変化が明記されているか。
- リスクが明記されているか。
- 実行したテストが明記されているか。
- 実行していないテストが明記されているか。
- 戻し方が明記されているか。
- 次工程が危険境界に進まないか。

## 3. 承認推奨 / 保留 / 却下推奨の基準

承認推奨:

- 禁止領域に触れていない。
- テスト結果が明記されている。
- 未実行テストが明記されている。
- リスクが説明されている。
- 次工程が低リスク範囲に留まる。

保留:

- テスト未実行が多い。
- 未確認項目が曖昧。
- 次工程がwrite / delete / execute / network / git / Hermes本体連携などの境界に近い。
- 説明が不足している。

却下推奨:

- 禁止領域に触れている。
- 外部通信、git push、実delete、実execute、実network、実git操作に進んでいる。
- `.env`、APIキー、secrets、memory DB、MT5/EA、取引履歴、個人情報に触れている。
- 実行していないテストを実行済みのように書いている。

## 4. 禁止領域チェック

禁止領域:

- 既存EA本体。
- MT5関連。
- `.env`、APIキー、secrets。
- memory DB。
- 本番設定。
- git push。
- 外部通信。
- 実delete / 実execute / 実network / 実git操作。
- 自動売買関連。
- 取引履歴。
- 個人情報。

## 5. テスト結果チェック

- 成功したテスト。
- 失敗したテスト。
- 未実行テスト。
- typecheck。
- eslint。
- smoke test。

実行していない項目は未実行として扱う。

## 6. 次工程リスクチェック

次工程が以下に入る場合は保留または追加レビュー候補にする。

- Hermes本体連携。
- 監査ログ本体保存。
- 承認キュー実行。
- UI。
- delete / execute / network / gitの実行。
- 外部通信。
- MT5/EA。
- memory DB。

## 7. ユーザー向け説明形式

審査結果は次を返す。

- recommendation。
- riskLevel: `low` / `medium` / `high`。
- reasons。
- detectedProtectedTerms。
- missingEvidence。
- requiresUserFinalApproval。

「問題ありません」とは書かず、「この範囲では問題を検出していません」と表現する。

## 8. Review Mode実用化後の扱い

`reviewHermesReport` は、変更レポート文字列または構造化入力を受け取り、Review Modeの判定ロジックを通して結果を返す。

構造化入力で扱える項目:

- `reportText`
- `nextStep`
- `changedFiles`
- `executedTests`
- `unexecutedTests`
- `untouchedImportantAreas`
- `rollbackPlan`
- `codeChanged`
- `docsOnly`

互換出力として、Review Modeの `decision` は `recommendation` に、`detectedRiskTerms` は `detectedProtectedTerms` に、`missingChecks` は `missingEvidence` に写す。

この審査は自動承認ではない。`requiresUserFinalApproval:true` と `autoApproved:false` を維持する。

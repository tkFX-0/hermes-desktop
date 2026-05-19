# しきしま実運用100% — x_search Read-only Plan

**状態:** BLOCKED — XS-READ GO 待ち
**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## 現状

x_search / SNS 読み取りは FUTURE Gate。
Gate ダッシュボードで `XS-READ: FUTURE` として表示中。
`X_SEARCH_HOLD_GO_MATRIX.md` に XS-00〜XS-09 gate sequence 記録済み。

---

## 許可される操作 (XS-READ GO 後)

```
✓ 検索クエリの実行
✓ 結果の読み取り
✓ 要約の作成
✓ draft の作成 (送信しない)
✓ ソース/引用の記録
```

---

## 絶対禁止 (いかなる状況でも)

```
✗ 投稿 / post
✗ 返信 / reply
✗ DM / ダイレクトメッセージ
✗ いいね / like
✗ フォロー / follow
✗ フォロー解除
✗ 削除 / delete
✗ アカウント変更 / mutation
✗ 外部 write
✗ 自律的なポーリング (別途承認なしに)
```

---

## 必要な人間 GO フォーム

```yaml
xs01_read_go:
  source:                # x.com / web / etc.
  topic:
  query_terms:
  session_scope:         # この session での読み取り範囲
  read_only_confirmed: true
  no_write_confirmed:  true
  max_queries:
  autonomous_polling:  false
  evidence_file:         # docs/shikishima/XS01_EVIDENCE_YYYY-MM-DD.md
```

---

## STOP 条件

```
write アクションが試みられた
アカウントへの mutation が発生した
意図しない外部書き込みが発生した
```

---

## evidence テンプレート

```yaml
xs01_read_evidence:
  result:
  date:
  source:
  queries_executed:
  write_attempted: false
  account_mutation: false
  raw_secret_output: false
```

> XS-READ GO なしに x_search を実行しない。

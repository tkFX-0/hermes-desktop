# Post-100 Gate 004 — Manual Operation Audit Checklist

## Document Status

```text
roadmapVersion: v3.60.0
date: 2026-05-17
gate: Post-100 Gate 004
name: Manual Operation Audit / Incident Checklist
status: design_ready — not yet executed
```

---

## Purpose

Limited Manual Operation has STARTED. This checklist is used to audit each manual operation session before, during, and after.

Goal: 使える範囲を広げる前に、使ってはいけない時に止まれる仕組みを作る。

---

## Pre-Operation Audit Checklist

Run before any draft is created or reviewed:

```text
[ ] 1. baseline確認
       origin/main == expected?
       commits_ahead == 0?
       staged == 0? / tracked_dirty == 0?

[ ] 2. safety invariant確認
       productionReady: false?
       execution: disabled?
       runtime_started: false?
       port_3030_closed: true?
       rawValuesReported: false?

[ ] 3. operation scope確認
       今回の操作カテゴリは明確か?
       external_service は none か?
       action_type は manual_copy_only か?

[ ] 4. HOLD条件の確認
       (HOLD条件リストを参照)
```

---

## Per-Draft Audit Checklist

Run for each draft item:

```text
[ ] 1. draft内容は明確か
       タイトルと本文が一致しているか
       何を何のために書いたかが分かるか

[ ] 2. 宛先/対象は曖昧ではないか
       送り先が特定の実在人物/サービスでないか
       または、なしであることが明記されているか

[ ] 3. sensitive dataは含まれていないか
       個人情報 / 医療情報 / 法的情報 / 金融情報 / 機密情報

[ ] 4. raw値/token/secretは含まれていないか
       APIキー / トークン / パスワード / LAN IP / 認証情報

[ ] 5. external writeは発生していないか
       送信 / 投稿 / 作成 / 予約 / 決済 は一切ない

[ ] 6. approved_for_manual_copy の意味が守られているか
       「人間がシステム外で手動コピーする」のみ
       「システムが送信/実行する承認」ではない

[ ] 7. 人間が最終判断しているか
       AIや自動化が決定していない
       人間がレビュー → 人間が決定

[ ] 8. 自動送信/自動投稿/自動作成と誤解されないか
       文章に「送信する」「投稿する」「作成する(自動)」が含まれていないか

[ ] 9. manual_copy_only の境界が守られているか
       承認後もシステムは何もしない
       コピーするのは人間のみ

[ ] 10. 記録すべきHOLD/REJECT理由が残っているか
        HOLD/REJECTの場合、理由がログに記録されているか
```

---

## Post-Operation Audit Checklist

Run after operation is complete:

```text
[ ] 1. evidence recordingは完了したか
       operation log templateが記入されているか

[ ] 2. external writeは発生していないか
       email_sent: false
       calendar_event_created: false
       github_remote_created: false
       social_posted: false
       purchase_or_reservation_made: false

[ ] 3. safety invariantsは維持されているか
       productionReady: false
       execution: disabled
       runtime_started: false
       rawValuesReported: false

[ ] 4. 予期せぬ状態変化はなかったか
       想定外のファイル変更 / 想定外のcomm / 想定外のプロセス起動
```

---

この範囲では問題を検出していません。

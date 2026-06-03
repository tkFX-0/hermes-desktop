# AI Usage Cockpit — STOP Conditions

**date:** 2026-05-21

---

STOP immediately if any of the following occur:

```text
- token / API key が要求される
- ログインクッキー / セッションが要求される
- ブラウザスクレイピングが提案される
- 外部 API 呼び出しが追加されようとしている (GO なし)
- 使用量が「事実」として提示されているがソースが不明
- プロバイダーの制限を回避する手段が提案される
- productionReady: true が登場する
- execution: enabled が登場する
- package / dependency 変更が GO なしで行われようとしている
- token フィールドが UI / code に追加されようとしている
- 自動ログイン / 認証自動化が実装されようとしている
```

---

## After STOP

```text
1. 変更を元に戻す (git restore / git reset)
2. STOP 原因を evidence doc に記録
3. 人間に報告
4. 安全な状態に戻ってから再開
```

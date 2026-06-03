# AI-USAGE-02: Manual Input Policy

**date:** 2026-05-21

---

## Principle

AIの使用量・状態を取得するとき、**自動スクレイピングや非公式手段は使わない**。
人間が目視確認した値のみを入力する。

---

## Allowed Input Methods

```text
1. CLI 出力の手動転記
   例: claude --status | 出力を人間が読んで入力
   dataSource: cli_manual

2. 管理画面の目視確認
   例: console.anthropic.com で残量確認 → 数値を手入力
   dataSource: screen_manual

3. ユーザー報告
   例: 「今日は多分クールダウン中」という主観的報告
   dataSource: user_reported

4. 推定値
   例: 「今月は大体 N 回使った」という経験則
   dataSource: estimated
```

## Forbidden Input Methods

```text
- ブラウザ自動化 (Playwright / Puppeteer)
- ログイン済みブラウザのクッキー/セッション読取
- 非公式 API エンドポイント呼び出し
- スクリーンショット自動解析
- プロバイダーのレート制限チェック自動化
```

---

## Staleness Policy

```text
last_checked_at から一定時間経過で status → NEEDS_MANUAL_UPDATE
デフォルト stale threshold: 4 hours (表示のみ)
stale な状態でも UNKNOWN に自動変更しない — 最後の known state を保持
```

---

## Data Quality Labels

| Label | Meaning | UI Color |
|---|---|---|
| FACT | 公式 API 取得 (将来) | Green |
| MANUAL | 人間が確認・入力 | Blue |
| ESTIMATED | 推定値 | Yellow |
| UNKNOWN | 不明 | Gray |

**FACT と ESTIMATED を同じ表示にしてはいけない。**

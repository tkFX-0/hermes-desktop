# XS-AUTO Source Policy

gate: XS-AUTO (read-only research)
status: ACTIVE POLICY
xacc_required: false
x_oauth_required: false

## 重要: XS-AUTO と XACC の区別

```text
XS-AUTO:
  X/Web 上の情報を read-only で調査・要約する
  OAuth / API / ログイン 不要
  公開情報 + ユーザー提供テキスト が対象

XACC:
  自分の X アカウントを OAuth / API 接続する
  現在 HOLD — 別途 XACC-01 GO が必要
```

## Source Classes

### Allowed (許可)

| Source | 説明 | 例 |
|---|---|---|
| user-provided X post text | ユーザーが貼り付けた X 投稿テキスト | ユーザーからペーストされた文 |
| public X post URL | ログイン不要で閲覧できる公開 X URL | https://x.com/xxx/status/xxx |
| public web article | 公開 web ページ | ブログ / ニュース / 公式ドキュメント |
| public official docs | 公式ドキュメント | GitHub README / docs.xxx.com |
| public blog/news | 公開ブログ・ニュース記事 | Zenn / Qiita / Medium |

### Restricted (要確認)

| Source | 説明 | 対応 |
|---|---|---|
| logged-in X timeline | ログイン後のタイムライン | 使用禁止 → ユーザーにテキスト提供を依頼 |
| private/locked accounts | 鍵アカウント | 使用禁止 |
| paid-only content | 有料コンテンツ | 使用禁止 |
| DM / private messages | ダイレクトメッセージ | 使用禁止 |

### Forbidden (禁止)

| Action | 理由 |
|---|---|
| X login / session scraping | アカウント認証は Level 5 XACC ゲート |
| X OAuth / API / Bearer Token | XACC-01 HOLD |
| session cookie 使用 | 認証情報の取り扱い = Level 5 |
| automated account actions | 外部サービスへの書き込み |
| rate-limit bypass | ToS 違反 |
| multiple account rotation | ToS 違反 |
| write actions (post/reply/like/follow/DM) | XACC-04 以降 |
| token extraction/output | rawValuesReported = false 維持 |

## Data Classification

| クラス | 定義 | 記録方法 |
|---|---|---|
| FACT | 直接引用 / ユーザー提供テキスト | source URL または "user-provided" を明記 |
| MANUAL_REPORTED | ユーザーがペーストしたテキスト | "user-provided: [date]" を明記 |
| ESTIMATED | 限られたソースから推定 | "ESTIMATED:" プレフィックスを付ける |
| UNKNOWN | 未検証 / 出典不明 | "UNKNOWN:" プレフィックスを付ける |

FACT / MANUAL_REPORTED / ESTIMATED / UNKNOWN を混在させない。

## STOP Conditions

- ログインが要求された場合 → 即停止
- token が要求された場合 → 即停止
- source がプライベートアクセスを必要とする場合 → 即停止
- write アクションが誘発された場合 → 即停止
- 意図しない認証フローが開始された場合 → 即停止

_Created: 2026-05-21_
_XACC-01 remains HOLD_

# XS-AUTO-03 GO Form 2026-05-21

status: DRAFT / NOT APPROVED
gate: XS-AUTO-03
productionReady: false
execution: disabled
rawValuesReported: false

## 重要: XS-AUTO と XACC の区別

```text
XS-AUTO:
  X/Web 上の情報を read-only で調査・要約する
  OAuth / API 不要
  ユーザー提供テキスト・公開 URL を対象

XACC:
  自分の X アカウントを OAuth / API 接続する
  HOLD — 別途 XACC-01 GO が必要
```

このフォームは XS-AUTO (read-only 調査) 専用。
XACC-01 (X Account OAuth) は記入禁止・記入しても無効。

## Required Human GO Fields

```text
date:                  [yyyy-mm-dd]
time_window_jst:       [HH:MM - HH:MM JST]
search_topic:          [テーマ]
exact_queries:         [クエリまたは調査対象テキスト/URL]
allowed_run_count:     1
source_scope:          [public web / user-provided text / public URL]
excluded_sources:      [login-required / private / OAuth-required]
evidence_file:         docs/shikishima/XS_AUTO_03_RUN_[id]_[date].md
after_action_gate_status: HOLD
```

## Recommended source_scope

- public web (公開 web ページ)
- user-provided X post text (ユーザーが貼り付けた X 投稿テキスト)
- public X post URL (公開 X URL)
- public article / blog / news
- public official docs

## Forbidden

- X account login / session
- X OAuth / API / Bearer Token
- logged-in X timeline
- private / locked accounts
- posting / replying / liking / following / DM
- browser scraping with session cookies
- automated account actions
- continuous patrol / auto-refresh loop
- productionReady true
- execution enabled
- external write

## STOP Conditions

- login が要求された場合
- token が要求された場合
- source がプライベートアクセスを必要とする場合
- GO なしに検索が開始された場合
- 1 回を超える run が発生した場合
- write アクションが発生した場合
- hidden loop が開始された場合

## After Action

- evidence_file に結果を記録
- gate を HOLD に復帰
- after_action_gate_status: HOLD

## First Recommended Topic (参考)

```text
search_topic:          StackChan voice integration / speech push API / Discord Bot integration
source:                user-provided X post text
allowed_run_count:     1
X OAuth:               not used
XACC:                  HOLD
```

## Not Approved Until Human Fills and Returns This Form

- no x_search execution
- no X login
- no X OAuth
- no social write (post / reply / like / follow / DM)
- no retry loop
- no daemon / recurring patrol
- no productionReady true
- no execution enabled

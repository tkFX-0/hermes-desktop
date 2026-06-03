# Human-Gated Actions Plain-Language Guide

## Purpose

This is the vibe-coding guide for what AI workers may do automatically and what needs human GO.

## AUTO OK

AI may do these when the task is scoped and safe:

- 作る
- 直す
- 確認する
- 記録する
- ローカル保存
- ローカルcommit

Examples:

- edit source files in an approved scope
- run local typecheck / lint / tests
- write evidence docs
- create a local commit

## HUMAN GO

Human GO is required for:

- 外へ送る
- 起動する
- ログイン連携する
- SNSを読む
- Obsidianへ書く
- git push
- runtime start
- OAuth
- x_search / social read access
- external service connection
- provider integration
- cloud sync / API connection

## READ-ONLY GO

Read-only GO can allow:

- 読む
- 探す
- まとめる
- 下書きする

Examples:

- search social sources
- read public posts
- summarize public information
- draft replies or posts for human review

Read-only GO does not allow posting, replying, sending, liking, following, or external writes.

## HARD STOP

These are not allowed without a future explicit policy and separate GO:

- 投稿
- 返信
- DM
- 送信
- 購入
- 予約
- 決済
- 本番化
- 自動実行ON
- productionReady true
- execution enabled
- secret/token/raw value output
- uncontrolled auto-run loop

## Commit vs Push

Commit is local.

AI may create a local commit when the task allows it and checks pass.

Push sends work outside the local repo.

Push always needs explicit human GO for the exact branch and commit scope.

## Runtime Start

AI must not start the app/runtime by itself.

Runtime requires human GO with:

- date
- time_window
- command
- reason
- expected observation
- stop conditions
- shutdown method
- post-run checks
- evidence file

## OAuth

AI must not start login linking by itself.

OAuth requires human GO with:

- provider name
- purpose
- requested scopes
- time window
- token storage policy
- raw token / secret redaction policy
- expected result
- stop conditions
- evidence requirement

## x_search / Social Reading

SNSを読む・調べる・まとめる・下書きするのは将来GO対象。

SNSに書く・返す・送る・反応するのは別GO必須。

## Obsidian Local Note Write

Obsidianへ記録を書くことは将来GO対象。

ただし、書く場所・内容・秘密情報を書かないことを人間が指定する。

## ProductionReady and Execution

productionReady true and execution enabled are not normal development steps.

They are final operational gates and require separate human acceptance.

## One-Line Rule

AIは作っていい。
AIは確認していい。
AIは記録していい。
AIはローカルcommitしていい。

でも、外に出す・実際に動かす・ログインする・投稿する・買う・予約する、は人間GO。

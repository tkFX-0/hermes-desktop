# XS-AUTO-03 One-Shot Scheduled Read-Only Search GO Form

**date:** 2026-05-21
**status:** AWAITING HUMAN GO
**worker:** ClaudeCode (will execute after GO)
**gate:** BLOCKER-004 resolution

---

## What this GO enables

- ウォッチリスト WI-001 (AI / Agent Platform) 1回のみ read-only web 検索
- DuckDuckGo Instant Answer + Google News RSS 経由
- 結果はローカル表示のみ / 外部書き込みなし
- 実行後は immediately HOLD 復帰

## What this GO does NOT enable

```text
- X / Twitter API 接続
- 繰り返し検索 / スケジューラー起動
- WI-002 〜 WI-005 の実行
- Discord / Obsidian / Command Chat への自動書き込み
- 外部 API write
- productionReady true / execution enabled
- git push (別GO)
```

---

## GO Form — copy, fill time_window, return as GO message

```text
xs_auto_read_go:
  date:                 2026-05-21
  time_window_jst:      [例: 03:30-03:45]
  watchlist_id:         WI-001
  query:                AI agent platform news 2026
  allowed_run_count:    1
  source_scope:         public web search only (DuckDuckGo + Google News RSS)
  read_only_confirmation: true
  stop_if:              token appears / write action / 429 / private data / loop
  evidence_file:        docs/shikishima/XS_AUTO_03_RUN_WI001_2026-05-21.md
```

---

## After execution (ClaudeCode)

```text
1. 検索実行 (1回)
2. 結果をローカル表示 (raw URLなし / redacted summary)
3. gate HOLD 復帰確認
4. evidence doc 作成
5. commit (push は別GO)
```

# HB-01 Hermes / WSL GO Form

**date:** 2026-05-21
**status:** HOLD — awaiting explicit human GO
**worker:** ClaudeCode (will execute after GO)

---

## Current State

```yaml
bridge_code:   exists (hermes-bridge.ts / hermes-controlled-pilot-config.ts)
pilot_mode:    dry_run / controlled_pilot — both HOLD
WSL_process:   not started
external_conn: disabled
```

---

## What this GO enables

- WSL2 上の Hermes プロセスとの bridge 接続
- 指定コマンドのみ実行 (`allowed_commands` に記載のもの)
- 接続時間は `time_window_jst` に制限

## What this GO does NOT enable

```text
- 任意コマンド実行
- ファイルシステム外部書き込み
- OAuth / token 取得
- Discord send / X post
- productionReady=true / execution=enabled
- git push (別GO)
```

---

## GO Form — copy, fill ALL fields, return as GO message

```text
hb01_hermes_wsl_go:
  date:
  time_window_jst:       [例: 01:00-01:30]
  purpose:               [具体的な目的]
  allowed_environment:   [WSL2 distro name]
  allowed_commands:      [explicit list — no wildcards]
  forbidden_commands:    [explicit list]
  token_policy:          no token printed to output
  expected_result:       [何を確認するか]
  stop_if:               unexpected process / token / scope expansion
  shutdown:              [how to stop WSL process]
  evidence_file:         docs/shikishima/HB01_WSL_EVIDENCE_2026-05-21.md
```

---

## Safety

```yaml
WSL_started:         false (HOLD)
external_conn:       false
productionReady:     false
execution:           disabled
rawValuesReported:   false
```

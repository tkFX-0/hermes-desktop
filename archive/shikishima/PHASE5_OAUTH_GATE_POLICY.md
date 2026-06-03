# Phase 5 — OAuth Gate Policy

**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)
**Gate ID:** OAUTH-GO

---

## 現状

OAuth provider 接続は HOLD。
Gate ダッシュボードで `OAUTH-GO: HOLD` として表示中。

---

## OAuth を開けるための条件

```yaml
oauth_go_prerequisite:
  reason_documented: true          # なぜ OAuth が必要か記録
  provider_specified: true         # Google / GitHub / xAI 等を明示
  scopes_specified: true           # 最小スコープのみ
  token_policy_defined: true       # raw token を code/docs に出力しない
  revocation_plan_defined: true    # どこで revoke するか
  separate_go_per_provider: true   # provider ごとに別 GO
```

---

## 承認フォーム

```yaml
oauth_go_form:
  date:
  time_window_start:
  time_window_end:
  provider:          # Google / GitHub / xAI / etc.
  purpose:           # なぜ必要か
  scopes:            # 最小権限スコープのみ列挙
  token_storage:     # どこに保存するか (raw token は docs/code 禁止)
  revocation_plan:   # どこで・どうやって revoke するか
  evidence_file:     # docs/shikishima/OAUTH_GO_EVIDENCE_YYYY-MM-DD.md
```

---

## 不変安全要件

```
raw token を code/docs/chat に出力しない
token を git commit に含めない
scope は最小権限のみ
OAuth は人間 GO ごとに 1 provider ずつ
```

---

## OAUTH-GO なしに禁止する操作

- login / authorize フロー開始
- token 読み取り・書き込み
- OAuth callback 受信
- provider API 呼び出し (読み取りも含む)

> AIは作るところまで。鍵と発射ボタンは人間。

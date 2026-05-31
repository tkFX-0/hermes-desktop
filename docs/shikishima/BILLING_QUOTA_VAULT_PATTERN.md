# 課金クォータ・Vault パターン（gasvault 思想 ↔ しきしま）

Date: 2026-05-30  
由来: Chisiki gasvault 調査の **レベル A** のみ。オンチェーン実装なし。

## 対応表

| gasvault 概念 | しきしま実装 | env / ファイル |
|---------------|-------------|----------------|
| 先払いサブスク枠 | subscription_only | `SHIKISHIMA_BILLING_MODE=subscription_only` |
| 従量 API 禁止 | live-api ブロック | `SHIKISHIMA_ALLOW_PAID_API=0` |
| Composer 枠 | Cursor Pro / agent CLI | `SHIKISHIMA_COMPOSER_MODE=agent_cli` |
| 1 tick 上限 | orchestrator caps | `orchestratorRelaxed` + hourly cap |
| 開発 1 回上限 | workflow max steps | `maxWorkflowStepsPerTick` |
| 消費記録 | governance | `governance-changelog.mjs` |
| 枯渇時停止 | HOLD 返却 | `billing-policy.mjs` |

## 将来 B（HOLD）用 env 案（未実装）

```text
SHIKISHIMA_EXTERNAL_GAS_VAULT=0   # 1 でも監査必須・しずめ GO
```

## 参照

- [scripts/lib/billing-policy.mjs](../../scripts/lib/billing-policy.mjs)
- [CHISIKI_GASVAULT_ADOPTION_CANDIDATES.md](research/CHISIKI_GASVAULT_ADOPTION_CANDIDATES.md)

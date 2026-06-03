# Chisiki Gas Vault — しきしまへ採用できるパターン（PUSH 候補）

Date: 2026-05-30  
**コード実装: レベル A のみ（ドキュメント + 既存 billing-policy 対応表）**  
**オンチェーン・CKT 送金: 実装しない（HOLD）**

## gasvault から抽出できる設計パターン

| パターン | 意味 | しきしま既存との対応 |
|----------|------|---------------------|
| Prepaid deposit | 先払い枠 | `SHIKISHIMA_BILLING_MODE=subscription_only` |
| Spend cap | 1回・1日の上限 | orchestrator caps / `maxWorkflowStepsPerTick` |
| Balance check before call | 枯渇時は停止 | `isLiveApiTickAllowed` / `--live-api` ブロック |
| Audit log per spend | 誰が何を消費したか | `governance-changelog` / dev pipeline trace |
| Separate vault key | 鍵を本番鍵と分離 | **未実装 — C 相当で HOLD** |
| Auto top-up | 残高低下で自動チャージ | **禁止（HOLD）— 意図しない課金** |

## 採用3段階（しずめ判定）

| 段階 | 内容 | G/H | しきしま |
|------|------|-----|----------|
| **A** | 思想のみ（プリペイド枠・上限・枯渇停止の doc） | **G** | [BILLING_QUOTA_VAULT_PATTERN.md](../BILLING_QUOTA_VAULT_PATTERN.md) |
| **B** | env `SHIKISHIMA_EXTERNAL_GAS_VAULT` + 監査ログ設計のみ | H | 将来 |
| **C** | CKT・RPC・ウォレット・署名 | **H** | 憲法・秘密鍵・個人情報の別 GO |

**推奨（2026-05-30）**: **A のみ実施**。B/C は [HUMAN_GO_QUESTIONNAIRE_2026-05-30.md](../HUMAN_GO_QUESTIONNAIRE_2026-05-30.md) でオペレーター選択後。

## PUSH 済み成果物

- [CHISIKI_PLAIN_LANGUAGE_BRIEF_2026-05-30.md](CHISIKI_PLAIN_LANGUAGE_BRIEF_2026-05-30.md)
- [BILLING_QUOTA_VAULT_PATTERN.md](../BILLING_QUOTA_VAULT_PATTERN.md)
- [CHISIKI_SHIZUME_SAFETY_GATE_2026-05-30.md](CHISIKI_SHIZUME_SAFETY_GATE_2026-05-30.md)
- [CHISIKI_HAJIME_JARVIS_MAP_2026-05-30.md](CHISIKI_HAJIME_JARVIS_MAP_2026-05-30.md)

## 実装しないもの（明示）

- 秘密鍵・ニーモニックの保存
- CKT / ETH 等の自動送金
- 公開 RPC への常時接続
- gasvault コントラクトのデプロイ・呼び出し

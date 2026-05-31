# Chisiki / gasvault — しずめ安全判定

Date: 2026-05-30  
decision: **HOLD**（オンチェーン・自動支払い）  
採用: **レベル A のみ G**

## 判定

| 段階 | 判定 | 理由 |
|------|------|------|
| A 思想のみ | **G** | 既存 `subscription_only` と同型。鍵・送金なし |
| B 外部ガス枠 env | **H** | 誤設定で外部 RPC 接続の足がかり |
| C 本番 CKT 接続 | **H** | 秘密鍵・取引・個人情報・憲法 execute と衝突 |

## HOLD 維持（変更しない不変）

- `decision=HOLD`（報告用）
- `execution=disabled`
- `productionReady=false`
- git push 自動化・ライブ売買・本番 Discord 送信ループ

## Discord / StackChan（本件との境界）

- Discord **対話返信**（REST）は司令部運用で、Chisiki とは無関係
- StackChan **実発話**はローカル VOICEVOX — CKT 不要
- `SHIKISHIMA_DISCORD_VOICE_BRIDGE`（guarded TS）は **allowlist + time window** — 本番ループとは別 GO

## 次の人間アクション

[HUMAN_GO_QUESTIONNAIRE_2026-05-30.md](../HUMAN_GO_QUESTIONNAIRE_2026-05-30.md)

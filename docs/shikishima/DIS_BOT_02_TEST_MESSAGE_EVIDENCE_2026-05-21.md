# DIS-BOT-02: Discord Bot Test Message Send Evidence

- **gate_id**: DIS-BOT-02
- **date**: 2026-05-21
- **result**: ONE_SHOT_PASS — gate restored to HOLD

## Test Message Record

| 項目 | 値 |
|---|---|
| channel | しきしまレポート (1506865864199110817) |
| content | [しきしま] 送信テスト — 2026-05-21 Discord連携確認 PASS |
| msg_id | 1506871078742528072 |
| send_count | 1 (確認済み正常送信) |
| retry_loop | false |
| token_output | false |
| gate_restored_hold | true |

## Notes

1通目 (`1506870681785340035`) は PowerShell のエンコーディング不具合 (Shift-JIS) により文字化け。
2通目 (`1506871078742528072`) UTF-8 明示で正常送信確認。
TypeScript 実装 (`discord-intake.ts`) は `Buffer.byteLength()` + `req.write()` で UTF-8 固定のため実運用に影響なし。

## Scope Confirmation

| 項目 | 値 |
|---|---|
| external_write_performed | true (Discord REST POST — 1回) |
| target | しきしまレポート channel のみ |
| content_scope | テキストのみ / 個人情報なし / トークン値なし |
| scope_exceeded | false |

## Gate Status After This Test

| ゲート | 状態 |
|---|---|
| DIS-BOT-02 send capability | ONE_SHOT_PASS — 次回送信には新規 dis_bot_02_send_go |
| DIS01_HOLD (コマンド受信) | HOLD 維持 |
| sendReport() 関数 | 実装済み / 次回チャンネルID + GO で使用可 |

## Safety Boundary

- productionReady: false
- execution: disabled
- rawValuesReported: false
- git_push_performed: false

## Naming Note

この送信は Discord Bot のセットアップテスト (DIS-BOT-02)。
DIS-03 (Discord human GO reply) とは別ゲート。
XACC-01 Discord という名称は誤り。XACC-01 は X Account OAuth / 引き続き HOLD。

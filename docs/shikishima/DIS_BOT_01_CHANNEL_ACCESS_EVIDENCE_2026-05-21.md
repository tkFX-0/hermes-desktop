# DIS-BOT-01: Discord Bot Channel Access Evidence

- **gate_id**: DIS-BOT-01
- **date**: 2026-05-21
- **result**: PASS

## Channel Access Record

| チャンネル | 用途 | ID | チャンネル名 | type | アクセス |
|---|---|---|---|---|---|
| command | しきしまへの指示受信 | 1506531289665372232 | しきしま指示 | 0 (text) | PASS |
| report | Xレポート自動送信先 | 1506865864199110817 | しきしまレポート | 0 (text) | PASS |

## Verification Method

Discord REST API `GET /api/v10/channels/{id}` でチャンネル情報取得。
メッセージ送受信なし。読み取り確認のみ。

## Scope Confirmation

| 項目 | 値 |
|---|---|
| wrong_channel_access | not tested / false |
| channel_scope_limited | true (2チャンネルのみ) |
| token_output | false |
| message_sent | false (このテストでは未送信) |

## Safety Boundary

- DIS01_HOLD: true (コマンド受信ポーリング無効)
- productionReady: false
- execution: disabled
- rawValuesReported: false

## Naming Note

XACC-01 Discord という名称は誤り。このゲートは DIS-BOT-01 (チャンネルアクセス確認)。
XACC-01 は X Account OAuth であり引き続き HOLD。

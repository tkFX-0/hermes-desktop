# Read Wrapper Spec

## 1. 目的

read wrapperは、Hermes Autonomy Zone内で許可されたファイルだけを安全に読むための境界APIである。

目的:

- Zone内で許可されたファイルだけを読む。
- `read-policy` / `path-guard` / `denylist` を必ず通す。
- 禁止領域は実読み取り前に拒否する。
- 拒否理由を人間が読める形とreason codeで返す。
- 将来の監査ログ接続に必要なメタデータを返せる形にする。

read wrapperは、Hermesが直接 `fs.readFile` を呼ぶ代わりに使う入口になる。

## 2. 非目的

read wrapperは次をしない。

- 書き込みしない。
- 削除しない。
- 実行しない。
- 外部通信しない。
- git操作しない。
- memory DBを読まない。
- MT5関連を読まない。
- `.env`、secrets、APIキーを読まない。
- Zone外を広範探索しない。
- 読み取ったcontentを監査ログや長期記憶へ自動保存しない。

## 3. 想定API

関数名候補:

```ts
readZoneFile(input);
```

入力候補:

```ts
interface ReadZoneFileInput {
  zoneRoot: string;
  requestedPath: string;
  encoding?: "utf8";
  maxBytes?: number;
  allowBinary?: boolean;
  requestId?: string;
  actor: "hermes" | "ichikishima" | "user" | "system";
}
```

成功戻り値候補:

```json
{
  "ok": true,
  "normalizedPath": "...",
  "content": "...",
  "bytesRead": 1234,
  "truncated": false,
  "auditEventCandidate": {
    "requestId": "req_...",
    "timestamp": "ISO-8601",
    "actor": "hermes",
    "action": "read",
    "status": "success",
    "normalizedPath": "...",
    "bytesRead": 1234,
    "truncated": false,
    "contentIncluded": false
  }
}
```

失敗戻り値候補:

```json
{
  "ok": false,
  "normalizedPath": "...",
  "reasonCode": "DENIED_BY_DENYLIST",
  "reason": "Path contains a denied segment: .env",
  "content": null,
  "auditEventCandidate": {
    "requestId": "req_...",
    "timestamp": "ISO-8601",
    "actor": "hermes",
    "action": "read",
    "status": "denied",
    "normalizedPath": "...",
    "reasonCode": "DENIED_BY_DENYLIST",
    "reason": "Path contains a denied segment: .env",
    "contentIncluded": false
  }
}
```

設計方針:

- 成功時だけ `content` を返す。
- 失敗時の `content` は常に `null` にする。
- `auditEventCandidate` は成功、拒否、エラーのすべてで返す。
- `auditEventCandidate.contentIncluded` は常に `false` にする。
- `auditEventCandidate` にcontent本文を含めない。
- `reasonCode` は機械判定用、`reason` は人間向け説明用にする。
- `requestedPath` と `normalizedPath` は、秘密情報を含まない範囲で扱う。

## 4. 必須ガード

read wrapperは、実読み取り前に必ず `checkReadAllowed` を呼ぶ。

必須:

- `checkReadAllowed` を最初に通す。
- `maxBytes` を設ける。
- binary fileの扱いを定義する。
- huge fileの扱いを定義する。
- symlink / realpath判定を維持する。
- denylist対象は実読み取り前に拒否する。
- 拒否時は `content` を返さない。
- 読み取り失敗時も秘密情報をエラーに含めない。

### maxBytes

`maxBytes` は必須とする。

方針:

- `maxBytes` が未指定の場合は安全な既定値を使う。
- `maxBytes` が0以下なら拒否する。
- 上限値は別途定数化する。
- 初期MVPでは、挙動が単純な「上限超過は拒否」を優先する。
- 上限超過時は `content:null`、`reasonCode: "FILE_TOO_LARGE"` で返す。

### binary file

初期MVPでは `allowBinary=false` を既定にする。

方針:

- binaryと判定した場合は拒否する。
- binary判定に迷う場合は拒否する。
- 初期MVPでは `allowBinary=true` が指定されてもbinary内容は返さない。
- 将来必要になった場合だけ、承認済み用途に限定してbinary対応を検討する。

### huge file

巨大ファイルは初期MVPでは拒否する。

理由:

- UIやLLMコンテキストを圧迫する。
- 誤ってログや生成物を丸ごと読み込むリスクがある。
- 秘密情報混入時の被害が大きい。

## 5. 監査ログ接続方針

今回は監査ログ本体は未実装とする。

Step 2fでは、監査ログ本体へ保存せず、将来の監査ログへ渡せる `auditEventCandidate` だけを戻り値に含める。

将来、read wrapperは次の監査イベントを出す。

- read success。
- read denied。
- read error。

監査ログに保存する候補:

- requestId。
- eventIdまたはrequestId。
- actor。
- action: `read`。
- status: `success | denied | error`。
- normalizedPathまたはマスク済みpath。
- reasonCode。
- reason。
- bytesRead。
- truncated。
- contentIncluded: `false`。
- timestamp。

監査ログに保存しないもの:

- content本文。
- `.env` の中身。
- APIキー。
- secrets。
- memory DB内容。
- MT5口座情報。
- 取引履歴。
- 個人情報。

pathは必要ならマスクする。

## 6. テスト設計

最低限のテスト観点:

- Zone内の通常テキストは読める。
- Zone外は読めない。
- `../` は読めない。
- `.env` は読めない。
- secretsは読めない。
- `.git` は読めない。
- MT5は読めない。
- memory DBは読めない。
- maxBytes超過時の挙動。
- binary fileの扱い。
- 存在しないファイルの扱い。
- ディレクトリを指定した場合の扱い。
- permission errorの扱い。
- エラーに秘密情報を含めない。

テスト方針:

- 実 `.env` は使わない。
- 実MT5ファイルは使わない。
- 実memory DBは使わない。
- 実個人情報は使わない。
- テスト用一時ディレクトリだけを使う。
- 外部通信しない。

## 7. 失敗時の戻り値方針

失敗時は必ず `ok: false` にする。

代表reason code候補:

- `DENIED_BY_PATH_GUARD`
- `DENIED_BY_DENYLIST`
- `INVALID_READ_OPTIONS`
- `FILE_NOT_FOUND`
- `TARGET_IS_DIRECTORY`
- `FILE_TOO_LARGE`
- `BINARY_NOT_ALLOWED`
- `READ_FAILED`

注意:

- OS由来のエラー文をそのままユーザー向けに出さない。
- 秘密情報らしき値をエラーに含めない。
- 読み取り前拒否と読み取り中エラーを区別する。

## 8. 実装順序

安全な順序:

1. まず仕様書を作る。
2. 次にread wrapperの型を作る。
3. 次にテストを書く。
4. 最後に最小read実装を作る。
5. 監査ログ本体は後続で実装する。

read wrapperの実装に入る前に、`checkReadAllowed` のテストが通っていることを確認する。

## 9. 今回の扱い

今回は仕様書とテスト設計のみとする。

実施しないこと:

- `fs.readFile` しない。
- 実装コードを増やさない。
- write wrapperを作らない。
- delete wrapperを作らない。
- execute wrapperを作らない。
- network制御を作らない。
- git制御を作らない。
- 監査ログ本体を作らない。
- UI実装しない。
- Hermes本体連携しない。
- 外部通信しない。
- npm installしない。
- 依存追加しない。
- 既存EA本体やMT5関連には触れない。
- `.env`、APIキー、secrets、memory DB、本番設定、取引履歴、個人情報には触れない。

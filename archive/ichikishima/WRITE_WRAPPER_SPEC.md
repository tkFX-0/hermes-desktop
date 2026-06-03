# Write Wrapper Spec

## 1. 目的

write wrapperは、Hermes Autonomy Zone内の許可されたパスにだけ安全に書き込むための境界APIである。

目的:

- Zone内の許可されたパスにだけ安全に書き込む。
- `path-guard` / `denylist` を必ず通す。
- Zone外、禁止パス、秘密情報、MT5、memory DB、EA本体には書き込まない。
- 書き込み前に拒否理由を機械判定用reason codeと人間向けreasonで返せるようにする。
- 将来の監査ログ接続に必要なメタデータを返せる形にする。

write wrapperは、Hermesが直接 `fs.writeFile` を呼ぶ代わりに使う入口になる。

## 2. 非目的

write wrapperは次をしない。

- deleteしない。
- executeしない。
- networkしない。
- git操作しない。
- 本体repoへ直接反映しない。
- memory DBを書き換えない。
- MT5関連を書き換えない。
- `.env`、secrets、APIキーを書き換えない。
- Zone外へ成果物を直接反映しない。

## 3. 想定API

関数名候補:

```ts
writeZoneFile(input);
```

入力候補:

```ts
interface WriteZoneFileInput {
  zoneRoot: string;
  requestedPath: string;
  content: string;
  encoding?: "utf8";
  maxBytes?: number;
  overwrite?: boolean;
  createDirs?: boolean;
  requestId?: string;
  actor: "hermes" | "ichikishima" | "user" | "system";
}
```

成功戻り値候補:

```json
{
  "ok": true,
  "normalizedPath": "...",
  "bytesWritten": 1234,
  "created": true,
  "overwritten": false,
  "auditEventCandidate": {
    "requestId": "req_...",
    "timestamp": "ISO-8601",
    "actor": "hermes",
    "action": "write",
    "status": "success",
    "normalizedPath": "...",
    "bytesWritten": 1234,
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
  "bytesWritten": 0,
  "auditEventCandidate": {
    "requestId": "req_...",
    "timestamp": "ISO-8601",
    "actor": "hermes",
    "action": "write",
    "status": "denied",
    "normalizedPath": "...",
    "reasonCode": "DENIED_BY_DENYLIST",
    "reason": "Path contains a denied segment: .env",
    "bytesWritten": 0,
    "contentIncluded": false
  }
}
```

設計方針:

- 成功時だけ実書き込みを行う。
- 失敗時は `bytesWritten: 0` にする。
- `auditEventCandidate` は成功、拒否、エラーのすべてで返す。
- `auditEventCandidate.contentIncluded` は常に `false` にする。
- `auditEventCandidate` にcontent本文を含めない。

## 4. 必須ガード

write wrapperは、実書き込み前に必ずZone内判定とdenylist判定を行う。

必須:

- 書き込み前にZone内判定を行う。
- denylist判定を行う。
- `maxBytes` を設ける。
- `overwrite:false` の場合は既存ファイルを上書きしない。
- `createDirs:false` の場合は親ディレクトリを勝手に作らない。
- symlink / realpath / junction対策を維持する。
- 拒否時は書き込まない。
- エラーにcontent本文や秘密情報を含めない。

### maxBytes

`maxBytes` は安全な既定値を持つ。

方針:

- `maxBytes` とcontent byte長は、有限の正の数として扱える場合だけ有効にする。
- contentのbyte長が `maxBytes` を超える場合は拒否する。
- 初期MVPではtruncated書き込みをしない。
- 上限超過時は `bytesWritten: 0`、`reasonCode: "FILE_TOO_LARGE"` で返す。

### overwrite

初期MVPでは `overwrite:false` を既定にする。

方針:

- 既存ファイルがあり、`overwrite:false` の場合は拒否する。
- 上書き許可は明示的に `overwrite:true` が必要。
- 上書き時もZone内判定とdenylist判定を必ず通す。

### createDirs

初期MVPでは `createDirs:false` を既定にする。

方針:

- 親ディレクトリが存在しない場合、`createDirs:false` なら拒否する。
- `createDirs:true` の場合も、作成対象の親パスがZone内かつdenylist対象外であることを確認する。
- symlink / junctionを経由してZone外へ解決される親パスや対象パスは、`createDirs:true` でも拒否する。

### write-policyとwrite-wrapperの責務

`checkWriteAllowed` は、write操作が許可できるかだけを判定する。

責務:

- Zone root配下か判定する。
- denylist対象か判定する。
- `maxBytes` / content byte長 / `overwrite` / `createDirs` を判定する。
- 既存ファイル、ディレクトリ、親ディレクトリ欠落を判定する。
- 実ファイル書き込みはしない。

`writeZoneFile` は、最小write実装時に必ず最初に `checkWriteAllowed` を呼ぶ。

責務:

- contentのbyte長を計算する。
- `checkWriteAllowed` に `contentBytes`、`maxBytes`、`overwrite`、`createDirs` を渡す。
- `checkWriteAllowed` が `ok:false` の場合は実書き込みしない。
- 許可された場合だけ、後続Stepで最小書き込み処理へ進む。
- 成功、拒否、エラーのすべてで `auditEventCandidate` を返す。

## 5. 監査イベント候補

今回は監査ログ本体は未実装とする。

将来の監査ログへ渡せる `auditEventCandidate` だけを戻り値に含める。

候補項目:

- requestId。
- eventIdまたはrequestId。
- actor。
- action: `write`。
- status: `success | denied | error`。
- normalizedPathまたはmaskedPath。
- reasonCode。
- reason。
- bytesWritten。
- created。
- overwritten。
- contentIncluded: `false`。
- timestamp。

監査イベント候補に含めないもの:

- content本文。
- `.env` の中身。
- APIキー。
- secrets。
- memory DB内容。
- MT5口座情報。
- 取引履歴。
- 個人情報。

## 6. テスト設計

最低限のテスト観点:

- Zone内の通常ファイルには書ける予定。
- Zone外には書けない。
- `../` は書けない。
- `.env` には書けない。
- secretsには書けない。
- `.git` には書けない。
- MT5には書けない。
- memory DBには書けない。
- 既存ファイルは `overwrite:false` では拒否する。
- `maxBytes` 超過は拒否する。
- directory指定は拒否する。
- symlink経由のZone外書き込みは拒否する。
- `maxBytes` またはcontent byte長が `NaN` / `Infinity` の場合は拒否する。
- 拒否時は `bytesWritten: 0`。
- `auditEventCandidate` にcontent本文を含めない。

テスト方針:

- 実 `.env` は使わない。
- 実MT5ファイルは使わない。
- 実memory DBは使わない。
- 実個人情報は使わない。
- テスト用一時ディレクトリだけを使う。
- 外部通信しない。

## 7. 失敗時の戻り値方針

失敗時は必ず `ok:false` にする。

代表reason code候補:

- `DENIED_BY_PATH_GUARD`
- `DENIED_BY_DENYLIST`
- `INVALID_WRITE_OPTIONS`
- `FILE_ALREADY_EXISTS`
- `PARENT_DIRECTORY_MISSING`
- `TARGET_IS_DIRECTORY`
- `FILE_TOO_LARGE`
- `WRITE_FAILED`

注意:

- OS由来のエラー文をそのままユーザー向けに出さない。
- content本文や秘密情報らしき値をエラーに含めない。
- 書き込み前拒否と書き込み中エラーを区別する。

## 8. 実装順序

安全な順序:

1. まず仕様書を作る。
2. 次にwrite-policy判定APIを作る。
3. 次に型定義を作る。
4. 次に未実装スタブを作る。
5. 次に仕様テストを書く。
6. 最後に最小write実装を作る。
7. delete / execute / network / git は後続で扱う。

## 9. 現在の実装段階

Step 3cまでで、write wrapperの型定義、未実装スタブ、仕様テストを作成済み。

Step 3d前の設計照合で確認した方針:

- `writeZoneFile` の最小実装では、最初に `checkWriteAllowed` を呼ぶ。
- `checkWriteAllowed` の拒否結果は、`bytesWritten: 0` と `auditEventCandidate.contentIncluded:false` を維持して返す。
- `checkWriteAllowed` の `FILE_TOO_LARGE` は `writeZoneFile` でも `FILE_TOO_LARGE` として扱う。
- OS由来エラーやcontent本文を `reason` / `auditEventCandidate` に入れない。
- `fs.writeFile` を使うのは、最小write実装Stepに入ってからとする。

実施しないこと:

- `fs.writeFile` しない。
- 実ファイル書き込みしない。
- write wrapper実装コードを増やさない。
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

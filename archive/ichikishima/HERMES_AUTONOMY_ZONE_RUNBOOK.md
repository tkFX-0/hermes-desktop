# Hermes Autonomy Zone Runbook

## 1. 目的

Hermes Autonomy Zoneは、HermesがローカルSandbox内で安全に試験作業を行うための隔離された遊び場である。

目的は、Hermes本体や既存プロジェクトへ直接触れずに、Zone内のsafe read / safe writeと、危険操作の明示ブロックを確認できる状態を作ることである。

## 2. できること

- Zone内の許可されたテキストファイルを安全にreadできる。
- Zone内の許可されたテキストファイルを安全にwriteできる。
- delete要求を実削除せずブロックできる。
- execute要求を実行せずブロックできる。
- network要求を外部通信せずブロックできる。
- git要求をgit操作せずブロックできる。
- 高リスク操作のapproval request candidateを生成できる。
- Sandbox 承認キュー（JSONL）へ `ApprovalQueueItem` を追記できる（`sandbox/hermes-autonomy-zone/approval/`、`saveApprovalQueueItem`）。
- read / write / delete / blocked operationのaudit event candidateを返せる。

## 3. まだできないこと

- Hermes本体との完全連携。
- UI実装。
- Hermes本体からの自動 `saveAuditLog` / 自動承認キュー追記。
- 承認キューに基づく **実削除 / 実行 / 通信 / git**（実行エンジンは別Goal）。
- 実delete。
- 実execute。
- 実network。
- 実git操作。
- 外部通信。
- 既存EA / MT5連携。
- memory DB更新。
- 本番反映。

## 4. 起動・確認手順

1. `sandbox/hermes-autonomy-zone/` が存在することを確認する。
2. `sandbox/hermes-autonomy-zone/README.md` を読む。
3. Zone関連テストを実行する。
4. `HERMES_AUTONOMY_ZONE_READINESS_CHECKLIST.md` の判定を見る。
5. `MORNING_REVIEW_REPORT.md` で未実行項目と残リスクを見る。

## 5. テスト手順

推奨確認:

```text
npm test -- tests/hermes/zone/config.test.ts tests/hermes/zone/denylist.test.ts tests/hermes/zone/path-guard.test.ts tests/hermes/zone/read-policy.test.ts tests/hermes/zone/read-wrapper.test.ts tests/hermes/zone/write-policy.test.ts tests/hermes/zone/write-wrapper.test.ts tests/hermes/zone/delete-wrapper.test.ts tests/hermes/zone/operation-blocks.test.ts tests/hermes/zone/approval-request.test.ts tests/hermes/zone/autonomy-zone-smoke.test.ts tests/hermes/zone/autonomy-zone-pilot.test.ts tests/ichikishima/approval/approval-queue.test.ts tests/ichikishima/approval/approval-queue-store.test.ts tests/ichikishima/approval/approval-queue-adapters.test.ts tests/ichikishima/approval/approval-pilot.test.ts tests/ichikishima/audit/audit-log.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/autonomy-zone tests/hermes/zone src/main/ichikishima/approval src/main/ichikishima/audit tests/ichikishima/approval tests/ichikishima/audit
```

PowerShellではglobが展開されない場合があるため、テストファイルを明示指定する。

## 6. 失敗時の戻し方

- 今回追加した `src/main/ichikishima/autonomy-zone/` の差分を戻す。
- 今回追加した `tests/hermes/zone/` の差分を戻す。
- `sandbox/hermes-autonomy-zone/` のsample / output / tmp内の安全なテストファイルを確認する。
- 本番ファイル、既存EA、MT5、memory DB、`.env` には触れない。

## 7. 禁止領域

- 既存EA本体。
- MT5関連ファイル。
- `.env`、APIキー、secrets。
- memory DB。
- 本番設定。
- git push。
- 外部通信。
- 自動売買関連。
- 取引履歴。
- 個人情報。
- 実delete / 実execute / 実network / 実git操作。

## 8. 次に人間が確認すべきこと

- `READY_FOR_LOCAL_PILOT` 判定が妥当か。
- approval request candidateの粒度が非エンジニアでも判断できるか。
- audit event candidateにcontent本文や秘密情報が含まれていないか。
- Hermes本体連携に進む前に、監査ログ本体と承認キューの仕様をレビューするか。

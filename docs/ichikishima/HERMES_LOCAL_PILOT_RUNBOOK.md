# Hermes Local Pilot Runbook

## 概要

Hermes本体を動かさずに、**Sandbox (`sandbox/hermes-autonomy-zone`)** で以下を検証する。

1. `sample/input.txt` を `readZoneFile` で読む。
2. `output/…` に安全な結果テキストを `writeZoneFile` で書く。
3. `requestedOperations` に delete/exec/network/git が指定されたとき、各ブロック API が応答する。
4. 必要なら `approval` / `audit` JSONL に追記される（別サブディレクトリでのテスト推奨）。
5. `createApprovalReport` で中間レビューを生成。**自動実行しない。**

関数: **`runHermesLocalPilotTask`**

## 手順（開発者）

1. `sandbox/hermes-autonomy-zone/sample/input.txt` に安全な平文を置く（秘密情報なし）。
2. テスト用に Zone 内の承認/監査サブディレクトリを `.vitest-*` 形式で切る（本番相当パスに混ぜない）。
3. `projectRoot` にリポジトリルート、`zoneRoot` に sandbox パスを渡す。
4. `dateUtc` に `YYYY-MM-DD`（テストと被らない未来日を推奨）。
5. `npm test` で `tests/ichikishima/hermes/hermes-local-pilot.test.ts` を参照。

## 禁止

- Sandbox 外への相対パス指定（path-guard が拒否する想定）。
- 実ネットワーク、実 delete、実 git、実 shell 成果物の期待。
- `.env` / APIキー / DB / MT5 パス。

## 成果物

- `output/result.txt` または指定した相対パスにプレーンテキスト。
- `approval-*.jsonl` / `audit-*.jsonl`（永続を有効化した場合）。

## 関連

- `docs/ichikishima/HERMES_BRIDGE_CONTRACT.md`
- `docs/ichikishima/LOCAL_PILOT_FULL_LOOP_SPEC.md`

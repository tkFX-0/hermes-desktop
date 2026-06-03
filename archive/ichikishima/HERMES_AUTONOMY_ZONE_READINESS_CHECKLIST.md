# Hermes Autonomy Zone Readiness Checklist

## 判定

`READY_FOR_LOCAL_PILOT`（Zone smoke ベース）。

追加コードパスでのオプションラベル（別テストでも検証済みだが Sandbox 運用のみ）:

- `READY_FOR_LOCAL_FULL_LOOP`: `tests/ichikishima/pilot/local-pilot-full-loop.test.ts` と `runLocalPilotFullLoop`
- Read-only での `CONTROL_CENTER_V1_DESIGN_READY` 状態カードは `tests/ichikishima/control-center/control-center-status.test.ts` を参照。**UI は含まない。**

いずれも Hermes本体完全連携・本番外部通信・MT5 を許可しない。

## 詳細ログ

進捗の棚卸しは `docs/ichikishima/ROADMAP_STATUS.md`、`docs/ichikishima/IMPLEMENTATION_GAP_ANALYSIS.md` を参照すること。

## チェック項目

- [x] read wrapper実装済み。
- [x] write wrapper実装済み。
- [x] delete block実装済み。
- [x] execute block実装済み。
- [x] network block実装済み。
- [x] git block実装済み。
- [x] approval request candidate実装済み。
- [x] auditEventCandidate実装済み。
- [x] sandbox `audit/` への `saveAuditLog`（JSONL 追記のみ）実装済み。
- [x] sandbox `approval/` への承認キュー Core（`saveApprovalQueueItem` 等、JSONL 追記のみ）実装済み。
- [x] smoke test成功。
- [x] local pilot smoke test成功。
- [x] typecheck成功。
- [x] eslint成功。
- [x] 禁止領域に触れていない。
- [x] 外部通信していない。
- [x] npm installしていない。
- [x] git pushしていない。
- [x] 既存EA/MT5に触れていない。
- [x] memory DBに触れていない。
- [x] `HERMES_BRIDGE_FINAL_REVIEW.md` が存在する（Hermes本体接続前レビューゲート）。
- [x] `READY_FOR_LOCAL_FULL_LOOP` が Vitest で検証できる（sandbox のみ）。
- [x] read-only の `CONTROL_CENTER_V1_DESIGN_READY` カード検証経路がある（前提条件あり／UI不要）。
- [x] **`HERMES_BRIDGE_PILOT_SPEC.md` / `HERMES_BRIDGE_OPERATION_MATRIX.md` が存在する**（Pilot dry-run ゲート文書の一部）。
- [x] **`tests/ichikishima/hermes/hermes-bridge-pilot.test.ts` が成功する**（sandbox のみ・実 Hermes 無し）。

## 朝の確認ポイント（追記）

- Hermes本体接続に進む前に **`HERMES_BRIDGE_FINAL_REVIEW.md` を人間が読了**すること。

## まだ禁止されること

- Hermes本体への完全接続。
- UI実装。
- Electron起動周り変更。
- SQLite / userData を既定とする監査・承認ログ永続化。
- Hermes本体からの自動 `saveAuditLog` / 自動承認キュー追記。
- 承認キューに基づく実delete / 実execute / 実network / 実git（実行エンジン）。
- 実delete。
- 実execute。
- 実network。
- 実git操作。
- 外部通信。
- git push。
- 既存EA/MT5連携。
- memory DB更新。
- 本番反映。

## 朝の確認ポイント

- `MORNING_REVIEW_REPORT.md` の未実行テストと残リスクを見る。
- local pilot workspaceの内容が安全なsampleだけであることを見る。
- Hermes本体接続より先に、`HERMES_BRIDGE_FINAL_REVIEW.md` と sandbox Bridge Pilot を検証する。

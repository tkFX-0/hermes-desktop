# IMPLEMENTATION GAP ANALYSIS — 稼働前総点検（2026-05-03）

本文書はコードと実ファイル確認に基づく。**推測で READY を宣言しない**。

## 総合判定サマリー

| 質問 | 結論 |
|------|------|
| `READY_FOR_LOCAL_FULL_LOOP` は維持されているか | **はい**（Vitest と実装レビュー。実 Hermes は無関係） |
| `READY_FOR_CONTROL_CENTER_V1_DESIGN` は維持できるか | **条件付きはい**（Approval JSONL スナップショット + FULL LOOP と整合する場合） |
| 実 Hermes に接続してよいか | **この Goal だけではノー**。`HERMES_BRIDGE_FINAL_REVIEW.md` の運用確認 + Bridge Pilot 無し検証後 |
| V1 UI（read-only）に着手してよいか | **設計のみ可**。コードは別Repo推奨。初期は無ボタン／全 disabled |

## Goal 項目と差分（再掲・更新）

| # | 項目 | 状態 |
|---|------|------|
| 1 | Approval Queue Core | **実装済** |
| 2 | Audit 連携 | **実装済**（自動連鎖はしない） |
| 3 | Report → Queue | **実装済** |
| 4 | Block → Queue | **実装済**（別名関数あり） |
| 5 | Hermes Bridge | **実装 + Final Review 文書** |
| 6 | Local Pilot / Full Loop | **実装済** |
| 7 | Orchestrator | **実装済**（memory DB非保存、`shouldSpeak:false`） |
| 8 | Control Center read-only モデル | **拡張済**（doc パス、blocked 近似、risk 短文） |

## Approval Queue Core

変更なし。実行エンジンは故意に欠落。

## Hermes Bridge

- **GAP（継続）**: メインプロセスから Renderer への **シンボル export 一覧が未ロック**。
- **緩和**: Final Review と Bridge Pilot で allowlist を機械チェック。2026-05 追補: `dependency_install` / `external_ai_escalation` を **`bridge_requires_approval`** 経由で承認キューのみ処理（自動実行なし）。ゲート文書に `HERMES_BRIDGE_PILOT_SPEC.md` / `HERMES_BRIDGE_OPERATION_MATRIX.md` を追加。Readiness ラベルは **`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`**。**実 Hermes／localhost HTTP／Electron UI は未到達**。

## Hermes本体接続

- **GAP**: IPC、セッション寿命、ログローテーション、失敗時のロールバック。
- **停止条件**: Final Review §3 を参照。

## Control Center V1

- **実装GAP**: アプリウィンドウ、イベントループ、状態購読（WS/IPC）、**`127.0.0.1` HTTP 読取プロセス（未実装。Threat Model〜Gate 文書は到達済）**。
- **設計GAP解消**: `CONTROL_CENTER_SPEC.md` §12、`CONTROL_CENTER_IMPLEMENTATION_PLAN.md` V1 精密化、`control-center-status.ts` モデル参照。**Local HTTP は `CONTROL_CENTER_LOCAL_API_IMPLEMENTATION_GATE.md` を経由**。

## 実装してよい（低リスク）

- ドキュメント、CLI read-only、**Hermes Bridge Pilot のルーティング拡張**（`dependency_install` / `external_ai_escalation`、`tests/ichikishima/hermes/hermes-bridge-pilot.test.ts`）。
- Ichikishima のテキストのみの評価改善。

## 停止すべき

- Renderer raw `fs`。長寿命 Hermes。**承認キュー自動消化**。**外部通信**。**npm install**。

---

リポジトリ外の環境変化（OS、別ブランチ、別Hermesビルド）では READY が崩れることがある。CI で `vitest ichikishima+pilot+control-center+hermes/zone` を推奨。

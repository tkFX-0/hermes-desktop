# Ichikishima Control Center — 実装計画（V0〜）

**位置づけ**: 完全独自 Windows アプリ。hermes-desktop は参照・実験のみ。  
**現在（2026-05-05）**: **ドキュメント + read-only データ経路 + Renderer read-only App Shell（`getAppSnapshot` のみ）** + **`control-center-project-root-resolution`（設計～コード。**packaged 実起動での path 証明は未**）**。実行系ウィンドウ・依存・実 Hermes 接続・本番 Control Center は未着手。

---

## 全体戦略（魂 → 薄い管制盤 → 接続 → 肉）

| Phase | 内容 | Control Center での意味 |
|-------|------|--------------------------|
| **1 魂の完成** | Approval Queue Core、Audit、`Bridge Contract`、`Local Pilot Full Loop`、`Ichikishima Orchestrator` など **中核が通る** | アプリ無し。**到達**: `READY_FOR_LOCAL_FULL_LOOP`（ローカルループ／稼働A） |
| **2 仮の操作盤** | **Control Center V1** — Read-only Dashboard | 状態バッジ・件数・最新レポート表示。**実行・起動しない**または dry-run／無効のみ |
| **3 Bridge Pilot 接続** | Local Pilot の安全パイプラインをボタン化（許可リスト内） | `Run Local Pilot` など。**まだ Hermes 実本体連携とは限らない** |
| **4 部屋 UI** | Hermes / Ichikishima / Approval / Audit / Memory / Escalation 等の **論理レイアウトを画面化** | エージェント稼働感の情報設計。
| **5 可視化・肉付け** | Flow / Ambient / 演出 | React Flow・R3F 等。**魂と神経が揃ってから**。 |

※ **見た目を先に作らない**。魂未完成のゴージャス UI は、裏側の保証なしボタンの温床になり得る。

---

## V0 — 仕様書のみ（達成済み想定）

**成果物**: `CONTROL_CENTER_*.md`、進捗ドキュメント追記。  
**やらない**: UI、`npm install`、外部通信、Hermes 実本体、DB、MT5/EA。

---

## V1 — Read-only Dashboard（**仮の操作盤／神経系**）

Soul Phase 1 が **最低限ローカル完走できる**前提で着手する（未達なら V1 で「データなし」を正直に表示する）。

**この段階で作るだけでよいもの:**

- **現在ステータス**／**READY 状態**の表示  
- **最新 Goal の結果概要**（`GOAL_COMPLETION_REPORT` を読んだ要約だけでも可・マスク済み）  
- **Approval Queue 件数**（pending/held 等の集約。本文は一覧は任意）  
- **Audit Log 件数**または短いタイムラインミニ（マスク済みのみ）  
- **最新 Approval Report**（Markdown 表示、`CONTROL_CENTER_*` の禁止表示ルール順守）  
- **Morning Review**（該当レポートまたは要約への参照）  
- **Stop All** は **ラベルのみまたは無効**。実処理は未接続でも可（no-op で明示）。

**この段階でやらないもの:**

- 3D／Ambient／React Flow メイン用途  
- Hermes **実本体**の自動起動  
- 危険操作実行（execute / network / git / delete 実効）  
- EA/MT5・自動発話・外部送信  

V1 は **肉付けではなく、自分の頭を替えにしないための確認画面**です。

### V1 精密化（2026-05-03 稼働前総点検で固定）

1. **V1 は read-only dashboard** — 操作は行わない。
2. **最初に表示するカード（推奨順）**: `READY_FOR_LOCAL_FULL_LOOP` の有無、`APPROVAL_QUEUE_READY` 件数、`AUDIT_LOG_READY` 行数近似、`NEEDS_USER_APPROVAL`、`HERMES_BRIDGE_READY`（shadow）、`CONTROL_CENTER_V1_DESIGN_READY`（条件付き）。
3. **最初に読むデータソース**: （a）`getControlCenterReadonlyData` / `buildControlCenterReadonlyStatus` 互換スナップショット、（b）Summary-only（`approval-queue-summary` / `audit-log-summary`）で件数のみ、（c）`docs/ichikishima/MORNING_REVIEW_REPORT.md` 等の**相対パス参照**（本文はユーザー操作で開くまで読まない構成を推奨）。
4. **ボタン**: なし、または **すべて disabled** と明記。実装は V3 以降の Pipeline 限定。
5. **UI 候補比較**（今回は選定のみ・実装しない）: Electron+React / Tauri+React / WebView2+local backend / Browser UI — 比較は `CONTROL_CENTER_ARCHITECTURE.md` §2 を正とする。**今は実装しない理由**: raw fs を renderer に載せる事故を避け、Bridge Final Review 承認前に起動面を増やさない。
6. **UI 開始前の条件**: `HERMES_BRIDGE_FINAL_REVIEW.md` 承認済み、`READY_FOR_LOCAL_FULL_LOOP` 維持、secrets 非表示ポリシーのレビュー済み。
7. **UI 開始時の停止条件**: Hermes 実本体の自動起動要求、外部通信、依存追加、MT5/EA、memory DB、承認後自動実行など — 詳細は Bridge Final Review §3。
8. **secrets は表示禁止**。Approval 済み項目も **自動実行しない**。
9. **コード側の達成済み副成果（UI ウィンドウは未着手）**: `CONTROL_CENTER_V1_API_CONTRACT.md`、`getControlCenterReadonlyData` と Summary、`HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md`、**`HERMES_BRIDGE_PILOT_SPEC.md`**、**`HERMES_BRIDGE_OPERATION_MATRIX.md`**、Bridge Pilot Runner（実 Hermes 無し）。
10. **UI Shell 実装に入る前の設計 SPEC（ウィンドウは未着手）**: `CONTROL_CENTER_V1_UI_SPEC.md`、`CONTROL_CENTER_V1_SECURITY_MODEL.md`、`CONTROL_CENTER_V1_IPC_CONTRACT.md`（`controlCenter.readonly.getSnapshot`）、`CONTROL_CENTER_V1_SCREEN_SPEC.md`、`CONTROL_CENTER_V1_IMPLEMENTATION_READINESS.md`。
11. **UI Shell（静的 mock・契約テスト・Static Shell／アプリ本体は未着手）**: `CONTROL_CENTER_V1_UI_SHELL_SPEC.md`、`CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`、`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`、`CONTROL_CENTER_V1_UI_SHELL_TEST_PLAN.md`、`CONTROL_CENTER_STATIC_SHELL_JSON_GUIDELINES.md`、`docs/ichikishima/mockups/control-center-v1-readonly.html`、`docs/ichikishima/mockups/control-center-v1-static-shell.{html,css,js}`、`control-center-v1-snapshot.sample.json`。
12. **App Management Foundation（read-only・コード到達）**: `CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md`、`APP_ONLY_OPERATION_ROADMAP.md`、`control-center-rooms.ts`、`control-center-app-snapshot.ts`、`control-center-readonly-ipc.ts`（**`src/main/index.ts` で read-only IPC 登録済**）、`CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`、`CONTROL_CENTER_PRELOAD_RENDERER_CONTRACT.md`。**preload は `window.ichikishimaControlCenter.getAppSnapshot()` のみ**。**Renderer read-only App Shell**（`src/renderer/src/screens/ControlCenterAppShell/ControlCenterAppShell.tsx`、Layout に `controlCenter` ビュー）— **`getAppSnapshot` のみ**、実行系ボタンなし、明示エラー、**CONTROL_CENTER_APP_SHELL_UI_SPEC.md** で固定。**実 Hermes・WSL・exec・承認自動実行は未実装**。**packaged `projectRoot`** は **`join(__dirname, '../..')` 前提・別 Goal で解決 pending**。

---

## V2 — Queue / Audit ビューの強化（任意・読取中心）

- キュー一覧・イベント一覧のスクロール（常にマスク済み）。
- Goal/Morning と同様、**読み・フィルタのみ**。

---

## V3 — Sandbox Pipeline ボタン（Phase 3 相当）

- `Run Local Pilot` と `Stop All`（許可済み runner のみ）。
- 危険系ボタンは **存在しない**。

---

## V4〜V5 — 可視化プロト・アンビエント（Phase 5 の入口）

- React Flow / R3F は **状態の視覚化のみ**。音声・自動発話なし。

---

## V6 — Hermes Bridge Pilot（実本体は別 Goal でゲート済みのみ）

---

## V7 — 実プロジェクト read-only

---

## hermes-desktop との作業分担（参考）

| 領域 | hermes-desktop | Control Center |
|------|----------------|----------------|
| Zone 型・安全実装の先行 | ○（参考になる） | 将来は再利用または API 経由で利用 |
| UI | 製品とは別（参考） | 独自 |
| Bridge 契約 | 別 Goal で文書化 | アプリ側は契約準拠のクライアントのみ |

---

## リスクと緩和

| リスク | 緩和 |
|--------|------|
| UI に危険操作が混ざる | パイプライン許可リスト + Code review |
| Electron で renderer に fs が漏れる | main/preload を固定ルールで監査 |
| 魂未完で Phase 5 に進む | V1 が「Not ready」状態を明示し、可視化をブロックしない |

---

## Composer2 に投げる用：Control Center V1 Goal（ひな型）

以下を `/goal` ブロックとしてコピーしてよい（**Soul Phase が未達でも V1 は始められる**が、その場合ダッシュボードは空欄許容と明記）。

```text
/goal
Control Center V1「Read-only Dashboard」を別アプリ（または明示されたブランチ）で実装してください。

前提:
- hermes-desktop はコード依存にしない。
- 「魂」（Zone・Queue・Audit・レビューの安全ループ）は可能なら既に JSONL/API で読めること。未整備でも UI は「状態不明」を表示すること。

達成させるもの（読み取り専用）:
1. READY 状態および現在フェーズの表示
2. Approval Queue の件数（状態別集約）
3. Audit Log の要約または件数
4. Goal Completion Report の概要表示（ファイル読みまたは API）
5. Morning Review の概要表示
6. Stop All は表示のみまたは無効。実処理は未接続可

絶対禁止:
- 危険操作の実効ボタン
- Hermes実本体自動起動
- EA/MT5・外部通信・memory DB writes
- 自動発話・通知
- npm install を hermes-desktop の Autonomy と同一 PR で混線させること（運用ガイドライン順守）

完了条件:
- 上記ウィジェットがローカルで表示される。
- RAW secrets / raw path が画面に出ない。
- CHANGELOG と変更レポート（日本語、禁止表現ルール順守）。
```

---

## 関連文書

- `CONTROL_CENTER_SPEC.md`
- `CONTROL_CENTER_ARCHITECTURE.md`
- `CONTROL_CENTER_ROOMS.md`
- `CONTROL_CENTER_PIPELINES.md`
## 2026-05-07 B-1 Cleanup Addendum

- Canonical Control Center IPC is `controlCenter.readonly.getAppSnapshot`.
- Any older `controlCenter.readonly.getSnapshot` mention is retired historical context and must not be used for implementation.

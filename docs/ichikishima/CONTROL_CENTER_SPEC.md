# Ichikishima Control Center — 製品仕様（V0 / 文書のみ）

本書は **完全独自の Windows 個人利用アプリ**「Ichikishima Control Center」の目的・方針・境界を定義する。  
`hermes-desktop` リポジトリは **参考資料** であり、**コード取り込み・依存追加・設計の丸写しは行わない**。

**V0 の範囲**: 仕様書・設計文書のみ。**UI 実装・Electron/React・npm install・外部通信・Hermes 本体接続・memory DB・MT5/EA は行わない**。

**運用ビジョン（2026-05-03 追記）**: **Cursor / Composer2 / Codex は開発時のみ**。通常運用は **単一の Control Center アプリへ収束**。現時点コードは **`hermes-desktop` 参照実装**。真の製品ウィンドウは **`CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md` の Read-only foundation** と後続フェーズへ。

---

## 0. 開発順序の原則（魂・仮の操作盤・肉付け）

コンセプトは **魂を先に、肉は後**。ただし UI を無期限に延期すると運用できないので、Control Center は **早めに「薄い」仮の操作盤**として置く。

| 順 | 名前 | 意味 |
|---|------|------|
| 1 | **魂** | Hermes/Ichikishima と Zone・危険操作ブロック・Approval Queue・Audit・Review・Memory Candidate・Pipeline の **中核ロジック**。安全境界の保証はここ。 |
| 2 | **仮の操作盤** | Control Center **V1** — 状態・件数・レポートの **読み取り専用**。神経系の確認画面であり、見た目の主役ではない。 |
| 3 | **接続** | API/状態/ログ/キューをダッシュボードから **読める**。続いて許可リスト内の Pipeline だけをボタン化（Sandbox/Bridge Pilot）。 |
| 4 | **肉付け** | 部屋 UI・可視化・Ambient。**魂が未完成のまま**ここを先にしない。 |

### 間違った順番（避ける）

```text
豪華な Control Center を先に
→ ボタンを増やす
→ 安全境界やパイプラインが未完成
→ 押せても無意味または危ない
```
（見た目の自己満足に寄せない。）

### 正しい順番（推奨）

```text
裏側の安全なループが最低限完走できる（稼働A / READY_FOR_LOCAL_FULL_LOOP に近い）
↓
状態が読める薄い Control Center V1（読取専用）
↓
安全な Pipeline だけを順にボタン化
↓
部屋 UI・可視化で肉付け
```

詳細な版番と Phase 対応は `CONTROL_CENTER_IMPLEMENTATION_PLAN.md`。

---

## 1. 目的

1. **複数エージェント（論理ロール）を一元管理する** — Hermes 側作業、イツキシマ審査、承認、監査、記憶候補を同じ「管制塔」で俯瞰する。
2. **起動・停止・稼働中タスクの状態を確認する** — コードを読まなくても「今どこで止まっているか」がわかるようにする。
3. **承認待ち・監査ログ・レポートを確認する** — 判断材料を UI 用語で揃える（実装は後続フェーズ）。
4. **ユーザーがコードを読めなくても判断できる** — 状態バッジ、短い説明、朝/夜レポートの出力先のイメージを固定する。
5. **エージェントを安全に起動/停止する** — 「危険操作を UI から直接実行しない」ことを前提にした start/stop の意味を定義する（実行は常に境界付き API 経由のみを将来想定）。

詳細な部屋別 UI 要件は `CONTROL_CENTER_ROOMS.md`、全体構成は `CONTROL_CENTER_ARCHITECTURE.md`、ボタン・フローは `CONTROL_CENTER_PIPELINES.md`、段階計画は `CONTROL_CENTER_IMPLEMENTATION_PLAN.md` を参照。

---

## 2. アプリ方針

| 項目 | 方針 |
|------|------|
| 対象 OS | Windows（個人利用） |
| 中核 | **hermes-desktop と独立した別アプリ**。参考に留める。 |
| データ | ローカルファースト。原則クラウド送信なし。 |
| 構造 | **フロントエンドとバックエンドを分離**して設計する。 |
| シェル | 将来 **Electron / Tauri / WebView2** 等を候補比較。**V0 では選定のみ**、実装しない。 |
| 安全 | Ichikishima 側の **承認・監査・沈黙ゲート（Speak/ Silence）** を優先。hermes-desktop の画面設計をそのまま踏襲しない。 |

---

## 3. フロントエンド候補（比較のみ）

比較表は `CONTROL_CENTER_ARCHITECTURE.md` に集約。ここでは結論の置き場だけ示す。

- 候補: **Electron + React**、**Tauri + React**、**WebView2 + ローカル FastAPI**、**FastAPI + ブラウザ UI**。
- V0 では **推奨ランクの固定は必須ではない**。Windows 相性・ローカルファイル・可視化・セキュリティ・依存の重さで比較し、V1 実装前に再選定する。

---

## 4. バックエンド責務（概念 API）

以下は **将来のバックエンドが提供しうる API 群の論理名**（V0 では未実装）。

- Zone: read/write 等（raw `fs` は禁止、既存 Autonomy Zone API 思想に合わせる）。
- Approval Queue: 一覧・状態・（将来）遷移リクエスト。
- Audit Log: マスク済みタイムライン・要約。
- Review Mode: Hermes 出力の審査入力/結果表示用。
- Memory Candidate: 候補一覧（**確定保存は別 Goal**）。
- Local Pilot / Bridge Pilot: runner 起停・結果取得（**Sandbox 限定**）。
- Status / Stop All: ヘルス・全停止（**危険実行は含めない**）。

命名の詳細は `CONTROL_CENTER_ARCHITECTURE.md`。

---

## 5. 部屋（Room）一覧

| Room | 概要 |
|------|------|
| Hermes | 工房状態、Pilot/Bridge 状態、blocked 件数、latest report |
| Ichikishima | Shadow、Review、Speak Value、Silence Gate、`shouldSpeak:false` |
| Approval | pending/held/rejected/approved（**approved 未実行**の明示） |
| Audit | マスク済みタイムライン、リスクイベント |
| Memory | 候補のみ。**DB 保存しない** |
| Visualization | 将来: React Flow / R3F 候補。V0 は仕様のみ |
| Escalation | ローカル/クラウド方針。**V0 は外部送信しない** |

詳細は `CONTROL_CENTER_ROOMS.md`。

---

## 6. パイプライン・ボタン案

「ユーザーが押す」操作の論理名と、**禁止する操作**は `CONTROL_CENTER_PIPELINES.md` に記載。

---

## 7. 状態表示（バッジ）

アプリ全体で共有する **読み取り専用状態**の例（実装は後続）:

- `READY_FOR_LOCAL_PILOT`
- `READY_FOR_LOCAL_FULL_LOOP`
- `SHADOW_MODE_READY`
- `REVIEW_MODE_READY`
- `APPROVAL_QUEUE_READY`
- `AUDIT_LOG_READY`
- `HERMES_BRIDGE_READY`（将来）
- `CONTROL_CENTER_V1_DESIGN_READY`（Full Loop と Approval JSONL スナップショットを満たす read-only カードのみ。UI ウィンドウ不要）
- `BLOCKED` / `HOLD` / `NEEDS_USER_APPROVAL`

実際の算出元は既存 Handoff / Readiness と整合させ、**Control Center 側で新しい本番フラグを増やしすぎない**。

---

## 8. 可視化方針（要約）

- **Hermes**: 作業工房（タスク、ファイル、テスト、失敗、承認待ち）。React Flow 系を候補。
- **イツキシマ**: 寄り添い・記憶・沈黙ゲート。Ambient（R3F / Three.js 候補）。役割語: Observe / Recall / Judge / Silent / SpeakCandidate（自動発話は禁止のまま）。

---

## 9. セキュリティ方針

1. UI から **危険操作を直接実行しない**（execute / network / git / delete / push 等）。
2. **承認と実行を分離**。`approved` でも **自動実行しない**（実行エンジンは別 Goal）。
3. **secrets を生表示しない**（`.env`、API キー、memory DB 生、MT5 口座、取引履歴、個人情報）。
4. Audit は **マスク済み・サイズ制限済み**のみ表示想定。
5. Hermes に **raw fs / raw shell / raw network / raw git** を渡さない（Bridge 契約に合わせる）。

---

## 10. 実装フェーズ（概要）

`CONTROL_CENTER_IMPLEMENTATION_PLAN.md` の V0〜V7 に従う。**V0 = 本仕様書および関連ドキュメントのみ**。

---

## 11. V0 で明示的にやらないこと

- UI 実装、Electron/Tauri/WebView2 実装
- `npm install` / 依存追加
- Hermes 本体接続、外部通信
- memory DB / SQLite / MT5 / EA
- 自動発話・通知
- 承認後実行エンジン

---

## 関連文書

- `CONTROL_CENTER_ARCHITECTURE.md`
- `CONTROL_CENTER_ROOMS.md`
- `CONTROL_CENTER_PIPELINES.md`
- `CONTROL_CENTER_IMPLEMENTATION_PLAN.md`

---

## 12. hermes-desktop 側「V1 read-only 状態モデル」参照契約（UI とは別レイヤ）

**別アプリ**で Control Center V1 を組むとき、データ契約の参考として **`src/main/ichikishima/control-center/control-center-status.ts`** の `buildControlCenterReadonlyStatus` 戻り値（`ControlCenterReadonlyStatusModel`）を正とできる。

### 読み取りフィールドの例（秘密・本文を埋め込まない）

| 項目 | 意味 |
|------|------|
| `cards` | §7 に列挙した準備状態カードの集合 |
| `approvalQueueSnapCount` | 当日 JSONL に基づくスナップショット件数 |
| `auditLogApproxLines` | 同日 audit JSONL の行数近似 |
| `latestReportHint` | Approval Report の `reportId` 等メタのみ（全文は読まない運用も可） |
| `*_Hint` （Morning / Goal / Bridge Final / NEXT_GOALS） | **リポジトリ相対パス**のみ。Dashboard はファイル選択で開くまで内容を読まない |
| `hermesOperationalLabel` / `ichikishimaOperationalLabel` | 論理状態（Hermesランタイム起動とは無関係・shadowのみ） |
| `blockedOperationApproxCount` | Local Pilot が記録した blocked/denied 系操作の近似 |
| `riskSummaryLines` | Review 結果からの短文ダイジェスト（長文やシークレット混入を避ける） |
| `nextRecommendedGoalHint` | 自動操作なしの文言ヒントのみ |

Dashboard は **ボタンを付けず**、または **常に disabled** とし、`HERMES_BRIDGE_FINAL_REVIEW.md` の停止条件と整合させること。

# Ichikishima Control Center — Pipelines（V0 / 文書のみ）

「パイプライン」とは **ユーザーがトリガできる安全な作業単位**（将来のボタン/API）の論理名。  
V0 は **名前と入出力・禁止の固定**のみ。

---

## 1. 許可するパイプライン案（高レベル）

| ID | 名称 | 概要 | 前提 |
|----|------|------|------|
| P001 | Run Local Pilot | Sandbox 限定 dummy task。read/write とブロック検証まで | Runner 実装後 |
| P002 | Run Hermes Bridge Pilot | 実 Hermes との限定接続（**Goal 7 以降**） |
| P003 | Review Latest Hermes Report | Review Mode 入力として最新レポートを評価 | レポートが存在すること |
| P004 | Generate Approval Report | 審査結果から承認レポート生成 | Review 済みまたは入力あり |
| P005 | Create Memory Candidates | テキストから候補抽出（**保存しない**） | 許可された入力のみ |
| P006 | Export Morning Report | 朝用サマリー Markdown/テキスト出力 | ログ・キューを読むだけ |
| P007 | View Audit Summary | マスク済み集計ビュー | Audit API |
| P008 | Stop All Agents | **登録済み runner / 論理ワーカーの停止のみ** | 汎用 `taskkill` 禁止 |

V0 では実装しない。**UI にボタンを置く順序**は `CONTROL_CENTER_IMPLEMENTATION_PLAN.md` の V3 以降で検討。

**V1 read-only Dashboard** では **P001〜P008 のいずれもボタン化しない**。画面は `ControlCenterReadonlyStatusModel` 相当の状態・パスヒントのみ。パイプラインは **ログ／ドキュメント上の名前** に留める。

**App Management Foundation** では **部屋カード上の actions はすべて disabled**（`control-center-rooms.ts`）。Pipeline 相当の UI も **恒久 disabled** とする。

---

## 2. 明示的に禁止する「危険パイプライン」

以下は Control Center に **論理ボタンすら載せない**（または恒久無効）。

- Execute arbitrary command  
- Arbitrary network access  
- Git push / destructive git  
- Delete file（Zone ブロック例外を含む **実削除**）  
- MT5 操作・EA の自動変更  
- 任意の外部データ送信（ユーザー承認付きワークフローが別 SPEC になるまで）

---

## 3. フロー例（稼働A 想定）

```text
[Run Local Pilot]
  → Zone read/write
  → blocked 操作は Approval Queue に候補
  → Audit JSONL に追記（将来は API 経由）
  → Hermes 風変更レポート生成
       ↓
[Review Latest Hermes Report]（Ichikishima）
  → Approval Report
  → Approval Queue に follow-up が積まれる場合あり
       ↓
[Export Morning Report]
  → ユーザーが Markdown で確認（コード不要）
```

**稼働B** で Bridge を挟むときは、`[Run Hermes Bridge Pilot]` の前後に Goal 6/7 のゲートを挿入する。

---

## 4. 状態遷移とパイプライン

| 状態 | 例となるパイプライン |
|------|-------------------------|
| `NEEDS_USER_APPROVAL` | P003〜P004 の後で止まる |
| `BLOCKED` | Pilot 内で危険要求が検出された |
| `HOLD` | Review が hold のまま出力 |

---

## 5. 監査との関係

各パイプラインは **開始・完了・失敗**を監査イベントとして残せる設計が望ましい（実装時）。  
V0 では **イベント名の一覧だけ** INTERNAL に持ち、`AUDIT_LOG_SPEC.md` の `kind` と衝突しないよう接頭辞または metadata で区別する方針を後続で詰める。

---

## 関連文書

- `CONTROL_CENTER_SPEC.md`
- `CONTROL_CENTER_ARCHITECTURE.md`
- `CONTROL_CENTER_ROOMS.md`
- `CONTROL_CENTER_IMPLEMENTATION_PLAN.md`

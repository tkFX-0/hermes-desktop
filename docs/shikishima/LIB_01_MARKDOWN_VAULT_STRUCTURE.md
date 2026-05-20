# LIB-01 Markdown Vault Structure

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — structure plan only, no files created in Obsidian
**gate:** HOLD — vault creation requires human action

---

## Proposed Vault: shikishima-library

```text
shikishima-library/
  00_Inbox/          ← 未分類・仮置き
  10_Research/       ← 調査・外部情報・x_search 結果
  20_Development/    ← 実装・変更・commit ログ
  30_Evidence/       ← PASS/HOLD/STOP 証跡
  40_Decisions/      ← GO/HOLD/DEFER 判断・サインオフ
  50_Gates/          ← Level 5 Gate 記録
  60_Handoffs/       ← 次回引き継ぎ・作業再開
  70_Daily_Logs/     ← 日次作業ログ
  80_Post100/        ← post-100 候補記録
  90_Archive/        ← 完了・非アクティブ
  _templates/        ← ノートテンプレート
  _index.md          ← Vault 索引
```

---

## Folder Contents

### 00_Inbox
- 未分類の一時置き場
- 整理後は 10〜80 に移動

### 10_Research
```text
x_search 結果
Google I/O 調査
技術調査
競合調査
```
Naming: `YYYY-MM-DD_<topic>.md`

### 20_Development
```text
ClaudeCode 作業結果
実装サマリー
変更ファイル
commit hash
typecheck 結果
```
Naming: `YYYY-MM-DD_<task-id>_<subject>.md`

### 30_Evidence
```text
PASS/HOLD/STOP 証跡
runtime 確認
x_search 実行証跡
Gate 証跡
```
Naming: `YYYY-MM-DD_<gate-id>_EVIDENCE.md`

### 40_Decisions
```text
GO/HOLD/DEFER 判断
人間サインオフ
方針変更記録
```
Naming: `YYYY-MM-DD_<decision-id>_DECISION.md`

### 50_Gates
```text
各 Gate の現在ステータス
必要な GO 条件
```
Naming: `<GATE-ID>_STATUS.md`

### 60_Handoffs
```text
次回チャット引き継ぎ
ClaudeCode 向け Task
Codex 向け監査 Task
```
Naming: `YYYY-MM-DD_HANDOFF_<target>.md`

### 70_Daily_Logs
```text
日次作業サマリー
完了タスク
残タスク
```
Naming: `YYYY-MM-DD_DAILY.md`

---

## Vault Creation Policy

```text
Phase 1-2:
  - vault は人間が手動作成
  - ファイルは人間が貼るまたは ClaudeCode が docs として出力
  - しきしまは vault に直接書かない

Phase 3 (OB-01 gate 後):
  - しきしまが指定フォルダにのみ書く
  - 書き込み前に rawValues チェック必須
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
vault_created:      false  (human action required)
obsidian_connected: false
```

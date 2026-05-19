# Phase 5 — Obsidian Local Note Gate Policy

**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)
**Gate ID:** OBS-LOCAL

---

## 現状

Obsidian local note 書き込みは FUTURE Gate。
Gate ダッシュボードで `OBS-LOCAL: FUTURE` として表示中。

---

## OBS-LOCAL を開けるための条件

```yaml
obs_local_go_prerequisite:
  vault_identified: true           # 対象 vault のパス確定
  allowed_folders_defined: true    # 書き込み許可フォルダを限定
  content_rule_defined: true       # raw value / secret を書かないルール
  file_naming_policy: true         # ファイル名規則
  overwrite_policy: true           # 既存ファイルを上書きするか
  rollback_plan: true              # 誤書き込み時の対処
```

---

## 承認フォーム

```yaml
obs_local_go_form:
  date:
  time_window_start:
  time_window_end:
  vault_path:               # ローカルパス (evidence にのみ記録、chat に出力しない)
  allowed_folders:          # 例: ["AI-Notes", "Shikishima"]
  allowed_file_pattern:     # 例: "shikishima-*.md"
  content_rule:             # "raw values 禁止、secrets 禁止"
  overwrite_policy:         # append のみ / overwrite 可
  rollback_plan:            # Obsidian の Undo または手動削除
  evidence_file:            # docs/shikishima/OBS_LOCAL_EVIDENCE_YYYY-MM-DD.md
```

---

## 不変安全要件

```
vault path を chat に出力しない
raw token / secret / 個人情報を書き込まない
vault 外への書き込み禁止
sync/API による外部送信禁止
```

> AIは作るところまで。鍵と発射ボタンは人間。

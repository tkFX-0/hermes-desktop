# しきしま実運用100% — Runtime Visual Recheck Plan

**Baseline:** aadea91 | **Prepared:** 2026-05-19

**重要:** これは計画書です。runtime は HOLD。time_window GO が必要。

---

## 概要

AT-07〜AT-15 の UI 実装と Room Layout diamond 配置を、
実際の npm run dev 起動環境で目視確認する。

---

## 必要な人間 GO

```yaml
runtime_visual_recheck_go:
  date:
  time_window_start:
  time_window_end:
  approved_command:     npm run dev
  working_directory:    C:/Users/81903/Desktop/プロジェクトファイル/hermes-desktop
  observation_target:   Agent Theater / Control Center / 管制室
  shutdown_method:      Ctrl+C in terminal
  post_run_checks:
    - runtime_stopped: confirm terminal returned
    - git_status: git status --short → tracked_dirty = 0
    - port_check: confirm port 5173 released
  evidence_file:        docs/shikishima/AT14_ROOM_VISUAL_EVIDENCE_YYYY-MM-DD.md
```

---

## 観察スコープ

### Agent Theater

| 対象 | 確認ポイント |
|---|---|
| Room diamond layout | はじめ(上) / しずめ-しきしま★-つむぎ(中) / しるべ(下) の配置 |
| しきしま COMMAND ラベル | 中央に青字で表示 |
| ControlRoomLayout | safety badge strip / NightWindow / DotGrid |
| AT-07 HandoffLane | 6ステップ / HandoffCard 浮遊 |
| AT-08 Worker Status | 5カード / Lv5 人間GO必須 バッジ |
| AT-09 Resume Queue | 4タスク / 外部write:blocked 赤 |
| AT-10 Runaway Guard | AI自動実行禁止 赤バッジ / 9ガード |
| AT-11 Worker Routing | 5ルートカード / auto-dispatch:disabled |
| AT-12 Gate Dashboard | 12ゲートカード / productionReady:false |
| AT-13 Visual Polish | 横スクロールなし / 文字読みやすい |
| AT-15 UI Scale | フォントサイズ十分 |

### Control Center / UX

| 対象 | 確認ポイント |
|---|---|
| PageShell safety strip | live snapshot / stale 表示 |
| テーマトグル | ☀/🌙/🖥 ボタン動作 |
| Ctrl+wheel zoom | zoom in/out / Ctrl+0 リセット |
| CC/MC 先頭ナビ | サイドバー配置 |

---

## STOP 条件

```
raw secret / token / IP / local path が表示された
productionReady: true が表示された
execution: enabled が表示された
Level 5 ボタン (push/OAuth等) が動作した
外部接続 / ログインプロンプトが発生した
runtime が Ctrl+C 後 30 秒以内に停止しない
git status が unexpected に変化した
安全ラベルを隠す重大 overflow が発生した
```

---

## 停止手順

```
1. Ctrl+C (terminal)
2. terminal prompt が戻ることを確認
3. git status --short → tracked_dirty = 0 確認
4. port 5173 解放を確認 (任意)
```

---

## evidence 作成 (Level 4)

```
テンプレート: AT_14_RUNTIME_VISUAL_RECHECK_EVIDENCE_TEMPLATE.md
ファイル名:   AT14_ROOM_VISUAL_EVIDENCE_YYYY-MM-DD.md
場所:         docs/shikishima/
commit 後:    人間 push GO
```

---

> runtime は HOLD。このドキュメントは GO ではない。

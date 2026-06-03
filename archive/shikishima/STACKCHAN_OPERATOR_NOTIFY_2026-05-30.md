# StackChan オペレーター通知（意図別発話）

Date: 2026-05-30

## 概要

Cursor 完了・プラン選択・人間判断・質問・ワークフロー・開発レビューで **別フレーズ・別デバウンス** の StackChan 発話。

実装: [stackchan-operator-notify.mjs](../../scripts/lib/stackchan-operator-notify.mjs)

## intent 一覧

| intent | 典型トリガ | 既定フレーズ |
|--------|------------|--------------|
| `cursor_answer_complete` | Cursor stop（通常完了） | Cursorの作業が完了しました。 |
| `plan_selection_needed` | Cursor plan / プラン待ち | プランの選択が必要です。画面を確認してください。 |
| `human_judgment_needed` | 承認・判断待ち | ご判断をお願いします。Discordを確認してください。 |
| `operator_question` | Cursor が質問 | 質問があります。Cursorを開いてください。 |
| `workflow_human_gate` | 自律 WF → human | ワークフローが人間確認待ちです。 |
| `kaihatu_review_hold` | !kaihatu レビュー HOLD | 開発レビューで確認が必要です。 |

## env

| 変数 | 意味 |
|------|------|
| `SHIKISHIMA_STACKCHAN_HOLD=1` | 全発話 OFF |
| `SHIKISHIMA_OPERATOR_NOTIFY=0` | 意図別通知すべて OFF |
| `SHIKISHIMA_OPERATOR_NOTIFY_<INTENT>=0` | 単一 intent OFF |
| `SHIKISHIMA_NOTIFY_PHRASE_<INTENT>` | フレーズ上書き |
| `SHIKISHIMA_NOTIFY_DEBOUNCE_MS_<INTENT>` | デバウンス ms |
| `SHIKISHIMA_CURSOR_NOTIFY_INTENT` | Cursor フック intent 固定 |

## 手動試験

```powershell
node scripts/shikishima-operator-notify.mjs --intent plan_selection_needed --dry-run
node scripts/shikishima-operator-notify.mjs --intent human_judgment_needed
node scripts/shikishima-cursor-response-complete.mjs --intent cursor_answer_complete --dry-run
```

## 質問票（記入済み 2026-05-30）

- Chisiki **C** を選択 → **本番オンチェーン実装は別 GO（CHI-C = H）**。ドキュメントのみ反映。
- StackChan **今すぐ** → `node scripts/shikishima-stackchan-resume.mjs` 後、上記試験。

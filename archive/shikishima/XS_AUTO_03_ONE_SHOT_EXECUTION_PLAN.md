# XS-AUTO-03 One-shot Execution Plan

gate: XS-AUTO-03
status: READY FOR HUMAN GO
x_oauth_required: false
xacc_status: HOLD

## 重要: XS-AUTO と XACC の区別

```text
XS-AUTO: read-only 調査 / OAuth 不要 / 公開情報 + ユーザー提供テキスト
XACC:    X アカウント OAuth 接続 / HOLD 維持
```

## One-shot Execution Flow

```
1. Human chooses topic
   ↓
2. Human provides exact query or source URL/text
   ↓
3. Shikishima classifies source scope
   (public / user-provided / login-required → STOP if login-required)
   ↓
4. One read-only search/run (count = 1)
   ↓
5. Summary generated (FACT / MANUAL_REPORTED / ESTIMATED / UNKNOWN 分類)
   ↓
6. Evidence saved to docs/shikishima/XS_AUTO_03_RUN_[id]_[date].md
   ↓
7. Gate restored to HOLD
   ↓
8. No recurring patrol — END
```

## First Recommended Topic

```text
search_topic:      StackChan voice integration / speech push API / Discord Bot integration
source:            user-provided X post text (ユーザーがペーストしたテキスト)
allowed_run_count: 1
x_oauth_required:  false
xacc_status:       HOLD
```

**Reason:**
ユーザーが StackChan 実装アイデアに関する X 投稿内容を提供済み。
SC-AI-00/01 (音声統合) と SC-CAM-00/01 (カメラ) の目標に直結する。
X OAuth は不要 — ユーザー提供テキストは MANUAL_REPORTED として処理可能。

## Source Scope Decision Tree

```
ユーザーがテキストを貼り付けた
  → MANUAL_REPORTED として処理 → GO (OAuth不要)

公開 URL を提供された
  → ログイン不要か確認 → YES → FACT として処理 → GO
                       → NO  → STOP / ユーザーにテキスト提供を依頼

ログインが要求された
  → 即 STOP → ユーザーにテキスト提供を依頼

OAuth / Token が要求された
  → 即 STOP → XACC-01 ゲートが別途必要
```

## STOP Conditions

| 条件 | アクション |
|---|---|
| login が要求された | 即停止 / gate HOLD 復帰 |
| token が要求された | 即停止 / gate HOLD 復帰 |
| write アクション誘発 | 即停止 / gate HOLD 復帰 |
| 2 回目の run が発生 | 即停止 / gate HOLD 復帰 |
| hidden loop 開始 | 即停止 / gate HOLD 復帰 |

## Evidence File Format

```
docs/shikishima/XS_AUTO_03_RUN_[ID]_[YYYY-MM-DD].md
```

Template: `XS_AUTO_03_EVIDENCE_TEMPLATE.md`

## After Action

- gate_restored_hold: true
- XACC-01: HOLD 維持
- 次回実行には新規 human GO が必要

_Created: 2026-05-21_
_XACC-01 remains HOLD_

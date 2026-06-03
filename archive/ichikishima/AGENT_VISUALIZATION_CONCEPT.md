# Agent Visualization Concept

## 1. 目的

Hermesやイツキシマが動いている様子を、実データに連動して可視化する。

目的は「賢そうに見せる」ことではない。今何が起きているか、何を待っているか、どこにリスクがあるかをユーザーが直感的に理解できるようにする。

## 2. 原則

- 実データに連動する。
- 何もしていない時は、何もしていないと分かる表示にする。
- 演出は状態の補助であり、状態そのものを偽装しない。
- Dev ModeとAmbient Modeを分ける。
- 高リスク状態と承認待ちは明確に出す。

## 3. Dev Mode

Dev Modeは、開発中に状態を確認するための表示。

表示項目:

- 現在タスク。
- 現在フェーズ。
- ループ回数。
- 読んだファイル数。
- 触ったファイル。
- テスト実行状況。
- 失敗回数。
- リスクレベル。
- 承認待ち状態。
- Sandbox内か外か。

状態例:

```text
Planning
Implementing
Testing
Fixing
Reporting
Approval Review
Blocked
```

## 4. Ambient Mode

Ambient Modeは、常時表示やサブモニター向けの静かな表示。

表現:

- ポリゴン。
- 粒子。
- ネットワーク。
- 記憶参照エフェクト。
- 発話/沈黙状態。
- Hermesとイツキシマのデータフロー。

ただし、エフェクトは実状態に紐づける。

例:

- 記憶照合中だけノードが淡く接続される。
- 沈黙判定中は粒子が落ち着く。
- 承認待ちは色と形で明示する。
- エラー時は装飾ではなく警告として出す。

## 5. Hermesで可視化するもの

- 現在タスク。
- ループ回数。
- 読んだファイル数。
- 触ったファイル。
- テスト実行状況。
- 失敗回数。
- 現在フェーズ。
- リスクレベル。
- 承認待ち状態。

Hermesの状態遷移:

```text
Plan
  → Draft
  → Patch
  → Test
  → Failure Log
  → Fix
  → Report
  → Ichikishima Review
  → Approval Queue
```

## 6. イツキシマで可視化するもの

- Observe。
- Recall。
- Judge。
- Silent。
- Speak。
- Wait。
- Approval Review。

イツキシマの状態遷移:

```text
Observe
  → Recall
  → Judge
  → Silent
```

または:

```text
Observe
  → Recall
  → Judge
  → Approval Review
  → Speak
  → Wait
```

## 7. データソース案

初期実装では、次のようなローカルJSONを表示に使う。

```json
{
  "agent": "ichikishima",
  "state": "Silent",
  "last_transition_at": "ISO-8601",
  "current_task": null,
  "risk_level": "low",
  "approval_waiting": false,
  "files_read": 0,
  "files_touched": [],
  "tests": {
    "running": false,
    "passed": 0,
    "failed": 0
  }
}
```

Hermesも同じ形式に揃える。

## 8. 避けること

- 実際には何もしていないのに活動中に見せる。
- リスクがあるのに穏やかな演出だけにする。
- 承認待ちを見逃しやすくする。
- 外部送信や記憶更新を曖昧に見せる。
- ユーザーの注意を奪い続ける。

## 9. 初期実装順序

1. 状態JSONスキーマを作る。
2. Dev Modeでテキスト表示する。
3. Hermesのループ状態を表示する。
4. イツキシマの沈黙/発話/承認待ちを表示する。
5. Ambient Modeを実データに接続する。
6. 視覚演出を追加する。

見た目より先に、状態の正確さを実装する。

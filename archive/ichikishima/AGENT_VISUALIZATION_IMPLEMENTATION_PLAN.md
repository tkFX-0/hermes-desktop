# Agent Visualization Implementation Plan

## 1. 目的

Hermesとイツキシマを見分けやすく可視化するため、UI実装前にデータ構造、状態イベント、実装順序を整理する。

この文書は実装計画であり、UI実装、npm install、依存追加はまだ行わない。

## 2. Hermes Visualization

候補:

- React Flow / XYFlow。
- 作業工房。
- タスク、ファイル、テスト、失敗、承認待ち。
- 機械的、構造的、ログ寄り。

表示対象:

- 現在タスク。
- 現在フェーズ。
- 読み取り/書き込み対象。
- テスト結果。
- 拒否操作。
- approval request candidate。
- audit event candidate。

## 3. Ichikishima Visualization

候補:

- React Three Fiber / Three.js。
- 寄り添い、記憶、沈黙ゲート。
- Observe / Recall / Judge / Silent / SpeakCandidate / ApprovalReview / Blocked。
- 粒子、ポリゴン、光、記憶ネットワーク。

表示対象:

- Shadow Mode状態。
- Silence Gate結果。
- Speak Value score。
- Review Mode判定。
- 危険境界検出。

## 4. 共通イベント

実装済み候補:

- `AgentVisualizationEvent`
- `agent`
- `phase`
- `status`
- `riskLevel`
- `message`
- `metadata`
- `contentIncluded:false`

方針:

- content本文や秘密情報を含めない。
- UIはイベントを購読する。
- 内部実装とUIを直接結合しない。

## 5. 実装順序

1. V1 状態カード。
2. V2 Hermes Flow。
3. V3 Ichikishima Ambient Panel。
4. V4 3D Ambient。
5. V5 Trace / Observability検討。

## 6. まだやらないこと

- UI実装。
- 3D実装。
- npm install。
- 依存追加。
- 外部traceサービス接続。
- 秘密情報やmemory DB内容の表示。

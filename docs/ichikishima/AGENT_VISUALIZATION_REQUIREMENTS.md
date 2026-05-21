# Agent Visualization Requirements

## 1. 基本方針

Hermesとイツキシマの可視化は、自己満足の演出だけで終わらせない。

目的は、ユーザーが次を直感的に理解できるようにすることである。

- 今、何が動いているか。
- 何を待っているか。
- どこで失敗しているか。
- どこにリスクがあるか。
- 承認待ちか、沈黙中か、作業中か。

原則:

- 実データに連動した表示のみを原則とする。
- 実際には何もしていないのに、賢そうに見せる演出は禁止する。
- Dev ModeとAmbient Modeを分ける。
- Dev Modeは確認と判断のための表示にする。
- Ambient Modeは雰囲気を持たせてもよいが、必ず実状態と対応させる。
- 最初は要件定義のみで実装しない。

## 2. 採用方針

可視化は完全自作しない。描画やレイアウトには既存ライブラリを使う。

ただし、可視化データ構造はイツキシマ専用にする。ライブラリの都合に合わせて、Hermesやイツキシマの状態表現を歪めない。

候補:

- Dev Mode: React Flow / XYFlow系。
- Ambient Mode: React Three Fiber / Three.js系。
- Trace / Observability: Langfuse / AgentOps系。
- LangGraph Studio系: LangGraphを採用する場合のみ検討。

既存サンプル確認候補:

- Dev Mode参考: React Flow official examples。
- Dev Mode参考: XYFlow / React Flow example apps。
- Ambient Mode参考: React Three Fiber official examples。
- Ambient Mode参考: pmndrs / react-three-fiber examples。
- Trace / Observability参考: Langfuse demo / traces。
- Trace / Observability参考: AgentOps dashboard / agent observability。

採用時の注意:

- npm installや依存追加は、別タスクで承認後に行う。
- 外部サービス連携は初期実装では行わない。
- trace基盤を使う場合も、秘密情報や個人情報を送らない設計を先に作る。

## 3. Hermesとイツキシマの分離

Hermesとイツキシマは、同じAI活動として混ぜて表示しない。

### Hermes Visualization

Hermesは、開発工房、作業エンジン、ループ実行体として見える化する。

方針:

- Dev Mode中心。
- ノード、エッジ、タスク、ファイル、テスト、失敗、承認待ちを表示する。
- 候補ライブラリはReact Flow / XYFlow系。
- 見た目は機械的、構造的、作業ログ寄りにする。
- 作業している感を出すが、実際の作業イベントに基づく表示だけにする。

表示の中心:

- タスク進行。
- ファイル読み取り。
- 変更候補。
- テスト実行。
- 失敗。
- 再試行。
- レポート生成。
- 承認待ち。

### イツキシマ Visualization

イツキシマは、寄り添い、記憶、沈黙ゲート、状況認識として見える化する。

方針:

- Ambient Mode中心。
- Observe / Recall / Judge / Silent / Speak / Wait / Approval Reviewを表示する。
- 候補ライブラリはReact Three Fiber / Three.js系。
- 見た目は粒子、ポリゴン、光、記憶ネットワーク、呼吸感のある表示にする。
- 見守っている感を出すが、実際の観察、記憶照合、判定状態に基づく表示だけにする。

表示の中心:

- 現在状態。
- 沈黙理由。
- 介入価値。
- 記憶参照。
- 承認レビュー状態。
- 発話または待機。

### 見分けやすさのルール

- Hermesは「作業している感」を出す。
- イツキシマは「見守っている感」を出す。
- Hermesはタスク進行、変更、テスト、失敗を明示する。
- イツキシマは現在状態、沈黙理由、介入価値、記憶参照を明示する。
- 両者を同じ画面に出す場合も、色、形、動き、レイアウトで混同しない。
- Hermesは左または下に配置する。
- イツキシマは右または中央に配置する。
- Hermesは線形の作業フロー、イツキシマは周囲を観察する状態場として表現する。

## 4. Dev Mode

Dev Modeは、開発・審査・承認判断のための実用表示である。

表示したいもの:

- Hermesの現在タスク。
- Hermesのループ回数。
- 読んだファイル数。
- 変更候補ファイル。
- テスト実行状況。
- 失敗回数。
- 現在フェーズ。
- リスクレベル。
- 承認待ち状態。
- 拒否された操作。
- 監査ログ。
- イツキシマの審査結果。

Dev Modeでは、見た目よりも正確さを優先する。

例:

```text
Hermes
- phase: Testing
- loop_count: 3
- risk_level: medium
- approval_waiting: false
- last_denied_operation: network

Ichikishima
- phase: Approval Review
- judgment: hold
- reason: tests_not_run
```

## 5. Ambient Mode

Ambient Modeは、サブモニターや常時表示向けの静かな表示である。

イツキシマの状態:

- Observe
- Recall
- Judge
- Silent
- Speak
- Wait
- Approval Review

Hermesの状態:

- Idle
- Planning
- Reading
- Editing
- Testing
- Failed
- Reporting
- Blocked

表現候補:

- 粒子。
- ノード。
- ポリゴン。
- 光。
- 接続線。
- 状態に応じた色、密度、動きの変化。

対応例:

- Observe: 穏やかな粒子の移動。
- Recall: 記憶ノードへの淡い接続線。
- Judge: ノードの集中と一時停止。
- Silent: 低輝度で安定。
- Speak: 短い発光と表示領域の強調。
- Approval Review: 明確な枠線と承認待ち色。
- Hermes Testing: テストノードの点滅。
- Hermes Failed: 装飾ではなく警告として表示。
- Hermes Blocked: 承認待ちまたは拒否理由を明示。

Ambient Modeでも、実状態にない処理は表示しない。

## 6. 状態イベント設計

Hermesとイツキシマの可視化は、共通イベントを元に描画する。

案:

```ts
interface AgentVisualizationEvent {
  event_id: string;
  timestamp: string;
  agent: "hermes" | "ichikishima" | "user" | "system";
  phase: string;
  action_type:
    | "observe"
    | "recall"
    | "judge"
    | "speak"
    | "silent"
    | "read"
    | "edit"
    | "test"
    | "report"
    | "approval"
    | "deny"
    | "error";
  target?: string;
  risk_level: "low" | "medium" | "high" | "reject_by_default";
  status: "started" | "running" | "succeeded" | "failed" | "blocked" | "denied";
  message: string;
  metadata?: Record<string, unknown>;
}
```

設計方針:

- UIはこのイベントを購読して表示する。
- Hermesやイツキシマの内部実装をUIに直接結合しない。
- `target`には必要最小限の情報だけを入れる。
- ファイルパスやエラー内容は、必要に応じてマスクする。
- 未確認の状態を成功扱いにしない。

## 7. 禁止する可視化

次の表示は禁止する。

- 実際には行っていない処理を表示する。
- LLMの推論過程を断定的に見せる。
- 安全審査を通っていない操作を成功扱いにする。
- ユーザーに過剰な安心感を与える。
- 秘密情報や個人情報を画面に表示する。
- `.env`、APIキー、secrets、memory DB内容、MT5口座情報、取引履歴、長期記憶の生データを表示する。
- 失敗や拒否を雰囲気演出だけで隠す。
- 承認待ちを見逃しやすい装飾にする。

表示は「安心させるため」ではなく、「判断できるようにするため」に使う。

## 8. プライバシー・安全

表示ログに次を出さない。

- `.env`
- APIキー。
- secrets。
- memory DB。
- MT5口座情報。
- 取引履歴。
- 個人情報。
- SSHキー。
- ブラウザCookie。
- クラウド認証情報。
- 本番設定。
- 長期記憶の生データ。
- LLMの内部思考を断定的に見せる表現。

安全方針:

- ファイルパスは必要に応じてマスクする。
- 秘密情報らしき値は表示前に拒否または伏せ字化する。
- 外部送信しない。
- ローカル表示を基本とする。
- trace基盤を使う場合も、外部送信範囲は別タスクで明示承認する。
- 可視化ログをmemory DBや長期記憶へ自動保存しない。

## 9. 最小実装順序

### V0: Requirements Only

- 要件ドキュメントのみ。

### V1: Hermes Dev Panel

- 現在タスク。
- 現在フェーズ。
- ループ回数。
- 失敗回数。
- リスクレベル。
- 承認待ち。
- 最新ログ。

### V2: Hermes Flow View

- React Flow風のノード/エッジ表示。
- `タスク -> 読み取り -> 編集 -> テスト -> レポート` の流れ。
- 拒否操作、失敗、承認待ちを明示する。

### V3: Ichikishima Ambient Panel

- Observe / Recall / Judge / Silent / Speakを表示する。
- 沈黙理由を表示する。
- 介入価値スコアを表示する。
- 承認レビュー状態を表示する。

### V4: Ichikishima Ambient 3D

- React Three Fiber / Three.js候補を検証する。
- 粒子、ポリゴン、記憶ネットワーク、状態に応じた光の変化を表示する。
- 実データに対応しない装飾を入れない。

### V5: Trace Integration

- Langfuse / AgentOpsなどのtrace基盤検討。
- 外部送信、秘密情報除外、ローカル運用可否を確認してから進める。
- 外部送信を伴う場合は、承認キューと変更レポートを必須にする。
- LangGraph Studio系は、LangGraph採用時のみ検討する。

## 10. 今回の扱い

今回は要件定義のみとする。

実施しないこと:

- UI実装しない。
- npm installしない。
- 依存追加しない。
- 外部通信しない。
- trace基盤へ接続しない。
- 既存EA本体やMT5関連には触れない。
- `.env`、APIキー、secrets、memory DB、本番設定、取引履歴、個人情報には触れない。

この文書は、将来Hermesとイツキシマの可視化を実装する前に、表示対象、禁止事項、安全条件、段階的な実装順序を定義するための準備資料である。

## 11. Implementation Planとの関係

実装前の段階計画は `AGENT_VISUALIZATION_IMPLEMENTATION_PLAN.md` に分離する。

現時点では、`AgentVisualizationEvent` 型を用意するだけに留める。UI実装、3D実装、npm install、依存追加、外部trace接続はまだ行わない。

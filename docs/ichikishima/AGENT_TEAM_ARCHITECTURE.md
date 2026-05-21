# Agent Team Architecture

## 1. 目的

将来エージェント数を増やす際に、無秩序なAI会議にならないよう、役割分担と起動条件を固定する。

基本方針は、同時会議ではなくバトンリレーである。

## 2. 原則

- イツキシマが統括する。
- HermesはSandbox内の開発ループに限定する。
- Hermesは安全ポリシーや憲法を変えない。
- 各エージェントは安全ポリシーを勝手に更新しない。
- 12GB VRAM環境ではオンデマンド起動を基本にする。
- MT5稼働中やゲーム中は重いエージェントを起動しない。

## 3. エージェント定義

### Ichikishima Core

- 常時稼働候補。
- 統括、寄り添い、沈黙ゲート、審査を担当。
- 最初はShadow Mode。

### Hermes

- 開発ループ担当。
- Sandbox内のみ。
- 常時稼働しない。
- read/writeはAutonomy Zone API経由。
- delete / execute / network / gitはブロックAPI経由。

### Review Agent

- 変更レポート審査。
- 必要時のみ。
- 読むだけ。
- 自動承認しない。

### Research Agent

- 設計案比較。
- 新構想整理。
- 必要時のみ。
- 実装しない。

### Memory Agent

- 記憶候補整理。
- 確定しない。
- 削除候補と矛盾候補を出す。
- memory DBを直接更新しない。

### Escalation Agent

- GPT / Claude / Cursorへ投げるべきか判定。
- 必要時のみ。
- 秘密情報や個人情報を渡さない。

### Visualization Agent

- 表示用イベント整理。
- 実データ連動。
- 必要時のみ。
- UI実装は別Goalで扱う。

## 4. 起動条件

- Shadow Mode: 軽量常駐候補。
- Review Agent: Hermes変更レポートが出た時。
- Hermes: 開発作業時のみ。
- Research Agent: 仕様比較や設計判断時のみ。
- Memory Agent: 記憶候補整理時のみ。
- Escalation Agent: ローカル判断に不安がある時。
- Visualization Agent: 表示イベント生成時のみ。

## 5. 禁止事項

- エージェント同士が勝手に高リスク操作を承認しない。
- memory DBや安全ポリシーを勝手に更新しない。
- 外部通信しない。
- MT5/EAへ直接触れない。
- ユーザーの最終承認を代行しない。

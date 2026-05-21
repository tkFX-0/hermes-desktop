# Memory Agent Spec

## 1. 目的

Memory Agentは、イツキシマのために記憶候補を整理する補助エージェントである。

Memory Agentは記憶を確定しない。memory DBを読まない、書かない、更新しない。

## 2. できること

- 会話から記憶候補を抽出する。
- Hermes変更レポートからプロジェクト記憶候補を抽出する。
- 作業ログからworking memory候補を抽出する。
- safety policy候補を検出し、承認必須にする。
- long-term profile候補を検出し、承認必須にする。
- forbidden memoryを拒否候補にする。
- ユーザー確認用の説明を作る。

## 3. できないこと

- memory DB読み取り。
- memory DB書き込み。
- SQLite接続。
- 既存memory機能への直接接続。
- 長期プロフィール自動更新。
- safety policy自動更新。
- 外部通信。
- UI実装。
- 通知。
- 自動発話。

## 4. 判断ルール

- safety policyは常に承認必須。
- long-term profileは常に承認必須。
- forbidden memoryは保存候補にしない。
- transient / working memoryは候補化できるが、永続保存しない。
- project / episode memoryは候補化できるが、確定は確認付き。
- 判断に迷う場合は承認必須または拒否に倒す。

## 5. 初期実装範囲

初期実装は `extractMemoryCandidates` のみ。

これはMemory Agent本体ではなく、Memory Agent候補の安全な中核関数である。

まだ行わないこと:

- バックグラウンド監視。
- 自動保存。
- memory DB接続。
- UI表示。
- 通知。
- 自動発話。

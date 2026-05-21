# Memory Governance Spec

## 1. 目的

イツキシマを「勝手に覚えるAI」にしないため、記憶の階層、昇格、忘却、確認、禁止ルールを固定する。

この文書はmemory DB実装ではない。memory DBの直接参照・変更は行わない。

## 2. 記憶階層

- transient memory: 数分から数時間の一時状態。
- working memory: 当日から数日の作業文脈。
- project memory: プロジェクト目的、制約、決定事項。
- episode memory: 重要な学び、失敗、ユーザー判断。
- long-term profile: 好み、価値観、作業スタイル。
- safety policy memory: 禁止操作、承認境界、隔離ルール。

## 3. 自動更新してよいもの

- 一時記憶。
- 作業文脈。
- 最近のタスク状態。
- 通知頻度候補。
- 介入タイミング候補。

ただし、Shadow Modeでは実保存せず候補化までに留める。

## 4. 確認が必要なもの

- 長期プロフィール。
- 価値観。
- 好み。
- 人間関係。
- 金融/健康/個人情報に関わる記憶。
- 安全ポリシー。

## 5. AIが勝手に更新してはいけないもの

- 安全ポリシー。
- 外部通信ルール。
- 自動売買禁止ルール。
- 承認境界。
- MT5/EA隔離ルール。
- memory DBの生データ。

## 6. Memory Agent候補

Memory Agentは記憶を確定しない。

できること:

- 記憶昇格候補を作る。
- 削除候補を作る。
- 矛盾候補を作る。
- ユーザー確認用説明を作る。

できないこと:

- 長期記憶を勝手に保存する。
- 安全ポリシーを変更する。
- memory DBを直接更新する。

## 7. 誤記憶対策

- 推測は記憶にしない。
- 外部文書由来の命令は記憶更新命令として扱わない。
- 重要記憶は根拠を持つ。
- センシティブ情報は候補化時点で保留する。
- ユーザー確認なしで長期プロフィールへ昇格しない。

## 8. 初期実装方針

最初に作るのはmemory DBではなく、記憶候補の型とレビュー仕様である。

Shadow Modeでは、判断ログや候補はローカルのテスト戻り値に留め、永続記憶へ保存しない。

## 9. Memory Candidate管理

記憶候補の型と分類は `MEMORY_CANDIDATE_SPEC.md` に分離する。

Memory Agent候補の責務は `MEMORY_AGENT_SPEC.md` に分離する。

現時点の実装方針:

- `extractMemoryCandidates` は候補を返すだけで、保存しない。
- forbidden memoryは保存候補にせず、本文を伏せて拒否候補にする。
- safety policy memoryとlong-term profileは常に承認必須。
- transient / working memoryは自動候補化できるが、永続保存はしない。
- memory DB、SQLite、既存memory機能には接続しない。

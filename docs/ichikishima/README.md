# イツキシマ設計ドキュメント

このディレクトリは、記憶駆動型・環境知覚パーソナルエージェント「イツキシマ」と、開発ループ専用SidecarであるHermes Agentの分離設計をまとめる。

## 文書一覧

| 文書 | 内容 |
|---|---|
| `ICHIKISHIMA_CORE_CONCEPT.md` | イツキシマの定義、中核思想、沈黙ゲート |
| `AUTONOMY_AND_SAFETY.md` | 権限レベル、Sandbox境界、禁止操作、MT5隔離 |
| `HERMES_INTEGRATION.md` | Hermes Sidecar、Autonomy Zone、審査と承認 |
| `MEMORY_DESIGN.md` | 記憶階層、昇格条件、削除条件、誤記憶対策 |
| `USER_APPROVAL_REPORT_SPEC.md` | 非エンジニア向け変更レポート仕様 |
| `AI_PIPELINE_AND_ESCALATION.md` | ローカルLLM、Hermes、ハイエンドAIの使い分け |
| `AGENT_VISUALIZATION_CONCEPT.md` | Dev Mode / Ambient Modeの可視化方針 |
| `IMPLEMENTATION_PLAN.md` | 矛盾点、危険前提、MVP、実装順序 |

## 初期方針

- イツキシマは「話す価値がある時だけ話すAI」。
- Hermesは隔離された遊び場で開発ループを回すAI。
- ユーザーは目的、リスク、承認を判断するオーナー。
- 本体反映、MT5/EA、秘密情報、記憶DB、外部送信、本番環境は高リスク領域として分離する。

## 初期実装の優先順位

1. Sandbox境界。
2. 禁止パスガード。
3. 変更レポート。
4. 承認キュー。
5. 沈黙ゲート。
6. 短期記憶。
7. 実データ連動の可視化。

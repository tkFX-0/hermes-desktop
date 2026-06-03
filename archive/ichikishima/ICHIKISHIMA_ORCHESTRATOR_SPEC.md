# Ichikishima Orchestrator Integration Spec

## 目的

Hermes Local Pilot の出力を **イツキシマがレビュー・記憶候補化・承認レポート化** する。**発話 (`shouldSpeak`) は常に false** を返すロジックを前提にする（実装は `finalDecision.shouldSpeak: false`）。

## 入力

- `HermesLocalPilotResult`（`runHermesLocalPilotTask` の戻り値）。

## 出力 (`IchikishimaOrchestratorOutput`)

| フィールド | 内容 |
|------------|------|
| `reviewResult` | `reviewHermesReport` 由来（最終承認は人間）。 |
| `memoryCandidates` | `extractMemoryCandidates`。**永続化しない**。 |
| `approvalReport` | `createApprovalReport`（`source: mixed`）。 |
| `approvalQueueItems` | `createApprovalQueueItemFromReport` の候補。 |
| `auditRecords` | pilot 監査コピー + `review_completed` + 記憶候補監査（最大2件サンプル）。 |
| `finalDecision` | `requiresUserApproval: true`, `autoExecutable: false`, `shouldSpeak: false` |

## 関数

- `processHermesPilotResult(pilot)`
- `createIchikishimaDecisionPackage(pilot)` — 上記のエイリアス。

## 禁止

- memory DB 書き込み。
- 外部通知。
- UI スレッド操作。
- queue 自動消化。

## 実装パス

- `src/main/ichikishima/orchestrator/ichikishima-orchestrator.ts`

# Local Pilot Full Loop Spec

## 目的

Sandbox だけで以下の **論理パイプライン** を一度に検証する。

1. HermesBridge 分類（forbidden が混ざれば即 `NOT_READY`）
2. `runHermesLocalPilotTask`
3. `createIchikishimaDecisionPackage` / `processHermesPilotResult`
4. `finalUserSummary` と `readinessStatus` ラベル

## API

### `runLocalPilotFullLoop(options)`

- `RunHermesLocalPilotTaskInput` を継承（`taskId` 省略可 — 自動採番）。
- 戻り `LocalPilotFullLoopResult`:
  - `hermesPilotResult`
  - `ichikishimaOrchestration`
  - `finalUserSummary`
  - `readinessStatus`: `"READY_FOR_LOCAL_FULL_LOOP"` | `"NOT_READY"`
  - `readinessReasons`
  - `requiresUserApproval: true`, `shouldSpeak: false`

## READY / NOT_READY

### `READY_FOR_LOCAL_FULL_LOOP`

- `forbiddenOperations.length === 0`
- Pilot `status === "completed"`
- Pilot `approvalReport` が生成済み
- Orchestrator `approvalReport` が生成済み

### `NOT_READY`

- forbiddenTier が検出された場合。
- pilot が complete でない場合。
- orchestrator がレポート生成できなかった場合。

## テスト

- `tests/ichikishima/pilot/local-pilot-full-loop.test.ts`

## 実装パス

- `src/main/ichikishima/pilot/local-pilot-full-loop.ts`

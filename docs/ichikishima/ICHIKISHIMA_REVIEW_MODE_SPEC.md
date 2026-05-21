# Ichikishima Review Mode Spec

## 1. 目的

Review Modeは、イツキシマがHermesの変更レポートを読み、ユーザーの最終判断を助けるための審査候補を作るモードである。

Review Modeは自動承認しない。自動発話、通知、memory DB更新も行わない。

## 2. 判定項目

- 禁止領域に触れていないか。
- テストは実行されたか。
- 未実行テストは明記されているか。
- 戻し方があるか。
- 次工程が危険ではないか。
- 外部通信、依存追加、git pushがないか。
- 既存EA/MT5に触れていないか。
- 変更範囲が過大ではないか。
- ユーザーに分かる説明になっているか。

入力は変更レポート文字列、または次の構造化入力を受け取る。

```ts
interface ReviewModeStructuredInput {
  reportText: string;
  nextStep?: string;
  changedFiles?: string[];
  executedTests?: string[];
  unexecutedTests?: string[];
  untouchedImportantAreas?: string[];
  rollbackPlan?: string;
  codeChanged?: boolean;
  docsOnly?: boolean;
}
```

## 3. 戻り値

```ts
interface ReviewModeResult {
  decision: "approve_recommended" | "hold" | "reject_recommended";
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  missingChecks: string[];
  nextStepRisk: string[];
  detectedRiskTerms: string[];
  positiveSignals: string[];
  userSummary: string;
  requiresUserApproval: true;
  autoApproved: false;
}
```

## 4. 安全方針

- 禁止領域を検出したら `reject_recommended` に倒す。
- テスト結果や未実行項目が不足している場合は `hold` に倒す。
- 次工程がHermes本体連携、監査ログ本体、承認キュー実行、UI、delete/execute/network/git実行へ近い場合は `hold` に倒す。
- 低リスクでも `requiresUserApproval:true` を維持する。
- 自動承認しない。
- docsのみの変更では、テスト未実行でも理由が明記されていれば低リスク寄りで扱う。
- 実装コード変更で実行テストが確認できない場合は `hold` に倒す。
- `untouchedImportantAreas` はポジティブシグナルであり、禁止語検出の対象にしない。
- 判断に迷う場合は `hold` に倒す。

## 5. 判定ルール

1. 禁止領域に触れている記述がある場合は `reject_recommended` / `high`。
2. 外部通信、git push、依存追加、memory DB、MT5、EA本体、自動発話、通知に進んでいる場合は `reject_recommended` または `hold`。
3. 実装コード変更があり、実行テストが確認できない場合は `hold`。
4. 戻し方がない場合は `missingChecks` に `rollback_plan` を入れる。
5. 実行したテスト、未実行テスト、触っていない重要領域、戻し方は `positiveSignals` として扱う。
6. 次工程が高リスクの場合は `nextStepRisk` に追加し、ユーザー承認を必須にする。

## 6. まだしないこと

- 自動発話。
- 通知。
- memory DB更新。
- Hermes本体操作。
- 外部通信。
- UI実装。

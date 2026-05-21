# Approval Report Spec

## 1. 目的

Hermesやイツキシマの審査結果を、ユーザーがコードを読めなくても判断できる承認レポートへ変換する。

今回はUI実装ではない。Electron画面、React画面、3D可視化、承認実行処理には進まない。

## 2. 入力

Approval Reportは、次の情報をまとめる。

- Hermes変更レポートの要約。
- Review Mode結果。
- Memory Candidate結果。
- 変更ファイル。
- 触っていない重要領域。
- ユーザーに見える変化。
- 実行したテスト。
- 実行していないテスト。
- 戻し方。
- 次工程リスク。

## 3. 出力形式

- JSON: 機械向け。
- Markdown: ユーザー確認向け。

## 4. Approval Report型

```ts
interface ApprovalReport {
  reportId: string;
  createdAt: string;
  source: "hermes_report" | "review_mode" | "memory_candidate" | "mixed";
  title: string;
  summary: string;
  decision: "approve_recommended" | "hold" | "reject_recommended";
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  changedFiles: string[];
  untouchedCriticalAreas: string[];
  userVisibleChanges: string[];
  executedTests: string[];
  skippedTests: string[];
  missingChecks: string[];
  rollbackPlan: string;
  nextStepRisk: string[];
  memoryCandidatesSummary: MemoryCandidatesSummary;
  safetyFlags: string[];
  requiresUserApproval: true;
  autoApproved: false;
  recommendedUserAction: "approve" | "hold" | "request_changes" | "reject";
}
```

## 5. Markdown見出し

```text
# 承認レポート

## 1. 結論
## 2. 何をしたか
## 3. 変更範囲
## 4. 触っていない重要領域
## 5. ユーザーに見える変化
## 6. リスク
## 7. テスト結果
## 8. 未確認項目
## 9. 戻し方
## 10. 記憶候補
## 11. イツキシマ判定
## 12. ユーザーに求める判断
```

## 6. 必須ルール

- 「問題ありません」と書かない。
- 「この範囲では問題を検出していません」と表現する。
- 秘密情報を出さない。
- `.env` / APIキー / secrets / memory DB内容 / MT5口座情報 / 取引履歴 / 個人情報を含めない。
- content本文やコード全文を不用意に含めない。
- 自動承認しない。
- `requiresUserApproval:true` を固定する。
- `autoApproved:false` を固定する。
- 判断に迷う場合は `hold` に倒す。

## 7. 初期実装

実装済み:

- `createApprovalReport`
- `renderApprovalReportMarkdown`
- `renderApprovalReportJson`

まだ実装しない:

- UI。
- CLIコマンド。
- 承認実行処理。
- ファイル反映処理。
- Hermes本体完全連携。
- 外部通信。

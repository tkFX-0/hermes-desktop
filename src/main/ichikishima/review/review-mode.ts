export type ReviewModeDecision =
  | "approve_recommended"
  | "hold"
  | "reject_recommended";

export type ReviewModeRiskLevel = "low" | "medium" | "high";

export interface ReviewModeStructuredInput {
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

export type ReviewModeInput = string | ReviewModeStructuredInput;

export interface ReviewModeResult {
  decision: ReviewModeDecision;
  riskLevel: ReviewModeRiskLevel;
  reasons: string[];
  missingChecks: string[];
  nextStepRisk: string[];
  detectedRiskTerms: string[];
  positiveSignals: string[];
  userSummary: string;
  requiresUserApproval: true;
  autoApproved: false;
}

interface ReviewTerm {
  term: string;
  reason: string;
}

const highRiskTerms: ReviewTerm[] = [
  { term: ".env", reason: ".envへの接触が示されています" },
  { term: "apiキー", reason: "APIキーへの接触が示されています" },
  { term: "api key", reason: "API keyへの接触が示されています" },
  { term: "secrets", reason: "secretsへの接触が示されています" },
  { term: "secret", reason: "secretへの接触が示されています" },
  { term: "memory db", reason: "memory DBへの接触が示されています" },
  { term: "memory DB", reason: "memory DBへの接触が示されています" },
  { term: "memory DB更新", reason: "memory DB更新が示されています" },
  { term: "MT5", reason: "MT5関連への接触が示されています" },
  { term: "EA本体", reason: "EA本体への接触が示されています" },
  { term: "外部通信", reason: "外部通信が示されています" },
  { term: "git push", reason: "git pushが示されています" },
  { term: "npm install", reason: "依存追加が示されています" },
  { term: "依存追加", reason: "依存追加が示されています" },
  { term: "自動発話", reason: "自動発話への進行が示されています" },
  { term: "通知", reason: "通知への進行が示されています" },
  { term: "実delete", reason: "delete実行が示されています" },
  { term: "実execute", reason: "execute実行が示されています" },
  { term: "実network", reason: "network実行が示されています" },
  { term: "実git", reason: "git実行が示されています" },
  { term: "取引履歴", reason: "取引履歴への接触が示されています" },
  { term: "個人情報", reason: "個人情報への接触が示されています" },
  { term: "本番設定", reason: "本番設定への接触が示されています" },
  { term: "自動売買", reason: "自動売買関連への接触が示されています" },
];

const nextStepRiskTerms: ReviewTerm[] = [
  { term: "Hermes本体連携", reason: "Hermes本体連携は追加レビューが必要です" },
  { term: "監査ログ本体", reason: "監査ログ本体は追加レビューが必要です" },
  { term: "承認キュー実行", reason: "承認キュー実行は追加レビューが必要です" },
  { term: "UI", reason: "UI実装は追加レビューが必要です" },
  { term: "delete実行", reason: "delete実行は追加レビューが必要です" },
  { term: "execute実行", reason: "execute実行は追加レビューが必要です" },
  { term: "network実行", reason: "network実行は追加レビューが必要です" },
  { term: "git実行", reason: "git実行は追加レビューが必要です" },
  { term: "外部通信", reason: "外部通信は追加レビューが必要です" },
  { term: "memory DB", reason: "memory DBは追加レビューが必要です" },
  { term: "MT5", reason: "MT5関連は追加レビューが必要です" },
  { term: "EA本体", reason: "EA本体は追加レビューが必要です" },
];

function includesTerm(text: string, term: string): boolean {
  return text.toLowerCase().includes(term.toLowerCase());
}

function normalizeInput(input: ReviewModeInput): ReviewModeStructuredInput {
  return typeof input === "string" ? { reportText: input } : input;
}

function isSafetyNegationLine(line: string): boolean {
  return [
    "触っていない",
    "触れていない",
    "未接触",
    "変更していない",
    "参照していない",
    "更新していない",
    "実行していない",
    "していない",
    "なし",
    "行っていない",
  ].some((term) => line.includes(term));
}

function lineHasContentFor(label: string, text: string): boolean {
  return text
    .split(/\r?\n/)
    .filter((line) => includesTerm(line, label))
    .some((line) => {
      const value = line.split(/[:：]/).slice(1).join(":").trim();
      return value.length > 0 && !["なし", "未実行", "未確認"].includes(value);
    });
}

function detectTerms(text: string, terms: ReviewTerm[]): ReviewTerm[] {
  const lines = text.split(/\r?\n/);
  return terms.filter(({ term }) =>
    lines.some(
      (line) => includesTerm(line, term) && !isSafetyNegationLine(line),
    ),
  );
}

function hasCodeChange(
  input: ReviewModeStructuredInput,
  fullText: string,
): boolean {
  if (input.codeChanged === true) return true;
  if (input.docsOnly === true) return false;

  const files = input.changedFiles ?? [];
  if (
    files.some((file) => /\.(ts|tsx|js|jsx|json|cjs|mjs)$/i.test(file.trim()))
  ) {
    return true;
  }

  return ["src/", "tests/", ".ts", ".tsx", "型", "スタブ", "実装コード"].some(
    (term) => includesTerm(fullText, term),
  );
}

function isDocsOnly(input: ReviewModeStructuredInput): boolean {
  if (input.docsOnly === true) return true;
  if (input.codeChanged === true) return false;

  const files = input.changedFiles ?? [];
  return files.length > 0 && files.every((file) => /\.md$/i.test(file.trim()));
}

function collectPositiveSignals(
  input: ReviewModeStructuredInput,
  fullText: string,
): string[] {
  const signals: string[] = [];

  if (
    (input.executedTests?.length ?? 0) > 0 ||
    lineHasContentFor("実行したテスト", fullText)
  ) {
    signals.push("executed_tests_present");
  }

  if (
    (input.unexecutedTests?.length ?? 0) > 0 ||
    lineHasContentFor("実行していないテスト", fullText)
  ) {
    signals.push("unexecuted_tests_present");
  }

  if (input.rollbackPlan || lineHasContentFor("戻し方", fullText)) {
    signals.push("rollback_plan_present");
  }

  if (
    (input.untouchedImportantAreas?.length ?? 0) > 0 ||
    includesTerm(fullText, "触っていない重要領域") ||
    includesTerm(fullText, "触れていない重要領域") ||
    includesTerm(fullText, "禁止領域未接触")
  ) {
    signals.push("untouched_important_areas_present");
  }

  return signals;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function evaluateReviewMode(input: ReviewModeInput): ReviewModeResult {
  const normalized = normalizeInput(input);
  const nextStepText = normalized.nextStep ?? "";
  const fullText = [
    normalized.reportText,
    nextStepText,
    ...(normalized.changedFiles ?? []),
    ...(normalized.executedTests ?? []),
    ...(normalized.unexecutedTests ?? []),
    ...(normalized.untouchedImportantAreas ?? []),
    normalized.rollbackPlan ?? "",
  ].join("\n");
  const riskDetectionText = [
    normalized.reportText,
    nextStepText,
    ...(normalized.changedFiles ?? []),
    normalized.rollbackPlan ?? "",
  ].join("\n");
  const codeChanged = hasCodeChange(normalized, fullText);
  const docsOnly = isDocsOnly(normalized);
  const detectedTerms = detectTerms(riskDetectionText, highRiskTerms);
  const nextStepRisk = detectTerms(nextStepText, nextStepRiskTerms).map(
    ({ term }) => term,
  );
  const positiveSignals = collectPositiveSignals(normalized, fullText);
  const missingChecks: string[] = [];
  const reasons: string[] = [];

  if (!positiveSignals.includes("executed_tests_present")) {
    missingChecks.push("executed_tests");
  }

  if (!positiveSignals.includes("unexecuted_tests_present")) {
    missingChecks.push("unexecuted_tests");
  }

  if (!positiveSignals.includes("rollback_plan_present")) {
    missingChecks.push("rollback_plan");
  }

  if (!positiveSignals.includes("untouched_important_areas_present")) {
    missingChecks.push("untouched_important_areas");
  }

  if (detectedTerms.length > 0) {
    reasons.push(...detectedTerms.map(({ reason }) => reason));
  }

  if (missingChecks.length > 0) {
    reasons.push("審査に必要な記載が不足しています");
  }

  if (nextStepRisk.length > 0) {
    reasons.push("次工程に追加レビューが必要な要素があります");
  }

  if (codeChanged && missingChecks.includes("executed_tests")) {
    reasons.push("実装コード変更に対する実行テストが確認できません");
  }

  if (docsOnly && missingChecks.includes("executed_tests")) {
    reasons.push("docsのみの変更ですが、テスト未実行の明記が不足しています");
  }

  const decision: ReviewModeDecision =
    detectedTerms.length > 0
      ? "reject_recommended"
      : missingChecks.length > 0 || nextStepRisk.length > 0
        ? "hold"
        : "approve_recommended";
  const riskLevel: ReviewModeRiskLevel =
    detectedTerms.length > 0
      ? "high"
      : codeChanged && missingChecks.includes("executed_tests")
        ? "medium"
        : missingChecks.length > 0 || nextStepRisk.length > 0
          ? docsOnly
            ? "low"
            : "medium"
          : "low";

  return {
    decision,
    riskLevel,
    reasons:
      reasons.length > 0
        ? unique(reasons)
        : ["この範囲では問題を検出していません"],
    missingChecks: unique(missingChecks),
    nextStepRisk,
    detectedRiskTerms: detectedTerms.map(({ term }) => term),
    positiveSignals,
    userSummary:
      decision === "approve_recommended"
        ? "この範囲では問題を検出していません。最終承認はユーザーが行います。"
        : decision === "reject_recommended"
          ? "禁止領域または高リスク操作への接触が示されています。却下推奨です。"
          : "追加確認が必要です。自動承認は行いません。",
    requiresUserApproval: true,
    autoApproved: false,
  };
}

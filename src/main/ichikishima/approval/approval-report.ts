import type { ExtractMemoryCandidatesResult } from "../memory";
import type {
  ReviewModeDecision,
  ReviewModeResult,
  ReviewModeRiskLevel,
} from "../review/review-mode";

export type ApprovalReportSource =
  | "hermes_report"
  | "review_mode"
  | "memory_candidate"
  | "mixed";

export type RecommendedUserAction =
  | "approve"
  | "hold"
  | "request_changes"
  | "reject";

export interface MemoryCandidatesSummary {
  candidateCount: number;
  rejectedCount: number;
  requiresApprovalCount: number;
  forbiddenCount: number;
  categories: string[];
  warnings: string[];
}

export interface ApprovalReportInput {
  source: ApprovalReportSource;
  title: string;
  summary: string;
  reviewResult: ReviewModeResult;
  changedFiles?: string[];
  untouchedCriticalAreas?: string[];
  userVisibleChanges?: string[];
  executedTests?: string[];
  skippedTests?: string[];
  rollbackPlan?: string;
  memoryCandidates?: ExtractMemoryCandidatesResult;
  safetyFlags?: string[];
  createdAt?: string;
}

export interface ApprovalReport {
  reportId: string;
  createdAt: string;
  source: ApprovalReportSource;
  title: string;
  summary: string;
  decision: ReviewModeDecision;
  riskLevel: ReviewModeRiskLevel;
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
  recommendedUserAction: RecommendedUserAction;
}

const sensitivePatterns: Array<[RegExp, string]> = [
  [/\.env/gi, "[masked-sensitive-path]"],
  [/api\s*key/gi, "[masked-sensitive-term]"],
  [/apiキー/gi, "[masked-sensitive-term]"],
  [/secrets?/gi, "[masked-sensitive-term]"],
  [/secret/gi, "[masked-sensitive-term]"],
  [/memory\s*db/gi, "[masked-sensitive-term]"],
  [/MT5口座情報/gi, "[masked-sensitive-term]"],
  [/取引履歴/gi, "[masked-sensitive-term]"],
  [/個人情報/gi, "[masked-sensitive-term]"],
  [/[A-Za-z0-9_-]{24,}/g, "[masked-token-like-value]"],
];

function sanitizeText(value: string): string {
  return sensitivePatterns.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    value,
  );
}

function sanitizeList(values: string[] | undefined): string[] {
  return (values ?? []).map(sanitizeText).filter((value) => value.length > 0);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function makeReportId(createdAt: string, title: string): string {
  const seed = `${createdAt}:${title}`;
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return `approval_${hash.toString(16).padStart(8, "0")}`;
}

function summarizeMemoryCandidates(
  result: ExtractMemoryCandidatesResult | undefined,
): MemoryCandidatesSummary {
  const candidates = result?.candidates ?? [];
  const rejected = result?.rejected ?? [];
  const all = [...candidates, ...rejected];

  return {
    candidateCount: candidates.length,
    rejectedCount: rejected.length,
    requiresApprovalCount: all.filter(
      (candidate) => candidate.requiresUserApproval,
    ).length,
    forbiddenCount: all.filter(
      (candidate) =>
        candidate.category === "forbidden_memory" ||
        candidate.proposedAction === "forbidden",
    ).length,
    categories: unique(all.map((candidate) => candidate.category)),
    warnings: sanitizeList(result?.warnings),
  };
}

function chooseRecommendedAction(
  decision: ReviewModeDecision,
  riskLevel: ReviewModeRiskLevel,
  missingChecks: string[],
  safetyFlags: string[],
): RecommendedUserAction {
  if (decision === "reject_recommended") return "reject";
  if (riskLevel === "high") return "reject";
  if (decision === "hold") return "hold";
  if (missingChecks.length > 0 || safetyFlags.length > 0) return "hold";
  if (riskLevel === "medium") return "request_changes";
  return "approve";
}

export function createApprovalReport(
  input: ApprovalReportInput,
): ApprovalReport {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const title = sanitizeText(input.title);
  const safetyFlags = unique([
    ...sanitizeList(input.safetyFlags),
    ...sanitizeList(input.reviewResult.detectedRiskTerms),
  ]);
  const missingChecks = sanitizeList(input.reviewResult.missingChecks);

  return {
    reportId: makeReportId(createdAt, title),
    createdAt,
    source: input.source,
    title,
    summary: sanitizeText(input.summary),
    decision: input.reviewResult.decision,
    riskLevel: input.reviewResult.riskLevel,
    reasons: sanitizeList(input.reviewResult.reasons),
    changedFiles: sanitizeList(input.changedFiles),
    untouchedCriticalAreas: sanitizeList(input.untouchedCriticalAreas),
    userVisibleChanges: sanitizeList(input.userVisibleChanges),
    executedTests: sanitizeList(input.executedTests),
    skippedTests: sanitizeList(input.skippedTests),
    missingChecks,
    rollbackPlan: sanitizeText(input.rollbackPlan ?? "未記載"),
    nextStepRisk: sanitizeList(input.reviewResult.nextStepRisk),
    memoryCandidatesSummary: summarizeMemoryCandidates(input.memoryCandidates),
    safetyFlags,
    requiresUserApproval: true,
    autoApproved: false,
    recommendedUserAction: chooseRecommendedAction(
      input.reviewResult.decision,
      input.reviewResult.riskLevel,
      missingChecks,
      safetyFlags,
    ),
  };
}

function renderList(values: string[], emptyText: string): string {
  if (values.length === 0) return `- ${emptyText}`;
  return values.map((value) => `- ${value}`).join("\n");
}

export function renderApprovalReportMarkdown(report: ApprovalReport): string {
  const memorySummary = [
    `- 候補数: ${report.memoryCandidatesSummary.candidateCount}`,
    `- 拒否候補数: ${report.memoryCandidatesSummary.rejectedCount}`,
    `- 承認必須候補数: ${report.memoryCandidatesSummary.requiresApprovalCount}`,
    `- forbidden候補数: ${report.memoryCandidatesSummary.forbiddenCount}`,
    `- カテゴリ: ${
      report.memoryCandidatesSummary.categories.length > 0
        ? report.memoryCandidatesSummary.categories.join(", ")
        : "なし"
    }`,
  ].join("\n");

  return [
    "# 承認レポート",
    "",
    "## 1. 結論",
    `- 判定: ${report.decision}`,
    `- リスク: ${report.riskLevel}`,
    `- 推奨アクション: ${report.recommendedUserAction}`,
    "- requiresUserApproval: true",
    "- autoApproved: false",
    "",
    "## 2. 何をしたか",
    report.summary,
    "",
    "## 3. 変更範囲",
    renderList(report.changedFiles, "変更ファイルの記載なし"),
    "",
    "## 4. 触っていない重要領域",
    renderList(report.untouchedCriticalAreas, "触っていない重要領域の記載なし"),
    "",
    "## 5. ユーザーに見える変化",
    renderList(report.userVisibleChanges, "ユーザーに見える変化の記載なし"),
    "",
    "## 6. リスク",
    renderList(
      [...report.reasons, ...report.safetyFlags],
      "この範囲では問題を検出していません",
    ),
    "",
    "## 7. テスト結果",
    "実行したテスト:",
    renderList(report.executedTests, "実行したテストの記載なし"),
    "",
    "実行していないテスト:",
    renderList(report.skippedTests, "実行していないテストの記載なし"),
    "",
    "## 8. 未確認項目",
    renderList(report.missingChecks, "この範囲では問題を検出していません"),
    "",
    "## 9. 戻し方",
    `- ${report.rollbackPlan}`,
    "",
    "## 10. 記憶候補",
    memorySummary,
    "",
    "## 11. イツキシマ判定",
    `- ${report.decision}`,
    ...report.reasons.map((reason) => `- ${reason}`),
    "",
    "## 12. ユーザーに求める判断",
    `- ${report.recommendedUserAction}`,
  ].join("\n");
}

export function renderApprovalReportJson(report: ApprovalReport): string {
  return JSON.stringify(report, null, 2);
}

import { describe, expect, it } from "vitest";
import {
  type ApprovalReport,
  createApprovalReport,
  renderApprovalReportJson,
  renderApprovalReportMarkdown,
} from "../../../src/main/ichikishima/approval";
import { extractMemoryCandidates } from "../../../src/main/ichikishima/memory";
import { evaluateReviewMode } from "../../../src/main/ichikishima/review/review-mode";

const safeReview = evaluateReviewMode({
  reportText: "docsを更新し、この範囲では問題を検出していません",
  changedFiles: ["docs/ichikishima/APPROVAL_REPORT_SPEC.md"],
  executedTests: ["tests/ichikishima/approval/approval-report.test.ts"],
  unexecutedTests: ["Electron起動"],
  untouchedImportantAreas: ["MT5/EA", "memory DB", "外部通信"],
  rollbackPlan: "追加したdocs差分を戻す",
  docsOnly: true,
});

function createSafeReport(): ApprovalReport {
  return createApprovalReport({
    source: "review_mode",
    title: "Approval Report前段",
    summary: "Review Mode結果を承認レポートへ変換しました",
    reviewResult: safeReview,
    changedFiles: ["docs/ichikishima/APPROVAL_REPORT_SPEC.md"],
    untouchedCriticalAreas: ["MT5/EA", "memory DB", "外部通信"],
    userVisibleChanges: ["UI変化なし"],
    executedTests: ["tests/ichikishima/approval/approval-report.test.ts"],
    skippedTests: ["Electron起動"],
    rollbackPlan: "追加したdocs差分を戻す",
    memoryCandidates: extractMemoryCandidates({
      text: "プロジェクト方針: 承認レポートを先に作る",
      source: "user_instruction",
      createdAt: "2026-05-03T14:00:00.000Z",
    }),
    createdAt: "2026-05-03T14:00:00.000Z",
  });
}

describe("Ichikishima approval report", () => {
  it("creates an approval report from approve_recommended Review Mode result", () => {
    const report = createSafeReport();

    expect(report.decision).toBe("approve_recommended");
    expect(report.riskLevel).toBe("low");
    expect(report.recommendedUserAction).toBe("approve");
    expect(report.requiresUserApproval).toBe(true);
    expect(report.autoApproved).toBe(false);
  });

  it("sets high risk reports to reject or hold user action", () => {
    const review = evaluateReviewMode({
      reportText: ".env に触れた",
      executedTests: ["npm test"],
      unexecutedTests: ["Electron起動"],
      untouchedImportantAreas: ["MT5"],
      rollbackPlan: "差分を戻す",
    });
    const report = createApprovalReport({
      source: "review_mode",
      title: "High risk",
      summary: "High risk review",
      reviewResult: review,
    });

    expect(report.riskLevel).toBe("high");
    expect(["hold", "reject"]).toContain(report.recommendedUserAction);
  });

  it("renders missing checks, skipped tests, and rollback plan in markdown", () => {
    const review = evaluateReviewMode({
      reportText: "src/main/ichikishima/approval/approval-report.ts を変更",
      executedTests: ["tests/ichikishima/approval/approval-report.test.ts"],
      untouchedImportantAreas: ["MT5/EA"],
      codeChanged: true,
    });
    const report = createApprovalReport({
      source: "mixed",
      title: "Missing check report",
      summary: "不足項目を含む承認レポート",
      reviewResult: review,
      skippedTests: ["Electron起動"],
      rollbackPlan: "差分を戻す",
    });
    const markdown = renderApprovalReportMarkdown(report);

    expect(markdown).toContain("## 8. 未確認項目");
    expect(markdown).toContain("unexecuted_tests");
    expect(markdown).toContain("Electron起動");
    expect(markdown).toContain("差分を戻す");
  });

  it("includes memory candidates summary", () => {
    const report = createSafeReport();
    const markdown = renderApprovalReportMarkdown(report);

    expect(report.memoryCandidatesSummary.candidateCount).toBe(1);
    expect(markdown).toContain("## 10. 記憶候補");
    expect(markdown).toContain("project_memory");
  });

  it("does not contain prohibited wording and uses the approved phrase", () => {
    const markdown = renderApprovalReportMarkdown(createSafeReport());

    expect(markdown).not.toContain("問題ありません");
    expect(markdown).toContain("この範囲では問題を検出していません");
  });

  it("masks sensitive-looking strings in markdown", () => {
    const report = createApprovalReport({
      source: "review_mode",
      title: ".env and API key report",
      summary: "secret token abcdefghijklmnopqrstuvwxyz123456",
      reviewResult: safeReview,
      changedFiles: [".env"],
      safetyFlags: ["APIキー", "secrets"],
      rollbackPlan: "secretを戻す",
    });
    const markdown = renderApprovalReportMarkdown(report);

    expect(markdown).not.toContain(".env");
    expect(markdown).not.toContain("APIキー");
    expect(markdown).not.toContain("secrets");
    expect(markdown).not.toContain("abcdefghijklmnopqrstuvwxyz123456");
    expect(markdown).toContain("[masked-sensitive");
  });

  it("renders JSON output", () => {
    const json = renderApprovalReportJson(createSafeReport());
    const parsed = JSON.parse(json) as { requiresUserApproval: boolean };

    expect(parsed.requiresUserApproval).toBe(true);
  });
});

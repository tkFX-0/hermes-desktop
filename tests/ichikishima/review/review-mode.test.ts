import { describe, expect, it } from "vitest";
import { evaluateReviewMode } from "../../../src/main/ichikishima/review/review-mode";

const safeReport = [
  "1. 何をしたか: docsを更新",
  "4. 触っていない重要領域: 禁止領域には触れていません",
  "7. 実行したテスト: npm test 成功",
  "8. 実行していないテスト: Electron起動",
  "9. 戻し方: 差分を戻す",
].join("\n");

describe("Ichikishima Review Mode", () => {
  it("approves a safe docs-only report as a recommendation candidate", () => {
    const result = evaluateReviewMode({ reportText: safeReport });

    expect(result.decision).toBe("approve_recommended");
    expect(result.riskLevel).toBe("low");
    expect(result.requiresUserApproval).toBe(true);
    expect(result.autoApproved).toBe(false);
    expect(result.positiveSignals).toContain("executed_tests_present");
    expect(result.positiveSignals).toContain("unexecuted_tests_present");
  });

  it("holds when the next step approaches a risky boundary", () => {
    const result = evaluateReviewMode({
      reportText: safeReport,
      nextStep: "次はHermes本体連携を行う",
    });

    expect(result.decision).toBe("hold");
    expect(result.nextStepRisk).toContain("Hermes本体連携");
  });

  it("approves a safe type and stub report with structured input", () => {
    const result = evaluateReviewMode({
      reportText: "Review Modeの型定義と安全側スタブを追加しました",
      changedFiles: [
        "src/main/ichikishima/review/review-mode.ts",
        "tests/ichikishima/review/review-mode.test.ts",
      ],
      executedTests: ["tests/ichikishima/review/review-mode.test.ts"],
      unexecutedTests: ["Electron起動", "UIテスト"],
      untouchedImportantAreas: ["MT5", ".env", "memory DB"],
      rollbackPlan: "追加した差分を戻す",
      codeChanged: true,
    });

    expect(result.decision).toBe("approve_recommended");
    expect(result.riskLevel).toBe("low");
    expect(result.missingChecks).toEqual([]);
    expect(result.requiresUserApproval).toBe(true);
  });

  it.each([
    [".env に触れた", ".env"],
    ["MT5関連に触れた", "MT5"],
    ["memory DB更新に進んだ", "memory DB更新"],
    ["外部通信した", "外部通信"],
    ["git pushした", "git push"],
  ])("marks %s as high risk", (reportText, expectedTerm) => {
    const result = evaluateReviewMode({
      reportText: `${safeReport}\n${reportText}`,
    });

    expect(result.decision).toBe("reject_recommended");
    expect(result.riskLevel).toBe("high");
    expect(result.requiresUserApproval).toBe(true);
    expect(result.detectedRiskTerms).toContain(expectedTerm);
  });

  it("holds when code changed but tests were not executed", () => {
    const result = evaluateReviewMode({
      reportText: [
        "src/main/ichikishima/review/review-mode.ts を変更",
        "実行していないテスト: npm test",
        "戻し方: 差分を戻す",
        "触っていない重要領域: 禁止領域未接触",
      ].join("\n"),
      codeChanged: true,
    });

    expect(result.decision).toBe("hold");
    expect(result.riskLevel).toBe("medium");
    expect(result.missingChecks).toContain("executed_tests");
  });

  it("adds rollback_plan to missing checks when rollback is absent", () => {
    const result = evaluateReviewMode({
      reportText: [
        "docsを更新",
        "実行したテスト: npm test",
        "実行していないテスト: Electron起動",
        "触っていない重要領域: 禁止領域未接触",
      ].join("\n"),
    });

    expect(result.decision).toBe("hold");
    expect(result.missingChecks).toContain("rollback_plan");
  });

  it("parses unexecuted tests as a positive signal when explicitly written", () => {
    const result = evaluateReviewMode({
      reportText: safeReport,
    });

    expect(result.positiveSignals).toContain("unexecuted_tests_present");
    expect(result.missingChecks).not.toContain("unexecuted_tests");
  });

  it("keeps auto-approval disabled for every result", () => {
    const result = evaluateReviewMode({
      reportText: `${safeReport}\n.env に触れた`,
    });

    expect(result.autoApproved).toBe(false);
    expect(result.requiresUserApproval).toBe(true);
  });
});

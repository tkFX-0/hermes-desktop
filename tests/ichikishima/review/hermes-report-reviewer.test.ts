import { describe, expect, it } from "vitest";
import { reviewHermesReport } from "../../../src/main/ichikishima/review/hermes-report-reviewer";

describe("Ichikishima Hermes report reviewer", () => {
  it("recommends approval only as a user-reviewed candidate", () => {
    const result = reviewHermesReport({
      reportText: [
        "1. 何をしたか: docsを更新",
        "7. 実行したテスト: npm test 成功",
        "8. 実行していないテスト: Electron起動",
        "9. 戻し方: 差分を戻す",
        "触っていない重要領域: 既存EAや秘密情報",
      ].join("\n"),
    });

    expect(result.recommendation).toBe("approve_recommended");
    expect(result.requiresUserFinalApproval).toBe(true);
    expect(result.autoApproved).toBe(false);
  });

  it("holds when test evidence is missing", () => {
    const result = reviewHermesReport({
      reportText: "変更しました。安全です。",
    });

    expect(result.recommendation).toBe("hold");
    expect(result.missingEvidence.length).toBeGreaterThan(0);
  });

  it("rejects when protected terms are detected", () => {
    const result = reviewHermesReport({
      reportText: [
        "git push と .env を扱いました",
        "実行したテスト: npm test",
        "実行していないテスト: Electron起動",
        "戻し方: 差分を戻す",
        "触っていない重要領域: MT5",
      ].join("\n"),
    });

    expect(result.recommendation).toBe("reject_recommended");
    expect(result.riskLevel).toBe("high");
    expect(result.detectedProtectedTerms).toContain(".env");
    expect(result.detectedProtectedTerms).toContain("git push");
  });

  it("accepts report text directly", () => {
    const result = reviewHermesReport(
      [
        "docsを更新",
        "実行したテスト: npm test",
        "実行していないテスト: Electron起動",
        "戻し方: 差分を戻す",
        "触っていない重要領域: 禁止領域未接触",
      ].join("\n"),
    );

    expect(result.recommendation).toBe("approve_recommended");
    expect(result.requiresUserFinalApproval).toBe(true);
    expect(result.autoApproved).toBe(false);
  });
});

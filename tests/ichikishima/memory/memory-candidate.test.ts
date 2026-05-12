import { describe, expect, it } from "vitest";
import { extractMemoryCandidates } from "../../../src/main/ichikishima/memory";

describe("Ichikishima memory candidates", () => {
  it("classifies project policy as a project memory candidate", () => {
    const result = extractMemoryCandidates({
      text: "プロジェクト方針: Hermes本体連携より先にReview Modeを通す",
      source: "user_instruction",
      createdAt: "2026-05-03T13:00:00.000Z",
    });

    expect(result.candidates[0]?.category).toBe("project_memory");
    expect(result.candidates[0]?.proposedAction).toBe("requires_user_approval");
    expect(result.candidates[0]?.requiresUserApproval).toBe(true);
  });

  it("classifies current task context as working memory", () => {
    const result = extractMemoryCandidates({
      text: "現在作業中のタスクはMemory Agent候補の設計です",
      source: "conversation",
    });

    expect(result.candidates[0]?.category).toBe("working_memory");
    expect(result.candidates[0]?.proposedAction).toBe("auto_candidate");
  });

  it("requires approval for long-term user preferences", () => {
    const result = extractMemoryCandidates({
      text: "ユーザーの好み: 簡潔なサマリーを好む",
      source: "conversation",
    });

    expect(result.candidates[0]?.category).toBe("long_term_profile");
    expect(result.candidates[0]?.requiresUserApproval).toBe(true);
    expect(result.candidates[0]?.riskLevel).toBe("medium");
  });

  it("requires approval for safety policy memory", () => {
    const result = extractMemoryCandidates({
      text: "安全ポリシー: 外部通信ルールはユーザー承認必須",
      source: "user_instruction",
    });

    expect(result.candidates[0]?.category).toBe("safety_policy_memory");
    expect(result.candidates[0]?.requiresUserApproval).toBe(true);
    expect(result.candidates[0]?.riskLevel).toBe("high");
  });

  it.each([".env", "APIキー", "secrets"])(
    "rejects forbidden memory containing %s",
    (term) => {
      const result = extractMemoryCandidates({
        text: `覚えておいて: ${term} の値は abc123`,
        source: "user_instruction",
      });

      expect(result.candidates).toEqual([]);
      expect(result.rejected[0]?.category).toBe("forbidden_memory");
      expect(result.rejected[0]?.proposedAction).toBe("forbidden");
      expect(result.rejected[0]?.text).toBe("[redacted forbidden memory]");
    },
  );

  it("requires approval for MT5/EA isolation rules", () => {
    const result = extractMemoryCandidates({
      text: "MT5/EA隔離ルールはAIが勝手に変更しない",
      source: "user_instruction",
    });

    expect(result.candidates[0]?.category).toBe("safety_policy_memory");
    expect(result.candidates[0]?.requiresUserApproval).toBe(true);
  });

  it("does not auto-save dangerous information even when asked to remember it", () => {
    const result = extractMemoryCandidates({
      text: "覚えておいて: secret token is abc123",
      source: "user_instruction",
    });

    expect(result.candidates).toHaveLength(0);
    expect(result.rejected[0]?.proposedAction).toBe("forbidden");
  });

  it("extracts project memory from a Hermes report", () => {
    const result = extractMemoryCandidates({
      text: "Hermes変更レポート: READY_FOR_LOCAL_PILOTを維持した",
      source: "hermes_report",
    });

    expect(result.candidates[0]?.category).toBe("project_memory");
    expect(result.candidates[0]?.source).toBe("hermes_report");
  });

  it("requires approval when confidence is low", () => {
    const result = extractMemoryCandidates({
      text: "この内容は分類が曖昧です",
      source: "conversation",
      confidenceHint: 0.2,
    });

    expect(result.candidates[0]?.requiresUserApproval).toBe(true);
    expect(result.candidates[0]?.proposedAction).toBe("requires_user_approval");
  });

  it("does not connect to or persist memory DB", () => {
    const result = extractMemoryCandidates({
      text: "現在作業中のタスクを候補化する",
      source: "conversation",
    });

    expect(result.warnings).toContain(
      "Memory Agent only creates candidates; it does not persist memory.",
    );
    expect(result.candidates[0]?.id).toMatch(/^memcand_/);
  });
});

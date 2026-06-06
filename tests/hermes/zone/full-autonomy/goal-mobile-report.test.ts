import { describe, expect, it } from "vitest";
import {
  buildGoalDetailMarkdown,
  buildGoalMobileReport,
  buildGoalMobileSummary,
  redactGoalReportText,
} from "../../../../scripts/lib/goal-mobile-report.mjs";

function makeGoal(overrides: Record<string, unknown> = {}) {
  return {
    id: "goal-test-mobile",
    description: "iPhone向け完了レポートを確認する",
    status: "completed",
    createdAt: "2026-06-06T00:00:00.000Z",
    updatedAt: "2026-06-06T00:10:00.000Z",
    steps: [
      {
        step: 1,
        description: "要件を整理する",
        agent: "hajime",
        autonomyLevel: 1,
        status: "completed",
        result: "ok",
      },
      {
        step: 2,
        description: "実装する",
        agent: "tsumugi",
        autonomyLevel: 3,
        status: "completed",
        result: "done",
      },
    ],
    ...overrides,
  };
}

describe("goal mobile report", () => {
  it("renders concise iPhone-first summary", () => {
    const summary = buildGoalMobileSummary(makeGoal());
    expect(summary).toContain("/goal 完了");
    expect(summary).toContain("目標:");
    expect(summary).toContain("結論:");
    expect(summary).toContain("残HOLD:");
    expect(summary).toContain("次:");
    expect(summary.length).toBeLessThanOrEqual(1200);
  });

  it("builds markdown detail for long reports", () => {
    const detail = buildGoalDetailMarkdown(makeGoal());
    expect(detail).toContain("# /goal 完了レポート");
    expect(detail).toContain("## Steps");
    expect(detail).toContain("Step 1");
  });

  it("redacts secrets, env references, tokens, and IP addresses", () => {
    const text = [
      "DISCORD_TOKEN=abc",
      "endpoint http://192.168.10.10:8080",
      "url=https://example.test?a=1&token=secret-value",
      "normal line",
    ].join("\n");
    const redacted = redactGoalReportText(text);
    expect(redacted).toContain("[REDACTED_SECRET_LINE]");
    expect(redacted).toContain("[REDACTED_IP]");
    expect(redacted).toContain("[REDACTED_SECRET_KEY]=[REDACTED]");
    expect(redacted).not.toContain("192.168.10.10");
    expect(redacted).not.toContain("abc");
    expect(redacted).not.toContain("secret-value");
    expect(redacted).not.toContain("token");
    expect(redacted).toContain("normal line");
  });

  it("creates one markdown attachment only when details are long", () => {
    const short = buildGoalMobileReport(makeGoal(), { attachmentThreshold: 10_000 });
    expect(short.attachmentText).toBe("");

    const long = buildGoalMobileReport(
      makeGoal({
        steps: Array.from({ length: 18 }, (_, i) => ({
          step: i + 1,
          description: `長い詳細 ${i + 1}`,
          agent: "shirube",
          autonomyLevel: 1,
          status: "completed",
          result: "長い結果 ".repeat(20),
        })),
      }),
      { attachmentThreshold: 300 }
    );
    expect(long.attachmentText).toContain("# /goal 完了レポート");
    expect(long.filename).toMatch(/goal-report-goal-test-mobile\.md/);
    expect(long.redaction.ipv4Pattern).toBe(true);
  });
});

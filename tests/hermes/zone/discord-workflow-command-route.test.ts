import { describe, expect, it } from "vitest";

/** Mirrors scripts/shikishima-bot.mjs workflow command routing (regression). */
function isWorkflowDoneCommand(text: string) {
  return /^!workflow\s+done\b/i.test(text.trim());
}

function isWorkflowStatusOnlyCommand(text: string) {
  return /^!workflow(?:\s+status)?\s*$/i.test(text.trim());
}

describe("discord workflow command routing", () => {
  it("!workflow done is not treated as status", () => {
    expect(isWorkflowDoneCommand("!workflow done wf-mptj7m7f")).toBe(true);
    expect(isWorkflowStatusOnlyCommand("!workflow done wf-mptj7m7f")).toBe(false);
  });

  it("!workflow status and bare !workflow are status only", () => {
    expect(isWorkflowStatusOnlyCommand("!workflow")).toBe(true);
    expect(isWorkflowStatusOnlyCommand("!workflow status")).toBe(true);
    expect(isWorkflowDoneCommand("!workflow status")).toBe(false);
  });
});

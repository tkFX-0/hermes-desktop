import { describe, expect, it } from "vitest";
import { ensureWorkflowFromHandoff } from "../../../../scripts/lib/workflow-resume.mjs";

describe("ensureWorkflowFromHandoff env", () => {
  it("respects SHIKISHIMA_WORKFLOW_HANDOFF_DISABLE from env arg", () => {
    const r = ensureWorkflowFromHandoff("/nonexistent-root-xyz", {
      SHIKISHIMA_WORKFLOW_HANDOFF_DISABLE: "1",
    });
    expect(r.action).toBe("none");
    expect(r.reason).toBe("handoff_disabled");
  });
});

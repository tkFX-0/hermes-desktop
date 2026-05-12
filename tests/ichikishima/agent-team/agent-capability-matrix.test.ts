import { describe, expect, it } from "vitest";

import { describeAgentCapabilityLabels } from "../../../src/main/ichikishima/agent-team/agent-capability-matrix";
import type { AgentFoundationId } from "../../../src/main/ichikishima/agent-team/agent-registry";

describe("agent-capability-matrix", () => {
  it("covers every foundation id without execute capability names", async () => {
    const ids: AgentFoundationId[] = [
      "hermes_worker",
      "ichikishima_reviewer",
      "approval_guardian",
      "audit_keeper",
      "memory_curator",
      "visualization_observer",
      "supervisor",
      "suppressive_agent",
      "research_agent",
      "execution_planner",
    ];
    for (const id of ids) {
      const c = describeAgentCapabilityLabels(id);
      expect(c.length).toBeGreaterThan(0);
      expect(JSON.stringify(c).toLowerCase()).not.toMatch(
        /\b(run_wsl|run_hermes|execute_shell)\b/,
      );
    }
  });
});

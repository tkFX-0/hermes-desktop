import { describe, expect, it } from "vitest";

import { describeAgentCapabilityLabels } from "../../../src/main/ichikishima/agent-team/agent-capability-matrix";
import { AGENT_FOUNDATION_REGISTRY } from "../../../src/main/ichikishima/agent-team/agent-registry";

describe("agent-team registry", () => {
  it("all agents shipped disabled dry-run posture", async () => {
    for (const a of AGENT_FOUNDATION_REGISTRY) {
      expect(a.enabled).toBe(false);
      expect(a.dryRunOnly).toBe(true);
      expect(a.requiresUserApproval).toBe(true);
    }
  });

  it("capabilities are read-only stubs only", async () => {
    const caps = describeAgentCapabilityLabels("hermes_worker");
    expect(caps.join(" ").toLowerCase()).not.toMatch(
      /execute|shell|wsl|git_push/,
    );
  });
});

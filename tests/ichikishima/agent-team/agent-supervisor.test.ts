import { describe, expect, it } from "vitest";

import { buildAgentTeamFoundationReadonlySummary } from "../../../src/main/ichikishima/agent-team/agent-supervisor";

describe("agent-supervisor", () => {
  it("returns dry-run outline with scheduler off", async () => {
    const s = buildAgentTeamFoundationReadonlySummary(1, 2);
    expect(s.productionReady).toBe(false);
    expect(s.schedulerEnabled).toBe(false);
    expect(s.agents.every((a) => a.autoRun === false)).toBe(true);
    expect(s.agents.every((a) => a.autoApprove === false)).toBe(true);
  });
});

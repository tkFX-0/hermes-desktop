import { describe, expect, it } from "vitest";

import { AGENT_TEAM_SCHEDULER_ENABLED } from "../../../src/main/ichikishima/agent-team/agent-scheduler-contract";

describe("agent-scheduler-contract", () => {
  it("scheduler remains disabled stub", async () => {
    expect(AGENT_TEAM_SCHEDULER_ENABLED).toBe(false);
  });
});

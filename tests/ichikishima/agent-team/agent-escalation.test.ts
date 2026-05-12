import { describe, expect, it } from "vitest";

import { requestAgentEscalationStub } from "../../../src/main/ichikishima/agent-team/agent-escalation";

describe("agent-escalation", () => {
  it("blocked stub outcome only", async () => {
    const r = requestAgentEscalationStub("e1");
    expect(r.outcome).toMatch(/blocked/);
  });
});

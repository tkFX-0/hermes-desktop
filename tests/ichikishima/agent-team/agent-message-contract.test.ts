import { describe, expect, it } from "vitest";

import { createDryRunAgentEnvelope } from "../../../src/main/ichikishima/agent-team/agent-message-contract";

describe("agent-message-contract", () => {
  it("envelope forbids opaque payload refs", async () => {
    const e = createDryRunAgentEnvelope("telemetry_stub");
    expect(e.dryRunOnly).toBe(true);
  });
});

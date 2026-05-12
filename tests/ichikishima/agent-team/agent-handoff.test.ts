import { describe, expect, it } from "vitest";

import { buildEmptyAgentHandoffLedger } from "../../../src/main/ichikishima/agent-team/agent-handoff";

describe("agent-handoff", () => {
  it("empty ledger by default", async () => {
    const l = buildEmptyAgentHandoffLedger();
    expect(l.edges.length).toBe(0);
  });
});

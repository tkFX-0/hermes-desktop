import { describe, expect, it, vi } from "vitest";
import {
  AGENT_TEAM_ORDER,
  runAgentTeamAutonomousTick,
  createAgentTeamTickCounter
} from "../../../../src/main/shikishima-full-autonomy/agent-team-autonomous-tick";
import { dispatchToAgent } from "../../../../src/main/agent-router";

vi.mock("../../../../src/main/agent-router", () => ({
  dispatchToAgent: vi.fn(async (msg: string) => ({
    success: true,
    reply: `ok:${msg.slice(0, 20)}`,
    agentId: "shikishima",
    durationMs: 1,
    modelTrace: {
      routedAgentId: "shikishima",
      backend: "groq",
      model: "llama-3.3-70b-versatile",
      grokResearchHeld: true,
      routingReason: "test"
    }
  }))
}));

describe("Agent team autonomous tick", () => {
  it("lists all five canonical agents", () => {
    expect(AGENT_TEAM_ORDER.length).toBe(5);
    expect(AGENT_TEAM_ORDER).toContain("shizume");
    expect(AGENT_TEAM_ORDER).toContain("tsumugi");
  });

  it("runs bounded tick for each agent when cap allows", async () => {
    const counter = createAgentTeamTickCounter(0);
    const summary = await runAgentTeamAutonomousTick(counter, 1);
    expect(summary.allowed).toBe(true);
    expect(summary.agents.length).toBe(5);
    expect(summary.agents.every((a) => a.success)).toBe(true);
    expect(dispatchToAgent).toHaveBeenCalledTimes(5);
  });
});

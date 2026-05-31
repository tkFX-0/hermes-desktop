import { describe, expect, it } from "vitest";
import { evaluateAgentTeamTickSchedule } from "../../../../src/main/shikishima-full-autonomy/agent-team-tick-scheduler";

describe("agent team tick scheduler", () => {
  it("does not run when disabled under vitest default release", () => {
    const d = evaluateAgentTeamTickSchedule(process.cwd(), Date.now());
    expect(d.shouldRun).toBe(false);
    expect(d.reasons.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import { CANONICAL_AGENT_IDS } from "../../../../scripts/lib/canonical-agent-team.mjs";

describe("canonical agent team", () => {
  it("is five agents without chihaya", () => {
    expect(CANONICAL_AGENT_IDS).toHaveLength(5);
    expect(CANONICAL_AGENT_IDS).not.toContain("chihaya");
    expect(CANONICAL_AGENT_IDS).toContain("tsumugi");
  });
});

import { describe, expect, it } from "vitest";

import { buildAgentTeamVisualizationNodes } from "../../../src/main/ichikishima/visualization/agent-team-visualization-model";

describe("agent-team-visualization-model", () => {
  it("lists all foundation agents as disabled", async () => {
    const n = buildAgentTeamVisualizationNodes();
    expect(n.length).toBe(10);
    for (const x of n) {
      expect(x.statusLabel).toBe("disabled_dry_run_only");
    }
  });
});

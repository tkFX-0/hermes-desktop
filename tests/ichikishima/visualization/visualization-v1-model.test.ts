import path from "node:path";

import { describe, expect, it } from "vitest";

import { buildVisualizationV1ReadonlyModel } from "../../../src/main/ichikishima/visualization/visualization-v1-model";

describe("visualization-v1-model", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  it("produces meta-only graph without raw payload", async () => {
    const m = buildVisualizationV1ReadonlyModel({
      projectRoot,
      zoneRoot,
      dateUtc: "2099-12-08",
      pilotLoop: null,
    });
    expect(m.nodes.length).toBeGreaterThan(5);
    expect(m.edges.length).toBeGreaterThan(0);
    const w = JSON.stringify(m);
    expect(w).not.toContain('payloadSchemaVersion":"hermes-bridge-payload');
    expect(m.footerNote).toContain("meta_only");
  });
});

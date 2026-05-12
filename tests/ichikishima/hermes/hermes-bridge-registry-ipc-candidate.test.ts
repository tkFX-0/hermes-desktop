import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  HERMES_BRIDGE_ALLOWED_APIS,
  HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS,
  HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS,
} from "../../../src/main/ichikishima/hermes/hermes-bridge-api-registry";
import { getHermesBridgePilotReadiness } from "../../../src/main/ichikishima/hermes/hermes-bridge-readiness";

describe("Hermes Bridge registry IPC candidates (documentation-as-code)", () => {
  const projectRoot = path.resolve(__dirname, "../../..");

  it("does not overlap explicit IPC candidate / forbidden RPC name lists", () => {
    const c = new Set(HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS);
    for (const f of HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS) {
      expect(c.has(f)).toBe(false);
    }
    expect(c.size).toBeGreaterThan(0);
  });

  it("documents single registry readiness channel", () => {
    expect([...HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS]).toEqual([
      "hermesBridge.registry.getReadiness",
    ]);
  });

  it("exposes readiness as plain JSON-ish meta (serialize + primitive shape)", () => {
    const r = getHermesBridgePilotReadiness({ projectRoot });
    const cloned = JSON.parse(JSON.stringify(r)) as typeof r;
    expect(cloned.ready).toBe(r.ready);
    expect(cloned.label).toBe(r.label);
    expect(cloned.blockers.every((x) => typeof x === "string")).toBe(true);
    expect(
      cloned.requiredHumanReviews.every((x) => typeof x === "string"),
    ).toBe(true);
    expect(cloned.allowedApis).toEqual([...HERMES_BRIDGE_ALLOWED_APIS]);
    expect(cloned.forbiddenApis.every((x) => typeof x === "string")).toBe(true);
  });
});

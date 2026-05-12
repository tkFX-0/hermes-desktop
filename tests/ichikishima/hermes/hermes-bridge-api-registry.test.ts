import { describe, expect, it } from "vitest";

import {
  HERMES_BRIDGE_ALLOWED_APIS,
  HERMES_BRIDGE_FORBIDDEN_APIS,
  HERMES_BRIDGE_READINESS_REQUIREMENTS,
  HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS,
  HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS,
} from "../../../src/main/ichikishima/hermes/hermes-bridge-api-registry";

describe("hermes-bridge-api-registry", () => {
  it("keeps allow/forbid lists disjoint and non-empty", () => {
    expect(HERMES_BRIDGE_ALLOWED_APIS.length).toBeGreaterThan(0);
    expect(HERMES_BRIDGE_FORBIDDEN_APIS.length).toBeGreaterThan(0);
    const allow = new Set(HERMES_BRIDGE_ALLOWED_APIS);
    for (const f of HERMES_BRIDGE_FORBIDDEN_APIS) {
      expect(allow.has(f)).toBe(false);
    }
  });

  it("includes core zone and bridge entrypoints", () => {
    expect(HERMES_BRIDGE_ALLOWED_APIS).toContain("readZoneFile");
    expect(HERMES_BRIDGE_ALLOWED_APIS).toContain("createHermesBridgeTask");
    expect(HERMES_BRIDGE_ALLOWED_APIS).toContain("runHermesLocalPilotTask");
  });

  it("flags raw bypass patterns as forbidden", () => {
    expect(HERMES_BRIDGE_FORBIDDEN_APIS).toContain("raw_fs_direct");
    expect(HERMES_BRIDGE_FORBIDDEN_APIS).toContain(
      "post_approval_auto_execution_bridge",
    );
  });

  it("flags IPC-documentation constants", () => {
    expect(HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS).toEqual([
      "hermesBridge.registry.getReadiness",
    ]);
    expect(HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS).toContain(
      "hermesBridge.registry.getAllowedApis",
    );
    expect(HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS).toContain(
      "hermesBridge.pilot.run",
    );
  });

  it("defines human gate strings", () => {
    expect(HERMES_BRIDGE_READINESS_REQUIREMENTS.length).toBeGreaterThan(0);
  });
});

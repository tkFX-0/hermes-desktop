import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  getHermesBridgePilotReadiness,
  projectHasHermesBridgeGateDocs,
} from "../../../src/main/ichikishima/hermes/hermes-bridge-readiness";

describe("hermes-bridge-readiness", () => {
  const projectRoot = path.resolve(__dirname, "../../..");

  it("finds gate documents in this repo", () => {
    const docCheck = projectHasHermesBridgeGateDocs(projectRoot);
    expect(docCheck.ok).toBe(true);
    expect(docCheck.missing).toHaveLength(0);
  });

  it("reports NOT_READY when project root invalid", () => {
    const r = getHermesBridgePilotReadiness({ projectRoot: "" });
    expect(r.ready).toBe(false);
    expect(r.label).toBe("NOT_READY");
    expect(r.blockers.length).toBeGreaterThan(0);
    expect(r.allowedApis.length).toBeGreaterThan(0);
    expect(r.forbiddenApis.length).toBeGreaterThan(0);
  });

  it("marks ready when gate docs exist", () => {
    const r = getHermesBridgePilotReadiness({ projectRoot });
    expect(r.ready).toBe(true);
    expect(r.label).toBe("READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN");
    expect(r.blockers).toHaveLength(0);
    expect(r.forbiddenApis).toContain("raw_fs_direct");
  });
});

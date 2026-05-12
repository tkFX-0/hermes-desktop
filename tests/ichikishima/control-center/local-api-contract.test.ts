import path from "node:path";

import { describe, expect, it } from "vitest";

import { getControlCenterReadonlyData } from "../../../src/main/ichikishima/control-center/control-center-data-provider";
import {
  CONTROL_CENTER_LOCAL_API_ALLOWED_ROUTES_V1,
  CONTROL_CENTER_LOCAL_API_BIND_LOOPBACK_IPV4,
  CONTROL_CENTER_LOCAL_API_FORBIDDEN_HTTP_METHODS,
  CONTROL_CENTER_LOCAL_API_FORBIDDEN_PATH_EXAMPLES,
} from "../../../src/main/ichikishima/control-center/local-api-contract";

describe("Control Center local HTTP API contract (no server)", () => {
  it("allows GET /snapshot only", () => {
    expect(CONTROL_CENTER_LOCAL_API_ALLOWED_ROUTES_V1).toHaveLength(1);
    expect(CONTROL_CENTER_LOCAL_API_ALLOWED_ROUTES_V1[0]).toEqual({
      method: "GET",
      path: "/snapshot",
    });
    expect(CONTROL_CENTER_LOCAL_API_BIND_LOOPBACK_IPV4).toBe("127.0.0.1");
  });

  it("forbids destructive HTTP verbs for V1", () => {
    expect(CONTROL_CENTER_LOCAL_API_FORBIDDEN_HTTP_METHODS).toContain("POST");
    expect(CONTROL_CENTER_LOCAL_API_FORBIDDEN_HTTP_METHODS).toContain("PUT");
    expect(CONTROL_CENTER_LOCAL_API_FORBIDDEN_HTTP_METHODS).toContain("PATCH");
    expect(CONTROL_CENTER_LOCAL_API_FORBIDDEN_HTTP_METHODS).toContain("DELETE");

    const allowedMethods = CONTROL_CENTER_LOCAL_API_ALLOWED_ROUTES_V1.map(
      (r) => r.method,
    );
    expect(
      CONTROL_CENTER_LOCAL_API_FORBIDDEN_HTTP_METHODS.every(
        (m) => !(allowedMethods as readonly string[]).includes(m),
      ),
    ).toBe(true);
  });

  it("documents dangerous path examples for deny lists", () => {
    expect(CONTROL_CENTER_LOCAL_API_FORBIDDEN_PATH_EXAMPLES).toContain("/env");
    expect(CONTROL_CENTER_LOCAL_API_FORBIDDEN_PATH_EXAMPLES).toContain(
      "/secrets",
    );
    expect(CONTROL_CENTER_LOCAL_API_FORBIDDEN_PATH_EXAMPLES).toContain(
      "/approval/execute",
    );
    expect(CONTROL_CENTER_LOCAL_API_FORBIDDEN_PATH_EXAMPLES).not.toContain(
      "/snapshot",
    );
  });

  it("getControlCenterReadonlyData matches local API invariants when available", () => {
    const root = path.resolve(__dirname, "../../..");
    const zoneRoot = path.join(root, "sandbox", "hermes-autonomy-zone");

    const data = getControlCenterReadonlyData({
      projectRoot: root,
      zoneRoot,
      dateUtc: "2099-12-04",
      pilotLoop: null,
    });

    expect(data.requiresUserApproval).toBe(true);
    expect(data.canExecuteDangerousActions).toBe(false);
  });
});

import http from "node:http";

import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  CONTROL_CENTER_READONLY_IPC_BINDING,
  CONTROL_CENTER_V1_DISABLED_ACTION_IDS,
} from "../../../src/main/ichikishima/control-center/control-center-data-provider";
import {
  startControlCenterLocalApiServer,
  stopControlCenterLocalApiServer,
  type ControlCenterLocalApiServerHandle,
} from "../../../src/main/ichikishima/control-center/local-api-server";

function providerFixture(): import("../../../src/main/ichikishima/control-center/control-center-data-provider").ControlCenterDataProviderParams {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");
  return {
    projectRoot,
    zoneRoot,
    dateUtc: "2099-12-15",
    pilotLoop: null,
  };
}

function reqRaw(input: {
  port: number;
  path: string;
  method: string;
  headers?: Record<string, string>;
}): Promise<{
  status: number | undefined;
  headers: http.IncomingHttpHeaders;
  body: string;
}> {
  return new Promise((resolve, reject) => {
    const r = http.request(
      {
        hostname: "127.0.0.1",
        port: input.port,
        path: input.path,
        method: input.method,
        headers: input.headers,
      },
      (res) => {
        let buf = "";
        res.on("data", (c) => {
          buf += String(c);
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: buf,
          });
        });
      },
    );
    r.on("error", reject);
    r.end();
  });
}

describe("control-center local-api-server (minimal HTTP)", () => {
  let handle: ControlCenterLocalApiServerHandle | undefined;

  afterEach(async () => {
    if (handle) {
      await stopControlCenterLocalApiServer(handle);
      handle = undefined;
    }
  });

  it("rejects bind to 0.0.0.0", async () => {
    const started = await startControlCenterLocalApiServer({
      host: "0.0.0.0",
      port: 0,
      providerParams: providerFixture(),
    });
    expect(started.ok).toBe(false);
    if (!started.ok) expect(started.reasonCode).toBe("BIND_HOST_REJECTED");
  });

  it("serves GET /snapshot JSON from 127.0.0.1", async () => {
    const s = await startControlCenterLocalApiServer({
      port: 0,
      providerParams: providerFixture(),
    });
    expect(s.ok).toBe(true);
    if (!s.ok) return;
    handle = s.handle;

    const res = await reqRaw({
      port: handle.boundPort,
      path: "/snapshot",
      method: "GET",
    });
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();

    const j = JSON.parse(res.body);
    expect(j.ipcBinding).toEqual(CONTROL_CENTER_READONLY_IPC_BINDING);
    expect(j.requiresUserApproval).toBe(true);
    expect(j.canExecuteDangerousActions).toBe(false);
    expect(j.disabledActions).toEqual([
      ...CONTROL_CENTER_V1_DISABLED_ACTION_IDS,
    ]);

    expect(res.body.toLowerCase()).not.toContain("trace");
    expect(res.body.toLowerCase()).not.toContain("eval(");
  });

  it("returns 404 for forbidden paths such as GET /env", async () => {
    const s = await startControlCenterLocalApiServer({
      port: 0,
      providerParams: providerFixture(),
    });
    expect(s.ok).toBe(true);
    if (!s.ok) return;
    handle = s.handle;

    const res = await reqRaw({
      port: handle.boundPort,
      path: "/env",
      method: "GET",
    });
    expect(res.status).toBe(404);
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    const j = JSON.parse(res.body);
    expect(j.ok).toBe(false);
  });

  it("returns 405 for HEAD/OPTIONS and write methods on /snapshot", async () => {
    const s = await startControlCenterLocalApiServer({
      port: 0,
      providerParams: providerFixture(),
    });
    expect(s.ok).toBe(true);
    if (!s.ok) return;
    handle = s.handle;

    for (const method of [
      "HEAD",
      "OPTIONS",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ]) {
      const res = await reqRaw({
        port: handle.boundPort,
        path: "/snapshot",
        method,
      });
      expect(res.status, method).toBe(405);
      expect(res.headers["access-control-allow-origin"]).toBeUndefined();
      if (method === "HEAD" || method === "OPTIONS") {
        expect(res.body.length).toBe(0);
        continue;
      }
      const j = JSON.parse(res.body);
      expect(j.ok).toBe(false);
      expect(j.reasonCode).toBe("METHOD_NOT_ALLOWED");
      expect(res.body.toLowerCase()).not.toContain(" at ");
    }
  });

  it("blocks second start without stop", async () => {
    const s = await startControlCenterLocalApiServer({
      port: 0,
      providerParams: providerFixture(),
    });
    expect(s.ok).toBe(true);
    if (!s.ok) return;
    handle = s.handle;

    const replay = await startControlCenterLocalApiServer({
      port: 0,
      providerParams: providerFixture(),
    });
    expect(replay.ok).toBe(false);
    if (!replay.ok) {
      expect(replay.reasonCode).toBe("LOCAL_API_ALREADY_STARTED");
    }
  });

  it("stops cleanly", async () => {
    const s = await startControlCenterLocalApiServer({
      port: 0,
      providerParams: providerFixture(),
    });
    expect(s.ok).toBe(true);
    if (!s.ok) return;
    handle = s.handle;

    const st = await stopControlCenterLocalApiServer(handle);
    expect(st.ok).toBe(true);
    handle = undefined;

    const s2 = await startControlCenterLocalApiServer({
      port: 0,
      providerParams: providerFixture(),
    });
    expect(s2.ok).toBe(true);
    if (s2.ok) handle = s2.handle;
  });
});

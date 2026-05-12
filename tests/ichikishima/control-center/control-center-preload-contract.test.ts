import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CONTROL_CENTER_READONLY_IPC_APP_CHANNEL } from "../../../src/main/ichikishima/control-center/control-center-readonly-ipc";
import {
  ICHIKISHIMA_CONTROL_CENTER_PRELOAD_PUBLIC_METHODS,
  createIchikishimaControlCenterPreloadApi,
} from "../../../src/preload/ichikishima-control-center";
import { CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL } from "../../../src/shared/ichikishima/control-center-readonly-ipc-channel";

const projRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

describe("control-center-preload-contract", () => {
  it("shared channel matches main CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_APP_SNAPSHOT", () => {
    expect(CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL).toBe(
      CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_APP_SNAPSHOT,
    );
  });

  it("public method list is only getAppSnapshot", () => {
    expect([...ICHIKISHIMA_CONTROL_CENTER_PRELOAD_PUBLIC_METHODS]).toEqual([
      "getAppSnapshot",
    ]);
  });

  it("factory exposes only getAppSnapshot", () => {
    const api = createIchikishimaControlCenterPreloadApi();
    expect(Object.keys(api).sort()).toEqual(["getAppSnapshot"]);
  });

  const forbiddenNameFragments = [
    "runHermes",
    "executeApproval",
    "rawFs",
    "rawIpc",
    "rawShell",
    "rawNetwork",
    "rawGit",
    "runShell",
    "runWsl",
    "runProcess",
    "spawn",
    "invokeChannel",
  ] as const;

  it("ichikishima-control-center.ts has no forbidden API name substrings", () => {
    const p = path.join(projRoot, "src/preload/ichikishima-control-center.ts");
    const src = readFileSync(p, "utf8");
    for (const frag of forbiddenNameFragments) {
      expect(src.includes(frag), `unexpected token ${frag}`).toBe(false);
    }
    expect(src).toContain(
      "CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL",
    );
    expect(src).not.toMatch(/\binvoke\s*\(\s*["'`]/);
  });

  it("preload index exposes ichikishimaControlCenter and does not expose ipcRenderer on window", () => {
    const p = path.join(projRoot, "src/preload/index.ts");
    const src = readFileSync(p, "utf8");
    expect(src).toContain("ichikishimaControlCenter");
    expect(src).toContain("exposeInMainWorld");
    expect(src).not.toMatch(/exposeInMainWorld\(\s*["']ipcRenderer["']/);
  });
});

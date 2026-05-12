import { describe, expect, it } from "vitest";

import {
  createHermesWsl2WrapperPreparedRun,
  summarizeHermesWsl2WrapperConfig,
  validateHermesWsl2WrapperConfig,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-config";

describe("hermes-wsl2-wrapper-config", () => {
  it("treats empty input as pending (not execution error)", () => {
    const v = validateHermesWsl2WrapperConfig(undefined);
    expect(v.outcome).toBe("pending");
    expect(v.pendingFields.length).toBeGreaterThan(0);
  });

  it("accepts strict wsl argv shape without executing", () => {
    const v = validateHermesWsl2WrapperConfig({
      distroName: "Ubuntu",
      wrapperScriptPathInsideWsl: "/home/ubuntu/.hb/wrap.sh",
      allowedExecutableId: "wsl-hermes-bridge-wrapper-v1",
      adapterKind: "wsl_wrapper",
      argv: ["-d", "Ubuntu", "--", "/home/ubuntu/.hb/wrap.sh"],
    });
    expect(v.outcome).toBe("designReadyNoExecution");
    const run = createHermesWsl2WrapperPreparedRun({
      distroName: "Ubuntu",
      wrapperScriptPathInsideWsl: "/home/ubuntu/.hb/wrap.sh",
      allowedExecutableId: "wsl-hermes-bridge-wrapper-v1",
      adapterKind: "wsl_wrapper",
      argv: ["-d", "Ubuntu", "--", "/home/ubuntu/.hb/wrap.sh"],
    });
    expect(run.willInvokeWsl).toBe(false);
  });

  it("summary line stays short without absolute windows paths", () => {
    const s = summarizeHermesWsl2WrapperConfig({});
    expect(s.statusLine.length).toBeLessThanOrEqual(220);
    expect(s.statusLine.toLowerCase()).not.toMatch(/\\\\users\\\\/i);
  });
});

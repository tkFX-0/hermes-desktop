import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  createHermesControlledPilotPreparedRun,
  rejectIncompleteHermesControlledPilotConfig,
  validateHermesControlledPilotConfig,
  type HermesControlledPilotConfig,
} from "../../../src/main/ichikishima/hermes/hermes-controlled-pilot-config";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../");
const ZONE = join(REPO_ROOT, "sandbox/hermes-autonomy-zone");

function baseConfig(
  overrides: Partial<HermesControlledPilotConfig> = {},
): HermesControlledPilotConfig {
  const exe =
    overrides.executablePath ??
    join(ZONE, "tmp/hermes-controlled-pilot-fake-path.exe");
  return {
    executablePath: exe,
    allowedExecutableId: "pilot-config-test-id",
    argv: ["--mode", "bridge-payload-once"],
    cwd: ZONE,
    zoneRoot: ZONE,
    projectRoot: REPO_ROOT,
    timeoutMs: 9000,
    maxStdoutBytes: 65_536,
    maxStderrBytes: 16_384,
    humanSignoffConfirmed: true as const,
    enableRealProcessExecution: true as const,
    signoffAtUnixMs: 1_700_000_000_000,
    signoffSource: "HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md §12",
    operatorLabel: "user",
    ...overrides,
  };
}

describe("hermes-controlled-pilot-config", () => {
  it("validates complete config", () => {
    const r = validateHermesControlledPilotConfig(baseConfig());
    expect(r.ok).toBe(true);
    expect(r.missingFields.length).toBe(0);
  });

  it("rejects executablePath missing", () => {
    const r = validateHermesControlledPilotConfig(
      baseConfig({ executablePath: "" }),
    );
    expect(r.ok).toBe(false);
  });

  it("rejects blank allowedExecutableId", () => {
    const r = validateHermesControlledPilotConfig(
      baseConfig({ allowedExecutableId: "" }),
    );
    expect(r.ok).toBe(false);
  });

  it("rejects argv missing", () => {
    const r = validateHermesControlledPilotConfig(baseConfig({ argv: [] }));
    expect(r.ok).toBe(false);
  });

  it("rejects timeout missing", () => {
    const r = validateHermesControlledPilotConfig(baseConfig({ timeoutMs: 0 }));
    expect(r.ok).toBe(false);
  });

  it("rejects signoff fields missing", () => {
    const r = validateHermesControlledPilotConfig(
      baseConfig({ signoffAtUnixMs: Number.NaN }),
    );
    expect(r.ok).toBe(false);
  });

  it("rejects forbidden argv tokens", () => {
    expect(
      validateHermesControlledPilotConfig(
        baseConfig({ argv: ["--prompt", "x"] }),
      ).ok,
    ).toBe(false);
    expect(
      validateHermesControlledPilotConfig(
        baseConfig({ argv: ["--network", "x"] }),
      ).ok,
    ).toBe(false);
  });

  it("rejects interpreter-like trailing argv basename", () => {
    expect(
      validateHermesControlledPilotConfig(
        baseConfig({ argv: ["--mode", "bash"] }),
      ).ok,
    ).toBe(false);
  });

  it("rejects secrets-ish notes", () => {
    expect(
      validateHermesControlledPilotConfig(baseConfig({ notes: "API_KEY=oops" }))
        .ok,
    ).toBe(false);
  });

  it("rejects executable path resembling .env", () => {
    expect(
      validateHermesControlledPilotConfig(
        baseConfig({ executablePath: join(ZONE, "tmp/.env") }),
      ).ok,
    ).toBe(false);
  });

  it("rejectIncomplete mirrors validate", () => {
    expect(rejectIncompleteHermesControlledPilotConfig(baseConfig()).ok).toBe(
      true,
    );
  });

  it("PreparedRun exposes internal adapter options without invoking exec", () => {
    const p = createHermesControlledPilotPreparedRun(baseConfig());
    expect(p.ready).toBe(true);
    const wire = JSON.stringify(p.internalAdapterOptions);
    expect(JSON.parse(wire)).toMatchObject({
      enableRealProcessExecution: true,
    });
    expect(JSON.parse(wire).executablePath.length).toBeGreaterThan(0);
  });

  it("PreparedRun rejects invalid config", () => {
    const p = createHermesControlledPilotPreparedRun(
      baseConfig({ executablePath: "" }),
    );
    expect(p.ready).toBe(false);
    expect(p.internalAdapterOptions).toBeUndefined();
  });

  it("requires wsl_wrapper when executable basename is wsl.exe", () => {
    const r = validateHermesControlledPilotConfig(
      baseConfig({
        executablePath: join(ZONE, "tmp/wsl.exe"),
        argv: [
          "-d",
          "Ubuntu",
          "--",
          "/home/user/.hermes-bridge/hermes-bridge-payload-once.sh",
        ],
      }),
    );
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "ADAPTER_KIND_MISMATCH")).toBe(true);
  });

  it("accepts wsl.exe with adapterKind wsl_wrapper and strict argv", () => {
    const r = validateHermesControlledPilotConfig(
      baseConfig({
        executablePath: join(ZONE, "tmp/wsl.exe"),
        adapterKind: "wsl_wrapper",
        argv: [
          "-d",
          "Ubuntu",
          "--",
          "/home/user/.hermes-bridge/hermes-bridge-payload-once.sh",
        ],
      }),
    );
    expect(r.ok).toBe(true);
  });

  it("rejects wsl_wrapper argv with wrong shape", () => {
    expect(
      validateHermesControlledPilotConfig(
        baseConfig({
          executablePath: join(ZONE, "tmp/wsl.exe"),
          adapterKind: "wsl_wrapper",
          argv: ["--mode", "bridge-payload-once"],
        }),
      ).ok,
    ).toBe(false);
  });

  it("rejects wsl_wrapper when executable is not wsl.exe", () => {
    expect(
      validateHermesControlledPilotConfig(
        baseConfig({
          adapterKind: "wsl_wrapper",
        }),
      ).ok,
    ).toBe(false);
  });
});

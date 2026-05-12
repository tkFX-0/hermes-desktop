import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1 } from "../../../src/main/ichikishima/hermes/hermes-bridge-payload";
import {
  buildMinimalHermesProcessEnv,
  parseHermesProcessStdoutAsPayload,
  runHermesRealProcessIngressExec,
  runRealHermesProcessAdapter,
  runRealHermesProcessAdapterWithPolicy,
  validateHermesProcessArgs,
  validateHermesProcessCwd,
  validateHermesExecutablePath,
  validateHermesRealProcessCommandPolicy,
  validateHermesRealProcessControlledPilotPolicy,
  type HermesRealProcessAdapterExecCall,
} from "../../../src/main/ichikishima/hermes/hermes-real-process-adapter";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../");
const ZONE_ROOT = join(REPO_ROOT, "sandbox/hermes-autonomy-zone");
const MODULE_ADAPTER = join(
  REPO_ROOT,
  "src/main/ichikishima/hermes/hermes-real-process-adapter.ts",
);

function prodPayload(taskId = "adapt-exec-1"): Record<string, unknown> {
  return {
    payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
    taskId,
    title: "exec adapter smoke",
    description: "ok",
    actor: "hermes",
    interactionMode: "production_stub",
    requestedOperations: [
      { kind: "zone_read", requestedPath: "sample/input.txt" },
    ],
  };
}

function baseSignoff(now = 1_700_000_000_000): {
  signoffSource: string;
  signoffAtUnixMs: number;
  operatorLabel: string;
  adapterMode: string;
} {
  return {
    signoffSource: "HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md §12",
    signoffAtUnixMs: now,
    operatorLabel: "user",
    adapterMode: "controlled_pilot_once",
  };
}

function baseOpts(dummyExeAbs: string): HermesRealProcessAdapterExecCall {
  return {
    enableRealProcessExecution: true as const,
    humanSignoffConfirmed: true as const,
    controlledPilot: {
      policy: {
        executable: {
          allowedExecutableId: "sandbox-dummy-exe",
          allowedExecutableRealPaths: [dummyExeAbs],
        },
        argv: { allowedArgSequences: [[]] },
      },
      ...baseSignoff(),
    },
    timeoutMs: 8000,
    maxStdoutBytes: 65_536,
    maxStderrBytes: 16_384,
    executablePath: dummyExeAbs,
    cwd: ZONE_ROOT,
    args: [] as const,
    zoneRoot: ZONE_ROOT,
    projectRoot: REPO_ROOT,
  };
}

describe("hermes-real-process-adapter", () => {
  let dummyExeAbs: string;
  const dirs: string[] = [];

  beforeEach(() => {
    const rel = `_rtest_exe_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    dummyExeAbs = join(ZONE_ROOT, "tmp", rel);
    dirs.push(dummyExeAbs);
    fs.mkdirSync(dirname(dummyExeAbs), { recursive: true });
    fs.writeFileSync(dummyExeAbs, "", "utf8");
  });

  afterEach(() => {
    for (const fp of dirs.splice(0)) {
      try {
        fs.unlinkSync(fp);
      } catch {
        /* ignore */
      }
    }
  });

  it("defaults to disabled without enableRealProcessExecution", async () => {
    const r = await runRealHermesProcessAdapter();
    expect(r.status).toBe("disabled");
    expect(r.reasonCode).toBe("REQUIRES_HUMAN_SIGNOFF");
    expect(r.signoffEvidence).toBeUndefined();
    const j = JSON.stringify(r);
    expect(j).not.toContain('"stdout":"');
    expect(j).not.toMatch(/\b(pid|handle)\b/i);
  });

  it("rejects execution when humanSignoffConfirmed is absent", async () => {
    const r = await runRealHermesProcessAdapter({
      enableRealProcessExecution: true,
    } as Parameters<typeof runRealHermesProcessAdapter>[0]);
    expect(r.status).toBe("rejected");
    expect(r.reasonCode).toBe("REQUIRES_HUMAN_SIGNOFF");
    expect(r.signoffEvidence).toBeUndefined();
  });

  it("runs payload path via __testOnlySimulateExec (no real subprocess)", async () => {
    let simulateCalls = 0;
    const r = await runRealHermesProcessAdapter({
      ...baseOpts(dummyExeAbs),
      __testOnlySimulateExec: async () => {
        simulateCalls += 1;
        return {
          stdout: Buffer.from(JSON.stringify(prodPayload()), "utf8"),
          stderr: Buffer.alloc(0),
        };
      },
    });

    expect(simulateCalls).toBe(1);
    expect(r.status).toBe("completed");
    expect(r.reasonCode).toBe("SUCCESS");
    expect(r.stdoutBytes).toBeGreaterThan(0);
    expect(r.signoffEvidence?.signoffConfirmed).toBe(true);
    expect(r.signoffEvidence?.allowedExecutableId).toBe("sandbox-dummy-exe");
    expect(r.signoffEvidence?.timeoutMs).toBe(8000);
    const serialized = JSON.stringify(r);
    expect(serialized.toLowerCase()).not.toContain("requestedoperations");
    expect(serialized).not.toMatch(/\b(pid|handle|commandline)\b/i);
    expect(serialized).not.toContain('"stdout":');
    expect(serialized).not.toContain('"stderr":');
    expect(serialized).not.toContain('"env":');
    expect(serialized).not.toContain('"normalizedPayload":');
    expect(serialized).not.toContain('"rawPayload":');
    expect(serialized).not.toContain("payloadSchemaVersion");
  });

  it("runRealHermesProcessAdapterWithPolicy completes with fake runner", async () => {
    const core = baseOpts(dummyExeAbs);
    const { controlledPilot, ...phys } = core;
    const r = await runRealHermesProcessAdapterWithPolicy(
      {
        ...phys,
        __testOnlySimulateExec: async () => ({
          stdout: Buffer.from(JSON.stringify(prodPayload("wp-ok")), "utf8"),
          stderr: Buffer.alloc(0),
        }),
      },
      controlledPilot.policy,
      {
        signoffSource: controlledPilot.signoffSource,
        signoffAtUnixMs: controlledPilot.signoffAtUnixMs,
        operatorLabel: controlledPilot.operatorLabel,
        adapterMode: controlledPilot.adapterMode,
      },
    );
    expect(r.status).toBe("completed");
    expect(r.signoffEvidence?.adapterMode).toBe("controlled_pilot_once");
  });

  it("rejects executable not allowlisted", () => {
    const fakePolicy = {
      allowedExecutableRealPaths: [
        join(ZONE_ROOT, "tmp/nonexistent-fake-xxxx-allow-entry"),
      ],
      allowedArgSequences: [[]],
    };
    const r = validateHermesExecutablePath(dummyExeAbs, fakePolicy);
    expect(r.ok).toBe(false);
  });

  it("rejects argv mismatches against policy sequences", () => {
    expect(
      validateHermesProcessArgs(["--evil"], {
        allowedExecutableRealPaths: [dummyExeAbs],
        allowedArgSequences: [[]],
      }).ok,
    ).toBe(false);
  });

  it("rejects cwd outside sandbox or zone roots", () => {
    expect(
      validateHermesProcessCwd(join(REPO_ROOT, ".."), ZONE_ROOT, REPO_ROOT).ok,
    ).toBe(false);
    expect(validateHermesProcessCwd(ZONE_ROOT, ZONE_ROOT, REPO_ROOT).ok).toBe(
      true,
    );
  });

  it("buildMinimalHermesProcessEnv rejects PASSWORD-ish keys", () => {
    const b = buildMinimalHermesProcessEnv({ MY_PASSWORD_FIELD: "x" });
    expect(b.ok).toBe(false);
  });

  it("parses bounded stdout JSON fragments", () => {
    const p = parseHermesProcessStdoutAsPayload(
      '{"payloadSchemaVersion":1}',
      64,
    );
    expect(p.byteLength).toBeGreaterThan(0);
    expect(parseHermesProcessStdoutAsPayload("{", 10).parsed).toBeNull();
  });

  it("adapter source forbids spawn( and naked exec(", () => {
    const src = fs.readFileSync(MODULE_ADAPTER, "utf8");
    expect(src).not.toMatch(/\bspawn\s*\(/);
    expect(src).not.toMatch(/\bexec\s*\([^F]/);
    expect(src).toContain("execFile");
  });

  it("ingress helper returns normalized payload when completed", async () => {
    const ing = await runHermesRealProcessIngressExec({
      ...baseOpts(dummyExeAbs),
      __testOnlySimulateExec: async () => ({
        stdout: Buffer.from(JSON.stringify(prodPayload("ingress-ok")), "utf8"),
        stderr: Buffer.alloc(0),
      }),
    });
    expect(ing.ok).toBe(true);
    if (!ing.ok) return;
    expect(ing.normalizedPayload.payloadSchemaVersion).toBe(
      HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
    );
  });

  it("empty derived command policy is rejected upstream", () => {
    expect(
      validateHermesRealProcessCommandPolicy({
        allowedExecutableRealPaths: [],
        allowedArgSequences: [[]],
      }).ok,
    ).toBe(false);
  });

  it("validateHermesRealProcessControlledPilotPolicy rejects blank id", () => {
    const bad = validateHermesRealProcessControlledPilotPolicy({
      executable: {
        allowedExecutableId: "",
        allowedExecutableRealPaths: [ZONE_ROOT],
      },
      argv: { allowedArgSequences: [[]] },
    });
    expect(bad.ok).toBe(false);
  });

  it("controlled pilot rejects empty operatorLabel without signoff evidence", async () => {
    const r = await runRealHermesProcessAdapter({
      ...baseOpts(dummyExeAbs),
      controlledPilot: {
        ...baseOpts(dummyExeAbs).controlledPilot,
        operatorLabel: "   ",
      },
    });
    expect(r.reasonCode).toBe("POLICY_REJECTED");
    expect(r.signoffEvidence).toBeUndefined();
  });

  it("rejects malformed JSON stdout after signoff phase", async () => {
    const r = await runRealHermesProcessAdapter({
      ...baseOpts(dummyExeAbs),
      __testOnlySimulateExec: async () => ({
        stdout: Buffer.from("not-json", "utf8"),
        stderr: Buffer.alloc(0),
      }),
    });
    expect(r.status).toBe("rejected");
    expect(r.reasonCode).toBe("MALFORMED_OUTPUT");
    expect(r.signoffEvidence?.signoffConfirmed).toBe(true);
  });

  it("rejects stdout size over cap", async () => {
    const big = JSON.stringify({
      ...prodPayload(),
      description: "x".repeat(4000),
    });
    expect(Buffer.byteLength(big, "utf8")).toBeGreaterThan(1024);
    const r = await runRealHermesProcessAdapter({
      ...baseOpts(dummyExeAbs),
      maxStdoutBytes: 1024,
      __testOnlySimulateExec: async () => ({
        stdout: Buffer.from(big, "utf8"),
        stderr: Buffer.alloc(0),
      }),
    });
    expect(r.reasonCode).toBe("OUTPUT_TOO_LARGE");
    expect(r.signoffEvidence?.maxStdoutBytes).toBe(1024);
  });

  it("rejects stderr size over cap", async () => {
    const pad = "y".repeat(400);
    const r = await runRealHermesProcessAdapter({
      ...baseOpts(dummyExeAbs),
      maxStderrBytes: 256,
      __testOnlySimulateExec: async () => ({
        stdout: Buffer.from(JSON.stringify(prodPayload()), "utf8"),
        stderr: Buffer.from(pad, "utf8"),
      }),
    });
    expect(r.reasonCode).toBe("STDERR_TOO_LARGE");
    const ser = JSON.stringify(r);
    expect(ser).not.toContain(pad.slice(0, 48));
    expect(r.signoffEvidence?.maxStderrBytes).toBe(256);
  });

  it("rejects invalid bridge payloads from stdout JSON", async () => {
    const bad = JSON.stringify({
      payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      taskId: "t",
      requestedOperations: [
        {
          kind: "zone_execute",
          requestedPath: "sample/input.txt",
        },
      ],
    });
    const r = await runRealHermesProcessAdapter({
      ...baseOpts(dummyExeAbs),
      __testOnlySimulateExec: async () => ({
        stdout: Buffer.from(bad, "utf8"),
        stderr: Buffer.alloc(0),
      }),
    });
    expect(["PAYLOAD_REJECTED", "UNSUPPORTED_SCHEMA_VERSION"]).toContain(
      r.reasonCode,
    );
    const ser = JSON.stringify(r);
    expect(ser.toLowerCase()).not.toContain("requestedoperations");
    expect(r.signoffEvidence?.signoffConfirmed).toBe(true);
  });
});

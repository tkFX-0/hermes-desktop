import { describe, expect, it } from "vitest";

import {
  CANONICAL_WSL_EXE_PATH_LOWER,
  CANONICAL_WSL_EXE_SYSNATIVE_LOWER,
  EXPECTED_ALLOWED_EXECUTABLE_ID,
  EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION,
  RECOMMENDED_REGISTRY_DOCUMENT_VERSION,
  createEmptyHermesWsl2WrapperParameterRegistry,
  createHermesWsl2WrapperPreparedInvocationPreview,
  expectedWrapperPathForUnixUser,
  isAcceptableWindowsWslExeCandidate,
  isForbiddenWrapperPathPolicy,
  summarizeHermesWsl2WrapperParameterRegistry,
  validateHermesWsl2WrapperParameterRegistry,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-parameter-registry";

const validBase = (): Record<string, unknown> => ({
  distroName: "UbuntuPreview",
  unixUser: "hermes_lab",
  wrapperScriptPathInsideWsl: expectedWrapperPathForUnixUser("hermes_lab"),
  allowedExecutableId: EXPECTED_ALLOWED_EXECUTABLE_ID,
  payloadSchemaVersion: EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION,
  signoffSource: "human_signoff_template_v1_only",
  operatorLabel: "local_operator_preview",
  timeoutMs: 120_000,
  maxStdoutBytes: 65_536,
  maxStderrBytes: 8192,
});

describe("hermes-wsl2-wrapper-parameter-registry", () => {
  it("createEmpty validates as all pending", () => {
    const r = validateHermesWsl2WrapperParameterRegistry(
      createEmptyHermesWsl2WrapperParameterRegistry(),
    );
    expect(r.status).toBe("pending");
    expect(r.pendingFields.length).toBeGreaterThan(0);
    expect(r.rejectedFields.length).toBe(0);
  });

  it("rejects secrets-like fragments", () => {
    const v = validateHermesWsl2WrapperParameterRegistry({
      ...validBase(),
      operatorLabel: "x API_KEY leaked",
    } as Record<string, never>);
    expect(v.status).toBe("rejected");
    expect(v.rejectedFields.some((x) => x.field === "operatorLabel")).toBe(
      true,
    );
  });

  it("rejects wrapper path mismatch with unix user fixed policy", () => {
    const v = validateHermesWsl2WrapperParameterRegistry({
      ...validBase(),
      wrapperScriptPathInsideWsl: "/home/hermes_lab/other.sh",
    } as Record<string, never>);
    expect(v.status).toBe("rejected");
    expect(
      v.rejectedFields.some(
        (x) => x.code === "wrapper_path_mismatch_fixed_policy",
      ),
    ).toBe(true);
  });

  it("rejects forbidden wrapper segments e.g. /mnt/", () => {
    const v = validateHermesWsl2WrapperParameterRegistry({
      ...validBase(),
      wrapperScriptPathInsideWsl: "/mnt/c/foo/hermes-bridge-payload-once.sh",
    } as Record<string, never>);
    expect(v.status).toBe("rejected");
    expect(
      v.rejectedFields.some((x) => x.code === "wrapper_path_forbidden_segment"),
    ).toBe(true);
    expect(isForbiddenWrapperPathPolicy("/mnt/c/foo")).toBe(true);
    expect(isForbiddenWrapperPathPolicy("/home/u/.hermes-bridge/x")).toBe(
      false,
    );
  });

  it("registry_ready when full valid registry (no candidate field)", () => {
    const v = validateHermesWsl2WrapperParameterRegistry(validBase());
    expect(v.status).toBe("registry_ready_execution_forbidden");
    expect(v.derivedArgvForValidation?.length).toBe(4);
    expect(v.pendingFields.length).toBe(0);
  });

  it("accepts canonical wsl exe candidate exact match only", () => {
    const v = validateHermesWsl2WrapperParameterRegistry({
      ...validBase(),
      windowsWslExecutableCandidate: "C:\\Windows\\System32\\wsl.exe",
    });
    expect(v.status).toBe("registry_ready_execution_forbidden");
    expect(v.confirmedFields).toContain("windowsWslExecutableCandidate");
  });

  it("rejects Sysnative and endsWith-implied faux system32 paths (V1 strict)", () => {
    expect(
      isAcceptableWindowsWslExeCandidate(CANONICAL_WSL_EXE_PATH_LOWER),
    ).toBe(true);
    expect(
      isAcceptableWindowsWslExeCandidate(CANONICAL_WSL_EXE_SYSNATIVE_LOWER),
    ).toBe(false);
    expect(
      isAcceptableWindowsWslExeCandidate(
        "D:\\somewhere\\Windows\\System32\\wsl.exe",
      ),
    ).toBe(false);
  });

  it("summarize exposes canRun false and productionReady false", () => {
    const s = summarizeHermesWsl2WrapperParameterRegistry(undefined);
    expect(s.canRunWsl).toBe(false);
    expect(s.canRunBridgeOnceViaWsl).toBe(false);
    expect(s.productionReady).toBe(false);
  });

  it("prepared preview redacts argv and never executes", () => {
    const p = createHermesWsl2WrapperPreparedInvocationPreview(validBase());
    expect(p.willExecute).toBe(false);
    expect(p.patternId).toBe("wsl_strict_v1_four_token");
  });

  it("optional meta registryVersion expectedSchema logLevel (not in argv)", () => {
    const v = validateHermesWsl2WrapperParameterRegistry({
      ...validBase(),
      registryVersion: RECOMMENDED_REGISTRY_DOCUMENT_VERSION,
      expectedPayloadSchemaVersion: EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION,
      logLevel: "minimal",
    } as Record<string, unknown>);
    expect(v.status).toBe("registry_ready_execution_forbidden");
    expect(v.confirmedFields).toContain("registryVersion");
    expect(v.confirmedFields).toContain("expectedPayloadSchemaVersion");
    expect(v.confirmedFields).toContain("logLevel");
    expect(
      v.safeSummaryLines.some((l) => l.startsWith("registry_meta:log_level=")),
    ).toBe(true);
  });

  it("rejects invalid logLevel", () => {
    const v = validateHermesWsl2WrapperParameterRegistry({
      ...validBase(),
      logLevel: "verbose",
    } as Record<string, never>);
    expect(v.status).toBe("rejected");
    expect(v.rejectedFields.some((x) => x.field === "logLevel")).toBe(true);
  });

  it("rejects wrong payloadSchemaVersion", () => {
    const v = validateHermesWsl2WrapperParameterRegistry({
      ...validBase(),
      payloadSchemaVersion: `${EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION}x`,
    } as Record<string, never>);
    expect(v.status).toBe("rejected");
    expect(
      v.rejectedFields.some((x) => x.code === "payload_schema_mismatch"),
    ).toBe(true);
  });
});

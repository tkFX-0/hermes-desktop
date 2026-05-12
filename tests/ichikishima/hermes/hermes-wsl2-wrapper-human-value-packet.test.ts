import { describe, expect, it } from "vitest";

import {
  coerceLocalOnlyJsonObjectToHumanValuePacket,
  createEmptyHermesWsl2WrapperHumanValuePacket,
  createHermesWsl2WrapperHumanSignoffChecklist,
  humanValuePacketToRegistry,
  redactHermesWsl2WrapperHumanValuePacketForRenderer,
  summarizeHermesWsl2WrapperHumanValuePacket,
  summarizeRedactedLocalValuePacket,
  validateHermesWsl2WrapperHumanValuePacket,
  validateLocalOnlyValuePacketShape,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-human-value-packet";
import {
  EXPECTED_ALLOWED_EXECUTABLE_ID,
  EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION,
  expectedWrapperPathForUnixUser,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-parameter-registry";

const validPacket = () =>
  ({
    distroName: "UbuntuPreview",
    unixUser: "hermes_lab",
    wrapperPath: expectedWrapperPathForUnixUser("hermes_lab"),
    windowsWslExePath: "C:\\Windows\\System32\\wsl.exe",
    allowedExecutableId: EXPECTED_ALLOWED_EXECUTABLE_ID,
    timeoutMs: 120_000,
    maxStdoutBytes: 65_536,
    maxStderrBytes: 8192,
    expectedPayloadSchemaVersion: EXPECTED_BRIDGE_PAYLOAD_SCHEMA_VERSION,
    signoffSource: "human_packet_template_v1",
    operatorLabel: "local_operator",
  }) as const;

describe("hermes-wsl2-wrapper-human-value-packet", () => {
  it("createEmpty is all pending", () => {
    const v = validateHermesWsl2WrapperHumanValuePacket(
      createEmptyHermesWsl2WrapperHumanValuePacket(),
    );
    expect(v.status).toBe("pending");
    expect(v.pendingFields.length).toBeGreaterThan(0);
  });

  it("maps to registry for delegation", () => {
    const r = humanValuePacketToRegistry(validPacket());
    expect(r.wrapperScriptPathInsideWsl).toContain(".hermes-bridge");
  });

  it("packet complete mirrors registry_ready with system32 exe", () => {
    const v = validateHermesWsl2WrapperHumanValuePacket(validPacket());
    expect(v.status).toBe("packet_complete_execution_forbidden");
    expect(v.registryValidation.status).toBe(
      "registry_ready_execution_forbidden",
    );
  });

  it("rejects sysnative path in V1", () => {
    const v = validateHermesWsl2WrapperHumanValuePacket({
      ...(validPacket() as Record<string, unknown>),
      windowsWslExePath: "C:\\Windows\\Sysnative\\wsl.exe",
    });
    expect(v.status).toBe("rejected");
    expect(v.windowsExeClass).toBe("sysnative_future_v11_blocked");
    expect(v.rejectedFields.some((x) => x.code.includes("sysnative"))).toBe(
      true,
    );
  });

  it("summarize has sysnativePolicy constant", () => {
    const s = summarizeHermesWsl2WrapperHumanValuePacket(undefined);
    expect(s.sysnativePolicy).toBe("future_candidate_not_allowed_v1");
    expect(s.canRunWsl).toBe(false);
    expect(s.productionReady).toBe(false);
  });

  it("redact leaves argv as labels only", () => {
    const r = redactHermesWsl2WrapperHumanValuePacketForRenderer(validPacket());
    expect(r.argvPreviewLabels.every((x) => !/[A-Za-z]:\\/.test(x))).toBe(true);
    expect(r.argvPreviewLabels).toContain("DISTRO_REDACTED");
  });

  it("signoff checklist has policy rows", () => {
    const c = createHermesWsl2WrapperHumanSignoffChecklist();
    expect(c.some((l) => l.includes("Sysnative"))).toBe(true);
    expect(c.length).toBeGreaterThan(4);
  });

  it("rejects out-of-range signoffAtUnixMs", () => {
    const v = validateHermesWsl2WrapperHumanValuePacket({
      ...(validPacket() as Record<string, unknown>),
      signoffAtUnixMs: 100,
    });
    expect(v.status).toBe("rejected");
    expect(v.rejectedFields.some((x) => x.field === "signoffAtUnixMs")).toBe(
      true,
    );
  });

  it("validateLocalOnlyValuePacketShape rejects unknown top-level keys", () => {
    const s = validateLocalOnlyValuePacketShape({
      distroName: "x",
      extraSecretField: "no",
    });
    expect(s.ok).toBe(false);
    expect(s.issues.some((x) => x.startsWith("unknown_top_level_key:"))).toBe(
      true,
    );
  });

  it("validateLocalOnlyValuePacketShape accepts local-only example shape", () => {
    const s = validateLocalOnlyValuePacketShape({
      _comment: "ok",
      distroName: "<WSL_DISTRO_NAME>",
      unixUser: "<POSIX_USER_TOKEN>",
      wrapperPath:
        "/home/<POSIX_USER_TOKEN>/.hermes-bridge/hermes-bridge-payload-once.sh",
      windowsWslExePath: "C:\\Windows\\System32\\wsl.exe",
      allowedExecutableId: "wsl-hermes-bridge-wrapper-v1",
      timeoutMs: 120000,
      maxStdoutBytes: 65536,
      maxStderrBytes: 8192,
      expectedPayloadSchemaVersion: "hermes-bridge-payload/v1",
      logLevel: "minimal",
      signoffSource: "<SIGNOFF_REF>",
      operatorLabel: "<OPERATOR_ROLE_LABEL>",
      signoffAtUnixMs: null,
    });
    expect(s.ok).toBe(true);
  });

  it("summarizeRedactedLocalValuePacket lines omit raw distro and unix user", () => {
    const raw = {
      ...validPacket(),
    } as Record<string, unknown>;
    const sum = summarizeRedactedLocalValuePacket(raw);
    expect(sum.summarySchemaVersion).toBe(
      "redacted_local_value_packet_summary/v1",
    );
    const blob = sum.lines.join("\n").toLowerCase();
    expect(blob).not.toContain(String(raw.distroName).toLowerCase());
    expect(blob).not.toContain(String(raw.unixUser).toLowerCase());
    expect(blob).not.toContain("/home/hermes_lab");
  });

  it("coerceLocalOnlyJsonObjectToHumanValuePacket ignores _comment", () => {
    const p = coerceLocalOnlyJsonObjectToHumanValuePacket({
      _comment: "x",
      distroName: "U",
    });
    expect(p.distroName).toBe("U");
  });
});

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  humanValuePacketToRegistry,
  validateHermesWsl2WrapperHumanValuePacket,
} from "../../../src/main/ichikishima/hermes/hermes-wsl2-wrapper-human-value-packet";

const REPO_ROOT = path.resolve(__dirname, "../../..");
const GITIGNORE_PATH = path.join(REPO_ROOT, ".gitignore");
const EXAMPLE_PATH = path.join(
  REPO_ROOT,
  "sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.example.json",
);

describe("WSL2 wrapper local value storage policy (static)", () => {
  it(".gitignore excludes local real-value filename", () => {
    const g = fs.readFileSync(GITIGNORE_PATH, "utf8");
    expect(g).toContain("wsl-wrapper-values.local.json");
    expect(g).toContain("local-only");
  });

  it("example JSON has no secret-like tokens", () => {
    const raw = fs.readFileSync(EXAMPLE_PATH, "utf8");
    expect(raw.toLowerCase()).not.toMatch(
      /api[_-]?key\s*=|password\s*=|secret\s*=|bearer\s|openai|\.env\b|sk-[a-z0-9]{10,}/,
    );
    const o = JSON.parse(raw) as Record<string, unknown>;
    expect(o).toBeDefined();
    delete o._comment;
    const wire = JSON.stringify(o).toLowerCase();
    expect(wire).not.toContain("sk-");
    expect(wire).not.toContain("api_key");
  });

  it("packetToRegistry conversion path still available from example-shaped object", () => {
    const o = JSON.parse(fs.readFileSync(EXAMPLE_PATH, "utf8")) as Record<
      string,
      unknown
    >;
    delete o._comment;
    const packet = {
      distroName: String(o.distroName),
      unixUser: String(o.unixUser),
      wrapperPath: String(o.wrapperPath),
      windowsWslExePath: String(o.windowsWslExePath),
      allowedExecutableId: String(o.allowedExecutableId),
      timeoutMs: Number(o.timeoutMs),
      maxStdoutBytes: Number(o.maxStdoutBytes),
      maxStderrBytes: Number(o.maxStderrBytes),
      expectedPayloadSchemaVersion: String(o.expectedPayloadSchemaVersion),
      logLevel: o.logLevel as "minimal",
      signoffSource: "example_static",
      operatorLabel: "example_static",
    };
    const reg = humanValuePacketToRegistry(packet);
    expect(reg.allowedExecutableId).toBe("wsl-hermes-bridge-wrapper-v1");
    const v = validateHermesWsl2WrapperHumanValuePacket(packet);
    expect(v.registryValidation).toBeDefined();
  });
});

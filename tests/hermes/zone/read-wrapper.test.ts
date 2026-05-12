import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, expectTypeOf, it } from "vitest";
import {
  readZoneFile,
  type ReadAuditEventCandidate,
  type ReadEncoding,
  type ReadZoneFileFailure,
  type ReadZoneFileInput,
  type ReadZoneFileResult,
  type ReadZoneFileSuccess,
} from "../../../src/main/ichikishima/autonomy-zone";

const tempRoots: string[] = [];

function makeZoneRoot(): string {
  const projectRoot = mkdtempSync(join(tmpdir(), "hermes-read-wrapper-test-"));
  const zoneRoot = join(projectRoot, "sandbox", "hermes-autonomy-zone");
  mkdirSync(zoneRoot, { recursive: true });
  tempRoots.push(projectRoot);
  return zoneRoot;
}

function makeInput(
  zoneRoot: string,
  overrides: Partial<ReadZoneFileInput> = {},
): ReadZoneFileInput {
  return {
    zoneRoot,
    requestedPath: "work/notes.md",
    encoding: "utf8",
    maxBytes: 4096,
    allowBinary: false,
    requestId: "req_test",
    actor: "hermes",
    ...overrides,
  };
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("Hermes Autonomy Zone read wrapper contract", () => {
  it("exports readZoneFile", () => {
    expect(typeof readZoneFile).toBe("function");
  });

  it("reads a normal text file inside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), "hello zone", "utf8");

    const result = readZoneFile(makeInput(zoneRoot));

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.content).toBe("hello zone");
    expect(result.bytesRead).toBe(Buffer.byteLength("hello zone", "utf8"));
    expect(result.truncated).toBe(false);
    expect(result.normalizedPath).toContain("notes.md");
    expect(result.auditEventCandidate).toMatchObject({
      requestId: "req_test",
      actor: "hermes",
      action: "read",
      status: "success",
      bytesRead: Buffer.byteLength("hello zone", "utf8"),
      truncated: false,
      contentIncluded: false,
    });
    expect(result.auditEventCandidate.normalizedPath).toContain("notes.md");
    expect(result.auditEventCandidate).not.toHaveProperty("content");
    expect(JSON.stringify(result.auditEventCandidate)).not.toContain(
      "hello zone",
    );
  });

  it("uses a safe default maxBytes when maxBytes is omitted", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), "hello default", "utf8");

    const result = readZoneFile(
      makeInput(zoneRoot, {
        maxBytes: undefined,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.content).toBe("hello default");
  });

  it("rejects files larger than maxBytes without truncating", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), "1234567890", "utf8");

    const result = readZoneFile(
      makeInput(zoneRoot, {
        maxBytes: 5,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("FILE_TOO_LARGE");
    expect(result.content).toBeNull();
    expect(result.auditEventCandidate.status).toBe("denied");
    expect(result.auditEventCandidate.reasonCode).toBe("FILE_TOO_LARGE");
    expect(result.auditEventCandidate.contentIncluded).toBe(false);
  });

  it("rejects Zone escape before reading", () => {
    const zoneRoot = makeZoneRoot();
    const result = readZoneFile(
      makeInput(zoneRoot, {
        requestedPath: "../outside.md",
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("DENIED_BY_PATH_GUARD");
    expect(result.content).toBeNull();
    expect(result.auditEventCandidate.status).toBe("denied");
    expect(result.auditEventCandidate.reasonCode).toBe("DENIED_BY_PATH_GUARD");
    expect(result.auditEventCandidate.requestId).toBe("req_test");
    expect(result.auditEventCandidate.actor).toBe("hermes");
    expect(result.auditEventCandidate.contentIncluded).toBe(false);
  });

  it("rejects denylisted targets before checking file existence", () => {
    const zoneRoot = makeZoneRoot();
    const cases = [
      ["work/.env.local", ".env.local"],
      ["work/secrets/file.txt", "secrets"],
      ["work/.git/config", ".git"],
      ["work/MT5/config.txt", "mt5"],
      ["work/sessions.db", "sessions.db"],
    ] as const;

    for (const [requestedPath, matchedRule] of cases) {
      const result = readZoneFile(makeInput(zoneRoot, { requestedPath }));

      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.reasonCode).toBe("DENIED_BY_DENYLIST");
      expect(result.reason).toContain(matchedRule);
      expect(result.reasonCode).not.toBe("FILE_NOT_FOUND");
      expect(result.content).toBeNull();
      expect(result.auditEventCandidate.status).toBe("denied");
      expect(result.auditEventCandidate.reasonCode).toBe("DENIED_BY_DENYLIST");
      expect(result.auditEventCandidate.contentIncluded).toBe(false);
    }
  });

  it("returns FILE_NOT_FOUND for missing allowed files", () => {
    const zoneRoot = makeZoneRoot();
    const result = readZoneFile(makeInput(zoneRoot));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("FILE_NOT_FOUND");
    expect(result.content).toBeNull();
    expect(result.auditEventCandidate.status).toBe("error");
    expect(result.auditEventCandidate.reasonCode).toBe("FILE_NOT_FOUND");
    expect(result.auditEventCandidate.contentIncluded).toBe(false);
  });

  it("rejects directories", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work", "notes.md"), { recursive: true });

    const result = readZoneFile(makeInput(zoneRoot));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("TARGET_IS_DIRECTORY");
    expect(result.content).toBeNull();
  });

  it("rejects binary-like files when allowBinary is false", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), Buffer.from([0, 1, 2]));

    const result = readZoneFile(makeInput(zoneRoot));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("BINARY_NOT_ALLOWED");
    expect(result.content).toBeNull();
  });

  it("does not return binary content even when allowBinary is true in the MVP", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), Buffer.from([0, 1, 2]));

    const result = readZoneFile(
      makeInput(zoneRoot, {
        allowBinary: true,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("BINARY_NOT_ALLOWED");
    expect(result.content).toBeNull();
  });

  it("does not include file content or secret-like values in errors", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), "SECRET_VALUE", "utf8");

    const result = readZoneFile(
      makeInput(zoneRoot, {
        maxBytes: 1,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.content).toBeNull();
    expect(result.reason).not.toContain("SECRET_VALUE");
    expect(JSON.stringify(result.auditEventCandidate)).not.toContain(
      "SECRET_VALUE",
    );
    expect(result.auditEventCandidate).not.toHaveProperty("content");
  });

  it("preserves requestId and actor in auditEventCandidate", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), "audit ok", "utf8");

    const result = readZoneFile(
      makeInput(zoneRoot, {
        requestId: "req_audit",
        actor: "ichikishima",
      }),
    );

    expect(result.auditEventCandidate.requestId).toBe("req_audit");
    expect(result.auditEventCandidate.actor).toBe("ichikishima");
    expect(result.auditEventCandidate.action).toBe("read");
    expect(result.auditEventCandidate.timestamp).toEqual(expect.any(String));
  });

  it("matches the planned success and failure result shapes", () => {
    const successShape: ReadZoneFileSuccess = {
      ok: true,
      normalizedPath: "sandbox/hermes-autonomy-zone/work/notes.md",
      content: "hello",
      bytesRead: 5,
      truncated: false,
      auditEventCandidate: {
        actor: "hermes",
        action: "read",
        status: "success",
        normalizedPath: "sandbox/hermes-autonomy-zone/work/notes.md",
        bytesRead: 5,
        truncated: false,
        contentIncluded: false,
        timestamp: "2026-05-01T00:00:00.000Z",
      },
    };

    const failureShape: ReadZoneFileFailure = {
      ok: false,
      normalizedPath: "sandbox/hermes-autonomy-zone/work/notes.md",
      reasonCode: "DENIED_BY_DENYLIST",
      reason: "Path contains a denied segment: .env",
      content: null,
      auditEventCandidate: {
        actor: "hermes",
        action: "read",
        status: "denied",
        normalizedPath: "sandbox/hermes-autonomy-zone/work/notes.md",
        reasonCode: "DENIED_BY_DENYLIST",
        reason: "Path contains a denied segment: .env",
        contentIncluded: false,
        timestamp: "2026-05-01T00:00:00.000Z",
      },
    };

    expect(successShape.ok).toBe(true);
    expect(successShape.content).toBe("hello");
    expect(failureShape.ok).toBe(false);
    expect(failureShape.content).toBeNull();
  });

  it("keeps the public type contract aligned with the spec", () => {
    expectTypeOf<ReadEncoding>().toEqualTypeOf<"utf8">();
    expectTypeOf<ReadZoneFileResult>().toEqualTypeOf<
      ReadZoneFileSuccess | ReadZoneFileFailure
    >();
    expectTypeOf<ReadZoneFileInput>().toMatchTypeOf<{
      zoneRoot: string;
      requestedPath: string;
      encoding?: ReadEncoding;
      maxBytes?: number;
      allowBinary?: boolean;
      requestId?: string;
      actor: "hermes" | "ichikishima" | "user" | "system";
    }>();
    expectTypeOf<ReadAuditEventCandidate>().toMatchTypeOf<{
      actor: ReadZoneFileInput["actor"];
      action: "read";
      status: "success" | "denied" | "error";
      contentIncluded: false;
      timestamp: string;
    }>();
  });
});

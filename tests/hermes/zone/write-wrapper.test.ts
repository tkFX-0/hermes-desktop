import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, expectTypeOf, it } from "vitest";
import {
  type WriteAuditEventCandidate,
  type WriteEncoding,
  type WriteZoneFileFailure,
  type WriteZoneFileInput,
  type WriteZoneFileResult,
  type WriteZoneFileSuccess,
  writeZoneFile,
} from "../../../src/main/ichikishima/autonomy-zone";

const tempRoots: string[] = [];

function makeZoneRoot(): string {
  const projectRoot = mkdtempSync(join(tmpdir(), "hermes-write-wrapper-test-"));
  const zoneRoot = join(projectRoot, "sandbox", "hermes-autonomy-zone");
  mkdirSync(zoneRoot, { recursive: true });
  tempRoots.push(projectRoot);
  return zoneRoot;
}

function makeInput(
  zoneRoot: string,
  overrides: Partial<WriteZoneFileInput> = {},
): WriteZoneFileInput {
  return {
    zoneRoot,
    requestedPath: "work/notes.md",
    content: "SECRET_WRITE_CONTENT",
    encoding: "utf8",
    maxBytes: 4096,
    overwrite: false,
    createDirs: false,
    requestId: "req_write_test",
    actor: "hermes",
    ...overrides,
  };
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("Hermes Autonomy Zone write wrapper contract", () => {
  it("exports writeZoneFile", () => {
    expect(typeof writeZoneFile).toBe("function");
  });

  it("writes a normal text file inside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });

    const result = writeZoneFile(
      makeInput(zoneRoot, { content: "hello zone" }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.bytesWritten).toBe(Buffer.byteLength("hello zone", "utf8"));
    expect(result.created).toBe(true);
    expect(result.overwritten).toBe(false);
    expect(result.auditEventCandidate).toMatchObject({
      requestId: "req_write_test",
      actor: "hermes",
      action: "write",
      status: "success",
      bytesWritten: Buffer.byteLength("hello zone", "utf8"),
      created: true,
      overwritten: false,
      contentIncluded: false,
    });
    expect(readFileSync(join(zoneRoot, "work", "notes.md"), "utf8")).toBe(
      "hello zone",
    );
  });

  it("creates parent directories only when createDirs is true", () => {
    const zoneRoot = makeZoneRoot();
    const targetPath = join(zoneRoot, "work", "notes.md");

    const denied = writeZoneFile(makeInput(zoneRoot));
    const allowed = writeZoneFile(
      makeInput(zoneRoot, {
        content: "created dirs",
        createDirs: true,
      }),
    );

    expect(denied.ok).toBe(false);
    if (!denied.ok) {
      expect(denied.reasonCode).toBe("PARENT_DIRECTORY_MISSING");
      expect(denied.bytesWritten).toBe(0);
    }
    expect(allowed.ok).toBe(true);
    expect(existsSync(targetPath)).toBe(true);
  });

  it("does not include content in the result or auditEventCandidate", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    const result = writeZoneFile(
      makeInput(zoneRoot, {
        content: "DO_NOT_LEAK_THIS_CONTENT",
      }),
    );

    expect(JSON.stringify(result)).not.toContain("DO_NOT_LEAK_THIS_CONTENT");
    expect(JSON.stringify(result.auditEventCandidate)).not.toContain(
      "DO_NOT_LEAK_THIS_CONTENT",
    );
    expect(result.auditEventCandidate).not.toHaveProperty("content");
    expect(result.auditEventCandidate.contentIncluded).toBe(false);
  });

  it("rejects denylisted targets before writing", () => {
    const zoneRoot = makeZoneRoot();
    const result = writeZoneFile(
      makeInput(zoneRoot, {
        requestedPath: "work/.env.local",
        content: "SECRET_VALUE",
        createDirs: true,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("DENIED_BY_DENYLIST");
    expect(result.bytesWritten).toBe(0);
    expect(JSON.stringify(result)).not.toContain("SECRET_VALUE");
    expect(existsSync(join(zoneRoot, "work", ".env.local"))).toBe(false);
  });

  it("rejects files larger than maxBytes without writing", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });

    const result = writeZoneFile(
      makeInput(zoneRoot, {
        content: "1234567890",
        maxBytes: 5,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("FILE_TOO_LARGE");
    expect(result.bytesWritten).toBe(0);
    expect(existsSync(join(zoneRoot, "work", "notes.md"))).toBe(false);
  });

  it("rejects existing files when overwrite is false", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), "existing", "utf8");

    const result = writeZoneFile(makeInput(zoneRoot, { content: "new value" }));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("FILE_ALREADY_EXISTS");
    expect(result.bytesWritten).toBe(0);
    expect(readFileSync(join(zoneRoot, "work", "notes.md"), "utf8")).toBe(
      "existing",
    );
  });

  it("overwrites existing files only when overwrite is true", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), "existing", "utf8");

    const result = writeZoneFile(
      makeInput(zoneRoot, {
        content: "new value",
        overwrite: true,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.created).toBe(false);
    expect(result.overwritten).toBe(true);
    expect(readFileSync(join(zoneRoot, "work", "notes.md"), "utf8")).toBe(
      "new value",
    );
  });

  it("returns a safe error audit event when filesystem write fails", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "parent"), "not a directory", "utf8");

    const result = writeZoneFile(
      makeInput(zoneRoot, {
        requestedPath: "work/parent/notes.md",
        content: "DO_NOT_LEAK_ON_ERROR",
        createDirs: true,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(["WRITE_FAILED", "FILE_ALREADY_EXISTS"]).toContain(
      result.reasonCode,
    );
    expect(result.auditEventCandidate.status).toBe("error");
    expect(result.auditEventCandidate.contentIncluded).toBe(false);
    expect(JSON.stringify(result)).not.toContain("DO_NOT_LEAK_ON_ERROR");
  });

  it("preserves requestId and actor in auditEventCandidate", () => {
    const zoneRoot = makeZoneRoot();
    const result = writeZoneFile(
      makeInput(zoneRoot, {
        requestId: "req_write_audit",
        actor: "ichikishima",
      }),
    );

    expect(result.auditEventCandidate.requestId).toBe("req_write_audit");
    expect(result.auditEventCandidate.actor).toBe("ichikishima");
    expect(result.auditEventCandidate.action).toBe("write");
    expect(result.auditEventCandidate.timestamp).toEqual(expect.any(String));
  });

  it("matches the planned success and failure result shapes", () => {
    const successShape: WriteZoneFileSuccess = {
      ok: true,
      normalizedPath: "sandbox/hermes-autonomy-zone/work/notes.md",
      bytesWritten: 5,
      created: true,
      overwritten: false,
      auditEventCandidate: {
        actor: "hermes",
        action: "write",
        status: "success",
        normalizedPath: "sandbox/hermes-autonomy-zone/work/notes.md",
        bytesWritten: 5,
        created: true,
        overwritten: false,
        contentIncluded: false,
        timestamp: "2026-05-01T00:00:00.000Z",
      },
    };

    const failureShape: WriteZoneFileFailure = {
      ok: false,
      normalizedPath: "sandbox/hermes-autonomy-zone/work/notes.md",
      reasonCode: "DENIED_BY_DENYLIST",
      reason: "Path contains a denied segment: .env",
      bytesWritten: 0,
      auditEventCandidate: {
        actor: "hermes",
        action: "write",
        status: "denied",
        normalizedPath: "sandbox/hermes-autonomy-zone/work/notes.md",
        reasonCode: "DENIED_BY_DENYLIST",
        reason: "Path contains a denied segment: .env",
        bytesWritten: 0,
        contentIncluded: false,
        timestamp: "2026-05-01T00:00:00.000Z",
      },
    };

    expect(successShape.ok).toBe(true);
    expect(successShape.bytesWritten).toBe(5);
    expect(failureShape.ok).toBe(false);
    expect(failureShape.bytesWritten).toBe(0);
  });

  it("keeps the public type contract aligned with the spec", () => {
    expectTypeOf<WriteEncoding>().toEqualTypeOf<"utf8">();
    expectTypeOf<WriteZoneFileResult>().toEqualTypeOf<
      WriteZoneFileSuccess | WriteZoneFileFailure
    >();
    expectTypeOf<WriteZoneFileInput>().toMatchTypeOf<{
      zoneRoot: string;
      requestedPath: string;
      content: string;
      encoding?: WriteEncoding;
      maxBytes?: number;
      overwrite?: boolean;
      createDirs?: boolean;
      requestId?: string;
      actor: "hermes" | "ichikishima" | "user" | "system";
    }>();
    expectTypeOf<WriteAuditEventCandidate>().toMatchTypeOf<{
      actor: WriteZoneFileInput["actor"];
      action: "write";
      status: "success" | "denied" | "error";
      bytesWritten?: number;
      contentIncluded: false;
      timestamp: string;
    }>();
  });
});

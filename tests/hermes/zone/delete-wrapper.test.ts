import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import { deleteZoneFile } from "../../../src/main/ichikishima/autonomy-zone";

const tempRoots: string[] = [];

function makeZoneRoot(): string {
  const projectRoot = mkdtempSync(join(tmpdir(), "hermes-delete-test-"));
  const zoneRoot = join(projectRoot, "sandbox", "hermes-autonomy-zone");
  mkdirSync(zoneRoot, { recursive: true });
  tempRoots.push(projectRoot);
  return zoneRoot;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("Hermes Autonomy Zone delete block", () => {
  it("blocks delete and does not remove an allowed Zone file", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    const targetPath = join(zoneRoot, "work", "notes.md");
    writeFileSync(targetPath, "keep me", "utf8");

    const result = deleteZoneFile({
      zoneRoot,
      requestedPath: "work/notes.md",
      requestId: "req_delete",
      actor: "hermes",
    });

    expect(result.ok).toBe(false);
    expect(result.reasonCode).toBe("DELETE_REQUIRES_APPROVAL");
    expect(result.deleted).toBe(false);
    expect(existsSync(targetPath)).toBe(true);
    expect(result.approvalRequestCandidate).toMatchObject({
      actionType: "delete",
      riskLevel: "high",
      requiresUserApproval: true,
    });
    expect(result.auditEventCandidate).toMatchObject({
      requestId: "req_delete",
      actor: "hermes",
      action: "delete",
      status: "denied",
      deleted: false,
      contentIncluded: false,
    });
  });

  it("rejects delete requests that escape the Zone", () => {
    const zoneRoot = makeZoneRoot();
    const result = deleteZoneFile({
      zoneRoot,
      requestedPath: "../outside.md",
      actor: "hermes",
    });

    expect(result.ok).toBe(false);
    expect(result.reasonCode).toBe("DENIED_BY_PATH_GUARD");
    expect(result.deleted).toBe(false);
    expect(result.approvalRequestCandidate).toBeUndefined();
  });

  it("rejects denylisted delete targets without approval candidate", () => {
    const zoneRoot = makeZoneRoot();
    const result = deleteZoneFile({
      zoneRoot,
      requestedPath: "work/.env.local",
      actor: "hermes",
    });

    expect(result.ok).toBe(false);
    expect(result.reasonCode).toBe("DENIED_BY_DENYLIST");
    expect(result.deleted).toBe(false);
    expect(result.approvalRequestCandidate).toBeUndefined();
  });
});

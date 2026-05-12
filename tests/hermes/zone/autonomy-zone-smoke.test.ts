import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  createApprovalRequest,
  deleteZoneFile,
  executeCommand,
  readZoneFile,
  requestGitOperation,
  requestNetworkAccess,
  writeZoneFile,
} from "../../../src/main/ichikishima/autonomy-zone";

const tempRoots: string[] = [];

function makeZoneRoot(): string {
  const projectRoot = mkdtempSync(join(tmpdir(), "hermes-zone-smoke-"));
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

describe("Hermes Autonomy Zone minimal smoke", () => {
  it("supports safe read/write and blocks dangerous operations", () => {
    const zoneRoot = makeZoneRoot();
    const writeResult = writeZoneFile({
      zoneRoot,
      requestedPath: "work/notes.md",
      content: "smoke content",
      createDirs: true,
      requestId: "req_smoke_write",
      actor: "hermes",
    });

    expect(writeResult.ok).toBe(true);
    expect(JSON.stringify(writeResult.auditEventCandidate)).not.toContain(
      "smoke content",
    );

    const readResult = readZoneFile({
      zoneRoot,
      requestedPath: "work/notes.md",
      requestId: "req_smoke_read",
      actor: "hermes",
    });

    expect(readResult.ok).toBe(true);
    if (!readResult.ok) return;
    expect(readResult.content).toBe("smoke content");
    expect(JSON.stringify(readResult.auditEventCandidate)).not.toContain(
      "smoke content",
    );

    const dangerousWriteTargets = [
      "work/.env.local",
      "work/secrets/file.txt",
      "work/MT5/config.txt",
      "work/sessions.db",
      "work/.git/config",
    ];

    for (const requestedPath of dangerousWriteTargets) {
      const denied = writeZoneFile({
        zoneRoot,
        requestedPath,
        content: "secret smoke",
        createDirs: true,
        actor: "hermes",
      });

      expect(denied.ok).toBe(false);
      if (denied.ok) continue;
      expect(denied.bytesWritten).toBe(0);
      expect(denied.auditEventCandidate.contentIncluded).toBe(false);
      expect(JSON.stringify(denied)).not.toContain("secret smoke");
    }

    const targetPath = join(zoneRoot, "work", "delete-me.md");
    writeFileSync(targetPath, "do not delete", "utf8");
    const deleteResult = deleteZoneFile({
      zoneRoot,
      requestedPath: "work/delete-me.md",
      actor: "hermes",
    });

    expect(deleteResult.ok).toBe(false);
    expect(deleteResult.deleted).toBe(false);
    expect(existsSync(targetPath)).toBe(true);

    expect(
      executeCommand({
        command: "node",
        args: ["-e", "process.exit(1)"],
        actor: "hermes",
      }).reasonCode,
    ).toBe("EXECUTE_REQUIRES_APPROVAL");
    expect(
      requestNetworkAccess({
        url: "https://example.invalid/smoke",
        actor: "hermes",
      }).reasonCode,
    ).toBe("NETWORK_REQUIRES_APPROVAL");
    expect(
      requestGitOperation({
        operation: "push",
        args: ["origin", "main"],
        actor: "hermes",
      }).reasonCode,
    ).toBe("GIT_REQUIRES_APPROVAL");

    const approval = createApprovalRequest({
      actionType: "delete",
      actor: "hermes",
      targetPaths: ["work/delete-me.md"],
      riskLevel: "high",
      reason: "Smoke approval candidate",
      expectedResult: "Delete only after approval",
      rollbackPlan: "Restore from backup if approved later",
      testPlan: "Review target path before approval",
    });

    expect(JSON.parse(JSON.stringify(approval))).toMatchObject({
      actionType: "delete",
      requiresUserApproval: true,
    });
  });
});

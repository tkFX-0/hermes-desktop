import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import {
  createApprovalRequest,
  deleteZoneFile,
  executeCommand,
  readZoneFile,
  requestGitOperation,
  requestNetworkAccess,
  writeZoneFile,
} from "../../../src/main/ichikishima/autonomy-zone";

const zoneRoot = join(process.cwd(), "sandbox", "hermes-autonomy-zone");

describe("Hermes Autonomy Zone local pilot", () => {
  it("can run a local Sandbox pilot without crossing safety boundaries", () => {
    const safeContent = "local pilot safe content";
    const writeResult = writeZoneFile({
      zoneRoot,
      requestedPath: "output/pilot-safe-file.txt",
      content: safeContent,
      overwrite: true,
      requestId: "req_pilot_write",
      actor: "hermes",
    });

    expect(writeResult.ok).toBe(true);
    expect(JSON.stringify(writeResult.auditEventCandidate)).not.toContain(
      safeContent,
    );

    const readResult = readZoneFile({
      zoneRoot,
      requestedPath: "output/pilot-safe-file.txt",
      requestId: "req_pilot_read",
      actor: "hermes",
    });

    expect(readResult.ok).toBe(true);
    if (!readResult.ok) return;
    expect(readResult.content).toBe(safeContent);
    expect(JSON.stringify(readResult.auditEventCandidate)).not.toContain(
      safeContent,
    );

    const blockedTargets = [
      "output/.env.local",
      "output/secrets/file.txt",
      "output/.git/config",
      "output/MT5/config.txt",
      "output/sessions.db",
      "output/token.txt",
      "output/trade_history/report.csv",
    ];

    for (const requestedPath of blockedTargets) {
      const denied = writeZoneFile({
        zoneRoot,
        requestedPath,
        content: "blocked pilot content",
        createDirs: true,
        actor: "hermes",
      });

      expect(denied.ok).toBe(false);
      if (denied.ok) continue;
      expect(denied.bytesWritten).toBe(0);
      expect(denied.auditEventCandidate.contentIncluded).toBe(false);
      expect(JSON.stringify(denied)).not.toContain("blocked pilot content");
    }

    const outsideWrite = writeZoneFile({
      zoneRoot,
      requestedPath: "../outside-pilot.txt",
      content: "outside pilot content",
      actor: "hermes",
    });
    const outsideRead = readZoneFile({
      zoneRoot,
      requestedPath: "../outside-pilot.txt",
      actor: "hermes",
    });

    expect(outsideWrite.ok).toBe(false);
    expect(outsideRead.ok).toBe(false);

    const deleteTarget = join(zoneRoot, "output", "pilot-delete-block.txt");
    writeFileSync(deleteTarget, "do not delete", "utf8");
    const deleteResult = deleteZoneFile({
      zoneRoot,
      requestedPath: "output/pilot-delete-block.txt",
      actor: "hermes",
    });

    expect(deleteResult.ok).toBe(false);
    expect(deleteResult.deleted).toBe(false);
    expect(existsSync(deleteTarget)).toBe(true);

    expect(
      executeCommand({
        command: "node",
        args: ["-e", "process.exit(1)"],
        actor: "hermes",
      }).executed,
    ).toBe(false);
    expect(
      requestNetworkAccess({
        url: "https://example.invalid/local-pilot",
        actor: "hermes",
      }).executed,
    ).toBe(false);
    expect(
      requestGitOperation({
        operation: "status",
        actor: "hermes",
      }).executed,
    ).toBe(false);

    const approval = createApprovalRequest({
      actionType: "execute",
      actor: "hermes",
      commands: ["node -e process.exit(1)"],
      riskLevel: "high",
      reason: "Local pilot approval candidate",
      expectedResult: "No command runs before approval",
      rollbackPlan: "No rollback needed before approval",
      testPlan: "Review command before approval",
    });

    expect(approval.requiresUserApproval).toBe(true);
    expect(JSON.parse(JSON.stringify(approval)).actionType).toBe("execute");
  });
});

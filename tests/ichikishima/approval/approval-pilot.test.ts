import { existsSync, rmSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { saveAuditLog } from "../../../src/main/ichikishima/audit";
import {
  approvalQueueCandidateFromBlockedDelete,
  approvalQueueCandidateFromBlockedOperation,
  saveApprovalQueueItem,
} from "../../../src/main/ichikishima/approval";
import {
  deleteZoneFile,
  executeCommand,
  readZoneFile,
  requestGitOperation,
  requestNetworkAccess,
  writeZoneFile,
} from "../../../src/main/ichikishima/autonomy-zone";

describe("Hermes approval queue sandbox pilot wiring", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");
  const suffix = randomUUID();
  const approvalSd = `.vitest-apqp-a-${suffix}`;
  const auditSd = `.vitest-apqp-b-${suffix}`;
  const dateUtc = "2099-05-06";

  it("keeps autonomy zone IO intact while journaling approvals alongside audits", () => {
    const safeContent = `approval-queue-pilot-safe-${suffix}`;

    try {
      expect(
        writeZoneFile({
          zoneRoot,
          requestedPath: "output/pilot-approval-queue.txt",
          content: safeContent,
          overwrite: true,
          actor: "hermes",
        }).ok,
      ).toBe(true);

      const readBack = readZoneFile({
        zoneRoot,
        requestedPath: "output/pilot-approval-queue.txt",
        actor: "hermes",
      });
      expect(readBack.ok).toBe(true);
      if (!readBack.ok) return;
      expect(readBack.content).toBe(safeContent);

      expect(
        executeCommand({
          command: "node",
          args: ["-e", "process.exit(1)"],
          actor: "hermes",
        }).executed,
      ).toBe(false);
      expect(
        requestNetworkAccess({
          url: "https://example.invalid/approval-queue",
          actor: "hermes",
        }).executed,
      ).toBe(false);
      expect(
        requestGitOperation({
          operation: "status",
          actor: "hermes",
        }).executed,
      ).toBe(false);

      const deleteTarget = path.join(
        zoneRoot,
        "output",
        "pilot-delete-block.txt",
      );
      expect(existsSync(deleteTarget)).toBe(true);

      const blockDelete = deleteZoneFile({
        zoneRoot,
        requestedPath: "output/pilot-delete-block.txt",
        actor: "hermes",
      });
      expect(blockDelete.ok).toBe(false);
      expect(blockDelete.deleted).toBe(false);

      const delCandidate = approvalQueueCandidateFromBlockedDelete(blockDelete);
      expect(delCandidate?.ok).toBe(true);

      const execCandidate = approvalQueueCandidateFromBlockedOperation(
        executeCommand({
          command: "node",
          args: ["-e", "0"],
          actor: "hermes",
        }),
      );
      expect(execCandidate.ok).toBe(true);
      expect(execCandidate.item.autoExecutable).toBe(false);

      if (!(delCandidate?.ok && execCandidate.ok)) return;

      const persistedDelete = saveApprovalQueueItem(delCandidate.item, {
        projectRoot,
        zoneRoot,
        approvalSubdirectory: approvalSd,
        dateUtc,
      });
      expect(persistedDelete.ok).toBe(true);
      if (!persistedDelete.ok) return;
      expect(persistedDelete.bytesWritten).toBeGreaterThan(32);
      expect(
        saveAuditLog(persistedDelete.auditEventCandidate, {
          projectRoot,
          zoneRoot,
          auditSubdirectory: auditSd,
          dateUtc,
        }).ok,
      ).toBe(true);

      expect(delCandidate.item.requiresUserApproval).toBe(true);

      const persistedExec = saveApprovalQueueItem(execCandidate.item, {
        projectRoot,
        zoneRoot,
        approvalSubdirectory: approvalSd,
        dateUtc,
      });

      expect(persistedExec.ok).toBe(true);
      if (!persistedExec.ok) return;

      expect(
        saveAuditLog(persistedExec.auditEventCandidate, {
          projectRoot,
          zoneRoot,
          auditSubdirectory: auditSd,
          dateUtc,
        }).ok,
      ).toBe(true);

      execCandidate.item.commands.forEach((command) =>
        expect(command.length).toBeGreaterThan(0),
      );
    } finally {
      rmSync(path.join(zoneRoot, approvalSd), {
        recursive: true,
        force: true,
      });
      rmSync(path.join(zoneRoot, auditSd), {
        recursive: true,
        force: true,
      });
    }
  });
});

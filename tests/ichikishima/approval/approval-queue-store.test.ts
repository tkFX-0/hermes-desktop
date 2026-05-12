import { appendFileSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  normalizeAuditEvent,
  saveAuditLog,
} from "../../../src/main/ichikishima/audit";
import {
  appendApprovalQueueStatusEvent,
  createApprovalQueueItem,
  readApprovalQueueItems,
  saveApprovalQueueItem,
} from "../../../src/main/ichikishima/approval";

describe("approval queue JSONL persistence", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");
  const approvalSubdirectory = `.vitest-apq-${randomUUID()}`;
  const dateUtc = "2099-05-06";
  const opts = {
    projectRoot,
    zoneRoot,
    approvalSubdirectory,
    dateUtc,
  };

  afterEach(() =>
    rmSync(path.join(zoneRoot, approvalSubdirectory), {
      recursive: true,
      force: true,
    }),
  );

  it("stores two snapshots as appended lines without replacing file", () => {
    const firstId = randomUUID();
    const secondId = randomUUID();
    const a = createApprovalQueueItem({
      source: "manual",
      actor: "system",
      actionType: "execute",
      riskLevel: "high",
      title: "first snapshot",
      reason: "pilot lane",
      expectedResult: "none",
      rollbackPlan: "none",
      testPlan: "none",
      approvalId: firstId,
    });
    const b = createApprovalQueueItem({
      source: "manual",
      actor: "system",
      actionType: "network",
      riskLevel: "high",
      title: "second snapshot",
      reason: "pilot lane",
      expectedResult: "none",
      rollbackPlan: "none",
      testPlan: "none",
      approvalId: secondId,
    });
    expect(a.ok && b.ok).toBe(true);
    if (!(a.ok && b.ok)) return;

    expect(saveApprovalQueueItem(a.item, opts).ok).toBe(true);
    const savedB = saveApprovalQueueItem(b.item, opts);
    expect(savedB.ok).toBe(true);
    if (!savedB.ok) return;

    const rows = readFileSync(savedB.logPath, "utf8")
      .split("\n")
      .filter((line) => line.trim());
    expect(rows).toHaveLength(2);

    const rolled = readApprovalQueueItems(opts);
    expect(rolled.ok).toBe(true);
    if (!rolled.ok) return;
    expect(rolled.items).toHaveLength(2);

    rolled.items.forEach((row) => {
      expect(row.requiresUserApproval).toBe(true);
      expect(row.autoExecutable).toBe(false);
    });
  });

  it("merges approvals by newest snapshot with append-only lifecycle", () => {
    const first = createApprovalQueueItem({
      source: "manual",
      actor: "user",
      actionType: "git",
      riskLevel: "medium",
      title: "queue merge",
      reason: "state roll",
      expectedResult: "n/a",
      rollbackPlan: "n/a",
      testPlan: "n/a",
      approvalId: randomUUID(),
      createdAt: `${dateUtc}T10:00:00.000Z`,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    expect(saveApprovalQueueItem(first.item, opts).ok).toBe(true);

    const transition = appendApprovalQueueStatusEvent(
      first.item,
      "approved",
      opts,
    );
    expect(transition.ok).toBe(true);
    if (!transition.ok) return;

    const rolled = readApprovalQueueItems(opts);
    expect(rolled.ok).toBe(true);
    if (!rolled.ok) return;
    expect(rolled.items).toHaveLength(1);
    expect(rolled.items[0]?.status).toBe("approved");

    expect(transition.auditEventCandidate.kind).toBe(
      "approval_queue_status_changed",
    );
  });

  it("rejects parent-segment subdirectory escapes like audit store", () => {
    const item = createApprovalQueueItem({
      source: "manual",
      actor: "system",
      actionType: "execute",
      riskLevel: "low",
      title: "sub escape",
      reason: "test",
      expectedResult: "n",
      rollbackPlan: "n",
      testPlan: "n",
      approvalId: randomUUID(),
    });
    expect(item.ok).toBe(true);
    if (!item.ok) return;
    const res = saveApprovalQueueItem(item.item, {
      ...opts,
      approvalSubdirectory: `${approvalSubdirectory}\\..\\evil`,
    });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.reasonCode).toBe("INVALID_AUDIT_SUBDIRECTORY");
  });

  it("rejects denialist-aligned approval subdirectory patterns", () => {
    const item = createApprovalQueueItem({
      source: "manual",
      actor: "system",
      actionType: "execute",
      riskLevel: "low",
      title: "denylist",
      reason: "test",
      expectedResult: "n",
      rollbackPlan: "n",
      testPlan: "n",
      approvalId: randomUUID(),
    });
    expect(item.ok).toBe(true);
    if (!item.ok) return;
    const res = saveApprovalQueueItem(item.item, {
      ...opts,
      approvalSubdirectory: `${approvalSubdirectory}/staging/.git/config`,
    });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.reasonCode).toBe("DENIED_BY_DENYLIST");
  });

  it("produces sanitize-friendly audit payloads that saveAuditLog accepts", () => {
    const auditSd = `.vitest-apq-audit-${randomUUID()}`;
    const draft = createApprovalQueueItem({
      source: "operation_block",
      actor: "hermes",
      actionType: "delete",
      riskLevel: "high",
      title: "audit linkage",
      reason: "test",
      expectedResult: "n",
      rollbackPlan: "n",
      testPlan: "n",
      approvalId: randomUUID(),
      relatedAuditEventIds: ["evt-zone-read"],
    });
    expect(draft.ok).toBe(true);
    if (!draft.ok) return;

    const res = saveApprovalQueueItem(draft.item, opts);
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    expect(
      normalizeAuditEvent({
        mode: "approval_queue_item_created",
        actor: draft.item.actor,
        approvalId: draft.item.approvalId,
        queueActionType: draft.item.actionType,
        queueStatus: draft.item.status,
        riskLevel: draft.item.riskLevel,
        timestamp: draft.item.updatedAt,
      }).kind,
    ).toBe("approval_queue_item_created");

    expect(
      saveAuditLog(res.auditEventCandidate, {
        projectRoot,
        zoneRoot,
        dateUtc,
        auditSubdirectory: auditSd,
      }).ok,
    ).toBe(true);

    rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
  });

  it("appends seeded JSON alongside prior rows without overwriting", () => {
    mkdirSync(path.join(zoneRoot, approvalSubdirectory), {
      recursive: true,
    });
    const filePath = path.join(
      zoneRoot,
      approvalSubdirectory,
      `approval-${dateUtc}.jsonl`,
    );
    appendFileSync(filePath, '{"seed":true}' + "\n", "utf8");

    const item = createApprovalQueueItem({
      source: "manual",
      actor: "user",
      actionType: "execute",
      riskLevel: "low",
      title: "append after seed",
      reason: "pilot lane",
      expectedResult: "n",
      rollbackPlan: "n",
      testPlan: "n",
      approvalId: randomUUID(),
    });
    expect(item.ok).toBe(true);
    if (!item.ok) return;
    expect(saveApprovalQueueItem(item.item, opts).ok).toBe(true);

    const lines = readFileSync(filePath, "utf8").split("\n").filter(Boolean);
    expect(lines).toHaveLength(2);
  });
});

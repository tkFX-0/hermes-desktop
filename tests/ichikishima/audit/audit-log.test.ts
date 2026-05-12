import { randomUUID } from "node:crypto";
import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { SaveAuditLogOptions } from "../../../src/main/ichikishima/audit";
import {
  createAuditLogRecord,
  normalizeAuditEvent,
  saveAuditLog,
  maskAuditSensitiveText,
} from "../../../src/main/ichikishima/audit";
import type { AuditLogRecord } from "../../../src/main/ichikishima/audit/audit-log";
import type {
  DeleteAuditEventCandidate,
  ReadAuditEventCandidate,
  WriteAuditEventCandidate,
} from "../../../src/main/ichikishima/autonomy-zone/types";

const projectRoot = path.resolve(__dirname, "../../..");
const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

describe("audit log normalization", () => {
  it("maps read_success from ReadAuditEventCandidate", () => {
    const candidate: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "success",
      normalizedPath: "sandbox/hermes-autonomy-zone/sample/readme.txt",
      bytesRead: 12,
      truncated: false,
      contentIncluded: false,
      timestamp: "2026-05-03T10:00:00.000Z",
      requestId: "req-read-1",
    };

    const record = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate,
    });

    expect(record.kind).toBe("read_success");
    expect(record.status).toBe("success");
    expect(record.agent).toBe("hermes");
    expect(record.source).toBe("autonomy_zone");
    expect(record.contentIncluded).toBe(false);
    expect(record.actor).toBe("hermes");
    expect(record.riskLevel).toBe("low");
    expect(record.bytesRead).toBe(12);
    expect(record.requestId).toBe("req-read-1");
  });

  it("maps write_success from WriteAuditEventCandidate", () => {
    const candidate: WriteAuditEventCandidate = {
      actor: "user",
      action: "write",
      status: "success",
      normalizedPath: "sandbox/hermes-autonomy-zone/out.txt",
      bytesWritten: 4,
      created: true,
      overwritten: false,
      contentIncluded: false,
      timestamp: "2026-05-03T11:00:00.000Z",
    };

    const record = createAuditLogRecord({
      mode: "zone_audit_candidate",
      candidate,
      agent: "ichikishima",
    });

    expect(record.kind).toBe("write_success");
    expect(record.status).toBe("success");
    expect(record.agent).toBe("ichikishima");
    expect(record.source).toBe("autonomy_zone");
    expect(record.contentIncluded).toBe(false);
    expect(record.created).toBe(true);
    expect(record.overwritten).toBe(false);
    expect(record.riskLevel).toBe("low");
  });

  it("maps delete_blocked with blocked status", () => {
    const candidate: DeleteAuditEventCandidate = {
      actor: "hermes",
      action: "delete",
      status: "denied",
      reasonCode: "DELETE_REQUIRES_APPROVAL",
      reason: "delete requires approval",
      deleted: false,
      contentIncluded: false,
      timestamp: "2026-05-03T12:00:00.000Z",
    };

    const record = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate,
    });

    expect(record.kind).toBe("delete_blocked");
    expect(record.status).toBe("blocked");
    expect(record.deleted).toBe(false);
    expect(record.requiresUserApproval).toBe(true);
    expect(record.riskLevel).toBe("high");
  });

  it("records approval_created with agent, source, kind, riskLevel", () => {
    const record = normalizeAuditEvent({
      mode: "approval_created",
      actor: "user",
      agent: "review_agent",
      source: "approval_report",
      reportId: "approval_abcd1234",
      riskLevel: "medium",
      requestId: "req-approval",
    });

    expect(record.kind).toBe("approval_created");
    expect(record.agent).toBe("review_agent");
    expect(record.source).toBe("approval_report");
    expect(record.riskLevel).toBe("medium");
    expect(record.status).toBe("success");
    expect(record.reportId).toContain("approval_");
    expect(record.requiresUserApproval).toBe(true);
    expect(record.contentIncluded).toBe(false);
  });

  it("records approval_queue_item_created events", () => {
    const record = normalizeAuditEvent({
      mode: "approval_queue_item_created",
      actor: "system",
      agent: "ichikishima",
      source: "system_event",
      approvalId: "queue_abc123",
      queueActionType: "execute",
      queueStatus: "pending",
      riskLevel: "medium",
      timestamp: "2026-05-03T10:05:12.345Z",
    });

    expect(record.kind).toBe("approval_queue_item_created");
    expect(record.requiresUserApproval).toBe(true);
    expect(record.contentIncluded).toBe(false);
    expect(record.approvalId).toBeTruthy();
    expect(record.metadata?.queueActionType?.length).toBeGreaterThan(0);
  });

  it("records approval_queue_status_changed events", () => {
    const record = normalizeAuditEvent({
      mode: "approval_queue_status_changed",
      actor: "system",
      agent: "ichikishima",
      source: "system_event",
      approvalId: "queue_abc223",
      previousStatus: "pending",
      nextStatus: "approved",
      queueActionType: "execute",
      riskLevel: "high",
      timestamp: "2026-05-03T11:06:07.891Z",
    });

    expect(record.kind).toBe("approval_queue_status_changed");
    expect(record.requiresUserApproval).toBe(true);
    expect(record.contentIncluded).toBe(false);
    expect(record.metadata?.nextQueueStatus).toBeTruthy();
    expect(record.approvalId).toBeTruthy();
  });

  it("records review_completed", () => {
    const record = normalizeAuditEvent({
      mode: "review_completed",
      actor: "system",
      agent: "review_agent",
      source: "review_mode",
      riskLevel: "low",
      reasonCode: "REVIEW_OK",
    });

    expect(record.kind).toBe("review_completed");
    expect(record.agent).toBe("review_agent");
    expect(record.source).toBe("review_mode");
    expect(record.riskLevel).toBe("low");
    expect(record.contentIncluded).toBe(false);
  });

  it("records memory_candidate_created", () => {
    const record = normalizeAuditEvent({
      mode: "memory_candidate_created",
      actor: "hermes",
      agent: "memory_agent",
      source: "memory_candidate",
      category: "project_memory",
    });

    expect(record.kind).toBe("memory_candidate_created");
    expect(record.agent).toBe("memory_agent");
    expect(record.source).toBe("memory_candidate");
    expect(record.metadata?.category).toBe("project_memory");
    expect(record.contentIncluded).toBe(false);
  });

  it("keeps contentIncluded false and strips long content-like metadata", () => {
    const record = normalizeAuditEvent({
      mode: "memory_candidate_created",
      actor: "hermes",
      agent: "memory_agent",
      source: "memory_candidate",
      metadata: {
        note: "FILE CONTENT: " + "x".repeat(80),
      },
    });

    expect(record.contentIncluded).toBe(false);
    expect(record.metadata?.note).not.toContain("xxxx");
    expect(record.metadata?.note).toContain("masked");
  });

  it("masks API-key-like strings in reason", () => {
    const candidate: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "denied",
      reason: "blocked because sk-abcdefghijklmnopqrstuvwxyz012345",
      reasonCode: "DENIED_BY_DENYLIST",
      contentIncluded: false,
      timestamp: "2026-05-03T13:00:00.000Z",
    };

    const record = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate,
    });

    expect(record.reason).not.toContain("sk-");
    expect(record.reason).toMatch(/masked/i);
  });

  it("masks .env-like lines embedded in reason", () => {
    const candidate: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "error",
      reason: "bad config\nAPI_SECRET=supersecretvalue\nend",
      reasonCode: "READ_FAILED",
      contentIncluded: false,
      timestamp: "2026-05-03T14:00:00.000Z",
    };

    const record = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate,
    });

    expect(record.reason).not.toContain("supersecretvalue");
    expect(record.reason).toContain("masked-env-like");
  });

  it("maskAuditSensitiveText masks Bearer tokens", () => {
    expect(
      maskAuditSensitiveText("Authorization: Bearer eyJhbGciOiJI"),
    ).toContain("masked-bearer-token");
  });
});

describe("saveAuditLog JSONL persistence", () => {
  let auditSub: string;

  beforeEach(() => {
    auditSub = `.vitest-audit-${randomUUID()}`;
  });

  afterEach(() => {
    try {
      rmSync(path.join(zoneRoot, auditSub), { recursive: true, force: true });
    } catch {
      /* ignore teardown errors */
    }
  });

  function buildOpts(
    overrides?: Partial<SaveAuditLogOptions>,
  ): SaveAuditLogOptions {
    return {
      projectRoot,
      zoneRoot,
      auditSubdirectory: overrides?.auditSubdirectory ?? auditSub,
      dateUtc: overrides?.dateUtc ?? "2099-03-15",
      ...overrides,
    };
  }

  function readLines(logPath: string): string[] {
    return readFileSync(logPath, "utf8")
      .split("\n")
      .filter((line) => line.length > 0);
  }

  it("appends AuditLogRecord as JSONL and yields two JSON lines after two saves", () => {
    const c1: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "success",
      contentIncluded: false,
      timestamp: "2099-03-15T10:00:00.000Z",
      requestId: "a1",
      eventId: randomUUID(),
    };
    const c2: ReadAuditEventCandidate = {
      ...c1,
      requestId: "a2",
      eventId: randomUUID(),
    };

    const r1 = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: c1,
    });
    const r2 = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: c2,
    });

    expect(saveAuditLog(r1, buildOpts()).ok).toBe(true);
    expect(saveAuditLog(r2, buildOpts()).ok).toBe(true);

    const logPath = path.join(zoneRoot, auditSub, "audit-2099-03-15.jsonl");
    const lines = readLines(logPath);
    expect(lines.length).toBe(2);
    expect((JSON.parse(lines[0]!) as AuditLogRecord).requestId).toBe("a1");
    expect((JSON.parse(lines[1]!) as AuditLogRecord).requestId).toBe("a2");
  });

  it("keeps seeded JSONL lines untouched when saving new records", () => {
    const filePath = path.join(zoneRoot, auditSub, "audit-2099-03-15.jsonl");
    mkdirSync(path.dirname(filePath), { recursive: true });
    appendFileSync(filePath, '{"seed":true,"tag":"legacy"}\n', "utf8");

    const c1: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "success",
      contentIncluded: false,
      timestamp: "2099-03-15T11:00:00.000Z",
      requestId: "append-1",
      eventId: randomUUID(),
    };
    const saved = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: c1,
    });
    expect(saveAuditLog(saved, buildOpts()).ok).toBe(true);

    const lines = readLines(filePath);
    expect(lines.length).toBe(2);
    expect(JSON.parse(lines[0]!)).toMatchObject({ seed: true, tag: "legacy" });
    expect((JSON.parse(lines[1]!) as AuditLogRecord).requestId).toBe(
      "append-1",
    );
  });

  it("never stores a literal content column and persists contentIncluded false", () => {
    const c1: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "success",
      contentIncluded: false,
      timestamp: "2099-03-15T12:10:00.000Z",
      eventId: randomUUID(),
    };
    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: c1,
    });
    const res = saveAuditLog(r, buildOpts());
    expect(res.ok).toBe(true);
    if (!res.ok) throw new Error("unexpected failure");
    const parsed = JSON.parse(readLines(res.logPath)[0]!) as Record<
      string,
      unknown
    >;
    expect(parsed.contentIncluded).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(parsed, "content")).toBe(false);
    expect(JSON.stringify(parsed)).not.toContain("SECRET_FULL_FILE_BODY");
  });

  it("rejects records that carry a forbidden content field", () => {
    const c1: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "success",
      contentIncluded: false,
      timestamp: "2099-03-15T12:15:00.000Z",
      eventId: randomUUID(),
    };
    const normalized = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: c1,
    });
    const poisoned = {
      ...normalized,
      content: "SECRET_FULL_FILE_BODY",
    } as AuditLogRecord;
    const res = saveAuditLog(poisoned, buildOpts());
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reasonCode).toBe("INVALID_RECORD");
  });

  it("rejects records without contentIncluded false", () => {
    const c1: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "success",
      contentIncluded: false,
      timestamp: "2099-03-15T12:25:00.000Z",
      eventId: randomUUID(),
    };
    const normalized = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: c1,
    });
    const poisoned = { ...normalized, contentIncluded: true as false };
    const res = saveAuditLog(poisoned, buildOpts());
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reasonCode).toBe("INVALID_RECORD");
  });

  it("writes masked reasons for API-ish keys and env rows", () => {
    const c1: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "error",
      contentIncluded: false,
      timestamp: "2099-03-15T12:40:00.000Z",
      eventId: randomUUID(),
      reason: "boom sk-abcdefghijklmnopqrstuvwxyz0123456789abcdef",
      reasonCode: "READ_FAILED",
    };
    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: c1,
    });
    const res = saveAuditLog(r, buildOpts());
    expect(res.ok).toBe(true);
    if (!res.ok) throw new Error("unexpected failure");

    let text = readFileSync(res.logPath, "utf8");
    expect(text).not.toContain("sk-abcdefghijklmnopqrstuvwxyz0123456789abcdef");
    expect(text).toMatch(/masked-api-key-shape|masked-entropy-segment/i);

    const sibling = `.vitest-audit-${auditSub}-b`;
    const c2: ReadAuditEventCandidate = {
      actor: "hermes",
      action: "read",
      status: "error",
      contentIncluded: false,
      timestamp: "2099-03-15T13:05:00.000Z",
      eventId: randomUUID(),
      reason: "x\nFOO_BAR=classified\ny",
      reasonCode: "READ_FAILED",
    };
    expect(
      saveAuditLog(
        normalizeAuditEvent({ mode: "zone_audit_candidate", candidate: c2 }),
        {
          ...buildOpts({
            auditSubdirectory: sibling,
          }),
        },
      ).ok,
    ).toBe(true);
    text = readFileSync(
      path.join(zoneRoot, sibling, "audit-2099-03-15.jsonl"),
      "utf8",
    );
    expect(text).toContain("masked-env-like");

    rmSync(path.join(zoneRoot, sibling), { recursive: true, force: true });
  });

  it("rejects parent-segment escapes in audit subdirectory", () => {
    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: {
        actor: "hermes",
        action: "read",
        status: "success",
        contentIncluded: false,
        timestamp: "2099-03-15T13:45:00.000Z",
        eventId: randomUUID(),
      },
    });
    const res = saveAuditLog(
      r,
      buildOpts({ auditSubdirectory: `${auditSub}\\..\\evil` }),
    );
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reasonCode).toBe("INVALID_AUDIT_SUBDIRECTORY");
  });

  it("matches denylist on audit directories that include git-like segments", () => {
    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: {
        actor: "hermes",
        action: "read",
        status: "success",
        contentIncluded: false,
        timestamp: "2099-03-15T14:05:00.000Z",
        eventId: randomUUID(),
      },
    });

    const res = saveAuditLog(
      r,
      buildOpts({
        auditSubdirectory: path.join(`${auditSub}`, "nested", ".git", "logs"),
      }),
    );

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reasonCode).toBe("DENIED_BY_DENYLIST");
  });

  it("matches denylist for mt5 and secrets-ish audit subdirectory paths", () => {
    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: {
        actor: "hermes",
        action: "read",
        status: "success",
        contentIncluded: false,
        timestamp: "2099-03-15T14:10:00.000Z",
        eventId: randomUUID(),
      },
    });

    const resMt = saveAuditLog(
      r,
      buildOpts({ auditSubdirectory: `${auditSub}/mt5/logs` }),
    );
    expect(resMt.ok).toBe(false);
    if (!resMt.ok) expect(resMt.reasonCode).toBe("DENIED_BY_DENYLIST");

    const resSec = saveAuditLog(
      r,
      buildOpts({
        auditSubdirectory: `${auditSub}/staging/secrets/audit-dir`,
      }),
    );
    expect(resSec.ok).toBe(false);
    if (!resSec.ok) expect(resSec.reasonCode).toBe("DENIED_BY_DENYLIST");
  });

  it("rejects autonomy zone roots resolved outside Hermes desktop projectRoot", () => {
    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: {
        actor: "hermes",
        action: "read",
        status: "success",
        contentIncluded: false,
        timestamp: "2099-03-15T14:12:00.000Z",
        eventId: randomUUID(),
      },
    });

    const outsideZone = path.join(tmpdir(), `hermes-zone-out-${randomUUID()}`);
    mkdirSync(outsideZone, { recursive: true });
    try {
      const res = saveAuditLog(r, {
        projectRoot,
        zoneRoot: outsideZone,
        auditSubdirectory: auditSub,
        dateUtc: "2099-03-15",
      });
      expect(res.ok).toBe(false);
      if (!res.ok) expect(res.reasonCode).toBe("ZONE_OUTSIDE_PROJECT");
    } finally {
      rmSync(outsideZone, { recursive: true, force: true });
    }
  });

  it("reports EXISTING_PATH_NOT_FILE when the JSONL basename is occupied by a directory", () => {
    const nested = auditSub;
    mkdirSync(path.join(zoneRoot, nested), { recursive: true });
    const conflictDir = path.join(zoneRoot, nested, "audit-2099-05-05.jsonl");
    mkdirSync(conflictDir);

    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: {
        actor: "hermes",
        action: "read",
        status: "success",
        contentIncluded: false,
        timestamp: "2099-05-05T15:00:00.000Z",
        eventId: randomUUID(),
      },
    });

    const res = saveAuditLog(
      r,
      buildOpts({
        auditSubdirectory: nested,
        dateUtc: "2099-05-05",
      }),
    );

    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reasonCode).toBe("EXISTING_PATH_NOT_FILE");
  });

  it("rejects symlink-backed audit dirs that escape the Hermes autonomy zone root", () => {
    if (process.platform === "win32") {
      return;
    }

    const linkName = `.vitest-sym-${randomUUID()}`;
    const linkPath = path.join(zoneRoot, linkName);
    const outer = path.join(tmpdir(), `audit-sym-escape-${randomUUID()}`);
    mkdirSync(path.join(outer, "nested"), { recursive: true });

    symlinkSync(outer, linkPath);

    try {
      const r = normalizeAuditEvent({
        mode: "zone_audit_candidate",
        candidate: {
          actor: "hermes",
          action: "read",
          status: "success",
          contentIncluded: false,
          timestamp: "2099-03-15T16:05:00.000Z",
          eventId: randomUUID(),
        },
      });
      const res = saveAuditLog(
        r,
        buildOpts({
          auditSubdirectory: linkName,
        }),
      );
      expect(res.ok).toBe(false);
      if (!res.ok) expect(res.reasonCode).toBe("DENIED_BY_PATH_GUARD");
    } finally {
      rmSync(linkPath, { recursive: true, force: true });
      rmSync(outer, { recursive: true, force: true });
    }
  });

  it("returns WRITE_FAILED-safe reasons instead of leaking secrets on invalid options", () => {
    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: {
        actor: "hermes",
        action: "read",
        status: "success",
        contentIncluded: false,
        timestamp: "2099-03-15T17:05:00.000Z",
        eventId: randomUUID(),
      },
    });
    expect(
      saveAuditLog(r, { projectRoot: "", zoneRoot, dateUtc: "2099-03-15" }).ok,
    ).toBe(false);
  });

  it("surfaced ok:false with INVALID_AUDIT_SUBDIRECTORY for empty relative roots", () => {
    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: {
        actor: "hermes",
        action: "read",
        status: "success",
        contentIncluded: false,
        timestamp: "2099-03-15T18:10:00.000Z",
        eventId: randomUUID(),
      },
    });

    expect(
      saveAuditLog(
        r,
        buildOpts({ auditSubdirectory: "   ", dateUtc: "2099-03-15" }),
      ).ok,
    ).toBe(false);
  });

  it("surfaced DENIED_BY_DENYLIST for experts-like subdirectory names", () => {
    const r = normalizeAuditEvent({
      mode: "zone_audit_candidate",
      candidate: {
        actor: "hermes",
        action: "read",
        status: "success",
        contentIncluded: false,
        timestamp: "2099-03-15T18:20:00.000Z",
        eventId: randomUUID(),
      },
    });

    const res = saveAuditLog(
      r,
      buildOpts({
        auditSubdirectory: `${auditSub}/experts/custom`,
      }),
    );
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reasonCode).toBe("DENIED_BY_DENYLIST");
  });
});

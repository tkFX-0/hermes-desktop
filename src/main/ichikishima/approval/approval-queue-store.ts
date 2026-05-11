import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join, sep as pathSep } from "node:path";

import { checkDenylist } from "../autonomy-zone/denylist";
import {
  checkZonePath,
  isInsidePath,
  resolveExistingPath,
  resolvePathAgainstBase,
  validatePathInput,
} from "../autonomy-zone/path-guard";

import type { ApprovalQueueItem, ApprovalQueueStatus } from "./approval-queue";
import {
  normalizeApprovalQueueItem,
  updateApprovalQueueItemStatus,
} from "./approval-queue";

import type {
  AuditLogRecord,
  AuditSaveFailureReason,
} from "../audit/audit-log";
import { normalizeAuditEvent } from "../audit/audit-log";

export const MAX_APPROVAL_QUEUE_JSONL_LINE_BYTES = 65536;

export interface SaveApprovalQueueItemOptions {
  projectRoot: string;
  zoneRoot: string;
  /**
   * Relative path inside `zoneRoot`, default `approval`.
   * Rejects `..`, absolute roots, and `.` segments.
   */
  approvalSubdirectory?: string;
  /** UTC date for filename `approval-YYYY-MM-DD.jsonl` */
  dateUtc?: string;
}

export type SaveApprovalQueueItemFailureReason = AuditSaveFailureReason;

export type SaveApprovalQueueItemResult =
  | {
      ok: true;
      logPath: string;
      bytesWritten: number;
      auditEventCandidate: AuditLogRecord;
    }
  | {
      ok: false;
      reasonCode: SaveApprovalQueueItemFailureReason;
      reason: string;
    };

export interface ReadApprovalQueueItemsOptions extends SaveApprovalQueueItemOptions {}

function failure(
  reasonCode: SaveApprovalQueueItemFailureReason,
  reason: string,
): {
  ok: false;
  reasonCode: SaveApprovalQueueItemFailureReason;
  reason: string;
} {
  return { ok: false as const, reasonCode, reason };
}

function parseRelativeSubdirectory(
  rawInput: string | undefined,
): { ok: true; relativePath: string } | { ok: false; reason: string } {
  const raw = (rawInput ?? "approval").trim();
  if (!raw) {
    return { ok: false, reason: "Approval subdirectory must not be empty" };
  }
  if (raw.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(raw)) {
    return {
      ok: false,
      reason: "Approval subdirectory must be relative to zone root",
    };
  }

  const parts = raw.split(/[/\\]/).filter(Boolean);
  if (parts.some((p) => p === "..")) {
    return {
      ok: false,
      reason: "Approval subdirectory must not contain parent segments",
    };
  }
  if (parts.some((p) => p === ".")) {
    return {
      ok: false,
      reason: "Approval subdirectory must not contain dot path segments",
    };
  }

  return { ok: true, relativePath: parts.join(pathSep) };
}

function filenameDateUtc(
  item: ApprovalQueueItem,
  override: string | undefined,
): string | undefined {
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) {
    return override;
  }
  const d = new Date(item.updatedAt);
  if (Number.isNaN(d.getTime())) return undefined;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function assertQueueItemInvariants(item: ApprovalQueueItem): string | null {
  if (item.requiresUserApproval !== true) {
    return "Queue item requiresUserApproval must be true";
  }
  if (item.autoExecutable !== false) {
    return "Queue item autoExecutable must be false";
  }
  if (!item.approvalId?.trim()) {
    return "Queue item approvalId must be non-empty";
  }
  return null;
}

function serializeQueueSnapshot(item: ApprovalQueueItem):
  | { ok: true; line: string; byteLength: number }
  | {
      ok: false;
      reasonCode: "RECORD_TOO_LARGE" | "SERIALIZE_FAILED";
      reason: string;
    } {
  try {
    const json = `${JSON.stringify(item)}\n`;
    const byteLength = Buffer.byteLength(json, "utf8");
    if (byteLength > MAX_APPROVAL_QUEUE_JSONL_LINE_BYTES) {
      return {
        ok: false,
        reasonCode: "RECORD_TOO_LARGE",
        reason: "Serialized approval queue snapshot exceeds maximum size limit",
      };
    }
    return { ok: true, line: json, byteLength };
  } catch {
    return {
      ok: false,
      reasonCode: "SERIALIZE_FAILED",
      reason: "Failed to serialize approval queue snapshot",
    };
  }
}

function isApprovalQueueSnapshot(value: unknown): value is ApprovalQueueItem {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.approvalId === "string" &&
    typeof row.actor === "string" &&
    typeof row.actionType === "string" &&
    typeof row.title === "string" &&
    row.requiresUserApproval === true &&
    row.autoExecutable === false
  );
}

function auditRecordForApprovalQueueCreation(
  item: ApprovalQueueItem,
): AuditLogRecord {
  return normalizeAuditEvent({
    mode: "approval_queue_item_created",
    actor: item.actor,
    agent: "ichikishima",
    source: "system_event",
    approvalId: item.approvalId,
    queueStatus: item.status,
    queueActionType: item.actionType,
    riskLevel: item.riskLevel,
    timestamp: item.updatedAt,
    metadata: item.relatedReportId
      ? { relatedReportId: item.relatedReportId }
      : undefined,
  });
}

function auditRecordForApprovalQueueStatusChanged(input: {
  item: ApprovalQueueItem;
  previousStatus: ApprovalQueueStatus;
}): AuditLogRecord {
  return normalizeAuditEvent({
    mode: "approval_queue_status_changed",
    actor: input.item.actor,
    agent: "ichikishima",
    source: "system_event",
    approvalId: input.item.approvalId,
    previousStatus: input.previousStatus,
    nextStatus: input.item.status,
    queueActionType: input.item.actionType,
    riskLevel: input.item.riskLevel,
    timestamp: input.item.updatedAt,
  });
}

/** Resolve guarded approval subdirectory (shared by save/read). Does not derive filename date from item. */
export function resolveApprovalQueueDirectory(
  options: SaveApprovalQueueItemOptions,
):
  | { ok: false; reasonCode: AuditSaveFailureReason; reason: string }
  | {
      ok: true;
      approvalDirRealPath: string;
      zoneResolved: string;
      projectResolved: string;
    } {
  const projectErr = validatePathInput(options.projectRoot, "projectRoot");
  if (projectErr) {
    return {
      ok: false,
      reasonCode: "INVALID_PROJECT_ROOT",
      reason: projectErr.reason,
    };
  }

  const zoneErr = validatePathInput(options.zoneRoot, "zoneRoot");
  if (zoneErr) {
    return {
      ok: false,
      reasonCode: "INVALID_ZONE_ROOT",
      reason: zoneErr.reason,
    };
  }

  const sub = parseRelativeSubdirectory(options.approvalSubdirectory);
  if (!sub.ok) {
    return {
      ok: false,
      reasonCode: "INVALID_AUDIT_SUBDIRECTORY",
      reason: sub.reason,
    };
  }

  let projectResolved: string;
  let zoneResolved: string;
  try {
    projectResolved = resolveExistingPath(options.projectRoot);
    zoneResolved = resolveExistingPath(options.zoneRoot);
  } catch {
    return {
      ok: false,
      reasonCode: "INVALID_ZONE_ROOT",
      reason: "Failed to resolve project or zone paths",
    };
  }

  if (!isInsidePath(zoneResolved, projectResolved)) {
    return {
      ok: false,
      reasonCode: "ZONE_OUTSIDE_PROJECT",
      reason: "Zone root must stay inside project root",
    };
  }

  const candidateDir = resolvePathAgainstBase(zoneResolved, sub.relativePath);
  const dirGate = checkZonePath({
    zoneRoot: zoneResolved,
    targetPath: candidateDir,
  });
  if (!dirGate.ok) {
    return {
      ok: false,
      reasonCode: "DENIED_BY_PATH_GUARD",
      reason: "Approval directory failed Hermes autonomy zone path guard",
    };
  }
  const dirDeny = checkDenylist(dirGate.normalizedPath);
  if (!dirDeny.ok) {
    return {
      ok: false,
      reasonCode: "DENIED_BY_DENYLIST",
      reason: "Approval directory matched safety denylist policy",
    };
  }

  return {
    ok: true,
    approvalDirRealPath: dirGate.realPath,
    zoneResolved,
    projectResolved,
  };
}

export function saveApprovalQueueItem(
  rawItem: ApprovalQueueItem,
  options: SaveApprovalQueueItemOptions,
): SaveApprovalQueueItemResult {
  if (!options || typeof options !== "object") {
    return failure("INVALID_OPTIONS", "Save options are required");
  }

  const invariantErr = assertQueueItemInvariants(rawItem);
  if (invariantErr) {
    return failure("INVALID_RECORD", invariantErr);
  }

  const item = normalizeApprovalQueueItem(rawItem);

  const dir = resolveApprovalQueueDirectory(options);
  if (!dir.ok) {
    return { ok: false, reasonCode: dir.reasonCode, reason: dir.reason };
  }

  const datePart = filenameDateUtc(item, options.dateUtc);
  if (!datePart) {
    return failure(
      "INVALID_RECORD",
      "Could not derive approval queue filename date",
    );
  }

  try {
    mkdirSync(dir.approvalDirRealPath, { recursive: true });
  } catch {
    return failure("WRITE_FAILED", "Failed to create approval directory");
  }

  const fileName = `approval-${datePart}.jsonl`;
  const logPathCandidate = join(dir.approvalDirRealPath, fileName);

  const fileGate = checkZonePath({
    zoneRoot: dir.zoneResolved,
    targetPath: logPathCandidate,
  });
  if (!fileGate.ok) {
    return failure(
      "DENIED_BY_PATH_GUARD",
      "Approval queue file path failed Hermes autonomy zone path guard",
    );
  }

  const fileDeny = checkDenylist(fileGate.normalizedPath);
  if (!fileDeny.ok) {
    return failure(
      "DENIED_BY_DENYLIST",
      "Approval queue file path matched safety denylist policy",
    );
  }

  const logPath = fileGate.realPath;
  if (existsSync(logPath)) {
    try {
      const st = statSync(logPath);
      if (!st.isFile()) {
        return failure(
          "EXISTING_PATH_NOT_FILE",
          "Approval queue path exists and is not a regular file",
        );
      }
    } catch {
      return failure(
        "WRITE_FAILED",
        "Failed to stat existing approval queue path",
      );
    }
  }

  const prepared = serializeQueueSnapshot(item);
  if (!prepared.ok) {
    const code =
      prepared.reasonCode === "RECORD_TOO_LARGE"
        ? "RECORD_TOO_LARGE"
        : "SERIALIZE_FAILED";
    return failure(code, prepared.reason);
  }

  try {
    appendFileSync(logPath, prepared.line, { encoding: "utf8" });
  } catch {
    return failure("WRITE_FAILED", "Failed to append approval queue snapshot");
  }

  return {
    ok: true,
    logPath,
    bytesWritten: prepared.byteLength,
    auditEventCandidate: auditRecordForApprovalQueueCreation(item),
  };
}

export function appendApprovalQueueStatusEvent(
  currentItem: ApprovalQueueItem,
  newStatus: ApprovalQueueStatus,
  options: SaveApprovalQueueItemOptions,
):
  | {
      ok: true;
      updatedItem: ApprovalQueueItem;
      logPath: string;
      bytesWritten: number;
      auditEventCandidate: AuditLogRecord;
    }
  | {
      ok: false;
      reasonCode: SaveApprovalQueueItemFailureReason;
      reason: string;
    } {
  if (currentItem.status === newStatus) {
    return failure("INVALID_RECORD", "approval queue status is unchanged");
  }

  const prev = currentItem.status;
  const transitioned = updateApprovalQueueItemStatus(currentItem, {
    status: newStatus,
  });
  if (!transitioned.ok) {
    return failure("INVALID_RECORD", transitioned.reason);
  }

  const saved = saveApprovalQueueItem(transitioned.item, options);
  if (!saved.ok) {
    return { ok: false, reasonCode: saved.reasonCode, reason: saved.reason };
  }

  return {
    ok: true,
    updatedItem: transitioned.item,
    logPath: saved.logPath,
    bytesWritten: saved.bytesWritten,
    auditEventCandidate: auditRecordForApprovalQueueStatusChanged({
      item: transitioned.item,
      previousStatus: prev,
    }),
  };
}

export function readApprovalQueueItems(
  options: ReadApprovalQueueItemsOptions,
): { ok: true; items: ApprovalQueueItem[] } | { ok: false; reason: string } {
  const dir = resolveApprovalQueueDirectory(options);
  if (!dir.ok) {
    return { ok: false, reason: dir.reason };
  }

  const datePart = options.dateUtc;
  if (!datePart || !/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return {
      ok: false,
      reason: "readApprovalQueueItems requires dateUtc YYYY-MM-DD",
    };
  }

  const logPathCandidate = join(
    dir.approvalDirRealPath,
    `approval-${datePart}.jsonl`,
  );
  const fileGate = checkZonePath({
    zoneRoot: dir.zoneResolved,
    targetPath: logPathCandidate,
  });
  if (!fileGate.ok || !existsSync(fileGate.realPath)) {
    return { ok: true, items: [] };
  }

  let text: string;
  try {
    text = readFileSync(fileGate.realPath, "utf8");
  } catch {
    return { ok: false, reason: "Failed to read approval queue file" };
  }

  const byId = new Map<string, ApprovalQueueItem>();
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    if (!isApprovalQueueSnapshot(parsed)) continue;
    byId.set(parsed.approvalId, parsed as ApprovalQueueItem);
  }

  return { ok: true, items: [...byId.values()] };
}

import { appendFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, sep as pathSep } from "node:path";

import { checkDenylist } from "../autonomy-zone/denylist";
import {
  checkZonePath,
  isInsidePath,
  resolveExistingPath,
  resolvePathAgainstBase,
  validatePathInput,
} from "../autonomy-zone/path-guard";

import type {
  AuditLogRecord,
  AuditSaveFailureReason,
  SaveAuditLogResult,
} from "./audit-log";
import { sanitizeRecordForPersistence } from "./audit-log";

export interface SaveAuditLogOptions {
  projectRoot: string;
  zoneRoot: string;
  /**
   * Relative path inside `zoneRoot`, default `audit`.
   * Rejects `..`, absolute roots, and `.` segments.
   */
  auditSubdirectory?: string;
  /** UTC date for filename `audit-YYYY-MM-DD.jsonl` (overrides record timestamp date) */
  dateUtc?: string;
}

function failure(
  reasonCode: AuditSaveFailureReason,
  reason: string,
): SaveAuditLogResult {
  return { ok: false, reasonCode, reason };
}

function parseRelativeSubdirectory(
  rawInput: string | undefined,
): { ok: true; relativePath: string } | { ok: false; reason: string } {
  const raw = (rawInput ?? "audit").trim();
  if (!raw) {
    return { ok: false, reason: "Audit subdirectory must not be empty" };
  }
  if (raw.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(raw)) {
    return {
      ok: false,
      reason: "Audit subdirectory must be relative to zone root",
    };
  }

  const parts = raw.split(/[/\\]/).filter(Boolean);
  if (parts.some((p) => p === "..")) {
    return {
      ok: false,
      reason: "Audit subdirectory must not contain parent segments",
    };
  }
  if (parts.some((p) => p === ".")) {
    return {
      ok: false,
      reason: "Audit subdirectory must not contain dot path segments",
    };
  }

  return { ok: true, relativePath: parts.join(pathSep) };
}

function filenameDateUtc(
  record: AuditLogRecord,
  override: string | undefined,
): string | undefined {
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) {
    return override;
  }
  const d = new Date(record.timestamp);
  if (Number.isNaN(d.getTime())) return undefined;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function mapSanitizeFailure(
  code: "INVALID_RECORD" | "RECORD_TOO_LARGE" | "SERIALIZE_FAILED",
): AuditSaveFailureReason {
  return code;
}

export function saveAuditLog(
  record: AuditLogRecord,
  options: SaveAuditLogOptions,
): SaveAuditLogResult {
  if (!options || typeof options !== "object") {
    return failure("INVALID_OPTIONS", "Save options are required");
  }

  const projectErr = validatePathInput(options.projectRoot, "projectRoot");
  if (projectErr) {
    return failure("INVALID_PROJECT_ROOT", projectErr.reason);
  }

  const zoneErr = validatePathInput(options.zoneRoot, "zoneRoot");
  if (zoneErr) {
    return failure("INVALID_ZONE_ROOT", zoneErr.reason);
  }

  const sub = parseRelativeSubdirectory(options.auditSubdirectory);
  if (!sub.ok) {
    return failure("INVALID_AUDIT_SUBDIRECTORY", sub.reason);
  }

  let projectResolved: string;
  let zoneResolved: string;
  try {
    projectResolved = resolveExistingPath(options.projectRoot);
    zoneResolved = resolveExistingPath(options.zoneRoot);
  } catch {
    return failure(
      "INVALID_ZONE_ROOT",
      "Failed to resolve project or zone paths",
    );
  }

  if (!isInsidePath(zoneResolved, projectResolved)) {
    return failure(
      "ZONE_OUTSIDE_PROJECT",
      "Zone root must stay inside project root",
    );
  }

  const candidateAuditDir = resolvePathAgainstBase(
    zoneResolved,
    sub.relativePath,
  );

  const dirGate = checkZonePath({
    zoneRoot: zoneResolved,
    targetPath: candidateAuditDir,
  });

  if (!dirGate.ok) {
    return failure(
      "DENIED_BY_PATH_GUARD",
      "Audit directory failed Hermes autonomy zone path guard",
    );
  }

  const dirDeny = checkDenylist(dirGate.normalizedPath);
  if (!dirDeny.ok) {
    return failure(
      "DENIED_BY_DENYLIST",
      "Audit directory matched safety denylist policy",
    );
  }

  try {
    mkdirSync(dirGate.realPath, { recursive: true });
  } catch {
    return failure("WRITE_FAILED", "Failed to create audit directory");
  }

  const datePart = filenameDateUtc(record, options.dateUtc);
  if (!datePart) {
    return failure(
      "INVALID_RECORD",
      "Could not derive audit log filename date",
    );
  }

  const fileName = `audit-${datePart}.jsonl`;
  const logPathCandidate = join(dirGate.realPath, fileName);

  const fileGate = checkZonePath({
    zoneRoot: zoneResolved,
    targetPath: logPathCandidate,
  });

  if (!fileGate.ok) {
    return failure(
      "DENIED_BY_PATH_GUARD",
      "Audit log file path failed Hermes autonomy zone path guard",
    );
  }

  const fileDeny = checkDenylist(fileGate.normalizedPath);
  if (!fileDeny.ok) {
    return failure(
      "DENIED_BY_DENYLIST",
      "Audit log file path matched safety denylist policy",
    );
  }

  const logPath = fileGate.realPath;

  if (existsSync(logPath)) {
    try {
      const st = statSync(logPath);
      if (!st.isFile()) {
        return failure(
          "EXISTING_PATH_NOT_FILE",
          "Audit log path exists and is not a regular file",
        );
      }
    } catch {
      return failure("WRITE_FAILED", "Failed to stat existing audit log path");
    }
  }

  const prepared = sanitizeRecordForPersistence(record);
  if (!prepared.ok) {
    return failure(mapSanitizeFailure(prepared.reasonCode), prepared.reason);
  }

  try {
    appendFileSync(logPath, prepared.line, { encoding: "utf8" });
  } catch {
    return failure("WRITE_FAILED", "Failed to append audit log line");
  }

  return {
    ok: true,
    logPath,
    bytesWritten: prepared.byteLength,
  };
}

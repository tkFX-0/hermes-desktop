import { existsSync, readFileSync } from "node:fs";
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
  AuditEventKind,
  AuditLogRecord,
  AuditRiskLevel,
} from "./audit-log";

export interface AuditLogSummaryZoneInput {
  projectRoot: string;
  zoneRoot: string;
  /** `YYYY-MM-DD`。 */
  dateUtc: string;
  auditSubdirectory?: string;
}

export interface AuditLogSummary {
  total: number;
  readEvents: number;
  writeEvents: number;
  blockedEvents: number;
  approvalEvents: number;
  reviewEvents: number;
  highRiskEvents: number;
  latestTimestamp: string | null;
  parseFailures: number;
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

function resolveAuditDailyJsonlPath(input: AuditLogSummaryZoneInput):
  | {
      ok: true;
      logPath: string;
    }
  | {
      ok: false;
      reason: string;
    } {
  const projectErr = validatePathInput(input.projectRoot, "projectRoot");
  const zoneErr = validatePathInput(input.zoneRoot, "zoneRoot");

  if (projectErr) return { ok: false, reason: projectErr.reason };
  if (zoneErr) return { ok: false, reason: zoneErr.reason };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dateUtc.trim())) {
    return { ok: false, reason: "dateUtc must be YYYY-MM-DD" };
  }

  let projectResolved: string;
  let zoneResolved: string;

  try {
    projectResolved = resolveExistingPath(input.projectRoot);
    zoneResolved = resolveExistingPath(input.zoneRoot);
  } catch {
    return {
      ok: false,
      reason: "Failed to resolve project or zone paths",
    };
  }

  if (!isInsidePath(zoneResolved, projectResolved)) {
    return { ok: false, reason: "Zone root must stay inside project root" };
  }

  const sub = parseRelativeSubdirectory(input.auditSubdirectory);
  if (!sub.ok) return { ok: false, reason: sub.reason };

  const auditDirResolved = resolvePathAgainstBase(
    zoneResolved,
    sub.relativePath,
  );
  const fileCandidate = join(
    auditDirResolved,
    `audit-${input.dateUtc.trim()}.jsonl`,
  );

  const dirGate = checkZonePath({
    zoneRoot: zoneResolved,
    targetPath: auditDirResolved,
  });

  const fileGate = checkZonePath({
    zoneRoot: zoneResolved,
    targetPath: fileCandidate,
  });

  if (!(dirGate.ok && fileGate.ok)) {
    return { ok: false, reason: "audit path guard denied snapshot" };
  }

  const deny = checkDenylist(fileGate.normalizedPath);
  if (!deny.ok) {
    return {
      ok: false,
      reason: "audit path denylist prevented snapshot metadata",
    };
  }

  return { ok: true, logPath: fileGate.realPath };
}

function isReadKind(kind: AuditEventKind): boolean {
  return (
    kind === "read_success" || kind === "read_denied" || kind === "read_error"
  );
}

function isWriteKind(kind: AuditEventKind): boolean {
  return (
    kind === "write_success" ||
    kind === "write_denied" ||
    kind === "write_error"
  );
}

function isBlockedKind(kind: AuditEventKind): boolean {
  return (
    kind === "delete_blocked" ||
    kind === "execute_blocked" ||
    kind === "network_blocked" ||
    kind === "git_blocked"
  );
}

function isApprovalBundleKind(kind: AuditEventKind): boolean {
  return (
    kind === "approval_created" ||
    kind === "approval_queue_item_created" ||
    kind === "approval_queue_status_changed"
  );
}

function isReviewBundleKind(kind: AuditEventKind): boolean {
  return (
    kind === "review_completed" ||
    kind === "memory_candidate_created" ||
    kind === "memory_candidate_rejected"
  );
}

function isHighAuditRisk(level: AuditRiskLevel | undefined): boolean {
  return level === "high" || level === "critical";
}

function narrowRecord(parsed: unknown): AuditLogRecord | null {
  if (!parsed || typeof parsed !== "object") return null;
  const rec = parsed as Record<string, unknown>;
  if (typeof rec.kind !== "string" || typeof rec.timestamp !== "string") {
    return null;
  }
  if (rec.contentIncluded !== false) return null;
  return rec as unknown as AuditLogRecord;
}

/** Zone 内 audit JSONL を **集計のみ**（本文・reason 全文は返さない）。 */
export function getAuditLogSummary(
  input: AuditLogSummaryZoneInput,
): AuditLogSummary | { ok: false; reason: string } {
  const resolved = resolveAuditDailyJsonlPath(input);
  if (!resolved.ok) {
    return { ok: false, reason: resolved.reason };
  }

  if (!existsSync(resolved.logPath)) {
    return {
      total: 0,
      readEvents: 0,
      writeEvents: 0,
      blockedEvents: 0,
      approvalEvents: 0,
      reviewEvents: 0,
      highRiskEvents: 0,
      latestTimestamp: null,
      parseFailures: 0,
    };
  }

  let text: string;
  try {
    text = readFileSync(resolved.logPath, "utf8");
  } catch {
    return { ok: false, reason: "Failed to read audit jsonl snapshot" };
  }

  let total = 0;
  let readEvents = 0;
  let writeEvents = 0;
  let blockedEvents = 0;
  let approvalEvents = 0;
  let reviewEvents = 0;
  let highRiskEvents = 0;
  let parseFailures = 0;
  let latestTimestamp: string | null = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      parseFailures += 1;
      continue;
    }

    const record = narrowRecord(parsed);
    if (!record) {
      parseFailures += 1;
      continue;
    }

    total += 1;

    const kind = record.kind;
    if (isReadKind(kind)) readEvents += 1;
    if (isWriteKind(kind)) writeEvents += 1;
    if (isBlockedKind(kind)) blockedEvents += 1;
    if (isApprovalBundleKind(kind)) approvalEvents += 1;
    if (isReviewBundleKind(kind)) reviewEvents += 1;
    if (isHighAuditRisk(record.riskLevel)) {
      highRiskEvents += 1;
    }

    const ts = record.timestamp;
    if (ts && !Number.isNaN(Date.parse(ts))) {
      if (!latestTimestamp || Date.parse(ts) > Date.parse(latestTimestamp)) {
        latestTimestamp = ts;
      }
    }
  }

  return {
    total,
    readEvents,
    writeEvents,
    blockedEvents,
    approvalEvents,
    reviewEvents,
    highRiskEvents,
    latestTimestamp,
    parseFailures,
  };
}

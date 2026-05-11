import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";

import type {
  BlockedOperationAuditEventCandidate,
  DeleteAuditEventCandidate,
  ReadAuditEventCandidate,
  WriteAuditEventCandidate,
} from "../autonomy-zone/types";

export type AuditEventKind =
  | "read_success"
  | "read_denied"
  | "read_error"
  | "write_success"
  | "write_denied"
  | "write_error"
  | "delete_blocked"
  | "execute_blocked"
  | "network_blocked"
  | "git_blocked"
  | "approval_created"
  | "approval_queue_item_created"
  | "approval_queue_status_changed"
  | "review_completed"
  | "memory_candidate_created"
  | "memory_candidate_rejected"
  | "escalation_requested"
  | "escalation_blocked";

export type AuditEventSource =
  | "autonomy_zone"
  | "approval_report"
  | "review_mode"
  | "memory_candidate"
  | "hermes_report"
  | "cursor_escalation"
  | "manual_user_action"
  | "system_event";

export type AuditAgent =
  | "hermes"
  | "ichikishima"
  | "review_agent"
  | "memory_agent"
  | "cursor_agent"
  | "system";

export type AuditRiskLevel = "low" | "medium" | "high" | "critical";

export type AuditStatus = "success" | "denied" | "error" | "blocked";

export type AuditActor = "hermes" | "ichikishima" | "user" | "system";

export interface AuditLogRecord {
  eventId: string;
  timestamp: string;
  agent: AuditAgent;
  source: AuditEventSource;
  kind: AuditEventKind;
  status: AuditStatus;
  actor: AuditActor;
  contentIncluded: false;
  riskLevel?: AuditRiskLevel;
  action?:
    | "read"
    | "write"
    | "delete"
    | "execute"
    | "network"
    | "git"
    | "approval"
    | "review"
    | "memory_candidate";
  reasonCode?: string;
  reason?: string;
  normalizedPath?: string;
  maskedPath?: string;
  bytesRead?: number;
  bytesWritten?: number;
  truncated?: boolean;
  created?: boolean;
  overwritten?: boolean;
  deleted?: false;
  requiresUserApproval?: boolean;
  approvalRequestId?: string;
  reportId?: string;
  requestId?: string;
  testSummary?: string;
  /** Hermes autonomy approval queue linkage (masked on persist). */
  approvalId?: string;
  metadata?: Readonly<Record<string, string>>;
}

export type NormalizeAuditEventResult = AuditLogRecord;

type ZoneAuditCandidate =
  | ReadAuditEventCandidate
  | WriteAuditEventCandidate
  | DeleteAuditEventCandidate
  | BlockedOperationAuditEventCandidate;

export type NormalizeAuditEventInput =
  | {
      mode: "zone_audit_candidate";
      candidate: ZoneAuditCandidate;
      agent?: AuditAgent;
      source?: AuditEventSource;
      riskLevel?: AuditRiskLevel;
    }
  | {
      mode: "approval_queue_item_created";
      actor: AuditActor;
      agent?: AuditAgent;
      approvalId: string;
      queueStatus: string;
      queueActionType: string;
      source?: AuditEventSource;
      riskLevel?: AuditRiskLevel;
      timestamp?: string;
      eventId?: string;
      requestId?: string;
      reason?: string;
      reasonCode?: string;
      metadata?: Readonly<Record<string, string>>;
    }
  | {
      mode: "approval_queue_status_changed";
      actor: AuditActor;
      agent?: AuditAgent;
      approvalId: string;
      previousStatus: string;
      nextStatus: string;
      queueActionType: string;
      source?: AuditEventSource;
      riskLevel?: AuditRiskLevel;
      timestamp?: string;
      eventId?: string;
      requestId?: string;
      reason?: string;
      reasonCode?: string;
      metadata?: Readonly<Record<string, string>>;
    }
  | {
      mode: "approval_created";
      actor: AuditActor;
      agent: AuditAgent;
      source: "approval_report";
      reportId: string;
      approvalRequestId?: string;
      requestId?: string;
      riskLevel?: AuditRiskLevel;
      reason?: string;
      reasonCode?: string;
      timestamp?: string;
      eventId?: string;
      metadata?: Readonly<Record<string, string>>;
    }
  | {
      mode: "review_completed";
      actor: AuditActor;
      agent: AuditAgent;
      source: "review_mode";
      reportId?: string;
      requestId?: string;
      riskLevel?: AuditRiskLevel;
      reason?: string;
      reasonCode?: string;
      timestamp?: string;
      eventId?: string;
      metadata?: Readonly<Record<string, string>>;
    }
  | {
      mode: "memory_candidate_created";
      actor: AuditActor;
      agent: AuditAgent;
      source: "memory_candidate";
      requestId?: string;
      category?: string;
      riskLevel?: AuditRiskLevel;
      reason?: string;
      reasonCode?: string;
      timestamp?: string;
      eventId?: string;
      metadata?: Readonly<Record<string, string>>;
    };

const MAX_REASON_LENGTH = 500;
const MAX_METADATA_KEYS = 48;
const MAX_METADATA_KEY_LENGTH = 64;
const MAX_METADATA_VALUE_LENGTH = 512;

function clampText(value: string, maxLen: number): string {
  if (value.length <= maxLen) return value;
  return `${value.slice(0, Math.max(0, maxLen - 1)).trim()}…`;
}

/** 承認レポートのマスク方針に近いルール。.env行風の文字列にも対応する。 */
const sensitivePatterns: Array<[RegExp, string]> = [
  [/^[A-Za-z_][A-Za-z0-9_]*=\S+$/gm, "[masked-env-like]"],
  [/\.env/gi, "[masked-sensitive-path]"],
  [/api\s*key/gi, "[masked-sensitive-term]"],
  [/apiキー/gi, "[masked-sensitive-term]"],
  [/secrets?\b/gi, "[masked-sensitive-term]"],
  [/\btoken\b/gi, "[masked-sensitive-term]"],
  [/authorization\s*:\s*bearer\s+\S+/gi, "[masked-bearer-token]"],
  [/memory\s*db/gi, "[masked-sensitive-term]"],
  [/MT5口座情報/gi, "[masked-sensitive-term]"],
  [/取引履歴/gi, "[masked-sensitive-term]"],
  [/個人情報/gi, "[masked-sensitive-term]"],
  [/sk-[A-Za-z0-9](?:[A-Za-z0-9_-]){7,}/g, "[masked-api-key-shape]"],
  [/[A-Za-z0-9_-]{36,}/g, "[masked-entropy-segment]"],
];

export function maskAuditSensitiveText(value: string): string {
  return sensitivePatterns.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    value,
  );
}

export function normalizeAuditEvent(
  input: NormalizeAuditEventInput,
): NormalizeAuditEventResult {
  switch (input.mode) {
    case "zone_audit_candidate":
      return normalizeZoneAuditCandidate(input);
    case "approval_queue_item_created":
      return normalizeApprovalQueueItemCreated(input);
    case "approval_queue_status_changed":
      return normalizeApprovalQueueStatusChanged(input);
    case "approval_created":
      return normalizeApprovalCreated(input);
    case "review_completed":
      return normalizeReviewCompleted(input);
    case "memory_candidate_created":
      return normalizeMemoryCandidateCreated(input);
    default: {
      const _never: never = input;
      return _never;
    }
  }
}

export function createAuditLogRecord(
  input: NormalizeAuditEventInput,
): AuditLogRecord {
  return normalizeAuditEvent(input);
}

function sanitizeMetadata(
  meta: Readonly<Record<string, string>> | undefined,
): Record<string, string> | undefined {
  if (!meta) return undefined;
  const entries = Object.entries(meta).slice(0, MAX_METADATA_KEYS);
  const out: Record<string, string> = {};
  for (const [rawKey, rawVal] of entries) {
    const key = clampText(
      maskAuditSensitiveText(rawKey.trim()),
      MAX_METADATA_KEY_LENGTH,
    );
    if (!key) continue;
    const value = clampText(
      maskAuditSensitiveText(String(rawVal)),
      MAX_METADATA_VALUE_LENGTH,
    );
    out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function sanitizeOptionalPath(path: string | undefined): string | undefined {
  if (path === undefined) return undefined;
  const masked = maskAuditSensitiveText(path);
  return masked.length === 0 ? undefined : masked;
}

function sanitizeReason(reason: string | undefined): string | undefined {
  if (reason === undefined) return undefined;
  return clampText(maskAuditSensitiveText(reason), MAX_REASON_LENGTH);
}

function defaultRiskForZone(
  candidate: ZoneAuditCandidate,
  kind: AuditEventKind,
  override?: AuditRiskLevel,
): AuditRiskLevel | undefined {
  if (override !== undefined) return override;
  if (
    kind === "delete_blocked" ||
    kind === "execute_blocked" ||
    kind === "network_blocked" ||
    kind === "git_blocked"
  ) {
    return "high";
  }
  if (kind.endsWith("_denied") || kind.endsWith("_error")) {
    return "medium";
  }
  if (candidate.action === "read" || candidate.action === "write") {
    if (candidate.status === "success") return "low";
  }
  return "medium";
}

function kindFromZoneCandidate(candidate: ZoneAuditCandidate): AuditEventKind {
  if (candidate.action === "read") {
    if (candidate.status === "success") return "read_success";
    if (candidate.status === "denied") return "read_denied";
    return "read_error";
  }
  if (candidate.action === "write") {
    if (candidate.status === "success") return "write_success";
    if (candidate.status === "denied") return "write_denied";
    return "write_error";
  }
  if (candidate.action === "delete") {
    return "delete_blocked";
  }
  if (candidate.action === "execute") return "execute_blocked";
  if (candidate.action === "network") return "network_blocked";
  return "git_blocked";
}

function statusFromZoneCandidate(candidate: ZoneAuditCandidate): AuditStatus {
  if (
    candidate.action === "delete" ||
    candidate.action === "execute" ||
    candidate.action === "network" ||
    candidate.action === "git"
  ) {
    return "blocked";
  }
  return candidate.status;
}

function zoneCandidatePaths(candidate: ZoneAuditCandidate): {
  normalizedPath?: string;
  maskedPath?: string;
} {
  switch (candidate.action) {
    case "execute":
    case "network":
    case "git":
      return {};
    case "read":
    case "write":
    case "delete":
      return {
        normalizedPath: candidate.normalizedPath,
        maskedPath: candidate.maskedPath,
      };
  }
}

function normalizeZoneAuditCandidate(input: {
  candidate: ZoneAuditCandidate;
  agent?: AuditAgent;
  source?: AuditEventSource;
  riskLevel?: AuditRiskLevel;
}): AuditLogRecord {
  const { candidate } = input;
  const kind = kindFromZoneCandidate(candidate);
  const status = statusFromZoneCandidate(candidate);
  const actor = candidate.actor;
  const agent = input.agent ?? "hermes";
  const source = input.source ?? "autonomy_zone";

  const paths = zoneCandidatePaths(candidate);

  const base: AuditLogRecord = {
    eventId:
      typeof candidate.eventId === "string" && candidate.eventId.length > 0
        ? candidate.eventId
        : randomUUID(),
    timestamp:
      typeof candidate.timestamp === "string"
        ? candidate.timestamp
        : new Date().toISOString(),
    agent,
    source,
    kind,
    status,
    actor,
    contentIncluded: false,
    riskLevel: defaultRiskForZone(candidate, kind, input.riskLevel),
    action: candidate.action,
    reasonCode:
      candidate.reasonCode !== undefined
        ? maskAuditSensitiveText(String(candidate.reasonCode))
        : undefined,
    reason: sanitizeReason(candidate.reason),
    normalizedPath: sanitizeOptionalPath(paths.normalizedPath),
    maskedPath: sanitizeOptionalPath(paths.maskedPath),
    requestId: candidate.requestId,
    requiresUserApproval:
      candidate.action === "delete" ||
      candidate.action === "execute" ||
      candidate.action === "network" ||
      candidate.action === "git"
        ? true
        : undefined,
  };

  if (candidate.action === "read") {
    base.bytesRead = candidate.bytesRead;
    base.truncated = candidate.truncated;
  }
  if (candidate.action === "write") {
    base.bytesWritten = candidate.bytesWritten;
    base.created = candidate.created;
    base.overwritten = candidate.overwritten;
  }
  if (candidate.action === "delete") {
    base.deleted = false;
  }

  return base;
}

function normalizeApprovalQueueItemCreated(input: {
  actor: AuditActor;
  approvalId: string;
  queueStatus: string;
  queueActionType: string;
  agent?: AuditAgent;
  source?: AuditEventSource;
  riskLevel?: AuditRiskLevel;
  timestamp?: string;
  eventId?: string;
  requestId?: string;
  reason?: string;
  reasonCode?: string;
  metadata?: Readonly<Record<string, string>>;
}): AuditLogRecord {
  const metaMerged = sanitizeMetadata({
    queueStatus: input.queueStatus,
    queueActionType: input.queueActionType,
    ...(input.metadata ?? {}),
  });

  return {
    eventId:
      typeof input.eventId === "string" && input.eventId.length > 0
        ? input.eventId
        : randomUUID(),
    timestamp:
      typeof input.timestamp === "string"
        ? input.timestamp
        : new Date().toISOString(),
    agent: input.agent ?? "system",
    source: input.source ?? "manual_user_action",
    kind: "approval_queue_item_created",
    status: "success",
    actor: input.actor,
    contentIncluded: false,
    riskLevel: input.riskLevel ?? "medium",
    action: "approval",
    requiresUserApproval: true,
    approvalId: maskAuditSensitiveText(input.approvalId.trim()),
    requestId: input.requestId,
    reason: sanitizeReason(
      input.reason ?? "approval queue item snapshot appended",
    ),
    reasonCode: input.reasonCode
      ? maskAuditSensitiveText(input.reasonCode)
      : "APPROVAL_QUEUE_ITEM_CREATED",
    metadata: metaMerged,
  };
}

function normalizeApprovalQueueStatusChanged(input: {
  actor: AuditActor;
  approvalId: string;
  previousStatus: string;
  nextStatus: string;
  queueActionType: string;
  agent?: AuditAgent;
  source?: AuditEventSource;
  riskLevel?: AuditRiskLevel;
  timestamp?: string;
  eventId?: string;
  requestId?: string;
  reason?: string;
  reasonCode?: string;
  metadata?: Readonly<Record<string, string>>;
}): AuditLogRecord {
  const mergedMeta = sanitizeMetadata({
    approvalId: maskAuditSensitiveText(input.approvalId.trim()),
    previousQueueStatus: input.previousStatus.trim(),
    nextQueueStatus: input.nextStatus.trim(),
    queueActionType: maskAuditSensitiveText(String(input.queueActionType)),
    ...(input.metadata ?? {}),
  });

  return {
    eventId:
      typeof input.eventId === "string" && input.eventId.length > 0
        ? input.eventId
        : randomUUID(),
    timestamp:
      typeof input.timestamp === "string"
        ? input.timestamp
        : new Date().toISOString(),
    agent: input.agent ?? "system",
    source: input.source ?? "manual_user_action",
    kind: "approval_queue_status_changed",
    status: "success",
    actor: input.actor,
    contentIncluded: false,
    riskLevel: input.riskLevel ?? "medium",
    action: "approval",
    requiresUserApproval: true,
    approvalId: maskAuditSensitiveText(input.approvalId.trim()),
    requestId: input.requestId,
    reason: sanitizeReason(
      input.reason ?? "approval queue status changed (append-only)",
    ),
    reasonCode: input.reasonCode
      ? maskAuditSensitiveText(input.reasonCode)
      : "APPROVAL_QUEUE_STATUS_CHANGED",
    metadata: mergedMeta,
  };
}

function normalizeApprovalCreated(input: {
  actor: AuditActor;
  agent: AuditAgent;
  source: "approval_report";
  reportId: string;
  approvalRequestId?: string;
  requestId?: string;
  riskLevel?: AuditRiskLevel;
  reason?: string;
  reasonCode?: string;
  timestamp?: string;
  eventId?: string;
  metadata?: Readonly<Record<string, string>>;
}): AuditLogRecord {
  return {
    eventId:
      typeof input.eventId === "string" && input.eventId.length > 0
        ? input.eventId
        : randomUUID(),
    timestamp:
      typeof input.timestamp === "string"
        ? input.timestamp
        : new Date().toISOString(),
    agent: input.agent,
    source: input.source,
    kind: "approval_created",
    status: "success",
    actor: input.actor,
    contentIncluded: false,
    riskLevel: input.riskLevel ?? "medium",
    action: "approval",
    requiresUserApproval: true,
    reportId: maskAuditSensitiveText(input.reportId),
    approvalRequestId: input.approvalRequestId
      ? maskAuditSensitiveText(input.approvalRequestId)
      : undefined,
    requestId: input.requestId,
    reason: sanitizeReason(input.reason ?? "approval report recorded"),
    reasonCode: input.reasonCode
      ? maskAuditSensitiveText(input.reasonCode)
      : "APPROVAL_REPORT_CREATED",
    metadata: sanitizeMetadata(input.metadata),
  };
}

function normalizeReviewCompleted(input: {
  actor: AuditActor;
  agent: AuditAgent;
  source: "review_mode";
  reportId?: string;
  requestId?: string;
  riskLevel?: AuditRiskLevel;
  reason?: string;
  reasonCode?: string;
  timestamp?: string;
  eventId?: string;
  metadata?: Readonly<Record<string, string>>;
}): AuditLogRecord {
  return {
    eventId:
      typeof input.eventId === "string" && input.eventId.length > 0
        ? input.eventId
        : randomUUID(),
    timestamp:
      typeof input.timestamp === "string"
        ? input.timestamp
        : new Date().toISOString(),
    agent: input.agent,
    source: input.source,
    kind: "review_completed",
    status: "success",
    actor: input.actor,
    contentIncluded: false,
    riskLevel: input.riskLevel ?? "medium",
    action: "review",
    reportId: input.reportId
      ? maskAuditSensitiveText(input.reportId)
      : undefined,
    requestId: input.requestId,
    reason: sanitizeReason(input.reason ?? "review mode evaluation completed"),
    reasonCode: input.reasonCode
      ? maskAuditSensitiveText(input.reasonCode)
      : "REVIEW_COMPLETED",
    metadata: sanitizeMetadata(input.metadata),
  };
}

function normalizeMemoryCandidateCreated(input: {
  actor: AuditActor;
  agent: AuditAgent;
  source: "memory_candidate";
  requestId?: string;
  category?: string;
  riskLevel?: AuditRiskLevel;
  reason?: string;
  reasonCode?: string;
  timestamp?: string;
  eventId?: string;
  metadata?: Readonly<Record<string, string>>;
}): AuditLogRecord {
  const categoryMeta =
    typeof input.category === "string"
      ? { category: input.category }
      : undefined;
  const mergedMeta = sanitizeMetadata({
    ...(categoryMeta ?? {}),
    ...(input.metadata ?? {}),
  });

  return {
    eventId:
      typeof input.eventId === "string" && input.eventId.length > 0
        ? input.eventId
        : randomUUID(),
    timestamp:
      typeof input.timestamp === "string"
        ? input.timestamp
        : new Date().toISOString(),
    agent: input.agent,
    source: input.source,
    kind: "memory_candidate_created",
    status: "success",
    actor: input.actor,
    contentIncluded: false,
    riskLevel: input.riskLevel ?? "low",
    action: "memory_candidate",
    requestId: input.requestId,
    reason: sanitizeReason(input.reason ?? "memory candidate created"),
    reasonCode: input.reasonCode
      ? maskAuditSensitiveText(input.reasonCode)
      : "MEMORY_CANDIDATE_CREATED",
    metadata: mergedMeta,
  };
}

export const MAX_SERIALIZED_AUDIT_RECORD_BYTES = 8192;

function pickPersistableFields(record: AuditLogRecord): AuditLogRecord {
  const out: AuditLogRecord = {
    eventId: record.eventId,
    timestamp: record.timestamp,
    agent: record.agent,
    source: record.source,
    kind: record.kind,
    status: record.status,
    actor: record.actor,
    contentIncluded: false,
  };

  if (record.riskLevel !== undefined) out.riskLevel = record.riskLevel;
  if (record.action !== undefined) out.action = record.action;
  if (record.reason !== undefined) out.reason = sanitizeReason(record.reason);
  if (record.reasonCode !== undefined) {
    out.reasonCode = maskAuditSensitiveText(String(record.reasonCode));
  }
  if (record.normalizedPath !== undefined) {
    out.normalizedPath = sanitizeOptionalPath(record.normalizedPath);
  }
  if (record.maskedPath !== undefined) {
    out.maskedPath = sanitizeOptionalPath(record.maskedPath);
  }
  if (record.bytesRead !== undefined) out.bytesRead = record.bytesRead;
  if (record.bytesWritten !== undefined) out.bytesWritten = record.bytesWritten;
  if (record.truncated !== undefined) out.truncated = record.truncated;
  if (record.created !== undefined) out.created = record.created;
  if (record.overwritten !== undefined) out.overwritten = record.overwritten;
  if (record.deleted !== undefined) out.deleted = record.deleted;
  if (record.requiresUserApproval !== undefined) {
    out.requiresUserApproval = record.requiresUserApproval;
  }
  if (record.approvalRequestId !== undefined) {
    out.approvalRequestId = maskAuditSensitiveText(record.approvalRequestId);
  }
  if (record.approvalId !== undefined) {
    out.approvalId = maskAuditSensitiveText(String(record.approvalId));
  }
  if (record.reportId !== undefined) {
    out.reportId = maskAuditSensitiveText(record.reportId);
  }
  if (record.requestId !== undefined)
    out.requestId = maskAuditSensitiveText(String(record.requestId));
  if (record.testSummary !== undefined) {
    out.testSummary = sanitizeReason(record.testSummary);
  }
  if (record.metadata !== undefined)
    out.metadata = sanitizeMetadata(record.metadata);

  return out;
}

function utcDateSlug(timestamp: string): string | undefined {
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return undefined;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type AuditSaveFailureReason =
  | "INVALID_OPTIONS"
  | "INVALID_PROJECT_ROOT"
  | "INVALID_ZONE_ROOT"
  | "ZONE_OUTSIDE_PROJECT"
  | "INVALID_AUDIT_SUBDIRECTORY"
  | "DENIED_BY_PATH_GUARD"
  | "DENIED_BY_DENYLIST"
  | "INVALID_RECORD"
  | "RECORD_TOO_LARGE"
  | "SERIALIZE_FAILED"
  | "WRITE_FAILED"
  | "EXISTING_PATH_NOT_FILE";

export type SaveAuditLogResult =
  | { ok: true; logPath: string; bytesWritten: number }
  | {
      ok: false;
      reasonCode: AuditSaveFailureReason;
      reason: string;
    };

export function sanitizeRecordForPersistence(
  record: AuditLogRecord,
  options?: {
    readonly maxSerializedBytes?: number;
  },
):
  | { ok: true; line: string; byteLength: number }
  | {
      ok: false;
      reasonCode: "INVALID_RECORD" | "RECORD_TOO_LARGE" | "SERIALIZE_FAILED";
      reason: string;
    } {
  const maxBytes =
    typeof options?.maxSerializedBytes === "number"
      ? options.maxSerializedBytes
      : MAX_SERIALIZED_AUDIT_RECORD_BYTES;

  const unknownRecord = record as unknown as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(unknownRecord, "content")) {
    return {
      ok: false,
      reasonCode: "INVALID_RECORD",
      reason: "Record must not include a content field",
    };
  }

  if (record.contentIncluded !== false) {
    return {
      ok: false,
      reasonCode: "INVALID_RECORD",
      reason: "Record must set contentIncluded to false before persistence",
    };
  }

  if (typeof record.eventId !== "string" || !record.eventId.trim()) {
    return {
      ok: false,
      reasonCode: "INVALID_RECORD",
      reason: "Record eventId must be non-empty",
    };
  }

  if (typeof record.timestamp !== "string" || !record.timestamp.trim()) {
    return {
      ok: false,
      reasonCode: "INVALID_RECORD",
      reason: "Record timestamp must be non-empty",
    };
  }

  if (utcDateSlug(record.timestamp) === undefined) {
    return {
      ok: false,
      reasonCode: "INVALID_RECORD",
      reason: "Record timestamp must be ISO-parsable",
    };
  }

  let payload: AuditLogRecord;
  try {
    payload = pickPersistableFields(record);
    payload.contentIncluded = false;
  } catch {
    return {
      ok: false,
      reasonCode: "INVALID_RECORD",
      reason: "Record normalization failed before persistence",
    };
  }

  let json: string;
  try {
    json = `${JSON.stringify(payload)}\n`;
  } catch {
    return {
      ok: false,
      reasonCode: "SERIALIZE_FAILED",
      reason: "Failed to serialize audit record",
    };
  }

  const serializedLength = Buffer.byteLength(json, "utf8");

  if (serializedLength > maxBytes) {
    return {
      ok: false,
      reasonCode: "RECORD_TOO_LARGE",
      reason: "Serialized audit record exceeds maximum size limit",
    };
  }

  return { ok: true, line: json, byteLength: serializedLength };
}

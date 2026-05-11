import { randomUUID } from "node:crypto";

import { maskAuditSensitiveText } from "../audit/audit-log";
import type {
  ApprovalRiskLevel,
  ApprovalRequest,
} from "../autonomy-zone/types";

function isUuidV4Like(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

/** Preserve UUID identifiers so masked entropy rules cannot collapse distinct queue rows. */
function sanitizeApprovalIdField(raw: string): string {
  const trimmed = raw.trim();
  if (isUuidV4Like(trimmed)) {
    return trimmed.toLowerCase();
  }
  return maskApprovalQueueSensitiveText(trimmed);
}

export type ApprovalQueueActionType =
  | ApprovalRequest["actionType"]
  | "dependency_install"
  | "external_escalation"
  | "memory_promotion"
  | "long_term_profile_update"
  | "safety_policy_change"
  | "approval_report_followup";

export type ApprovalQueueStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "held"
  | "expired"
  | "cancelled";

export type ApprovalQueueSource =
  | "operation_block"
  | "approval_report"
  | "manual"
  | "system";

/** キュー項目の actor は Zone と整合 */
export type ApprovalQueueActor = "hermes" | "ichikishima" | "user" | "system";

export interface ApprovalQueueItem {
  approvalId: string;
  createdAt: string;
  updatedAt: string;
  source: ApprovalQueueSource;
  actor: ApprovalQueueActor;
  actionType: ApprovalQueueActionType;
  status: ApprovalQueueStatus;
  riskLevel: ApprovalRiskLevel;
  title: string;
  reason: string;
  targetPaths: string[];
  commands: string[];
  externalUrls: string[];
  expectedResult: string;
  rollbackPlan: string;
  testPlan: string;
  requiresUserApproval: true;
  autoExecutable: false;
  relatedAuditEventIds: string[];
  relatedReportId?: string;
  metadata?: Readonly<Record<string, string>>;
}

export interface CreateApprovalQueueItemInput {
  source: ApprovalQueueSource;
  actor: ApprovalQueueActor;
  actionType: ApprovalQueueActionType;
  status?: ApprovalQueueStatus;
  riskLevel: ApprovalRiskLevel;
  title: string;
  reason: string;
  expectedResult: string;
  rollbackPlan: string;
  testPlan: string;
  targetPaths?: readonly string[];
  commands?: readonly string[];
  externalUrls?: readonly string[];
  relatedAuditEventIds?: readonly string[];
  relatedReportId?: string;
  metadata?: Readonly<Record<string, string>>;
  createdAt?: string;
  approvalId?: string;
  /** Creation helpers must refuse false / true overrides — field disallowed via type omission at call sites */
}

export interface UpdateApprovalQueueItemStatusInput {
  status: ApprovalQueueStatus;
  /** ISO stamp for updatedAt override (tests); default now */
  at?: string;
}

export type ApprovalQueueMutationResult<
  TOk extends Record<string, unknown>,
  TFail extends { ok: false; reason: string; reasonCode: string },
> = ({ ok: true } & TOk) | TFail;

export type CreateApprovalQueueItemResult = ApprovalQueueMutationResult<
  { item: ApprovalQueueItem },
  { ok: false; reason: string; reasonCode: string }
>;

export type UpdateApprovalQueueItemStatusResult = ApprovalQueueMutationResult<
  { item: ApprovalQueueItem },
  { ok: false; reason: string; reasonCode: string }
>;

const MAX_SNIPPET_LEN = 500;
const MAX_LIST_ITEMS = 64;
const MAX_LIST_STRING_LEN = 512;
const METADATA_KEYS = 48;

function clampSnippet(value: string, maxLen: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, Math.max(0, maxLen - 1)).trim()}…`;
}

export function maskApprovalQueueSensitiveText(text: string): string {
  return maskAuditSensitiveText(text);
}

function sanitizeStringList(values: readonly string[] | undefined): string[] {
  const list = [...(values ?? [])]
    .map((entry) =>
      clampSnippet(
        maskApprovalQueueSensitiveText(String(entry)),
        MAX_LIST_STRING_LEN,
      ),
    )
    .filter(Boolean);
  return [...new Set(list)].slice(0, MAX_LIST_ITEMS);
}

export function sanitizeQueueMetadata(
  meta: Readonly<Record<string, string>> | undefined,
): Record<string, string> | undefined {
  if (!meta) return undefined;
  const entries = Object.entries(meta).slice(0, METADATA_KEYS);
  const out: Record<string, string> = {};
  for (const [rawKey, rawVal] of entries) {
    const key = clampSnippet(maskApprovalQueueSensitiveText(rawKey.trim()), 64);
    if (!key) continue;
    out[key] = clampSnippet(
      maskApprovalQueueSensitiveText(String(rawVal)),
      512,
    );
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function normalizeApprovalQueueItem(
  item: ApprovalQueueItem,
): ApprovalQueueItem {
  const createdAtRaw = maskApprovalQueueSensitiveText(item.createdAt.trim());
  const updatedAtRaw = maskApprovalQueueSensitiveText(item.updatedAt.trim());
  const base: ApprovalQueueItem = {
    approvalId: sanitizeApprovalIdField(item.approvalId),
    createdAt:
      createdAtRaw.length > 0 ? createdAtRaw : new Date().toISOString(),
    updatedAt:
      updatedAtRaw.length > 0 ? updatedAtRaw : new Date().toISOString(),
    source: item.source,
    actor: item.actor,
    actionType: item.actionType,
    status: item.status,
    riskLevel: item.riskLevel,
    title: clampSnippet(
      maskApprovalQueueSensitiveText(item.title),
      MAX_SNIPPET_LEN,
    ),
    reason: clampSnippet(
      maskApprovalQueueSensitiveText(item.reason),
      MAX_SNIPPET_LEN,
    ),
    targetPaths: sanitizeStringList(item.targetPaths),
    commands: sanitizeStringList(item.commands),
    externalUrls: sanitizeStringList(item.externalUrls),
    expectedResult: clampSnippet(
      maskApprovalQueueSensitiveText(item.expectedResult),
      MAX_SNIPPET_LEN,
    ),
    rollbackPlan: clampSnippet(
      maskApprovalQueueSensitiveText(item.rollbackPlan),
      MAX_SNIPPET_LEN,
    ),
    testPlan: clampSnippet(
      maskApprovalQueueSensitiveText(item.testPlan),
      MAX_SNIPPET_LEN,
    ),
    requiresUserApproval: true,
    autoExecutable: false,
    relatedAuditEventIds: sanitizeStringList(item.relatedAuditEventIds),
    relatedReportId: item.relatedReportId
      ? clampSnippet(maskApprovalQueueSensitiveText(item.relatedReportId), 256)
      : undefined,
    metadata: sanitizeQueueMetadata(item.metadata),
  };
  return base;
}

export function createApprovalQueueItem(
  input: CreateApprovalQueueItemInput,
): CreateApprovalQueueItemResult {
  if (!input.title?.trim() || !input.reason?.trim()) {
    return {
      ok: false,
      reasonCode: "INVALID_INPUT",
      reason: "title and reason are required",
    };
  }

  const now = new Date().toISOString();
  const createdAt = input.createdAt ?? now;
  const draft: ApprovalQueueItem = {
    approvalId: input.approvalId ?? randomUUID(),
    createdAt,
    updatedAt: createdAt,
    source: input.source,
    actor: input.actor,
    actionType: input.actionType,
    status: input.status ?? "pending",
    riskLevel: input.riskLevel,
    title: input.title,
    reason: input.reason,
    targetPaths: [...(input.targetPaths ?? [])],
    commands: [...(input.commands ?? [])],
    externalUrls: [...(input.externalUrls ?? [])],
    expectedResult: input.expectedResult,
    rollbackPlan: input.rollbackPlan,
    testPlan: input.testPlan,
    requiresUserApproval: true,
    autoExecutable: false,
    relatedAuditEventIds: [...(input.relatedAuditEventIds ?? [])],
    relatedReportId: input.relatedReportId,
    metadata: input.metadata,
  };

  return { ok: true, item: normalizeApprovalQueueItem(draft) };
}

export function updateApprovalQueueItemStatus(
  item: ApprovalQueueItem,
  input: UpdateApprovalQueueItemStatusInput,
): UpdateApprovalQueueItemStatusResult {
  const at = input.at ?? new Date().toISOString();
  const next: ApprovalQueueItem = {
    ...item,
    status: input.status,
    updatedAt: at,
  };
  return { ok: true, item: normalizeApprovalQueueItem(next) };
}

export function createApprovalQueueItemFromApprovalRequest(
  request: ApprovalRequest,
  options?: {
    source?: ApprovalQueueSource;
    title?: string;
  },
): CreateApprovalQueueItemResult {
  const title =
    options?.title ?? `Blocked ${request.actionType} requires user approval`;
  return createApprovalQueueItem({
    source: options?.source ?? "operation_block",
    actor: request.actor,
    actionType: request.actionType,
    riskLevel: request.riskLevel,
    title,
    reason: request.reason,
    expectedResult: request.expectedResult,
    rollbackPlan: request.rollbackPlan,
    testPlan: request.testPlan,
    targetPaths: request.targetPaths,
    commands: request.commands,
    externalUrls: request.externalUrls,
    metadata: request.requestId
      ? { requestId: String(request.requestId) }
      : undefined,
  });
}

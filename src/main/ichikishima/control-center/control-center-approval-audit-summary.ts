/**
 * Approval / Audit を将来の Renderer 向けに **集約ラベルのみ**でまとめる（本文増幅無し）。
 */
import type { ControlCenterReadonlyData } from "./control-center-data-provider";

export interface ControlCenterApprovalAuditReadonlySummary {
  readonly approvalQueueApproxCount: number | null;
  readonly auditApproxCount: number | null;
  /** 例: `"pending"` / `"held"` と件数のみ。本文なし */
  readonly latestShortStatusHints: readonly string[];
  readonly latestSafeSummaryLines: readonly string[];
  readonly blockedApproxCount: number | null;
  readonly forbiddenApproxCount: number | null;
  readonly requiresUserApprovalApproxCount: number | null;
  readonly unavailableApproval: boolean;
  readonly unavailableAudit: boolean;
}

function approxBlockedFromRisk(risk: readonly string[]): number | null {
  const hit = risk.find((line) => /blocked(?:_ops)?_approx\s*:/i.test(line));
  if (!hit) return null;
  const m = hit.match(/:(\d+)/);
  return m && m[1] ? Number.parseInt(m[1], 10) : null;
}

function forbiddenHintFromRisk(risk: readonly string[]): number | null {
  const n = risk.filter((x) =>
    /forbidden|policy_blocked|blocked_zone/i.test(x),
  ).length;
  return n > 0 ? n : null;
}

function statusBucketsFromApproval(ap: unknown): {
  hints: string[];
  requiresUserApprox: number | null;
} {
  if (
    typeof ap !== "object" ||
    ap === null ||
    ("unavailable" in ap &&
      (ap as { unavailable?: boolean }).unavailable === true)
  ) {
    return { hints: ["approval_unavailable"], requiresUserApprox: null };
  }
  const o = ap as Record<string, unknown>;
  const hints: string[] = [];
  const pushPair = (label: string, val: unknown): void => {
    if (typeof val === "number" && Number.isFinite(val) && val > 0)
      hints.push(`${label}:${val}`);
  };
  pushPair("pending", o.pending);
  pushPair("held", o.held);
  pushPair("approved", o.approved);
  pushPair("rejected", o.rejected);
  pushPair("highRisk", o.highRisk);
  const pending = typeof o.pending === "number" ? o.pending : 0;
  const held = typeof o.held === "number" ? o.held : 0;
  return {
    hints: hints.slice(0, 8),
    requiresUserApprox: pending + held,
  };
}

/**
 * Snapshot 相当を **入力**に短文サマリーへ落とす。queue / audit の **行本文・payload は触らない**。
 */
export function buildControlCenterApprovalAuditReadonlySummary(
  bundle: Pick<
    ControlCenterReadonlyData,
    | "approvalQueueSummary"
    | "auditLogSummary"
    | "riskSummary"
    | "requiresUserApproval"
    | "canExecuteDangerousActions"
  >,
): ControlCenterApprovalAuditReadonlySummary {
  const ap = bundle.approvalQueueSummary;
  const au = bundle.auditLogSummary;
  const unAp =
    typeof ap === "object" &&
    ap !== null &&
    "unavailable" in ap &&
    (ap as { unavailable?: boolean }).unavailable === true;
  const unAu =
    typeof au === "object" &&
    au !== null &&
    "unavailable" in au &&
    (au as { unavailable?: boolean }).unavailable === true;

  const approvalTotal = unAp
    ? null
    : typeof ap === "object" &&
        ap !== null &&
        "total" in ap &&
        typeof (ap as { total: unknown }).total === "number"
      ? (ap as { total: number }).total
      : null;

  const auditTotal = unAu
    ? null
    : typeof au === "object" &&
        au !== null &&
        "total" in au &&
        typeof (au as { total: unknown }).total === "number"
      ? (au as { total: number }).total
      : null;

  const buckets = statusBucketsFromApproval(ap);
  const lines = [...bundle.riskSummary.slice(0, 16)];
  const blockedApprox = approxBlockedFromRisk(bundle.riskSummary);
  const forbiddenApprox = forbiddenHintFromRisk(bundle.riskSummary);

  return {
    approvalQueueApproxCount: approvalTotal,
    auditApproxCount: auditTotal,
    latestShortStatusHints: buckets.hints.slice(0, 8),
    latestSafeSummaryLines: lines,
    blockedApproxCount: blockedApprox,
    forbiddenApproxCount: forbiddenApprox,
    requiresUserApprovalApproxCount: buckets.requiresUserApprox,
    unavailableApproval: unAp,
    unavailableAudit: unAu,
  };
}

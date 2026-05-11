import type { ApprovalQueueItem } from "./approval-queue";

export interface ApprovalQueueSummary {
  total: number;
  pending: number;
  held: number;
  approved: number;
  rejected: number;
  /** `critical` と `high`。 */
  highRisk: number;
  latestUpdatedAt: string | null;
  /** 空配列が望ましい（将来 `expired`/`cancelled` を分けたくなったら拡張）。 */
  parseWarnings: string[];
}

function isHighApprovalRisk(risk: ApprovalQueueItem["riskLevel"]): boolean {
  return risk === "critical" || risk === "high";
}

/** JSONL から復元したキュー項目のみを集計する（本文増幅なし）。 */
export function summarizeApprovalQueueItems(
  items: ApprovalQueueItem[],
): ApprovalQueueSummary {
  const parseWarnings: string[] = [];
  let pending = 0;
  let held = 0;
  let approved = 0;
  let rejected = 0;
  let highRisk = 0;
  let latest: string | null = null;

  for (const item of items) {
    if (typeof item.updatedAt !== "string" || item.updatedAt.trim() === "") {
      parseWarnings.push("queue item missing updatedAt");
    }

    switch (item.status) {
      case "pending":
        pending += 1;
        break;
      case "held":
        held += 1;
        break;
      case "approved":
        approved += 1;
        break;
      case "rejected":
        rejected += 1;
        break;
      default:
        parseWarnings.push(`status bucket other: ${item.status}`);
    }

    if (isHighApprovalRisk(item.riskLevel)) {
      highRisk += 1;
    }

    const ts = item.updatedAt;
    if (ts && !Number.isNaN(Date.parse(ts))) {
      if (!latest || Date.parse(ts) > Date.parse(latest)) {
        latest = ts;
      }
    }
  }

  return {
    total: items.length,
    pending,
    held,
    approved,
    rejected,
    highRisk,
    latestUpdatedAt: latest,
    parseWarnings,
  };
}

/** {@link summarizeApprovalQueueItems} のエイリアス（契約名）。 */
export function getApprovalQueueSummaryFromItems(
  items: ApprovalQueueItem[],
): ApprovalQueueSummary {
  return summarizeApprovalQueueItems(items);
}

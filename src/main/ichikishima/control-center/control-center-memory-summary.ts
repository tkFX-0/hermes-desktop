/**
 * Memory Candidate の **カウントと短文のみ** をアプリへ渡す準備（DB・本文保存無し）。
 */
import { extractMemoryCandidates } from "../memory/memory-candidate";
import type {
  MemoryCandidate,
  MemoryCandidateCategory,
} from "../memory/memory-candidate";

export interface ControlCenterMemoryReadonlySummary {
  readonly candidateApproxCount: number;
  readonly categoryCounts: Partial<Record<MemoryCandidateCategory, number>>;
  readonly requiresApprovalApproxCount: number;
  readonly forbiddenMemoryApproxCount: number;
  readonly safeSummaryLines: readonly string[];
  readonly excerptSourceHint: string;
}

const SUMMARY_LINES_MAX = 12;

/** 入力テキストは **既に許可済み短文**のみ想定。**外部プロファイル本文を渡さない**。 */
export function buildControlCenterMemoryReadonlySummary(
  sanitizedLabelText?: string | null,
): ControlCenterMemoryReadonlySummary {
  const text =
    typeof sanitizedLabelText === "string"
      ? sanitizedLabelText.slice(0, 8192)
      : "";
  const r = extractMemoryCandidates({
    text,
    source: "system_event",
  });
  const all: MemoryCandidate[] = [...r.candidates, ...r.rejected];

  const categoryCounts: Partial<Record<MemoryCandidateCategory, number>> = {};
  for (const c of all) {
    categoryCounts[c.category] = (categoryCounts[c.category] ?? 0) + 1;
  }

  const requiresApprovalApproxCount = all.filter(
    (c) => c.requiresUserApproval,
  ).length;
  const forbiddenMemoryApproxCount = all.filter(
    (c) => c.category === "forbidden_memory",
  ).length;

  const safeSummaryLines =
    text.trim().length === 0
      ? [
          "memory_candidate:input_empty_counts_zero",
          "memory_db:persistence:forbidden_goal",
        ]
      : [...r.warnings.slice(0, SUMMARY_LINES_MAX)].map((w) => w.slice(0, 240));

  return {
    candidateApproxCount: all.length,
    categoryCounts,
    requiresApprovalApproxCount,
    forbiddenMemoryApproxCount,
    safeSummaryLines,
    excerptSourceHint: "sandbox_or_control_center_placeholder_only",
  };
}

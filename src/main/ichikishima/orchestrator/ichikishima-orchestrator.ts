import {
  createApprovalQueueItemFromReport,
  createApprovalReport,
  type ApprovalReport,
  type CreateApprovalQueueItemResult,
} from "../approval";
import { createAuditLogRecord, type AuditLogRecord } from "../audit";
import { extractMemoryCandidates } from "../memory";
import type { HermesLocalPilotResult } from "../hermes/hermes-local-pilot";
import { evaluateReviewMode } from "../review/review-mode";
import { reviewHermesReport } from "../review/hermes-report-reviewer";

export interface IchikishimaOrchestratorOutput {
  reviewResult: ReturnType<typeof reviewHermesReport>;
  memoryCandidates: ReturnType<typeof extractMemoryCandidates>;
  /** 統括側で組み替えた最終 Approval Report（Pilot 版とは別でもよい）。 */
  approvalReport: ApprovalReport;
  approvalQueueItems: CreateApprovalQueueItemResult[];
  auditRecords: AuditLogRecord[];
  finalDecision: {
    label: "ichikishima_integration_gate";
    requiresUserApproval: true;
    autoExecutable: false;
    shouldSpeak: false;
  };
}

function buildOrchestratorText(pilot: HermesLocalPilotResult): string {
  const memoryHint =
    pilot.approvalReport?.memoryCandidatesSummary.candidateCount ?? 0;
  return `${pilot.finalSummary}

イツキシマ統括: Hermes Pilot status=${pilot.status}
Hermes側レポート検知 memory候補数(参考のみ・未保存)=${memoryHint}
記憶候補は抽出のみで memory DB に保存しない。
`;
}

/** Hermes Local Pilot の結果だけを入力に統合パッケージを構成する（自動実行なし／発話なし）。 */
export function processHermesPilotResult(
  pilot: HermesLocalPilotResult,
): IchikishimaOrchestratorOutput {
  const richText = buildOrchestratorText(pilot);
  const reviewResult = reviewHermesReport({
    reportText: richText,
    changedFiles: pilot.approvalReport?.changedFiles ?? [],
    executedTests: pilot.approvalReport?.executedTests ?? [],
    unexecutedTests: pilot.approvalReport?.skippedTests ?? [],
    untouchedImportantAreas: pilot.approvalReport?.untouchedCriticalAreas ?? [],
    rollbackPlan:
      pilot.approvalReport?.rollbackPlan ??
      "ローカル sandbox のみ手動で確認してから続行してください",
    codeChanged: true,
    docsOnly: false,
  });

  const memoryCandidates = extractMemoryCandidates({
    text: richText,
    source: "hermes_report",
  });

  const orchReviewCore = evaluateReviewMode({
    reportText: richText,
    changedFiles: pilot.approvalReport?.changedFiles ?? [],
    executedTests: [
      ...(pilot.approvalReport?.executedTests ?? []),
      "orchestration_unit",
    ],
    unexecutedTests: pilot.approvalReport?.skippedTests ?? [],
    untouchedImportantAreas: [
      "EA本体",
      "MT5関連",
      "memory DB自動更新",
      "Hermes本体直結実行",
      "自動発話",
    ],
    rollbackPlan:
      pilot.approvalReport?.rollbackPlan ??
      "sandbox と JSONL は人手で確認してから復元または削除してください",
    codeChanged: true,
    docsOnly: false,
  });

  const approvalReport = createApprovalReport({
    source: "mixed",
    title: `イツキシマ統括 — ${pilot.bridgeTask.title}`,
    summary:
      pilot.status === "completed"
        ? "Hermes Local Pilot と Review/Memory Candidate を統合した提示用レポート。"
        : "Hermes Pilot が失敗または部分のみ。人手レビューを前提に統合しました。",
    reviewResult: orchReviewCore,
    changedFiles: pilot.approvalReport?.changedFiles ?? [],
    untouchedCriticalAreas: [
      "EA本体",
      "MT5関連",
      "memory DB",
      "Hermes本体",
      "自動発話/通知経路",
    ],
    executedTests: ["orchestrator unit"],
    skippedTests: [
      ...(pilot.approvalReport?.skippedTests ?? []),
      "UI/Electron",
    ],
    memoryCandidates,
    safetyFlags: ["integrated_shadow_mode_gate"],
    createdAt: pilot.approvalReport?.createdAt ?? new Date().toISOString(),
    rollbackPlan:
      pilot.approvalReport?.rollbackPlan ??
      "sandbox と JSONL は人手で確認してから復元または削除してください",
  });

  const queueItem = createApprovalQueueItemFromReport(approvalReport);
  const approvalQueueItems = queueItem.ok
    ? [queueItem]
    : ([] as CreateApprovalQueueItemResult[]);

  const auditRecords: AuditLogRecord[] = [...pilot.auditRecords];

  auditRecords.push(
    createAuditLogRecord({
      mode: "review_completed",
      actor: "ichikishima",
      agent: "ichikishima",
      source: "review_mode",
      reportId: approvalReport.reportId,
      reasonCode: "ORCHESTRATOR_REVIEW",
      metadata: {
        pilot_status: pilot.status,
      },
    }),
  );

  for (
    let index = 0;
    index < Math.min(memoryCandidates.candidates.length, 2);
    index += 1
  ) {
    const candidate = memoryCandidates.candidates[index];

    auditRecords.push(
      createAuditLogRecord({
        mode: "memory_candidate_created",
        actor: "ichikishima",
        agent: "memory_agent",
        source: "memory_candidate",
        riskLevel:
          candidate.riskLevel === "high"
            ? "high"
            : candidate.riskLevel === "medium"
              ? "medium"
              : "low",
        reasonCode: candidate.category,
      }),
    );
  }

  return {
    reviewResult,
    memoryCandidates,
    approvalReport,
    approvalQueueItems,
    auditRecords,
    finalDecision: {
      label: "ichikishima_integration_gate",
      requiresUserApproval: true,
      autoExecutable: false,
      shouldSpeak: false,
    },
  };
}

export function createIchikishimaDecisionPackage(
  pilot: HermesLocalPilotResult,
): IchikishimaOrchestratorOutput {
  return processHermesPilotResult(pilot);
}

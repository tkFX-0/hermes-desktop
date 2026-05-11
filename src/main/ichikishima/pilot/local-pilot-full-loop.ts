import {
  createIchikishimaDecisionPackage,
  type IchikishimaOrchestratorOutput,
} from "../orchestrator";
import type { RunHermesLocalPilotTaskInput } from "../hermes/hermes-local-pilot";
import {
  runHermesLocalPilotTask,
  type HermesLocalPilotResult,
} from "../hermes/hermes-local-pilot";

export type LocalPilotFullLoopLabel = "READY_FOR_LOCAL_FULL_LOOP" | "NOT_READY";

export interface LocalPilotFullLoopResult {
  hermesPilotResult: HermesLocalPilotResult;
  ichikishimaOrchestration: IchikishimaOrchestratorOutput;
  finalUserSummary: string;
  readinessStatus: LocalPilotFullLoopLabel;
  readinessReasons: string[];
  requiresUserApproval: true;
  shouldSpeak: false;
}

export type RunLocalPilotFullLoopOptions = Omit<
  RunHermesLocalPilotTaskInput,
  "taskId"
> & {
  taskId?: string;
};

function assessFullLoopReadiness(params: {
  pilot: HermesLocalPilotResult;
  orchestration: IchikishimaOrchestratorOutput;
}): { label: LocalPilotFullLoopLabel; reasons: string[] } {
  const reasons: string[] = [];

  if (params.pilot.forbiddenOperations.length > 0) {
    reasons.push("HermesBridge forbidden が検知されました");
  }
  if (params.pilot.status !== "completed") {
    reasons.push("Hermes Local Pilot が completed ではない");
  }
  if (!params.pilot.approvalReport) {
    reasons.push("Pilot 側 Approval Report が未生成です");
  }
  if (!params.orchestration.approvalReport) {
    reasons.push("統括側 Approval Report が未生成です");
  }

  const label =
    reasons.length === 0 ? "READY_FOR_LOCAL_FULL_LOOP" : "NOT_READY";

  return { label, reasons };
}

/** dummy task を Hermes Local Pilot とイツキシマ統括まで接続したローカルのみの検証回路。 */
export function runLocalPilotFullLoop(
  options: RunLocalPilotFullLoopOptions,
): LocalPilotFullLoopResult {
  const taskId =
    options.taskId ?? `local_loop_${Math.random().toString(36).slice(2, 10)}`;

  const pilot = runHermesLocalPilotTask({ ...options, taskId });

  const ichikishimaOrchestration = createIchikishimaDecisionPackage(pilot);

  const readiness = assessFullLoopReadiness({
    pilot,
    orchestration: ichikishimaOrchestration,
  });

  const finalUserSummary = ichikishimaOrchestration.approvalReport.summary;

  return {
    hermesPilotResult: pilot,
    ichikishimaOrchestration,
    finalUserSummary,
    readinessStatus: readiness.label,
    readinessReasons: readiness.reasons,
    requiresUserApproval: true,
    shouldSpeak: false,
  };
}

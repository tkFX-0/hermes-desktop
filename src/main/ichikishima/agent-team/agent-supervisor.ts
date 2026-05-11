import { describeAgentCapabilityLabels } from "./agent-capability-matrix";
import type { AgentFoundationId } from "./agent-registry";
import { getAgentFoundationRecords } from "./agent-registry";
import { buildEmptyAgentHandoffLedger } from "./agent-handoff";
import { getAgentSchedulerContract } from "./agent-scheduler-contract";

export interface AgentTeamAgentSnapshot {
  readonly id: AgentFoundationId;
  readonly labelJa: string;
  readonly autoRun: false;
  readonly autoApprove: false;
  readonly requiresUserApproval: true;
  readonly dryRunOnly: true;
  readonly readonlyCapabilityHints: readonly string[];
}

export interface AgentTeamFoundationReadonlySummary {
  readonly productionReady: false;
  readonly schedulerEnabled: false;
  readonly autoRunAgents: false;
  readonly blockerCountApprox: number;
  readonly warningCountApprox: number;
  readonly agents: readonly AgentTeamAgentSnapshot[];
  readonly supervisorNextActionStub: string;
}

export function buildAgentTeamFoundationReadonlySummary(
  blockerHint: number,
  warningHint: number,
): AgentTeamFoundationReadonlySummary {
  const sched = getAgentSchedulerContract();
  const agents = getAgentFoundationRecords().map(
    (a): AgentTeamAgentSnapshot => ({
      id: a.id,
      labelJa: a.labelJa,
      autoRun: false,
      autoApprove: false,
      requiresUserApproval: true,
      dryRunOnly: true,
      readonlyCapabilityHints: describeAgentCapabilityLabels(a.id),
    }),
  );
  buildEmptyAgentHandoffLedger(); // 将来 wire ための論理のみ
  return {
    productionReady: false,
    schedulerEnabled: sched.enabled,
    autoRunAgents: false,
    blockerCountApprox: Math.max(0, Math.floor(blockerHint)),
    warningCountApprox: Math.max(0, Math.floor(warningHint)),
    agents,
    supervisorNextActionStub: "defer:any_autonomous_execution",
  };
}

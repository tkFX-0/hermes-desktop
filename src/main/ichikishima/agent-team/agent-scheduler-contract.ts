/**
 * Scheduler **契約だけ**。**tick は走らせない**。別 Goal で gate。
 */
export const AGENT_TEAM_SCHEDULER_ENABLED = false as const;

export interface AgentSchedulerContractV1 {
  readonly enabled: typeof AGENT_TEAM_SCHEDULER_ENABLED;
  readonly reasonDeferred: string;
}

export function getAgentSchedulerContract(): AgentSchedulerContractV1 {
  return {
    enabled: AGENT_TEAM_SCHEDULER_ENABLED,
    reasonDeferred: "separate_goal_user_signoff_before_any_tick",
  };
}

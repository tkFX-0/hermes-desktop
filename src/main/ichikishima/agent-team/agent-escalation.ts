export type EscalationOutcomeStub =
  | "blocked_deferred_goal"
  | "not_evaluated_stub";

export interface AgentEscalationRequestStub {
  readonly escalationId: string;
  readonly outcome: EscalationOutcomeStub;
}

export function requestAgentEscalationStub(
  id: string,
): AgentEscalationRequestStub {
  return {
    escalationId: id.slice(0, 96),
    outcome: "blocked_deferred_goal",
  };
}

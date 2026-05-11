export type AgentVisualizationAgent = "hermes" | "ichikishima";

export type AgentVisualizationPhase =
  | "Observe"
  | "Recall"
  | "Judge"
  | "Silent"
  | "SpeakCandidate"
  | "ApprovalReview"
  | "Blocked";

export interface AgentVisualizationEvent {
  eventId?: string;
  agent: AgentVisualizationAgent;
  phase: AgentVisualizationPhase;
  status: "started" | "completed" | "blocked" | "candidate";
  riskLevel: "low" | "medium" | "high" | "critical";
  message: string;
  metadata?: Record<string, string | number | boolean | null>;
  contentIncluded: false;
  timestamp: string;
}

export function createAgentVisualizationEvent(
  input: Omit<AgentVisualizationEvent, "contentIncluded" | "timestamp">,
): AgentVisualizationEvent {
  return {
    ...input,
    contentIncluded: false,
    timestamp: new Date().toISOString(),
  };
}

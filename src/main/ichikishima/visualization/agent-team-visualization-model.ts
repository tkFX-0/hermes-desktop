import type { AgentFoundationId } from "../agent-team/agent-registry";
import { AGENT_FOUNDATION_REGISTRY } from "../agent-team/agent-registry";

export interface AgentTeamVisualizationNodeStub {
  readonly id: AgentFoundationId;
  readonly kind: "agent";
  readonly statusLabel: "disabled_dry_run_only";
  readonly nextActionLabel: "no_autonomous_next";
}

/** UI 向け **エージェント節点のラベル一覧**のみ（座標・ログ無し）。 */
export function buildAgentTeamVisualizationNodes(): readonly AgentTeamVisualizationNodeStub[] {
  return AGENT_FOUNDATION_REGISTRY.map((a) => ({
    id: a.id,
    kind: "agent" as const,
    statusLabel: "disabled_dry_run_only" as const,
    nextActionLabel: "no_autonomous_next" as const,
  }));
}

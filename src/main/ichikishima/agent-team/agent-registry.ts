/**
 * 自律 Agent Team の **名前空間定義のみ** — 自動実行無し・常駐無し。
 */
export type AgentFoundationId =
  | "hermes_worker"
  | "ichikishima_reviewer"
  | "approval_guardian"
  | "audit_keeper"
  | "memory_curator"
  | "visualization_observer"
  | "supervisor"
  | "suppressive_agent"
  | "research_agent"
  | "execution_planner";

export interface AgentFoundationRecord {
  readonly id: AgentFoundationId;
  readonly labelJa: string;
  readonly enabled: false;
  readonly dryRunOnly: true;
  readonly requiresUserApproval: true;
}

export const AGENT_FOUNDATION_REGISTRY: readonly AgentFoundationRecord[] =
  Object.freeze([
    {
      id: "hermes_worker",
      labelJa: "Hermes 作業",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
    {
      id: "ichikishima_reviewer",
      labelJa: "イツキシマ審査",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
    {
      id: "approval_guardian",
      labelJa: "承認の門番",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
    {
      id: "audit_keeper",
      labelJa: "監査保管",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
    {
      id: "memory_curator",
      labelJa: "メモリ候補",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
    {
      id: "visualization_observer",
      labelJa: "可視化オブザーバ",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
    {
      id: "supervisor",
      labelJa: "統括スーパーバイザ",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
    {
      id: "suppressive_agent",
      labelJa: "抑止エージェント",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
    {
      id: "research_agent",
      labelJa: "調査エージェント",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
    {
      id: "execution_planner",
      labelJa: "実行計画（設計のみ）",
      enabled: false,
      dryRunOnly: true,
      requiresUserApproval: true,
    },
  ]);

export function getAgentFoundationRecords(): readonly AgentFoundationRecord[] {
  return AGENT_FOUNDATION_REGISTRY;
}

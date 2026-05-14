import type { ResearchQuery, ResearchResult } from "./research-query";
import { processResearchQuery } from "./research-query";

export interface ResearchAgentConfig {
  enabled: boolean;
  dryRunOnly: true;
  requiresUserApproval: true;
  maxQueryLength: number;
}

export const RESEARCH_AGENT_DEFAULT_CONFIG: ResearchAgentConfig = {
  enabled: false,
  dryRunOnly: true,
  requiresUserApproval: true,
  maxQueryLength: 500,
};

export function runResearchQuery(
  config: ResearchAgentConfig,
  query: ResearchQuery,
): { result: ResearchResult } | { blocked: true; reason: string } {
  if (!config.enabled) {
    return { blocked: true, reason: "research_agent is disabled" };
  }

  if (query.subject.length > config.maxQueryLength) {
    return { blocked: true, reason: "Query too long" };
  }

  const result = processResearchQuery(query);
  return { result };
}

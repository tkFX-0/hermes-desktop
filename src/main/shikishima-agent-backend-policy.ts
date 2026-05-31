/**
 * Enforces monthly Grok Research / x_search HOLD across main process entry points.
 */

import { isAgentHermesResearchAllowed, type ShikishimaAgentId } from "./shikishima-agent-model-registry";

export {
  getAgentBackendEntry,
  isGlobalGrokResearchHold,
  isAgentHermesResearchAllowed,
  resolveAgentReplyRoute,
  formatModelTraceLine
} from "./shikishima-agent-model-registry";

export interface HeldResearchResult {
  success: false;
  content: "";
  error: string;
  durationMs: number;
  held: true;
}

export function holdHermesResearch(
  agentId: ShikishimaAgentId,
  durationMs = 0
): HeldResearchResult {
  return {
    success: false,
    content: "",
    error: `grok_research_hold:${agentId}:use_groq_or_claude`,
    durationMs,
    held: true
  };
}

export function mayRunHermesResearch(agentId: ShikishimaAgentId): boolean {
  return isAgentHermesResearchAllowed(agentId);
}

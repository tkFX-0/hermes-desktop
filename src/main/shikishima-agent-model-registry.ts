/**
 * Agent backend registry — reply API vs implementation workers + Model Trace flags.
 */

import registry from "../shared/shikishima-agent-model-registry.json";

export type ShikishimaAgentId =
  | "shikishima"
  | "shizume"
  | "tsumugi"
  | "hajime"
  | "shirube";

export type ReplyBackend = "groq" | "claude" | "claude-code-worker" | "codex-worker" | "deterministic-hold";

export interface AgentWorkerRef {
  id: string;
  model: string;
  scope?: string;
  enabled?: boolean;
}

export type ReasoningLevelLabel = "quick" | "standard" | "deep" | "critical";

export interface ReasoningProfileEntry {
  backend?: ReplyBackend;
  modelKey?: string;
  model?: string;
  preferClaude?: boolean;
  maxTokens?: number;
}

export interface AgentBackendEntry {
  displayName: string;
  role: string;
  reasoningLevel?: ReasoningLevelLabel;
  primaryBackend: ReplyBackend;
  fallbackBackend: ReplyBackend | "deterministic-hold";
  providerApi: "groq" | "claude" | null;
  replyModels: Record<string, string>;
  reasoningProfile?: Partial<Record<ReasoningLevelLabel, ReasoningProfileEntry>>;
  workers: readonly AgentWorkerRef[];
  grokResearchEnabled: boolean;
  xSearchEnabled: boolean;
  modelTraceRequired: boolean;
  safetyDecision: "HOLD" | "ALLOW_DRAFT";
  actionMode: "draft_only" | "execute_permitted_go";
}

export interface RegistryPolicy {
  grokResearchHold: boolean;
  grokResearchHoldReason: string;
  xSearchEnabled: boolean;
  holdUntil: string;
  note?: string;
}

export interface ShikishimaAgentModelRegistry {
  version: string;
  governanceVersion?: string;
  policy: RegistryPolicy;
  defaultAgentId: ShikishimaAgentId;
  agents: Record<ShikishimaAgentId, AgentBackendEntry>;
  workers: Record<string, { kind: string; model: string; enabled?: boolean }>;
}

export const SHIKISHIMA_AGENT_MODEL_REGISTRY =
  registry as ShikishimaAgentModelRegistry;

export function getRegistryPolicy(): RegistryPolicy {
  return SHIKISHIMA_AGENT_MODEL_REGISTRY.policy;
}

export function isGlobalGrokResearchHold(): boolean {
  return SHIKISHIMA_AGENT_MODEL_REGISTRY.policy.grokResearchHold === true;
}

export function isGlobalXSearchEnabled(): boolean {
  if (isGlobalGrokResearchHold()) return false;
  return SHIKISHIMA_AGENT_MODEL_REGISTRY.policy.xSearchEnabled === true;
}

export function getAgentBackendEntry(agentId: ShikishimaAgentId): AgentBackendEntry {
  return SHIKISHIMA_AGENT_MODEL_REGISTRY.agents[agentId];
}

export function isAgentHermesResearchAllowed(agentId: ShikishimaAgentId): boolean {
  if (isGlobalGrokResearchHold()) return false;
  const entry = getAgentBackendEntry(agentId);
  return entry.grokResearchEnabled && entry.xSearchEnabled;
}

export interface ResolvedReplyRoute {
  agentId: ShikishimaAgentId;
  backend: ReplyBackend;
  model: string;
  modelTraceRequired: boolean;
  grokResearchHeld: boolean;
}

export function resolveAgentReplyRoute(
  agentId: ShikishimaAgentId,
  complexity: "simple" | "medium" | "complex" = "medium"
): ResolvedReplyRoute {
  const entry = getAgentBackendEntry(agentId);
  const grokHeld = isGlobalGrokResearchHold();

  const level = entry.reasoningLevel ?? "standard";
  const deepLike = level === "deep" || level === "critical" || complexity === "complex";

  let backend = entry.primaryBackend;
  if (grokHeld && (backend === "grok" as ReplyBackend)) {
    backend = entry.fallbackBackend === "deterministic-hold" ? "claude" : entry.fallbackBackend;
  }
  if (deepLike && (entry.primaryBackend === "claude" || entry.reasoningProfile?.[level]?.preferClaude)) {
    backend = "claude";
  }

  let model = entry.replyModels.claude ?? "claude-sonnet-4-6";
  if (backend === "groq") {
    model =
      complexity === "simple" || level === "quick"
        ? (entry.replyModels.groqSimple ?? entry.replyModels.groq ?? "llama-3.1-8b-instant")
        : (entry.replyModels.groq ?? "llama-3.3-70b-versatile");
  } else if (backend === "claude" || backend === "claude-code-worker") {
    model =
      deepLike && entry.replyModels.claudeDeep
        ? entry.replyModels.claudeDeep
        : (entry.replyModels.claude ?? "claude-sonnet-4-6");
  }

  return {
    agentId,
    backend,
    model,
    modelTraceRequired: entry.modelTraceRequired,
    grokResearchHeld: grokHeld
  };
}

export function formatModelTraceLine(route: ResolvedReplyRoute): string {
  return `[trace agent=${route.agentId} backend=${route.backend} model=${route.model} grokHold=${route.grokResearchHeld}]`;
}

/** @deprecated use resolveAgentReplyRoute */
export function getAgentPrimaryModel(agentId: ShikishimaAgentId): string {
  return resolveAgentReplyRoute(agentId).model;
}

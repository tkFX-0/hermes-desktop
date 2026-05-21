// AI Usage Cockpit type definitions
// Display-only. No API calls. No token fields. No persistence.
// Data source must always be explicit — never mix FACT / ESTIMATED / UNKNOWN.

export type AIUsageProvider =
  | "claude_code"
  | "claude"
  | "codex"
  | "chatgpt"
  | "openai_api"
  | "cursor"
  | "gemini"
  | "grok"
  | "local_llm"
  | "other";

export type AIUsageStatus =
  | "READY"
  | "BUSY"
  | "COOLDOWN"
  | "LIMITED"
  | "BLOCKED"
  | "UNKNOWN"
  | "NEEDS_MANUAL_UPDATE"
  | "NEEDS_HUMAN";

export type AIUsageDataSource =
  | "official_api"    // future only — requires separate GO
  | "cli_manual"      // human reads CLI output and transcribes
  | "screen_manual"   // human reads dashboard screen
  | "user_reported"   // user's subjective report
  | "estimated"       // derived from usage patterns
  | "unknown";

export type AIUsageRisk = "low" | "medium" | "high";

export interface AIUsageProviderState {
  readonly id: string;
  readonly label: string;
  readonly provider: AIUsageProvider;
  readonly status: AIUsageStatus;
  readonly dataSource: AIUsageDataSource;
  readonly lastCheckedAt: string | null;    // ISO timestamp or null
  readonly resetHint: string | null;        // e.g. "resets in ~2h"
  readonly usageSummary: string | null;     // e.g. "~80% used this session"
  readonly routingRecommendation: string;
  readonly risk: AIUsageRisk;
  readonly allowedFor: readonly string[];
  readonly forbiddenFor: readonly string[];
  readonly notes: string | null;
  readonly cooldownWarning: boolean;
  readonly isFutureAdapter: boolean;        // placeholder — not yet implemented
}

export interface AIUsageRoutingDecision {
  readonly recommendedWorker: AIUsageProvider;
  readonly reason: string;
  readonly fallbackWorker: AIUsageProvider | null;
  readonly cooldownWarning: boolean;
  readonly requiresHumanCheck: boolean;
}

export interface AIUsageCockpitState {
  readonly providers: readonly AIUsageProviderState[];
  readonly routing: AIUsageRoutingDecision;
  readonly lastUpdated: string | null;
  readonly dataSourceWarning: string | null;
  readonly tokenStored: false;       // literal — never true
  readonly apiCalled: false;         // literal — never true
  readonly scrapingPerformed: false; // literal — never true
}

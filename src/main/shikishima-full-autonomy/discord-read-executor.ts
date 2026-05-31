/**
 * Phase E5b — Discord read intake when constitutional GO is active (redacted response).
 */

import { hasConstitutionalGoScope } from "./constitutional-go-state";
import { planDiscordReadIntake } from "./discord-read-intake-plan";

export interface DiscordReadExecuteInput {
  channelId: string;
  limit?: number;
}

export interface DiscordReadMessageRedacted {
  id: string;
  authorName: string;
  contentPreview: string;
  timestamp: string;
  isBot: boolean;
}

export interface DiscordReadExecuteResult {
  success: boolean;
  error?: string;
  messages?: readonly DiscordReadMessageRedacted[];
  readCount: number;
  channelIdConfigured: boolean;
  decision: "HOLD" | "ALLOW_DRAFT" | "BLOCKED";
  reasons: readonly string[];
  rawValuesReported: false;
  dis01Status: "HOLD" | "ACTIVE";
}

export type DiscordChannelReadFn = (
  channelId: string,
  limit: number
) => Promise<{
  success: boolean;
  messages?: DiscordReadMessageRedacted[];
  error?: string;
  channelIdConfirmed: string;
  readCount: number;
  rawTokenReported: false;
  dis01Status: "HOLD" | "ACTIVE";
}>;

export async function executeDiscordReadIntake(
  input: DiscordReadExecuteInput,
  readFn?: DiscordChannelReadFn
): Promise<DiscordReadExecuteResult> {
  const channelConfigured = Boolean(input.channelId?.trim());
  const goActive = hasConstitutionalGoScope("discord_read_live");
  const limit = input.limit ?? 10;

  const plan = planDiscordReadIntake({
    channelConfigured,
    humanGoApproved: goActive,
    oneShotDeclared: goActive,
    messageLimit: limit
  });

  if (!goActive) {
    return {
      success: false,
      error: "constitutional_go_discord_read_required",
      readCount: 0,
      channelIdConfigured: channelConfigured,
      decision: plan.decision,
      reasons: [...plan.reasons, "constitutional_go_discord_read_required"],
      rawValuesReported: false,
      dis01Status: "HOLD"
    };
  }

  if (!plan.wouldRead || !channelConfigured) {
    return {
      success: false,
      error: plan.reasons[0] ?? "discord_read_not_ready",
      readCount: 0,
      channelIdConfigured: channelConfigured,
      decision: plan.decision,
      reasons: plan.reasons,
      rawValuesReported: false,
      dis01Status: "HOLD"
    };
  }

  if (!readFn) {
    return {
      success: true,
      readCount: 0,
      channelIdConfigured: true,
      decision: "ALLOW_DRAFT",
      reasons: ["no_read_fn_injected"],
      rawValuesReported: false,
      dis01Status: "ACTIVE",
      messages: []
    };
  }

  const result = await readFn(input.channelId, limit);
  return {
    success: result.success,
    error: result.error,
    messages: result.messages,
    readCount: result.readCount,
    channelIdConfigured: channelConfigured,
    decision: result.success ? "ALLOW_DRAFT" : "HOLD",
    reasons: result.success ? [] : [result.error ?? "discord_read_failed"],
    rawValuesReported: false,
    dis01Status: result.dis01Status
  };
}

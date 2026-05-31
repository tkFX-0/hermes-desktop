/**
 * Phase A — read-only development status briefing for secretary / StackChan allowlist.
 * No secrets, no paths, no raw Discord bodies.
 */

import {
  resolveSecretarySpeakPhrase,
  type SecretaryAllowlistPhrase
} from "./secretary-voice-phrase-map";

export interface DevStatusBriefingInput {
  /** StackChan voice path intentionally held */
  stackchanHold: boolean;
  /** e.g. GO_PREPARED — never raw env */
  orchestratorDecision?: string;
  /** capped counter — number only */
  maintenanceTicksToday?: number;
  /** discord.read enabled in ops */
  discordReadOnly: boolean;
  /** Hermes backend flag — expected false in subscription-only phase */
  hermesBackendEnabled: boolean;
  /** vitest zone last run — pass/fail/unknown */
  zoneTests?: "pass" | "fail" | "unknown";
  phaseLabel?: string;
}

export interface DevStatusBriefingResult {
  redactedPreview: string;
  speakPhrase: SecretaryAllowlistPhrase | null;
  hints: readonly string[];
}

const MAX_PREVIEW = 72;

function clampPreview(s: string): string {
  const t = s.replace(/\s+/gu, " ").trim();
  return t.length <= MAX_PREVIEW ? t : `${t.slice(0, MAX_PREVIEW - 1)}…`;
}

/**
 * Build a short redacted line for logs / secretary planner (not for Discord send).
 */
export function buildDevStatusRedactedPreview(input: DevStatusBriefingInput): string {
  const parts: string[] = [];
  const phase = input.phaseLabel?.trim() || "A";
  parts.push(`phase=${phase}`);

  if (input.stackchanHold) parts.push("voice=H");
  else parts.push("voice=ready");

  if (input.orchestratorDecision) {
    parts.push(`orch=${input.orchestratorDecision.slice(0, 24)}`);
  }

  if (typeof input.maintenanceTicksToday === "number") {
    parts.push(`ticks=${input.maintenanceTicksToday}`);
  }

  parts.push(input.discordReadOnly ? "discord=read" : "discord=off");
  parts.push(input.hermesBackendEnabled ? "hermes=on" : "hermes=off");

  if (input.zoneTests && input.zoneTests !== "unknown") {
    parts.push(`zone=${input.zoneTests}`);
  }

  return clampPreview(parts.join(" "));
}

/**
 * Map briefing to allowlisted phrase only — never invent free-form speech.
 */
export function resolveDevStatusSpeakPhrase(
  input: DevStatusBriefingInput
): SecretaryAllowlistPhrase | null {
  const preview = buildDevStatusRedactedPreview(input);
  const fromPreview = resolveSecretarySpeakPhrase(preview);
  if (fromPreview) return fromPreview;

  if (input.zoneTests === "fail") return null;
  if (input.stackchanHold) return "確認しました。";
  if (input.orchestratorDecision?.includes("GO_PREPARED")) return "了解しました。";
  if (input.maintenanceTicksToday && input.maintenanceTicksToday > 0) return "確認しました。";

  return "了解しました。";
}

export function buildDevStatusBriefing(input: DevStatusBriefingInput): DevStatusBriefingResult {
  const redactedPreview = buildDevStatusRedactedPreview(input);
  const hints: string[] = [];

  if (input.hermesBackendEnabled) {
    hints.push("hermes_backend_on: subscription phase expects off");
  }
  if (input.zoneTests === "fail") {
    hints.push("zone_tests_fail: hold autonomous dev ticks");
  }
  if (input.stackchanHold) {
    hints.push("stackchan_hold: voice G pending human visual check");
  }

  return {
    redactedPreview,
    speakPhrase: resolveDevStatusSpeakPhrase(input),
    hints
  };
}

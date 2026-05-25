import type { ShikishimaAgentId, ReasoningLevelLabel } from "./model-assignment-registry";
import type { ProfilePolicy } from "./profile-policy";
import { applyProfilePhrasePolicy, checkProfileCompliance } from "./profile-policy";

export interface ResponsePolicyInput {
  responseId: string;
  agentId: ShikishimaAgentId;
  fullResponse: string;
  requestedSpokenResponse?: string;
  reasoningLevel: ReasoningLevelLabel;
  emotion?: string;
  voiceSpeed?: number;
  maxSpeechChars?: number;
  profilePolicy?: ProfilePolicy;
}

export interface ResponsePolicyResult {
  responseId: string;
  agentId: ShikishimaAgentId;
  fullResponse: string;
  spokenResponse: string;
  spokenAllowed: boolean;
  reasoningLevelLabel: ReasoningLevelLabel;
  emotion: string;
  voiceSpeed: number;
  maxSpeechChars: number;
  requiresHumanGo: boolean;
  redactionPassed: boolean;
  profileCompliancePassed: boolean;
  phrasePolicyChanged: boolean;
  phrasePolicyReplacements: readonly string[];
  blockedReason?: string;
}

const DEFAULT_MAX_SPEECH_CHARS = 80;
const SAFE_ERROR_SPEECH = "いまは応答を安全確認中です。";

function redactLocalValues(text: string): string {
  return text
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[redacted-address]")
    .replace(/\b[A-Za-z0-9_-]{24,}\b/g, "[redacted-token]");
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function limitSpeech(text: string, maxChars: number): string {
  const clean = collapseWhitespace(text);
  if (clean.length <= maxChars) return clean;
  return clean.slice(0, Math.max(0, maxChars - 1)) + "…";
}

function looksLikeRawError(text: string): boolean {
  return /\b(stack trace|traceback|error:|exception|enoent|eaddrinuse)\b/i.test(text);
}

export function createResponsePolicy(input: ResponsePolicyInput): ResponsePolicyResult {
  const maxSpeechChars = input.maxSpeechChars ?? DEFAULT_MAX_SPEECH_CHARS;
  const baseSpoken = input.requestedSpokenResponse ?? input.fullResponse;
  const redactedSpoken = redactLocalValues(baseSpoken);
  const redactedFull = redactLocalValues(input.fullResponse);
  const redactionPassed = redactedSpoken === baseSpoken && redactedFull === input.fullResponse;

  if (looksLikeRawError(baseSpoken)) {
    return {
      responseId: input.responseId,
      agentId: input.agentId,
      fullResponse: redactedFull,
      spokenResponse: SAFE_ERROR_SPEECH,
      spokenAllowed: false,
      reasoningLevelLabel: input.reasoningLevel,
      emotion: input.emotion ?? "caution",
      voiceSpeed: input.voiceSpeed ?? 1.0,
      maxSpeechChars,
      requiresHumanGo: true,
      redactionPassed,
      profileCompliancePassed: false,
      phrasePolicyChanged: false,
      phrasePolicyReplacements: [],
      blockedReason: "raw_error_like_text",
    };
  }

  const phrasePolicy = input.profilePolicy
    ? applyProfilePhrasePolicy(redactedSpoken, input.profilePolicy)
    : { text: redactedSpoken, changed: false, blockedPhrases: [], replacements: [] };
  const limitedSpeech = limitSpeech(phrasePolicy.text, maxSpeechChars);
  const profileCompliance = input.profilePolicy
    ? checkProfileCompliance(redactedFull, input.profilePolicy)
    : { ok: true };

  return {
    responseId: input.responseId,
    agentId: input.agentId,
    fullResponse: redactedFull,
    spokenResponse: limitedSpeech,
    spokenAllowed: Boolean(profileCompliance.ok && limitedSpeech.length > 0),
    reasoningLevelLabel: input.reasoningLevel,
    emotion: input.emotion ?? "normal",
    voiceSpeed: input.voiceSpeed ?? 1.0,
    maxSpeechChars,
    requiresHumanGo: true,
    redactionPassed,
    profileCompliancePassed: profileCompliance.ok,
    phrasePolicyChanged: phrasePolicy.changed,
    phrasePolicyReplacements: phrasePolicy.replacements,
    blockedReason: profileCompliance.ok ? undefined : "profile_policy_blocked",
  };
}

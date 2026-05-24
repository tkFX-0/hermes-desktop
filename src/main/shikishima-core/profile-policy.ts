export interface ProfileCorrection {
  phrase: string;
  reason: string;
  updatedAt: string;
}

export interface ProfilePolicy {
  identityProfile: string;
  speakingStyle: string;
  forbiddenPhrases: readonly string[];
  forbiddenTopics: readonly string[];
  requiredDisclaimers: readonly string[];
  stackchanSpeechStyle: string;
  discordReplyStyle: string;
  fxStyle: string;
  lastUserCorrections: readonly ProfileCorrection[];
  priority: readonly string[];
  updatedAt: string;
}

export interface ProfileComplianceResult {
  ok: boolean;
  blockedPhrases: readonly string[];
  blockedTopics: readonly string[];
}

export function createDefaultProfilePolicy(nowLabel = "2026-05-24"): ProfilePolicy {
  return {
    identityProfile: "Shikishima agent team controller",
    speakingStyle: "warm, concise, Japanese-first, safety-aware",
    forbiddenPhrases: [],
    forbiddenTopics: [],
    requiredDisclaimers: [
      "Level 5 actions require explicit human GO",
      "productionReady remains false",
      "execution remains disabled",
    ],
    stackchanSpeechStyle: "short, safe, redacted, no raw errors",
    discordReplyStyle: "clear status first, no secrets, no raw local values",
    fxStyle: "observation and thesis only; no trade execution",
    lastUserCorrections: [],
    priority: [
      "hard_safety_policy",
      "current_human_correction",
      "explicit_profile_settings",
      "long_term_memory",
      "persona_flavor",
      "model_default_behavior",
    ],
    updatedAt: nowLabel,
  };
}

export function addForbiddenPhraseCorrection(
  policy: ProfilePolicy,
  phrase: string,
  reason: string,
  nowLabel = "2026-05-24",
): ProfilePolicy {
  const normalizedPhrase = phrase.trim();
  if (!normalizedPhrase) return policy;

  const forbiddenPhrases = new Set(policy.forbiddenPhrases);
  forbiddenPhrases.add(normalizedPhrase);

  return {
    ...policy,
    forbiddenPhrases: Array.from(forbiddenPhrases),
    lastUserCorrections: [
      ...policy.lastUserCorrections,
      { phrase: normalizedPhrase, reason, updatedAt: nowLabel },
    ],
    updatedAt: nowLabel,
  };
}

export function checkProfileCompliance(
  text: string,
  policy: ProfilePolicy,
): ProfileComplianceResult {
  const normalizedText = text.toLowerCase();
  const blockedPhrases = policy.forbiddenPhrases.filter((phrase) =>
    normalizedText.includes(phrase.toLowerCase()),
  );
  const blockedTopics = policy.forbiddenTopics.filter((topic) =>
    normalizedText.includes(topic.toLowerCase()),
  );

  return {
    ok: blockedPhrases.length === 0 && blockedTopics.length === 0,
    blockedPhrases,
    blockedTopics,
  };
}

export function buildProfileInstruction(policy: ProfilePolicy): string {
  const corrections = policy.lastUserCorrections
    .map((correction) => `- Do not say "${correction.phrase}" (${correction.reason})`)
    .join("\n");

  return [
    "[ProfilePolicy]",
    `identity: ${policy.identityProfile}`,
    `speaking_style: ${policy.speakingStyle}`,
    `stackchan_speech_style: ${policy.stackchanSpeechStyle}`,
    `discord_reply_style: ${policy.discordReplyStyle}`,
    `fx_style: ${policy.fxStyle}`,
    "priority: hard safety > current human correction > profile > memory > persona > model defaults",
    corrections ? "[Current human corrections]\n" + corrections : "[Current human corrections]\n- none",
    "[Required disclaimers]",
    ...policy.requiredDisclaimers.map((item) => `- ${item}`),
  ].join("\n");
}

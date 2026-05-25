import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

const DEFAULT_POLICY_PATH = resolve(process.cwd(), ".shikishima-memory", "secretary-profile-policy.json");
const DEFAULT_SAFE_FALLBACK = "いまは安全に言い換えて確認中です。";
const DEFAULT_REPLACEMENT = "別の言い方にします。";

export function createDefaultSecretaryProfilePolicy() {
  return {
    version: 1,
    maxSpeechChars: 80,
    forbiddenPhraseRules: [],
    rawErrorFallback: DEFAULT_SAFE_FALLBACK,
  };
}

export function loadSecretaryProfilePolicy(policyPath = DEFAULT_POLICY_PATH) {
  if (!existsSync(policyPath)) return createDefaultSecretaryProfilePolicy();
  try {
    const raw = JSON.parse(readFileSync(policyPath, "utf-8"));
    return {
      ...createDefaultSecretaryProfilePolicy(),
      ...raw,
      forbiddenPhraseRules: Array.isArray(raw.forbiddenPhraseRules) ? raw.forbiddenPhraseRules : [],
    };
  } catch {
    return createDefaultSecretaryProfilePolicy();
  }
}

export function saveSecretaryProfilePolicy(policy, policyPath = DEFAULT_POLICY_PATH) {
  mkdirSync(dirname(policyPath), { recursive: true });
  writeFileSync(policyPath, JSON.stringify(policy, null, 2) + "\n", "utf-8");
  return { ok: true, policyPath: "[local-secretary-profile-policy]" };
}

export function addSecretaryForbiddenPhrase({
  phrase,
  reason = "human correction",
  replacement = DEFAULT_REPLACEMENT,
  severity = "hard",
  policyPath = DEFAULT_POLICY_PATH,
}) {
  const normalizedPhrase = String(phrase ?? "").trim();
  if (!normalizedPhrase) return { ok: false, reason: "empty_phrase" };
  const policy = loadSecretaryProfilePolicy(policyPath);
  const existing = policy.forbiddenPhraseRules.filter(
    (rule) => String(rule.phrase).toLowerCase() !== normalizedPhrase.toLowerCase(),
  );
  const next = {
    ...policy,
    forbiddenPhraseRules: [
      ...existing,
      { phrase: normalizedPhrase, reason, replacement, severity },
    ],
  };
  saveSecretaryProfilePolicy(next, policyPath);
  return { ok: true, policy: next };
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function redactSecretaryLocalValues(text) {
  return String(text)
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[redacted-address]")
    .replace(/\b[A-Za-z0-9_-]{24,}\b/g, "[redacted-token]");
}

export function looksLikeSecretaryRawError(text) {
  return /\b(stack trace|traceback|error:|exception|enoent|eaddrinuse)\b/i.test(String(text));
}

export function applySecretaryPhrasePolicy(text, policy = loadSecretaryProfilePolicy()) {
  let filtered = String(text);
  const blockedPhrases = [];
  const replacements = [];

  for (const rule of policy.forbiddenPhraseRules ?? []) {
    const phrase = String(rule.phrase ?? "").trim();
    if (!phrase) continue;
    const replacement = String(rule.replacement ?? DEFAULT_REPLACEMENT);
    const pattern = new RegExp(escapeRegExp(phrase), "gi");
    if (!pattern.test(filtered)) continue;
    blockedPhrases.push(phrase);
    replacements.push(replacement);
    filtered = filtered.replace(pattern, replacement);
  }

  return {
    text: filtered,
    changed: filtered !== String(text),
    blockedPhrases,
    replacements,
  };
}

function collapseWhitespace(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

function limitSpeech(text, maxChars) {
  const clean = collapseWhitespace(text);
  if (clean.length <= maxChars) return clean;
  return clean.slice(0, Math.max(0, maxChars - 3)) + "...";
}

export function prepareSecretarySpeech(text, {
  policy = loadSecretaryProfilePolicy(),
  maxSpeechChars,
} = {}) {
  const redacted = redactSecretaryLocalValues(text);
  if (looksLikeSecretaryRawError(redacted)) {
    return {
      spokenText: policy.rawErrorFallback || DEFAULT_SAFE_FALLBACK,
      spokenAllowed: true,
      changed: true,
      redactionPassed: redacted === String(text),
      blockedReason: "raw_error_like_text",
      blockedPhrases: [],
    };
  }

  const phrase = applySecretaryPhrasePolicy(redacted, policy);
  return {
    spokenText: limitSpeech(phrase.text, maxSpeechChars ?? policy.maxSpeechChars ?? 80),
    spokenAllowed: phrase.text.trim().length > 0,
    changed: phrase.changed || redacted !== String(text),
    redactionPassed: redacted === String(text),
    blockedReason: undefined,
    blockedPhrases: phrase.blockedPhrases,
  };
}


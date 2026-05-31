/**
 * Phase E1 — map secretary redacted preview → guarded StackChan phrase (allowlist only).
 */

export const SECRETARY_VOICE_PHRASE_ALLOWLIST = [
  "よろしく。",
  "了解しました。",
  "承知しました。",
  "確認しました。",
  "おはようございます。"
] as const;

export type SecretaryAllowlistPhrase = (typeof SECRETARY_VOICE_PHRASE_ALLOWLIST)[number];

export function isAllowlistedSecretaryPhrase(text: string): text is SecretaryAllowlistPhrase {
  return (SECRETARY_VOICE_PHRASE_ALLOWLIST as readonly string[]).includes(text);
}

/** Returns allowlisted phrase or null if no safe match. */
export function resolveSecretarySpeakPhrase(redactedPreview: string): SecretaryAllowlistPhrase | null {
  const trimmed = redactedPreview.trim().slice(0, 28);
  if (!trimmed) return "了解しました。";
  if (isAllowlistedSecretaryPhrase(trimmed)) return trimmed;

  if (/承知/u.test(trimmed)) return "承知しました。";
  if (/了解|わかり/u.test(trimmed)) return "了解しました。";
  if (/確認/u.test(trimmed)) return "確認しました。";
  if (/おはよう|おやすみ/u.test(trimmed)) return "おはようございます。";
  if (/よろしく/u.test(trimmed)) return "よろしく。";

  return null;
}

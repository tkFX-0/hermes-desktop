import type { StackChanVoiceIntent } from "../../shared/stackchan-voice-preview/stackchan-voice-preview-types";

/** Fixed allowlist phrases — never take free-form user text in pilot path. */
const PHRASES: Record<StackChanVoiceIntent, string> = {
  STACKCHAN_VOICE_PILOT_ACK: "\u3088\u3046\u3057\u304f\u3002"
};

export type VoicePhraseMapResult =
  | { ok: true; phraseId: string }
  | { ok: false; reason: string };

export function mapVoiceIntentToPhraseId(intent: StackChanVoiceIntent): VoicePhraseMapResult {
  if (!PHRASES[intent]) return { ok: false, reason: "phrase_not_mapped" };
  return { ok: true, phraseId: intent };
}

export function resolveGuardedVoicePhrase(intent: StackChanVoiceIntent): string {
  return PHRASES[intent];
}

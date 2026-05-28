/**
 * @deprecated Use stackchan-voice-production-speak (stackchanSay parity).
 */
export type GuardedVoiceSpeakResult = { ok: true } | { ok: false; errorCode: string };

export { speakProductionVoiceOnce as speakGuardedVoiceOnce } from "./stackchan-voice-production-speak";

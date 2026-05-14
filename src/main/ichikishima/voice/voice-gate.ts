import type { VoiceConfig } from "./voice-config";

export type VoiceGateResult =
  | { allowed: true }
  | { allowed: false; reason: string };

export function checkVoiceGate(
  config: VoiceConfig,
  action: "tts" | "stt" | "activate",
): VoiceGateResult {
  if (config.status === "not_approved") {
    return {
      allowed: false,
      reason: "Voice is not approved. Requires explicit human GO.",
    };
  }

  if (config.status === "design_only") {
    return {
      allowed: false,
      reason: "Voice is in design-only mode. Implementation not yet approved.",
    };
  }

  if (action === "stt" && !config.sttEnabled) {
    return { allowed: false, reason: "STT is disabled in config" };
  }

  if (action === "tts" && !config.ttsEnabled) {
    return { allowed: false, reason: "TTS is disabled in config" };
  }

  if (action === "activate" && !config.userTriggeredOnly) {
    return {
      allowed: false,
      reason: "Voice activation must be user-triggered only",
    };
  }

  return { allowed: true };
}

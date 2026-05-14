import type { VoiceConfig } from "./voice-config";
import { checkVoiceGate } from "./voice-gate";

export interface TtsRequest {
  text: string;
  speakerId?: number;
}

export interface TtsResult {
  success: boolean;
  audioPath?: string;
  message?: string;
}

export async function speakText(
  config: VoiceConfig,
  request: TtsRequest,
): Promise<TtsResult> {
  const gate = checkVoiceGate(config, "tts");
  if (!gate.allowed) {
    return { success: false, message: gate.reason };
  }

  if (!request.text.trim()) {
    return { success: false, message: "Empty text" };
  }

  if (config.ttsProvider === "voicevox") {
    return speakVoicevox(config, request);
  }

  return { success: false, message: `TTS provider not implemented: ${config.ttsProvider}` };
}

async function speakVoicevox(
  config: VoiceConfig,
  request: TtsRequest,
): Promise<TtsResult> {
  try {
    const queryRes = await fetch(
      `${config.ttsBaseUrl}/audio_query?text=${encodeURIComponent(request.text)}&speaker=${request.speakerId ?? 1}`,
      { method: "POST" },
    );
    if (!queryRes.ok) {
      return { success: false, message: `VOICEVOX query failed: ${queryRes.status}` };
    }
    const query = await queryRes.json();

    const synthRes = await fetch(
      `${config.ttsBaseUrl}/synthesis?speaker=${request.speakerId ?? 1}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      },
    );
    if (!synthRes.ok) {
      return { success: false, message: `VOICEVOX synthesis failed: ${synthRes.status}` };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "TTS error",
    };
  }
}

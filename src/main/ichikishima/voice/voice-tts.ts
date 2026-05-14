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

// TTS用URLのバリデーション
// VOICEVOXはローカルのみ許可 (localhost / 127.0.0.1)
function validateTtsBaseUrl(url: string): { ok: true; parsed: URL } | { ok: false; reason: string } {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, reason: "Invalid URL format" };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, reason: "Only http/https allowed for TTS" };
  }

  const host = parsed.hostname.toLowerCase();
  // VOICEVOXはローカルのみ。127.0.0.1 / localhost のみ許可
  if (host !== "localhost" && host !== "127.0.0.1") {
    return { ok: false, reason: `TTS base URL must be localhost. Got: ${host}` };
  }

  return { ok: true, parsed };
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
    const urlCheck = validateTtsBaseUrl(config.ttsBaseUrl);
    if (!urlCheck.ok) {
      return { success: false, message: urlCheck.reason };
    }
    return speakVoicevox(config, request);
  }

  return { success: false, message: `TTS provider not implemented: ${config.ttsProvider}` };
}

async function speakVoicevox(
  config: VoiceConfig,
  request: TtsRequest,
): Promise<TtsResult> {
  const urlCheck = validateTtsBaseUrl(config.ttsBaseUrl);
  if (!urlCheck.ok) {
    return { success: false, message: urlCheck.reason };
  }
  const base = config.ttsBaseUrl.replace(/\/+$/, "");

  try {
    const queryRes = await fetch(
      `${base}/audio_query?text=${encodeURIComponent(request.text)}&speaker=${request.speakerId ?? 1}`,
      { method: "POST" },
    );
    if (!queryRes.ok) {
      return { success: false, message: `VOICEVOX query failed: ${queryRes.status}` };
    }
    const query = await queryRes.json();

    const synthRes = await fetch(
      `${base}/synthesis?speaker=${request.speakerId ?? 1}`,
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

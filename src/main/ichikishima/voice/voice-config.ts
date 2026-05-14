export type VoiceStatus = "not_approved" | "design_only" | "approved" | "active";
export type TtsProvider = "voicevox" | "openai" | "none";
export type SttProvider = "whisper_local" | "openai_whisper" | "none";

export interface VoiceConfig {
  status: VoiceStatus;
  ttsProvider: TtsProvider;
  sttProvider: SttProvider;
  ttsBaseUrl: string;
  ttsEnabled: boolean;
  sttEnabled: boolean;
  autoActivate: boolean;
  userTriggeredOnly: boolean;
}

export const VOICE_DEFAULT_CONFIG: VoiceConfig = {
  status: "not_approved",
  ttsProvider: "none",
  sttProvider: "none",
  ttsBaseUrl: "http://localhost:50021",
  ttsEnabled: false,
  sttEnabled: false,
  autoActivate: false,
  userTriggeredOnly: true,
};

export const VOICE_SAFETY_RULES = {
  noAutoRecording: true,
  noAutoTransmission: true,
  userTriggeredOnly: true,
  noRawAudioStorage: true,
  noSecretInSpeech: true,
} as const;

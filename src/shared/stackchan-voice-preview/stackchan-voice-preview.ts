import type { StackChanVoiceIntent, StackChanVoicePreview } from "./stackchan-voice-preview-types";

const PREVIEWS: Record<StackChanVoiceIntent, StackChanVoicePreview> = {
  STACKCHAN_VOICE_PILOT_ACK: {
    intent: "STACKCHAN_VOICE_PILOT_ACK",
    label: "Pilot acknowledgment (fixed phrase)",
    phraseId: "pilot_ack"
  }
};

export function isStackChanVoiceIntent(value: string): value is StackChanVoiceIntent {
  return Object.prototype.hasOwnProperty.call(PREVIEWS, value);
}

export function createStackChanVoicePreview(intent: StackChanVoiceIntent): StackChanVoicePreview {
  return PREVIEWS[intent];
}

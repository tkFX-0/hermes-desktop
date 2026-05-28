export type StackChanVoiceIntent = "STACKCHAN_VOICE_PILOT_ACK";

export type StackChanVoicePreview = {
  intent: StackChanVoiceIntent;
  label: string;
  phraseId: string;
};

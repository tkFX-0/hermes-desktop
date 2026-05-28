export type StackChanVoiceTransportSendResult =
  | { ok: true }
  | { ok: false; errorCode: string };

export type StackChanVoiceTransport = {
  mode: "disabled" | "mock" | "guarded-ws";
  sendVoicePhrase(phraseId: string, phrase: string): Promise<StackChanVoiceTransportSendResult>;
};

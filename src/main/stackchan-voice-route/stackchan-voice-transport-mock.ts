import type { StackChanVoiceTransport, StackChanVoiceTransportSendResult } from "./stackchan-voice-transport-types";

export type MockStackChanVoiceTransport = StackChanVoiceTransport & {
  lastPhraseId: string | null;
  sendCallCount: number;
};

export function createMockStackChanVoiceTransport(): MockStackChanVoiceTransport {
  let lastPhraseId: string | null = null;
  let sendCallCount = 0;
  return {
    mode: "mock",
    async sendVoicePhrase(phraseId: string): Promise<StackChanVoiceTransportSendResult> {
      sendCallCount += 1;
      lastPhraseId = phraseId;
      return { ok: true };
    },
    get lastPhraseId() {
      return lastPhraseId;
    },
    get sendCallCount() {
      return sendCallCount;
    }
  };
}

export function createDisabledStackChanVoiceTransport(): StackChanVoiceTransport {
  return {
    mode: "disabled",
    async sendVoicePhrase() {
      return { ok: false, errorCode: "transport_disabled" };
    }
  };
}

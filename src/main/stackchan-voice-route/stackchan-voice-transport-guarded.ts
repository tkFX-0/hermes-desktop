import { speakGuardedVoiceOnce } from "./stackchan-voice-guarded-speak";
import type { StackChanVoiceTransport, StackChanVoiceTransportSendResult } from "./stackchan-voice-transport-types";

export type GuardedVoiceTransportDeps = {
  speakOnce?: (phrase: string) => Promise<StackChanVoiceTransportSendResult>;
};

export function createGuardedWsStackChanVoiceTransport(
  deps: GuardedVoiceTransportDeps = {}
): StackChanVoiceTransport {
  const speakImpl = deps.speakOnce ?? speakGuardedVoiceOnce;
  return {
    mode: "guarded-ws",
    sendVoicePhrase(_phraseId: string, phrase: string) {
      return speakImpl(phrase);
    }
  };
}

import { describe, expect, it } from "vitest";
import { createMockStackChanVoiceTransport } from "./stackchan-voice-transport-mock";
import { sendStackChanVoiceOnce } from "./stackchan-voice-send-once";
import type { StackChanVoiceSendOnceRequest } from "./stackchan-voice-send-once-types";

const WINDOW = {
  startIso: "2026-05-28T06:00:00.000Z",
  endIso: "2026-05-28T07:00:00.000Z"
};

function ready(overrides: Partial<StackChanVoiceSendOnceRequest> = {}): StackChanVoiceSendOnceRequest {
  return {
    intent: "STACKCHAN_VOICE_PILOT_ACK",
    humanPresent: true,
    manualStopMethodConfirmed: true,
    screenVisible: true,
    timeWindow: WINDOW,
    timeWindowDeclared: true,
    activeTimeWindow: true,
    transportMode: "mock",
    actualDeviceSendEnabled: false,
    productionReady: false,
    executionEnabled: false,
    ...overrides
  };
}

describe("stackchan-voice-send-once", () => {
  it("records mock voice without device send", async () => {
    const mock = createMockStackChanVoiceTransport();
    const result = await sendStackChanVoiceOnce(ready(), mock);
    expect(result.ok).toBe(true);
    expect(result.phraseId).toBe("STACKCHAN_VOICE_PILOT_ACK");
    expect(mock.lastPhraseId).toBe("STACKCHAN_VOICE_PILOT_ACK");
  });

  it("blocks actual send without env flag", async () => {
    const prev = process.env.STACKCHAN_VOICE_PILOT_SEND;
    delete process.env.STACKCHAN_VOICE_PILOT_SEND;
    const result = await sendStackChanVoiceOnce(
      ready({ actualDeviceSendEnabled: true, transportMode: "guarded-ws" })
    );
    expect(result.reasons).toContain("voice_pilot_go_and_env_required");
    if (prev !== undefined) process.env.STACKCHAN_VOICE_PILOT_SEND = prev;
  });
});

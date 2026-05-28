import type { StackChanMotionTransport, StackChanMotionTransportSendResult } from "./stackchan-motion-transport-types";

export type MockStackChanMotionTransport = StackChanMotionTransport & {
  lastMessage: { type: string; action: string } | null;
  sendCallCount: number;
};

export function createMockStackChanMotionTransport(): MockStackChanMotionTransport {
  let lastMessage: { type: string; action: string } | null = null;
  let sendCallCount = 0;
  return {
    mode: "mock",
    async sendMovePreset(presetAction: string): Promise<StackChanMotionTransportSendResult> {
      sendCallCount += 1;
      lastMessage = { type: "move", action: presetAction };
      return { ok: true };
    },
    get lastMessage() {
      return lastMessage;
    },
    get sendCallCount() {
      return sendCallCount;
    }
  };
}

export function createDisabledStackChanMotionTransport(): StackChanMotionTransport {
  return {
    mode: "disabled",
    async sendMovePreset() {
      return { ok: false, errorCode: "transport_disabled" };
    }
  };
}

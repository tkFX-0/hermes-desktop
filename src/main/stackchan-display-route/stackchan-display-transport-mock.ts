import type {
  StackChanDisplayFaceModeMessage,
  StackChanDisplayTransport,
  StackChanDisplayTransportSendResult
} from "./stackchan-display-transport-types";

export type MockStackChanDisplayTransport = StackChanDisplayTransport & {
  readonly lastMessage: StackChanDisplayFaceModeMessage | null;
  readonly sendCallCount: number;
};

export function createMockStackChanDisplayTransport(): MockStackChanDisplayTransport {
  let lastMessage: StackChanDisplayFaceModeMessage | null = null;
  let sendCallCount = 0;

  return {
    mode: "mock",
    get lastMessage() {
      return lastMessage;
    },
    get sendCallCount() {
      return sendCallCount;
    },
    async sendFaceMode(faceMode: string): Promise<StackChanDisplayTransportSendResult> {
      sendCallCount += 1;
      lastMessage = { type: "face_mode", value: faceMode };
      return { ok: true };
    }
  };
}

export function createDisabledStackChanDisplayTransport(): StackChanDisplayTransport {
  return {
    mode: "disabled",
    async sendFaceMode(): Promise<StackChanDisplayTransportSendResult> {
      return { ok: false, errorCode: "transport_disabled" };
    }
  };
}

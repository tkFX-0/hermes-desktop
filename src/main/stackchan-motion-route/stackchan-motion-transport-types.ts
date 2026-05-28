export type StackChanMotionTransportSendResult =
  | { ok: true }
  | { ok: false; errorCode: string };

export type StackChanMotionTransport = {
  mode: "disabled" | "mock" | "guarded-ws";
  sendMovePreset(presetAction: string): Promise<StackChanMotionTransportSendResult>;
};

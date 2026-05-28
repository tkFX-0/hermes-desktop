export type StackChanDisplayFaceModeMessage = {
  type: "face_mode";
  value: string;
};

export type StackChanDisplayTransportSendResult = {
  ok: boolean;
  errorCode?: string;
};

export interface StackChanDisplayTransport {
  readonly mode: "disabled" | "mock" | "guarded-ws";
  sendFaceMode(faceMode: string): Promise<StackChanDisplayTransportSendResult>;
}

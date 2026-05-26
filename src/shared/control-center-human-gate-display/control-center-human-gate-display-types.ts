export type ControlCenterHumanGateDisplayStatus =
  | "READY_FOR_REVIEW"
  | "HOLD"
  | "REJECTED"
  | "PREVIEW_ONLY";

export type ControlCenterHumanGateDisplayItem = {
  displayId: string;
  gateId: string;
  goalId: string;
  taskId: string;
  title: string;
  status: ControlCenterHumanGateDisplayStatus;
  summary: string;
  reasons: string[];
  requiredHumanGates: string[];
  displayOnly: true;
  uiConnected: false;
  ipcConnected: false;
  actualQueueMutation: false;
  canApproveProceed: boolean;
  canApproveCommit: boolean;
  canApprovePush: false;
  canApproveRuntime: false;
  canApproveExternalWrite: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type IphoneHumanGateDisplayStatus =
  | "READY_FOR_REVIEW"
  | "HOLD"
  | "REJECTED"
  | "PREVIEW_ONLY";

export type IphoneHumanGateDisplaySection = {
  id: string;
  label: string;
  lines: string[];
};

export type IphoneHumanGateDisplayItem = {
  displayId: string;
  gateId: string;
  goalId: string;
  taskId: string;
  title: string;
  status: IphoneHumanGateDisplayStatus;
  summary: string;
  reasons: string[];
  requiredHumanGates: string[];
  compactTitle: string;
  primaryStatusLabel: string;
  safetyChips: string[];
  mobileSections: IphoneHumanGateDisplaySection[];
  recommendedHumanActionLabel: string;
  displayOnly: true;
  mobileReady: true;
  uiConnected: false;
  ipcConnected: false;
  networkExposed: false;
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

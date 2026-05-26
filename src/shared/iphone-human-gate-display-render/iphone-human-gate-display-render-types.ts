export type IphoneHumanGateDisplayRenderStatusTone = "preview" | "review" | "hold" | "rejected";

export type IphoneHumanGateDisplayRenderSection = {
  id: string;
  label: string;
  lines: string[];
};

export type IphoneHumanGateDisplayRenderModel = {
  surface: "iphone-private-console-readonly";
  displayOnly: true;
  mobileReady: true;
  layout: "human-gate-review-card";
  displayId: string;
  goalId: string;
  taskId: string;
  gateId: string;
  title: string;
  compactTitle: string;
  status: string;
  primaryStatusLabel: string;
  statusTone: IphoneHumanGateDisplayRenderStatusTone;
  summary: string;
  sections: IphoneHumanGateDisplayRenderSection[];
  safetyChips: string[];
  requiredHumanGateLabels: string[];
  recommendedHumanActionLabel: string;
  footerNotice: string;
  uiConnected: false;
  ipcConnected: false;
  networkExposed: false;
  actualQueueMutation: false;
  canApprovePush: false;
  canApproveRuntime: false;
  canApproveExternalWrite: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

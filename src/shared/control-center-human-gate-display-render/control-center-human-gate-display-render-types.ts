export type ControlCenterHumanGateDisplayRenderStatusTone =
  | "preview"
  | "review"
  | "hold"
  | "rejected";

export type ControlCenterHumanGateDisplayRenderSummaryBlock = {
  id: string;
  label: string;
  lines: string[];
};

export type ControlCenterHumanGateDisplayRenderReasonRow = {
  id: string;
  text: string;
};

export type ControlCenterHumanGateDisplayRenderModel = {
  surface: "control-center-readonly";
  displayOnly: true;
  layout: "human-gate-review-panel";
  goalId: string;
  taskId: string;
  gateId: string;
  title: string;
  subtitle: string;
  status: string;
  statusLabel: string;
  statusTone: ControlCenterHumanGateDisplayRenderStatusTone;
  summary: string;
  summaryBlocks: ControlCenterHumanGateDisplayRenderSummaryBlock[];
  safetyChips: string[];
  requiredHumanGateLabels: string[];
  reasonRows: ControlCenterHumanGateDisplayRenderReasonRow[];
  recommendedHumanActionLabel: string;
  footerNotice: string;
  uiConnected: false;
  ipcConnected: false;
  actualQueueMutation: false;
  canApprovePush: false;
  canApproveRuntime: false;
  canApproveExternalWrite: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

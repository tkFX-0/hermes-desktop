export type HumanGateReportStatus =
  | "READY_FOR_HUMAN_REVIEW"
  | "HOLD"
  | "REJECTED"
  | "PASS_PREVIEW_ONLY";

export type HumanGateActionKind =
  | "review"
  | "approve_push"
  | "approve_commit"
  | "approve_runtime"
  | "approve_external_write"
  | "reject"
  | "hold";

export type HumanGateReport = {
  gateId: string;
  goalId: string;
  taskId: string;
  title: string;
  status: HumanGateReportStatus;
  summary: string;
  requestedAction: HumanGateActionKind;
  canHumanApproveProceed: boolean;
  canHumanApproveCommit: boolean;
  canHumanApprovePush: false;
  canHumanApproveRuntime: false;
  canHumanApproveExternalWrite: false;
  requiredHumanGates: string[];
  reasons: string[];
  sourceDecision: string;
  safety: {
    productionReady: false;
    execution: "disabled";
    rawValuesReported: false;
    runtimeStarted: false;
    externalWrite: false;
    uiConnected: false;
    ipcConnected: false;
  };
  redacted: true;
};

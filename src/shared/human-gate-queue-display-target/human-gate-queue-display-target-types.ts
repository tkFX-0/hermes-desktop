export type HumanGateQueueDisplayTargetStatus =
  | "READY_FOR_REVIEW"
  | "HOLD"
  | "REJECTED"
  | "PREVIEW_ONLY";

export type HumanGateQueueDisplayTargetItem = {
  queueItemId: string;
  gateId: string;
  goalId: string;
  taskId: string;
  title: string;
  status: HumanGateQueueDisplayTargetStatus;
  summary: string;
  requestedAction: string;
  canApproveProceed: boolean;
  canApproveCommit: boolean;
  canApprovePush: false;
  canApproveRuntime: false;
  canApproveExternalWrite: false;
  requiredHumanGates: string[];
  reasons: string[];
  sourceReportStatus: string;
  display: {
    target: "repo-local-human-gate-queue-markdown";
    markdownReady: true;
    uiReady: false;
    ipcReady: false;
    actualQueueMutation: false;
  };
  safety: {
    productionReady: false;
    execution: "disabled";
    rawValuesReported: false;
    runtimeStarted: false;
    externalWrite: false;
    uiConnected: false;
    ipcConnected: false;
    obsidianActualWrite: false;
    discordSend: false;
    stackchanConnection: false;
  };
  redacted: true;
};

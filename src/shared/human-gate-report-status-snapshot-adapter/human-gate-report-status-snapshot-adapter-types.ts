import type { HumanGateReport } from "../human-gate-report/human-gate-report-types";
import type { HumanGateStatusSnapshot } from "../human-gate-status-snapshot/human-gate-status-snapshot-types";

export type HumanGateReportStatusSnapshotAdapterStatus =
  | "REVIEW_READY_CANDIDATE"
  | "HOLD"
  | "BLOCKED";

export type HumanGateReportStatusSnapshotAdapterSafety = {
  adapterOnly: true;
  reviewOnly: true;
  draftOnly: true;
  displayOnly: true;
  sendReady: false;
  maySendNow: false;
  actualDiscordSend: false;
  executorImplemented: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  externalWrite: false;
  runtimeStarted: false;
  actualQueueMutation: false;
  fileWriteReady: false;
  humanGateQueueDocModified: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type HumanGateReportStatusSnapshotAdapterInput = {
  surface: "human-gate-report-status-snapshot-adapter-input";
  humanGateReport: HumanGateReport;
  title?: string;
  humanGoReference?: string;
  sourceOfTruth?: "ledger";
  primaryDisplaySurface?: "discord";
  fallbackDisplaySurface?: "control-center";
  redacted: true;
};

export type HumanGateReportStatusSnapshotAdapterResult = {
  surface: "human-gate-report-status-snapshot-adapter-result";
  adapterOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: HumanGateReportStatusSnapshotAdapterStatus;
  snapshot: HumanGateStatusSnapshot;
  source: {
    humanGateReportStatus: string;
    snapshotStatus: string;
    sourceOfTruth: "ledger";
    primaryDisplaySurface: "discord";
    fallbackDisplaySurface: "control-center";
    humanGoReference?: string;
  };
  caveats: string[];
  safety: HumanGateReportStatusSnapshotAdapterSafety;
};

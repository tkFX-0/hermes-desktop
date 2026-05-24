export type OperationActionKind =
  | "local_draft"
  | "discord_read"
  | "discord_write"
  | "obsidian_write"
  | "x_search"
  | "hermes_cli"
  | "claude_code"
  | "stackchan_say"
  | "stackchan_motion"
  | "stackchan_camera"
  | "stt_server"
  | "runtime_start"
  | "production_ready"
  | "execution_enable"
  | "fx_thesis"
  | "debate";

export interface OperationLedgerEntry {
  operationId: string;
  source: "renderer" | "discord" | "stackchan" | "sidebot" | "schedule" | "human" | "system";
  agentId: string;
  modelId: string;
  gateId: string;
  humanGoTicket?: string;
  actionKind: OperationActionKind;
  inputSummary: string;
  outputSummary: string;
  externalWrite: boolean;
  deviceAction: boolean;
  runtimeStarted: boolean;
  runCount: number;
  gateRestoredHold: boolean;
  evidenceFile: string;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
}

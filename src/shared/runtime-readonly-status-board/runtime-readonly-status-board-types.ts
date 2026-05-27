import type { ControlledAutonomyProposal } from "../external-action-controlled-autonomy/external-action-controlled-autonomy-types";
import type { ExternalActionRouteState } from "../external-action-controlled-autonomy/external-action-controlled-autonomy-types";
import type { FinalOperatorReviewBundle } from "../final-operator-review-bundle/final-operator-review-bundle-types";
import type { OperatorHandoffDailyQueuePreview } from "../operator-handoff-daily-queue-preview/operator-handoff-daily-queue-preview-types";

export type RuntimeReadonlyStatusBoardOverallStatus =
  | "READY_FOR_HUMAN_REVIEW"
  | "HOLD"
  | "BLOCKED"
  | "MIXED";

export type RuntimeReadonlyStatusBoardSectionStatus =
  | "READY_FOR_HUMAN_REVIEW"
  | "HOLD"
  | "BLOCKED"
  | "MIXED"
  | "PASS"
  | "PASS_WITH_CAVEAT"
  | "NOT_STARTED";

export type RuntimeReadonlyStatusBoardSectionId =
  | "operator_review"
  | "human_gate_queue"
  | "discord_send"
  | "external_action_guard"
  | "runtime"
  | "production";

export type RuntimeReadonlySafetyState = {
  productionReady: false;
  execution: "disabled";
  runtimeStarted: false;
  actualDiscordSend: false;
  tokenRead: false;
  networkCall: false;
  externalApiWrite: false;
  obsidianWrite: false;
  stackChanConnected: false;
  rawValuesReported: false;
  redacted: true;
};

export type RuntimeReadonlyStatusBoardSafety = RuntimeReadonlySafetyState & {
  readonlyOnly: true;
  displayOnly: true;
  ipcConnected: boolean;
  preloadExposed: boolean;
  rendererWired: boolean;
  reactUiImplemented: boolean;
};

export type RuntimeReadonlyStatusBoardInput = {
  surface: "runtime-readonly-status-board-input";
  finalOperatorReviewBundle: FinalOperatorReviewBundle;
  dailyQueuePreview: OperatorHandoffDailyQueuePreview;
  externalActionRoutes: ExternalActionRouteState[];
  controlledAutonomyProposal: ControlledAutonomyProposal;
  generatedAtLabel?: string;
  redacted: true;
};

export type RuntimeReadonlyStatusBoardSection = {
  id: RuntimeReadonlyStatusBoardSectionId;
  title: string;
  status: RuntimeReadonlyStatusBoardSectionStatus;
  summary: string;
  nextAction?: string;
  requiresExplicitHumanGo: boolean;
};

export type RuntimeReadonlyStatusBoardRouteSummary = {
  routeId: string;
  status: string;
  effectClass: string;
  requiresExplicitHumanGo: true;
  actualExecutionCount: number;
};

export type RuntimeReadonlyStatusBoardSnapshot = {
  surface: "runtime-readonly-status-board-snapshot";
  readonlyOnly: true;
  displayOnly: true;
  status: RuntimeReadonlyStatusBoardOverallStatus;
  generatedAtLabel: string;
  sections: RuntimeReadonlyStatusBoardSection[];
  routeSummary: RuntimeReadonlyStatusBoardRouteSummary[];
  recommendedHumanAction: string;
  markdown: string;
  safety: RuntimeReadonlyStatusBoardSafety;
};

export type RuntimeReadonlyStatusBoardViewModelTone =
  | "ready"
  | "hold"
  | "blocked"
  | "neutral";

export type RuntimeReadonlyStatusBoardIpcResult = {
  ok: boolean;
  snapshot: RuntimeReadonlyStatusBoardSnapshot;
  errorKind?: "REDACTED_STATUS_BOARD_PROVIDER_ERROR";
};

export type RuntimeReadonlyStatusBoardViewModel = {
  surface: "runtime-readonly-status-board-view-model";
  readonlyOnly: true;
  displayOnly: true;
  title: string;
  statusChips: Array<{
    label: string;
    value: string;
    tone: RuntimeReadonlyStatusBoardViewModelTone;
  }>;
  cards: Array<{
    id: string;
    title: string;
    status: string;
    summary: string;
    nextAction?: string;
  }>;
  routeRows: Array<{
    routeId: string;
    status: string;
    effectClass: string;
    requiresHumanGo: true;
  }>;
  safetyStrip: Array<{
    label: string;
    value: string;
  }>;
};

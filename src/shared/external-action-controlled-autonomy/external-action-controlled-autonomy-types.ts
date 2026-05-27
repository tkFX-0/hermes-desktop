export type ExternalActionRouteId =
  | "discord_one_shot_send"
  | "human_gate_queue_repo_local_mutation"
  | "git_push"
  | "runtime_start"
  | "obsidian_write"
  | "external_api_write";

export type ExternalActionEffectClass =
  | "preview_only"
  | "repo_local_write"
  | "network_write"
  | "runtime_effect"
  | "remote_git_write"
  | "external_service_write";

export type ExternalActionRouteStatus =
  | "AVAILABLE_FOR_PREVIEW"
  | "DRY_RUN_READY"
  | "READY_CANDIDATE"
  | "HOLD_PENDING_LOCAL_CREDENTIALS"
  | "HOLD_PENDING_HUMAN_GO"
  | "HOLD_PENDING_IMPLEMENTATION"
  | "BLOCKED"
  | "EXECUTED_ONCE"
  | "NOT_APPROVED";

export type ExternalActionGuardDecision =
  | "ALLOW_PREVIEW"
  | "ALLOW_REPO_LOCAL_ONE_SHOT"
  | "ALLOW_EXTERNAL_ONE_SHOT"
  | "HOLD_NEEDS_HUMAN_GO"
  | "HOLD_NEEDS_LOCAL_CREDENTIALS"
  | "HOLD_NEEDS_IMPLEMENTATION"
  | "REJECT_UNSCOPED"
  | "REJECT_UNSAFE";

export type ExternalActionRequestedAction =
  | "preview"
  | "dry_run"
  | "repo_local_one_shot"
  | "external_one_shot";

export type ExternalActionRouteState = {
  surface: "external-action-route-state";
  routeId: ExternalActionRouteId;
  label: string;
  effectClass: ExternalActionEffectClass;
  status: ExternalActionRouteStatus;
  implemented: boolean;
  actualExecutionCount: number;
  maxExecutionCountWithoutNewGo: 0 | 1;
  requiresExplicitHumanGo: true;
  requiresLocalCredentials: boolean;
  redacted: true;
};

export type ExternalActionGuardInput = {
  surface: "external-action-guard-input";
  route: ExternalActionRouteState;
  requestedAction: ExternalActionRequestedAction;
  humanGoReference?: string;
  localCredentialPresence?: {
    available: boolean;
    labelOnly: true;
  };
  redacted: true;
};

export type ExternalActionGuardResultSafety = {
  guardOnly: true;
  previewOnlyUnlessExplicitlyAllowed: true;
  actualDiscordSend: false;
  externalApiWrite: false;
  networkCall: false;
  repoLocalWrite: boolean;
  runtimeStarted: false;
  gitPushPerformed: false;
  obsidianWrite: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type ExternalActionGuardResult = {
  surface: "external-action-guard-result";
  routeId: ExternalActionRouteId;
  decision: ExternalActionGuardDecision;
  mayPreview: boolean;
  mayDryRun: boolean;
  mayExecuteRepoLocalOneShot: boolean;
  mayExecuteExternalOneShot: boolean;
  requiresExplicitHumanGo: true;
  reasons: string[];
  safety: ExternalActionGuardResultSafety;
};

export type ControlledActionPlan = {
  routeId: ExternalActionRouteId;
  requestedAction: ExternalActionRequestedAction;
  guardDecision: ExternalActionGuardDecision;
  mayExecuteNow: boolean;
  requiresExplicitHumanGo: true;
  reasonSummary: string;
};

export type ControlledAutonomyProposalStatus =
  | "READY_FOR_HUMAN_REVIEW"
  | "HOLD"
  | "BLOCKED"
  | "MIXED";

export type ControlledAutonomyProposalSafety = {
  proposalOnly: true;
  actualExecution: false;
  actualDiscordSend: false;
  externalApiWrite: false;
  networkCall: false;
  runtimeStarted: false;
  productionReady: false;
  execution: "disabled";
  redacted: true;
};

export type ControlledAutonomyProposal = {
  surface: "controlled-autonomy-proposal";
  proposalOnly: true;
  actionPlans: ControlledActionPlan[];
  recommendedNextHumanAction: string;
  status: ControlledAutonomyProposalStatus;
  safety: ControlledAutonomyProposalSafety;
};

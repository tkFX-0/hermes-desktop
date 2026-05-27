import type {
  ControlledAutonomyProposal,
  ControlledAutonomyProposalStatus,
  ControlledActionPlan,
  ExternalActionEffectClass,
  ExternalActionGuardDecision,
  ExternalActionGuardInput,
  ExternalActionGuardResult,
  ExternalActionGuardResultSafety,
  ExternalActionRouteId,
  ExternalActionRouteState,
  ExternalActionRouteStatus
} from "./external-action-controlled-autonomy-types";

const BASE_SAFETY: ExternalActionGuardResultSafety = {
  guardOnly: true,
  previewOnlyUnlessExplicitlyAllowed: true,
  actualDiscordSend: false,
  externalApiWrite: false,
  networkCall: false,
  repoLocalWrite: false,
  runtimeStarted: false,
  gitPushPerformed: false,
  obsidianWrite: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

const DRY_RUN_READY_STATUSES: ExternalActionRouteStatus[] = [
  "DRY_RUN_READY",
  "READY_CANDIDATE",
  "AVAILABLE_FOR_PREVIEW"
];

const REPO_LOCAL_ONE_SHOT_STATUSES: ExternalActionRouteStatus[] = [
  "READY_CANDIDATE",
  "EXECUTED_ONCE"
];

const EXTERNAL_ONE_SHOT_EFFECTS: ExternalActionEffectClass[] = [
  "network_write",
  "external_service_write",
  "remote_git_write"
];

function hasHumanGo(input: ExternalActionGuardInput): boolean {
  return Boolean(input.humanGoReference?.trim());
}

function credentialsAvailable(input: ExternalActionGuardInput): boolean {
  return input.localCredentialPresence?.available === true;
}

function executionBudgetExceeded(
  route: ExternalActionRouteState,
  requestedAction: ExternalActionGuardInput["requestedAction"]
): boolean {
  if (
    requestedAction === "repo_local_one_shot" &&
    route.status === "EXECUTED_ONCE" &&
    route.effectClass === "repo_local_write"
  ) {
    return false;
  }

  return route.actualExecutionCount >= route.maxExecutionCountWithoutNewGo;
}

function buildResult(
  input: ExternalActionGuardInput,
  decision: ExternalActionGuardDecision,
  reasons: string[],
  overrides: Partial<ExternalActionGuardResultSafety> = {}
): ExternalActionGuardResult {
  const mayPreview = decision === "ALLOW_PREVIEW";
  const mayDryRun =
    decision === "ALLOW_PREVIEW" &&
    DRY_RUN_READY_STATUSES.includes(input.route.status);
  const mayExecuteRepoLocalOneShot = decision === "ALLOW_REPO_LOCAL_ONE_SHOT";
  const mayExecuteExternalOneShot = decision === "ALLOW_EXTERNAL_ONE_SHOT";

  return {
    surface: "external-action-guard-result",
    routeId: input.route.routeId,
    decision,
    mayPreview,
    mayDryRun,
    mayExecuteRepoLocalOneShot,
    mayExecuteExternalOneShot,
    requiresExplicitHumanGo: true,
    reasons,
    safety: {
      ...BASE_SAFETY,
      ...overrides
    }
  };
}

export function createDefaultExternalActionRouteRegistry(): ExternalActionRouteState[] {
  return [
    {
      surface: "external-action-route-state",
      routeId: "discord_one_shot_send",
      label: "Discord one-shot send (bot REST)",
      effectClass: "network_write",
      status: "HOLD_PENDING_LOCAL_CREDENTIALS",
      implemented: true,
      actualExecutionCount: 0,
      maxExecutionCountWithoutNewGo: 1,
      requiresExplicitHumanGo: true,
      requiresLocalCredentials: true,
      redacted: true
    },
    {
      surface: "external-action-route-state",
      routeId: "human_gate_queue_repo_local_mutation",
      label: "Human Gate Queue repo-local mutation",
      effectClass: "repo_local_write",
      status: "EXECUTED_ONCE",
      implemented: true,
      actualExecutionCount: 1,
      maxExecutionCountWithoutNewGo: 1,
      requiresExplicitHumanGo: true,
      requiresLocalCredentials: false,
      redacted: true
    },
    {
      surface: "external-action-route-state",
      routeId: "git_push",
      label: "Git push to remote",
      effectClass: "remote_git_write",
      status: "HOLD_PENDING_HUMAN_GO",
      implemented: true,
      actualExecutionCount: 0,
      maxExecutionCountWithoutNewGo: 1,
      requiresExplicitHumanGo: true,
      requiresLocalCredentials: false,
      redacted: true
    },
    {
      surface: "external-action-route-state",
      routeId: "runtime_start",
      label: "Runtime / Electron start",
      effectClass: "runtime_effect",
      status: "HOLD_PENDING_HUMAN_GO",
      implemented: true,
      actualExecutionCount: 0,
      maxExecutionCountWithoutNewGo: 1,
      requiresExplicitHumanGo: true,
      requiresLocalCredentials: false,
      redacted: true
    },
    {
      surface: "external-action-route-state",
      routeId: "obsidian_write",
      label: "Obsidian vault write",
      effectClass: "external_service_write",
      status: "HOLD_PENDING_IMPLEMENTATION",
      implemented: false,
      actualExecutionCount: 0,
      maxExecutionCountWithoutNewGo: 1,
      requiresExplicitHumanGo: true,
      requiresLocalCredentials: false,
      redacted: true
    },
    {
      surface: "external-action-route-state",
      routeId: "external_api_write",
      label: "External API write (non-Discord)",
      effectClass: "external_service_write",
      status: "HOLD_PENDING_HUMAN_GO",
      implemented: false,
      actualExecutionCount: 0,
      maxExecutionCountWithoutNewGo: 1,
      requiresExplicitHumanGo: true,
      requiresLocalCredentials: false,
      redacted: true
    }
  ];
}

export function findExternalActionRoute(
  routes: ExternalActionRouteState[],
  routeId: ExternalActionRouteId
): ExternalActionRouteState | undefined {
  return routes.find((route) => route.routeId === routeId);
}

export function evaluateExternalActionGuard(
  input: ExternalActionGuardInput
): ExternalActionGuardResult {
  const reasons: string[] = [];
  const route = input.route;

  if (route.status === "BLOCKED" || route.status === "NOT_APPROVED") {
    reasons.push(`route status is ${route.status}`);
    return buildResult(input, "REJECT_UNSAFE", reasons);
  }

  if (
    executionBudgetExceeded(route, input.requestedAction) &&
    input.requestedAction !== "preview"
  ) {
    reasons.push("maxExecutionCountWithoutNewGo exceeded");
    return buildResult(input, "REJECT_UNSAFE", reasons);
  }

  if (input.requestedAction === "preview") {
    reasons.push("preview is always allowed at guard layer");
    return buildResult(input, "ALLOW_PREVIEW", reasons);
  }

  if (input.requestedAction === "repo_local_one_shot" && route.effectClass !== "repo_local_write") {
    reasons.push("requested repo_local_one_shot on non-repo-local route");
    return buildResult(input, "REJECT_UNSCOPED", reasons);
  }

  if (
    input.requestedAction === "external_one_shot" &&
    !EXTERNAL_ONE_SHOT_EFFECTS.includes(route.effectClass)
  ) {
    reasons.push("requested external_one_shot on unsupported effect class");
    return buildResult(input, "REJECT_UNSCOPED", reasons);
  }

  if (!route.implemented) {
    reasons.push("route not implemented");
    return buildResult(input, "HOLD_NEEDS_IMPLEMENTATION", reasons);
  }

  if (route.requiresExplicitHumanGo && !hasHumanGo(input)) {
    reasons.push("explicit Human GO reference required");
    return buildResult(input, "HOLD_NEEDS_HUMAN_GO", reasons);
  }

  if (route.requiresLocalCredentials && !credentialsAvailable(input)) {
    reasons.push("local credentials required but not reported present");
    return buildResult(input, "HOLD_NEEDS_LOCAL_CREDENTIALS", reasons);
  }

  if (input.requestedAction === "dry_run") {
    if (DRY_RUN_READY_STATUSES.includes(route.status)) {
      reasons.push("dry-run maps to preview-only guard decision");
      return buildResult(input, "ALLOW_PREVIEW", reasons);
    }
    reasons.push(`dry-run not available for status ${route.status}`);
    return buildResult(input, "HOLD_NEEDS_HUMAN_GO", reasons);
  }

  if (input.requestedAction === "repo_local_one_shot") {
    if (!REPO_LOCAL_ONE_SHOT_STATUSES.includes(route.status)) {
      reasons.push(`repo-local one-shot not allowed for status ${route.status}`);
      return buildResult(input, "HOLD_NEEDS_HUMAN_GO", reasons);
    }

    reasons.push("repo-local one-shot allowed with explicit Human GO");
    return buildResult(input, "ALLOW_REPO_LOCAL_ONE_SHOT", reasons, {
      repoLocalWrite: true
    });
  }

  if (input.requestedAction === "external_one_shot") {
    if (route.status !== "READY_CANDIDATE") {
      if (route.status === "HOLD_PENDING_LOCAL_CREDENTIALS") {
        reasons.push("external one-shot blocked pending local credentials");
        return buildResult(input, "HOLD_NEEDS_LOCAL_CREDENTIALS", reasons);
      }
      reasons.push(`external one-shot requires READY_CANDIDATE (current: ${route.status})`);
      return buildResult(input, "HOLD_NEEDS_HUMAN_GO", reasons);
    }

    if (route.actualExecutionCount > 0) {
      reasons.push("external one-shot already executed once without new GO");
      return buildResult(input, "REJECT_UNSAFE", reasons);
    }

    if (route.requiresLocalCredentials && !credentialsAvailable(input)) {
      reasons.push("external one-shot requires local credentials");
      return buildResult(input, "HOLD_NEEDS_LOCAL_CREDENTIALS", reasons);
    }

    reasons.push("external one-shot allowed with explicit Human GO and credentials");
    return buildResult(input, "ALLOW_EXTERNAL_ONE_SHOT", reasons);
  }

  reasons.push("requested action not mapped");
  return buildResult(input, "REJECT_UNSCOPED", reasons);
}

function summarizePlan(result: ExternalActionGuardResult): string {
  return `${result.routeId}: ${result.decision}`;
}

function resolveProposalStatus(plans: ControlledActionPlan[]): ControlledAutonomyProposalStatus {
  if (plans.some((plan) => plan.guardDecision.startsWith("REJECT_"))) {
    return "BLOCKED";
  }

  const hasAllowExternal = plans.some(
    (plan) => plan.guardDecision === "ALLOW_EXTERNAL_ONE_SHOT"
  );
  const hasAllowRepo = plans.some(
    (plan) => plan.guardDecision === "ALLOW_REPO_LOCAL_ONE_SHOT"
  );
  const hasAllowPreview = plans.some((plan) => plan.guardDecision === "ALLOW_PREVIEW");
  const hasHold = plans.some((plan) => plan.guardDecision.startsWith("HOLD_"));

  if (hasAllowExternal || hasAllowRepo) {
    return "READY_FOR_HUMAN_REVIEW";
  }

  if (hasAllowPreview && hasHold) {
    return "MIXED";
  }

  if (hasHold) {
    return "HOLD";
  }

  if (hasAllowPreview) {
    return "HOLD";
  }

  return "HOLD";
}

function buildRecommendedNextHumanAction(
  plans: ControlledActionPlan[],
  status: ControlledAutonomyProposalStatus
): string {
  const discordHold = plans.find(
    (plan) =>
      plan.routeId === "discord_one_shot_send" &&
      plan.guardDecision === "HOLD_NEEDS_LOCAL_CREDENTIALS"
  );
  if (discordHold) {
    return "Configure SHIKISHIMA_DISCORD_* local credentials, then issue explicit Human GO for discord-one-shot-send-completion.";
  }

  if (status === "READY_FOR_HUMAN_REVIEW") {
    return "Review controlled action plans and issue explicit Human GO for the selected one-shot route only.";
  }

  if (status === "BLOCKED") {
    return "Resolve BLOCKED guard decisions before requesting any external execution.";
  }

  return "Continue preview/dry-run only; no external execution is authorized.";
}

export function createControlledAutonomyProposal(input: {
  routes: ExternalActionRouteState[];
  requestedActions: Array<{
    routeId: ExternalActionRouteId;
    requestedAction: ExternalActionGuardInput["requestedAction"];
    humanGoReference?: string;
    localCredentialPresence?: { available: boolean; labelOnly: true };
  }>;
  redacted: true;
}): ControlledAutonomyProposal {
  const actionPlans: ControlledActionPlan[] = input.requestedActions.map((request) => {
    const route = findExternalActionRoute(input.routes, request.routeId);
    if (!route) {
      return {
        routeId: request.routeId,
        requestedAction: request.requestedAction,
        guardDecision: "REJECT_UNSCOPED",
        mayExecuteNow: false,
        requiresExplicitHumanGo: true,
        reasonSummary: `${request.routeId}: route not found in registry`
      };
    }

    const guardResult = evaluateExternalActionGuard({
      surface: "external-action-guard-input",
      route,
      requestedAction: request.requestedAction,
      humanGoReference: request.humanGoReference,
      localCredentialPresence: request.localCredentialPresence,
      redacted: true
    });

    const mayExecuteNow =
      guardResult.decision === "ALLOW_REPO_LOCAL_ONE_SHOT" ||
      guardResult.decision === "ALLOW_EXTERNAL_ONE_SHOT";

    return {
      routeId: request.routeId,
      requestedAction: request.requestedAction,
      guardDecision: guardResult.decision,
      mayExecuteNow,
      requiresExplicitHumanGo: true,
      reasonSummary: summarizePlan(guardResult)
    };
  });

  const status = resolveProposalStatus(actionPlans);

  return {
    surface: "controlled-autonomy-proposal",
    proposalOnly: true,
    actionPlans,
    recommendedNextHumanAction: buildRecommendedNextHumanAction(actionPlans, status),
    status,
    safety: {
      proposalOnly: true,
      actualExecution: false,
      actualDiscordSend: false,
      externalApiWrite: false,
      networkCall: false,
      runtimeStarted: false,
      productionReady: false,
      execution: "disabled",
      redacted: true
    }
  };
}

export function renderExternalActionRouteRegistryMarkdown(
  routes: ExternalActionRouteState[]
): string {
  const lines = routes.map(
    (route) =>
      [
        `- route: ${route.routeId}`,
        `  label: ${route.label}`,
        `  effect: ${route.effectClass}`,
        `  status: ${route.status}`,
        `  implemented: ${route.implemented}`,
        `  actualExecutionCount: ${route.actualExecutionCount}`,
        `  requiresHumanGo: ${route.requiresExplicitHumanGo}`,
        `  requiresLocalCredentials: ${route.requiresLocalCredentials}`
      ].join("\n")
  );

  return ["# しきしま External Action Guard", "", "## Route Registry", ...lines].join("\n");
}

export function renderExternalActionGuardResultMarkdown(
  result: ExternalActionGuardResult
): string {
  return [
    "# しきしま External Action Guard",
    "",
    "## Guard Decision",
    `- route: ${result.routeId}`,
    `- decision: ${result.decision}`,
    `- mayPreview: ${result.mayPreview}`,
    `- mayExecuteRepoLocalOneShot: ${result.mayExecuteRepoLocalOneShot}`,
    `- mayExecuteExternalOneShot: ${result.mayExecuteExternalOneShot}`,
    "",
    "## Reasons",
    ...(result.reasons.length > 0
      ? result.reasons.map((reason) => `- ${reason}`)
      : ["- (none)"]),
    "",
    "## Safety Boundary",
    `- Discord actual send: ${result.safety.actualDiscordSend}`,
    `- External API write: ${result.safety.externalApiWrite}`,
    `- Runtime: ${result.safety.runtimeStarted}`,
    `- productionReady: ${result.safety.productionReady}`,
    `- execution: ${result.safety.execution}`
  ].join("\n");
}

export function renderControlledAutonomyProposalMarkdown(
  proposal: ControlledAutonomyProposal
): string {
  const planLines = proposal.actionPlans.flatMap((plan) => [
    `- route: ${plan.routeId}`,
    `  requestedAction: ${plan.requestedAction}`,
    `  guardDecision: ${plan.guardDecision}`,
    `  mayExecuteNow: ${plan.mayExecuteNow}`,
    `  reasonSummary: ${plan.reasonSummary}`
  ]);

  return [
    "# しきしま External Action Guard",
    "",
    "## Controlled Autonomy Proposal",
    `- status: ${proposal.status}`,
    `- recommendedNextHumanAction: ${proposal.recommendedNextHumanAction}`,
    "",
    "## Action Plans",
    ...planLines,
    "",
    "## Safety Boundary",
    `- proposalOnly: ${proposal.safety.proposalOnly}`,
    `- actualExecution: ${proposal.safety.actualExecution}`,
    `- Discord actual send: ${proposal.safety.actualDiscordSend}`,
    `- External API write: ${proposal.safety.externalApiWrite}`,
    `- Runtime: ${proposal.safety.runtimeStarted}`,
    `- productionReady: ${proposal.safety.productionReady}`,
    `- execution: ${proposal.safety.execution}`
  ].join("\n");
}

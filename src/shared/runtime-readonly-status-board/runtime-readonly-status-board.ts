import {
  createControlledAutonomyProposal,
  createDefaultExternalActionRouteRegistry
} from "../external-action-controlled-autonomy/external-action-controlled-autonomy";
import type { ExternalActionRouteState } from "../external-action-controlled-autonomy/external-action-controlled-autonomy-types";
import { createPassOperatorHandoffAssemblyFixture } from "../operator-handoff-fixtures/operator-handoff-fixtures";
import { createFinalOperatorReviewBundle } from "../final-operator-review-bundle/final-operator-review-bundle";
import { createOperatorHandoffDailyQueuePreview } from "../operator-handoff-daily-queue-preview/operator-handoff-daily-queue-preview";
import { createOperatorHandoffDiscordDigest } from "../operator-handoff-discord-digest/operator-handoff-discord-digest";
import { createOperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot";
import { createOperatorHandoffSnapshotIndex } from "../operator-handoff-snapshot-index/operator-handoff-snapshot-index";
import type {
  RuntimeReadonlyStatusBoardInput,
  RuntimeReadonlyStatusBoardOverallStatus,
  RuntimeReadonlyStatusBoardRouteSummary,
  RuntimeReadonlyStatusBoardSection,
  RuntimeReadonlyStatusBoardSectionStatus,
  RuntimeReadonlyStatusBoardSnapshot,
  RuntimeReadonlyStatusBoardViewModel,
  RuntimeReadonlyStatusBoardViewModelTone
} from "./runtime-readonly-status-board-types";

const SAFETY_BLOCK = {
  readonlyOnly: true as const,
  displayOnly: true as const,
  productionReady: false as const,
  execution: "disabled" as const,
  runtimeStarted: false as const,
  actualDiscordSend: false as const,
  tokenRead: false as const,
  networkCall: false as const,
  externalApiWrite: false as const,
  obsidianWrite: false as const,
  stackChanConnected: false as const,
  rawValuesReported: false as const,
  ipcConnected: false as const,
  preloadExposed: false as const,
  rendererWired: false as const,
  reactUiImplemented: false as const,
  redacted: true as const
};

function findRoute(
  routes: ExternalActionRouteState[],
  routeId: string
): ExternalActionRouteState | undefined {
  return routes.find((route) => route.routeId === routeId);
}

function mapBundleStatusToSection(
  status: RuntimeReadonlyStatusBoardInput["finalOperatorReviewBundle"]["status"]
): RuntimeReadonlyStatusBoardSectionStatus {
  if (status === "READY_FOR_HUMAN_REVIEW") return "READY_FOR_HUMAN_REVIEW";
  if (status === "BLOCKED") return "BLOCKED";
  if (status === "MIXED") return "MIXED";
  return "HOLD";
}

function mapProposalStatusToSection(
  status: RuntimeReadonlyStatusBoardInput["controlledAutonomyProposal"]["status"]
): RuntimeReadonlyStatusBoardSectionStatus {
  if (status === "READY_FOR_HUMAN_REVIEW") return "READY_FOR_HUMAN_REVIEW";
  if (status === "BLOCKED") return "BLOCKED";
  if (status === "MIXED") return "MIXED";
  return "HOLD";
}

function mapDiscordRouteToSectionStatus(
  route: ExternalActionRouteState | undefined
): RuntimeReadonlyStatusBoardSectionStatus {
  if (!route) return "HOLD";
  if (route.status === "BLOCKED" || route.status === "NOT_APPROVED") return "BLOCKED";
  if (route.status === "HOLD_PENDING_LOCAL_CREDENTIALS") return "PASS_WITH_CAVEAT";
  if (route.status === "READY_CANDIDATE" || route.status === "EXECUTED_ONCE") {
    return route.actualExecutionCount > 0 ? "PASS" : "PASS_WITH_CAVEAT";
  }
  if (route.status === "HOLD_PENDING_HUMAN_GO" || route.status === "HOLD_PENDING_IMPLEMENTATION") {
    return "HOLD";
  }
  return "HOLD";
}

function mapQueueRouteToSectionStatus(
  route: ExternalActionRouteState | undefined,
  previewStatus: RuntimeReadonlyStatusBoardInput["dailyQueuePreview"]["status"]
): RuntimeReadonlyStatusBoardSectionStatus {
  if (previewStatus === "BLOCKED") return "BLOCKED";
  if (route?.status === "EXECUTED_ONCE") return "PASS_WITH_CAVEAT";
  if (previewStatus === "READY_FOR_HUMAN_REVIEW") return "READY_FOR_HUMAN_REVIEW";
  if (previewStatus === "MIXED") return "MIXED";
  return "HOLD";
}

function resolveOverallStatus(
  sections: RuntimeReadonlyStatusBoardSection[]
): RuntimeReadonlyStatusBoardOverallStatus {
  const meaningful = sections.filter(
    (section) => section.id !== "runtime" && section.id !== "production"
  );
  const statuses = meaningful.map((section) => section.status);

  if (statuses.some((status) => status === "BLOCKED")) {
    return "BLOCKED";
  }

  const readyLike = statuses.filter(
    (status) =>
      status === "READY_FOR_HUMAN_REVIEW" || status === "PASS" || status === "PASS_WITH_CAVEAT"
  );
  const holdLike = statuses.filter(
    (status) => status === "HOLD" || status === "NOT_STARTED" || status === "MIXED"
  );

  if (readyLike.length > 0 && holdLike.length > 0) {
    return "MIXED";
  }

  if (
    meaningful.length > 0 &&
    meaningful.every((section) =>
      ["READY_FOR_HUMAN_REVIEW", "PASS", "PASS_WITH_CAVEAT"].includes(section.status)
    )
  ) {
    return "READY_FOR_HUMAN_REVIEW";
  }

  if (statuses.some((status) => status === "MIXED")) {
    return "MIXED";
  }

  return "HOLD";
}

function buildRouteSummary(routes: ExternalActionRouteState[]): RuntimeReadonlyStatusBoardRouteSummary[] {
  return routes.map((route) => ({
    routeId: route.routeId,
    status: route.status,
    effectClass: route.effectClass,
    requiresExplicitHumanGo: true,
    actualExecutionCount: route.actualExecutionCount
  }));
}

function buildRecommendedHumanAction(
  overall: RuntimeReadonlyStatusBoardOverallStatus,
  proposalAction: string,
  discordRoute: ExternalActionRouteState | undefined
): string {
  if (discordRoute?.status === "HOLD_PENDING_LOCAL_CREDENTIALS") {
    return "Configure SHIKISHIMA_DISCORD_* credentials for one-shot send completion, or proceed with IPC read-only status board wiring.";
  }

  if (overall === "BLOCKED") {
    return "Resolve BLOCKED sections before requesting external execution.";
  }

  return proposalAction;
}

function sectionToTone(status: string): RuntimeReadonlyStatusBoardViewModelTone {
  if (status === "READY_FOR_HUMAN_REVIEW" || status === "PASS") return "ready";
  if (status === "BLOCKED") return "blocked";
  if (status === "HOLD" || status === "PASS_WITH_CAVEAT" || status === "MIXED") return "hold";
  return "neutral";
}

export function createRuntimeReadonlyStatusBoardSnapshot(
  input: RuntimeReadonlyStatusBoardInput
): RuntimeReadonlyStatusBoardSnapshot {
  const generatedAtLabel =
    input.generatedAtLabel ?? input.finalOperatorReviewBundle.bundleId.split(":")[1] ?? "not recorded";

  const discordRoute = findRoute(input.externalActionRoutes, "discord_one_shot_send");
  const queueRoute = findRoute(input.externalActionRoutes, "human_gate_queue_repo_local_mutation");

  const sections: RuntimeReadonlyStatusBoardSection[] = [
    {
      id: "operator_review",
      title: "Operator Review",
      status: mapBundleStatusToSection(input.finalOperatorReviewBundle.status),
      summary: `bundle=${input.finalOperatorReviewBundle.status} | ${input.finalOperatorReviewBundle.recommendedHumanAction}`,
      nextAction: input.finalOperatorReviewBundle.recommendedHumanAction,
      requiresExplicitHumanGo: true
    },
    {
      id: "human_gate_queue",
      title: "Human Gate Queue",
      status: mapQueueRouteToSectionStatus(queueRoute, input.dailyQueuePreview.status),
      summary: `preview=${input.dailyQueuePreview.status} | queueRoute=${queueRoute?.status ?? "unknown"} | executed=${queueRoute?.actualExecutionCount ?? 0}`,
      nextAction: "Issue explicit Human GO before further repo-local queue mutation.",
      requiresExplicitHumanGo: true
    },
    {
      id: "discord_send",
      title: "Discord Send",
      status: mapDiscordRouteToSectionStatus(discordRoute),
      summary: `route=${discordRoute?.status ?? "unknown"} | pathImplemented=${discordRoute?.implemented ?? false} | actualSendCount=${discordRoute?.actualExecutionCount ?? 0}`,
      nextAction:
        discordRoute?.status === "HOLD_PENDING_LOCAL_CREDENTIALS"
          ? "Set SHIKISHIMA_DISCORD_* env and run discord-one-shot-send-completion."
          : "Discord send remains gated; one-shot only with explicit GO.",
      requiresExplicitHumanGo: true
    },
    {
      id: "external_action_guard",
      title: "External Action Guard",
      status: mapProposalStatusToSection(input.controlledAutonomyProposal.status),
      summary: `proposal=${input.controlledAutonomyProposal.status} | plans=${input.controlledAutonomyProposal.actionPlans.length}`,
      nextAction: input.controlledAutonomyProposal.recommendedNextHumanAction,
      requiresExplicitHumanGo: true
    },
    {
      id: "runtime",
      title: "Runtime",
      status: "HOLD",
      summary: "Electron/runtime start remains HOLD_PENDING_HUMAN_GO.",
      nextAction: "Runtime GO required before start.",
      requiresExplicitHumanGo: true
    },
    {
      id: "production",
      title: "Production",
      status: "HOLD",
      summary: "productionReady remains false; execution remains disabled.",
      nextAction: "ProductionReady GO required.",
      requiresExplicitHumanGo: true
    }
  ];

  const routeSummary = buildRouteSummary(input.externalActionRoutes);
  const status = resolveOverallStatus(sections);
  const recommendedHumanAction = buildRecommendedHumanAction(
    status,
    input.controlledAutonomyProposal.recommendedNextHumanAction,
    discordRoute
  );

  const snapshotWithoutMarkdown: Omit<RuntimeReadonlyStatusBoardSnapshot, "markdown"> = {
    surface: "runtime-readonly-status-board-snapshot",
    readonlyOnly: true,
    displayOnly: true,
    status,
    generatedAtLabel,
    sections,
    routeSummary,
    recommendedHumanAction,
    safety: { ...SAFETY_BLOCK }
  };

  const markdown = renderRuntimeReadonlyStatusBoardMarkdown({
    ...snapshotWithoutMarkdown,
    markdown: ""
  });

  return {
    ...snapshotWithoutMarkdown,
    markdown
  };
}

export function renderRuntimeReadonlyStatusBoardMarkdown(
  snapshot: RuntimeReadonlyStatusBoardSnapshot
): string {
  const sectionBlocks = snapshot.sections.map((section) => {
    const nextLine = section.nextAction ? `- next: ${section.nextAction}` : "- next: (none)";
    return [
      `### ${section.title}`,
      `- status: ${section.status}`,
      `- summary: ${section.summary}`,
      nextLine
    ].join("\n");
  });

  const routeLines = snapshot.routeSummary.map(
    (route) =>
      `- ${route.routeId}: status=${route.status} | effect=${route.effectClass} | executions=${route.actualExecutionCount}`
  );

  return [
    "# しきしま Read-only Status Board",
    "",
    "## Overall",
    `- status: ${snapshot.status}`,
    `- generated: ${snapshot.generatedAtLabel}`,
    `- recommendedHumanAction: ${snapshot.recommendedHumanAction}`,
    `- productionReady: false`,
    `- execution: disabled`,
    `- runtimeStarted: false`,
    "",
    "## Sections",
    ...sectionBlocks,
    "",
    "## External Action Routes",
    ...routeLines,
    "",
    "## Safety Boundary",
    "- Discord actual send: HOLD unless separate one-shot GO completes",
    "- Token read: false",
    "- Network call: false",
    "- Runtime start: false",
    "- productionReady: false",
    "- execution: disabled",
    "- ipcConnected: false",
    "- rendererWired: false"
  ].join("\n");
}

export function createRuntimeReadonlyStatusBoardViewModel(
  snapshot: RuntimeReadonlyStatusBoardSnapshot
): RuntimeReadonlyStatusBoardViewModel {
  return {
    surface: "runtime-readonly-status-board-view-model",
    readonlyOnly: true,
    displayOnly: true,
    title: "しきしま Read-only Status Board",
    statusChips: [
      { label: "Overall", value: snapshot.status, tone: sectionToTone(snapshot.status) },
      { label: "productionReady", value: "false", tone: "neutral" },
      { label: "execution", value: "disabled", tone: "neutral" },
      { label: "runtimeStarted", value: "false", tone: "hold" }
    ],
    cards: snapshot.sections.map((section) => ({
      id: section.id,
      title: section.title,
      status: section.status,
      summary: section.summary,
      nextAction: section.nextAction
    })),
    routeRows: snapshot.routeSummary.map((route) => ({
      routeId: route.routeId,
      status: route.status,
      effectClass: route.effectClass,
      requiresHumanGo: true
    })),
    safetyStrip: [
      { label: "actualDiscordSend", value: "false" },
      { label: "tokenRead", value: "false" },
      { label: "networkCall", value: "false" },
      { label: "externalApiWrite", value: "false" },
      { label: "runtimeStarted", value: "false" },
      { label: "productionReady", value: "false" },
      { label: "execution", value: "disabled" }
    ]
  };
}

const FIXTURE_HUMAN_GO = "Runtime read-only status board fixture validation";

export function buildRuntimeReadonlyStatusBoardFixtureInput(input?: {
  generatedAtLabel?: string;
  humanGoReference?: string;
}): RuntimeReadonlyStatusBoardInput {
  const assembly = createPassOperatorHandoffAssemblyFixture();
  const markdownSnapshot = createOperatorHandoffMarkdownSnapshot({
    surface: "operator-handoff-markdown-snapshot-input",
    assembly,
    redacted: true
  });
  const snapshotIndex = createOperatorHandoffSnapshotIndex({
    surface: "operator-handoff-snapshot-index-input",
    snapshots: [markdownSnapshot],
    redacted: true
  });
  const dailyQueuePreview = createOperatorHandoffDailyQueuePreview({
    surface: "operator-handoff-daily-queue-preview-input",
    snapshotIndex,
    dateLabel: input?.generatedAtLabel ?? "2026-05-26",
    redacted: true
  });
  const discordDigest = createOperatorHandoffDiscordDigest({
    surface: "operator-handoff-discord-digest-input",
    dailyQueuePreview,
    redacted: true
  });
  const finalOperatorReviewBundle = createFinalOperatorReviewBundle({
    surface: "final-operator-review-bundle-input",
    snapshotIndex,
    dailyQueuePreview,
    discordDigest,
    bundleId: `final-operator-review:${input?.generatedAtLabel ?? "2026-05-26"}:READY_FOR_HUMAN_REVIEW`,
    generatedAtLabel: input?.generatedAtLabel ?? "2026-05-26",
    redacted: true
  });
  const externalActionRoutes = createDefaultExternalActionRouteRegistry();
  const humanGoReference = input?.humanGoReference ?? FIXTURE_HUMAN_GO;
  const controlledAutonomyProposal = createControlledAutonomyProposal({
    routes: externalActionRoutes,
    requestedActions: [
      { routeId: "discord_one_shot_send", requestedAction: "preview" },
      {
        routeId: "discord_one_shot_send",
        requestedAction: "external_one_shot",
        humanGoReference,
        localCredentialPresence: { available: false, labelOnly: true }
      },
      { routeId: "human_gate_queue_repo_local_mutation", requestedAction: "preview" },
      { routeId: "git_push", requestedAction: "preview" }
    ],
    redacted: true
  });

  return {
    surface: "runtime-readonly-status-board-input",
    finalOperatorReviewBundle,
    dailyQueuePreview,
    externalActionRoutes,
    controlledAutonomyProposal,
    generatedAtLabel: input?.generatedAtLabel ?? "2026-05-26",
    redacted: true
  };
}

export function createRuntimeReadonlyStatusBoardHoldFallbackSnapshot(input?: {
  generatedAtLabel?: string;
  ipcConnected?: boolean;
  preloadExposed?: boolean;
  rendererWired?: boolean;
}): RuntimeReadonlyStatusBoardSnapshot {
  const generatedAtLabel = input?.generatedAtLabel ?? "not recorded";
  const holdSections: RuntimeReadonlyStatusBoardSection[] = [
    {
      id: "operator_review",
      title: "Operator Review",
      status: "HOLD",
      summary: "Status board IPC unavailable — safe HOLD fallback.",
      requiresExplicitHumanGo: true
    },
    {
      id: "human_gate_queue",
      title: "Human Gate Queue",
      status: "HOLD",
      summary: "Queue status unavailable in fallback mode.",
      requiresExplicitHumanGo: true
    },
    {
      id: "discord_send",
      title: "Discord Send",
      status: "HOLD",
      summary: "Discord send remains HOLD; actualDiscordSend false.",
      requiresExplicitHumanGo: true
    },
    {
      id: "external_action_guard",
      title: "External Action Guard",
      status: "HOLD",
      summary: "Guard proposal unavailable in fallback mode.",
      requiresExplicitHumanGo: true
    },
    {
      id: "runtime",
      title: "Runtime",
      status: "HOLD",
      summary: "Runtime start remains HOLD.",
      requiresExplicitHumanGo: true
    },
    {
      id: "production",
      title: "Production",
      status: "HOLD",
      summary: "productionReady false; execution disabled.",
      requiresExplicitHumanGo: true
    }
  ];

  const snapshot: RuntimeReadonlyStatusBoardSnapshot = {
    surface: "runtime-readonly-status-board-snapshot",
    readonlyOnly: true,
    displayOnly: true,
    status: "HOLD",
    generatedAtLabel,
    sections: holdSections,
    routeSummary: [],
    recommendedHumanAction:
      "Status board IPC unavailable — showing safe HOLD fallback. Restore preload IPC and refresh.",
    markdown: "",
    safety: {
      ...SAFETY_BLOCK,
      ipcConnected: input?.ipcConnected ?? false,
      preloadExposed: input?.preloadExposed ?? false,
      rendererWired: input?.rendererWired ?? true,
      reactUiImplemented: true
    }
  };

  return {
    ...snapshot,
    markdown: renderRuntimeReadonlyStatusBoardMarkdown(snapshot)
  };
}

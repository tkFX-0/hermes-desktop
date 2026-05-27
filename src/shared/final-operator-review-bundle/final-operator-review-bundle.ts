import type {
  FinalOperatorReviewBundle,
  FinalOperatorReviewBundleInput,
  FinalOperatorReviewBundleSafety,
  FinalOperatorReviewBundleStatus,
  FinalOperatorReviewChecklistItem,
  FinalOperatorReviewDecisionChoice
} from "./final-operator-review-bundle-types";

const DEFAULT_TITLE = "しきしま Final Operator Review Bundle";

const SAFETY_BLOCK: FinalOperatorReviewBundleSafety = {
  bundleOnly: true,
  markdownOnly: true,
  reviewOnly: true,
  draftOnly: true,
  displayOnly: true,
  discordPasteReady: true,
  obsidianCompatible: true,
  obsidianWrite: false,
  fileWrite: false,
  humanGateQueueMutation: false,
  sendReady: false,
  maySendNow: false,
  actualDiscordSend: false,
  executorImplemented: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  networkCall: false,
  externalWrite: false,
  runtimeStarted: false,
  actualQueueMutation: false,
  humanGateQueueDocModified: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

const DECISION_OPTIONS: FinalOperatorReviewDecisionChoice[] = [
  {
    option: "APPROVE_ONE_NEXT_GOAL",
    label: "Approve one next recommended goal",
    requiresExplicitHumanGo: true
  },
  {
    option: "REQUEST_REVISION",
    label: "Request revision before any next goal",
    requiresExplicitHumanGo: true
  },
  {
    option: "HOLD_ALL",
    label: "Keep all items on HOLD",
    requiresExplicitHumanGo: true
  },
  {
    option: "REJECT_BLOCKED",
    label: "Reject blocked handoff paths",
    requiresExplicitHumanGo: true
  }
];

function normalizeStatus(status: string): FinalOperatorReviewBundleStatus {
  if (status === "BLOCKED") return "BLOCKED";
  if (status === "MIXED") return "MIXED";
  if (status === "READY_FOR_HUMAN_REVIEW") return "READY_FOR_HUMAN_REVIEW";
  return "HOLD";
}

function resolveConservativeBundleStatus(
  input: FinalOperatorReviewBundleInput
): FinalOperatorReviewBundleStatus {
  const statuses = [
    normalizeStatus(input.snapshotIndex.status),
    normalizeStatus(input.dailyQueuePreview.status),
    normalizeStatus(input.discordDigest.status)
  ];

  if (statuses.includes("BLOCKED")) {
    return "BLOCKED";
  }

  if (statuses.includes("MIXED")) {
    return "MIXED";
  }

  if (statuses.every((status) => status === "READY_FOR_HUMAN_REVIEW")) {
    return "READY_FOR_HUMAN_REVIEW";
  }

  if (statuses.every((status) => status === "HOLD")) {
    return "HOLD";
  }

  return "MIXED";
}

function buildBundleId(input: FinalOperatorReviewBundleInput): string {
  if (input.bundleId?.trim()) {
    return input.bundleId.trim();
  }

  const slug = input.dailyQueuePreview.dateLabel.replace(/\s+/g, "-");
  return `final-operator-review:${slug}:${input.snapshotIndex.status}`;
}

function buildReviewChecklist(
  status: FinalOperatorReviewBundleStatus,
  input: FinalOperatorReviewBundleInput
): FinalOperatorReviewChecklistItem[] {
  const hasReady = input.dailyQueuePreview.counts.reviewNow > 0;
  const hasHoldOrBlocked =
    input.dailyQueuePreview.counts.hold > 0 || input.dailyQueuePreview.counts.blocked > 0;

  return [
    {
      label: "Confirm READY items",
      required: hasReady,
      passed: hasReady && status !== "HOLD"
    },
    {
      label: "Confirm HOLD/BLOCKED items",
      required: hasHoldOrBlocked,
      passed: hasHoldOrBlocked
    },
    {
      label: "Confirm next Goal requires explicit Human GO",
      required: true,
      passed: true
    },
    {
      label: "Confirm Discord send remains HOLD",
      required: true,
      passed: true
    },
    {
      label: "Confirm Queue mutation remains HOLD",
      required: true,
      passed: true
    },
    {
      label: "Confirm productionReady remains false",
      required: true,
      passed: true
    },
    {
      label: "Confirm execution remains disabled",
      required: true,
      passed: true
    }
  ];
}

function renderChecklist(items: FinalOperatorReviewChecklistItem[]): string[] {
  return items.map((item) => {
    const mark = item.passed ? "x" : " ";
    const requiredLabel = item.required ? "required" : "optional";
    return `- [${mark}] ${item.label} (${requiredLabel})`;
  });
}

function renderDecisionOptions(options: FinalOperatorReviewDecisionChoice[]): string[] {
  return options.map((option) => {
    const goSuffix = option.requiresExplicitHumanGo ? " — requires explicit Human GO" : "";
    return `- ${option.option}: ${option.label}${goSuffix}`;
  });
}

function renderBundleMarkdown(
  input: FinalOperatorReviewBundleInput,
  bundle: Pick<
    FinalOperatorReviewBundle,
    | "title"
    | "bundleId"
    | "status"
    | "recommendedHumanAction"
    | "reviewChecklist"
    | "decisionOptions"
    | "discordDigest"
    | "dailyQueuePreview"
    | "snapshotIndex"
  >
): string {
  const generated = input.generatedAtLabel?.trim() || "(not recorded)";

  return [
    `# ${bundle.title}`,
    "",
    "## Status",
    `- status: ${bundle.status}`,
    `- bundle: ${bundle.bundleId}`,
    `- generated: ${generated}`,
    "",
    "## Digest",
    bundle.discordDigest.markdown,
    "",
    "## Daily Queue",
    bundle.dailyQueuePreview.markdown,
    "",
    "## Snapshot Index",
    bundle.snapshotIndex.markdown,
    "",
    "## Review Checklist",
    ...renderChecklist(bundle.reviewChecklist),
    "",
    "## Decision Options",
    ...renderDecisionOptions(bundle.decisionOptions),
    "",
    "## Safety Boundary",
    "- Discord send: HOLD",
    "- Executor: HOLD",
    "- Webhook/Bot/Token/Network: HOLD",
    "- Queue mutation: HOLD",
    "- Runtime: HOLD",
    "- productionReady: false",
    "- execution: disabled",
    "- READY_FOR_HUMAN_REVIEW is not Discord send approval.",
    "- READY_FOR_HUMAN_REVIEW is not Queue mutation approval.",
    "- READY_FOR_HUMAN_REVIEW is not next Goal auto-approval."
  ].join("\n");
}

export function createFinalOperatorReviewBundle(
  input: FinalOperatorReviewBundleInput
): FinalOperatorReviewBundle {
  const title = input.title?.trim() || DEFAULT_TITLE;
  const status = resolveConservativeBundleStatus(input);
  const bundleId = buildBundleId(input);
  const recommendedHumanAction = input.discordDigest.recommendedHumanAction;
  const reviewChecklist = buildReviewChecklist(status, input);
  const decisionOptions = DECISION_OPTIONS.map((option) => ({ ...option }));

  const bundleCore = {
    title,
    bundleId,
    status,
    recommendedHumanAction,
    reviewChecklist,
    decisionOptions,
    discordDigest: input.discordDigest,
    dailyQueuePreview: input.dailyQueuePreview,
    snapshotIndex: input.snapshotIndex
  };

  const markdown = renderBundleMarkdown(input, bundleCore);

  return {
    surface: "final-operator-review-bundle",
    bundleOnly: true,
    reviewOnly: true,
    draftOnly: true,
    markdownOnly: true,
    status,
    bundleId,
    title,
    snapshotIndex: input.snapshotIndex,
    dailyQueuePreview: input.dailyQueuePreview,
    discordDigest: input.discordDigest,
    recommendedHumanAction,
    reviewChecklist,
    decisionOptions,
    markdown,
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderFinalOperatorReviewBundle(bundle: FinalOperatorReviewBundle): string {
  return bundle.markdown;
}

export function createFinalOperatorReviewBundleMarkdown(
  input: FinalOperatorReviewBundleInput
): string {
  return renderFinalOperatorReviewBundle(createFinalOperatorReviewBundle(input));
}

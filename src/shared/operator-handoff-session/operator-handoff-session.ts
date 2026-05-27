import type {
  OperatorHandoffDecisionChoiceRow,
  OperatorHandoffSession,
  OperatorHandoffSessionInput,
  OperatorHandoffSessionSafety,
  OperatorHandoffSessionSection,
  OperatorHandoffSessionStatus
} from "./operator-handoff-session-types";

const SAFETY_BLOCK: OperatorHandoffSessionSafety = {
  sessionOnly: true,
  handoffOnly: true,
  reviewOnly: true,
  draftOnly: true,
  displayOnly: true,
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
  fileWriteReady: false,
  humanGateQueueDocModified: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

const DECISION_CHOICES: OperatorHandoffDecisionChoiceRow[] = [
  {
    choice: "APPROVE_NEXT_GOAL",
    label: "Approve next recommended goal (explicit Human GO required)",
    requiresExplicitHumanGo: true
  },
  {
    choice: "REQUEST_REVISION",
    label: "Request revision before any next goal",
    requiresExplicitHumanGo: true
  },
  {
    choice: "REJECT",
    label: "Reject this handoff path",
    requiresExplicitHumanGo: true
  },
  {
    choice: "HOLD",
    label: "Keep on HOLD — no next goal approval",
    requiresExplicitHumanGo: true
  }
];

function resolveSessionStatus(input: OperatorHandoffSessionInput): OperatorHandoffSessionStatus {
  if (input.goalResultStatus === "STOP") {
    return "BLOCKED";
  }
  if (input.assembly.status === "BLOCKED") {
    return "BLOCKED";
  }
  if (input.goalResultStatus === "HOLD") {
    return "HOLD";
  }
  if (
    input.assembly.status === "REVIEW_READY_CANDIDATE" &&
    (input.goalResultStatus === "PASS" || input.goalResultStatus === "PASS_WITH_CAVEAT")
  ) {
    return "READY_FOR_HUMAN_REVIEW";
  }
  return "HOLD";
}

function buildSessionId(input: OperatorHandoffSessionInput): string {
  if (input.sessionId?.trim()) {
    return input.sessionId.trim();
  }
  const slug = input.goalName.replace(/\s+/g, "-").toLowerCase();
  return `operator-handoff:${slug}:${input.assembly.source.packetId}`;
}

function buildTitle(status: OperatorHandoffSessionStatus, goalName: string): string {
  if (status === "BLOCKED") return `Operator handoff: BLOCKED — ${goalName}`;
  if (status === "READY_FOR_HUMAN_REVIEW") {
    return `Operator handoff: ready for human review — ${goalName}`;
  }
  return `Operator handoff: HOLD — ${goalName}`;
}

function buildSummary(
  status: OperatorHandoffSessionStatus,
  input: OperatorHandoffSessionInput
): string {
  const parts = [
    `Goal result: ${input.goalResultStatus}`,
    `Assembly: ${input.assembly.status}`,
    `Review packet: ${input.assembly.reviewPacket.status}`
  ];
  if (status === "READY_FOR_HUMAN_REVIEW") {
    parts.push("Ready to show operator for next GO decision (not send approval)");
  }
  if (status === "BLOCKED") {
    parts.push("Do not proceed without resolving BLOCKED items");
  }
  return parts.join(" | ");
}

function buildSections(input: OperatorHandoffSessionInput): OperatorHandoffSessionSection[] {
  const localCommits = input.localCommitsAhead ?? [];
  const pushedCommits = input.pushedCommits ?? [];

  return [
    {
      heading: "What happened",
      lines: [
        `Goal: ${input.goalName}`,
        `Goal result: ${input.goalResultStatus}`,
        `Assembly status: ${input.assembly.status}`,
        input.assembly.source.humanGoReference
          ? `Human GO reference: ${input.assembly.source.humanGoReference}`
          : "Human GO reference: (none recorded)"
      ]
    },
    {
      heading: "Current status",
      lines: [
        `Snapshot: ${input.assembly.source.snapshotStatus}`,
        `Send preflight: ${input.assembly.source.sendPreflightStatus}`,
        `Review packet: ${input.assembly.reviewPacket.status}`,
        `Packet ID: ${input.assembly.source.packetId}`
      ]
    },
    {
      heading: "Source commits",
      lines: [
        input.originMainAfter ? `origin/main after: ${input.originMainAfter}` : "origin/main after: (not recorded)",
        localCommits.length > 0
          ? `local commits ahead: ${localCommits.join(", ")}`
          : "local commits ahead: (none recorded)",
        pushedCommits.length > 0
          ? `pushed commits: ${pushedCommits.join(", ")}`
          : "pushed commits: (none recorded)"
      ]
    },
    {
      heading: "Next recommended goal",
      lines: [input.nextRecommendedGoal ?? "(none recorded)"]
    },
    {
      heading: "Safety boundary",
      lines: [
        "handoff-only | review-only | draft-only | no Discord send",
        "no executor | no webhook | no bot | no token read",
        "no queue mutation | productionReady: false | execution: disabled"
      ]
    }
  ];
}

export function createOperatorHandoffSession(
  input: OperatorHandoffSessionInput
): OperatorHandoffSession {
  const status = resolveSessionStatus(input);
  const localCommitsAhead = [...(input.localCommitsAhead ?? [])];
  const pushedCommits = [...(input.pushedCommits ?? [])];

  return {
    surface: "operator-handoff-session",
    sessionOnly: true,
    handoffOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    sessionId: buildSessionId(input),
    title: buildTitle(status, input.goalName),
    summary: buildSummary(status, input),
    goalName: input.goalName,
    goalResultStatus: input.goalResultStatus,
    reviewPacketPreview: input.assembly.preview,
    sections: buildSections(input),
    source: {
      assemblyStatus: input.assembly.status,
      reviewPacketStatus: input.assembly.reviewPacket.status,
      originMainAfter: input.originMainAfter,
      localCommitsAhead,
      pushedCommits
    },
    decisionChoices: DECISION_CHOICES.map((row) => ({
      choice: row.choice,
      label: row.label,
      requiresExplicitHumanGo: row.requiresExplicitHumanGo
    })),
    nextRecommendedGoal: input.nextRecommendedGoal,
    humanQuestion: input.humanQuestion,
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderOperatorHandoffSessionPreview(session: OperatorHandoffSession): string {
  const sectionBlocks = session.sections.map((section) => {
    const lines = section.lines.map((line) => `- ${line}`).join("\n");
    return `### ${section.heading}\n${lines}`;
  });

  const choiceLines = session.decisionChoices.map(
    (row) =>
      `- ${row.choice}: ${row.label} (requiresExplicitHumanGo: ${row.requiresExplicitHumanGo})`
  );

  return [
    "<!-- handoff-only / review-only / draft-only / no Discord send -->",
    `**${session.title}**`,
    `Session ID: ${session.sessionId}`,
    `Status: ${session.status}`,
    "",
    session.summary,
    "",
    ...sectionBlocks,
    "",
    "**Human decision choices:**",
    ...choiceLines,
    "",
    session.humanQuestion ? `**Question for operator:** ${session.humanQuestion}` : "",
    "",
    "**Review packet preview:**",
    session.reviewPacketPreview,
    "",
    "READY_FOR_HUMAN_REVIEW is not Discord send approval.",
    "READY_FOR_HUMAN_REVIEW is not next goal approval.",
    "APPROVE_NEXT_GOAL requires explicit Human GO."
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function createOperatorHandoffSessionPreview(
  input: OperatorHandoffSessionInput
): string {
  return renderOperatorHandoffSessionPreview(createOperatorHandoffSession(input));
}

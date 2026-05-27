import type {
  OperatorHandoffMarkdownSnapshot,
  OperatorHandoffMarkdownSnapshotInput,
  OperatorHandoffMarkdownSnapshotSafety,
  OperatorHandoffMarkdownSnapshotSection,
  OperatorHandoffMarkdownSnapshotStatus
} from "./operator-handoff-markdown-snapshot-types";

const DEFAULT_TITLE = "しきしま Operator Handoff";

const REVIEW_PACKET_MAX_CHARS = 2400;

const SAFETY_BLOCK: OperatorHandoffMarkdownSnapshotSafety = {
  snapshotOnly: true,
  markdownOnly: true,
  reviewOnly: true,
  draftOnly: true,
  displayOnly: true,
  discordPasteReady: true,
  obsidianCompatible: true,
  obsidianWrite: false,
  fileWrite: false,
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

function mapAssemblyStatus(status: string): OperatorHandoffMarkdownSnapshotStatus {
  if (status === "BLOCKED") return "BLOCKED";
  if (status === "READY_FOR_HUMAN_REVIEW") return "READY_FOR_HUMAN_REVIEW";
  return "HOLD";
}

function truncateForDiscordPaste(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars)}\n\n(truncated for Discord paste — full preview remains in assembly result)`;
}

function buildReviewPacketBody(
  input: OperatorHandoffMarkdownSnapshotInput
): string {
  const session = input.assembly.operatorHandoffSession;

  if (input.includeRawPreview) {
    return truncateForDiscordPaste(input.assembly.preview, REVIEW_PACKET_MAX_CHARS * 2);
  }

  const parts = [
    session.reviewPacketPreview.trim(),
    "",
    "**Handoff preview excerpt:**",
    truncateForDiscordPaste(input.assembly.preview, REVIEW_PACKET_MAX_CHARS)
  ];

  return parts.join("\n").trim();
}

function buildDecisionChoiceLines(
  input: OperatorHandoffMarkdownSnapshotInput
): string[] {
  if (input.includeDecisionChoices === false) {
    return ["(decision choices omitted)"];
  }

  return input.assembly.operatorHandoffSession.decisionChoices.map((row) => {
    if (row.choice === "APPROVE_NEXT_GOAL") {
      return `${row.choice} — ${row.label} (explicit Human GO required)`;
    }

    return `${row.choice} — ${row.label}`;
  });
}

function buildSections(input: OperatorHandoffMarkdownSnapshotInput): OperatorHandoffMarkdownSnapshotSection[] {
  const assembly = input.assembly;
  const session = assembly.operatorHandoffSession;
  const includeSafety = input.includeSafetySection !== false;

  const sections: OperatorHandoffMarkdownSnapshotSection[] = [
    {
      heading: "Status",
      lines: [
        `status: ${assembly.status}`,
        `goal: ${session.goalName}`,
        `result: ${session.goalResultStatus}`,
        `session: ${session.sessionId}`
      ]
    },
    {
      heading: "Summary",
      lines: [session.summary, session.title]
    },
    {
      heading: "Review Packet",
      lines: [buildReviewPacketBody(input)]
    },
    {
      heading: "Decision Choices",
      lines: buildDecisionChoiceLines(input)
    }
  ];

  if (session.nextRecommendedGoal) {
    sections.push({
      heading: "Next Recommended Goal",
      lines: [session.nextRecommendedGoal]
    });
  }

  if (assembly.caveats.length > 0) {
    sections.push({
      heading: "Caveats",
      lines: assembly.caveats.map((item) => `- ${item}`)
    });
  }

  if (session.humanQuestion) {
    sections.push({
      heading: "Operator Question",
      lines: [session.humanQuestion]
    });
  }

  if (input.generatedAtLabel) {
    sections.push({
      heading: "Generated",
      lines: [input.generatedAtLabel]
    });
  }

  if (includeSafety) {
    sections.push({
      heading: "Safety Boundary",
      lines: [
        "Discord send: HOLD",
        "Executor: HOLD",
        "Webhook/Bot/Token/Network: HOLD",
        "Queue mutation: HOLD",
        "Runtime: HOLD",
        "productionReady: false",
        "execution: disabled",
        "READY_FOR_HUMAN_REVIEW is not Discord send approval.",
        "READY_FOR_HUMAN_REVIEW is not next goal approval.",
        "APPROVE_NEXT_GOAL requires explicit Human GO."
      ]
    });
  }

  return sections;
}

function renderSectionsToMarkdown(
  title: string,
  sections: OperatorHandoffMarkdownSnapshotSection[]
): string {
  const sectionBlocks = sections.map((section) => {
    const body =
      section.lines.length === 1 && section.lines[0]?.includes("\n")
        ? section.lines[0]
        : section.lines.map((line) => `- ${line}`).join("\n");

    return `## ${section.heading}\n${body}`;
  });

  return [`# ${title}`, "", ...sectionBlocks].join("\n");
}

export function createOperatorHandoffMarkdownSnapshot(
  input: OperatorHandoffMarkdownSnapshotInput
): OperatorHandoffMarkdownSnapshot {
  const assembly = input.assembly;
  const session = assembly.operatorHandoffSession;
  const title = input.title?.trim() || DEFAULT_TITLE;
  const sections = buildSections(input);
  const markdown = renderSectionsToMarkdown(title, sections);

  return {
    surface: "operator-handoff-markdown-snapshot",
    snapshotOnly: true,
    markdownOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status: mapAssemblyStatus(assembly.status),
    title,
    markdown,
    sections,
    source: {
      assemblyStatus: assembly.status,
      handoffSessionStatus: session.status,
      goalName: session.goalName,
      goalResultStatus: session.goalResultStatus,
      sessionId: session.sessionId
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderOperatorHandoffMarkdownSnapshot(
  snapshot: OperatorHandoffMarkdownSnapshot
): string {
  return snapshot.markdown;
}

export function createOperatorHandoffMarkdownSnapshotMarkdown(
  input: OperatorHandoffMarkdownSnapshotInput
): string {
  return renderOperatorHandoffMarkdownSnapshot(createOperatorHandoffMarkdownSnapshot(input));
}

import type { HumanGateQueueEntryState } from "./human-gate-queue-operation-types";

export const HUMAN_GATE_QUEUE_OPERATION_SECTION_HEADING =
  "## 5. Operator Review MVP Queue Entries" as const;

const FORBIDDEN_PATTERNS = [
  /discord\.com\/api\/webhooks/i,
  /\bBearer\s+[A-Za-z0-9._-]{8,}\b/,
  /\bsk-[A-Za-z0-9]{8,}\b/,
  /[A-Za-z]:\\Users\\/,
  /\/Users\/[A-Za-z0-9._-]+\//,
  /\bchannel_id:\s*\d+/i,
  /\bwebhook_url:/i
];

export function assertSafeQueueMarkdown(markdown: string): void {
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(markdown)) {
      throw new Error("Queue markdown contains forbidden pattern");
    }
  }
}

export function applyHumanGateQueueAppendToMarkdown(
  currentMarkdown: string,
  entryMarkdown: string
): string {
  assertSafeQueueMarkdown(entryMarkdown);

  const trimmed = currentMarkdown.trimEnd();
  const sectionIntro = trimmed.includes(HUMAN_GATE_QUEUE_OPERATION_SECTION_HEADING)
    ? ""
    : `\n\n${HUMAN_GATE_QUEUE_OPERATION_SECTION_HEADING}\n`;

  return `${trimmed}${sectionIntro}\n${entryMarkdown.trim()}\n`;
}

export function applyHumanGateQueueStateUpdateToMarkdown(
  currentMarkdown: string,
  entryId: string,
  updateMarkdown: string,
  previousState: HumanGateQueueEntryState,
  nextState: HumanGateQueueEntryState
): string {
  assertSafeQueueMarkdown(updateMarkdown);

  const entryHeading = `## Queue Entry: ${entryId}`;
  if (!currentMarkdown.includes(entryHeading)) {
    throw new Error(`Queue entry not found: ${entryId}`);
  }

  const parts = currentMarkdown.split(/(?=^## Queue Entry: )/m);
  const updated = parts
    .map((part) => {
      if (!part.startsWith(entryHeading)) {
        return part;
      }

      const withState = part.replace(`- state: ${previousState}`, `- state: ${nextState}`);

      if (withState.includes(`### Queue Update: ${entryId}`)) {
        return withState;
      }

      return `${withState.trimEnd()}\n\n${updateMarkdown.trim()}\n`;
    })
    .join("");

  assertSafeQueueMarkdown(updated);
  return updated;
}

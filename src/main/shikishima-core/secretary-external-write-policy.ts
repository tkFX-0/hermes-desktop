import { createActionPreflight, type PreflightResult } from "./preflight-factory";
import type { HumanGoTicket } from "./action-gate-kernel";
import type { OperationActionKind } from "./operation-ledger-types";

export interface SecretaryExternalWriteDraftInput {
  writeId: string;
  actionKind: Extract<OperationActionKind, "discord_write" | "obsidian_write">;
  destinationSummary: string;
  contentSummary: string;
  humanGoTicket?: HumanGoTicket;
}

export interface SecretaryExternalWriteDraft {
  writeId: string;
  actionKind: "discord_write" | "obsidian_write";
  destinationSummary: string;
  contentSummary: string;
  preflight: PreflightResult;
  canExecuteNow: boolean;
  rawValuesReported: false;
  retryLoop: false;
}

export function createSecretaryExternalWriteDraft(
  input: SecretaryExternalWriteDraftInput,
): SecretaryExternalWriteDraft {
  const preflight = createActionPreflight({
    actionId: input.writeId,
    actionKind: input.actionKind,
    actor: "shizume",
    source: "human",
    targetSummary: input.destinationSummary,
    evidencePath: "docs/shikishima/SC_SECRETARY_EXTERNAL_WRITE_EVIDENCE.md",
    requestedEffects: ["external_write"],
    allowedRunCount: 1,
    humanGoTicket: input.humanGoTicket,
  });

  return {
    writeId: input.writeId,
    actionKind: input.actionKind,
    destinationSummary: input.destinationSummary,
    contentSummary: input.contentSummary,
    preflight,
    canExecuteNow: preflight.gate.decision === "APPROVED_ONE_SHOT",
    rawValuesReported: false,
    retryLoop: false,
  };
}


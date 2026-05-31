/**
 * Phase E3b — Obsidian / library evidence write when constitutional GO is active.
 */

import { hasConstitutionalGoScope } from "./constitutional-go-state";
import { planObsidianWrite } from "./obsidian-write-plan";

export interface ObsidianWriteExecuteInput {
  filename: string;
  content: string;
  vaultPathRedacted?: string;
  noteTitleRedacted?: string;
}

export interface ObsidianWriteExecuteResult {
  success: boolean;
  dryRun: boolean;
  redactedPath?: string;
  error?: string;
  decision: "HOLD" | "ALLOW_DRAFT" | "BLOCKED";
  reasons: readonly string[];
}

export type LibraryWriteFn = (req: {
  filename: string;
  content: string;
}) => {
  success: boolean;
  redactedPath?: string;
  error?: string;
  dryRun: boolean;
};

export function executeObsidianWrite(
  input: ObsidianWriteExecuteInput,
  writeFn?: LibraryWriteFn
): ObsidianWriteExecuteResult {
  const goActive = hasConstitutionalGoScope("obsidian_write");

  const plan = planObsidianWrite({
    vaultPathRedacted: input.vaultPathRedacted ?? "shikishima-library/30_Evidence",
    noteTitleRedacted: input.noteTitleRedacted ?? input.filename,
    humanGoApproved: goActive,
    oneShotDeclared: goActive,
    operationalReleaseActive: goActive
  });

  if (!goActive) {
    return {
      success: false,
      dryRun: true,
      decision: plan.decision,
      reasons: [...plan.reasons, "constitutional_go_obsidian_write_required"]
    };
  }

  if (plan.decision === "BLOCKED") {
    return {
      success: false,
      dryRun: true,
      decision: "BLOCKED",
      reasons: plan.reasons
    };
  }

  if (!writeFn) {
    return {
      success: true,
      dryRun: true,
      decision: "ALLOW_DRAFT",
      reasons: ["no_write_fn_injected"],
      redactedPath: `30_Evidence/${input.filename}`
    };
  }

  const written = writeFn({ filename: input.filename, content: input.content });
  return {
    success: written.success,
    dryRun: written.dryRun,
    redactedPath: written.redactedPath,
    error: written.error,
    decision: written.success ? "ALLOW_DRAFT" : "HOLD",
    reasons: written.success ? [] : [written.error ?? "write_failed"]
  };
}

/**
 * Phase E3 — Obsidian write planning (dry-run only; actual write requires separate GO).
 */

import { evaluateExternalEffect } from "./evaluate-external-effect";
import { evaluateSafetyGovernor } from "./safety-governor";

export interface ObsidianWritePlanInput {
  vaultPathRedacted: string;
  noteTitleRedacted: string;
  humanGoApproved: boolean;
  oneShotDeclared: boolean;
  operationalReleaseActive: boolean;
}

export interface ObsidianWritePlanResult {
  decision: "HOLD" | "ALLOW_DRAFT" | "BLOCKED";
  reasons: readonly string[];
  dryRunOnly: true;
  wouldWrite: boolean;
}

export function planObsidianWrite(input: ObsidianWritePlanInput): ObsidianWritePlanResult {
  const governor = evaluateSafetyGovernor({
    productionReady: false,
    executionEnabled: false,
    rawValuesReported: false,
    retryLoopDetected: false,
    humanVisualAutoPassAttempted: false
  });

  if (governor.decision === "BLOCKED") {
    return {
      decision: "BLOCKED",
      reasons: governor.reasons,
      dryRunOnly: true,
      wouldWrite: false
    };
  }

  const effect = evaluateExternalEffect({
    routeId: "obsidian.write",
    humanGoApproved: input.humanGoApproved,
    oneShotDeclared: input.oneShotDeclared,
    timeWindowActive: true,
    dryRunOnly: true,
    productionReady: false,
    executionEnabled: false
  });

  const reasons = [...effect.reasons];
  if (!input.vaultPathRedacted.trim()) reasons.push("vault_path_required");
  if (!input.noteTitleRedacted.trim()) reasons.push("note_title_required");

  const raw = reasons.length > 0 ? "HOLD" : effect.decision;
  const decision: ObsidianWritePlanResult["decision"] =
    raw === "ALLOW" || raw === "ALLOW_DRAFT"
      ? "ALLOW_DRAFT"
      : raw === "BLOCKED"
        ? "BLOCKED"
        : "HOLD";

  return {
    decision,
    reasons,
    dryRunOnly: true,
    wouldWrite: decision === "ALLOW_DRAFT"
  };
}

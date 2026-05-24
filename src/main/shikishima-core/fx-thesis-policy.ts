export type FxDirectionBias = "long" | "short" | "neutral" | "wait";
export type FxConfidenceLabel = "low" | "medium" | "high";

export interface FxThesis {
  marketContext: string;
  directionBias: FxDirectionBias;
  setupName: string;
  entryZone: string;
  invalidation: string;
  riskNotes: string;
  confidenceLabel: FxConfidenceLabel;
  evidenceSources: readonly string[];
  whatWouldChangeMyMind: string;
  positionIntent: string;
  tradeExecution: false;
}

export function createFxThesis(input: Omit<FxThesis, "tradeExecution">): FxThesis {
  return {
    ...input,
    tradeExecution: false,
  };
}

export function validateFxThesis(thesis: FxThesis): { ok: boolean; reason?: string } {
  if (thesis.tradeExecution !== false) return { ok: false, reason: "trade_execution_forbidden" };
  if (!thesis.invalidation) return { ok: false, reason: "invalidation_required" };
  if (!thesis.riskNotes) return { ok: false, reason: "risk_notes_required" };
  if (thesis.evidenceSources.length === 0) return { ok: false, reason: "evidence_sources_required" };
  return { ok: true };
}

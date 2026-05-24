import { createFxThesis, type FxConfidenceLabel, type FxDirectionBias, type FxThesis } from "./fx-thesis-policy";

export function createWaitFxThesis(input: {
  marketContext: string;
  evidenceSources: readonly string[];
  confidenceLabel?: FxConfidenceLabel;
}): FxThesis {
  return createFxThesis({
    marketContext: input.marketContext,
    directionBias: "wait",
    setupName: "no-trade / wait",
    entryZone: "none",
    invalidation: "fresh validated setup appears",
    riskNotes: "No position should be opened from this thesis alone.",
    confidenceLabel: input.confidenceLabel ?? "medium",
    evidenceSources: input.evidenceSources,
    whatWouldChangeMyMind: "clear setup, invalidation, and risk limit are all present",
    positionIntent: "wait",
  });
}

export function createDirectionalFxThesis(input: {
  marketContext: string;
  directionBias: Exclude<FxDirectionBias, "wait">;
  setupName: string;
  entryZone: string;
  invalidation: string;
  riskNotes: string;
  confidenceLabel: FxConfidenceLabel;
  evidenceSources: readonly string[];
  whatWouldChangeMyMind: string;
}): FxThesis {
  return createFxThesis({
    ...input,
    positionIntent: `${input.directionBias} thesis only; human decision required`,
  });
}

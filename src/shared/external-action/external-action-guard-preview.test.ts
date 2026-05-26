import { describe, expect, it } from "vitest";
import {
  previewExternalActionGuardDecision,
  previewSelectedExternalActionGuardDecisions
} from "./external-action-guard-preview";

describe("external action guard preview", () => {
  it("returns a preview-only decision for discord.send", () => {
    const result = previewExternalActionGuardDecision({
      routeId: "discord.send",
      actor: "test"
    });

    expect(result.previewOnly).toBe(true);
    expect(result.decision.routeId).toBe("discord.send");
    expect(result.decision.decision).toBe("SAFETY_HOLD");
    expect(result.decision.effectMayRun).toBe(false);
    expect(result.decision.productionReady).toBe(false);
    expect(result.decision.execution).toBe("disabled");
    expect(result.decision.rawValuesReported).toBe(false);
  });

  it("returns a preview-only decision for worker.gitPush", () => {
    const result = previewExternalActionGuardDecision({
      routeId: "worker.gitPush",
      actor: "test"
    });

    expect(result.previewOnly).toBe(true);
    expect(result.decision.routeId).toBe("worker.gitPush");
    expect(result.decision.decision).toBe("NOT_APPROVED");
    expect(result.decision.effectMayRun).toBe(false);
    expect(result.decision.productionReady).toBe(false);
    expect(result.decision.execution).toBe("disabled");
    expect(result.decision.rawValuesReported).toBe(false);
  });

  it("returns a preview-only decision for unknown/manual routes", () => {
    const result = previewExternalActionGuardDecision({
      routeId: "unknown.route.preview",
      actor: "test"
    });

    expect(result.previewOnly).toBe(true);
    expect(result.decision.routeId).toBe("unknown.route.preview");
    expect(result.decision.decision).toBe("DESIGN_HOLD");
    expect(result.decision.effectMayRun).toBe(false);
    expect(result.decision.productionReady).toBe(false);
    expect(result.decision.execution).toBe("disabled");
    expect(result.decision.rawValuesReported).toBe(false);
  });

  it("does not enable one-shot execution when humanGoReference is provided", () => {
    const result = previewExternalActionGuardDecision({
      routeId: "discord.send",
      actor: "test",
      humanGoReference: "GO-EXAMPLE",
      requestedRunCount: 1
    });

    expect(result.previewOnly).toBe(true);
    expect(result.decision.decision).toBe("SAFETY_HOLD");
    expect(result.decision.effectMayRun).toBe(false);
    expect(result.decision.reason).toContain("does not enable execution");
  });

  it("previews only the selected A5 route groups", () => {
    const results = previewSelectedExternalActionGuardDecisions("test");
    const decisions = results.map((result) => result.decision);

    expect(results.every((result) => result.previewOnly)).toBe(true);
    expect(decisions.map((decision) => decision.routeId)).toEqual([
      "discord.send",
      "worker.gitPush",
      "unknown.route.preview"
    ]);
    expect(decisions.map((decision) => decision.decision)).toEqual([
      "SAFETY_HOLD",
      "NOT_APPROVED",
      "DESIGN_HOLD"
    ]);
    expect(decisions.every((decision) => decision.effectMayRun === false)).toBe(
      true
    );
  });
});

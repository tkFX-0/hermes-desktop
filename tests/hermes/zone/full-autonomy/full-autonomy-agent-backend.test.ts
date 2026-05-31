import { describe, expect, it } from "vitest";
import {
  isGlobalGrokResearchHold,
  isAgentHermesResearchAllowed,
  resolveAgentReplyRoute
} from "../../../../src/main/shikishima-agent-model-registry";
import { holdHermesResearch } from "../../../../src/main/shikishima-agent-backend-policy";

describe("Agent backend registry — Grok Research HOLD", () => {
  it("global grok research hold is active for May 2026", () => {
    expect(isGlobalGrokResearchHold()).toBe(true);
  });

  it("shirube cannot use x_search while hold active", () => {
    expect(isAgentHermesResearchAllowed("shirube")).toBe(false);
  });

  it("shikishima deep reasoning route is claude (2026-05-29 governance)", () => {
    const route = resolveAgentReplyRoute("shikishima", "complex");
    expect(route.backend).toBe("claude");
    expect(route.model).toContain("claude");
    expect(route.grokResearchHeld).toBe(true);
  });

  it("tsumugi uses worker backends not grok", () => {
    const route = resolveAgentReplyRoute("tsumugi", "complex");
    expect(route.backend).toBe("claude-code-worker");
  });

  it("holdHermesResearch returns held error shape", () => {
    const held = holdHermesResearch("shirube");
    expect(held.success).toBe(false);
    expect(held.held).toBe(true);
    expect(held.error).toContain("grok_research_hold");
  });
});

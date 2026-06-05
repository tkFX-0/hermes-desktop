import { describe, expect, it } from "vitest";
import {
  resolveAgentReasoningRoute,
  normalizeReasoningLevel,
  buildAgentPersonaBlock
} from "../../../../scripts/lib/agent-reasoning-policy.mjs";

describe("agent reasoning policy", () => {
  it("shikishima uses standard + claude route", () => {
    const route = resolveAgentReasoningRoute("shikishima");
    expect(route.reasoningLevel).toBe("standard");
    expect(route.backend).toBe("claude");
    expect(route.model).toContain("claude");
    expect(route.maxTokens).toBeGreaterThanOrEqual(1024);
  });

  it("shizume uses critical + claude", () => {
    const route = resolveAgentReasoningRoute("shizume");
    expect(route.reasoningLevel).toBe("critical");
    expect(route.backend).toBe("claude");
  });

  it("merges persona with reasoning modifier", () => {
    const block = buildAgentPersonaBlock(
      "shikishima",
      "base persona",
      { shikishima: { reasoningModifiers: { deep: "ため口OK" } } },
      "deep"
    );
    expect(block).toContain("base persona");
    expect(block).toContain("ため口OK");
  });

  it("normalizes invalid level to standard", () => {
    expect(normalizeReasoningLevel("invalid")).toBe("standard");
  });
});

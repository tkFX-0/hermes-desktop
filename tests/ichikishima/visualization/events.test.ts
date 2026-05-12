import { describe, expect, expectTypeOf, it } from "vitest";
import {
  createAgentVisualizationEvent,
  type AgentVisualizationEvent,
  type AgentVisualizationPhase,
} from "../../../src/main/ichikishima/visualization/events";

describe("Ichikishima visualization events", () => {
  it("creates a content-free visualization event", () => {
    const event = createAgentVisualizationEvent({
      agent: "ichikishima",
      phase: "Judge",
      status: "candidate",
      riskLevel: "low",
      message: "Shadow Mode judgment candidate",
      metadata: {
        confidence: 0.8,
      },
    });

    expect(event.contentIncluded).toBe(false);
    expect(event.timestamp).toEqual(expect.any(String));
    expect(JSON.stringify(event)).not.toContain("SECRET");
  });

  it("keeps the visualization event contract explicit", () => {
    expectTypeOf<AgentVisualizationPhase>().toEqualTypeOf<
      | "Observe"
      | "Recall"
      | "Judge"
      | "Silent"
      | "SpeakCandidate"
      | "ApprovalReview"
      | "Blocked"
    >();
    expectTypeOf<AgentVisualizationEvent>().toMatchTypeOf<{
      agent: "hermes" | "ichikishima";
      contentIncluded: false;
      timestamp: string;
    }>();
  });
});

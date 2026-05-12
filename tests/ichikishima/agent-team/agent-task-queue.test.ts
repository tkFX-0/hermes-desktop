import { describe, expect, it } from "vitest";

import { enqueueAgentTaskStub } from "../../../src/main/ichikishima/agent-team/agent-task-queue";

describe("agent-task-queue", () => {
  it("enqueue returns ephemeral stub — no dispatch flag", async () => {
    const t = enqueueAgentTaskStub("smoke");
    expect(t.dispatched).toBe(false);
    expect(t.taskId.includes("dry_run_stub_")).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { runDevPipeline, formatDevTraceLine } from "../../../scripts/lib/wsl-dev-runner.mjs";

describe("dev pipeline zone smoke", () => {
  it("returns disabled result when pipeline is off, without touching WSL or env", async () => {
    const result = await runDevPipeline(
      { prompt: "smoke test", agentId: "tsumugi" },
      {} // empty env → enabled=false, short-circuits before any WSL call
    );
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("dev_pipeline_disabled");
    expect(result.lane).toBe("開発");
    expect(formatDevTraceLine(result)).toMatch(/失敗/);
  });
});

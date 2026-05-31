import { beforeEach, describe, expect, it, vi } from "vitest";

const wslBashMock = vi.fn();

vi.mock("../../../scripts/lib/dev-pipeline-router.mjs", () => ({
  resolveDevPipelineConfig: () => ({
    enabled: true,
    hermesModel: "test-hermes-model",
    hermesProvider: "test-provider",
    claudeModel: "test-claude-model",
    wslDistro: "Ubuntu"
  }),
  resolveDevBackendChain: () => [
    { id: "composer", via: "hermes-brain" },
    { id: "claude", via: "wsl-claude-cli" }
  ]
}));

vi.mock("../../../scripts/lib/wsl-exec.mjs", () => ({
  wslBash: wslBashMock
}));

describe("dev pipeline composer fallback", () => {
  beforeEach(() => {
    wslBashMock.mockReset();
  });

  it("tries the next chain step when composer fails", async () => {
    wslBashMock
      .mockResolvedValueOnce({ ok: false, stdout: "", stderr: "composer failed" })
      .mockResolvedValueOnce({ ok: true, stdout: "claude fallback ok", stderr: "" });

    const { runDevPipeline } = await import("../../../scripts/lib/wsl-dev-runner.mjs");
    const result = await runDevPipeline({ prompt: "fallback smoke", agentId: "tsumugi" }, {});

    expect(wslBashMock).toHaveBeenCalledTimes(2);
    expect(result.ok).toBe(true);
    expect(result.backend).toBe("claude-cli");
    expect(result.text).toBe("claude fallback ok");
    expect(result.attempts).toHaveLength(2);
    expect(result.attempts[0]).toMatchObject({ ok: false, backend: "hermes-brain" });
    expect(result.attempts[1]).toMatchObject({ ok: true, backend: "claude-cli" });
  });
});

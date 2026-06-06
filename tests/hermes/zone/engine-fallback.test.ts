import { describe, expect, it } from "vitest";

import { isErrorOutput } from "../../../scripts/lib/claude-cli-sanitize.mjs";
import {
  fallbackEnginesFor,
  FRIENDLY_ENGINE_UNAVAILABLE_TEXT,
  isEngineCapacityError,
  shouldRetryEngineFailure,
} from "../../../scripts/lib/engine-fallback.mjs";

describe("engine fallback policy", () => {
  it("routes Claude capacity failures to Codex then Composer", () => {
    expect(fallbackEnginesFor("claude")).toEqual(["codex", "composer"]);
  });

  it("routes Codex capacity failures to Composer", () => {
    expect(fallbackEnginesFor("codex")).toEqual(["composer"]);
  });

  it("does not expose raw session/rate limit text as normal output", () => {
    expect(isEngineCapacityError("You've hit your session limit · resets 1:20am")).toBe(true);
    expect(isEngineCapacityError("rate limit exceeded")).toBe(true);
    expect(isErrorOutput("You've hit your session limit · resets 1:20am")).toBe(true);
    expect(FRIENDLY_ENGINE_UNAVAILABLE_TEXT).toContain("現在応答できません");
  });

  it("retries only temporary non-capacity failures", () => {
    expect(shouldRetryEngineFailure({ ok: false, text: "failed to connect to websocket" })).toBe(true);
    expect(shouldRetryEngineFailure({ ok: false, text: "codex timeout" })).toBe(true);
    expect(shouldRetryEngineFailure({ ok: false, text: "rate limit exceeded" })).toBe(false);
    expect(shouldRetryEngineFailure({ ok: false, text: "unsupported model" })).toBe(false);
    expect(shouldRetryEngineFailure({ ok: true, text: "ok" })).toBe(false);
  });
});

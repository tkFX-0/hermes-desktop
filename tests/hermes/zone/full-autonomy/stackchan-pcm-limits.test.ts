import { describe, expect, it } from "vitest";
import {
  PCM_SAFE_MAX_CHARS,
  splitTextForPcmLimit,
} from "../../../../scripts/shikishima-stackchan.mjs";

describe("stackchan PCM firmware limits", () => {
  it("exports conservative char cap", () => {
    expect(PCM_SAFE_MAX_CHARS).toBeLessThanOrEqual(72);
    expect(PCM_SAFE_MAX_CHARS).toBeGreaterThan(40);
  });

  it("splits long text without dropping characters", () => {
    const long = "これは長い返答です。".repeat(12);
    const parts = splitTextForPcmLimit(long);
    expect(parts.length).toBeGreaterThan(1);
    for (const p of parts) {
      expect(p.length).toBeLessThanOrEqual(PCM_SAFE_MAX_CHARS);
    }
    expect(parts.join("")).toBe(long.replace(/\s+/g, " ").trim());
  });

  it("keeps short greeting in one part", () => {
    const parts = splitTextForPcmLimit("こんにちは！しきしまだよ。何か用？");
    expect(parts).toEqual(["こんにちは！しきしまだよ。何か用？"]);
  });
});

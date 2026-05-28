import { describe, expect, it } from "vitest";
import { getEffectiveInvariantTargets } from "../../../../src/main/shikishima-full-autonomy/autonomy-invariants";
import { resolveOperationalRelease } from "../../../../src/main/shikishima-full-autonomy/operational-release-state";

describe("operational release state", () => {
  it("activates from local file when present (non-test runtime)", () => {
    const prev = process.env.VITEST;
    delete process.env.VITEST;
    const release = resolveOperationalRelease();
    const targets = getEffectiveInvariantTargets();
    process.env.VITEST = prev;
    if (!release.activated) {
      expect(release.executionEnabled).toBe(false);
      return;
    }
    expect(release.productionReady).toBe(true);
    expect(release.executionEnabled).toBe(true);
    expect(targets.productionReady).toBe(true);
    expect(targets.executionEnabled).toBe(true);
  });

  it("stays inactive under vitest by default", () => {
    const release = resolveOperationalRelease();
    expect(release.activated).toBe(false);
  });
});

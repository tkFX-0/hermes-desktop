import { describe, expect, it, afterEach } from "vitest";
import { evaluateStackchanFacadeGuard } from "../../../../scripts/lib/stackchan-guarded-facade.mjs";

describe("stackchan-guarded-facade", () => {
  const prev = { ...process.env };

  afterEach(() => {
    process.env = { ...prev };
  });

  it("blocks say when hold", () => {
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "1";
    expect(evaluateStackchanFacadeGuard("say")).toBe("stackchan_hold");
  });

  it("allows face policy when not hold", () => {
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "0";
    process.env.STACKCHAN_DISCORD_VOICE = "1";
    expect(evaluateStackchanFacadeGuard("face")).toBeNull();
  });
});

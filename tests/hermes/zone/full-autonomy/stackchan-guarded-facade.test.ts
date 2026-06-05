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

  it("keeps face policy blocked unless StackChan is explicitly unsealed", () => {
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "0";
    process.env.STACKCHAN_DISCORD_VOICE = "1";
    delete process.env.SHIKISHIMA_STACKCHAN_UNSEAL;
    expect(evaluateStackchanFacadeGuard("face")).toBe("stackchan_hold");
  });

  it("allows face policy only after explicit unseal and hold off", () => {
    process.env.SHIKISHIMA_STACKCHAN_UNSEAL = "1";
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "0";
    process.env.STACKCHAN_DISCORD_VOICE = "1";
    expect(evaluateStackchanFacadeGuard("face")).toBeNull();
  });
});

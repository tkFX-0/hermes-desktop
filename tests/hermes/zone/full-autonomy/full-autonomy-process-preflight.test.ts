import { describe, expect, it } from "vitest";

/**
 * Mirrors `report.ok` in scripts/shikishima-process-preflight.mjs (SHI-004 duplicate guard).
 */
function sidebotPreflightOk(report: {
  duplicateBots: boolean;
  botCount: number;
  pidFiles: { bot: { alive: boolean } };
}) {
  return (
    !report.duplicateBots &&
    report.botCount <= 1 &&
    !(report.pidFiles.bot.alive && report.botCount === 0)
  );
}

describe("SideBot process preflight (SHI-004)", () => {
  it("ok when single bot and no stale pid-only ghost", () => {
    expect(
      sidebotPreflightOk({
        duplicateBots: false,
        botCount: 1,
        pidFiles: { bot: { alive: true } }
      })
    ).toBe(true);
  });

  it("not ok when duplicate bots", () => {
    expect(
      sidebotPreflightOk({
        duplicateBots: true,
        botCount: 2,
        pidFiles: { bot: { alive: true } }
      })
    ).toBe(false);
  });

  it("not ok when pid file alive but zero scanned bots", () => {
    expect(
      sidebotPreflightOk({
        duplicateBots: false,
        botCount: 0,
        pidFiles: { bot: { alive: true } }
      })
    ).toBe(false);
  });
});

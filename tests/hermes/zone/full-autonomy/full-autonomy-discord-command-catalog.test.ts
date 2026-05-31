import { describe, expect, it } from "vitest";
import {
  buildDiscordCommandPinMessage,
  buildDiscordQuickStatusMessage,
  DISCORD_COMMAND_SECTIONS
} from "../../../../scripts/lib/discord-command-catalog.mjs";

describe("discord command catalog", () => {
  it("has sections for pin doc", () => {
    expect(DISCORD_COMMAND_SECTIONS.length).toBeGreaterThan(3);
    const ids = DISCORD_COMMAND_SECTIONS.flatMap((s) => s.rows.map((r) => r.id));
    expect(ids).toContain("kaihatu");
    expect(ids).toContain("room");
  });

  it("pin message fits discord limit", () => {
    const msg = buildDiscordCommandPinMessage();
    expect(msg.length).toBeLessThanOrEqual(2000);
    expect(msg).toMatch(/!help/);
  });

  it("quick status mentions HOLD", () => {
    const s = buildDiscordQuickStatusMessage({ pid: 1, botUserId: "123", threadMemory: true });
    expect(s).toMatch(/HOLD/);
  });
});

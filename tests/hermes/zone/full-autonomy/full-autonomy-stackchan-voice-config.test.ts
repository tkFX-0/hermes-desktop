import { describe, expect, it, afterEach } from "vitest";
import {
  resolveStackchanDiscordVoiceConfig,
  isStackchanVoiceHold,
  isLegacyDiscordVoiceEnabled,
  isGuardedDiscordVoiceBridgeEnvEnabled,
  formatStackchanDiscordVoiceStatusLine
} from "../../../../scripts/lib/stackchan-voice-config.mjs";

describe("stackchan voice config", () => {
  const prev = { ...process.env };

  afterEach(() => {
    process.env = { ...prev };
  });

  it("hold disables legacy discord voice", () => {
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "1";
    process.env.STACKCHAN_DISCORD_VOICE = "1";
    expect(isLegacyDiscordVoiceEnabled()).toBe(false);
    expect(resolveStackchanDiscordVoiceConfig().primaryRoute).toBe("hold");
  });

  it("legacy on when hold off and discord voice default", () => {
    delete process.env.SHIKISHIMA_STACKCHAN_HOLD;
    delete process.env.STACKCHAN_DISCORD_VOICE;
    expect(isLegacyDiscordVoiceEnabled()).toBe(true);
  });

  it("guarded bridge env separate from legacy", () => {
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "0";
    process.env.STACKCHAN_DISCORD_VOICE = "0";
    process.env.SHIKISHIMA_DISCORD_VOICE_BRIDGE = "1";
    const c = resolveStackchanDiscordVoiceConfig();
    expect(c.legacyDiscordEnabled).toBe(false);
    expect(c.guardedBridgeEnvEnabled).toBe(true);
    expect(c.primaryRoute).toBe("guarded_bridge_only");
  });

  it("status line includes route", () => {
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "0";
    process.env.STACKCHAN_DISCORD_VOICE = "1";
    expect(formatStackchanDiscordVoiceStatusLine()).toMatch(/route=legacy_voicovox/);
  });
});

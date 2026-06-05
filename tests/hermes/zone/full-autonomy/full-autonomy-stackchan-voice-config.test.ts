import { describe, expect, it, afterEach } from "vitest";
import {
  resolveStackchanDiscordVoiceConfig,
  isStackchanVoiceHold,
  isLegacyDiscordVoiceEnabled,
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

  it("voice is HOLD by default until explicit unseal", () => {
    delete process.env.SHIKISHIMA_STACKCHAN_HOLD;
    delete process.env.SHIKISHIMA_STACKCHAN_UNSEAL;
    delete process.env.STACKCHAN_DISCORD_VOICE;
    expect(isStackchanVoiceHold()).toBe(true);
    expect(isLegacyDiscordVoiceEnabled()).toBe(false);
    expect(resolveStackchanDiscordVoiceConfig().primaryRoute).toBe("hold");
  });

  it("guarded bridge env remains blocked while sealed", () => {
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "0";
    delete process.env.SHIKISHIMA_STACKCHAN_UNSEAL;
    process.env.STACKCHAN_DISCORD_VOICE = "0";
    process.env.SHIKISHIMA_DISCORD_VOICE_BRIDGE = "1";
    const c = resolveStackchanDiscordVoiceConfig();
    expect(c.legacyDiscordEnabled).toBe(false);
    expect(c.guardedBridgeEnvEnabled).toBe(true);
    expect(c.primaryRoute).toBe("hold");
  });

  it("explicit unseal is required before legacy voice can become route", () => {
    process.env.SHIKISHIMA_STACKCHAN_UNSEAL = "1";
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "0";
    process.env.STACKCHAN_DISCORD_VOICE = "1";
    expect(isStackchanVoiceHold()).toBe(false);
    expect(isLegacyDiscordVoiceEnabled()).toBe(true);
    expect(formatStackchanDiscordVoiceStatusLine()).toMatch(/route=legacy_voicovox/);
  });
});

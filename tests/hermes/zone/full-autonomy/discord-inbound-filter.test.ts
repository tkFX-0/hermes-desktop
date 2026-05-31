import { describe, it, expect } from "vitest";

describe("discord-inbound-filter.mjs", () => {
  it("detects bot outbound echo", async () => {
    const mod = await import("../../../../scripts/lib/discord-inbound-filter.mjs");
    expect(mod.isBotOutboundEcho("📋 人間GO 一括確認リスト")).toBe(true);
    expect(mod.isBotOutboundEcho("Warning: no stdin data received")).toBe(true);
    expect(mod.isBotOutboundEcho("ちはやのステータス\n現在状態 : HOLD")).toBe(true);
    expect(mod.isBotOutboundEcho("!human-go")).toBe(false);
  });

  it("user ops slash is not echo", async () => {
    const mod = await import("../../../../scripts/lib/discord-inbound-filter.mjs");
    expect(mod.matchOpsCommand("!chihaya-status")).toBeNull();
    expect(mod.isUserOpsSlashCommand("Human GO — 現在")).toBe(false);
  });

  it("strips leading mention from ops command", async () => {
    const mod = await import("../../../../scripts/lib/discord-inbound-filter.mjs");
    expect(mod.matchOpsCommand("<@123456789> !human-go")).toBe("!human-go");
    expect(mod.isUserOpsSlashCommand("<@123> !governance")).toBe(true);
  });

  it("normalizes fullwidth at-sign; EA dev text is not chihaya-directed", async () => {
    const mod = await import("../../../../scripts/lib/discord-inbound-filter.mjs");
    expect(mod.normalizeDiscordUserContent("＠しきしま　Groqテスト")).toBe("@しきしま Groqテスト");
    expect(mod.isChihayaDirectedMessage("＠しきしま　EA研究をしてください")).toBe(false);
  });

  it("!sc bypasses ops early trap for later StackChan handler", async () => {
    const mod = await import("../../../../scripts/lib/discord-inbound-filter.mjs");
    expect(mod.isUserOpsSlashCommand("!sc say テスト")).toBe(true);
    expect(mod.isLaterHandledSlashCommand("!sc say テスト")).toBe(true);
    expect(mod.isLaterHandledSlashCommand("!human-go")).toBe(false);
  });
});

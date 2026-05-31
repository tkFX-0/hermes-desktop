import { describe, expect, it } from "vitest";
import {
  detectSequentialHumanCheck,
  buildLocalHumanCheckReply,
  isBotGeneratedHumanCheckMessage,
  AGENT_SEQUENCE
} from "../../../../scripts/lib/agent-sequential-human-check.mjs";
import { sanitizeDiscordText, safeDiscordContent } from "../../../../scripts/lib/discord-text-safe.mjs";

describe("Discord sequential human check", () => {
  it("detects sequential test phrases", () => {
    expect(detectSequentialHumanCheck("!agent-test")).toBe(true);
    expect(detectSequentialHumanCheck("順番での回答")).toBe(true);
    expect(detectSequentialHumanCheck("こんにちは")).toBe(false);
  });

  it("does not re-trigger on bot own sequential replies", () => {
    const botIntro = "全エージェント順番応答を開始します（5件）。";
    expect(isBotGeneratedHumanCheckMessage(botIntro)).toBe(true);
    expect(detectSequentialHumanCheck(botIntro)).toBe(false);
    expect(detectSequentialHumanCheck("起動テスト (1/5)\n経路: local-human-check")).toBe(false);
  });

  it("builds local reply without API marker", () => {
    const text = buildLocalHumanCheckReply("shizume", 2, 5, {
      shizume: { label: "🛡️ **しずめ**" }
    });
    expect(text).toContain("local-human-check");
    expect(text).toContain("API課金なし");
    expect(text).toContain("(2/5)");
  });

  it("has five canonical agents in order", () => {
    expect(AGENT_SEQUENCE.length).toBe(5);
  });

  it("repairs common mojibake", () => {
    expect(sanitizeDiscordText("各エージント")).toBe("各エージェント");
  });

  it("safeDiscordContent does not split emoji", () => {
    const s = "🏯".repeat(5);
    expect(safeDiscordContent(s, 3)).toBe("🏯🏯🏯");
  });
});

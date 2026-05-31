import { describe, expect, it } from "vitest";
import {
  parseDevSlashCommand,
  validateKaihatuGate
} from "../../../../scripts/lib/discord-dev-commands.mjs";
import {
  buildPortfolioDialoguePack,
  isPortfolioDialogueBridgeEnabled
} from "../../../../scripts/lib/portfolio-dialogue-bridge.mjs";

describe("discord dev commands (!kaihatu)", () => {
  it("parses kaihatu, kaihatu-test, and kaihatuslot", () => {
    expect(parseDevSlashCommand("!kaihatu-test")).toEqual({
      type: "kaihatu-test",
      instruction: "自動レビュー動作確認"
    });
    expect(parseDevSlashCommand("!kaihatu テスト実装"))?.toEqual({
      type: "kaihatu",
      instruction: "テスト実装"
    });
    expect(parseDevSlashCommand("!kaihatuslot スロット自律テスト"))?.toEqual({
      type: "kaihatuslot",
      instruction: "スロット自律テスト"
    });
    expect(parseDevSlashCommand("!kaihatu")).toBeNull();
  });

  it("validates dev pipeline gate", () => {
    const bad = validateKaihatuGate({ SHIKISHIMA_DEV_PIPELINE_ENABLED: "0" });
    expect(bad.ok).toBe(false);
    const good = validateKaihatuGate({
      SHIKISHIMA_DEV_PIPELINE_ENABLED: "1",
      SHIKISHIMA_BILLING_MODE: "subscription_only",
      SHIKISHIMA_ALLOW_PAID_API: "0"
    });
    expect(good.ok).toBe(true);
  });
});

describe("portfolio dialogue bridge", () => {
  it("respects G flag", () => {
    expect(isPortfolioDialogueBridgeEnabled(() => "0")).toBe(false);
    expect(isPortfolioDialogueBridgeEnabled(() => "1")).toBe(true);
  });

  it("builds handoff pack", () => {
    const pack = buildPortfolioDialoguePack("ポートフォリオ成果 v1");
    expect(pack.length).toBeGreaterThan(1);
    expect(pack.join("\n")).toMatch(/ポートフォリオ|portfolio-dialogue/);
  });
});

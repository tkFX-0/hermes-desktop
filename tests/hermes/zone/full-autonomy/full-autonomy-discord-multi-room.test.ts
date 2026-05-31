import { describe, expect, it } from "vitest";
import { resolveChannelRole, readDiscordChannelEnv } from "../../../../scripts/lib/discord-channel-config.mjs";
import {
  buildOperatorNotifyContent,
  isAllowlistedOperatorNotifyPhrase
} from "../../../../scripts/lib/discord-human-approval-notify.mjs";
import {
  buildDialogueLines,
  buildPortfolioTestPost,
  runMultiRoomDiscordTest
} from "../../../../scripts/lib/discord-multi-room.mjs";

describe("discord multi-room (Phase C)", () => {
  it("resolves channel roles", () => {
    const cfg = {
      commandChannelId: "1",
      portfolioChannelId: "2",
      dialogueChannelId: "3",
      token: "x",
      operatorUserId: "",
      multiRoomG: true
    };
    expect(resolveChannelRole("2", cfg)).toBe("portfolio");
    expect(resolveChannelRole("3", cfg)).toBe("dialogue");
  });

  it("allowlists operator notify phrase only", () => {
    expect(isAllowlistedOperatorNotifyPhrase("確認しました。")).toBe(true);
    expect(isAllowlistedOperatorNotifyPhrase("送金します")).toBe(false);
    const n = buildOperatorNotifyContent("999", "確認しました。");
    expect(n.ok).toBe(true);
    expect(n.content).toBe("<@999> 確認しました。");
  });

  it("builds portfolio and five-agent dialogue without API markers", () => {
    const p = buildPortfolioTestPost("test");
    expect(p).toContain("ポートフォリオ");
    const lines = buildDialogueLines(p);
    expect(lines.length).toBe(6); // 5 agents + shizume closing line
    expect(lines.join("\n")).toContain("local-dialogue");
    expect(lines.join("\n")).not.toMatch(/sk-[a-z0-9]/i);
  });

  it("runMultiRoomDiscordTest respects G gate", async () => {
    const posts: string[] = [];
    const r = await runMultiRoomDiscordTest(
      {
        postMessage: async (_c, body) => {
          posts.push(body);
          return { ok: true, id: "m1" };
        }
      },
      {
        DISCORD_BOT_TOKEN: "t",
        DISCORD_PORTFOLIO_CHANNEL_ID: "p",
        DISCORD_DIALOGUE_CHANNEL_ID: "d",
        SHIKISHIMA_DISCORD_MULTI_ROOM_G: "0"
      }
    );
    expect(r.ok).toBe(false);
    expect(posts.length).toBe(0);
  });
});
